import { ApiUrl } from "../Constants/Api.js";
import { displayWorkGallery, getWorks } from "./gallery.js";
import { createModalGallery } from "./modal.js";

/**
 * Vérifie que l'image est de type jpg/png et 4mo maximum
 * @param {{name:String, size:Number, type: String}} image
 * @returns
 */
export const verifyImage = (image) => {
  if ((image && image.type === "image/png") || (image && image.type === "image/jpeg")) {
    if (image.size <= 4194304) {
      return true;
    }
    return "L'image doit peser 4mo maximum !\n\nTaille actuelle: " + (image.size / 1048576).toFixed(2) + "mo";
  }
  return "L'image doit être au format png/jpg";
};

/**
 * Définit une image comme background de l'image input (à la place du bouton "Ajouter une image")
 * @param {{name:String, size:Number, type: String}} image
 * @returns
 */
export const setimageBackground = (image) => {
  const imgInputContainer = document.getElementById("imgInputContainer");

  if (!image) return;
  imgInputContainer.setAttribute(
    "style",
    "background-image : url(" + window.URL.createObjectURL(image) + "); padding:0"
  );

  // invisible input on top of image to re-open the file input
  const invisibleInput = document.getElementById("imageInvisibleInput");
  invisibleInput.classList.add("d-block");
  imgInputContainer.setAttribute("class", "hideChildren");
};

/**
 * Supprime l'image de fond de l'image input et execute la fonction reset() sur l'élément form
 */
export const resetForm = () => {
  const imgInputContainer = document.getElementById("imgInputContainer");
  const invisibleInput = document.getElementById("imageInvisibleInput");
  imgInputContainer.removeAttribute("style");
  imgInputContainer.classList.remove("hideChildren");
  invisibleInput.classList.remove("d-block");

  const form = document.getElementById("addPictureForm");
  form.reset();
};

/**
 * Passe le nom de l'image en title case
 * @param {{name:String, size:Number, type: String}} image
 * @returns
 */
export const formatImageName = (image) => {
  console.log(typeof image);
  console.log(typeof image);
  console.log(typeof image.name);
  const splittedName = image.name.split(".");
  splittedName.pop();

  if (!splittedName.toString().match(/[A-Za-z]/g)) return null;

  const imgName = splittedName
    .toString()
    .replace(/[^A-Za-z0-9]/g, " ")
    .replace(/[0-9]/g, "")
    .slice(0, 40);

  return imgName.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase());
};

/**
 * Animation lorsqu'on envoie une image vers le serveur backend et qu'on attend une réponse
 * @returns {{start: Function, stop: Function}} Fonction pour lancer l'animation et pour la stopper
 */
export const submitLoadingAnimation = () => {
  const submitButton = document.getElementById("saveChange");

  let count = 1;
  let intervalId;

  return {
    start: () => {
      intervalId = setInterval(() => {
        if (count > 3) count = 0;
        const submitText = "Valider " + ".".repeat(count);
        submitButton.replaceChildren(document.createTextNode(submitText));
        count++;
      }, 500);
    },
    stop: () => {
      clearInterval(intervalId);
      count = 0;
      intervalId = null;
      submitButton.replaceChildren(document.createTextNode("Valider"));
    },
  };
};

/**
 * Actualise la galerie de la page d'acceuil et celle de la modale si de nouveaux projets ont été ajoutés
 * @returns
 */
export const refreshGalleriesAfterChange = async () => {
  const workList = await getWorks();
  displayWorkGallery(workList);
  createModalGallery(workList);
  return;
};

/**
 * @param {Number} id
 */
const deleteWorkFromDOM = (id) => {
  const itemToDelete = document.querySelectorAll(".workId-" + id);
  itemToDelete.forEach((element) => {
    element.remove();
  });
};

/**
 * Supprime un projet via l'api
 * @param {Number} id
 */
export const deleteWork = async (id) => {
  const userToken = sessionStorage.getItem("userToken");
  const headers = new Headers({
    Accept: "*/*",
    Authorization: "Bearer " + userToken,
  });

  await fetch(ApiUrl + "/works/" + id, {
    headers,
    method: "DELETE",
  }).then((res) => {
    if (res.status === 200 || res.status === 204) {
      deleteWorkFromDOM(id);
    } else if (res.status === 401) {
      alert("401 - Accès non autorisé");
    } else {
      alert("Une erreur inconnue est survenue : " + res?.status + res?.statusText);
    }
  });
};

/**
 * Ajoute un projet via l'api
 * @param {FormData} formData
 * @returns
 */
export const postWork = async (formData) => {
  const userToken = sessionStorage.getItem("userToken");
  const body = formData;
  const headers = new Headers({
    Accept: "application/json",
    Authorization: "Bearer " + userToken,
  });

  const postWorkRes = await fetch(ApiUrl + "/works", {
    headers,
    body,
    method: "POST",
  }).then((res) => {
    if (res.status === 201) {
      return res;
    } else if (res.status === 400) {
      alert("400 - Bad Request");
    } else if (res.status === 401) {
      alert("401 - Accès non autorisé");
    } else {
      alert("Une erreur inconnue est survenue : " + res?.status + res?.statusText);
    }
    return res;
  });

  return postWorkRes;
};

/**
 * Animation quand on projet a bien été ajouté au serveur backend
 */
export const successWorkUploadAnim = () => {
  const submitFormButton = document.getElementById("saveChange");

  const successLogo = document.createElement("i");
  successLogo.setAttribute("class", "fa-regular fa-circle-check successLogo");
  submitFormButton.after(successLogo);
  setTimeout(() => {
    successLogo.classList.add("up-movement");
  }, 1);
  setTimeout(() => {
    successLogo.classList.add("hide");
  }, 100);
};
