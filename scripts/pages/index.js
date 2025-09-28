import { photographerTemplate } from '../templates/photographer.js';

// Recuperation JSON
async function getPhotographers() {
  // Chargement JSON
  const reponse = await fetch('data/photographers.json');
  const data = await reponse.json();
  // console.log(data); // Affichage contenu du JSON

  // Retourne uniquement tableau photographes
  return {
    photographers: data.photographers,
  };
}

async function displayData(photographers) {
  const photographersSection = document.querySelector('.photographer_section');

  photographers.forEach((photographer) => {
    // Utilisation du template pour generer la carte
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Recuperation des datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
