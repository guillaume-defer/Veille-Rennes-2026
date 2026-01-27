// Veille Rennes 2026 - Serveur principal
import 'dotenv/config';
import express from 'express';
import cron from 'node-cron';

import { collectAllArticles } from './services/rssCollector.js';
import { analyzeArticles } from './services/aiAnalyzer.js';
import { saveArticles, getRecentArticles, markAlertSent } from './services/notionService.js';
import { initBot, sendAlert, sendDailyRecap, sendWelcome } from './services/telegramService.js';
import { initEmail, sendDailyEmail } from './services/emailService.js';
import { ALERT_THRESHOLD, RECAP_CONFIG } from './config/sources.js';

const app = express();
const PORT = process.env.PORT || 3000;

// État global
let lastCheck = new Date();
let isRunning = false;

/**
 * Exécute le cycle complet de veille
 */
async function runVeilleCycle(hoursBack = 6) {
  if (isRunning) {
    console.log('⏳ Cycle déjà en cours...');
    return;
  }
  
  isRunning = true;
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 CYCLE DE VEILLE - ${new Date().toLocaleString('fr-FR')}`);
  console.log('='.repeat(60));
  
  try {
    // 1. Collecter les articles RSS
    const articles = await collectAllArticles(hoursBack);
    
    if (articles.length === 0) {
      console.log('📭 Aucun nouvel article');
      return;
    }
    
    // 2. Analyser avec IA (ou fallback)
    const useAI = !!process.env.ANTHROPIC_API_KEY;
    const analyzed = await analyzeArticles(articles, useAI);
    
    // 3. Sauvegarder dans Notion
    const saved = await saveArticles(analyzed);
    
    // 4. Envoyer les alertes Telegram (score >= seuil)
    const alerts = saved.filter(a => a.analysis?.isAlert);
    console.log(`\n🚨 ${alerts.length} alertes à envoyer\n`);
    
    for (const article of alerts) {
      const sent = await sendAlert(article);
      if (sent && article.notionPageId) {
        await markAlertSent(article.notionPageId);
      }
      // Délai entre les messages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    lastCheck = new Date();
    console.log('\n✅ Cycle terminé');
    
    return { collected: articles.length, saved: saved.length, alerts: alerts.length };
    
  } catch (error) {
    console.error('❌ Erreur cycle veille:', error);
    return null;
    
  } finally {
    isRunning = false;
  }
}

/**
 * Envoie le récap quotidien
 */
async function sendDailyRecapTask() {
  console.log('\n📅 Envoi du récap quotidien...');
  
  try {
    const articles = await getRecentArticles(1);
    
    // Telegram
    await sendDailyRecap(articles);
    
    // Email
    if (process.env.EMAIL_RECIPIENT) {
      await sendDailyEmail(articles);
    }
    
    console.log('✅ Récap quotidien envoyé');
    
  } catch (error) {
    console.error('❌ Erreur récap quotidien:', error);
  }
}

/**
 * API Endpoints
 */
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Veille Rennes 2026',
    status: 'running',
    lastCheck: lastCheck.toISOString(),
    isRunning
  });
});

// Forcer un cycle de veille
app.post('/run', async (req, res) => {
  const hours = req.body?.hours || 6;
  res.json({ message: 'Cycle lancé', hours });
  runVeilleCycle(hours);
});

// Envoyer le récap
app.post('/recap', async (req, res) => {
  res.json({ message: 'Récap lancé' });
  sendDailyRecapTask();
});

// Statistiques
app.get('/stats', async (req, res) => {
  try {
    const articles = await getRecentArticles(7);
    
    const stats = {
      total7days: articles.length,
      byCandidat: {},
      byCompetence: {},
      alertsCount: articles.filter(a => (a.score || 0) >= ALERT_THRESHOLD).length
    };
    
    for (const a of articles) {
      for (const c of (a.candidats || [])) {
        stats.byCandidat[c] = (stats.byCandidat[c] || 0) + 1;
      }
      if (a.competence) {
        stats.byCompetence[a.competence] = (stats.byCompetence[a.competence] || 0) + 1;
      }
    }
    
    res.json(stats);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Démarrage du serveur
 */
async function start() {
  console.log('\n🌊 Veille Rennes 2026 - Élections municipales');
  console.log('='.repeat(50));
  
  // Vérifier les variables d'environnement
  const checks = [
    { name: 'TELEGRAM_BOT_TOKEN', value: process.env.TELEGRAM_BOT_TOKEN },
    { name: 'NOTION_API_KEY', value: process.env.NOTION_API_KEY },
    { name: 'ANTHROPIC_API_KEY', value: process.env.ANTHROPIC_API_KEY, optional: true },
    { name: 'RESEND_API_KEY', value: process.env.RESEND_API_KEY, optional: true },
    { name: 'EMAIL_RECIPIENT', value: process.env.EMAIL_RECIPIENT, optional: true }
  ];
  
  console.log('\n📋 Configuration:');
  for (const check of checks) {
    const status = check.value ? '✅' : (check.optional ? '⚠️' : '❌');
    console.log(`   ${status} ${check.name}: ${check.value ? 'OK' : 'Non défini'}`);
  }
  
  // Initialiser les services
  initBot();
  initEmail();
  
  // Planifier les tâches cron
  console.log('\n⏰ Tâches planifiées:');
  
  // Veille toutes les 2 heures
  cron.schedule('0 */2 * * *', () => {
    console.log('\n⏰ [CRON] Cycle de veille automatique');
    runVeilleCycle(3);
  });
  console.log('   • Veille: toutes les 2 heures');
  
  // Récap quotidien à 7h
  cron.schedule(RECAP_CONFIG.daily.cron, () => {
    console.log('\n⏰ [CRON] Récap quotidien');
    sendDailyRecapTask();
  });
  console.log(`   • Récap quotidien: ${RECAP_CONFIG.daily.cron}`);
  
  // Récap hebdo le lundi à 8h
  cron.schedule(RECAP_CONFIG.weekly.cron, async () => {
    console.log('\n⏰ [CRON] Récap hebdomadaire');
    const articles = await getRecentArticles(7);
    await sendDailyRecap(articles); // Utilise le même format pour l'instant
    await sendDailyEmail(articles);
  });
  console.log(`   • Récap hebdomadaire: ${RECAP_CONFIG.weekly.cron}`);
  
  // Démarrer le serveur HTTP
  app.listen(PORT, () => {
    console.log(`\n🌐 Serveur démarré sur le port ${PORT}`);
    console.log(`   http://localhost:${PORT}`);
  });
  
  // Message de bienvenue Telegram
  await sendWelcome();
  
  // Premier cycle au démarrage
  console.log('\n🏁 Lancement du premier cycle de veille...');
  await runVeilleCycle(24); // Dernières 24h au démarrage
}

// Gestion des erreurs non catchées
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non catchée:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Promesse rejetée:', error);
});

// Démarrer l'application
start().catch(console.error);
