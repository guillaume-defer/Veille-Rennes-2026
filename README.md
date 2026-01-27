# 🌊 Veille Rennes 2026

Système de veille automatisée sur l'actualité rennaise pour les élections municipales 2026.

## 🎯 Fonctionnalités

- **Collecte automatique** des flux RSS (presse locale et nationale)
- **Analyse IA** (Claude) pour catégoriser les articles par compétence municipale
- **Notifications Telegram** en temps réel pour les actualités importantes
- **Archivage Notion** avec base de données structurée
- **Récaps email** quotidiens et hebdomadaires
- **Scoring intelligent** basé sur les candidats et thèmes

## 📊 Sources surveillées

### Presse Quotidienne Régionale
- Ouest-France Rennes
- Le Télégramme
- France Bleu Armorique
- 20 Minutes Rennes
- Unidivers

### Presse Nationale (filtrée sur Rennes)
- Le Monde
- Le Figaro
- Libération

## 👥 Candidats suivis

| Candidat | Parti | Liste |
|----------|-------|-------|
| **Charles Compagnon** ⭐ | Horizons | Vivre Rennes ! |
| Carole Gandon | Renaissance | Vivre Rennes ! |
| Nathalie Appéré | PS | Rennes Solidaire |
| Thomas Rousseau | LR | L'Espoir rennais |
| Julien Masson | RN | Rassemblement pour Rennes |
| Marie Mesmeur | LFI | - |
| Ulysse Rabaté | ex-LFI | Rennes-Commune |

## 🏛️ Catégories (Compétences DGCL)

- 🚔 Sécurité
- 🏥 Action sociale & Santé
- 👶 Petite enfance & Jeunesse
- 🏫 Enseignement
- ⚽ Sports
- 🎭 Culture
- 🏗️ Urbanisme & Aménagement
- 🏠 Logement & Habitat
- 🚇 Transports & Mobilités
- 🌳 Environnement
- 🗑️ Déchets & Propreté
- 💧 Eau & Assainissement
- 💼 Économie locale
- 🏖️ Tourisme
- 💻 Numérique
- 💰 Finances locales
- 🗳️ Élections / Campagne

## 🚀 Déploiement

### Prérequis

1. Compte [Railway](https://railway.app) (gratuit)
2. Token Telegram Bot (via @BotFather)
3. Clé API Notion
4. (Optionnel) Clé API Anthropic pour l'analyse IA
5. (Optionnel) Clé API Resend pour les emails

### Variables d'environnement

```env
# Obligatoires
TELEGRAM_BOT_TOKEN=votre_token
TELEGRAM_CHANNEL_ID=-1003854159702
NOTION_API_KEY=votre_cle_notion
NOTION_DATABASE_ID=8158a977-4b04-4b3d-8911-8a075e85f314

# Optionnels mais recommandés
ANTHROPIC_API_KEY=votre_cle_anthropic
RESEND_API_KEY=votre_cle_resend
EMAIL_RECIPIENT=votre@email.com

# Serveur
PORT=3000
NODE_ENV=production
```

### Déployer sur Railway

1. Forkez ce repo ou uploadez les fichiers
2. Créez un nouveau projet sur Railway
3. Connectez votre repo GitHub
4. Ajoutez les variables d'environnement
5. Déployez !

### Déployer localement

```bash
# Cloner le projet
git clone <repo>
cd veille-rennes-2026

# Installer les dépendances
npm install

# Copier et configurer les variables
cp .env.example .env
# Éditer .env avec vos clés

# Lancer
npm start
```

## 📡 API

### Endpoints

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/` | Health check |
| POST | `/run` | Forcer un cycle de veille |
| POST | `/recap` | Forcer l'envoi du récap |
| GET | `/stats` | Statistiques des 7 derniers jours |

### Exemple

```bash
# Forcer un cycle (dernières 12 heures)
curl -X POST http://localhost:3000/run -H "Content-Type: application/json" -d '{"hours": 12}'

# Voir les stats
curl http://localhost:3000/stats
```

## ⏰ Tâches planifiées

| Tâche | Fréquence | Description |
|-------|-----------|-------------|
| Veille | Toutes les 2h | Collecte et analyse des articles |
| Récap quotidien | 7h | Synthèse des dernières 24h |
| Récap hebdo | Lundi 8h | Synthèse de la semaine |

## 📊 Scoring des alertes

Un article génère une alerte (notification Telegram) si son score ≥ 8.

| Critère | Points |
|---------|--------|
| Mention Charles Compagnon | +5 |
| Mention autre candidat | +3 |
| Thème Sécurité | +2 |
| Sondage | +4 |
| Polémique | +3 |
| Meeting/Programme | +3 |
| Pertinence élections | +3 |

## 📂 Structure du projet

```
veille-rennes-2026/
├── src/
│   ├── index.js              # Serveur principal
│   ├── config/
│   │   └── sources.js        # Configuration sources et candidats
│   └── services/
│       ├── rssCollector.js   # Collecte RSS
│       ├── aiAnalyzer.js     # Analyse IA (Claude)
│       ├── notionService.js  # Intégration Notion
│       ├── telegramService.js # Notifications Telegram
│       └── emailService.js   # Récaps email
├── .env.example
├── package.json
└── README.md
```

## 📝 Notion Database

Base de données : [Veille Rennes 2026](https://www.notion.so/e0f35e1237844ace8745bd362e5dbaa3)

### Propriétés

- **Titre** : Titre de l'article
- **Date** : Date de publication
- **Source** : Média source
- **Candidat** : Candidats mentionnés (multi-select)
- **Compétence municipale** : Thème DGCL
- **Type** : Type de contenu
- **Score importance** : Score calculé
- **URL** : Lien vers l'article
- **Résumé** : Résumé IA
- **Alerte envoyée** : Checkbox

## 📜 Licence

MIT

## 👤 Auteur

Développé pour Guillaume Defer - Veille élections municipales Rennes 2026
