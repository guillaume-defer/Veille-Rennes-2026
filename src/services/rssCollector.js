// Service de collecte des flux RSS - Version 4.0 avec fallback Nitter
import Parser from 'rss-parser';
import { RSS_SOURCES, RENNES_KEYWORDS, NITTER_INSTANCES, NITTER_BASE } from '../config/sources.js';

// User-Agents réalistes pour contourner les blocages
const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
];

// Sélectionne un User-Agent aléatoire
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Créer un parser avec des headers réalistes
function createParser() {
  return new Parser({
    timeout: 15000,
    headers: {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    customFields: {
      item: [
        ['media:content', 'media'],
        ['dc:creator', 'creator'],
        ['content:encoded', 'contentEncoded']
      ]
    }
  });
}

/**
 * Extrait le chemin RSS d'une URL Nitter pour essayer d'autres instances
 * Exemple: https://nitter.poast.org/username/rss -> /username/rss
 */
function extractNitterPath(url) {
  const match = url.match(/https?:\/\/[^/]+(\/.+)/);
  return match ? match[1] : null;
}

/**
 * Teste une URL RSS et retourne les articles si succès
 */
async function tryFetchRSS(url, parser) {
  const feed = await parser.parseURL(url);
  return feed;
}

/**
 * Collecte depuis une source Nitter avec fallback sur plusieurs instances
 */
async function fetchNitterWithFallback(source) {
  const parser = createParser();
  const path = extractNitterPath(source.url);
  
  if (!path) {
    console.log(`   ⚠️  ${source.name}: URL Nitter invalide`);
    return { feed: null, usedInstance: null };
  }
  
  for (const instance of NITTER_INSTANCES) {
    const testUrl = `https://${instance}${path}`;
    try {
      const feed = await tryFetchRSS(testUrl, parser);
      return { feed, usedInstance: instance };
    } catch (error) {
      // Continue vers l'instance suivante
      continue;
    }
  }
  
  return { feed: null, usedInstance: null };
}

/**
 * Vérifie si un article contient des mots-clés liés à Rennes
 */
function isAboutRennes(item, sourceFilter) {
  const content = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''} ${item.contentEncoded || ''}`.toLowerCase();
  
  // Si la source a un filtre spécifique, l'utiliser
  if (sourceFilter) {
    const filterRegex = new RegExp(sourceFilter, 'i');
    return filterRegex.test(content);
  }
  
  // Sinon, vérifier les mots-clés Rennes
  return RENNES_KEYWORDS.some(keyword => content.includes(keyword.toLowerCase()));
}

/**
 * Nettoie le contenu HTML
 */
function cleanContent(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Collecte les articles d'une source RSS
 */
async function fetchSource(source) {
  // Ignorer les sources désactivées
  if (source.enabled === false) {
    return [];
  }

  const parser = createParser();
  
  try {
    console.log(`📡 Récupération: ${source.name}`);
    
    let feed;
    let usedInstance = null;
    
    // Pour les sources Nitter (Twitter), utiliser le fallback multi-instances
    if (source.type === 'twitter' && source.url.includes('nitter')) {
      const result = await fetchNitterWithFallback(source);
      feed = result.feed;
      usedInstance = result.usedInstance;
      
      if (!feed) {
        console.log(`   ⚠️  ${source.name}: Toutes les instances Nitter ont échoué`);
        return [];
      }
      
      if (usedInstance && usedInstance !== 'nitter.poast.org') {
        console.log(`   ℹ️  Fallback utilisé: ${usedInstance}`);
      }
    } else {
      // Pour les autres sources, comportement standard
      feed = await parser.parseURL(source.url);
    }
    
    const articles = feed.items
      .filter(item => {
        // Filtrer si la source a un filtre
        if (source.filter) {
          return isAboutRennes(item, source.filter);
        }
        return true;
      })
      .map(item => ({
        title: cleanContent(item.title) || 'Sans titre',
        link: item.link || item.guid,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        content: cleanContent(item.contentSnippet || item.content || item.contentEncoded || '').substring(0, 2000),
        source: source.notionSource,
        sourceName: source.name,
        sourcePriority: source.priority,
        candidat: source.candidat || null
      }));
    
    console.log(`   ✅ ${articles.length} articles trouvés`);
    return articles;
    
  } catch (error) {
    // Afficher l'erreur de manière concise
    const errorMsg = error.message || 'Erreur inconnue';
    if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
      console.log(`   ⚠️  ${source.name}: Accès bloqué (403)`);
    } else if (errorMsg.includes('404')) {
      console.log(`   ⚠️  ${source.name}: Flux non trouvé (404)`);
    } else if (errorMsg.includes('timeout') || errorMsg.includes('ETIMEDOUT')) {
      console.log(`   ⚠️  ${source.name}: Timeout`);
    } else if (errorMsg.includes('Unable to parse XML')) {
      console.log(`   ⚠️  ${source.name}: Format XML invalide`);
    } else {
      console.log(`   ❌ ${source.name}: ${errorMsg.substring(0, 50)}`);
    }
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
  const sourceStats = { success: 0, failed: 0, blocked: 0 };
  
  for (const source of RSS_SOURCES) {
    const articles = await fetchSource(source);
    
    if (articles.length > 0) {
      sourceStats.success++;
      // Filtrer par date
      const recentArticles = articles.filter(a => a.pubDate >= cutoffDate);
      allArticles.push(...recentArticles);
    } else {
      sourceStats.failed++;
    }
    
    // Délai aléatoire entre 500ms et 1500ms pour paraître plus humain
    const delay = 500 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // Dédupliquer par URL
  const seenUrls = new Set();
  const uniqueArticles = allArticles.filter(article => {
    // Normaliser l'URL pour éviter les doublons avec des paramètres différents
    const normalizedUrl = article.link?.split('?')[0];
    if (seenUrls.has(normalizedUrl)) {
      return false;
    }
    seenUrls.add(normalizedUrl);
    return true;
  });
  
  // Trier par date (plus récent en premier)
  uniqueArticles.sort((a, b) => b.pubDate - a.pubDate);
  
  console.log(`\n📊 Résultat collecte:`);
  console.log(`   • Sources OK: ${sourceStats.success}/${RSS_SOURCES.length}`);
  console.log(`   • Articles uniques: ${uniqueArticles.length}`);
  console.log('');
  
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
