#!/bin/bash

# Script d'initialisation Opencode
# Usage: bash scripts/setup.sh

set -e

OPENCODE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$OPENCODE_DIR"

echo ""
echo "🚀 Opencode — Configuration initiale"
echo "════════════════════════════════════════════════════"

# Étape 1 : Vérifier Node.js
echo ""
echo "📍 Vérification Node.js..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js non trouvé. Installer Node.js 20+ puis relancer."
  exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ requis (tu as v$NODE_VERSION)"
  exit 1
fi
echo "✅ Node.js $(node -v) détecté"

# Étape 2 : Installer les dépendances
echo ""
echo "📍 Installation des dépendances..."
if [ -d "node_modules" ]; then
  echo "   node_modules déjà présent, on ignore"
else
  npm install --silent
  echo "✅ Dépendances installées"
fi

# Étape 3 : Créer .env
echo ""
echo "📍 Configuration .env..."
if [ -f ".env" ]; then
  echo "   ✅ .env existe déjà"
else
  cp .env.example .env
  echo "✅ .env créé (copie de .env.example)"
  echo ""
  echo "   ⚠️  IMPORTANT :"
  echo "       → Édite .env et ajoute ta clé ANTHROPIC_KEY"
  echo "       → Commande: nano .env"
  echo ""
fi

# Étape 4 : Tester
echo ""
echo "📍 Test de connexion..."
if node tests/test-api.js; then
  echo ""
  echo "✨ Configuration terminée !"
  echo ""
  echo "Prêt à utiliser :"
  echo "  • node cli/index.js --model anthropic \"bonjour\""
  echo "  • npm test (relancer les tests)"
  echo ""
else
  echo ""
  echo "⚠️  Les tests ont échoué. Vérifier .env"
  echo ""
fi
