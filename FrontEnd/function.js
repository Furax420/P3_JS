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
        figure.append(img, figcaption);
        gallery.appendChild(figure);
      });
    });
}

export async function initFiltres() {
  const responseWorks = await fetch("http://localhost:5678/api/works");
  const works = await responseWorks.json();
  const worksContainer = document.querySelector(".gallery");
  function addWorksToContainer(works) {
    worksContainer.innerHTML = "";
    works.forEach((work) => {
      const workElement = document.createElement("figure");
      workElement.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}" />
      <figcaption>${work.title}</figcaption>
      `;
      workElement.classList.add("work");
      worksContainer.appendChild(workElement);
    });
  }
  const responseCategories = await fetch(
    "http://localhost:5678/api/categories"
  );
  const categories = await responseCategories.json();
  console.log(categories);
  const blockFilters = document.querySelector("#filtres");
  const blockDiv = document.createElement("div");
  const buttonAll = document.createElement("button");
  buttonAll.innerHTML = "Tous";
  buttonAll.classList.add("bouton-filtre");
  buttonAll.id = "all";
  buttonAll.addEventListener("click", () => {
    addWorksToContainer(works);
  });
  // Ajouter la couleur au bouton Tous au chargement de la page //
  buttonAll.style.backgroundColor = "#1d6154";
  buttonAll.style.color = "white";
  blockFilters.appendChild(buttonAll);

  categories.forEach((categorie) => {
    const buttonObject = document.createElement("button");
    buttonObject.innerHTML = categorie.name;
    buttonObject.id = categorie.id;
    buttonObject.classList.add("bouton-filtre");
    blockFilters.appendChild(buttonObject);

    const filtreButtons = document.querySelectorAll(".bouton-filtre");
    // Ajouter un écouteur d'événement clic pour chaque bouton
    filtreButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        // Réinitialiser tous les boutons à leur forme initiale
        filtreButtons.forEach(function (b) {
          b.style.backgroundColor = "white";
          b.style.color = "#1d6154";
        });
        // Mettre à jour le bouton cliqué en vert et le texte en blanc
        this.style.backgroundColor = "#1d6154";
        this.style.color = "white";
      });
    });

    buttonObject.addEventListener("click", () => {
      const filterWorks = works.filter(function (work) {
        if (work.categoryId == categorie.id) {
          return work;
        }
      });
      addWorksToContainer(filterWorks);
    });
  });
}

export async function openModal(token) {
  const modalContainer = document.querySelector(".modal-container");

  const modalOverlay = document.createElement("div");
  modalOverlay.className = "overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const modalClose = document.createElement("button");
  modalClose.className = "close-modal";

  const modalTitle = document.createElement("h3");
  modalTitle.id = "modal-title";

  const modalWorksContainer = document.createElement("div");
  modalWorksContainer.className = "modal-works-container";

  const modalGreyBar = document.createElement("div");
  modalGreyBar.className = "grey-bar";

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
  modalContainer.append(modalOverlay, modal);
  modal.append(
    modalClose,
    modalTitle,
    modalWorksContainer,
    modalGreyBar,
    modalAddPictures,
    modalDeleteButton
  );

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
    modalClose.addEventListener("click", clearModalContent);
    modalOverlay.addEventListener("click", clearModalContent);
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
        galleryUpDated();
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
      clearModalContent();
      openModal(token);
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

    // categoryMenu.addEventListener("click", () => {
    //   // Vérification que placeholder existe pour éviter les messages d'erreurs
    //   if (categoryMenu.contains(placeholderOption)) {
    //     categoryMenu.removeChild(placeholderOption);
    //   }
    // });

    const categoryOptions = categoryMenu.options;
    let categoryNames = [];

    fetch("http://localhost:5678/api/categories")
      .then((response) => response.json())
      .then((categories) => {
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.text = category.name;
          categoryMenu.appendChild(option);
          for (let i = 0; i < categoryOptions.length; i++) {
            const categoryName = categoryOptions[i].value;
            categoryNames.push(categoryName);
          }
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
    let imageImported = false;
    let imga = "";
    // initialiser la variable à false
    // Ajouter un gestionnaire d'événements pour le clic sur le bouton
    importButton.addEventListener("click", () => {
      // Créer un élément HTML <input> de type "file"
      const fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.id = "fileInput";

      // Ajouter un gestionnaire d'événements pour le changement de sélection de fichiers
      fileInput.addEventListener("change", () => {
        // Récupérer le fichier sélectionné
        const file = fileInput.files[0];
        imga = fileInput.files[0];

        // Vérifier que le fichier est une image PNG ou JPG
        if (file.type === "image/png" || file.type === "image/jpeg") {
          // Vérifier que la taille du fichier est inférieure ou égale à 4 Mo
          if (file.size <= 4 * 1024 * 1024) {
            // Charger l'image dans l'application en utilisant FileReader
            const reader = new FileReader();
            reader.onload = () => {
              const selectedImage = document.createElement("img");
              selectedImage.id = "image-preview";
              selectedImage.src = reader.result;

              // Masquer le logo, le bouton d'importation et le texte de format
              logoBox.style.display = "none";
              importButton.style.display = "none";
              formatText.style.display = "none";

              // Ajouter l'élément <img> à l'élément inputContainer
              inputContainer.appendChild(selectedImage);
              const formData = new FormData();
              formData.append("file", file);
              let selectedFile = formData.get("file");
              let fileUrl = URL.createObjectURL(selectedFile);

              // mettre la variable à true si l'image est chargée avec succès
              imageImported = true;
              // Appeler checkFields() pour mettre à jour le bouton modalConfirmAddPictures
              checkFields();
              console.log(selectedFile);
            };
            reader.readAsDataURL(file);
          } else {
            // Afficher un message d'erreur si le fichier dépasse la taille maximale de 4 Mo
            alert(
              "Le fichier sélectionné dépasse la taille maximale autorisée de 4 Mo."
            );
          }
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

    modalTitle.innerHTML = "Ajouter une photo";
    titleOption.innerHTML = "Titre";
    categoryOption.innerHTML = "Catégorie";

    modalWorksContainer.style.display = "none";
    modalDeleteButton.style.display = "none";
    modalConfirmAddPictures.innerHTML = "Valider";

    inputContainer.classList.add("input-container");
    modal.append(backButton);
    modal.appendChild(modalClose);
    modal.appendChild(modalTitle);
    modal.appendChild(inputContainer);
    modal.appendChild(titleBlock);
    titleBlock.appendChild(titleOption);
    titleBlock.appendChild(titleMenu);
    modal.appendChild(categoryBlock);
    categoryBlock.appendChild(categoryOption);
    categoryBlock.appendChild(categoryMenu);
    modal.appendChild(modalGreyBar);
    modal.appendChild(modalConfirmAddPictures);
    let userId;
    let category;
    let title;

    titleMenu.addEventListener("input", () => {
      checkFields();
    });

    categoryMenu.addEventListener("change", () => {
      checkFields();
      console.log(categoryMenu.options[categoryMenu.selectedIndex].value);
    });
    function checkFields() {
      title = titleMenu.value;
      category = categoryMenu.options[categoryMenu.selectedIndex].value;
      console.log(imga);

      if (imageImported && title && category) {
        modalConfirmAddPictures.classList.add("green-button");
        modalGreyBar.innerHTML = "";
      } else {
        modalConfirmAddPictures.classList.remove("green-button");
      }
    }
    modalConfirmAddPictures.addEventListener("click", () => {
      if (!modalConfirmAddPictures.classList.contains("green-button")) {
        modalGreyBar.innerHTML =
          "Veuillez remplir tous les champs du formulaire pour envoyer votre projet.";
        modalGreyBar.style.textAlign = "center";
        modalGreyBar.style.paddingTop = "10px";
      }
    });

    modalConfirmAddPictures.addEventListener("click", () => {
      userId = localStorage.getItem("userId");
      if (modalConfirmAddPictures.classList.contains("green-button")) {
        postApi(imga, userId, category);
        backButton.style.display = "none";
        inputContainer.innerHTML = "";
        titleBlock.innerHTML = "";
        categoryBlock.innerHTML = "";
        modalConfirmAddPictures.style.display = "none";
        categoryBlock.innerHTML = "";
      }
    });

    function postApi(fileUrl, userId, categoryName) {
      const formData = new FormData();
      const newtoken = localStorage.getItem("token");
      formData.append("image", fileUrl);
      formData.append("title", titleMenu.value);
      formData.append("category", categoryName);
      formData.append("userId", userId);
      console.log(formData.values());
      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${newtoken}`,
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            modalTitle.style.cssText =
              "padding: 0; font-size: 19px; position: absolute; top: 51px;";
            modalTitle.innerHTML =
              "Une erreur est survenue lors de la requête.";

            throw new Error("Une erreur est survenue lors de la requête.");
          }
          modalTitle.style.cssText =
            "padding: 0; font-size: 19px; position: absolute; top: 51px;";
          modalTitle.innerHTML = "Votre photo a correctement été ajoutée !";
          galleryUpDated();
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });

      // Révoquer l'URL
      URL.revokeObjectURL(fileUrl);
    }
  });
}
