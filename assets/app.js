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

