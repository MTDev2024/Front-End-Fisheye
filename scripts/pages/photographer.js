// Import modules 
import { photographerTemplate } from "../templates/photographer.js"; // Template HTML pour le photographe
import { getData } from "../utils/api.js"; // Fonction pour récupérer le JSON
import { mediaFactory } from "../factories/mediaFactory.js"; // Factory pour créer les éléments médias


// 1 - Variables globales


// Stocke tous les médias du JSON
let allMedia = [];

// Médias filtrés du photographe courant
let medias = [];

// Galerie photographe courant (déclarée ici pour être accessible depuis le tri)
let gallery;


// 2 - Fonction principale init()

async function init() {

  // ---- 2.1 - Récupération des données ----
  const data = await getData(); // récupération du JSON
  const photographers = data.photographers; // tableau de tous les photographes
  allMedia = data.media; // tableau de tous les médias

  // Récupération id photographe depuis URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10); // Convertir en nombre

  // Trouver photographe correspondant
  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) return console.error("Photographe introuvable");

  // ---- 2.2 - Header photographe ----
  const header = document.querySelector(".photograph-header");
  header.appendChild(photographerTemplate(photographer).getUserHeaderDOM());

  // Injecter nom photographe modale contact
  const nameP = document.getElementById("photographer-name");
  if (nameP) {
    nameP.textContent = photographer.name;
    console.log(`Nom photographe injecté dans modale : ${photographer.name}`);
  }

  // ---- 2.3 - Galerie ----
  gallery = document.querySelector(".photograph-gallery");
  gallery.innerHTML = ""; // Reset galerie avant ajout médias

  // Filtrer médias photographe courant
  medias = allMedia.filter((m) => m.photographerId === id);

  // Afficher chaque média
  medias.forEach((m) => {
    gallery.appendChild(mediaFactory(m, photographer.folder));
  });

  // ---- 2.4 - Likes et prix ----
  const container = document.querySelector(".container");
  container.innerHTML = "";

  // Bloc total likes
  const likesEl = document.createElement("div");
  likesEl.classList.add("likes");
  let totalLikes = medias.reduce((sum, m) => sum + m.likes, 0);
  likesEl.textContent = `${totalLikes} ❤`;

  // Bloc prix (TJM)
  const priceContainer = document.createElement("div");
  priceContainer.classList.add("tjm");
  const priceElt = document.createElement("div");
  priceElt.textContent = `${photographer.price} €/jour`;
  priceElt.classList.add("photographer-price");
  priceContainer.appendChild(priceElt);

  container.append(likesEl, priceContainer);

  // ---- 2.5 - Gestion likes / média ----
  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach((btn) => {
    let liked = false; // état du bouton (aimé ou non)

    btn.addEventListener("click", () => {
      const countEl = btn.querySelector(".like-count");
      let count = parseInt(countEl.textContent, 10);

      if (!liked) {
        count++;
        totalLikes++;
        liked = true;
        btn.setAttribute("aria-pressed", "true"); // accessibilité
      } else {
        count--;
        totalLikes--;
        liked = false;
        btn.setAttribute("aria-pressed", "false");
      }

      // Mettre à jour affichage
      countEl.textContent = count;
      likesEl.textContent = `${totalLikes} ❤`;
    });

    // Support clavier Entrer ou espace
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // ---- 2.6 - Lightbox ----
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = lightbox.querySelector(".lightbox-content");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  // Sélection tous les médias visibles (img + vidéo)
  const mediaItems = document.querySelectorAll(".media-item img, .media-item video");

  // Ouvrir lightbox au clic
  mediaItems.forEach((media) => {
    media.addEventListener("click", () => {
      const clone = media.cloneNode(true);

      // Si vidéo, ajouter controles + aria-label
      if (clone.tagName === "VIDEO") {
        clone.setAttribute("controls", "true");
        clone.setAttribute(
          "aria-label",
          media.alt || media.getAttribute("aria-label") || "Vidéo"
        );
      }

      lightboxContent.innerHTML = ""; // vider contenu
      lightboxContent.appendChild(clone);
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  // Fermer lightbox
  closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxContent.innerHTML = "";
  });

  // Navigation clavier dans lightbox
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

  // ---- 2.7 - Dropdown tri (dans init pour avoir accès à gallerie et medias) ----
  const button = document.getElementById("dropdownButton");
  const list = document.getElementById("myDropdown");
  const options = list.querySelectorAll("li");

  // Ouvrir / fermer le menu
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    list.classList.toggle("show");
  });

  // Clic option tri
  options.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedText = option.innerText;
      console.log("Critère choisi :", selectedText);
      console.log("Tableau des médias filtré :", medias);

      // --- Tri selon l'option ---
      if (selectedText === "Date") {
        // Tri décroissant date
        medias.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      if (selectedText === "Popularité") {
        // Tri décroissant  likes
        medias.sort((a, b) => b.likes - a.likes);
      }
      if (selectedText === "Titre") {
       // Tri alphabétique, insensible à la casse
      medias.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
      }





      // --- Recréation galerie après tri ---
      gallery.innerHTML = "";
      medias.forEach((m) => gallery.appendChild(mediaFactory(m, photographer.folder)));
      

      // --- Mise à jour texte bouton ---
      const img = button.querySelector("img");
      button.textContent = selectedText;
      button.appendChild(img);

      // --- Accessibilité ---
      options.forEach((opt) => opt.setAttribute("aria-selected", "false"));
      option.setAttribute("aria-selected", "true");

      // Fermer menu
      button.setAttribute("aria-expanded", "false");
      list.classList.remove("show");
    });
  });

  // Fermer le menu si clic à l'extérieur
  window.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown-wrapper")) {
      button.setAttribute("aria-expanded", "false");
      list.classList.remove("show");
    }
  });
}


// 3 - Lancement

init();
