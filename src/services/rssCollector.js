// Service de collecte des flux RSS
import Parser from 'rss-parser';
import { RSS_SOURCES, RENNES_KEYWORDS } from '../config/sources.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'VeilleRennes2026/1.0 (+https://github.com/veille-rennes)'
  }
});

/**
 * Vérifie si un article contient des mots-clés liés à Rennes
 */
function isAboutRennes(item, sourceFilter) {
  const content = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`.toLowerCase();
  
  // Si la source a un filtre spécifique, l'utiliser
  if (sourceFilter) {
    const filterRegex = new RegExp(sourceFilter, 'i');
    return filterRegex.test(content);
  }
  
  // Sinon, vérifier les mots-clés Rennes
  return RENNES_KEYWORDS.some(keyword => content.includes(keyword.toLowerCase()));
}

/**
 * Collecte les articles d'une source RSS
 */
async function fetchSource(source) {
  try {
    console.log(`📡 Récupération: ${source.name}`);
    const feed = await parser.parseURL(source.url);
    
    const articles = feed.items
      .filter(item => {
        // Filtrer si la source a un filtre
        if (source.filter) {
          return isAboutRennes(item, source.filter);
        }
        return true;
      })
      .map(item => ({
        title: item.title?.trim() || 'Sans titre',
        link: item.link || item.guid,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        content: item.contentSnippet || item.content || '',
        source: source.notionSource,
        sourcePriority: source.priority
      }));
    
    console.log(`   ✅ ${articles.length} articles trouvés`);
    return articles;
    
  } catch (error) {
    console.error(`   ❌ Erreur ${source.name}:`, error.message);
    return [];
  }
}

/**
 * Collecte tous les articles de toutes les sources
 * @param {number} hoursBack - Nombre d'heures en arrière pour filtrer
 */
export async function collectAllArticles(hoursBack = 24) {
  console.log(`\n🔍 Collecte des articles des ${hoursBack} dernières heures...\n`);
  
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - hoursBack);
  
  const allArticles = [];
  
  for (const source of RSS_SOURCES) {
    const articles = await fetchSource(source);
    
    // Filtrer par date
    const recentArticles = articles.filter(a => a.pubDate >= cutoffDate);
    allArticles.push(...recentArticles);
    
    // Petit délai pour ne pas surcharger les serveurs
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Dédupliquer par URL
  const uniqueArticles = allArticles.reduce((acc, article) => {
    if (!acc.find(a => a.link === article.link)) {
      acc.push(article);
    }
    return acc;
  }, []);
  
  // Trier par date (plus récent en premier)
  uniqueArticles.sort((a, b) => b.pubDate - a.pubDate);
  
  console.log(`\n📊 Total: ${uniqueArticles.length} articles uniques collectés\n`);
  
  return uniqueArticles;
}

/**
 * Collecte incrémentale (depuis la dernière collecte)
 */
export async function collectNewArticles(lastCheckDate) {
  const articles = await collectAllArticles(2); // 2 heures de marge
  return articles.filter(a => a.pubDate > lastCheckDate);
}

export default {
  collectAllArticles,
  collectNewArticles
};
