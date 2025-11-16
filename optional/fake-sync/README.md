# Fake Sync Plugin

Un plugin de développement pour Stomy qui simule la synchronisation avec des liseuses électroniques et périphériques USB sans avoir besoin d'un vrai appareil connecté.

## 🎯 Objectif

Ce plugin est un **outil de développement** conçu pour :
- Tester la fonctionnalité de synchronisation sans appareil physique
- Développer et déboguer les workflows de sync
- Simuler différents types d'appareils (Kobo, Kindle, clés USB)
- Tester les scénarios d'erreur et de déconnexion
- Former les utilisateurs sur les fonctionnalités de sync

## 📱 Appareils Simulés

### Kobo
- **Kobo Clara HD** - 8 GB (EPUB, PDF, CBZ, MOBI)
- **Kobo Libra 2** - 32 GB (EPUB, PDF, CBZ, MOBI)
- **Kobo Sage** - 32 GB (EPUB, PDF, CBZ, MOBI)
- **Kobo Nia** - 8 GB (EPUB, PDF, CBZ)
- **Kobo Elipsa 2E** - 32 GB (EPUB, PDF, CBZ, MOBI)

### Kindle
- **Kindle Paperwhite (11th Gen)** - 8 GB (MOBI, AZW, AZW3, PDF)
- **Kindle Oasis** - 32 GB (MOBI, AZW, AZW3, PDF)
- **Kindle Basic** - 8 GB (MOBI, AZW, AZW3, PDF)
- **Kindle Scribe** - 16 GB (MOBI, AZW, AZW3, PDF)

### USB
- **USB Drive Generic** - 32 GB (tous formats)
- **USB Drive 64GB** - 64 GB (tous formats)
- **SD Card 16GB** - 16 GB (tous formats)

## ⚙️ Configuration

### Paramètres du Plugin

| Paramètre | Description | Par défaut |
|-----------|-------------|------------|
| **Device Type** | Type d'appareil à simuler (`kobo`, `kindle`, `usb`, `none`) | `none` |
| **Auto Connect** | Connexion automatique au démarrage | `false` |
| **Simulate Delays** | Ajouter des délais réalistes | `true` |
| **Sync Duration** | Durée de simulation (ms) | `5000` |
| **Failure Rate** | Taux d'échec simulé (0-100%) | `0` |
| **Show Notifications** | Afficher les notifications | `true` |
| **Verbose Mode** | Logs et infos détaillés | `false` |

## 🚀 Utilisation

### 1. Configuration Initiale

1. Activer le plugin dans **Settings > Plugins**
2. Configurer le **Device Type** (Kobo, Kindle ou USB)
3. Ajuster les autres paramètres selon vos besoins

### 2. Détecter un Appareil Simulé

Cliquez sur **"Detect Fake Device"** :
- Un appareil aléatoire du type sélectionné sera créé
- Numéro de série unique généré
- Espace de stockage simulé (10-50% utilisé)
- Formats supportés selon le modèle

### 3. Synchroniser des Livres

Cliquez sur **"Sync to Fake Device"** :
- Simule le transfert de livres vers l'appareil
- Affiche la progression si **Verbose Mode** est activé
- Respecte les délais configurés
- Peut échouer aléatoirement selon le **Failure Rate**

### 4. Obtenir les Infos de l'Appareil

Cliquez sur **"Get Device Info"** :
- Affiche le nom, modèle, numéro de série
- Montre l'espace de stockage (total, utilisé, libre)
- Liste les formats supportés

### 5. Déconnecter l'Appareil

Cliquez sur **"Disconnect Device"** :
- Simule la déconnexion de l'appareil
- Réinitialise l'état du plugin

## 📚 Simulation Kobo Complète

Le plugin **Fake Sync** simule maintenant **complètement** la base de données KoboReader.sqlite, permettant de tester toutes les fonctionnalités du plugin `kobo-sync` sans appareil réel.

### 🔍 Fonctionnalités Simulées

#### Base de Données KoboReader.sqlite
Le plugin génère automatiquement des données réalistes pour :
- **Livres** : Métadonnées complètes (titre, auteur, ISBN, éditeur, langue)
- **Progression de lecture** : Pourcentage lu, temps de lecture, statut (non lu / en cours / terminé)
- **Événements** : Milestones de lecture (25%, 50%, 75%, 100%)
- **Annotations** : Surlignages et notes personnelles
- **Vocabulaire** : Mots recherchés dans le dictionnaire intégré

#### Livres Pré-configurés
7 classiques littéraires sont disponibles par défaut :
- The Great Gatsby (F. Scott Fitzgerald)
- 1984 (George Orwell)
- Pride and Prejudice (Jane Austen)
- To Kill a Mockingbird (Harper Lee)
- The Hobbit (J.R.R. Tolkien)
- Dune (Frank Herbert)
- The Catcher in the Rye (J.D. Salinger)

### 🎯 Actions Kobo Spécifiques

#### 1. Generate Fake Kobo Library
- **Contexte** : Settings
- **Fonction** : Génère une nouvelle bibliothèque Kobo avec des données aléatoires
- **Résultat** : 3-7 livres avec progression variée, annotations et vocabulaire

#### 2. Import Reading Progress (Kobo)
- **Contexte** : Global
- **Fonction** : Simule l'import des données de lecture depuis KoboReader.sqlite
- **Résultat** : Affiche le nombre de livres, événements, annotations et vocabulaire trouvés

#### 3. View Kobo Books
- **Contexte** : Global
- **Fonction** : Liste les livres sur le Kobo simulé
- **Résultat** : Affiche titre, progression et temps de lecture pour chaque livre

#### 4. View Kobo Annotations
- **Contexte** : Global
- **Fonction** : Affiche les surlignages et notes
- **Résultat** : Liste des annotations avec texte et notes associées

#### 5. View Kobo Vocabulary
- **Contexte** : Global
- **Fonction** : Affiche les mots du dictionnaire
- **Résultat** : Liste des mots recherchés pendant la lecture

### 🔧 API de Simulation Kobo

Le plugin expose des fonctions pour simuler les commandes Tauri invoke :

```typescript
import {
  getFakeKoboBooks,
  getFakeKoboEvents,
  getFakeKoboBookmarks,
  getFakeKoboVocabulary,
  getFakeKoboLibraryData,
  getFakeBookProgress,
  regenerateFakeKoboLibrary,
} from './optional/fake-sync';

// Obtenir tous les livres
const books = await getFakeKoboBooks('/fake/path');

// Obtenir tous les événements de lecture
const events = await getFakeKoboEvents('/fake/path');

// Obtenir toutes les annotations
const bookmarks = await getFakeKoboBookmarks('/fake/path');

// Obtenir tout le vocabulaire
const vocabulary = await getFakeKoboVocabulary('/fake/path');

// Obtenir toutes les données en une fois
const libraryData = await getFakeKoboLibraryData('/fake/path');

// Obtenir la progression d'un livre spécifique
const progress = await getFakeBookProgress('/fake/path', 'isbn', 'title');

// Régénérer la bibliothèque avec options personnalisées
const newLibrary = regenerateFakeKoboLibrary({
  bookCount: 10,
  includeBookmarks: true,
  includeVocabulary: true,
});
```

### 📊 Données Générées

#### Progression de Lecture Réaliste
- **Non lu (10%)** : 0% lu, pas d'événements
- **En cours (50%)** : 5-95% lu, événements de milestones
- **Terminé (40%)** : 100% lu, tous les événements

#### Temps de Lecture
- Calculé automatiquement : ~1-3 minutes par % lu
- Variation aléatoire pour plus de réalisme

#### Annotations
- 0-5 annotations par livre
- 60% de chance d'avoir une note personnelle
- Textes issus de citations célèbres

#### Vocabulaire
- 0-8 mots par livre en cours
- Mots issus d'une liste pré-définie (serendipity, ephemeral, etc.)

### 🧪 Workflow de Test Kobo

```bash
# 1. Configurer le plugin
Device Type: kobo
Verbose Mode: true

# 2. Détecter un appareil Kobo
Detect Fake Device → Kobo Clara HD / Libra 2 / Sage / etc.

# 3. Générer une bibliothèque
Generate Fake Kobo Library → 7 livres avec données

# 4. Importer la progression
Import Reading Progress (Kobo) → Synchronise les données

# 5. Explorer les données
View Kobo Books → Liste des livres
View Kobo Annotations → Surlignages et notes
View Kobo Vocabulary → Mots du dictionnaire

# 6. Tester avec le vrai plugin kobo-sync
Les fonctions simulées sont compatibles avec kobo-sync
```

### 🎨 Personnalisation des Données

Vous pouvez personnaliser la génération de données :

```typescript
// Générer une bibliothèque personnalisée
const customLibrary = regenerateFakeKoboLibrary({
  bookCount: 15,              // 15 livres au lieu de 3-7
  includeBookmarks: true,      // Avec annotations
  includeVocabulary: false,    // Sans vocabulaire
});

// Les données sont stockées globalement et persistées
// jusqu'à la prochaine régénération ou déconnexion
```

## 🎮 Actions Disponibles

### Actions Globales
- **🔍 Detect Fake Device** - Détecter un appareil simulé
- **❌ Disconnect Device** - Déconnecter l'appareil actuel

### Actions Bibliothèque
- **⬇️ Sync to Fake Device** - Synchroniser des livres

### Actions Paramètres
- **ℹ️ Get Device Info** - Afficher les informations détaillées

## 🧪 Scénarios de Test

### Test de Synchronisation Normale
```typescript
// Configuration recommandée
deviceType: 'kobo'
simulateDelays: true
syncDuration: 5000
failureRate: 0
```

### Test de Synchronisation Rapide
```typescript
// Configuration recommandée
deviceType: 'kindle'
simulateDelays: false
syncDuration: 1000
failureRate: 0
```

### Test de Gestion d'Erreurs
```typescript
// Configuration recommandée
deviceType: 'usb'
simulateDelays: true
syncDuration: 5000
failureRate: 30  // 30% d'échec
```

### Test avec Logs Détaillés
```typescript
// Configuration recommandée
verboseMode: true
showNotifications: true
```

## 📊 Informations Techniques

### Structure des Données

Chaque appareil simulé contient :
- **ID unique** - Identifiant de l'appareil
- **Nom et modèle** - Ex: "Kobo Libra 2"
- **Numéro de série** - Généré aléatoirement (12 caractères)
- **Chemin de montage** - Ex: `/Volumes/Kobo_Libra_2`
- **Capacité** - Espace total en MB
- **Espace utilisé** - Entre 10% et 50% de la capacité
- **Formats supportés** - Liste des extensions de fichier

### Progression de la Synchronisation

Le plugin simule 4 états :
1. **Connecting** - Connexion à l'appareil
2. **Syncing** - Transfert des fichiers
3. **Completed** - Synchronisation réussie
4. **Failed** - Échec de la synchronisation

## 🔧 API Programmatique

Le plugin expose des fonctions pour l'utilisation programmatique :

```typescript
import {
  detectFakeDevice,
  getCurrentFakeDevice,
  setCurrentFakeDevice,
  isSyncInProgress,
} from './core/fake-sync';

// Détecter un appareil
const device = await detectFakeDevice('kobo', true);

// Obtenir l'appareil actuel
const current = getCurrentFakeDevice();

// Définir un appareil manuellement
setCurrentFakeDevice(myDevice);

// Vérifier si une sync est en cours
if (isSyncInProgress()) {
  console.log('Sync in progress...');
}
```

## 🎯 Cas d'Usage

### Développement
- Tester les flux de synchronisation
- Déboguer les erreurs sans appareil physique
- Développer de nouvelles fonctionnalités de sync

### Tests Automatisés
- Créer des tests end-to-end
- Valider la gestion d'erreurs
- Tester les performances

### Démonstration
- Montrer les fonctionnalités aux utilisateurs
- Créer des tutoriels vidéo
- Formation des nouveaux utilisateurs

### Débogage
- Reproduire des bugs signalés
- Tester différents modèles d'appareils
- Simuler des conditions réseau variables

## ⚠️ Avertissements

1. **Plugin de Développement** : Ce plugin ne doit pas être utilisé en production
2. **Pas de Transfert Réel** : Aucun fichier n'est réellement copié
3. **Données Simulées** : Toutes les informations d'appareil sont fictives
4. **État Volatile** : L'appareil simulé est perdu au redémarrage

## 🐛 Débogage

### Mode Verbose

Activer **Verbose Mode** pour voir :
- Logs détaillés dans la console
- Progression de la synchronisation
- Informations complètes sur l'appareil
- Messages de notification étendus

### Console du Navigateur

Tous les événements sont loggés avec le préfixe `[FakeSyncPlugin]` :
```javascript
[FakeSyncPlugin] Fake device created: {...}
[FakeSyncPlugin] Sync progress: {...}
[FakeSyncPlugin] Sync result: {...}
```

## 📝 Notes pour les Développeurs

- L'appareil simulé est stocké dans une variable globale `currentFakeDevice`
- Les modèles d'appareils sont définis dans `types.ts` (`DEVICE_MODELS`)
- La synchronisation utilise `setTimeout` pour simuler les délais
- Les numéros de série sont générés aléatoirement à chaque détection
- L'espace de stockage est calculé entre 10% et 50% d'utilisation
- Les tailles de fichiers simulées sont entre 1 et 11 MB

## 🚀 Améliorations Futures

- Support de plusieurs appareils simultanés
- Simulation de métadonnées de livres
- Interface de configuration UI avancée
- Historique des synchronisations
- Export/Import de configurations de test
- Simulation de problèmes réseau spécifiques
- Support de formats de fichiers personnalisés

## 📄 Licence

Internal use only - Stomy Team
