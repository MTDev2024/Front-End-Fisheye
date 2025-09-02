// templates/photographer.js

function photographerTemplate(data) {
  // Décomposition (destructuring) de l'objet `data` :
  // on extrait directement `name` et `portrait` depuis l'objet passé en paramètre.
  const { name, portrait, city, country, tagline, price } = data;

  // Construit le chemin de l'image à partir du nom de fichier `portrait`.
  // Ce chemin est relatif à la page HTML (index.html) qui charge ce script.
  const picture = `assets/photographers/${portrait}`;

  // Fonction interne qui crée et retourne la carte DOM pour ce photographe
  function getUserCardDOM() {
    // Création d'un <article> qui contiendra l'image + le nom
    const article = document.createElement("article");

    // Création d'une balise <img> et insertion de sa source
    const img = document.createElement("img");
    img.setAttribute("src", picture); // définit l'attribut src

    // Création d'un <h2> pour afficher le nom
    const h2 = document.createElement("h2");
    h2.textContent = name; // on met le nom à l'intérieur du <h2>

    // Création d'un <h3> pour afficher "Ville, Pays"
    const h3 = document.createElement("h3");
    h3.textContent = `${city}, ${country}`; // interpolation pour concaténer city et country

    const p = document.createElement("p");
    p.textContent = tagline; 

    const span = document.createElement("span");
    span.textContent = `${price} €/jour`;


    // On attache les éléments enfants à l'<article>
    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(h3);
    article.appendChild(p);
    article.appendChild(span);


    // On retourne l'élément <article> complet, prêt à être inséré dans le DOM
    return article;
  }

  // On retourne un objet contenant :
  // - name et picture (données utiles ailleurs)
  // - getUserCardDOM (fonction qui fabrique la carte DOM quand on en a besoin)
  return { name, picture, getUserCardDOM };
}
