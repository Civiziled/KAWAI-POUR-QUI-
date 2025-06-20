# 🎮 Memory Kawaii

Un jeu de memory adorable et coloré créé avec HTML, CSS et JavaScript vanilla !

## ✨ Fonctionnalités

### 🎯 Fonctionnalités de base
- **Écran d'accueil** avec logo, sélection de difficulté et bouton de démarrage
- **Plateau de jeu dynamique** avec CSS Grid
- **Mélange automatique** des cartes au début de chaque partie
- **Logique de jeu complète** : retournement, vérification des paires, gestion des erreurs
- **Écran de victoire** avec statistiques et bouton de rejeu

### 🎨 Design et animations
- **Design kawaii** avec des couleurs pastel et des formes arrondies
- **Animations fluides** : flip des cartes, apparition, hover effects
- **Effets de particules** lors des paires trouvées et de la victoire
- **Design responsive** qui s'adapte à tous les écrans
- **Effets sonores** générés avec l'API Web Audio

### 🏆 Fonctionnalités avancées
- **3 niveaux de difficulté** :
  - Facile : 4x4 (8 paires)
  - Moyen : 6x6 (18 paires)
  - Difficile : 8x8 (32 paires)
- **Compteur de coups** et **chronomètre**
- **Sauvegarde des scores** dans le localStorage
- **Préchargement des images** pour de meilleures performances

## 🎮 Comment jouer

1. **Démarrage** : Clique sur "Jouer" depuis l'écran d'accueil
2. **Sélection de difficulté** : Choisis le niveau au menu principal
3. **Jeu** : Clique sur les cartes pour les retourner et trouver les paires
4. **Victoire** : Trouve toutes les paires pour gagner !

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : 
  - Grid Layout pour le plateau
  - Flexbox pour la mise en page
  - Animations et transitions CSS
  - Design responsive avec media queries
- **JavaScript ES6+** :
  - Logique de jeu complète
  - Gestion des événements
  - API Web Audio pour les sons
  - localStorage pour la sauvegarde

## 📁 Structure du projet

```
KAWAIIII/
├── index.html          # Page principale
├── src/
│   ├── main.js         # Logique du jeu
│   └── style.css       # Styles et animations
├── images/
│   ├── animals/        # Images des cartes
│   ├── logo.png        # Logo du jeu
│   ├── start.png       # Icône de démarrage
│   ├── restart.png     # Icône de rejeu
│   └── win.png         # Image de victoire
└── README.md           # Documentation
```

## 🚀 Installation et lancement

1. **Clone le projet** ou télécharge les fichiers
2. **Ouvre un terminal** dans le dossier du projet
3. **Lance le serveur de développement** :
   ```bash
   npm run dev
   ```
4. **Ouvre ton navigateur** à l'adresse indiquée (généralement `http://localhost:5173`)

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies dans les variables CSS :
```css
:root {
    --primary-color: #ff6b9d;    /* Rose principal */
    --secondary-color: #4ecdc4;  /* Turquoise */
    --accent-color: #ffe66d;     /* Jaune */
}
```

### Images
Pour changer les images des cartes :
1. Remplace les fichiers dans `images/animals/`
2. Mets à jour le tableau `images` dans `main.js`

### Difficultés
Pour modifier les niveaux de difficulté, édite l'objet `difficulties` dans `main.js` :
```javascript
const difficulties = {
    easy: { rows: 4, cols: 4, pairs: 8 },
    medium: { rows: 6, cols: 6, pairs: 18 },
    hard: { rows: 8, cols: 8, pairs: 32 }
};
```

## 🏆 Système de score

Le jeu sauvegarde automatiquement :
- Le nombre de coups
- Le temps de jeu
- Le niveau de difficulté
- La date de la partie

Les 10 meilleurs scores sont conservés par difficulté.

## 🎵 Effets sonores

Le jeu utilise l'API Web Audio pour générer des sons :
- **Flip** : Son aigu lors du retournement d'une carte
- **Match** : Son de victoire lors d'une paire trouvée
- **Wrong** : Son grave lors d'une erreur
- **Start/Restart** : Sons de démarrage

## 📱 Compatibilité

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile (responsive design)

## 🤝 Contribution

Ce projet est un exercice d'apprentissage. N'hésite pas à :
- Améliorer le design
- Ajouter de nouvelles fonctionnalités
- Optimiser les performances
- Corriger des bugs

## 📄 Licence

Ce projet est libre d'utilisation pour des fins éducatives et personnelles.

---

**Amuse-toi bien avec Memory Kawaii ! 🎮✨** # Examen-Kawain-haha
# KAWAI-POUR-QUI-
# KAWAI-POUR-QUI-
