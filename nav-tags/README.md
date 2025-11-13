# Nav Tags Plugin

Plugin de navigation par tags pour Stomy. Affiche tous les tags de la bibliothèque dans la sidebar avec des sous-onglets pour filtrer le contenu par tag.

## 🎯 Fonctionnalités

- **Sidebar intégrée** : Onglet dédié "/tags" dans la sidebar (violet avec icône tag)
- **Vue par tags** : Affiche tous les tags avec leur nombre de livres
- **Sous-onglets dynamiques** : Chaque tag devient un sous-onglet cliquable
- **Tri flexible** : Tri alphabétique ou par popularité
- **Statistiques** : Vue d'ensemble des tags et leur utilisation
- **Configuration** : Options d'affichage personnalisables

## 📦 Installation

Ce plugin est inclus dans les plugins core de Stomy.

Pour l'activer :

1. Aller dans **Settings > Plugins**
2. Trouver "Nav Tags" dans la liste
3. Activer le plugin
4. Un nouvel onglet "Tags" apparaît dans la sidebar

## 🎨 Interface

### Sidebar

Le plugin ajoute un onglet **Tags** dans la sidebar avec :

- Icône : `TagRegular` (Fluent UI)
- Couleur : Violet (#8b5cf6)
- Position : En haut de la sidebar

### Sous-onglets

Chaque tag de votre bibliothèque devient un sous-onglet :

```
📑 Tags
  ├─ Fiction (42 livres)
  ├─ Science-Fiction (28 livres)
  ├─ Biographie (15 livres)
  └─ Histoire (12 livres)
```

## ⚙️ Configuration

### Settings disponibles

```typescript
{
  showTagCount: boolean;       // Afficher le nombre de livres
  sortBy: 'alphabetical' | 'count';  // Tri des tags
  showEmptyTags: boolean;      // Afficher les tags sans livres
  defaultTag?: string;         // Tag sélectionné par défaut
}
```

### Configuration par défaut

```json
{
  "showTagCount": true,
  "sortBy": "count",
  "showEmptyTags": false
}
```

## 🔧 Actions disponibles

### Actions globales

1. **🔄 Actualiser les tags**
   - Recharge la liste des tags depuis la bibliothèque
   - Utile après ajout/suppression de livres

2. **📊 Statistiques des tags**
   - Affiche les statistiques d'utilisation
   - Total de tags, moyenne par livre, tag le plus utilisé

### Actions de paramètres

3. **🔀 Changer le tri**
   - Alterne entre tri alphabétique et tri par popularité

4. **👁️ Afficher/masquer tags vides**
   - Toggle l'affichage des tags sans livres

## 📊 Statistiques

Le plugin calcule automatiquement :

- **Total de tags** : Nombre total de tags uniques
- **Total de livres** : Nombre de livres dans la bibliothèque
- **Moyenne** : Nombre moyen de livres par tag
- **Tag le plus utilisé** : Tag avec le plus de livres

Exemple :

```
📊 STATISTIQUES DES TAGS

Total de tags: 24
Total de livres: 156
Moyenne: 6.5 livres/tag

Tag le plus utilisé:
Fiction (42 livres)
```

## 🎯 Cas d'usage

### Navigation rapide

Cliquez sur un tag dans la sidebar pour voir tous les livres de ce tag.

### Organisation par thème

Utilisez les tags pour organiser votre bibliothèque par :
- Genre (Fiction, Non-fiction, etc.)
- Thème (Science, Histoire, Art, etc.)
- Statut (À lire, En cours, Lu)
- Évaluation (★★★★★, ★★★★, etc.)

### Découverte de contenu

- Parcourez les tags pour découvrir des livres
- Comparez les tags par popularité
- Identifiez les catégories manquantes

## 🔍 Algorithme de tri

### Tri alphabétique

```typescript
tags.sort((a, b) => a.name.localeCompare(b.name))
```

Ordre : A → Z (insensible à la casse)

### Tri par popularité

```typescript
tags.sort((a, b) => b.count - a.count)
```

Ordre : Plus utilisé → Moins utilisé

## 🎨 Customisation

### Couleur de l'onglet

Pour changer la couleur de l'onglet Tags :

```typescript
sidebar: {
  color: '#8b5cf6',  // Violet par défaut
}
```

Autres suggestions :
- Bleu : `#3b82f6`
- Vert : `#10b981`
- Orange : `#f59e0b`
- Rose : `#ec4899`

### Icône

L'icône peut être changée pour une autre icône Fluent UI :

```typescript
icon: 'TagRegular',  // Par défaut
// Alternatives :
// 'TagMultipleRegular'
// 'BookmarkRegular'
// 'FilterRegular'
```

## 🧩 Intégration avec d'autres plugins

Ce plugin s'intègre bien avec :

- **CSV Export** : Exporter des livres filtrés par tag
- **Kobo/Kindle Sync** : Synchroniser des collections basées sur les tags
- **Reading History** : Analyser l'historique de lecture par tag

## 🔧 Développement

### Structure du projet

```
nav-tags/
├── index.ts              # Point d'entrée
├── NavTagsPlugin.ts      # Logique principale
├── types.ts              # Définitions TypeScript
├── manifest.json         # Métadonnées du plugin
└── README.md             # Documentation
```

### API publiques

```typescript
// Récupérer tous les tags
async function getAllTags(): Promise<Tag[]>

// Calculer les statistiques
async function getTagStats(): Promise<TagStats>

// Trier les tags
function sortTags(tags: Tag[], settings: NavTagsSettings): Tag[]
```

## 📝 Logs

Le plugin utilise le préfixe `[NavTags]` pour tous ses logs :

```typescript
console.log('[NavTags] Plugin enabled')
console.log('[NavTags] Found 24 tags')
console.error('[NavTags] Failed to get tags:', error)
```

## ⚠️ Limitations

- Les tags doivent être définis dans les métadonnées des livres
- Pas de création/édition de tags depuis le plugin (utiliser l'interface principale)
- Maximum de 100 tags affichés dans la sidebar pour des raisons de performance

## 🚀 Évolutions futures

Fonctionnalités potentielles :

- [ ] Édition de tags directement depuis la sidebar
- [ ] Fusion de tags similaires
- [ ] Hiérarchie de tags (tags parents/enfants)
- [ ] Recherche de tags
- [ ] Tags suggérés automatiquement
- [ ] Export de la structure de tags

## 📄 Licence

Internal use only - Stomy Team

## 🔗 Liens utiles

- [Plugin Specification](../dummy-plugin/PLUGIN_SPEC.md)
- [Development Guide](../dummy-plugin/DEVELOPMENT_GUIDE.md)
- [Best Practices](../dummy-plugin/BEST_PRACTICES.md)

---

**Version** : 1.0.0
**Auteur** : Stomy Team
**Dernière mise à jour** : 2025-11-13
