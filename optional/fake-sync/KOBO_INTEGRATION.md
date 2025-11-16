# Guide d'Intégration : Fake Sync ↔ Kobo Sync

Ce document explique comment le plugin `fake-sync` simule complètement le plugin `kobo-sync` pour faciliter le développement et les tests.

## 🎯 Objectif

Le plugin `fake-sync` peut remplacer un vrai appareil Kobo pour :
- Développer et tester les fonctionnalités de `kobo-sync` sans matériel
- Générer des données de test réalistes
- Tester les scénarios edge cases (livres sans ISBN, progression à 100%, etc.)
- Déboguer les workflows d'import de données

## 🔄 Mapping des Fonctionnalités

### Commandes Tauri Invoke Simulées

Le plugin `fake-sync` simule toutes les commandes Tauri utilisées par `kobo-sync` :

| Commande Kobo-Sync | Fonction Fake-Sync | Description |
|-------------------|-------------------|-------------|
| `get_kobo_books` | `getFakeKoboBooks()` | Obtenir tous les livres |
| `get_kobo_events` | `getFakeKoboEvents()` | Obtenir les événements de lecture |
| `get_kobo_bookmarks` | `getFakeKoboBookmarks()` | Obtenir les annotations |
| `get_kobo_vocabulary` | `getFakeKoboVocabulary()` | Obtenir le vocabulaire |
| `get_kobo_library_data` | `getFakeKoboLibraryData()` | Obtenir toutes les données |
| `get_book_progress` | `getFakeBookProgress()` | Obtenir la progression d'un livre |

### Types de Données

Les types `FakeKobo*` dans `fake-sync` correspondent exactement aux types `Kobo*` :

```typescript
// fake-sync/types.ts
export interface FakeKoboBook {
  contentID: string;
  isbn?: string;
  title: string;
  attribution?: string;
  percentRead: number;
  readStatus: FakeKoboReadStatus;
  timeSpentReading: number;
  dateLastRead?: string;
  // ...
}

// kobo-sync/types.ts
export interface KoboBook {
  contentID: string;
  isbn?: string;
  title: string;
  attribution?: string;
  percentRead: number;
  readStatus: KoboReadStatus;
  timeSpentReading: number;
  dateLastRead?: string;
  // ...
}
```

Les enums sont également identiques :
- `FakeKoboReadStatus` ↔ `KoboReadStatus` (0=Unread, 1=Reading, 2=Finished)
- `FakeKoboEventType` ↔ `KoboEventType` (3=Start, 1011=Progress25, etc.)
- `FakeKoboBookmarkType` ↔ `KoboBookmarkType` (highlight, annotation, bookmark, dogear)

## 🧪 Workflow de Test Complet

### 1. Configuration Initiale

```typescript
// Dans fake-sync settings
deviceType: 'kobo'
showNotifications: true
verboseMode: true
```

### 2. Génération de Données

```typescript
// Détecter un appareil Kobo simulé
const device = await detectFakeDevice('kobo', true);
// device = { name: 'Kobo Libra 2', path: '/Volumes/Kobo_Libra_2', ... }

// Générer une bibliothèque complète
const library = regenerateFakeKoboLibrary({
  bookCount: 7,
  includeBookmarks: true,
  includeVocabulary: true,
});
// library = { books: [...], events: [...], bookmarks: [...], vocabulary: [...] }
```

### 3. Utilisation avec Kobo-Sync

Les fonctions de `kobo-sync` peuvent maintenant être testées :

```typescript
import { syncReadingProgress } from './optional/kobo-sync';
import { getCurrentFakeDevice } from './optional/fake-sync';

// Simuler l'import de progression
const fakeDevice = getCurrentFakeDevice();
if (fakeDevice) {
  const stats = await syncReadingProgress(
    fakeDevice.mountPath,
    (progress) => console.log('Progress:', progress)
  );

  console.log('Sync complete:', stats);
  // stats = {
  //   booksFound: 7,
  //   booksUpdated: 5,
  //   progressSynced: 5,
  //   annotationsSynced: 12,
  //   vocabularySynced: 24,
  //   errors: 0
  // }
}
```

## 📊 Exemples de Données Générées

### Livre Non Lu (10% des livres)

```typescript
{
  contentID: "file:///mnt/onboard/1984_abc123.kepub.epub",
  isbn: "9780451524935",
  title: "1984",
  attribution: "George Orwell",
  percentRead: 0,
  readStatus: 0, // Unread
  timeSpentReading: 0,
  dateLastRead: undefined,
  contentType: "6",
  mimeType: "application/epub+zip"
}
```

### Livre En Cours (50% des livres)

```typescript
{
  contentID: "file:///mnt/onboard/The_Great_Gatsby_xyz789.kepub.epub",
  isbn: "9780743273565",
  title: "The Great Gatsby",
  attribution: "F. Scott Fitzgerald",
  percentRead: 67.5,
  readStatus: 1, // Reading
  timeSpentReading: 135, // minutes
  dateLastRead: "2025-11-10T14:32:00.000Z",
  contentType: "6",
  mimeType: "application/epub+zip"
}

// Avec événements associés
{
  id: 1,
  contentID: "file:///mnt/onboard/The_Great_Gatsby_xyz789.kepub.epub",
  eventType: 3, // StartReadingBook
  eventCount: 1,
  lastOccurrence: "2025-11-05T10:00:00.000Z"
},
{
  id: 2,
  contentID: "file:///mnt/onboard/The_Great_Gatsby_xyz789.kepub.epub",
  eventType: 1011, // Progress25
  eventCount: 1,
  lastOccurrence: "2025-11-07T15:30:00.000Z"
},
{
  id: 3,
  contentID: "file:///mnt/onboard/The_Great_Gatsby_xyz789.kepub.epub",
  eventType: 1013, // Progress50
  eventCount: 1,
  lastOccurrence: "2025-11-09T20:15:00.000Z"
}
```

### Livre Terminé (40% des livres)

```typescript
{
  contentID: "file:///mnt/onboard/Pride_and_Prejudice_def456.kepub.epub",
  isbn: "9780141439518",
  title: "Pride and Prejudice",
  attribution: "Jane Austen",
  percentRead: 100,
  readStatus: 2, // Finished
  timeSpentReading: 420, // 7 heures
  dateLastRead: "2025-11-12T18:45:00.000Z",
  contentType: "6",
  mimeType: "application/epub+zip"
}

// Avec tous les événements
{
  id: 10,
  contentID: "file:///mnt/onboard/Pride_and_Prejudice_def456.kepub.epub",
  eventType: 5, // FinishedReadingBook
  eventCount: 1,
  lastOccurrence: "2025-11-12T18:45:00.000Z"
}
```

### Annotations

```typescript
{
  bookmarkID: "bookmark-file:///mnt/onboard/The_Great_Gatsby_xyz789.kepub.epub-1",
  volumeID: "file:///mnt/onboard/The_Great_Gatsby_xyz789.kepub.epub",
  contentID: "file:///mnt/onboard/The_Great_Gatsby_xyz789.kepub.epub#epubcfi(...)",
  text: "It was the best of times, it was the worst of times.",
  annotation: "My thoughts on: \"It was the best of...\"",
  chapterProgress: 0.23,
  startContainerPath: "OEBPS/chapter3.xhtml",
  startOffset: 456,
  dateCreated: "2025-10-20T12:30:00.000Z",
  type: "annotation"
}
```

### Vocabulaire

```typescript
{
  text: "serendipity",
  volumeID: "file:///mnt/onboard/The_Hobbit_ghi789.kepub.epub",
  dateCreated: "2025-11-08T16:20:00.000Z"
},
{
  text: "ephemeral",
  volumeID: "file:///mnt/onboard/Dune_jkl012.kepub.epub",
  dateCreated: "2025-11-10T09:45:00.000Z"
}
```

## 🔍 Cas de Test Recommandés

### Test 1 : Matching par ISBN
```typescript
// Générer un livre avec ISBN connu
const library = regenerateFakeKoboLibrary();
const book = library.books.find(b => b.isbn === '9780743273565');

// Vérifier que kobo-sync matche correctement par ISBN
```

### Test 2 : Matching par Titre + Auteur
```typescript
// Générer un livre sans ISBN
const customBook = generateFakeKoboBook({
  title: 'Test Book Title',
  author: 'Test Author',
  // Pas d'ISBN
}, 1, 50);

// Vérifier le fuzzy matching de kobo-sync
```

### Test 3 : Import de Progression
```typescript
// Livre à 75% → vérifier la mise à jour dans Stomy
const bookAt75 = library.books.find(b => b.percentRead >= 75 && b.percentRead < 100);

// Après import, vérifier :
// - readingProgress = bookAt75.percentRead
// - readStatus = 'reading'
// - timeSpentReading = bookAt75.timeSpentReading * 60 (conversion min→sec)
```

### Test 4 : Import d'Annotations
```typescript
// Vérifier que les bookmarks sont importés correctement
const annotations = library.bookmarks.filter(b => b.type === 'annotation');

// Après import, vérifier dans Stomy :
// - bookId correspond au livre matché
// - text = bookmark.text
// - note = bookmark.annotation
// - location = bookmark.chapterProgress
```

### Test 5 : Import de Vocabulaire
```typescript
// Vérifier l'import des mots du dictionnaire
const words = library.vocabulary;

// Après import, vérifier dans Stomy :
// - word = vocabulary.text
// - context = vocabulary.volumeID
// - lookedUpAt = vocabulary.dateCreated
```

## 🎨 Personnalisation pour Tests Spécifiques

### Scénario : Livre Sans Métadonnées

```typescript
const brokenBook = generateFakeKoboBook({
  title: 'Unknown Book',
  author: '', // Pas d'auteur
  // Pas d'ISBN, description, publisher
}, 1, 30);

// Test : vérifier que kobo-sync gère gracieusement les métadonnées manquantes
```

### Scénario : Beaucoup d'Annotations

```typescript
const library = regenerateFakeKoboLibrary({ bookCount: 3 });
const book = library.books[0];

// Générer 20 annotations pour un livre
for (let i = 0; i < 20; i++) {
  library.bookmarks.push(...generateFakeKoboBookmarks(book, 1));
}

// Test : performance d'import avec beaucoup d'annotations
```

### Scénario : Conflits de Données

```typescript
// Livre déjà dans Stomy avec progression différente
const koboBook = generateFakeKoboBook({
  title: 'Existing Book',
  author: 'Known Author',
  isbn: '9781234567890'
}, 2, 100); // Terminé sur Kobo

// Dans Stomy : même livre à 40%
// Test : vérifier que la progression Kobo écrase celle de Stomy
```

## 🚀 Intégration dans les Tests Automatisés

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { regenerateFakeKoboLibrary, getFakeKoboLibraryData } from './optional/fake-sync';
import { syncReadingProgress } from './optional/kobo-sync';

describe('Kobo Sync Integration', () => {
  beforeEach(() => {
    // Régénérer des données fraîches pour chaque test
    regenerateFakeKoboLibrary({
      bookCount: 5,
      includeBookmarks: true,
      includeVocabulary: true,
    });
  });

  it('should import reading progress from fake Kobo', async () => {
    const libraryData = await getFakeKoboLibraryData('/fake/path');
    expect(libraryData.books.length).toBeGreaterThan(0);

    const stats = await syncReadingProgress('/fake/path');
    expect(stats.booksFound).toBe(libraryData.books.length);
    expect(stats.booksUpdated).toBeGreaterThan(0);
  });

  it('should match books by ISBN', async () => {
    const libraryData = await getFakeKoboLibraryData('/fake/path');
    const bookWithIsbn = libraryData.books.find(b => b.isbn);
    expect(bookWithIsbn).toBeDefined();

    // Test matching logic...
  });

  it('should import annotations correctly', async () => {
    const libraryData = await getFakeKoboLibraryData('/fake/path');
    expect(libraryData.bookmarks.length).toBeGreaterThan(0);

    const stats = await syncReadingProgress('/fake/path');
    expect(stats.annotationsSynced).toBe(libraryData.bookmarks.length);
  });
});
```

## 📝 Notes pour les Développeurs

### Différences avec un Vrai Kobo

1. **ContentID** : Les IDs générés sont fictifs mais suivent le pattern Kobo
2. **Dates** : Générées aléatoirement dans les 60 derniers jours
3. **Progression** : Distribution réaliste mais aléatoire
4. **ISBN** : ISBNs réels mais limités aux 7 livres pré-configurés

### Limitations

1. Les données sont **volatiles** (perdues à la déconnexion)
2. Pas de **persistance** entre les sessions
3. Pas de **modification** des données après génération
4. Limité aux **7 livres** pré-définis (extensible)

### Extensions Possibles

1. Ajouter plus de livres dans `SAMPLE_BOOKS`
2. Permettre l'upload de fichiers JSON de configuration
3. Simuler les modifications de données (nouvelles annotations)
4. Persister les données dans localStorage ou IndexedDB
5. Ajouter une UI de gestion des données simulées

## 🎯 Checklist de Test

Avant de déployer une mise à jour de `kobo-sync`, vérifier avec `fake-sync` :

- [ ] Détection d'appareil Kobo
- [ ] Import de livres avec ISBN
- [ ] Import de livres sans ISBN (matching par titre/auteur)
- [ ] Import de progression de lecture
- [ ] Conversion du temps de lecture (minutes → secondes)
- [ ] Mise à jour du statut de lecture (unread/reading/finished)
- [ ] Import des annotations et surlignages
- [ ] Import du vocabulaire
- [ ] Gestion des erreurs (livre non trouvé, métadonnées manquantes)
- [ ] Performance avec beaucoup de données

## 📚 Ressources

- Documentation `kobo-sync` : [`LIBRARY_INTEGRATION.md`](../kobo-sync/LIBRARY_INTEGRATION.md)
- Types Kobo : [`kobo-sync/types.ts`](../kobo-sync/types.ts)
- Générateur de données : [`fake-sync/FakeKoboDataGenerator.ts`](./FakeKoboDataGenerator.ts)
- README : [`fake-sync/README.md`](./README.md)
