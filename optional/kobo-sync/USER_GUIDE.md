# Guide Utilisateur - Kobo Sync Plugin

**Version simple pour tout le monde** 😊

---

## 🎯 Ce que le plugin Kobo peut faire

### Quand tu branches ta Kobo

✅ **Automatiquement**, le plugin :
- Détecte ta Kobo
- Lit ce que tu as lu sur ta Kobo
- Met à jour ta bibliothèque Stomy avec :
  - Où tu en es dans chaque livre (ex: 67%)
  - Combien de temps tu as lu
  - Quels livres tu as finis
  - Tes surlignages et notes
  - Les mots que tu as cherchés dans le dictionnaire

---

## 📤 Envoyer des livres vers ta Kobo

### Comment faire :
1. Sélectionne des livres dans Stomy
2. Clique sur "Sync to Kobo"
3. C'est fait ! Tes livres sont sur ta Kobo

### Organisation intelligente

Si tu as plusieurs bibliothèques (Romans, Science, Jeunesse), le plugin crée automatiquement un dossier pour chacune sur ta Kobo :

```
Ta Kobo/
├── Stomy/
    ├── Romans/     ← Tes romans
    ├── Science/    ← Tes livres de science
    └── Jeunesse/   ← Livres pour enfants
```

**Pratique !** Tes livres sont bien organisés, comme dans Stomy.

---

## 📥 Récupérer tes données de lecture

### Ce qui remonte de la Kobo vers Stomy :

**📊 Ta progression de lecture**
- "J'ai lu 67% de ce livre"
- "J'ai passé 2h30 à lire ce livre"
- "J'ai fini ce livre hier"
- "J'ai commencé ce livre la semaine dernière"

**📝 Tes notes et surlignages**
- Les passages que tu as surlignés
- Les notes que tu as écrites sur ces passages
- Quand tu les as créées

**📚 Ton vocabulaire** (optionnel)
- Les mots que tu as cherchés dans le dictionnaire de la Kobo
- Dans quel livre tu les as cherchés
- Utile pour l'apprentissage des langues !

---

## ⚙️ Configuration

### Dans les paramètres du plugin :

#### 📁 Organisation des fichiers

**Nom du dossier principal**
- Par défaut : `Stomy`
- Tu peux changer (ex: `MesLivres`, `Books`, etc.)

**Créer un dossier par bibliothèque ?**
- ✅ Oui (recommandé) : `/Stomy/Romans/`, `/Stomy/Science/`
- ❌ Non : `/Stomy/` (tous les livres ensemble)

**Préfixe pour les dossiers** (optionnel)
- Laisse vide normalement
- Ou ajoute un préfixe (ex: `Lib-` → `/Stomy/Lib-Romans/`)

#### 🔄 Qu'est-ce qu'on synchronise ?

**Progression de lecture** ✅ (activé par défaut)
- Pourcentage lu
- Temps de lecture
- Statut (non lu / en cours / terminé)

**Surlignages et notes** ✅ (activé par défaut)
- Tes passages surlignés
- Tes annotations personnelles

**Vocabulaire** ❌ (désactivé par défaut)
- Les mots cherchés dans le dictionnaire
- Active cette option si tu apprends une langue

#### 🔔 Autres options

**Notifications** ✅ (activé)
- Affiche des notifications quand ça synchronise
- "Sync terminée : 12 livres mis à jour"

**Éjection automatique** ❌ (désactivé)
- Éjecte la Kobo automatiquement après le sync
- À activer si tu préfères

---

## 💡 Les 3 cas d'usage principaux

### Cas 1 : Je lis sur ma Kobo 📖

**Situation :** Tu lis tous les jours sur ta Kobo

**Ce qui se passe :**
1. Tu lis tranquillement sur ta Kobo
2. De temps en temps, tu branches ta Kobo à ton ordinateur
3. **✨ Magie** : Stomy est maintenant à jour
   - Il sait où tu en es dans chaque livre
   - Il a enregistré tes surlignages
   - Il connaît ton temps de lecture

**Résultat :** Ta bibliothèque Stomy reflète exactement ce que tu lis sur ta Kobo !

---

### Cas 2 : J'ajoute des livres dans Stomy 📚

**Situation :** Tu viens d'ajouter 10 nouveaux livres dans Stomy et tu veux les lire sur ta Kobo

**Ce qui se passe :**
1. Tu sélectionnes les livres dans Stomy
2. Tu cliques "Sync to Kobo"
3. Les livres apparaissent sur ta Kobo
   - Dans le bon dossier (selon leur bibliothèque)
   - Prêts à être lus

**Résultat :** Tes nouveaux livres sont maintenant sur ta Kobo, bien organisés !

---

### Cas 3 : Je prends des notes en lisant 📝

**Situation :** Tu es un lecteur actif qui surligne et annote ses livres

**Ce qui se passe :**
1. Sur ta Kobo, tu surlignes des passages importants
2. Tu ajoutes des notes sur certains passages
3. Tu branches ta Kobo à ton ordi
4. Stomy récupère automatiquement :
   - Tous tes surlignages
   - Toutes tes notes
   - Les dates de création

**Résultat :** Tes notes sont sauvegardées dans Stomy, même si ta Kobo n'est pas branchée !

---

## 🚀 Démarrage rapide

### Première utilisation

1. **Active le plugin**
   - Va dans Paramètres → Plugins
   - Trouve "Kobo Sync"
   - Clique sur "Activer"

2. **Branche ta Kobo**
   - Connecte ta Kobo avec le câble USB
   - Stomy la détecte automatiquement

3. **C'est tout !**
   - La synchronisation se fait automatiquement
   - Tu verras une notification quand c'est fini

### Utilisation quotidienne

**Pas besoin de faire quoi que ce soit !**

Juste :
1. Lis sur ta Kobo comme d'habitude
2. Branche-la de temps en temps à ton ordi
3. Le plugin fait tout le reste automatiquement

---

## 🤔 Questions fréquentes

### Compatibilité

**Q: Mon modèle de Kobo est supporté ?**
→ **Oui !** Tous les modèles Kobo sont supportés, du Kobo Touch de 2012 au Libra Colour de 2024.

**Q: Ça marche sur Windows / Mac / Linux ?**
→ **Mac et Linux : Oui, parfaitement**
→ **Windows : Oui**, sauf pour quelques très anciens modèles (Aura Edition 2, Touch 2.0) avec Windows 11

### Sécurité

**Q: Le plugin peut effacer mes livres ?**
→ **Non, jamais.** Le plugin copie seulement, il ne supprime jamais rien.

**Q: Mes notes sont en sécurité ?**
→ **Oui !** Le plugin lit seulement la base de données de la Kobo, il n'écrit jamais dedans.

**Q: Si je débranche ma Kobo pendant le sync ?**
→ Pas de problème, le plugin détectera que la Kobo n'est plus là et s'arrêtera proprement.

### Organisation

**Q: J'ai 3 bibliothèques (Romans, Science, BD), ça fait quoi ?**
→ Le plugin crée 3 dossiers sur ta Kobo :
- `/Stomy/Romans/` pour tes romans
- `/Stomy/Science/` pour tes livres de science
- `/Stomy/BD/` pour tes bandes dessinées

**Q: Je peux tout mettre dans le même dossier ?**
→ **Oui !** Désactive l'option "Use Library Folders" dans les paramètres.

**Q: Je veux renommer le dossier "Stomy" ?**
→ **Oui !** Change "Target Folder" dans les paramètres (ex: `MesLivres`, `Books`, etc.)

### Synchronisation

**Q: Je dois faire quelque chose manuellement ?**
→ **Non.** Tu branches ta Kobo, tout se synchronise automatiquement.

**Q: Ça synchronise dans les deux sens ?**
→ **Oui !**
- Stomy → Kobo : copie des livres
- Kobo → Stomy : progression, notes, surlignages

**Q: Combien de temps ça prend ?**
→ Quelques secondes pour une dizaine de livres. Même avec 100+ livres, c'est rapide.

**Q: Je peux choisir ce qu'on synchronise ?**
→ **Oui !** Dans les paramètres, tu peux activer/désactiver :
- Progression de lecture
- Annotations
- Vocabulaire

### Problèmes

**Q: Ma Kobo n'est pas détectée**
→ Vérifie que :
- Le câble USB est bien branché
- La Kobo est en mode "USB mass storage" (pas juste en charge)
- Elle apparaît dans l'explorateur de fichiers (Finder sur Mac)

**Q: Certains livres ne se synchronisent pas**
→ Le plugin matche les livres par ISBN, puis par titre/auteur. Si un livre n'a ni ISBN ni titre similaire, il ne sera pas reconnu. Ajoute l'ISBN dans Stomy pour résoudre le problème.

**Q: Je ne vois pas mes annotations dans Stomy**
→ Vérifie que :
- L'option "Sync Annotations" est activée dans les paramètres
- Ta base Stomy a la table `annotations` (voir LIBRARY_INTEGRATION.md)

---

## 🎨 Exemples concrets

### Exemple 1 : Étudiant

**Profil :** Tu lis des manuels scolaires et tu prends beaucoup de notes

**Configuration recommandée :**
```
✅ Sync Reading Progress
✅ Sync Annotations  ← Important pour toi !
❌ Sync Vocabulary
✅ Use Library Folders
```

**Bibliothèques :**
- Mathématiques
- Histoire
- Littérature

**Résultat :**
```
/Stomy/
├── Mathématiques/  (tes manuels de maths)
├── Histoire/       (tes livres d'histoire)
└── Littérature/    (tes romans)
```

Tous tes surlignages et notes sont automatiquement sauvegardés dans Stomy !

---

### Exemple 2 : Lecteur occasionnel

**Profil :** Tu lis pour le plaisir, pas de notes particulières

**Configuration recommandée :**
```
✅ Sync Reading Progress  ← Pour suivre où tu en es
❌ Sync Annotations       (tu n'en prends pas)
❌ Sync Vocabulary
❌ Use Library Folders    (tout ensemble, plus simple)
```

**Résultat :**
```
/Stomy/
├── roman1.epub
├── roman2.epub
└── roman3.epub
```

Simple et efficace ! Tu sais juste où tu en es dans chaque livre.

---

### Exemple 3 : Apprenant en langue étrangère

**Profil :** Tu lis en anglais/espagnol et tu utilises le dictionnaire de la Kobo

**Configuration recommandée :**
```
✅ Sync Reading Progress
✅ Sync Annotations
✅ Sync Vocabulary  ← Important pour toi !
```

**Ce que tu obtiens :**
- Liste de tous les mots que tu as cherchés
- Le contexte (dans quel livre)
- Les dates (pour réviser régulièrement)

Parfait pour créer tes propres listes de vocabulaire !

---

### Exemple 4 : Famille avec une Kobo partagée

**Profil :** Papa, Maman, et les enfants lisent sur la même Kobo

**Configuration recommandée :**
```
✅ Use Library Folders
Prefix: (vide ou mettre le prénom)
```

**Bibliothèques Stomy :**
- Papa
- Maman
- Enfants

**Résultat sur la Kobo :**
```
/Stomy/
├── Papa/     (livres de papa)
├── Maman/    (livres de maman)
└── Enfants/  (livres des enfants)
```

Chacun retrouve facilement ses livres !

---

## 🎯 En résumé ultra-simple

Le plugin Kobo Sync fait **3 choses** :

### 1. 📤 Envoie des livres vers ta Kobo
Tu sélectionnes des livres dans Stomy → ils apparaissent sur ta Kobo (bien organisés)

### 2. 📥 Récupère ta progression de lecture
La Kobo te dit où tu en es → Stomy le sait aussi (avec tes notes et surlignages)

### 3. 🤖 Automatiquement
Tu branches ta Kobo → ça se fait tout seul

---

## 📚 Pour aller plus loin

Si tu veux en savoir plus (configuration avancée, détails techniques, etc.) :

- **README.md** - Documentation complète
- **MULTI_LIBRARY.md** - Guide détaillé du support multi-bibliothèque
- **LIBRARY_INTEGRATION.md** - Pour les développeurs (intégration avec Stomy)
- **INTEGRATION.md** - Configuration du backend Rust

---

**Besoin d'aide ?** Ouvre un ticket sur GitHub : https://github.com/izo/stomy-plugins

**Bonne lecture !** 📖✨
