// Service Email pour les récaps quotidiens/hebdomadaires
import { Resend } from 'resend';

let resend = null;

/**
 * Initialise le service email
 */
export function initEmail() {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY non défini - emails désactivés');
    return null;
  }
  
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('📧 Service email initialisé');
  return resend;
}

/**
 * Génère le HTML du récap quotidien
 */
function generateDailyEmailHTML(articles, date) {
  // Trier par score décroissant
  const sorted = [...articles].sort((a, b) => (b.score || 0) - (a.score || 0));
  
  // Statistiques par candidat
  const candidatStats = {};
  const competenceStats = {};
  
  for (const a of articles) {
    for (const c of (a.candidats || [])) {
      candidatStats[c] = (candidatStats[c] || 0) + 1;
    }
    if (a.competence) {
      competenceStats[a.competence] = (competenceStats[a.competence] || 0) + 1;
    }
  }
  
  const articlesHTML = sorted.slice(0, 15).map(a => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background: ${getScoreColor(a.score || 0)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
            ${a.score || 0}
          </span>
          <a href="${a.url}" style="color: #1a56db; text-decoration: none; font-weight: 500;">
            ${escapeHtml(a.title || 'Sans titre')}
          </a>
        </div>
        <div style="margin-top: 4px; font-size: 13px; color: #666;">
          ${a.source} • ${a.competence || ''} 
          ${a.candidats?.length > 0 ? `• 👤 ${a.candidats.join(', ')}` : ''}
        </div>
        ${a.resume ? `<div style="margin-top: 4px; font-size: 13px; color: #444;">${escapeHtml(a.resume)}</div>` : ''}
      </td>
    </tr>
  `).join('');
  
  const candidatStatsHTML = Object.entries(candidatStats)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `
      <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f0f0f0;">
        <span>${name}</span>
        <span style="font-weight: bold;">${count}</span>
      </div>
    `).join('');
  
  const competenceStatsHTML = Object.entries(competenceStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => `
      <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f0f0f0;">
        <span>${name}</span>
        <span style="font-weight: bold;">${count}</span>
      </div>
    `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Veille Rennes 2026 - Récap quotidien</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
  
  <div style="background: linear-gradient(135deg, #1a56db 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">📰 Veille Rennes 2026</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9;">Récap quotidien du ${formatDateFr(date)}</p>
  </div>
  
  <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Statistiques globales -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 30px;">
      <div style="background: #f0f7ff; padding: 16px; border-radius: 8px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #1a56db;">${articles.length}</div>
        <div style="font-size: 13px; color: #666;">Articles analysés</div>
      </div>
      <div style="background: #f0fff4; padding: 16px; border-radius: 8px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #059669;">${Object.keys(candidatStats).length}</div>
        <div style="font-size: 13px; color: #666;">Candidats mentionnés</div>
      </div>
      <div style="background: #fef3c7; padding: 16px; border-radius: 8px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #d97706;">${sorted.filter(a => (a.score || 0) >= 8).length}</div>
        <div style="font-size: 13px; color: #666;">Alertes</div>
      </div>
    </div>
    
    <!-- Top articles -->
    <h2 style="font-size: 18px; margin-bottom: 16px; color: #1a56db;">🏆 Top actualités</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      ${articlesHTML || '<tr><td style="padding: 20px; text-align: center; color: #666;">Aucun article aujourd\'hui</td></tr>'}
    </table>
    
    <!-- Stats candidats -->
    ${Object.keys(candidatStats).length > 0 ? `
    <h2 style="font-size: 18px; margin-bottom: 16px; color: #1a56db;">👤 Mentions par candidat</h2>
    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
      ${candidatStatsHTML}
    </div>
    ` : ''}
    
    <!-- Stats thèmes -->
    ${Object.keys(competenceStats).length > 0 ? `
    <h2 style="font-size: 18px; margin-bottom: 16px; color: #1a56db;">📊 Thèmes principaux</h2>
    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
      ${competenceStatsHTML}
    </div>
    ` : ''}
    
    <!-- CTA Notion -->
    <div style="text-align: center; padding: 20px; background: #f0f7ff; border-radius: 8px;">
      <p style="margin: 0 0 12px 0;">Accéder à tous les articles dans Notion</p>
      <a href="https://www.notion.so/e0f35e1237844ace8745bd362e5dbaa3" 
         style="display: inline-block; background: #1a56db; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
        Ouvrir la base Notion →
      </a>
    </div>
    
  </div>
  
  <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
    Veille automatisée par Claude AI • Élections municipales Rennes 2026
  </div>
  
</body>
</html>`;
}

/**
 * Retourne la couleur selon le score
 */
function getScoreColor(score) {
  if (score >= 15) return '#dc2626';
  if (score >= 10) return '#ea580c';
  if (score >= 8) return '#d97706';
  if (score >= 5) return '#2563eb';
  return '#6b7280';
}

/**
 * Formate une date en français
 */
function formatDateFr(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Échappe les caractères HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Envoie le récap quotidien par email
 */
export async function sendDailyEmail(articles) {
  if (!resend) {
    console.warn('⚠️  Service email non initialisé');
    return false;
  }
  
  const recipient = process.env.EMAIL_RECIPIENT;
  if (!recipient) {
    console.warn('⚠️  EMAIL_RECIPIENT non défini');
    return false;
  }
  
  const date = new Date();
  const html = generateDailyEmailHTML(articles, date);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Veille Rennes <onboarding@resend.dev>',
      to: [recipient],
      subject: `📰 Veille Rennes - ${articles.length} articles du ${formatDateFr(date)}`,
      html
    });
    
    if (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
    
    console.log('📧 Email quotidien envoyé:', data?.id);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error.message);
    return false;
  }
}

/**
 * Envoie le récap hebdomadaire par email
 */
export async function sendWeeklyEmail(articles) {
  // Similaire au quotidien mais avec stats sur 7 jours
  // TODO: Implémenter une version étendue
  return sendDailyEmail(articles);
}

export default {
  initEmail,
  sendDailyEmail,
  sendWeeklyEmail
};
