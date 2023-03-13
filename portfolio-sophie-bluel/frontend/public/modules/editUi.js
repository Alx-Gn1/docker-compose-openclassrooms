import { displayFilters, getInUseCategories, getWorks } from "./gallery.js";
import { openModal } from "./modalNavigation.js";

export const showEditUi = () => {
  const editHeader = document.getElementById("editHeader");
  const header = document.querySelector("header");
  const editButtons = document.querySelectorAll(".editButton");

  editHeader.classList.add("d-flex");
  header.classList.add("header-margin");
  editButtons.forEach((e) => {
    e.classList.add("d-block");
  });

  const editGalleryButton = document.getElementById("editGallery");
  editGalleryButton.addEventListener("click", () => {
    openModal();
  });
};

export const hideEditUi = () => {
  const editHeader = document.getElementById("editHeader");
  const header = document.querySelector("header");
  const editButtons = document.querySelectorAll(".editButton");
  editHeader.classList.remove("d-flex");
  header.classList.remove("header-margin");
  editButtons.forEach((e) => {
    e.classList.remove("d-block");
  });
};

/**
 * Affiche le bouton de déconnection et gère le comportement en cas de déconnection de l'utilisateur
 */
export const showLogoutButton = () => {
  const loginButton = document.querySelector("a[href='./login']");
  loginButton.classList.add("d-none");
  const logoutButton = document.createElement("a");
  logoutButton.appendChild(document.createTextNode("logout"));
  loginButton.insertAdjacentElement("beforebegin", logoutButton);

  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("userToken");

    getWorks().then((workList) => {
      displayFilters(getInUseCategories(workList));
    });

    logoutButton.remove();
    loginButton.classList.remove("d-none");
    hideEditUi();
  });
};
