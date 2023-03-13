import { getWorks, displayWorkGallery, getInUseCategories, displayFilters } from "./modules/gallery.js";
import { showEditUi, showLogoutButton } from "./modules/editUi.js";
import { handleModal } from "./modules/modal.js";

const HomePage = async () => {
  // Main variables
  const workList = await getWorks();
  const userToken = sessionStorage.getItem("userToken");
  // Initiate the app
  displayWorkGallery(workList);
  //
  if (!userToken) {
    displayFilters(getInUseCategories(workList));
  } else {
    showEditUi();
    showLogoutButton();
    handleModal(workList);
  }
};

await HomePage();
