export const openModal = () => {
  const modal = document.getElementById("modal");
  modal.showModal();
};

export const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.close();
};

const hideModalGallery = () => {
  const modalGallery = document.querySelector(".modalGallery");
  modalGallery.classList.add("d-none");
};
const showModalGallery = () => {
  const modalGallery = document.querySelector(".modalGallery");
  modalGallery.classList.remove("d-none");
};

/**
 *
 * @returns Fonctions permettants d'aller vers la page avec le formulaire ou celle avec la galerie de projets
 */
export const modalNavigate = () => {
  const goBackButton = document.querySelector(".modalHeader .fa-arrow-left");
  const saveChangeButton = document.getElementById("saveChange");
  const addPictureForm = document.getElementById("addPictureForm");
  const deleteGalleryButton = document.getElementById("deleteGallery");
  const addPictureButton = document.getElementById("addPicture");
  const modalTitle = document.querySelector(".modalContainer h3");
  return {
    toForm: () => {
      modalTitle.replaceChildren("Ajout photo");

      goBackButton.classList.remove("hide");

      saveChangeButton.classList.add("d-block");
      addPictureForm.classList.add("class", "d-flex");

      deleteGalleryButton.classList.add("d-none");
      addPictureButton.classList.add("d-none");
      hideModalGallery();
    },
    toGallery: () => {
      modalTitle.replaceChildren("Galerie photo");

      goBackButton.classList.add("hide");

      saveChangeButton.classList.remove("d-block");
      addPictureForm.classList.remove("d-flex");
      deleteGalleryButton.classList.remove("d-none");
      addPictureButton.classList.remove("d-none");
      showModalGallery();
    },
  };
};

/**
 * Principaux event listeners pour fermer la modale, ou se déplacer entre la galerie et le formulaire
 */
export const setupModalNavigation = () => {
  // Close the modal
  window.onclick = (e) => {
    if (e.target === modal) {
      closeModal();
    }
  };
  const closeModalButton = document.querySelector(".modalHeader .fa-xmark");
  closeModalButton.addEventListener("click", () => {
    closeModal();
  });
  // Nav to picture form
  const addPictureButton = document.getElementById("addPicture");
  addPictureButton.addEventListener("click", () => {
    modalNavigate().toForm();
  });
  // Nav back to gallery
  const goBackButton = document.querySelector(".modalHeader .fa-arrow-left");
  goBackButton.classList.add("hide");
  goBackButton.addEventListener("click", () => {
    modalNavigate().toGallery();
  });
};
