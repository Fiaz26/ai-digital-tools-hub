// File Name: assets/app.js

const API_URL = "https://fiaz75-ai-digital-tools-hub-api.hf.space";

// ===============================
// GLOBAL HELPERS
// ===============================

function $(id){
return document.getElementById(id);
}

function setText(id,text){
const el = $(id);
if(el) el.innerText = text;
}

function setHTML(id,html){
const el = $(id);
if(el) el.innerHTML = html;
}

// ===============================
// AUTH SYSTEM
// ===============================

function saveToken(token){
localStorage.setItem("token", token);
}

function getToken(){
return localStorage.getItem("token");
}

function logout(){
localStorage.removeItem("token");
window.location.href = "index.html";
}

function requireLogin(){
const token = getToken();

if(!token){
window.location.href = "index.html";
}
}

// ===============================
// LOGIN API
// ===============================

async function login(){

const email = $("email")?.value.trim();
const password = $("password")?.value.trim();

if(!email || !password){
alert("Enter email and password");
return;
}

try{

const res = await fetch(API_URL + "/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:email,
password:password
})
});

const data = await res.json();

if(data.token){
saveToken(data.token);
window.location.href = "dashboard.html";
}else{
alert(data.error || "Login failed");
}

}catch(err){
alert("Server unavailable");
}

}

// ===============================
// REGISTER API
// ===============================

async function register(){

const email = $("email")?.value.trim();
const password = $("password")?.value.trim();

if(!email || !password){
alert("Enter email and password");
return;
}

try{

const res = await fetch(API_URL + "/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:email,
password:password
})
});

const data = await res.json();

alert(data.message || "Registered successfully");

}catch(err){
alert("Registration failed");
}

}

// ===============================
// TOOL ENGINE
// ===============================

async function runTool(){

const tool = $("tool")?.value;
const prompt = $("prompt")?.value.trim();
const output = $("output");

if(!prompt){
setHTML("output","Please enter a prompt first.");
return;
}

if(output){
output.innerHTML = "Generating result...";
}

try{

const token = getToken();

const res = await fetch(API_URL + "/generate",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + token
},
body:JSON.stringify({
tool:tool,
prompt:prompt
})
});

const data = await res.json();

if(data.result){
setHTML("output", data.result);
}

if(data.credits_left !== undefined){
setText("credits", data.credits_left);
}

if(data.error){
setHTML("output", data.error);
}

}catch(err){

setHTML(
"output",
"Demo Mode Result:\n\nTool: " + tool +
"\n\nPrompt: " + prompt +
"\n\nConnect backend API for live output."
);

let current = parseInt($("credits")?.innerText || "20");
current = Math.max(current - 1, 0);
setText("credits", current);

}

}

// ===============================
// PAYMENT REQUEST
// ===============================

async function requestUpgrade(plan){

try{

const token = getToken();

const res = await fetch(API_URL + "/request-payment",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + token
},
body:JSON.stringify({
amount: plan === "pro" ? 9 : 29,
method:"JazzCash"
})
});

const data = await res.json();

alert(data.message || "Payment request sent");

}catch(err){
alert("Payment system unavailable");
}

}

// ===============================
// ADMIN LOAD USERS
// ===============================

async function loadUsers(){

const usersBox = $("users");

if(!usersBox) return;

try{

const res = await fetch(API_URL + "/admin/users");
const data = await res.json();

usersBox.innerHTML = data.map(user => `
<div style="padding:10px;border-bottom:1px solid #1e293b">
${user.email} | Credits: ${user.credits}
</div>
`).join("");

}catch(err){

usersBox.innerHTML = "Unable to load users.";

}

}

// ===============================
// ADMIN LOAD PAYMENTS
// ===============================

async function loadPayments(){

const box = $("payments");

if(!box) return;

try{

const res = await fetch(API_URL + "/admin/payments");
const data = await res.json();

box.innerHTML = data.map(pay => `
<div style="padding:10px;border-bottom:1px solid #1e293b">
User #${pay.user_id} | $${pay.amount} | ${pay.method} | ${pay.status}
</div>
`).join("");

}catch(err){

box.innerHTML = "Unable to load payments.";

}

}

// ===============================
// AUTO INIT
// ===============================

document.addEventListener("DOMContentLoaded",function(){

if($("users")) loadUsers();
if($("payments")) loadPayments();

});
