# Theme Manager Plugin

Un système de gestion de thèmes complet pour Stomy, permettant de personnaliser les couleurs et la typographie de l'application.

## 🎨 Caractéristiques

- **Thèmes complets** : Couleurs et typographie pour toute l'application
- **Mode sombre** : Chaque thème inclut une variante sombre
- **Thème Nord** : Premier thème basé sur [Nord Theme](https://www.nordtheme.com/)
- **Auto-switch** : Synchronisation automatique avec les préférences système
- **CSS Variables** : Application via variables CSS pour une intégration facile
- **Transitions** : Animations fluides lors des changements de thème
- **Accessibilité** : Options de contraste élevé et mouvement réduit
- **CSS personnalisé** : Possibilité d'ajouter des règles CSS personnalisées
- **Sidebar** : Interface dédiée pour gérer les thèmes

## 📦 Installation

Le plugin est situé dans `core/theme-manager/` et doit être importé dans l'application principale Stomy.

```typescript
import { themeManagerPlugin } from './core/theme-manager';
await pluginManager.registerPlugin(themeManagerPlugin);
```

## 🎯 Thème Nord

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
