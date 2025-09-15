import { photographerTemplate } from "../templates/photographer.js";
import { getData } from "../utils/api.js";
import { mediaFactory } from "../factories/mediaFactory.js";


// Variables globales

let allMedia = []; // Tous les médias du JSON
let medias = []; // Médias filtrés photographe courant

async function init() {
  
  // 1 - Récupération données
  
  const data = await getData();
  const photographers = data.photographers;
  allMedia = data.media; // Stockage de tous les médias globalement

  // Récuperation id photographe dans URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  // Trouver photographe correspondant
  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) return console.error("Photographe introuvable");

  
  // 2 - Header photographe
  
  const header = document.querySelector(".photograph-header");
  header.appendChild(photographerTemplate(photographer).getUserHeaderDOM());

  // Injecter nom dans modale contact
  const nameP = document.getElementById("photographer-name");
  if (nameP) {
    nameP.textContent = photographer.name;
    console.log(`Nom photographe injecté dans modale : ${photographer.name}`);
  } else {
    console.warn("Élément #photographer-name introuvable dans le DOM");
  }

  
  // 3 - Galerie
  
  const gallery = document.querySelector(".photograph-gallery");
  gallery.innerHTML = "";

  // Filtrer médias du photographe courant
  medias = allMedia.filter((m) => m.photographerId === id);

  // Afficher chaque média avec le factory
  medias.forEach((m) =>
    gallery.appendChild(mediaFactory(m, photographer.folder))
  );

  
  // 4 - Likes et prix
  
  const container = document.querySelector(".container");
  container.innerHTML = "";

  // Bloc likes
  const likesEl = document.createElement("div");
  likesEl.classList.add("likes");
  let totalLikes = medias.reduce((sum, m) => sum + m.likes, 0);
  likesEl.textContent = `${totalLikes} ❤`;

  // Bloc prix
  const priceContainer = document.createElement("div");
  priceContainer.classList.add("tjm");

  const priceElt = document.createElement("div");
  priceElt.textContent = `${photographer.price} €/jour`;
  priceElt.classList.add("photographer-price");
  priceContainer.appendChild(priceElt);

  container.append(likesEl, priceContainer);

  
  // 5 - Gestion likes médias
  
  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach((btn) => {
    let liked = false;

    btn.addEventListener("click", () => {
      const countEl = btn.querySelector(".like-count");
      let count = parseInt(countEl.textContent, 10);

      if (!liked) {
        count++;
        totalLikes++;
        liked = true;
        btn.setAttribute("aria-pressed", "true");
      } else {
        count--;
        totalLikes--;
        liked = false;
        btn.setAttribute("aria-pressed", "false");
      }

      countEl.textContent = count;
      likesEl.textContent = `${totalLikes} ❤`;
    });

    // Support clavier (Entrer ou espace)
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  
  // 6 - Lightbox
  
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = lightbox.querySelector(".lightbox-content");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  const mediaItems = document.querySelectorAll(
    ".media-item img, .media-item video"
  );

  mediaItems.forEach((media) => {
    media.addEventListener("click", () => {
      const clone = media.cloneNode(true);

      if (clone.tagName === "VIDEO") {
        clone.setAttribute("controls", "true");
        clone.setAttribute(
          "aria-label",
          media.alt || media.getAttribute("aria-label") || "Vidéo"
        );
      }

      lightboxContent.innerHTML = "";
      lightboxContent.appendChild(clone);

      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxContent.innerHTML = "";
  });

  // Gestion clavier lightbox
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("show")) return;

    switch (e.key) {
      case "Escape":
        lightbox.classList.remove("show");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxContent.innerHTML = "";
        break;
      case "ArrowRight":
        console.log("média suivant");
        break;
      case "ArrowLeft":
        console.log("média précédent");
        break;
    }
  });
}


// Initialisation

init();


// 7 - Dropdown tri

const button = document.getElementById("dropdownButton");
const list = document.getElementById("myDropdown");
const options = list.querySelectorAll("li");

// Ouvrir / fermer le menu
button.addEventListener("click", () => {
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  list.classList.toggle("show");
});

// Clic sur une option
options.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedText = option.innerText;

    // medias est maintenant accessible ici
    console.log("Critère choisi :", selectedText);
    console.log("Tableau des médias filtré :", medias);

    // Mettre à jour texte bouton
    const img = button.querySelector("img");
    button.textContent = selectedText;
    button.appendChild(img);

    // Aria selected
    options.forEach((opt) => opt.setAttribute("aria-selected", "false"));
    option.setAttribute("aria-selected", "true");

    // Fermer le menu
    button.setAttribute("aria-expanded", "false");
    list.classList.remove("show");
  });
});

// Fermer menu au clic extérieur
window.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown-wrapper")) {
    button.setAttribute("aria-expanded", "false");
    list.classList.remove("show");
  }
});
