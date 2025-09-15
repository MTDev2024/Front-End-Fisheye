import { photographerTemplate } from "../templates/photographer.js";
import { getData } from "../utils/api.js";
import { mediaFactory } from "../factories/mediaFactory.js";

async function init() {
  const { photographers, media } = await getData();
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) return console.error("Photographe introuvable");

  // --- Header ---
  const header = document.querySelector(".photograph-header");
  header.appendChild(photographerTemplate(photographer).getUserHeaderDOM());

  // Ajout nom photographe dans la modale
  const nameP = document.getElementById("photographer-name");
  if (nameP) {
    nameP.textContent = photographer.name;
    console.log(`Nom photographe injecté dans modale : ${photographer.name}`);
  } else {
    console.warn("Élément #photographer-name introuvable dans le DOM");
  }

  // --- Galerie ---
  const gallery = document.querySelector(".photograph-gallery");
  gallery.innerHTML = "";
  const medias = media.filter((m) => m.photographerId === id);
  medias.forEach((m) =>
    gallery.appendChild(mediaFactory(m, photographer.folder))
  );

  // --- Likes + TJM / prix ---
  const container = document.querySelector(".container");
  container.innerHTML = ""; // on vide le container pour réinitialiser

  // Création bloc likes
  const likesEl = document.createElement("div");
  likesEl.classList.add("likes");

  // Calcul total des likes initial
  let totalLikes = medias.reduce((sum, m) => sum + m.likes, 0);
  likesEl.textContent = `${totalLikes} ❤`;

  // Création bloc TJM / prix
  const priceContainer = document.createElement("div");
  priceContainer.classList.add("tjm");

  const priceElt = document.createElement("div");
  priceElt.textContent = `${photographer.price} €/jour`;
  priceElt.classList.add("photographer-price");

  priceContainer.appendChild(priceElt);

  // Ajout dans le container
  container.append(likesEl, priceContainer);

  // --- Gestion des likes par média ---
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

    // Support clavier (Enter ou espace)
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // --- LIGHTBOX ---
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = lightbox.querySelector(".lightbox-content");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  const mediaItems = document.querySelectorAll(
    ".media-item img, .media-item video"
  );

  // Ouvrir lightbox au click
  mediaItems.forEach((media) => {
    media.addEventListener("click", () => {
      // Cloner média pour l'afficher
      const clone = media.cloneNode(true);

      // Accessibilité vidéos : conserver les controls
      if (clone.tagName === "VIDEO") {
        clone.setAttribute("controls", "true");
        clone.setAttribute(
          "aria-label",
          media.alt || media.getAttribute("aria-label") || "Vidéo"
        );
      }

      lightboxContent.innerHTML = "";
      lightboxContent.appendChild(clone);

      // Afficher lightbox
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  // Fermer la lightbox
  closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxContent.innerHTML = "";
  });

  // --- GESTION CLAVIER ---
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

init();



// Menu Dropdown Trier
const button = document.getElementById("dropdownButton");
const list = document.getElementById("myDropdown");
const options = list.querySelectorAll("li");

// Ouvrir/fermer le menu
button.addEventListener("click", () => {
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  list.classList.toggle("show");
});

// Quand on clique sur une option
options.forEach(option => {
  option.addEventListener("click", () => {
    const selectedText = option.innerText;

    // Mettre à jour le texte du bouton en conservant l'icône
    const img = button.querySelector("img");
    button.textContent = selectedText;
    button.appendChild(img);

    // Mettre à jour aria-selected
    options.forEach(opt => opt.setAttribute("aria-selected", "false"));
    option.setAttribute("aria-selected", "true");

    // Ferme le menu
    button.setAttribute("aria-expanded", "false");
    list.classList.remove("show");
  });
});

// Fermer si clic à l'extérieur
window.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown-wrapper")) {
    button.setAttribute("aria-expanded", "false");
    list.classList.remove("show");
  }
});

