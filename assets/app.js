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

function requireLogin() {
  if (!getToken()) {
    window.location.href = "index.html";
  }
}

// ======================================
// AUTH - LOGIN
// ======================================

async function login() {

  const email = $("email")?.value.trim();
  const password = $("password")?.value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {

    const res = await fetch(API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      saveToken(data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.error || "Login failed");
    }

  } catch (err) {
    alert("Server error");
  }
}

// ======================================
// AUTH - REGISTER
// ======================================

async function register() {

  const email = $("email")?.value.trim();
  const password = $("password")?.value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {

    const res = await fetch(API_URL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    alert(data.message || "Registered successfully");

  } catch (err) {
    alert("Registration failed");
  }
}

// ======================================
// AI TOOL ENGINE (CORE FIXED SYSTEM)
// ======================================

async function runTool(tool) {

  const prompt = $("promptInput")?.value || "";
  const outputBox = $("output");

  if (outputBox) {
    outputBox.innerText = "Generating AI response...";
  }

  try {

    const token = getToken();

    const res = await fetch(API_URL + "/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        tool: tool,
        prompt: prompt
      })
    });

    const data = await res.json();

    if (data.result) {
      outputBox.innerText = data.result;
    } else {
      outputBox.innerText = data.error || "No response from AI";
    }

    // update credits
    if (data.credits_left !== undefined) {
      const c = $("credits");
      if (c) c.innerText = data.credits_left;
    }

  } catch (err) {
    outputBox.innerText =
      "Backend connection failed.\nCheck API or login token.";
  }
}

// ======================================
// PAYMENT REQUEST
// ======================================

async function requestUpgrade(plan) {

  try {

    const res = await fetch(API_URL + "/request-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
      },
      body: JSON.stringify({
        plan: plan,
        amount: plan === "pro" ? 9 : 29,
        method: "JazzCash"
      })
    });

    const data = await res.json();

    alert(data.message || "Payment request sent");

  } catch (err) {
    alert("Payment system error");
  }
}

// ======================================
// ADMIN - USERS
// ======================================

async function loadUsers() {

  const box = $("users");
  if (!box) return;

  try {

    const res = await fetch(API_URL + "/admin/users");
    const data = await res.json();

    box.innerHTML = data.map(u => `
      <div style="padding:10px;border-bottom:1px solid #1e293b">
        ${u.email} | Credits: ${u.credits} | Plan: ${u.plan}
      </div>
    `).join("");

  } catch (err) {
    box.innerHTML = "Failed to load users";
  }
}

// ======================================
// ADMIN - PAYMENTS
// ======================================

async function loadPayments() {

  const box = $("payments");
  if (!box) return;

  try {

    const res = await fetch(API_URL + "/admin/payments");
    const data = await res.json();

    box.innerHTML = data.map(p => `
      <div style="padding:10px;border-bottom:1px solid #1e293b">
        User #${p.user_id} | ${p.plan} | $${p.amount} | ${p.status}
      </div>
    `).join("");

  } catch (err) {
    box.innerHTML = "Failed to load payments";
  }
}

// ======================================
// AUTO INIT
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  if ($("users")) loadUsers();
  if ($("payments")) loadPayments();

});
