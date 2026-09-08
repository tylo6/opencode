#!/usr/bin/env node

import 'dotenv/config.js';
import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';

console.log('\n🧪 Opencode — Test des modèles');
console.log('═'.repeat(60));

const results = {};

// Test 1 : Anthropic
async function testAnthropic() {
  console.log('\n📍 Anthropic Claude');

  if (!process.env.ANTHROPIC_KEY) {
    console.log('   ❌ ANTHROPIC_KEY manquante dans .env');
    return false;
  }

  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_KEY,
    });

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Réponds simplement: OK' }],
    });

    if (response.content[0].text.includes('OK')) {
      console.log(`   ✅ Connecté — ${response.model}`);
      results.anthropic = true;
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    results.anthropic = false;
    return false;
  }
}

// Test 2 : LM Studio
async function testLMStudio() {
  console.log('\n📍 LM Studio (local)');

  const baseUrl = (process.env.LMSTUDIO_URL || 'http://localhost:1234').replace(/\/$/, '');

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);

    const response = await fetch(`${baseUrl}/v1/models`, {
      signal: ctrl.signal,
    });

    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      const modelName = data.data?.[0]?.id || 'unknown';
      console.log(`   ✅ Accessible sur ${baseUrl}`);
      console.log(`      Modèle actif: ${modelName}`);
      results.lmstudio = true;
      return true;
    }
  } catch (error) {
    console.log(`   ❌ LM Studio inaccessible sur ${baseUrl}`);
    results.lmstudio = false;
    return false;
  }
}

// Test 3 : Vérifier .env
function testEnv() {
  console.log('\n📍 Configuration (.env)');

  const keys = {
    'ANTHROPIC_KEY': process.env.ANTHROPIC_KEY ? '✅' : '❌',
    'LMSTUDIO_URL': process.env.LMSTUDIO_URL ? '✅' : '❌',
  };

  let allSet = true;
  for (const [key, status] of Object.entries(keys)) {
    console.log(`   ${status} ${key}`);
    if (status === '❌') allSet = false;
  }

  return allSet;
}

// Rapport final
async function runTests() {
  testEnv();

  await testAnthropic();
  await testLMStudio();

  console.log('\n' + '═'.repeat(60));
  console.log('📊 Résumé');
  console.log('─'.repeat(60));

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;

  for (const [model, status] of Object.entries(results)) {
    const icon = status ? '✅' : '❌';
    console.log(`   ${icon} ${model}`);
  }

  console.log(`\n   ${passed}/${total} modèles disponibles`);

  if (passed === 0) {
    console.log('\n⚠️  Aucun modèle disponible.');
    console.log('   → Vérifier .env et les clés API');
    process.exit(1);
  } else if (passed < total) {
    console.log('\n⚠️  Certains modèles manquent.');
    console.log('   → Vérifier .env');
  } else {
    console.log('\n✨ Tous les modèles sont prêts !');
  }

  console.log('\n🚀 Commandes:');
  console.log('   node cli/index.js --model anthropic "votre message"');
  console.log('   node cli/index.js --model lmstudio "votre message"');
  console.log('\n');
}

runTests();
