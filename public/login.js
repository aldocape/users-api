const btnLogin = document.getElementById("loginButton");
btnLogin.addEventListener("click", () => login());

// const btnLogout = document.getElementById("logoutButton");
// btnLogout.addEventListener("click", () => logout());

const formLogin = document.getElementById("login-form");
const inputUserName = document.getElementById("user_name");
const inputPassword = document.getElementById("password");

function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

function updateLoginStatus() {
  if (isLoggedIn()) {
    formLogin.classList.add("is-hidden");
    // if (btnLogout) {
    //   btnLogout.classList.remove("is-hidden");
    // }
  } else {
    formLogin.classList.remove("is-hidden");
    // if (btnLogout) {
    //   btnLogout.classList.add("is-hidden");
    // }
  }
}

async function login() {
  const name = inputUserName.value;
  const password = inputPassword.value;

  const response = await api("/login", "post", { name, password });

  if (response.status === "error") {
    alert(response.error);
  } else {
    localStorage.setItem("token", response.accessToken);
    localStorage.setItem("user_id", response.id);
    // Usuario logueado
    contentUser.style.display = ""; // Muestro nuevamente el contenedor que oculté en initApp
    showUser(); // Llamo a showUser() para que appendee el template dentro de contentUser

    loadUsers();
    updateLoginStatus();
  }
}

function logout() {
  localStorage.clear();
  location.reload();
}

updateLoginStatus();
