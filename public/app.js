// Referencia al div contenedor
const contentTable = document.getElementById("contentTable");
// Tomo el template y su contenido
const row = document.getElementById("contentRow").content;

const contentUser = document.getElementById("contentUser");
const userRow = document.getElementById("contentUserRow").content;

const panelUsuarios = document.getElementById("panel_usuarios");

const inputName = document.getElementById("userName");
const inputAge = document.getElementById("userAge");

const usrname = document.getElementById("usrname");
const passwrd = document.getElementById("passwrd");

const inputNameUpd = document.getElementById("userNameUpd");
const inputAgeUpd = document.getElementById("userAgeUpd");

const inputNameHelp = document.getElementById("inputNameHelp");
const inputNameAge = document.getElementById("inputNameAge");

const inputNameUpdHelp = document.getElementById("inputNameUpdHelp");
const inputNameUpdAge = document.getElementById("inputNameUpdAge");

const createUserFormContent = document.getElementById("form-create");
const createUserForm = document.getElementById("createUserForm");

const updateUserFormContent = document.getElementById("form-update");
const updateUserForm = document.getElementById("updateUserForm");

const btnCreate = document.getElementById("createButton");
btnCreate.addEventListener("click", () => createUser());

let editingUserId = null;

function addRow(name, age, username, userId) {
  // Clono el template en una nueva variable
  const nodoli = row.cloneNode(true);

  nodoli.querySelector(".txtName").innerText = name;
  nodoli.querySelector(".nmbAge").innerText = age;
  nodoli.querySelector(".txtUsername").innerText = username;
  nodoli
    .querySelector(".btnDelete")
    .addEventListener("click", () => deleteUser(userId));
  nodoli
    .querySelector(".btnUpdate")
    .addEventListener("click", () => updateUser(userId));
  nodoli.querySelector(".row").dataset.id = userId;

  // Inserto la nueva fila en la tabla
  contentTable.appendChild(nodoli);
}

/**
 * Buscar usuario por id e insertar sus datos en el template, luego appendear al contenedor html
 */
async function searchUser(id) {
  const user = await api(`/users/${id}`, "get");

  // Clono el template en una nueva variable
  const userBlock = userRow.cloneNode(true);
  userBlock.querySelector(".usrInfo").innerText = `Bienvenido ${user.name}`;
  userBlock
    .querySelector("#logoutButton")
    .addEventListener("click", () => logout());

  // Inserto userBlock con la nueva info, en su contenedor
  contentUser.appendChild(userBlock);
}

function showUser() {
  const userId = localStorage.getItem("user_id");

  searchUser(userId);
}

/**
 * Crear usuario
 */
async function createUser() {
  //   event.preventDefault();
  //   event.stopPropagation();
  const name = inputName.value;
  const age = inputAge.value;
  const username = usrname.value;
  const password = passwrd.value;
  resetFormErrors(inputName, inputNameHelp, inputAge, inputAgeHelp);

  const response = await api("/users", "post", {
    name,
    age,
    username,
    password,
  });

  if (response.error) {
    showFormErrors(response.error, "create");
  } else {
    // resetFormErrors();
    createUserForm.reset();
    loadUsers();
  }
}

/**
 * Editar usuario
 */
async function updateUser(id) {
  loadUsers();
  resetFormErrors(inputNameUpd, inputNameUpdHelp, inputAgeUpd, inputAgeUpdHelp);

  editingUserId = id;

  createUserFormContent.style.display = "none";
  updateUserFormContent.style.display = "";

  const user = await api(`/users/${editingUserId}`, "get");

  updateUserFormContent.querySelector("#user-id").innerText = editingUserId;
  updateUserForm.querySelector("#userNameUpd").value = user.name;
  updateUserForm.querySelector("#userAgeUpd").value = user.age;
  updateUserForm.querySelector("#usrnameUpd").value = user.username;
  updateUserForm.querySelector("#passwrdUpd").value = user.password;
}

function cancelUpdate() {
  resetFormErrors(inputName, inputNameHelp, inputAge, inputAgeHelp);

  createUserFormContent.style.display = "";
  updateUserFormContent.style.display = "none";
}

async function saveUpdateUser() {
  resetFormErrors(inputNameUpd, inputNameUpdHelp, inputAgeUpd, inputAgeUpdHelp);

  const name = updateUserForm.querySelector("#userNameUpd").value;
  const age = updateUserForm.querySelector("#userAgeUpd").value;
  const username = updateUserForm.querySelector("#usrnameUpd").value;
  const password = updateUserForm.querySelector("#passwrdUpd").value;

  const response = await api(`/users/${editingUserId}`, "put", {
    name,
    age,
    username,
    password,
  });

  if (response.error) {
    showFormErrors(response.error, "update");
  } else {
    cancelUpdate();
    loadUsers();
  }
}

/**
 * Eliminar usuario
 */
async function deleteUser(id) {
  await api(`/users/${id}`, "delete");

  const userRow = document.querySelector(`[data-id='${id}']`);
  userRow.remove();
}

/**
 *
 * @param {'get'|'post'|'put'|'delete'} method
 * @param {'/users'|'/users:userId'} endpoint
 * @returns
 */

async function api(endpoint, method, body = undefined) {
  if (body) {
    body = JSON.stringify(body);
  }

  const token = localStorage.getItem("token");
  const headers = {
    "Content-type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    method,
    body,
    headers,
  });

  const data = await response.json();

  return data;
}

/**
 * Inicio de la app
 */

async function initApp() {
  // el panel central no lo muestro hasta estar seguro que hay usuarios para mostrar
  panelUsuarios.classList.add("is-hidden");

  if (localStorage.getItem("token")) {
    // Si la app está iniciando y el token está guardado en local storage, debo "limpiar" esa información porque puede ser un token caducado y nunca me va a dejar acceder

    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
  } else {
    // Usuario no logueado, oculto el contenedor que muestra bienvenida al usuario y botón de logout
    contentUser.style.display = "none";
    // oculto formulario para cargar nuevo usuario
    createUserFormContent.style.display = "none";
  }

  await loadUsers();
}

async function loadUsers() {
  //   contentTable.innerHTML = "";
  if (localStorage.getItem("token")) {
    // Muestro formulario de carga de nuevo usuario
    createUserFormContent.style.display = "";

    while (contentTable.children.length > 1) {
      //// Iteración para eliminar todos los elementos, menos el 1º que es la fila cabecera
      let item = contentTable.lastElementChild;
      contentTable.removeChild(item);
    }

    const data = await api("/users", "get");

    if (data.length > 0) {
      panelUsuarios.classList.remove("is-hidden");
      data.forEach(({ name, age, username, id }) =>
        addRow(name, age, username, id)
      );
    }
  }
}

function showFormErrors(errors, action) {
  if (action == "create") {
    errors.forEach((error) => {
      switch (error.field) {
        case "name":
          inputNameHelp.innerText = error.msg;
          inputNameHelp.classList.remove("is-hidden");
          inputName.classList.add("is-danger");
          break;
        case "age":
          inputAgeHelp.innerText = error.msg;
          inputAgeHelp.classList.remove("is-hidden");
          inputAge.classList.add("is-danger");
          break;
        default:
          break;
      }
    });
  } else {
    // action == "update"
    errors.forEach((error) => {
      switch (error.field) {
        case "name":
          inputNameUpdHelp.innerText = error.msg;
          inputNameUpdHelp.classList.remove("is-hidden");
          inputNameUpd.classList.add("is-danger");
          break;
        case "age":
          inputAgeUpdHelp.innerText = error.msg;
          inputAgeUpdHelp.classList.remove("is-hidden");
          inputAgeUpd.classList.add("is-danger");
          break;
        default:
          break;
      }
    });
  }
}

function resetFormErrors(input1, inputHelp1, input2, inputHelp2) {
  inputHelp1.classList.add("is-hidden");
  input1.classList.remove("is-danger");
  inputHelp2.classList.add("is-hidden");
  input2.classList.remove("is-danger");
}
