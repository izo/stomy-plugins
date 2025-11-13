# Analyse de compatibilité des appareils de lecture avec Stomy

**Date de l'analyse**: 13 novembre 2025
**Version de Stomy**: 0.1.0
**Auteur**: Analyse technique automatisée

## Vue d'ensemble

Cette analyse évalue la compatibilité de Stomy avec différents modèles de liseuses électroniques. Stomy utilise actuellement un système de détection basé sur USB Mass Storage et des structures de dossiers spécifiques.

### Principes de fonctionnement de Stomy

**Méthode de connexion:**
- USB Mass Storage uniquement (pas de support Wi-Fi/réseau actuellement)
- Détection automatique par polling toutes les 3 secondes
- Scan du système de fichiers pour identifier les dossiers spécifiques

**Formats de fichiers supportés:**
- EPUB (format principal avec extraction complète des métadonnées)
- PDF (support basique)
- CBZ (bandes dessinées)
- MOBI (via conversion, pour Kindle)
- AZW3 (détection uniquement)

**Mécanismes de détection actuels:**
- **Kobo**: Détection via présence du dossier `.kobo` ou `KOBOeReader`
- **Kindle**: Détection via dossiers `documents/` et `system/` (sans dossier `.kobo`)

---

## Analyse détaillée par marque et modèle

### 1. Sony Reader (PRS Series)

#### Modèles analysés
- PRS-300 (Pocket Edition)
- PRS-350 (Pocket Edition)
- PRS-500 (Original Reader)
- PRS-505 (Reader)
- PRS-600 (Touch Edition)
- PRS-650 (Touch Edition)
- PRS-700 (Reader Touch)

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅
- **Structure de dossiers**:
  - `/database/` (base de données propriétaire Sony)
  - `/Sony Reader/` (selon modèle)
  - Pas de dossier identifiant universel
- **Formats supportés**: EPUB, PDF, TXT, RTF, BBeB Book
- **Système de fichiers**: FAT32

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ✅ Compatible | Tous les modèles PRS supportent USB Mass Storage |
| **Détection automatique** | ❌ Non supporté | Aucune logique de détection implémentée |
| **Transfert de fichiers** | ✅ Compatible | Copie de fichiers standard possible |
| **Formats** | ⚠️ Partiellement compatible | EPUB et PDF fonctionneront, mais pas BBeB |
| **Organisation** | ⚠️ Attention | Sony utilise une base de données propriétaire |

#### Niveau de compatibilité: **MOYEN (60%)**

**Ce qui fonctionne:**
- Transfert manuel de fichiers EPUB/PDF vers la racine ou `/database/media/books/`
- Lecture des métadonnées EPUB
- Calcul de l'espace libre/total

**Ce qui nécessite développement:**
- Fonction de détection spécifique: `detect_sony_devices()`
- Critère de détection: présence du dossier `/database/` + fichier `database/books.db`
- Gestion optionnelle de la base de données Sony (pour indexation automatique)

**Recommandation:** Développement estimé à 1-2 jours pour support complet.

---

### 2. Cybook (Bookeen)

#### Modèles analysés
- Cybook Gen3
- Cybook Opus
- Cybook Orizon
- Cybook Odyssey

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅
- **Structure de dossiers**:
  - `/Digital Editions/` (contenu Adobe DRM)
  - `/Books/` ou racine pour fichiers non-DRM
  - Pas de dossier identifiant universel stable
- **Formats supportés**: EPUB, PDF, FB2, HTML, TXT, PalmDoc
- **Système de fichiers**: FAT32

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ✅ Compatible | USB Mass Storage sur tous modèles |
| **Détection automatique** | ❌ Non supporté | Pas de logique de détection |
| **Transfert de fichiers** | ✅ Compatible | Copie standard possible |
| **Formats** | ✅ Compatible | EPUB et PDF entièrement supportés |
| **Organisation** | ✅ Compatible | Structure de fichiers simple |

#### Niveau de compatibilité: **MOYEN-ÉLEVÉ (70%)**

**Ce qui fonctionne:**
- Transfert de fichiers EPUB/PDF vers `/Books/` ou racine
- Lecture des métadonnées
- Pas de base de données propriétaire bloquante

**Ce qui nécessite développement:**
- Fonction de détection: `detect_cybook_devices()`
- Critère de détection complexe: détection via nom de volume "CYBOOK" ou présence de `/Digital Editions/`
- Les modèles Cybook n'ont pas de structure de dossiers très distinctive

**Recommandation:** Développement estimé à 1 jour pour support basique. Détection pas toujours fiable.

---

### 3. Amazon Kindle

#### Modèles analysés
- Kindle 1ère génération
- Kindle 2
- Kindle DX
- Kindle Paperwhite (toutes générations)
- Kindle Voyage
- Kindle Fire (tablette)

#### Spécifications techniques
- **Connexion**:
  - USB Mass Storage ✅ (Kindle 1-Voyage)
  - MTP ❌ (Kindle Fire, modèles récents)
- **Structure de dossiers**:
  - `/documents/` (contenu utilisateur)
  - `/system/` (fichiers système)
  - `/system/version.txt` (info modèle)
- **Formats supportés**: MOBI, AZW, AZW3, PDF, TXT
- **Système de fichiers**: FAT32 ou exFAT

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ⚠️ Partiellement | Mass Storage sur anciens modèles, MTP sur récents |
| **Détection automatique** | ✅ Supporté | Via plugin `kindle-sync` |
| **Transfert de fichiers** | ✅ Supporté | Copie vers `/documents/` |
| **Formats** | ⚠️ Conversion requise | EPUB → MOBI via plugin |
| **Organisation** | ✅ Compatible | Structure de dossiers bien documentée |

#### Niveau de compatibilité: **ÉLEVÉ (85%)**

**Ce qui fonctionne:**
- Détection automatique (Kindle 1-Voyage, Paperwhite < Gen 11)
- Conversion EPUB → MOBI automatique
- Extraction des infos: modèle via `version.txt`, numéro de série via `.mrxs`
- Transfert vers `/documents/`

**Limitations:**
- **Kindle Fire**: Utilise MTP, pas Mass Storage → **NON COMPATIBLE**
- **Modèles récents (2021+)**: Certains utilisent MTP → **VÉRIFICATION NÉCESSAIRE**
- Formats AZW3: Détection seulement, pas de création

**Recommandation:** Support existant excellent pour modèles compatibles Mass Storage. Kindle Fire nécessiterait réécriture complète (support MTP).

---

### 4. Netronix EB600

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅
- **Structure de dossiers**: Structure simple, pas de dossier identifiant
- **Formats supportés**: EPUB, PDF, TXT, FB2, HTML, CHM
- **Système de fichiers**: FAT32

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ✅ Compatible | USB Mass Storage standard |
| **Détection automatique** | ❌ Non supporté | Pas de logique de détection |
| **Transfert de fichiers** | ✅ Compatible | Copie standard possible |
| **Formats** | ✅ Compatible | EPUB et PDF supportés |

#### Niveau de compatibilité: **MOYEN (65%)**

**Recommandation:** Développement similaire à Cybook, détection difficile (absence de marqueurs distinctifs).

---

### 5. Ectaco Jetbook

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅
- **Structure de dossiers**: Racine + dossiers utilisateur libres
- **Formats supportés**: EPUB, PDF, FB2, TXT, HTML, DOC, RTF
- **Système de fichiers**: FAT32

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ✅ Compatible | USB Mass Storage |
| **Détection automatique** | ❌ Non supporté | Pas de marqueur distinctif |
| **Transfert de fichiers** | ✅ Compatible | Copie standard possible |
| **Formats** | ✅ Compatible | EPUB et PDF supportés |

#### Niveau de compatibilité: **MOYEN (60%)**

---

### 6. BeBook / BeBook Mini

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅
- **Structure de dossiers**: `/books/` (selon modèle)
- **Formats supportés**: EPUB, PDF, FB2, TXT, HTML
- **Système de fichiers**: FAT32

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ✅ Compatible | USB Mass Storage |
| **Détection automatique** | ⚠️ Possible | Dossier `/books/` pourrait servir de marqueur |
| **Transfert de fichiers** | ✅ Compatible | Copie vers `/books/` |
| **Formats** | ✅ Compatible | EPUB et PDF supportés |

#### Niveau de compatibilité: **MOYEN-ÉLEVÉ (70%)**

**Recommandation:** Meilleure détection possible via dossier `/books/` spécifique.

---

### 7. Irex Illiad / DR1000

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅ (mais système Linux complexe)
- **Structure de dossiers**:
  - `/media/` (contenu utilisateur sur DR1000)
  - Structure Linux complète visible
- **Formats supportés**: EPUB, PDF, HTML, TXT, FB2, Mobipocket
- **Système de fichiers**: ext3 (Linux) - peut poser problème sur Windows

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ⚠️ Complexe | Mass Storage mais filesystem Linux |
| **Détection automatique** | ❌ Non supporté | Structure complexe |
| **Transfert de fichiers** | ⚠️ Complexe | Dépend du système hôte |
| **Formats** | ✅ Compatible | EPUB et PDF supportés |

#### Niveau de compatibilité: **FAIBLE-MOYEN (40%)**

**Limitations critiques:**
- Système de fichiers ext3 peut ne pas être monté correctement sur macOS/Windows
- Structure Linux complexe
- Appareils très anciens et rares

**Recommandation:** Support non prioritaire en raison de la complexité et de la rareté.

---

### 8. Foxit eSlick

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅
- **Structure de dossiers**: Racine ou `/books/`
- **Formats supportés**: EPUB, PDF, TXT, HTML, FB2
- **Système de fichiers**: FAT32

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ✅ Compatible | USB Mass Storage |
| **Détection automatique** | ❌ Non supporté | Pas de marqueur distinctif |
| **Transfert de fichiers** | ✅ Compatible | Copie standard possible |
| **Formats** | ✅ Compatible | EPUB et PDF supportés |

#### Niveau de compatibilité: **MOYEN (65%)**

---

### 9. Kobo

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅
- **Structure de dossiers**:
  - `/.kobo/` (dossier système identifiant)
  - `/KOBOeReader/` (selon modèle)
  - Livres: racine ou `/Books/`
- **Formats supportés**: EPUB, PDF, CBZ, CBR, TXT, HTML, RTF, MOBI
- **Système de fichiers**: FAT32 ou exFAT

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ✅ Compatible | USB Mass Storage sur tous modèles |
| **Détection automatique** | ✅ Supporté | Via plugin `kobo-sync` (activé par défaut) |
| **Transfert de fichiers** | ✅ Supporté | Copie vers racine ou `/Books/` |
| **Formats** | ✅ Compatible | EPUB, PDF, CBZ entièrement supportés |
| **Organisation** | ✅ Compatible | Structure bien documentée |

#### Niveau de compatibilité: **EXCELLENT (95%)**

**Ce qui fonctionne:**
- Détection automatique via dossier `.kobo` (très fiable)
- Extraction des informations: nom, espace libre/total, nombre de livres
- Transfert de tous formats supportés
- Plugin intégré et activé par défaut

**Seule limitation:**
- Pas de support Wi-Fi (sync sans fil) actuellement

**Recommandation:** Support de référence, pleinement opérationnel.

---

### 10. Oyo

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅ (selon modèle)
- **Structure de dossiers**: Variable selon modèle/marque (Oyo = marque générique)
- **Formats supportés**: EPUB, PDF (généralement)
- **Système de fichiers**: FAT32

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ⚠️ Variable | Dépend du modèle exact |
| **Détection automatique** | ❌ Non supporté | Marque générique sans standard |
| **Transfert de fichiers** | ⚠️ Variable | Probablement possible manuellement |
| **Formats** | ✅ Compatible | EPUB et PDF probablement supportés |

#### Niveau de compatibilité: **FAIBLE-MOYEN (45%)**

**Note:** "Oyo" est une marque générique pour divers appareils rebrandés. Compatibilité très variable selon le fabricant OEM réel.

**Recommandation:** Support non prioritaire en raison de l'hétérogénéité des appareils.

---

### 11. PocketBook

#### Spécifications techniques
- **Connexion**: USB Mass Storage ✅
- **Structure de dossiers**:
  - `/Books/` (livres utilisateur)
  - `/system/` (système)
  - Pas de dossier identifiant universel fiable
- **Formats supportés**: EPUB, PDF, FB2, MOBI, DOC, TXT, HTML, CBZ, CBR + 25 formats
- **Système de fichiers**: FAT32 ou exFAT

#### Compatibilité avec Stomy

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Connexion USB** | ✅ Compatible | USB Mass Storage sur tous modèles |
| **Détection automatique** | ⚠️ Difficile | Pas de marqueur distinctif fiable |
| **Transfert de fichiers** | ✅ Compatible | Copie vers `/Books/` |
| **Formats** | ✅ Excellent | Supporte tous les formats de Stomy et plus |
| **Organisation** | ✅ Compatible | Structure simple avec dossier `/Books/` |

#### Niveau de compatibilité: **MOYEN-ÉLEVÉ (75%)**

**Ce qui fonctionne:**
- Transfert de fichiers EPUB/PDF/CBZ vers `/Books/`
- Excellente compatibilité des formats
- Structure de dossiers simple

**Ce qui nécessite développement:**
- Fonction de détection: `detect_pocketbook_devices()`
- Critère de détection: présence de `/Books/` + `/system/` (mais peut confondre avec d'autres appareils)
- Alternative: Détection via nom de volume "POCKETBOOK" (si présent)

**Recommandation:** Priorité MOYENNE. Bon candidat pour support futur (marque populaire, structure simple). Développement estimé à 1-2 jours.

---

## Tableau récapitulatif de compatibilité

| Appareil | Connexion USB | Détection auto | Transfert | Formats | Compatibilité globale | Priorité |
|----------|---------------|----------------|-----------|---------|----------------------|----------|
| **Sony PRS (tous)** | ✅ | ❌ | ✅ | ⚠️ | **60% - MOYEN** | Moyenne |
| **Cybook (tous)** | ✅ | ❌ | ✅ | ✅ | **70% - MOYEN-ÉLEVÉ** | Moyenne |
| **Kindle 1/2/DX** | ✅ | ✅ | ✅ | ⚠️ | **85% - ÉLEVÉ** | ✅ Supporté |
| **Kindle Paperwhite** | ✅ | ✅ | ✅ | ⚠️ | **85% - ÉLEVÉ** | ✅ Supporté |
| **Kindle Voyage** | ✅ | ✅ | ✅ | ⚠️ | **85% - ÉLEVÉ** | ✅ Supporté |
| **Kindle Fire** | ❌ MTP | ❌ | ❌ | ⚠️ | **10% - INCOMPATIBLE** | Aucune |
| **Netronix EB600** | ✅ | ❌ | ✅ | ✅ | **65% - MOYEN** | Faible |
| **Ectaco Jetbook** | ✅ | ❌ | ✅ | ✅ | **60% - MOYEN** | Faible |
| **BeBook/Mini** | ✅ | ⚠️ | ✅ | ✅ | **70% - MOYEN-ÉLEVÉ** | Moyenne |
| **Irex Illiad/DR1000** | ⚠️ | ❌ | ⚠️ | ✅ | **40% - FAIBLE-MOYEN** | Très faible |
| **Foxit eSlick** | ✅ | ❌ | ✅ | ✅ | **65% - MOYEN** | Faible |
| **Kobo (tous)** | ✅ | ✅ | ✅ | ✅ | **95% - EXCELLENT** | ✅ Supporté |
| **Oyo** | ⚠️ | ❌ | ⚠️ | ✅ | **45% - FAIBLE-MOYEN** | Très faible |
| **PocketBook** | ✅ | ⚠️ | ✅ | ✅ | **75% - MOYEN-ÉLEVÉ** | Élevée |

---

## Recommandations stratégiques

### Support immédiat (déjà implémenté)
1. ✅ **Kobo** (95% compatible) - Plugin `kobo-sync` actif
2. ✅ **Kindle USB** (85% compatible) - Plugin `kindle-sync` disponible

### Support prioritaire (développement court terme)
3. 📝 **PocketBook** (75% compatible)
   - Marque populaire en Europe
   - Structure simple avec dossier `/Books/`
   - Excellente compatibilité de formats
   - **Effort estimé:** 1-2 jours

4. 📝 **Sony PRS Series** (60% compatible)
   - Base installée importante (appareils legacy)
   - Requiert gestion base de données propriétaire (optionnel)
   - **Effort estimé:** 2-3 jours avec support DB

### Support moyen terme
5. 📅 **Cybook** (70% compatible)
   - Détection complexe mais faisable
   - **Effort estimé:** 1 jour

6. 📅 **BeBook** (70% compatible)
   - Dossier `/books/` comme marqueur
   - **Effort estimé:** 1 jour

### Support non recommandé
- ❌ **Kindle Fire** - Protocole MTP incompatible avec architecture actuelle
- ❌ **Irex Illiad/DR1000** - Filesystem Linux, appareils obsolètes
- ❌ **Oyo** - Marque générique trop hétérogène
- ⚠️ **Netronix EB600, Ectaco Jetbook, Foxit eSlick** - Appareils rares, ROI faible

---

## Architecture technique pour support étendu

### Proposition: Système de plugins modulaires

Pour supporter efficacement ces appareils, je recommande d'étendre le système de plugins existant:

```rust
// Exemple de structure pour plugin PocketBook
pub fn detect_pocketbook_devices() -> Vec<DeviceInfo> {
    // Scan volumes pour dossiers /Books/ + /system/
    // Vérifier nom de volume contient "POCKETBOOK"
    // Extraire infos via device_space
}

pub fn sync_to_pocketbook(device: &Device, books: Vec<Book>) {
    // Copie vers /Books/
    // Pas de conversion de format nécessaire
    // Gestion des métadonnées optionnelle
}
```

### Critères de détection proposés

| Appareil | Critère primaire | Critère secondaire | Critère tertiaire |
|----------|------------------|-------------------|-------------------|
| PocketBook | Dossier `/Books/` + `/system/` | Nom volume "POCKETBOOK" | - |
| Sony PRS | Dossier `/database/` | Fichier `database/books.db` | - |
| Cybook | Dossier `/Digital Editions/` | Nom volume "CYBOOK" | - |
| BeBook | Dossier `/books/` | Nom volume "BEBOOK" | - |

### Plugin template

Chaque nouveau plugin devrait implémenter:
1. `detect_[device]_devices()` - Détection USB
2. `get_[device]_info()` - Extraction métadonnées appareil
3. `sync_to_[device]()` - Logique de synchronisation
4. `format_conversion()` - Conversion de formats si nécessaire

---

## Limitations systémiques de Stomy

Ces limitations affectent TOUS les appareils:

1. **USB Mass Storage uniquement**
   - Pas de support MTP (Media Transfer Protocol)
   - Pas de support réseau/Wi-Fi
   - Nécessite montage comme volume système

2. **Plateforme macOS prioritaire**
   - Détection via `/Volumes/` (spécifique macOS)
   - Commande `df -k` (Unix/macOS)
   - Support Windows/Linux expérimental

3. **Formats limités**
   - Pas de support natif DRM (Adobe Digital Editions, etc.)
   - Conversion EPUB→MOBI uniquement (pas AZW3)
   - Métadonnées basiques pour PDF

4. **Détection passive**
   - Polling toutes les 3 secondes (pas d'événements USB)
   - Peut manquer connexions très brèves
   - Pas de support multi-appareils simultanés

---

## Conclusion

### Compatibilité actuelle
- **Excellente (95%)**: Kobo (tous modèles)
- **Élevée (85%)**: Kindle (sauf Fire)
- **Moyenne à élevée (60-75%)**: Sony PRS, Cybook, PocketBook, BeBook
- **Faible (40-65%)**: Autres appareils (Netronix, Ectaco, Foxit, Oyo, Irex)
- **Incompatible**: Kindle Fire (MTP), appareils réseau uniquement

### Feuille de route recommandée

**Phase 1 (court terme - 1 semaine):**
- Plugin PocketBook (priorité haute)
- Plugin Sony PRS (priorité moyenne-haute)

**Phase 2 (moyen terme - 2 semaines):**
- Plugins Cybook et BeBook
- Amélioration détection multi-plateforme (Windows/Linux)

**Phase 3 (long terme):**
- Support protocole MTP (pour Kindle Fire et appareils récents)
- Synchronisation Wi-Fi (Kobo WiFi)
- Support avancé métadonnées (PDF, bases de données propriétaires)

### Métriques de compatibilité globale

Sur les 11 catégories d'appareils analysées:
- ✅ **2 supportés** (18%) - Kobo, Kindle USB
- 📝 **4 facilement supportables** (36%) - PocketBook, Sony, Cybook, BeBook
- ⚠️ **4 supportables avec effort** (36%) - Netronix, Ectaco, Foxit, (+ meilleure détection)
- ❌ **1-2 incompatibles** (9-18%) - Kindle Fire, Irex (+ Oyo selon modèle)

**Taux de compatibilité potentielle: 82-91%** (avec développement plugins recommandés)

---

**Dernière mise à jour:** 13 novembre 2025
**Contact:** Pour questions ou ajout de support appareil, voir [stomy-plugins](https://github.com/izo/stomy-plugins)
