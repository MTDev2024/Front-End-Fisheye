

// Fonction qui récupère le JSON
async function getPhotographers() {
    // On charge le fichier JSON
    const reponse = await fetch("data/photographers.json");
    const data = await reponse.json();
    console.log(data); // Affiche tout le contenu du JSON

    // On retourne uniquement le tableau de photographes
    return {
        photographers: data.photographers
    };
}

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
             // On utilise le template pour générer la carte
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        displayData(photographers);
    }
    
    init();
    
