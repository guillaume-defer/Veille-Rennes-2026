// Script de test pour vérifier la collecte RSS
import { collectAllArticles } from './services/rssCollector.js';
import { analyzeArticles } from './services/aiAnalyzer.js';

async function test() {
  console.log('🧪 Test de la veille Rennes 2026\n');
  
  // Test collecte RSS
  console.log('1️⃣ Test collecte RSS (6 dernières heures)...\n');
  const articles = await collectAllArticles(6);
  
  if (articles.length === 0) {
    console.log('⚠️  Aucun article trouvé. Les flux RSS sont peut-être indisponibles.');
    return;
  }
  
  console.log('\n📰 Exemples d\'articles collectés:\n');
  articles.slice(0, 5).forEach((a, i) => {
    console.log(`${i + 1}. [${a.source}] ${a.title}`);
    console.log(`   📅 ${a.pubDate.toLocaleString('fr-FR')}`);
    console.log(`   🔗 ${a.link}\n`);
  });
  
  // Test analyse (fallback sans IA)
  console.log('\n2️⃣ Test analyse (mode fallback sans IA)...\n');
  const analyzed = await analyzeArticles(articles.slice(0, 3), false);
  
  analyzed.forEach((a, i) => {
    console.log(`${i + 1}. ${a.title.substring(0, 50)}...`);
    console.log(`   📊 Score: ${a.analysis.score_importance}`);
    console.log(`   🏛️ Compétence: ${a.analysis.competence}`);
    console.log(`   👤 Candidats: ${a.analysis.candidats.join(', ') || 'Aucun'}`);
    console.log(`   🚨 Alerte: ${a.analysis.isAlert ? 'OUI' : 'Non'}\n`);
  });
  
  console.log('✅ Tests terminés');
}

test().catch(console.error);
