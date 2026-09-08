#!/usr/bin/env node

import 'dotenv/config.js';
import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';

// Parse arguments
const args = process.argv.slice(2);
let model = 'anthropic';
let message = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--model') {
    model = args[i + 1];
    i++;
  } else {
    message = args[i];
  }
}

if (!message) {
  console.error('❌ Usage: node cli/index.js [--model anthropic|lmstudio] "votre message"');
  process.exit(1);
}

// Validation clés
if (model === 'anthropic' && !process.env.ANTHROPIC_KEY) {
  console.error('❌ ANTHROPIC_KEY manquante dans .env');
  process.exit(1);
}

if (model === 'lmstudio' && !process.env.LMSTUDIO_URL) {
  console.error('❌ LMSTUDIO_URL manquante dans .env');
  process.exit(1);
}

// Appel API
async function callModel() {
  try {
    if (model === 'anthropic') {
      await callAnthropic(message);
    } else if (model === 'lmstudio') {
      await callLMStudio(message);
    } else {
      console.error(`❌ Modèle non supporté: ${model}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Erreur [${model}]:`, error.message);
    process.exit(1);
  }
}

async function callAnthropic(text) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_KEY,
  });

  console.log(`\n📤 Anthropic — ${text}`);
  console.log('─'.repeat(60));

  const response = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    messages: [{ role: 'user', content: text }],
  });

  const result = response.content[0].text;
  console.log(result);
  console.log('─'.repeat(60));
  console.log(`✅ Tokens utilisés: ${response.usage.input_tokens} in / ${response.usage.output_tokens} out\n`);
}

async function callLMStudio(text) {
  const baseUrl = (process.env.LMSTUDIO_URL || 'http://localhost:1234').replace(/\/$/, '');
  const model = process.env.LMSTUDIO_MODEL || 'local-model';

  console.log(`\n📤 LM Studio (${model}) — ${text}`);
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: text }],
        max_tokens: 1024,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'Pas de réponse';
    console.log(result);
    console.log('─'.repeat(60));
    console.log(`✅ LM Studio répond (${data.model})\n`);
  } catch (error) {
    throw new Error(`Impossible de joindre LM Studio sur ${baseUrl}: ${error.message}`);
  }
}

// Lancer
callModel();
