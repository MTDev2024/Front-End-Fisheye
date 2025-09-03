// templates/photographer.js

function photographerTemplate(data) {
  // Décomposition (destructuring) de l'objet `data` :
  // on extrait directement `name` et `portrait` depuis l'objet passé en paramètre.
  const {id, name, portrait, city, country, tagline, price } = data;

  // Construit le chemin de l'image à partir du nom de fichier `portrait`.
  // Ce chemin est relatif à la page HTML (index.html) qui charge ce script.
  const picture = `assets/photographers/${portrait}`;

  // Fonction interne qui crée et retourne la carte DOM pour ce photographe
  function getUserCardDOM() {
    // Création d'un <article> qui contiendra l'image + le nom
    const article = document.createElement("article");
    article.classList.add("photographer-card");

    // Création d'une balise <img> et insertion de sa source
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute(
      "alt",
      `Portrait de ${name}, photographe à ${city}, ${country}`
    );
    img.classList.add("photographer-portrait");
    // img.style.objectPosition = data.objectPosition || "center";
    // "objectPosition": "center 20%" -> dans le json

    // Création d'un <h2> pour afficher le nom
    const h2 = document.createElement("h2");
    h2.textContent = name; // on met le nom à l'intérieur du <h2>
    h2.classList.add("photographer-name");

    // Création d'une <p> pour afficher "Ville, Pays"
    const location = document.createElement("p");
    location.textContent = `${city}, ${country}`; // interpolation pour concaténer city et country
    location.classList.add("photographer-location");

    const taglineElt = document.createElement("p");
    taglineElt.textContent = tagline;
    taglineElt.classList.add("photographer-tagline");

    const priceElt = document.createElement("p");
    priceElt.textContent = `${price} €/jour`;
    priceElt.classList.add("photographer-price");

    // On attache les éléments enfants à l'<article>
    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(location);
    article.appendChild(taglineElt);
    article.appendChild(priceElt);

    // On retourne l'élément <article> complet, prêt à être inséré dans le DOM
    return article;
  }

  // On retourne un objet contenant :
  // - name et picture (données utiles ailleurs)
  // - getUserCardDOM (fonction qui fabrique la carte DOM quand on en a besoin)
  return { name, picture, city, country, tagline, price, getUserCardDOM };
}
