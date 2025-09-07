// 1. Charger les données
async function getPhotographers() {
  const reponse = await fetch("data/photographers.json");
  const data = await reponse.json();
  return { photographers: data.photographers };
}

// 2. Récupérer id <- URL
function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");

  if (!idParam) return null;
  if (!/^\d+$/.test(idParam)) return null;

  return parseInt(idParam, 10);
}

// 3. Trouver photographe correspondant
function findPhotographerById(photographers, id) {
  return photographers.find((photographer) => photographer.id === id);
}

// 4. Afficher infos photographe dans la section
function displayPhotographer(photographer) {
  const header = document.querySelector(".photograph-header");
  const { name, city, country, tagline, portrait } = photographer;

  // Container principal hero
  const heroContainer = document.createElement("div");
  heroContainer.classList.add("photograph-hero");

  // Left container (texte)
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("photograph-info");

  const h1 = document.createElement("h1");
  h1.classList.add("photograph-name");
  h1.textContent = name;

  const locationEl = document.createElement("p");
  locationEl.classList.add("photograph-location");
  locationEl.textContent = `${city}, ${country}`;

  const taglineEl = document.createElement("p");
  taglineEl.classList.add("photograph-tagline");
  taglineEl.textContent = tagline;

  infoContainer.appendChild(h1);
  infoContainer.appendChild(locationEl);
  infoContainer.appendChild(taglineEl);

  // Bouton contact (on ne le déplace pas)
  const contactButton = header.querySelector(".contact_button");

  // Portrait
  const portraitImg = document.createElement("img");
  portraitImg.classList.add("photograph-portrait");
  portraitImg.src = `assets/photographers/${portrait}`;
  portraitImg.alt = name;

  // Ajouter dans heroContainer dans l'ordre voulu
  heroContainer.appendChild(infoContainer);    // 1. Infos
  heroContainer.appendChild(contactButton);    // 2. Bouton contact
  heroContainer.appendChild(portraitImg);     // 3. Portrait

  // Injecter dans le header
  header.appendChild(heroContainer);

  // 🔹 Personnaliser la modale de contact avec le prénom/nom du photographe
  const modalNameSpan = document.getElementById("photographer-name");
  if (modalNameSpan) {
    modalNameSpan.textContent = name;
  }
}

// 5. Init global
async function init() {
  const { photographers } = await getPhotographers();
  const id = getPhotographerIdFromUrl();
  const photographer = findPhotographerById(photographers, id);

  if (!photographer) {
    console.error(`Aucun photographe trouvé avec l'id ${id}`);
    return;
  }

  displayPhotographer(photographer);
}

init();
