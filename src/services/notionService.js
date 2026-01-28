// Service Notion pour sauvegarder les articles analysés
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || 'e0f35e1237844ace8745bd362e5dbaa3';

/**
 * Vérifie si un article existe déjà dans la base (par URL)
 */
async function articleExists(url) {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'URL',
        url: {
          equals: url
        }
      }
    });
    
    return response.results.length > 0;
  } catch (error) {
    console.error('Erreur vérification doublon:', error.message);
    return false;
  }
}

/**
 * Sauvegarde un article analysé dans Notion
 */
export async function saveArticle(article) {
  // Vérifier si l'article existe déjà
  if (await articleExists(article.link)) {
    console.log(`⏭️  Déjà présent: ${article.title.substring(0, 40)}...`);
    return null;
  }
  
  const { analysis } = article;
  
  try {
    const properties = {
      'Titre': {
        title: [{ text: { content: article.title.substring(0, 200) } }]
      },
      'URL': {
        url: article.link
      },
      'Date': {
        date: { start: article.pubDate.toISOString().split('T')[0] }
      },
      'Source': {
        select: { name: article.source }
      },
      'Type': {
        select: { name: analysis.type || 'Article presse' }
      },
      'Compétence municipale': {
        select: { name: analysis.competence || '📰 Autre / Général' }
      },
      'Score importance': {
        number: analysis.score_importance || 1
      },
      'Résumé': {
        rich_text: [{ text: { content: analysis.resume || '' } }]
      },
      'Alerte envoyée': {
        checkbox: false
      }
    };
    
    // Ajouter les candidats si présents
    if (analysis.candidats && analysis.candidats.length > 0) {
      properties['Candidat'] = {
        multi_select: analysis.candidats.map(name => ({ name }))
      };
    }
    
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties
    });
    
    console.log(`✅ Sauvegardé: ${article.title.substring(0, 40)}...`);
    return response;
    
  } catch (error) {
    console.error(`❌ Erreur sauvegarde: ${article.title}`, error.message);
    return null;
  }
}

/**
 * Marque un article comme "alerte envoyée"
 */
export async function markAlertSent(pageId) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Alerte envoyée': { checkbox: true }
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour alerte:', error.message);
  }
}

/**
 * Sauvegarde un lot d'articles
 */
export async function saveArticles(articles) {
  console.log(`\n💾 Sauvegarde de ${articles.length} articles dans Notion...\n`);
  
  const saved = [];
  
  for (const article of articles) {
    const result = await saveArticle(article);
    if (result) {
      saved.push({ ...article, notionPageId: result.id });
    }
    // Petit délai pour respecter les rate limits Notion
    await new Promise(resolve => setTimeout(resolve, 350));
  }
  
  console.log(`\n📊 ${saved.length} nouveaux articles sauvegardés\n`);
  return saved;
}

/**
 * Récupère les articles récents de la base
 */
export async function getRecentArticles(days = 1) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Date',
        date: {
          on_or_after: startDate.toISOString().split('T')[0]
        }
      },
      sorts: [
        { property: 'Score importance', direction: 'descending' }
      ]
    });
    
    return response.results.map(page => ({
      id: page.id,
      title: page.properties['Titre']?.title?.[0]?.text?.content || '',
      url: page.properties['URL']?.url || '',
      date: page.properties['Date']?.date?.start || '',
      source: page.properties['Source']?.select?.name || '',
      candidats: page.properties['Candidat']?.multi_select?.map(s => s.name) || [],
      competence: page.properties['Compétence municipale']?.select?.name || '',
      score: page.properties['Score importance']?.number || 0,
      resume: page.properties['Résumé']?.rich_text?.[0]?.text?.content || ''
    }));
    
  } catch (error) {
    console.error('Erreur récupération articles:', error.message);
    return [];
  }
}

/**
 * Récupère les articles pour un candidat spécifique
 */
export async function getArticlesByCandidat(candidatName, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Candidat',
            multi_select: { contains: candidatName }
          },
          {
            property: 'Date',
            date: { on_or_after: startDate.toISOString().split('T')[0] }
          }
        ]
      },
      sorts: [
        { property: 'Date', direction: 'descending' }
      ]
    });
    
    return response.results;
    
  } catch (error) {
    console.error('Erreur récupération par candidat:', error.message);
    return [];
  }
}

export default {
  saveArticle,
  saveArticles,
  markAlertSent,
  getRecentArticles,
  getArticlesByCandidat
};
