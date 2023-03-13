import { closeModal, modalNavigate, setupModalNavigation } from "./modalNavigation.js";
import {
  verifyImage,
  setimageBackground,
  formatImageName,
  submitLoadingAnimation,
  deleteWork,
  postWork,
  successWorkUploadAnim,
  resetForm,
  refreshGalleriesAfterChange,
} from "./handleForm.js";
import { ApiUrl } from "../Constants/Api.js";
import { getWorks } from "./gallery.js";

const getCategories = async () => {
  const categories = await fetch(ApiUrl + "/categories", {
    method: "GET",
  }).then((res) => res.json());
  return categories;
};

/**
 * Créer les élements html pour chaque catégorie sélectionnable dans le formulaire
 * @param {{id:Number, name:String}[]} categories
 */
const addCategoriesToForm = (categories) => {
  const categorySelector = document.getElementById("categoryInput");
  // generate option for category select element
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.setAttribute("value", category.id);
    option.setAttribute("label", category.name);
    categorySelector.appendChild(option);
  });
};

/**
 * Gère les event listeners à éxecuter quand on rentre quelque chose dans un champ du formulaire
 * (actualisation de l'image input, et fonction submit pour envoyer les formData à l'api)
 */
const listenFormResults = () => {
  const form = document.getElementById("addPictureForm");
  const imageInput = document.getElementById("imageInput");
  const titleInput = document.getElementById("titleInput");
  const categoryInput = document.getElementById("categoryInput");
  const submitAnim = submitLoadingAnimation();
  //
  imageInput.addEventListener("change", () => {
    const image = imageInput.files[0];
    if (!image) {
      return;
    } else if (verifyImage(image) !== true) {
      alert(verifyImage(image));
      return;
    }

    const titleInput = document.getElementById("titleInput");
    if (!titleInput.value) titleInput.value = formatImageName(image);

    setimageBackground(image);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitAnim.start();

    if (verifyImage(imageInput.files[0]) !== true) {
      alert(verifyImage(imageInput.files[0]));
      submitAnim.stop();
      return;
    } else if (categoryInput.value.length < 1 || titleInput.value.length < 1) {
      alert("Vérifiez que vous avez correctement rempli les champs Titre & Catégorie");
      submitAnim.stop();
      return;
    }

    const formData = new FormData();
    const fieldNames = ["category", "title", "image"];

    for (let value of new FormData(form).values()) {
      formData.append(fieldNames.pop(), value);
    }

    postWork(formData).then((res) => {
      if (res.status === 201) {
        submitAnim.stop();
        successWorkUploadAnim();
        resetForm();
        setTimeout(() => {
          refreshGalleriesAfterChange().then(() => {
            modalNavigate().toGallery();
          });
        }, 300);
      }
    });
  });
};

/**
 * Bouton qui supprime **Tous** les projets présents dans la galerie
 */
const setupDeleteGalleryButton = () => {
  const delButton = document.getElementById("deleteGallery");

  delButton.addEventListener("click", () => {
    if (document.querySelector(".delGalleryConfirmBox")) {
      return;
    }

    const confirmBox = document.createElement("div");
    confirmBox.setAttribute("class", "delGalleryConfirmBox");

    const confirmButton = document.createElement("button");
    confirmButton.setAttribute("type", "button");
    confirmButton.setAttribute("class", "delGalleryConfirm");
    const confirmIcon = document.createElement("i");
    confirmIcon.setAttribute("class", "fa-solid fa-trash");
    const confirmText = document.createTextNode("Oui supprimer la galerie");
    confirmButton.appendChild(confirmIcon);
    confirmButton.appendChild(confirmText);

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "Annuler";
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("class", "delGalleryCancel");

    confirmBox.appendChild(confirmButton);
    confirmBox.appendChild(cancelButton);
    delButton.insertAdjacentElement("afterend", confirmBox);

    confirmButton.addEventListener("click", () => {
      closeModal();
      getWorks().then((workList) => {
        workList.forEach((work) => {
          deleteWork(work.id);
        });
      });
    });
    cancelButton.addEventListener("click", () => {
      delButton.innerText = "Supprimer la galerie";
      confirmBox.remove();
    });

    //
    //

    delButton.innerText = "Êtes vous sûr ? Ce processus est irreversible";
    setTimeout(() => {
      delButton.innerText = "Supprimer la galerie";
      confirmBox.remove();
    }, 5000);
  });
};

/**
 * Génère les éléments html pour chaque projet,
 * rajoute le tout à la galerie
 * @param {{category: {id: Number, name: String}, id: Number, imageUrl: String, title: String}[]} workList
 */
export const createModalGallery = (workList) => {
  const modalGallery = document.querySelector(".modalGallery");

  const imagesAlreadyInGallery = new Set([]);
  for (const child of modalGallery.children) {
    // Rappel : image class = " ...workId-XXXX"
    const imageId = Number(child.getAttribute("class").split("-").pop());
    imagesAlreadyInGallery.add(imageId);
  }

  const imageBoxes = workList.map((work) => {
    if (imagesAlreadyInGallery.has(work.id)) {
      return null;
    }
    const imageBox = document.createElement("figure");
    imageBox.setAttribute("class", "imageBox workId-" + work.id);

    const imageBackground = document.createElement("div");
    fetch(work.imageUrl)
      .then((res) => res.blob())
      .then((imageBlob) => {
        const imageObjectURL = URL.createObjectURL(imageBlob);
        imageBackground.setAttribute("style", "background-image : url(" + imageObjectURL + ")");
        imageBackground.setAttribute("class", "imageBackground");
      });

    const buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class", "imgBtnContainer");

    const editButton = document.createElement("figcaption");
    const caption = document.createTextNode("éditer");
    editButton.appendChild(caption);

    const deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", () => {
      deleteWork(work.id);
    });

    const trashIcon = document.createElement("i");
    trashIcon.setAttribute("class", "fa-solid fa-trash-can");
    deleteButton.appendChild(trashIcon);

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    imageBox.appendChild(imageBackground);
    imageBox.appendChild(buttonContainer);

    return imageBox;
  });

  imageBoxes.forEach((element) => {
    if (element !== null) modalGallery.appendChild(element);
  });
};

/**
 * Fonction principale pour le fonctionnement de la modale
 * @param {{category: {id: Number, name: String}, id: Number, imageUrl: String, title: String}[]} workList
 */
export const handleModal = async (workList) => {
  // Event listeners to close the modal & to navigate beetween gallery & form
  createModalGallery(workList);
  setupModalNavigation();
  setupDeleteGalleryButton();

  const categories = await getCategories();
  addCategoriesToForm(categories);

  listenFormResults();
};
