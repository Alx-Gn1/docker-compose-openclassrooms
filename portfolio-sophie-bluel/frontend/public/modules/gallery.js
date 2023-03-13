import { ApiUrl } from "../Constants/Api.js";

/**
 * Récupère la liste des projets via l'api
 * @returns {Promise<Object[]>} workList
 */
const getWorks = async () => {
  const getWorksHeaders = new Headers({ "content-type": "application/json" });
  // get the work list
  const workList = await fetch(ApiUrl + "/works", {
    method: "GET",
    headers: getWorksHeaders,
  }).then((res) => res.json());

  return workList;
};

/**
 * Génère les éléments html pour chaque projet,
 * rajoute le tout à la galerie
 * @param {{category: {id: Number, name: String}, id: Number, imageUrl: String, title: String}[]} workList
 */
const displayWorkGallery = (workList) => {
  const gallery = document.querySelector(".gallery");

  // Check if there is already a gallery, do not generate 2 time the same image/work
  const imagesAlreadyInGallery = new Set([]);
  for (const child of gallery.children) {
    // Rappel : image figure class = " ...workId-XXXX"
    const imageId = Number(child.getAttribute("class").split("-").pop());
    imagesAlreadyInGallery.add(imageId);
  }

  // Create html elements for each work
  const workElements = workList.map((work) => {
    if (imagesAlreadyInGallery.has(work.id)) {
      return null;
    }
    // Creation d'un élément pour chaque projet
    const img = document.createElement("img");
    fetch(work.imageUrl)
      .then((res) => res.blob())
      .then((imageBlob) => {
        const imageObjectURL = URL.createObjectURL(imageBlob);
        img.src = imageObjectURL;
      });
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    const caption = document.createTextNode(work.title);
    figcaption.appendChild(caption);

    const figure = document.createElement("figure");
    figure.setAttribute("class", "categoryId-" + work.category.id + " workId-" + work.id);
    figure.appendChild(img);
    figure.appendChild(figcaption);

    return figure;
  });

  workElements.forEach((element) => {
    if (element !== null) gallery.appendChild(element);
  });
};

/**
 * Créer les élements html pour chaque filtre et les ajoute au DOM
 * @param {{id: number;name: string;}[]} categories
 */
const createFiltersHtml = (categories) => {
  const gallery = document.querySelector(".gallery");

  const filters = document.createElement("div");
  filters.setAttribute("class", "filters");
  categories.forEach((category) => {
    const elementClass = category.name === "Tous" ? "filterButton selected" : "filterButton";
    const button = document.createElement("button");
    button.setAttribute("class", elementClass);
    button.setAttribute("name", category.name);
    button.setAttribute("value", category.id);
    button.appendChild(document.createTextNode(category.name));
    filters.appendChild(button);
  });
  gallery.insertAdjacentElement("beforebegin", filters);
};

/**
 * Récupère tous les élements présents dans la galerie
 * @example Si le filtre sélectionné est "3" on affiche tous les élements avec le className "categoryId-3", on cache tous les autres
 * @example Le filtre "0" équivaut à avoir sélectionné le bouton "Tous", donc affiche toute la galerie
 * @param {Number} filter
 */
const filterGallery = (filter) => {
  const gallery = new Set(document.querySelectorAll(".gallery figure"));

  gallery.forEach((element) => {
    // Rappel : class="categoryId-XXX workId-XXX"
    filter === 0 || element.className.split(" ")[0] === "categoryId-" + filter
      ? element.classList.remove("d-none")
      : element.classList.add("d-none");
  });
};

/**
 * Modifie les classes css en fonction de si le bouton est selectionné ou non
 * Exécute la fonction pour filtrer la galerie
 * @param {Number} filter
 */
const selectFilter = (filter) => {
  const filterButtons = document.getElementsByClassName("filterButton");

  filterGallery(filter);

  for (let i = 0; i < filterButtons.length; i++) {
    const element = filterButtons[i];
    parseInt(element.getAttribute("value")) === filter
      ? element.classList.add("selected")
      : element.classList.remove("selected");
  }
};

/**
 * Ajoute l'event listener pour lancer la fonction
 * La valeur du click du bouton étant l'id de la catégorie à sélectionner
 */
const handleFilters = () => {
  const filterButtons = document.getElementsByClassName("filterButton");

  for (let i = 0; i < filterButtons.length; i++) {
    const filter = parseInt(filterButtons[i].getAttribute("value"));
    filterButtons[i].addEventListener("click", () => {
      selectFilter(filter);
    });
  }
};

/**
 * Lance les fonctions pour créer les filtres et gérer le filtrage de la galerie
 * @param {{id: number;name: string;}[]} categories
 */
const displayFilters = (categories) => {
  createFiltersHtml(categories);
  handleFilters();
};

/**
 * Permet d'avoir une liste des catégories associées à 1 work/projet minimum
 * @example Si on a pas de projet dans la catégorie "Object", elle ne sera pas ajouté à la liste des catégories
 * @param {Object[]} workList
 * @returns
 */
const getInUseCategories = (workList) => {
  const categories = [{ id: 0, name: "Tous" }];
  workList.forEach((work) => {
    if (!categories.find((e) => e.id === work.category.id)) categories.push(work.category);
  });
  return categories;
};

export { getWorks, displayWorkGallery, displayFilters, getInUseCategories };
