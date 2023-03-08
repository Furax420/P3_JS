import { openModal, galleryUpDated, initFiltres } from "./function.js";

document.addEventListener("DOMContentLoaded", () => {
  galleryUpDated();
  initFiltres();

  const token = localStorage.getItem("token");
  if (token) {
    console.log("Token présent dans le localstorage.");
  } else {
    console.log("Token absent du localstorage.");
  }
  const userId = localStorage.getItem("userId");

  if (userId) {
    console.log("UserId présent dans le localstorage :", userId);
  } else {
    console.log("UserId absent du localstorage.");
  }

  // Vérification si token présent dans le localstorage, si oui la page html s'affiche différement
  if (token) {
    const fixeBody = document.querySelector("body");
    fixeBody.classList.add("fixe-body");
    const editionModeBlock = document.createElement("div");
    editionModeBlock.id = "edition-mode-block";
    fixeBody.appendChild(editionModeBlock);
    const editionMode = document.createElement("div");
    const editionIcon = document.createElement("div");
    const applyChanges = document.createElement("button");
    const logOut = document.getElementById("login-logout");
    const modifyTitle = document.querySelector(".Modify-Title");
    const modifyPicture = document.querySelector(".Modify-Picture");
    const modifyProjectsLocation = document.getElementById("Projects");
    modifyProjectsLocation.classList.add("fixe-modify");
    const modifyProjects = document.querySelector(".Modify-Projects");
    modifyProjects.classList.add(".modal-trigger");
    const modifyIcon =
      '<button class="modify-btn"><i class="fa-regular fa-pen-to-square"></i><span>Modifier</span></button>';
    const hideFilters = document.getElementById("filtres");

    editionModeBlock.style.display = "block";
    editionMode.id = "edition-mode";
    editionIcon.id = "edition-icon";
    editionIcon.innerHTML =
      '<i class="fa-regular fa-pen-to-square"></i><span>Mode édition</span>';
    applyChanges.id = "apply-changes";
    applyChanges.innerHTML = "publier les changements";
    editionModeBlock.appendChild(editionMode);
    editionMode.appendChild(editionIcon);
    editionMode.appendChild(applyChanges);
    // Si clique sur  logout, fenêtre de confirmation  "Se déconnecter" si OK suppression du token  et rechargement de la page
    logOut.innerHTML = "logout";
    logOut.addEventListener("click", () => {
      if (confirm("Se déconnecter ?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.reload();
      }
    });
    modifyTitle.innerHTML =
      modifyProjects.innerHTML =
      modifyPicture.innerHTML =
        modifyIcon;
    hideFilters.style.display = "none";

    // Mise en place de la modal en cliquant sur modifier projets, appel a l'API pour afficher toutes les images
    modifyProjects.addEventListener("click", async () => {
      openModal(token);
    });
  }
});
