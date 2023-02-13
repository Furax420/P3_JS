async function init() {
  const responseWorks = await fetch("http://localhost:5678/api/works");
  const works = await responseWorks.json();
  const worksContainer = document.querySelector(".gallery");
  function addWorksToContainer(works) {
    worksContainer.innerHTML = "";
    works.forEach((work) => {
      const workElement = document.createElement("div");
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

init();
