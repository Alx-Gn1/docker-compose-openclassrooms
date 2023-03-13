import { ApiUrl } from "./Constants/Api.js";

const form = document.forms["loginForm"];

/**
 *
 * @param {String} message
 */
const displayErrorMessage = (message) => {
  // If no message is given to the function, it clear all error message

  // Delete former message
  const errorMessage = document.querySelector(".error");
  if (errorMessage) errorMessage.remove();

  if (message) {
    // Create html for error message
    const container = document.createElement("div");
    container.setAttribute("class", "error");
    const messageNode = document.createTextNode(message);
    container.appendChild(messageNode);

    // Add new message to the dom
    const loginSection = document.getElementById("login");
    loginSection.insertBefore(container, form);
  }
};

const clearErrorMessage = () => displayErrorMessage(null);

const emailInput = form.email;
const passwordInput = form.password;

let email;
let password;

emailInput.addEventListener("input", (e) => (email = e.target.value));
passwordInput.addEventListener("input", (e) => (password = e.target.value));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  //
  if (emailInput.reportValidity() && passwordInput.reportValidity()) {
    clearErrorMessage();
    loginUser(email, password);
  }
});

/**
 *
 * @param {String} email
 * @param {String} password
 */
async function loginUser(email, password) {
  const loginHeaders = new Headers({ "content-type": "application/json" });
  const fetchConfig = {
    headers: loginHeaders,
    body: JSON.stringify({ email, password }),
    method: "POST",
  };

  const response = await fetch(ApiUrl + "/users/login", fetchConfig).then((res) => {
    if (res.status === 401 || res.status === 404) {
      displayErrorMessage("Erreur dans l'identifiant ou le mot de passe");
      return null;
    } else {
      return res.json();
    }
  });

  if (response?.token) {
    sessionStorage.setItem("userToken", response.token);
    window.location.replace("/");
  }
}
