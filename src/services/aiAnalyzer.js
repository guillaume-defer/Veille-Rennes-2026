// Service d'analyse IA avec Claude pour catégoriser les articles
import Anthropic from '@anthropic-ai/sdk';
import { 
  CANDIDATS, 
  COMPETENCES_MUNICIPALES, 
  SCORING_RULES, 
  ALERT_THRESHOLD 
} from '../config/sources.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Analyse un article avec Claude pour le catégoriser
 */
export async function analyzeArticle(article) {
  const candidatsNames = CANDIDATS.map(c => c.name).join(', ');
  const competencesNames = COMPETENCES_MUNICIPALES.map(c => c.name).join(', ');
  
  const prompt = `Tu es un assistant spécialisé dans la veille politique locale française.

Analyse cet article sur l'actualité rennaise et catégorise-le.

ARTICLE:
Titre: ${article.title}
Source: ${article.source}
Date: ${article.pubDate.toISOString()}
Contenu: ${article.content.substring(0, 1500)}

CANDIDATS AUX MUNICIPALES 2026 À RENNES:
${candidatsNames}

COMPÉTENCES MUNICIPALES (DGCL):
${competencesNames}

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "candidats": ["nom1", "nom2"] ou [] si aucun,
  "competence": "🚔 Sécurité" ou autre compétence la plus pertinente,
  "type": "Article presse" | "Interview" | "Sondage" | "Meeting / Événement" | "Programme" | "Polémique" | "Communiqué officiel" | "Autre",
  "resume": "Résumé en 1-2 phrases (max 200 caractères)",
  "pertinence_elections": true | false,
  "score_importance": 1-10 (1=faible, 10=très important pour la campagne)
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    });
    
    const responseText = response.content[0].text;
    
    // Extraire le JSON de la réponse
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Pas de JSON trouvé dans la réponse');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    // Calculer le score final
    const finalScore = calculateScore(article, analysis);
    
    return {
      ...analysis,
      score_importance: finalScore,
      isAlert: finalScore >= ALERT_THRESHOLD
    };
    
  } catch (error) {
    console.error('Erreur analyse IA:', error.message);
    
    // Fallback: analyse basique par mots-clés
    return fallbackAnalysis(article);
  }
}

/**
 * Calcul du score d'importance
 */
function calculateScore(article, analysis) {
  let score = analysis.score_importance || 1;
  
  // Bonus candidat prioritaire (Charles Compagnon)
  if (analysis.candidats?.includes('Charles Compagnon')) {
    score += SCORING_RULES.candidatPrioritaire;
  } else if (analysis.candidats?.length > 0) {
    score += SCORING_RULES.autreCandidat;
  }
  
  // Bonus thème sécurité
  if (analysis.competence?.includes('Sécurité')) {
    score += SCORING_RULES.themeSécurité;
  }
  
  // Bonus type spécial
  if (analysis.type === 'Sondage') {
    score += SCORING_RULES.sondage;
  }
  if (analysis.type === 'Polémique') {
    score += SCORING_RULES.polemique;
  }
  if (analysis.type === 'Meeting / Événement' || analysis.type === 'Programme') {
    score += SCORING_RULES.annonceEvenement;
  }
  
  // Bonus pertinence élections
  if (analysis.pertinence_elections) {
    score += SCORING_RULES.motsClesElections;
  }
  
  return Math.min(score, 20); // Cap à 20
}

/**
 * Analyse de fallback par mots-clés (sans IA)
 */
function fallbackAnalysis(article) {
  const content = `${article.title} ${article.content}`.toLowerCase();
  
  // Détecter les candidats
  const candidats = CANDIDATS
    .filter(c => c.keywords.some(kw => content.includes(kw.toLowerCase())))
    .map(c => c.notionValue);
  
  // Détecter la compétence
  let competence = '📰 Autre / Général';
  for (const comp of COMPETENCES_MUNICIPALES) {
    if (comp.keywords.some(kw => content.includes(kw.toLowerCase()))) {
      competence = comp.name;
      break;
    }
  }
  
  // Calculer un score basique
  let score = 1;
  if (candidats.includes('Charles Compagnon')) score += 5;
  else if (candidats.length > 0) score += 3;
  if (content.includes('élection') || content.includes('municipale')) score += 3;
  if (content.includes('sécurité') || content.includes('insécurité')) score += 2;
  
  return {
    candidats,
    competence,
    type: 'Article presse',
    resume: article.title.substring(0, 200),
    pertinence_elections: content.includes('élection') || content.includes('municipale') || content.includes('2026'),
    score_importance: score,
    isAlert: score >= ALERT_THRESHOLD
  };
}

/**
 * Analyse un lot d'articles (avec rate limiting)
 */
export async function analyzeArticles(articles, useAI = true) {
  console.log(`\n🤖 Analyse de ${articles.length} articles...\n`);
  
  const results = [];
  
  for (const article of articles) {
    try {
      let analysis;
      
      if (useAI && process.env.ANTHROPIC_API_KEY) {
        analysis = await analyzeArticle(article);
        // Rate limiting: 1 requête par seconde
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        analysis = fallbackAnalysis(article);
      }
      
      results.push({
        ...article,
        analysis
      });
      
      const emoji = analysis.isAlert ? '🚨' : '📄';
      console.log(`${emoji} [${analysis.score_importance}] ${article.title.substring(0, 60)}...`);
      
    } catch (error) {
      console.error(`❌ Erreur analyse: ${article.title}`, error.message);
      results.push({
        ...article,
        analysis: fallbackAnalysis(article)
      });
    }
  }
  
  return results;
}

export default {
  analyzeArticle,
  analyzeArticles
};
