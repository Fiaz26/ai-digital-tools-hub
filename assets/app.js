const API_URL = "YOUR_BACKEND_URL";

// ================= LOGIN =================
async function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API_URL + "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(data.error);
  }
}

// ================= GENERATE =================
async function runTool(tool) {

  const prompt = document.getElementById("prompt").value;
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + "/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ tool, prompt })
  });

  const data = await res.json();

  document.getElementById("output").innerText =
    data.result || data.error;

  if (data.credits_left !== undefined) {
    document.getElementById("credits").innerText =
      data.credits_left;
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
