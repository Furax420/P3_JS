import { openModal, galleryUpDated } from "./function.js";

document.addEventListener("DOMContentLoaded", () => {
  galleryUpDated();
  if (token) {
    const token = localStorage.getItem("token");
    const fixeBody = document.querySelector("body");
    const editionModeBlock = document.getElementById("edition-mode-block");
    const editionMode = document.createElement("div");
    const editionIcon = document.createElement("div");
    const applyChanges = document.createElement("button");
    const logOut = document.getElementById("login-logout");
    const modifyTitle = document.querySelector(".Modify-Title");
    const modifyPicture = document.querySelector(".Modify-Picture");
    const modifyProjectsLocation = document.getElementById("Projects");
    const modifyProjects = document.querySelector(".Modify-Projects");
    modifyProjects.classList.add(".modal-trigger");
    const modifyIcon =
      '<button class="modify-btn"><i class="fa-regular fa-pen-to-square"></i><span>Modifier</span></button>';
    const hideFilters = document.getElementById("filtres");

    // Vérification si token présent dans le localstorage, si oui la page html s'affiche différement

    editionModeBlock.style.display = "block";
    editionMode.id = "edition-mode";
    editionIcon.id = "edition-icon";
    editionIcon.innerHTML =
      '<i class="fa-regular fa-pen-to-square"></i><span>Mode édition</span>';
    applyChanges.id = "apply-changes";
    applyChanges.innerHTML = "publier les changements";
    fixeBody.style.paddingTop = "59px";
    editionModeBlock.appendChild(editionMode);
    editionMode.appendChild(editionIcon);
    editionMode.appendChild(applyChanges);
    // Si clique sur  logout, fenêtre de confirmation  "Se déconnecter" si OK suppression du token  et rechargement de la page
    logOut.innerHTML = "logout";
    logOut.addEventListener("click", () => {
      if (confirm("Se déconnecter ?")) {
        localStorage.removeItem("token");
        window.location.reload();
      }
    });
    modifyProjectsLocation.style.marginBottom = "92px";
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

const token = localStorage.getItem("token");
if (token) {
  console.log("Token présent dans le localstorage.");
} else {
  console.log("Token absent du localstorage.");
}
