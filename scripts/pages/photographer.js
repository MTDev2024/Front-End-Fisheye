// ===================================================
// SCRIPT PAGE PHOTOGRAPHE
// ===================================================

// 1. Charger les données (photographes + médias)
async function getData() {
  const response = await fetch("data/photographers.json");
  const data = await response.json();
  return {
    photographers: data.photographers,
    media: data.media
  };
}

// 2. Récupérer l'id du photographe depuis l'URL
function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");

  if (!idParam) return null;               // pas de param id
  if (!/^\d+$/.test(idParam)) return null; // sécurité: doit être numérique

  return parseInt(idParam, 10);            // conversion en nombre
}

// 3. Trouver le photographe correspondant à l'id
function findPhotographerById(photographers, id) {
  return photographers.find((photographer) => photographer.id === id);
}

// 4. Trouver tous les médias correspondant à l'id photographe
function findMediaByPhotographerId(media, id) {
  return media.filter((item) => item.photographerId === id);
}

// 5. Afficher les infos du photographe dans le header
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

  // Bouton contact (déjà présent dans le HTML)
  const contactButton = header.querySelector(".contact_button");

  // Portrait du photographe
  const portraitImg = document.createElement("img");
  portraitImg.classList.add("photograph-portrait");
  portraitImg.src = `assets/Photographers/${portrait}`;
  portraitImg.alt = name;

  // Ajouter dans heroContainer
  heroContainer.appendChild(infoContainer);    // 1. Infos
  heroContainer.appendChild(contactButton);    // 2. Bouton contact
  heroContainer.appendChild(portraitImg);      // 3. Portrait

  // Injecter dans le header
  header.appendChild(heroContainer);

  // Personnaliser la modale contact avec le nom du photographe
  const modalNameSpan = document.getElementById("photographer-name");
  if (modalNameSpan) {
    modalNameSpan.textContent = name;
  }
}

// 6. Afficher la galerie des médias
function displayGallery(medias, photographer) {
  const gallery = document.querySelector(".photograph-gallery");
  gallery.innerHTML = ""; // reset avant affichage

  medias.forEach((media) => {
    const article = document.createElement("article");
    article.classList.add("media-item");

    // image ou vidéo
    let mediaElement;
    const folderName = encodeURIComponent(photographer.folder); // sécurise les espaces/accents

    if (media.image) {
      mediaElement = document.createElement("img");
      mediaElement.src = `assets/Sample Photos/${folderName}/${media.image}`;
      mediaElement.alt = media.title; // accessibilité
    } else if (media.video) {
      mediaElement = document.createElement("video");
      mediaElement.src = `assets/Sample Photos/${folderName}/${media.video}`;
      mediaElement.setAttribute("controls", "");
      mediaElement.setAttribute("aria-label", media.title);
    }

    // Footer média
    const mediaFooter = document.createElement("div");
    mediaFooter.classList.add("media-footer"); 

    // Titre média
    const titleEl = document.createElement("h2");
    titleEl.textContent = media.title;

    // Bouton de like (❤ + compteur)
    const likeButton = document.createElement("button");
    likeButton.classList.add("like-button");
    likeButton.setAttribute("aria-label", `Aimer ${media.title}`);
    likeButton.innerHTML = `<span class="like-count">${media.likes}</span> ❤`;

    // Titre + bouton dans le footer
    mediaFooter.appendChild(titleEl);
    mediaFooter.appendChild(likeButton);

    // Assemblage
    article.appendChild(mediaElement);
    article.appendChild(mediaFooter); 

    gallery.appendChild(article);
  });
}

// 7. Init global
async function init() {
  const { photographers, media } = await getData(); // récupère tout
  const id = getPhotographerIdFromUrl();
  const photographer = findPhotographerById(photographers, id);

  if (!photographer) {
    console.error(`Aucun photographe trouvé avec l'id ${id}`);
    return;
  }

  // Affiche les infos du photographe
  displayPhotographer(photographer);

  // Filtre et affiche ses médias
  const medias = findMediaByPhotographerId(media, id);
  displayGallery(medias, photographer);
}

init();
