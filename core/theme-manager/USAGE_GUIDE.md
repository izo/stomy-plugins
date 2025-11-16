# Guide d'utilisation - Theme Manager

Guide pratique pour utiliser le Theme Manager dans vos composants Stomy.

## 🚀 Démarrage rapide

### 1. Activer le plugin

Dans l'application Stomy, allez dans **Paramètres > Plugins** et activez le plugin "Theme Manager".

### 2. Utiliser les variables CSS

Toutes les variables de thème sont disponibles immédiatement dans vos composants.

## 📚 Exemples pratiques

### Exemple 1 : Composant de carte

```tsx
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: `0 2px 8px var(--color-shadow)`,
        transition: 'all var(--theme-transition-duration)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface)';
      }}
    >
      <h3
        style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-foreground)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-foreground-muted)',
          lineHeight: 'var(--line-height-relaxed)',
        }}
      >
        {description}
      </p>
      {children && <div style={{ marginTop: '1rem' }}>{children}</div>}
    </div>
  );
};
```

### Exemple 2 : Boutons avec variantes

```tsx
import React from 'react';

type ButtonVariant = 'primary' | 'success' | 'warning' | 'error';

interface ButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantColors: Record<ButtonVariant, string> = {
  primary: 'var(--color-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: variantColors[variant],
        color: 'var(--color-background)',
        padding: '0.5rem 1rem',
        borderRadius: '0.25rem',
        border: 'none',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        transition: 'all var(--theme-transition-duration)',
      }}
    >
      {children}
    </button>
  );
};
```

### Exemple 3 : Input avec thème

```tsx
import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-foreground)',
          marginBottom: '0.25rem',
        }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.5rem',
          fontSize: 'var(--font-size-md)',
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-foreground)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          borderRadius: '0.25rem',
          outline: 'none',
          transition: 'border-color var(--theme-transition-duration)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? 'var(--color-error)'
            : 'var(--color-border)';
        }}
      />
      {error && (
        <span
          style={{
            display: 'block',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-error)',
            marginTop: '0.25rem',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};
```

### Exemple 4 : Badge de statut

```tsx
import React from 'react';

type BadgeStatus = 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  status: BadgeStatus;
  children: React.ReactNode;
}

const statusColors: Record<BadgeStatus, string> = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  info: 'var(--color-info)',
};

export const Badge: React.FC<BadgeProps> = ({ status, children }) => {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.5rem',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-medium)',
        backgroundColor: statusColors[status],
        color: 'var(--color-background)',
        borderRadius: '9999px',
        letterSpacing: 'var(--letter-spacing-wide)',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
};
```

### Exemple 5 : Utilisation avec CSS Modules

```css
/* BookCard.module.css */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all var(--theme-transition-duration);
}

.card:hover {
  background-color: var(--color-surface-hover);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-foreground);
  margin-bottom: 0.5rem;
}

.author {
  font-size: var(--font-size-sm);
  color: var(--color-foreground-muted);
  font-style: italic;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-primary);
  color: var(--color-background);
  border-radius: 0.25rem;
  font-size: var(--font-size-xs);
}
```

```tsx
// BookCard.tsx
import React from 'react';
import styles from './BookCard.module.css';

interface BookCardProps {
  title: string;
  author: string;
  tags: string[];
}

export const BookCard: React.FC<BookCardProps> = ({ title, author, tags }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.author}>{author}</p>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
```

### Exemple 6 : Hook personnalisé pour accéder au thème

```tsx
import { useState, useEffect } from 'react';

interface ThemeState {
  isDark: boolean;
  themeId: string;
  themeName: string;
}

export function useTheme(): ThemeState {
  const [theme, setTheme] = useState<ThemeState>(() => {
    const root = document.documentElement;
    return {
      isDark: root.classList.contains('dark'),
      themeId: root.getAttribute('data-theme-id') || 'unknown',
      themeName: root.getAttribute('data-theme-name') || 'Unknown',
    };
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const root = document.documentElement;
      setTheme({
        isDark: root.classList.contains('dark'),
        themeId: root.getAttribute('data-theme-id') || 'unknown',
        themeName: root.getAttribute('data-theme-name') || 'Unknown',
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme-id', 'data-theme-name'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

// Usage
function MyComponent() {
  const theme = useTheme();

  return (
    <div>
      <p>Theme: {theme.themeName}</p>
      <p>Mode: {theme.isDark ? 'Dark' : 'Light'}</p>
    </div>
  );
}
```

### Exemple 7 : Composant avec contraste adaptatif

```tsx
import React from 'react';

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message }) => {
  const colors = {
    info: 'var(--color-info)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: `2px solid ${colors[type]}`,
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
        }}
      >
        <div
          style={{
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            backgroundColor: colors[type],
          }}
        />
        <h4
          style={{
            fontSize: 'var(--font-size-md)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-foreground)',
          }}
        >
          {title}
        </h4>
      </div>
      <p
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-foreground-alt)',
          lineHeight: 'var(--line-height-relaxed)',
          marginLeft: '2rem',
        }}
      >
        {message}
      </p>
    </div>
  );
};
```

## 🎨 Tailwind CSS Integration

Si vous utilisez Tailwind CSS, vous pouvez étendre la configuration pour utiliser les variables du thème :

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',
        background: 'var(--color-background)',
        'background-alt': 'var(--color-background-alt)',
        foreground: 'var(--color-foreground)',
        'foreground-alt': 'var(--color-foreground-alt)',
        'foreground-muted': 'var(--color-foreground-muted)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      fontFamily: {
        sans: 'var(--font-family)',
        mono: 'var(--font-family-mono)',
      },
    },
  },
};
```

Usage avec Tailwind :

```tsx
<div className="bg-surface border border-border rounded-lg p-4">
  <h3 className="text-lg font-semibold text-foreground">Titre</h3>
  <p className="text-sm text-foreground-muted">Description</p>
</div>
```

## 🔄 Réagir aux changements de thème

```tsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark');
      console.log('Theme changed:', isDark ? 'dark' : 'light');

      // Effectuer des actions spécifiques au changement de thème
      // Par exemple, recharger des images, ajuster des graphiques, etc.
    };

    const observer = new MutationObserver(handleThemeChange);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return <div>...</div>;
}
```

## 🎭 Mode sombre dynamique

```tsx
import React, { useState, useEffect } from 'react';

export const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <button
      style={{
        padding: '0.5rem',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '0.25rem',
        cursor: 'pointer',
      }}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};
```

## 🎯 Best Practices

1. **Toujours utiliser les variables CSS** pour les couleurs et la typographie
2. **Respecter les transitions** en utilisant `var(--theme-transition-duration)`
3. **Tester en mode clair et sombre** pour vérifier la lisibilité
4. **Utiliser les couleurs sémantiques** (success, error, warning, info) pour les états
5. **Éviter les couleurs en dur** dans le code
6. **Respecter l'accessibilité** en testant avec le mode contraste élevé

## 🐛 Débogage

### Vérifier les variables CSS

```javascript
// Dans la console du navigateur
const root = document.documentElement;
const styles = getComputedStyle(root);

// Vérifier une variable spécifique
console.log(styles.getPropertyValue('--color-primary'));

// Lister toutes les variables de couleur
Array.from(styles).filter(name => name.startsWith('--color-')).forEach(name => {
  console.log(name, styles.getPropertyValue(name));
});
```

### Forcer un thème pour les tests

```javascript
// Mode sombre
document.documentElement.classList.add('dark');

// Mode clair
document.documentElement.classList.remove('dark');

// Contraste élevé
document.documentElement.classList.add('high-contrast');
```

## 📚 Ressources supplémentaires

- [Nord Theme](https://www.nordtheme.com/)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
