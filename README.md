# Opencode

Outil universel IA : CLI + API + Desktop, multimodèle, contexte souverain.

## 🎯 Objectif

- **Choisir le modèle** : Anthropic, Azure, OpenAI, LM Studio
- **Garder la main** : contexte personnel dans Obsidian Vault
- **Clé API sécurisée** : locale, non versionné

## 🚀 Démarrage rapide

### 1️⃣ Installation

```bash
cd /Users/marcou/Documents/Obsidian\ Vault/03-PROJETS/Dev/Opencode

# Initialisation guidée (recommandé)
bash scripts/setup.sh
```

Ou manuellement :

```bash
# Installer les dépendances
npm install

# Créer .env personnel
cp .env.example .env

# Éditer et ajouter ta clé Anthropic
nano .env
```

### 2️⃣ Tester

```bash
# Vérifier que les modèles sont accessibles
npm test

# Ou directement
node tests/test-api.js
```

### 3️⃣ Utiliser le CLI

```bash
# Anthropic (par défaut)
node cli/index.js --model anthropic "Dis bonjour"

# LM Studio (local)
node cli/index.js --model lmstudio "Qui suis-je ?"

# Alias court
npm run cli -- --model anthropic "Dis bonjour"
```

## 📁 Structure

```
Opencode/
├── cli/index.js           # CLI principal
├── tests/test-api.js      # Validation des modèles
├── scripts/setup.sh       # Script d'initialisation
├── .env.example           # Template (public)
├── .env                   # Clés perso (ignoré git)
└── CLAUDE.md              # Guide développeur
```

## 🔐 Gestion des clés

**`.env` (personnel, jamais versionné) :**
```
ANTHROPIC_KEY=sk-ant-xxxxxxxxxxxxx
LMSTUDIO_URL=http://localhost:1234
```

**Obsidian Vault (optionnel, backup chiffré) :**
Créer une note `🔐 Keys-Opencode.md` dans Obsidian pour conserver une copie de sauvegarde.

## 🤖 Modèles supportés

| Modèle | Status | Variable |
|--------|--------|----------|
| Anthropic Claude | ✅ Actif | `ANTHROPIC_KEY` |
| LM Studio | ✅ Actif | `LMSTUDIO_URL` |
| Azure OpenAI | ⏳ Prévu | `AZURE_KEY` + `AZURE_ENDPOINT` |
| OpenAI | ⏳ Prévu | `OPENAI_KEY` |

## 📖 Commandes

```bash
npm run cli              # Lancer le CLI
npm test                 # Tester les modèles
npm run api              # Serveur (futur)
bash scripts/setup.sh    # Réinitialiser
```

## 🔗 Liens utiles

- [console.anthropic.com](https://console.anthropic.com) — Clés Anthropic
- CLAUDE.md — Guide développeur

## 📝 Notes

- Node.js 18+ requis
- ES modules (`import/export`)
- Commentaires en français, code en anglais
