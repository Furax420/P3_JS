document.addEventListener("DOMContentLoaded", () => {
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
  const modalContainer = document.querySelector(".modal-container");
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("overlay");
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const modalClose = document.createElement("button");
  modalClose.classList.add("close-modal");
  const modalTitle = document.createElement("h3");
  modalTitle.id = "modal-title";
  const modalWorksContainer = document.createElement("div");
  modalWorksContainer.classList.add("modal-works-container");
  const modalGreyBar = document.createElement("div");
  modalGreyBar.classList.add("grey-bar");
  const modalAddPictures = document.createElement("button");
  modalAddPictures.id = "add-pictures";
  const modalDeleteButton = document.createElement("button");
  modalDeleteButton.id = "delete-button";
  // Vérification si token présent dans le localstorage, si oui la page html s'affiche différement
  if (token) {
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
      modalContainer.style.display = "block";
      const response = await fetch("http://localhost:5678/api/works", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const works = await response.json();
      modalClose.innerHTML = "X";
      modalTitle.innerHTML = "Galerie Photo";
      modalAddPictures.innerHTML = "Ajouter une photo";
      modalDeleteButton.innerHTML = "Supprimer la galerie";
      modalContainer.appendChild(modalOverlay);
      modalContainer.appendChild(modal);
      modal.appendChild(modalClose);
      modal.appendChild(modalTitle);
      modal.appendChild(modalWorksContainer);
      modal.appendChild(modalGreyBar);
      modal.appendChild(modalAddPictures);
      modal.appendChild(modalDeleteButton);
      for (const work of works) {
        const workElement = document.createElement("figure");
        workElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        `;
        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = "éditer";
        const deleteIcon = document.createElement("button");
        deleteIcon.classList.add("delete-icon");
        deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        modalWorksContainer.appendChild(workElement);
        // Sorti de la modale en cliquant sur l'overlay ou le bouton X, rechargement de la page pour éviter de garder les images charger dans la modale
        workElement.appendChild(editButton);
        workElement.appendChild(deleteIcon);
        modalClose.addEventListener("click", () => {
          location.reload();
        });
        modalOverlay.addEventListener("click", () => {
          location.reload();
        });
      }
    });
  }
});

const token = localStorage.getItem("token");
if (token) {
  console.log("Token présent dans le localstorage.");
} else {
  console.log("Token absent du localstorage.");
}
