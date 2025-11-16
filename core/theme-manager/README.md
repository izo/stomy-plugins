# Theme Manager Plugin

Un système de gestion de thèmes complet pour Stomy, permettant de personnaliser les couleurs et la typographie de l'application.

## 🎨 Caractéristiques

### Thèmes
- **9 thèmes populaires intégrés** : Nord, Dracula, Catppuccin, Atom One, Material, Vue, Lumon, Cyberpunk 2077, Neon Cyberpunk
- **Import/Export de thèmes personnalisés** : Créez et partagez vos propres thèmes
- **Stockage dans AppData** : Thèmes personnalisés sauvegardés localement en JSON
- **Modes clair & sombre** : Chaque thème inclut une variante light et dark

### Fonctionnalités
- **Auto-switch** : Synchronisation automatique avec les préférences système
- **Prévisualisation** : Testez un thème temporairement (5s) avant de l'appliquer
- **40+ variables CSS** : Couleurs, typographie, espacements
- **Transitions fluides** : Animations configurables avec throttling
- **Accessibilité** : Options de contraste élevé et mouvement réduit
- **CSS personnalisé** : Ajout de règles CSS avec validation de sécurité
- **Sidebar dédiée** : Interface pour gérer et prévisualiser les thèmes
- **Analytics optionnel** : Tracking des changements de thèmes

## 📦 Installation

Le plugin est situé dans `core/theme-manager/` et doit être importé dans l'application principale Stomy.

```typescript
import { themeManagerPlugin } from './core/theme-manager';
await pluginManager.registerPlugin(themeManagerPlugin);
```

## 🎨 Thèmes disponibles

Le plugin inclut 9 thèmes soigneusement sélectionnés, chacun avec une variante claire et sombre :

### 1. **Nord** (Défaut)
- **Auteur** : Arctic Ice Studio
- **Source** : [nordtheme.com](https://www.nordtheme.com/)
- **Description** : Palette arctique avec des tons bleus apaisants
- **Tags** : cool, blue, professional, arctic

### 2. **Dracula**
- **Auteur** : Zeno Rocha
- **Source** : [draculatheme.com](https://draculatheme.com/)
- **Description** : Thème sombre avec des couleurs vibrantes
- **Tags** : dark, vibrant, purple, popular

### 3. **Catppuccin Frappé**
- **Auteur** : Catppuccin
- **Source** : [github.com/catppuccin/catppuccin](https://github.com/catppuccin/catppuccin)
- **Description** : Thème pastel apaisant avec des couleurs subtiles
- **Tags** : pastel, soothing, purple, popular

### 4. **Atom One**
- **Auteur** : GitHub/Atom
- **Source** : [github.com/atom/one-light-syntax](https://github.com/atom/one-light-syntax)
- **Description** : Thème professionnel et épuré
- **Tags** : professional, clean, popular

### 5. **Material**
- **Auteur** : Mattia Astorino
- **Source** : [github.com/material-theme/vsc-material-theme](https://github.com/material-theme/vsc-material-theme)
- **Description** : Basé sur le Material Design de Google
- **Tags** : material-design, google, teal, popular

### 6. **Vue**
- **Auteur** : Mario Rodeghiero
- **Source** : [github.com/mariorodeghiero/vue-theme-vscode](https://github.com/mariorodeghiero/vue-theme-vscode)
- **Description** : Inspiré par l'identité visuelle de Vue.js
- **Tags** : vue, green, cyan, framework

### 7. **Lumon**
- **Auteur** : Conner Luzier
- **Source** : [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=cluzier.lumon)
- **Description** : Esthétique corporate froide inspirée de la série Severance
- **Tags** : severance, corporate, teal, cold

### 8. **Cyberpunk 2077**
- **Auteur** : Endormi
- **Source** : [github.com/endormi/vscode-2077-theme](https://github.com/endormi/vscode-2077-theme)
- **Description** : Néons inspirés du jeu Cyberpunk 2077
- **Tags** : cyberpunk, neon, futuristic, gaming

### 9. **Neon Cyberpunk**
- **Auteur** : Roboron3042
- **Source** : [github.com/Roboron3042/Cyberpunk-Neon](https://github.com/Roboron3042/Cyberpunk-Neon)
- **Description** : Thème cyberpunk à fort contraste avec néons vibrants
- **Tags** : cyberpunk, neon, vibrant, high-contrast

## 🎯 Thème Nord (Détails)

Le thème Nord est une palette de couleurs arctique, nord-bluish, conçue pour un environnement de travail agréable et productif.

### Palette de couleurs

**Polar Night** (couleurs sombres)
- `#2e3440` - Base
- `#3b4252` - Plus clair
- `#434c5e` - Encore plus clair
- `#4c566a` - Le plus clair

**Snow Storm** (couleurs claires)
- `#d8dee9` - Le plus sombre
- `#e5e9f0` - Moyen
- `#eceff4` - Base

**Frost** (bleus)
- `#8fbcbb` - Cyan
- `#88c0d0` - Cyan clair
- `#81a1c1` - Bleu clair
- `#5e81ac` - Bleu

**Aurora** (accents)
- `#bf616a` - Rouge
- `#d08770` - Orange
- `#ebcb8b` - Jaune
- `#a3be8c` - Vert
- `#b48ead` - Violet

## 📁 Stockage des thèmes

### Thèmes intégrés (built-in)
Les 9 thèmes par défaut sont hardcodés dans `/core/theme-manager/themes.ts`. Ils ne peuvent pas être modifiés ou supprimés.

### Thèmes personnalisés (custom)
Les thèmes importés par l'utilisateur sont sauvegardés dans :

**Chemin** : `~/.stomy/themes/` (AppData)

```
~/.stomy/themes/
├── my-custom-theme.json
├── imported-theme-1.json
└── shared-theme-abc.json
```

Chaque fichier JSON contient un objet `Theme` complet avec toutes les propriétés requises.

### Import/Export de thèmes

**Export** :
1. Allez dans Settings > Theme Manager
2. Cliquez sur "Exporter le thème actuel"
3. Le JSON est copié dans le presse-papiers
4. Partagez-le avec d'autres utilisateurs

**Import** :
1. Copiez le JSON du thème dans le presse-papiers
2. Allez dans Settings > Theme Manager
3. Cliquez sur "Importer un thème (presse-papiers)"
4. Le thème est validé, sauvegardé dans `~/.stomy/themes/` et ajouté à la liste

**Suppression** :
1. Sélectionnez un thème personnalisé
2. Cliquez sur "Supprimer le thème actuel (si personnalisé)"
3. Confirmez la suppression
4. Le fichier JSON est supprimé et le thème est retiré de la liste

Note : Les thèmes intégrés ne peuvent pas être supprimés.

## 🔧 Utilisation

### Variables CSS disponibles

Le plugin applique automatiquement les variables CSS suivantes :

#### Couleurs

```css
/* Couleurs primaires */
--color-primary
--color-primary-dark
--color-primary-light

/* Arrière-plans */
--color-background
--color-background-alt
--color-background-elevated

/* Texte */
--color-foreground
--color-foreground-alt
--color-foreground-muted

/* Surfaces */
--color-surface
--color-surface-alt
--color-surface-hover

/* Accents */
--color-accent
--color-accent-alt

/* Sémantiques */
--color-success
--color-warning
--color-error
--color-info

/* Bordures */
--color-border
--color-border-alt

/* Spéciales */
--color-highlight
--color-shadow
```

#### Typographie

```css
/* Familles de police */
--font-family
--font-family-mono

/* Tailles de police */
--font-size-xs    /* 12px */
--font-size-sm    /* 14px */
--font-size-md    /* 16px */
--font-size-lg    /* 18px */
--font-size-xl    /* 20px */
--font-size-2xl   /* 24px */
--font-size-3xl   /* 30px */

/* Hauteurs de ligne */
--line-height-tight
--line-height-normal
--line-height-relaxed

/* Poids de police */
--font-weight-normal
--font-weight-medium
--font-weight-semibold
--font-weight-bold

/* Espacement des lettres */
--letter-spacing-tight
--letter-spacing-normal
--letter-spacing-wide
```

### Utilisation dans les composants

```tsx
// Exemple de composant React utilisant les variables de thème
const MyComponent = () => {
  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-foreground)',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid var(--color-border)',
    }}>
      <h1 style={{
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-primary)',
      }}>
        Titre
      </h1>
      <p style={{
        fontSize: 'var(--font-size-md)',
        lineHeight: 'var(--line-height-normal)',
      }}>
        Contenu
      </p>
    </div>
  );
};
```

### Utilisation dans CSS/SCSS

```css
.my-component {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-family);
  font-size: var(--font-size-md);
}

.button-primary {
  background-color: var(--color-primary);
  color: var(--color-background);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color var(--theme-transition-duration);
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}

.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 4px var(--color-shadow);
}
```

## ⚙️ Configuration

### Paramètres disponibles

```typescript
interface ThemeManagerSettings {
  currentTheme: string;           // ID du thème actuel
  isDarkMode: boolean;            // Mode sombre manuel
  autoSwitchDarkMode: boolean;    // Suivre les préférences système
  customCss?: string;             // CSS personnalisé
  enableTransitions: boolean;     // Activer les transitions
  transitionDuration: number;     // Durée des transitions (ms)
  highContrast: boolean;          // Contraste élevé
  reducedMotion: boolean;         // Mouvement réduit
}
```

### Valeurs par défaut

```typescript
{
  currentTheme: 'nord',
  isDarkMode: false,
  autoSwitchDarkMode: true,
  customCss: '',
  enableTransitions: true,
  transitionDuration: 200,
  highContrast: false,
  reducedMotion: false,
}
```

## 🎬 Actions

Le plugin expose plusieurs actions :

- **Basculer mode sombre** : Toggle entre mode clair et sombre
- **Liste des thèmes** : Affiche tous les thèmes disponibles
- **Appliquer Nord** : Applique le thème Nord
- **Activer/désactiver transitions** : Toggle les animations
- **Contraste élevé** : Toggle le mode contraste élevé
- **Exporter le thème actuel** : Exporte la configuration du thème

## 🧩 Intégration Tauri

Le plugin utilise uniquement des APIs web standard et ne nécessite pas de commandes Tauri spécifiques. Il est compatible avec :

- Applications Tauri (desktop)
- Applications web standard
- Progressive Web Apps (PWA)

## 🎨 Ajouter de nouveaux thèmes

Pour ajouter un nouveau thème, éditez `themes.ts` :

```typescript
const myTheme: Theme = {
  id: 'my-theme',
  name: 'Mon Thème',
  description: 'Description de mon thème',
  author: 'Votre Nom',
  version: '1.0.0',
  light: {
    // Palette de couleurs pour le mode clair
    primary: '#...',
    // ... autres couleurs
  },
  dark: {
    // Palette de couleurs pour le mode sombre
    primary: '#...',
    // ... autres couleurs
  },
  typography: defaultTypography,
  tags: ['tag1', 'tag2'],
};

// Ajouter à la liste des thèmes
export const THEMES: Theme[] = [
  nordTheme,
  myTheme, // <-- Nouveau thème
];
```

## 🔒 Sécurité

- Le CSS personnalisé est injecté dans une balise `<style>` dédiée
- Aucune exécution de JavaScript arbitraire
- Validation des valeurs de couleur et de typographie
- Isolation des styles via CSS variables

## 📱 Accessibilité

Le plugin supporte plusieurs fonctionnalités d'accessibilité :

- **Contraste élevé** : Augmente le contraste des couleurs
- **Mouvement réduit** : Désactive les animations
- **Synchronisation système** : Respecte les préférences système
- **Classes CSS dédiées** : `.high-contrast`, `.reduced-motion`, `.dark`

## 🔌 API programmatique

Le plugin exporte plusieurs fonctions pour une utilisation programmatique :

### Gestion des thèmes personnalisés

```typescript
import {
  saveCustomTheme,
  loadCustomTheme,
  loadAllCustomThemes,
  deleteCustomTheme,
  listCustomThemeIds,
  isCustomTheme,
  exportThemeToJson,
  reloadCustomThemes,
} from '@/core/theme-manager';

// Sauvegarder un thème personnalisé
await saveCustomTheme(myTheme);

// Charger un thème spécifique
const result = await loadCustomTheme('my-theme-id');
if (result.success) {
  console.log(result.theme);
}

// Charger tous les thèmes personnalisés
const customThemes = await loadAllCustomThemes();

// Supprimer un thème
await deleteCustomTheme('theme-id');

// Lister les IDs des thèmes personnalisés
const ids = await listCustomThemeIds();

// Vérifier si un thème est personnalisé
const isCustom = await isCustomTheme('theme-id');

// Exporter un thème en JSON
const json = exportThemeToJson(theme, isDarkMode);

// Recharger les thèmes depuis le disque
await reloadCustomThemes();
```

### Autres fonctions utiles

```typescript
import {
  previewTheme,
  importTheme,
  validateCustomCss,
  validateSettings,
  migrateSettings,
  trackEvent,
} from '@/core/theme-manager';

// Prévisualiser un thème pendant 5 secondes
const preview = previewTheme('dracula', true, 5000);
// Annuler la prévisualisation
preview.cancel();

// Importer un thème depuis JSON
const result = await importTheme(jsonString);

// Valider du CSS personnalisé
const validation = validateCustomCss('.my-class { color: red; }');
if (!validation.valid) {
  console.error(validation.error);
}

// Valider les settings
const validatedSettings = validateSettings(rawSettings);

// Migrer des settings d'une ancienne version
const migratedSettings = migrateSettings(oldSettings);

// Tracker un événement (analytics)
trackEvent('custom_event', { key: 'value' });
```

## 🐛 Débogage

Pour déboguer le plugin :

```javascript
// Vérifier le thème actuel
console.log(document.documentElement.getAttribute('data-theme-id'));

// Vérifier les variables CSS
console.log(getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));

// Lister toutes les variables de thème
const allVars = getComputedStyle(document.documentElement);
for (let i = 0; i < allVars.length; i++) {
  const name = allVars[i];
  if (name.startsWith('--color-') || name.startsWith('--font-')) {
    console.log(name, allVars.getPropertyValue(name));
  }
}
```

## 📄 Licence

Ce plugin fait partie de l'écosystème Stomy et suit la même licence que l'application principale.

## 👥 Auteurs

- Stomy Team
- Nord Theme par Arctic Ice Studio

## 🔗 Liens utiles

- [Nord Theme](https://www.nordtheme.com/)
- [Documentation Stomy](https://github.com/izo/Stomy)
- [Plugin System Guide](../dummy-plugin/DEVELOPMENT_GUIDE.md)
