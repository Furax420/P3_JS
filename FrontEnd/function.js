export async function openModal(token) {
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
    deleteIcon.id = `delete-icon-${work.id}`;
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    modalWorksContainer.appendChild(workElement);
    // Sorti de la modale en cliquant sur l'overlay ou le bouton X, suppression des éléments de modalWorksContainer avec la fonction clearModalContent
    workElement.appendChild(editButton);
    workElement.appendChild(deleteIcon);
    modalClose.addEventListener("click", () => {
      clearModalContent();
      localStorage.removeItem("image");
    });
    modalOverlay.addEventListener("click", () => {
      clearModalContent();
      localStorage.removeItem("image");
    });
    deleteIcon.addEventListener("click", async () => {
      event.stopPropagation();
      event.preventDefault();
      const response = await fetch(
        `http://localhost:5678/api/works/${work.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        workElement.remove();
      } else {
        console.log("Failed to delete work");
      }
    });
  }
  function clearModalContent() {
    // Suppression du contenu de la modale
    while (modalWorksContainer.firstChild) {
      modalWorksContainer.removeChild(modalWorksContainer.firstChild);
    }

    // Réinitialisation des autres éléments de la modale
    modalTitle.innerHTML = "";
    modalAddPictures.innerHTML = "";
    modalDeleteButton.innerHTML = "";
    // Remise à zéro de la modale
    modalContainer.style.display = "none";
  }
  modalAddPictures.addEventListener("click", () => {
    modal.innerHTML = "";
    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left-long"></i>';
    backButton.addEventListener("click", () => {
      modal.style.display = "none";
      openModal();
    });
    const titleBlock = document.createElement("div");
    titleBlock.classList.add("title-block");
    const titleMenu = document.createElement("input");
    const titleOption = document.createElement("label");
    const categoryBlock = document.createElement("div");
    categoryBlock.classList.add("category-block");
    const categoryMenu = document.createElement("select");
    const categoryOption = document.createElement("label");

    // Ajouter un placeholder vide au début du menu déroulant puis suppression lors du clique sur le menu déroulant
    const placeholderOption = document.createElement("option");
    placeholderOption.text = "";
    categoryMenu.add(placeholderOption);

    categoryMenu.addEventListener("click", () => {
      // Vérification que placeholder existe pour éviter les messages d'erreurs
      if (categoryMenu.contains(placeholderOption)) {
        categoryMenu.removeChild(placeholderOption);
      }
    });

    fetch("http://localhost:5678/api/categories")
      .then((response) => response.json())
      .then((categories) => {
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.text = category.name;
          categoryMenu.appendChild(option);
        });
      });

    const modalConfirmAddPictures = document.createElement("button");
    modalConfirmAddPictures.classList.add("confirm-add-pictures");
    const inputContainer = document.createElement("div");

    // Créer la box pour afficher le logo
    const logoBox = document.createElement("div");
    logoBox.classList.add("import-img-box");
    const logo = document.createElement("i");
    logo.id = "import-img-logo";
    logo.classList.add("fa-regular", "fa-image");
    inputContainer.appendChild(logoBox);
    logoBox.appendChild(logo);

    const importButton = document.createElement("button");
    importButton.setAttribute("type", "button");
    importButton.innerText = "+ Ajouter Photo";
    importButton.classList.add("import-button");
    // Ajouter un gestionnaire d'événements pour le clic sur le bouton
    importButton.addEventListener("click", () => {
      // Créer un élément HTML <input> de type "file"
      const fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");

      // Ajouter un gestionnaire d'événements pour le changement de sélection de fichiers
      fileInput.addEventListener("change", () => {
        // Récupérer le fichier sélectionné
        const file = fileInput.files[0];

        // Vérifier que le fichier est une image PNG ou JPG
        if (file.type === "image/png" || file.type === "image/jpeg") {
          // Charger l'image dans l'application en utilisant FileReader
          const reader = new FileReader();
          reader.onload = () => {
            // Stocker l'image dans le localstorage
            localStorage.setItem("image", reader.result);

            const selectedImage = document.createElement("img");
            selectedImage.id = "image-preview";
            selectedImage.src = reader.result;

            // Masquer le logo, le bouton d'importation et le texte de format
            logoBox.style.display = "none";
            importButton.style.display = "none";
            formatText.style.display = "none";

            // Ajouter l'élément <img> à l'élément inputContainer
            inputContainer.appendChild(selectedImage);
          };
          reader.readAsDataURL(file);
        } else {
          // Afficher un message d'erreur si le fichier n'est pas une image PNG ou JPG
          alert("Veuillez sélectionner une image PNG ou JPG.");
        }
      });

      // Simuler un clic sur l'élément <input> pour ouvrir la boîte de dialogue de sélection de fichiers
      fileInput.click();
    });
    inputContainer.appendChild(importButton);

    // Ajouter le texte en dessous du bouton
    const formatText = document.createElement("div");
    formatText.id = "import-text";
    formatText.innerHTML = "jpg, png : 4mo max";
    inputContainer.appendChild(formatText);

    // Récupérer l'image stockée dans le localstorage
    const image = localStorage.getItem("image");

    modalTitle.innerHTML = "Ajouter une photo";
    titleOption.innerHTML = "Titre";
    categoryOption.innerHTML = "Catégorie";

    modalWorksContainer.style.display = "none";
    modalDeleteButton.style.display = "none";
    modalConfirmAddPictures.innerHTML = "Valider";

    inputContainer.classList.add("input-container");
    modal.appendChild(backButton);
    modal.appendChild(modalClose);
    modal.appendChild(modalTitle);
    modal.appendChild(inputContainer);
    modal.appendChild(titleBlock);
    titleBlock.appendChild(titleOption);
    titleBlock.appendChild(titleMenu);
    modal.appendChild(categoryBlock);
    categoryBlock.appendChild(categoryOption);
    categoryBlock.appendChild(categoryMenu);
    categoryMenu.name = "category";
    categoryBlock.appendChild(categoryMenu); // Ajoutez le menu déroulant au document
    modal.appendChild(modalGreyBar);
    modal.appendChild(modalConfirmAddPictures);
  });
}

export function galleryUpDated() {
  const gallery = document.querySelector(".gallery");
  gallery.querySelectorAll("figure").forEach((figure) => figure.remove());

  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      works.forEach((work) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.setAttribute("src", work.imageUrl);
        img.setAttribute("alt", work.title);
        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
      });
    });
}
