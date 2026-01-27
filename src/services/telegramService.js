// Service Telegram pour les notifications temps réel
import TelegramBot from 'node-telegram-bot-api';
import { CANDIDATS } from '../config/sources.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1003854159702';

let bot = null;

/**
 * Initialise le bot Telegram
 */
export function initBot() {
  if (!BOT_TOKEN) {
    console.warn('⚠️  TELEGRAM_BOT_TOKEN non défini');
    return null;
  }
  
  bot = new TelegramBot(BOT_TOKEN, { polling: false });
  console.log('🤖 Bot Telegram initialisé');
  return bot;
}

/**
 * Formate un article pour Telegram (Markdown)
 */
function formatArticleMessage(article) {
  const { analysis } = article;
  
  // Emoji selon le score
  let urgencyEmoji = '📰';
  if (analysis.score_importance >= 15) urgencyEmoji = '🚨🚨';
  else if (analysis.score_importance >= 10) urgencyEmoji = '🚨';
  else if (analysis.score_importance >= 8) urgencyEmoji = '⚡';
  
  // Candidats mentionnés
  let candidatsText = '';
  if (analysis.candidats && analysis.candidats.length > 0) {
    const candidatsEmojis = analysis.candidats.map(name => {
      const candidat = CANDIDATS.find(c => c.notionValue === name);
      return candidat ? `${candidat.name} (${candidat.parti})` : name;
    });
    candidatsText = `\n👤 *Candidat(s):* ${candidatsEmojis.join(', ')}`;
  }
  
  // Score visuel
  const scoreBar = '█'.repeat(Math.min(Math.round(analysis.score_importance / 2), 10));
  const scoreEmpty = '░'.repeat(10 - scoreBar.length);
  
  const message = `${urgencyEmoji} *ALERTE VEILLE RENNES*

📌 *${escapeMarkdown(article.title)}*

${analysis.competence}${candidatsText}

📊 Importance: ${scoreBar}${scoreEmpty} ${analysis.score_importance}/20

📝 ${escapeMarkdown(analysis.resume || '')}

📰 Source: ${article.source}
🗓 ${formatDate(article.pubDate)}

🔗 [Lire l'article](${article.link})`;

  return message;
}

/**
 * Échappe les caractères spéciaux Markdown
 */
function escapeMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/`/g, '\\`');
}

/**
 * Formate une date en français
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Envoie une notification d'alerte pour un article
 */
export async function sendAlert(article) {
  if (!bot) {
    console.warn('⚠️  Bot Telegram non initialisé');
    return false;
  }
  
  try {
    const message = formatArticleMessage(article);
    
    await bot.sendMessage(CHANNEL_ID, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: false
    });
    
    console.log(`📤 Alerte envoyée: ${article.title.substring(0, 40)}...`);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur envoi Telegram:', error.message);
    return false;
  }
}

/**
 * Envoie un message simple
 */
export async function sendMessage(text) {
  if (!bot) return false;
  
  try {
    await bot.sendMessage(CHANNEL_ID, text, {
      parse_mode: 'Markdown'
    });
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi message:', error.message);
    return false;
  }
}

/**
 * Envoie un récap quotidien
 */
export async function sendDailyRecap(articles) {
  if (!bot || articles.length === 0) return false;
  
  // Trier par score décroissant
  const sorted = [...articles].sort((a, b) => 
    (b.score || 0) - (a.score || 0)
  );
  
  // Top 10
  const top = sorted.slice(0, 10);
  
  // Statistiques
  const candidatStats = {};
  for (const a of articles) {
    for (const c of (a.candidats || [])) {
      candidatStats[c] = (candidatStats[c] || 0) + 1;
    }
  }
  
  let statsText = '';
  if (Object.keys(candidatStats).length > 0) {
    statsText = '\n\n📊 *Mentions candidats:*\n' + 
      Object.entries(candidatStats)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => `• ${name}: ${count}`)
        .join('\n');
  }
  
  const message = `📅 *RÉCAP QUOTIDIEN - ${formatDate(new Date())}*

📰 ${articles.length} articles analysés

🏆 *Top actualités:*
${top.map((a, i) => `${i + 1}. ${escapeMarkdown(a.title?.substring(0, 60) || '')}... (${a.score || 0})`).join('\n')}
${statsText}

📂 Voir tous les articles dans Notion`;

  try {
    await bot.sendMessage(CHANNEL_ID, message, {
      parse_mode: 'Markdown'
    });
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi récap:', error.message);
    return false;
  }
}

/**
 * Envoie un message de bienvenue/test
 */
export async function sendWelcome() {
  const message = `🎉 *Veille Rennes 2026 activée !*

Ce canal recevra automatiquement:
• 🚨 Alertes temps réel (articles importants)
• 📅 Récap quotidien (7h)
• 📊 Synthèse hebdomadaire (lundi 8h)

Focus: *Élections municipales Rennes 2026*
Candidat suivi en priorité: *Charles Compagnon*

📂 Base de données Notion synchronisée
🤖 Analyse IA (Claude) des articles

_Veille démarrée le ${formatDate(new Date())}_`;

  return sendMessage(message);
}

export default {
  initBot,
  sendAlert,
  sendMessage,
  sendDailyRecap,
  sendWelcome
};
