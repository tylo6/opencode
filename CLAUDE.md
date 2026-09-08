# CLAUDE.md — Opencode

> Outil universel IA : CLI + API + Desktop
> Multimodèle (Anthropic, Azure, OpenAI, LM Studio)
> Contexte souverain (Obsidian Vault)

---

## 🎯 Objectif

**Opencode** = interface unifiée pour interagir avec plusieurs fournisseurs LLM en gardant la main sur :
- Le **choix du modèle** (Anthropic par défaut, mais flexible)
- Le **contexte personnel** (stocké dans Obsidian, jamais en cloud)
- La **clé API** (locale, chiffrée si possible)

---

## 📁 Architecture

```
Opencode/
├── .env                    # Clés API perso (ignoré git)
├── .env.example            # Template public
├── package.json
├── CLAUDE.md               # Ce fichier
│
├── cli/
│   └── index.js           # Point d'entrée CLI
│
├── api/
│   └── server.js          # Serveur Express (optionnel)
│
├── desktop/
│   └── main.js            # Electron/Tauri (ultérieur)
│
└── tests/
    └── test-api.js        # Validation des modèles
```

---

## 🔐 Gestion des clés

**Hiérarchie de chargement :**
1. `.env` local (personnelle, non versionné)
2. Obsidian Vault : note `🔐 Keys-Opencode.md` (optionnel, backup chiffré)
3. Fallback : error + message explicite

**Variables attendues dans `.env` :**
```
ANTHROPIC_KEY=sk-ant-xxxxx       # Clé Anthropic (prioritaire)
AZURE_KEY=                       # (optionnel)
AZURE_ENDPOINT=                  # (optionnel)
OPENAI_KEY=                      # (optionnel)
LMSTUDIO_URL=http://localhost:1234
PORT=3000
```

---

## 🚀 Démarrage

### CLI
```bash
node cli/index.js --model anthropic "Dis bonjour"
node cli/index.js --model lmstudio "Qui suis-je ?"
```

### API (serveur)
```bash
node api/server.js
# → http://localhost:3000
```

### Validation
```bash
npm test                         # Teste tous les modèles configurés
```

---

## 🤖 Modèles supportés

| Fournisseur | Modèle | Var env | Support |
|---|---|---|---|
| **Anthropic** | claude-3-haiku-20240307 | `ANTHROPIC_KEY` | ✅ Actif |
| Azure OpenAI | `AZURE_KEY` + `AZURE_ENDPOINT` | ⏳ Futur |
| OpenAI direct | `OPENAI_KEY` | ⏳ Futur |
| LM Studio | `LMSTUDIO_URL` | ✅ Local |

---

## 📝 Conventions

- **Langue code** : Anglais (variables, fonctions, imports)
- **Commentaires** : Français
- **Commits** : Français
- **Pas de dépendances inutiles** : dotenv + @anthropic-ai/sdk + express minimum
- **Gestion d'erreur** : Toujours try/catch + message utilisateur clair

---

## 🔗 Ressources

- [console.anthropic.com](https://console.anthropic.com) — Clés Anthropic
- Obsidian Vault : `/Users/marcou/Documents/Obsidian Vault/03-PROJETS/Dev/Opencode/`

---

## 🧠 Notes d'implémentation

- `.env` chargé via `dotenv` au démarrage du CLI/API
- Chaque appel API est indépendant (pas d'état serveur)
- Résultats optionnellement cachés dans Obsidian (futur)
