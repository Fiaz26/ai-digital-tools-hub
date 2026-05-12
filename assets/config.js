/* ==============================
AI DIGITAL TOOLS HUB
CONFIG FILE (PRODUCTION SAFE)
============================== */

const CONFIG = {
  
  // 🔥 Hugging Face Backend URL
  API_BASE: "https://fiaz75-ai-digital-tools-hub-api.hf.space",

  // 🔐 Endpoints
  ENDPOINTS: {
    LOGIN: "/login",
    REGISTER: "/register",
    GENERATE: "/generate",
    USERS: "/admin/users",
    PAYMENTS: "/admin/payments",
    ADD_CREDITS: "/admin/add-credits"
  },

  // ⚙️ App Settings
  APP_NAME: "AI Digital Tools Hub",
  VERSION: "1.0.0",

  // 💳 Default credits for new users
  DEFAULT_CREDITS: 20
};

// ==============================
// API HELPER (CLEAN CALL SYSTEM)
// ==============================

async function apiCall(endpoint, method = "GET", data = null, token = null) {
  
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const options = {
    method,
    headers
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(CONFIG.API_BASE + endpoint, options);

  return await response.json();
}

// ==============================
// TOKEN HELPERS
// ==============================

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

// ==============================
// ROUTE GUARD (FIX BROKEN PAGES)
// ==============================

function protectPage() {
  const token = getToken();

  if (!token) {
    window.location.href = "login.html";
  }
}
