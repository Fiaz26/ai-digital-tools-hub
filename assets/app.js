
// ======================================
// AI DIGITAL TOOLS HUB - PRODUCTION JS
// ======================================

const API_URL = "https://fiaz75-ai-digital-tools-hub-api.hf.space";

// ======================================
// UTILITY FUNCTIONS
// ======================================

function $(id) {
  return document.getElementById(id);
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
} 
}
async function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();

  if (data.token) {

    // 🔥 STORE TOKEN (CRITICAL)
    localStorage.setItem("token", data.token);

    alert("Login successful");

    window.location.href = "dashboard.html";
  } else {
    alert(data.error || "Login failed");
  }
}
async function register() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API_URL + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();

  alert(data.message || data.error);
}
async function runTool(tool) {

  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  output.innerHTML = "Generating...";

  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + "/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      tool,
      prompt
    })
  });

  const data = await res.json();

  if (data.result) {
    output.innerHTML = data.result;
  } else {
    output.innerHTML = data.error || "Error generating result";
  }

  if (data.credits_left !== undefined) {
    document.getElementById("credits").innerText = data.credits_left;
  }
}
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}


// ======================================
// AUTH - LOGIN
// ======================================

