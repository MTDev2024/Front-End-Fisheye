const reponse = await fetch('photographers.json');
const data = await reponse.json();
const medias = data.media;

for (let i = 0; i < medias.length; i++) {
  const media = medias[i];
  // Affichage ou traitement de chaque média
}




// Recuperation JSON
async function getMedia() {
  // Chargement JSON
  const reponse = await fetch("data/photographers.json");
  const data = await reponse.json();
  console.log(data); // Affichage contenu du JSON

  // Retourne uniquement tableau media
  return {
    media: data.media,
  };
}