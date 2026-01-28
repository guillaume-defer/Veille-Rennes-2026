# Changelog Version 4.0 - 28 janvier 2026

## Problème diagnostiqué
- Déploiement v3: 94% d'échec (45/48 sources)
- nitter.net: 403 Forbidden
- Presse régionale: URLs incorrectes/obsolètes

## Corrections apportées

### sources.js
1. **Instances Nitter** - Nouveau système de fallback:
   - nitter.poast.org (principal - vérifié fonctionnel)
   - xcancel.com (backup)
   - nitter.privacyredirect.com (backup)
   - nitter.net (backup)

2. **URLs presse française corrigées**:
   - Ouest-France: `/rss/une` et `/rss-en-continu.xml`
   - Le Télégramme: `/rss.xml`
   - France Bleu: `/rss/armorique.xml`
   - Le Monde: `/rss/une.xml`
   - Libération: `/arc/outboundfeeds/rss-all/category/politique/`
   - Mediapart: `/articles/feed`
   - Franceinfo: `/titres.rss` et `/politique.rss`

3. **Sources retirées** (définitivement cassées):
   - Google News RSS (403 permanent)
   - 20 Minutes Rennes (pas de RSS)
   - Actu.fr (structure changée)

4. **Nouvelles sources ajoutées**:
   - France 24 FR
   - BFM TV News  
   - Le Parisien

### rssCollector.js
- Système de fallback multi-instances Nitter
- Si une instance échoue, essaie les suivantes
- Meilleure gestion des erreurs XML

## Statistiques
- Sources v3: 48
- Sources v4: 39 (optimisées, sans doublons)
- Instances Nitter: 4 avec fallback automatique

## Déploiement
```bash
git add .
git commit -m "v4.0 - URLs RSS corrigées + fallback Nitter multi-instances"
git push origin main
# Railway redéploie automatiquement
```
