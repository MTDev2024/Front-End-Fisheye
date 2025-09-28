# FishEye - Prototype Frontend

![Logo FishEye](assets/images/logo.png)

## 📖 Contexte

FishEye est un site web qui permet aux photographes indépendants de présenter leurs meilleurs travaux.  
Ce projet est réalisé dans le cadre de ma formation de développeur front-end.  
L’objectif : intégrer un prototype complet à partir de maquettes fournies, en respectant les bonnes pratiques d’**accessibilité** et en utilisant du **JavaScript orienté objet**.

---

## 🎯 Objectifs du projet

- Créer une **page d’accueil** listant les photographes.  
- Créer une **page photographe** affichant sa galerie (photos et vidéos).  
- Gérer les données dynamiquement à partir d’un **fichier JSON**.  
- Mettre en place un **système de tri** (popularité, date, titre).  
- Implémenter une **lightbox accessible** (clavier, ESC, focus trap).  
- Ajouter un **formulaire de contact** accessible et validé en JS.  
- Respecter les contraintes techniques : **Factory Method** pour gérer photos/vidéos.

---

## 🛠️ Technologies utilisées

- **HTML5** (sémantique, conforme W3C)  
- **CSS3** (modulaire, responsive, flexbox/grid)  
- **JavaScript ES6** (modules, classes, factory method)  
- **JSON** (données simulées côté front)

---

## 📂 Structure du projet

```bash
├── index.html              # Page d’accueil
├── photographer.html        # Page photographe
├── /css                     # Styles modulaires
├── /js                      # Modules JavaScript
│   ├── factories            # Factory Method pour médias
│   ├── models               # Classes (Media, Photographer)
│   ├── utils                # Accessibilité, focus trap
│   └── main.js              # Point d’entrée
├── /assets                  # Images, logo
├── /data                    # Fichier photographers.json
└── README.md
🚀 Lancer le projet
Cloner le repo :

bash
Copier le code
git clone https://github.com/TON-USERNAME/FishEye.git
Ouvrir le fichier index.html directement dans le navigateur.


♿ Accessibilité
Navigation au clavier (Tab, Entrée, ESC, flèches).

Lightbox avec focus trap et fermeture clavier.

Texte alternatif (alt) sur toutes les images.

Rôles ARIA sur les composants interactifs.

📸 Démonstration des fonctionnalités
Tri dynamique (popularité, date, titre)

Lightbox pour parcourir les médias

Compteur de likes mis à jour dynamiquement


---





   ```