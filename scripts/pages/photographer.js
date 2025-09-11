import { photographerTemplate } from "../templates/photographer.js";

import { getData } from "../utils/api.js";
import { mediaFactory } from "../factories/mediaFactory.js";

async function init() {
  const { photographers, media } = await getData();
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) return console.error("Photographe introuvable");

  // Header
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

  // Galerie
  const gallery = document.querySelector(".photograph-gallery");
  gallery.innerHTML = "";
  const medias = media.filter((m) => m.photographerId === id);
  medias.forEach((m) =>
    gallery.appendChild(mediaFactory(m, photographer.folder))
  );


  //Likes
  const likeButtons = document.querySelectorAll(".like-button");
  const likesTotalEl = document.querySelector(".likes");

  let totalLikes = 0;
  likeButtons.forEach(btn => {
    const countEl = btn.querySelector(".like-count");
    totalLikes += parseInt(countEl.textContent, 10);
  });
  likesTotalEl.textContent = `${totalLikes} ❤`;

  likeButtons.forEach(btn => {
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
      likesTotalEl.textContent = `${totalLikes} ❤`;
    });


 // Support clavier
    btn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

init();