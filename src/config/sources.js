// Configuration des sources de veille et des entités à suivre
// Version 4.0 - URLs corrigées et instances Nitter fonctionnelles
// Dernière mise à jour: 28 janvier 2026

// Configuration Nitter - instances avec fallback
export const NITTER_INSTANCES = [
  'nitter.poast.org',      // Instance principale fonctionnelle
  'xcancel.com',           // Alternative 1
  'nitter.privacyredirect.com', // Alternative 2
  'nitter.net'             // Instance officielle (backup)
];

// Instance Nitter par défaut
export const NITTER_BASE = 'https://nitter.poast.org';

export const RSS_SOURCES = [
  // ============================================
  // PRESSE QUOTIDIENNE RÉGIONALE - PRIORITÉ 1
  // ============================================
  // URLs corrigées basées sur recherche janvier 2026
  {
    name: 'Ouest-France Une',
    url: 'https://www.ouest-france.fr/rss/une',
    notionSource: 'Ouest-France',
    priority: 1,
    filter: 'rennes|rennais|ille-et-vilaine|bretagne'
  },
  {
    name: 'Ouest-France Régions',
    url: 'https://www.ouest-france.fr/rss-en-continu.xml',
    notionSource: 'Ouest-France',
    priority: 1,
    filter: 'rennes|rennais|ille-et-vilaine'
  },
  {
    name: 'Le Télégramme Bretagne',
    url: 'https://www.letelegramme.fr/rss.xml',
    notionSource: 'Le Télégramme',
    priority: 1,
    filter: 'rennes|rennais|ille-et-vilaine'
  },
  {
    name: 'France Bleu Armorique',
    url: 'https://www.francebleu.fr/rss/armorique.xml',
    notionSource: 'France Bleu',
    priority: 1,
    filter: 'rennes'
  },

  // ============================================
  // MÉDIAS LOCAUX ET RÉGIONAUX - PRIORITÉ 2
  // ============================================
  {
    name: 'Unidivers Rennes',
    url: 'https://www.unidivers.fr/feed/',
    notionSource: 'Unidivers',
    priority: 2,
    filter: 'rennes'
  },
  {
    name: 'France 3 Bretagne',
    url: 'https://france3-regions.francetvinfo.fr/bretagne/rss.xml',
    notionSource: 'Autre',
    priority: 2,
    filter: 'rennes|rennais|ille-et-vilaine'
  },

  // ============================================
  // PRESSE NATIONALE (filtrée) - PRIORITÉ 3
  // URLs vérifiées janvier 2026
  // ============================================
  {
    name: 'Le Monde Une',
    url: 'https://www.lemonde.fr/rss/une.xml',
    notionSource: 'Le Monde',
    priority: 3,
    filter: 'rennes|bretagne|ille-et-vilaine|appéré|compagnon|municipales'
  },
  {
    name: 'Le Figaro Actualités',
    url: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
    notionSource: 'Le Figaro',
    priority: 3,
    filter: 'rennes|bretagne|appéré|compagnon'
  },
  {
    name: 'Libération Politique',
    url: 'https://www.liberation.fr/arc/outboundfeeds/rss-all/category/politique/?outputType=xml',
    notionSource: 'Libération',
    priority: 3,
    filter: 'rennes|bretagne|municipales'
  },
  {
    name: 'Mediapart',
    url: 'https://www.mediapart.fr/articles/feed',
    notionSource: 'Autre',
    priority: 3,
    filter: 'rennes|bretagne|ille-et-vilaine'
  },
  {
    name: 'Franceinfo Titres',
    url: 'https://www.francetvinfo.fr/titres.rss',
    notionSource: 'Autre',
    priority: 3,
    filter: 'rennes|bretagne|municipales'
  },
  {
    name: 'Franceinfo Politique',
    url: 'https://www.francetvinfo.fr/politique.rss',
    notionSource: 'Autre',
    priority: 3,
    filter: 'rennes|bretagne|municipales'
  },
  {
    name: 'France 24 FR',
    url: 'https://www.france24.com/fr/rss',
    notionSource: 'Autre',
    priority: 3,
    filter: 'rennes|bretagne|municipales'
  },
  {
    name: 'BFM TV News',
    url: 'https://www.bfmtv.com/rss/news-24-7/',
    notionSource: 'Autre',
    priority: 3,
    filter: 'rennes|bretagne|municipales'
  },
  {
    name: 'Le Parisien',
    url: 'https://feeds.leparisien.fr/leparisien/rss',
    notionSource: 'Autre',
    priority: 3,
    filter: 'rennes|bretagne|municipales'
  },

  // ============================================
  // SOURCES INSTITUTIONNELLES - PRIORITÉ 2
  // ============================================
  {
    name: 'DGCL Collectivités Locales',
    url: 'https://www.collectivites-locales.gouv.fr/rss.xml',
    notionSource: 'DGCL',
    priority: 2,
    filter: 'commune|municipal|maire|élu|collectivité'
  },

  // ============================================
  // TWITTER/X VIA NITTER - CANDIDATS
  // ============================================
  // Instances fonctionnelles: nitter.poast.org, xcancel.com
  // Format RSS: https://{instance}/{username}/rss
  {
    name: 'Twitter Charles Compagnon',
    url: 'https://nitter.poast.org/Ch_Compagnon/rss',
    notionSource: 'Twitter',
    priority: 1,
    type: 'twitter',
    candidat: 'Charles Compagnon'
  },
  {
    name: 'Twitter Vivre Rennes !',
    url: 'https://nitter.poast.org/Vivre_Rennes/rss',
    notionSource: 'Twitter',
    priority: 1,
    type: 'twitter',
    candidat: 'Charles Compagnon'
  },
  {
    name: 'Twitter Nathalie Appéré',
    url: 'https://nitter.poast.org/nathalieappere/rss',
    notionSource: 'Twitter',
    priority: 1,
    type: 'twitter',
    candidat: 'Nathalie Appéré'
  },
  {
    name: 'Twitter Marie Mesmeur',
    url: 'https://nitter.poast.org/MarieMesmeur/rss',
    notionSource: 'Twitter',
    priority: 1,
    type: 'twitter',
    candidat: 'Marie Mesmeur'
  },
  {
    name: 'Twitter LFI Rennes',
    url: 'https://nitter.poast.org/LFIRENNES/rss',
    notionSource: 'Twitter',
    priority: 2,
    type: 'twitter',
    candidat: 'Marie Mesmeur'
  },
  {
    name: 'Twitter Thomas Rousseau',
    url: 'https://nitter.poast.org/ThomasR2020/rss',
    notionSource: 'Twitter',
    priority: 1,
    type: 'twitter',
    candidat: 'Thomas Rousseau'
  },
  {
    name: 'Twitter Rennes à Droite',
    url: 'https://nitter.poast.org/rennesadroite/rss',
    notionSource: 'Twitter',
    priority: 2,
    type: 'twitter',
    candidat: 'Thomas Rousseau'
  },
  {
    name: 'Twitter L\'Espoir Rennais',
    url: 'https://nitter.poast.org/EspoirRennais/rss',
    notionSource: 'Twitter',
    priority: 2,
    type: 'twitter',
    candidat: 'Thomas Rousseau'
  },
  {
    name: 'Twitter Julien Masson',
    url: 'https://nitter.poast.org/JulienMasson35/rss',
    notionSource: 'Twitter',
    priority: 1,
    type: 'twitter',
    candidat: 'Julien Masson'
  },
  {
    name: 'Twitter RN Bretagne',
    url: 'https://nitter.poast.org/RNBretagne/rss',
    notionSource: 'Twitter',
    priority: 2,
    type: 'twitter',
    candidat: 'Julien Masson'
  },
  {
    name: 'Twitter Carole Gandon',
    url: 'https://nitter.poast.org/GandonCarole/rss',
    notionSource: 'Twitter',
    priority: 2,
    type: 'twitter',
    candidat: 'Carole Gandon',
    note: 'Compte marqué inactif mais à surveiller'
  },
  {
    name: 'Twitter Révéler Rennes',
    url: 'https://nitter.poast.org/RevelerRennes/rss',
    notionSource: 'Twitter',
    priority: 2,
    type: 'twitter',
    candidat: 'Carole Gandon'
  },
  {
    name: 'Twitter Ulysse Rabaté',
    url: 'https://nitter.poast.org/UlysseRabate/rss',
    notionSource: 'Twitter',
    priority: 1,
    type: 'twitter',
    candidat: 'Ulysse Rabaté'
  },
  {
    name: 'Twitter Erell Duclos',
    url: 'https://nitter.poast.org/Erellux_/rss',
    notionSource: 'Twitter',
    priority: 1,
    type: 'twitter',
    candidat: 'Erell Duclos'
  },

  // ============================================
  // TWITTER/X VIA NITTER - ACTUALITÉ RENNAISE
  // Note: Les recherches Nitter peuvent être instables
  // ============================================
  {
    name: 'Twitter Recherche Rennes',
    url: 'https://nitter.poast.org/search/rss?f=tweets&q=rennes',
    notionSource: 'Twitter',
    priority: 2,
    type: 'twitter',
    filter: 'municipales|mairie|métropole|compagnon|appéré|mesmeur|rousseau|masson'
  },
  {
    name: 'Twitter Recherche Municipales Rennes',
    url: 'https://nitter.poast.org/search/rss?f=tweets&q=municipales+rennes+2026',
    notionSource: 'Twitter',
    priority: 1,
    type: 'twitter'
  },

  // ============================================
  // BLUESKY - CANDIDATS ET ACTUALITÉ RENNAISE
  // ============================================
  // Note: Bluesky propose des flux RSS via services tiers
  {
    name: 'Bluesky Marie Mesmeur',
    url: 'https://bsky.app/profile/mariemesmeur.bsky.social/rss',
    notionSource: 'Bluesky',
    priority: 1,
    type: 'bluesky',
    candidat: 'Marie Mesmeur',
    note: 'Seule candidate identifiée sur Bluesky'
  },
  {
    name: 'Bluesky Rennes Agenda',
    url: 'https://bsky.app/profile/rennes.bsky.social/rss',
    notionSource: 'Bluesky',
    priority: 2,
    type: 'bluesky',
    note: 'Agenda culturel rennais'
  },
  {
    name: 'Bluesky Université Rennes',
    url: 'https://bsky.app/profile/rennesuniv.bsky.social/rss',
    notionSource: 'Bluesky',
    priority: 3,
    type: 'bluesky',
    filter: 'rennes|politique|étudiant'
  },

  // ============================================
  // LINKEDIN - COLLECTIVITÉS & LOIS COMMUNALES
  // ============================================
  // Note: LinkedIn n'a pas de RSS direct, on utilise les RSS des sites web associés
  {
    name: 'La Gazette des communes',
    url: 'https://www.lagazettedescommunes.com/rubriques/a-la-une/feed/',
    notionSource: 'La Gazette',
    priority: 2,
    type: 'linkedin-source',
    note: '124,335 abonnés LinkedIn - Référence collectivités territoriales',
    filter: 'rennes|bretagne|municipales|maire|commune'
  },
  {
    name: 'Maire-info (AMF)',
    url: 'https://www.maire-info.com/rss.xml',
    notionSource: 'AMF',
    priority: 2,
    type: 'linkedin-source',
    note: '30,856 abonnés LinkedIn AMF - Actualité des maires',
    filter: 'rennes|bretagne|municipales|élection'
  },
  {
    name: 'Collectivités locales (DGCL)',
    url: 'https://www.collectivites-locales.gouv.fr/rss.xml',
    notionSource: 'DGCL',
    priority: 2,
    type: 'linkedin-source',
    note: '36,346 abonnés LinkedIn DGCL - Législation collectivités'
  },
  {
    name: 'Localtis Banque des Territoires',
    url: 'https://www.banquedesterritoires.fr/rss/localtis.xml',
    notionSource: 'Autre',
    priority: 2,
    type: 'linkedin-source',
    note: 'Actualité juridique et financière collectivités',
    filter: 'rennes|bretagne|commune|municipales'
  }
];

// Candidats aux municipales 2026 à Rennes
export const CANDIDATS = [
  {
    name: 'Charles Compagnon',
    notionValue: 'Charles Compagnon',
    parti: 'Horizons',
    liste: 'Vivre Rennes !',
    priority: 5,
    keywords: ['compagnon', 'charles compagnon', 'vivre rennes'],
    twitter: '@Ch_Compagnon',
    twitterListe: '@Vivre_Rennes',
    bluesky: null,
    facebook: 'CharlesCompagnonRennes',
    linkedin: null,
    color: 'blue',
    note: 'Candidature officielle 14 novembre 2025 - Alliance avec Carole Gandon (Renaissance)'
  },
  {
    name: 'Carole Gandon',
    notionValue: 'Carole Gandon',
    parti: 'Renaissance',
    liste: 'Vivre Rennes !',
    priority: 3,
    keywords: ['gandon', 'carole gandon', 'révéler rennes'],
    twitter: '@GandonCarole',
    twitterListe: '@RevelerRennes',
    bluesky: null,
    facebook: null,
    linkedin: null,
    color: 'purple',
    note: 'Compte Twitter marqué INACTIF - Liste commune avec Compagnon dès 1er tour'
  },
  {
    name: 'Nathalie Appéré',
    notionValue: 'Nathalie Appéré',
    parti: 'PS',
    liste: 'Rennes Solidaire',
    priority: 3,
    keywords: ['appéré', 'appere', 'nathalie appéré', 'maire de rennes', 'rennes solidaire'],
    twitter: '@nathalieappere',
    twitterListe: null,
    bluesky: null,
    facebook: 'NathalieAppere',
    linkedin: null,
    color: 'pink',
    note: 'Maire sortante depuis 2014 - Candidature 3ème mandat confirmée janvier 2026'
  },
  {
    name: 'Marie Mesmeur',
    notionValue: 'Marie Mesmeur',
    parti: 'LFI',
    liste: 'Faire Mieux pour Rennes',
    priority: 2,
    keywords: ['marie mesmeur', 'mesmeur', 'lfi rennes', 'faire mieux pour rennes'],
    twitter: '@MarieMesmeur',
    twitterListe: '@LFIRENNES',
    bluesky: '@mariemesmeur.bsky.social',
    facebook: null,
    linkedin: null,
    color: 'red',
    note: 'Députée LFI-NFP - 14,200 abonnés Twitter - Candidature 21 novembre 2025'
  },
  {
    name: 'Thomas Rousseau',
    notionValue: 'Thomas Rousseau',
    parti: 'LR',
    liste: "L'Espoir Rennais",
    priority: 2,
    keywords: ['thomas rousseau', 'espoir rennais', 'rennes à droite'],
    twitter: '@ThomasR2020',
    twitterListe: '@EspoirRennais',
    twitterMouvement: '@rennesadroite',
    bluesky: null,
    facebook: null,
    linkedin: null,
    color: 'green',
    note: 'Investiture LR août 2025 - Refuse alliance avec Compagnon/Gandon'
  },
  {
    name: 'Julien Masson',
    notionValue: 'Julien Masson',
    parti: 'RN',
    liste: 'Rassemblement pour Rennes',
    priority: 2,
    keywords: ['julien masson', 'masson rn', 'rassemblement pour rennes'],
    twitter: '@JulienMasson35',
    twitterListe: '@RNBretagne',
    bluesky: null,
    facebook: 'RassemblementPourRennes',
    linkedin: null,
    color: 'brown',
    note: 'Porte-parole RN Rennes - N°2 liste: Luca Togni'
  },
  {
    name: 'Ulysse Rabaté',
    notionValue: 'Ulysse Rabaté',
    parti: 'ex-LFI',
    liste: 'Rennes Commune',
    priority: 1,
    keywords: ['ulysse rabaté', 'rabate', 'rennes commune'],
    twitter: '@UlysseRabate',
    twitterListe: null,
    bluesky: null,
    facebook: null,
    linkedin: null,
    color: 'orange',
    note: 'Dissident LFI - Suspendu par le parti - Candidature 31 octobre 2025'
  },
  {
    name: 'Erell Duclos',
    notionValue: 'Erell Duclos',
    parti: 'Révolution Permanente',
    liste: null,
    priority: 1,
    keywords: ['erell duclos', 'duclos', 'révolution permanente'],
    twitter: '@Erellux_',
    twitterListe: null,
    bluesky: null,
    facebook: null,
    linkedin: null,
    color: 'darkred',
    note: 'Étudiante sociologie Rennes 2 - Candidature 10 novembre 2025 - Trotskiste'
  }
];

// Compétences municipales DGCL
export const COMPETENCES_MUNICIPALES = [
  {
    name: '🚔 Sécurité',
    keywords: ['sécurité', 'police municipale', 'vidéosurveillance', 'vidéoprotection', 'délinquance', 'insécurité', 'violence', 'agression', 'cambriolage', 'drogue', 'trafic', 'fusillade', 'viol', 'agression sexuelle', 'vol', 'criminalité']
  },
  {
    name: '🏥 Action sociale & Santé',
    keywords: ['ccas', 'aide sociale', 'santé', 'hôpital', 'chu', 'médecin', 'désert médical', 'solidarité', 'précarité', 'sans-abri', 'sdf', 'urgences', 'clinique']
  },
  {
    name: '👶 Petite enfance & Jeunesse',
    keywords: ['crèche', 'petite enfance', 'jeunesse', 'jeunes', 'périscolaire', 'garderie', 'halte-garderie', 'maison de quartier']
  },
  {
    name: '🏫 Enseignement',
    keywords: ['école', 'maternelle', 'élémentaire', 'primaire', 'cantine', 'scolaire', 'rentrée', 'éducation', 'rythmes scolaires', 'université', 'étudiant', 'rennes 1', 'rennes 2']
  },
  {
    name: '⚽ Sports',
    keywords: ['sport', 'stade', 'piscine', 'gymnase', 'équipement sportif', 'subvention club', 'stade rennais', 'srfc', 'roazhon park', 'cesson-sévigné basket']
  },
  {
    name: '🎭 Culture',
    keywords: ['culture', 'bibliothèque', 'médiathèque', 'musée', 'théâtre', 'opéra', 'festival', 'concert', 'spectacle', 'patrimoine', 'transmusicales', 'tnb', 'champs libres', 'mythos']
  },
  {
    name: '🏗️ Urbanisme & Aménagement',
    keywords: ['urbanisme', 'plu', 'permis de construire', 'zac', 'aménagement', 'construction', 'bétonisation', 'densification', 'quartier', 'eurorennes', 'courrouze', 'baud-chardonnet']
  },
  {
    name: '🏠 Logement & Habitat',
    keywords: ['logement', 'hlm', 'logement social', 'habitat', 'loyer', 'immobilier', 'rénovation', 'copropriété', 'archipel habitat', 'aiguillon']
  },
  {
    name: '🚇 Transports & Mobilités',
    keywords: ['transport', 'métro', 'bus', 'star', 'vélo', 'mobilité', 'circulation', 'stationnement', 'parking', 'piste cyclable', 'ligne b', 'keolis', 'rocade', 'embouteillage']
  },
  {
    name: '🌳 Environnement',
    keywords: ['environnement', 'écologie', 'biodiversité', 'espace vert', 'parc', 'arbre', 'nature', 'pollution', 'qualité air', 'climat', 'thabor', 'gayeulles', 'vilaine']
  },
  {
    name: '🗑️ Déchets & Propreté',
    keywords: ['déchet', 'poubelle', 'tri', 'propreté', 'ordures', 'collecte', 'déchetterie', 'saleté', 'tags', 'graffiti', 'incivisme']
  },
  {
    name: '💧 Eau & Assainissement',
    keywords: ['eau', 'assainissement', 'eau potable', 'égout', 'station épuration', 'inondation', 'crue', 'vilaine', 'ille']
  },
  {
    name: '💼 Économie locale',
    keywords: ['économie', 'commerce', 'emploi', 'entreprise', 'zone activité', 'chômage', 'attractivité', 'investissement', 'startup', 'french tech', 'digital park']
  },
  {
    name: '🏖️ Tourisme',
    keywords: ['tourisme', 'office tourisme', 'visiteur', 'attractivité touristique', 'hôtel', 'airbnb']
  },
  {
    name: '💻 Numérique',
    keywords: ['numérique', 'fibre', 'digital', 'smart city', 'wifi', 'open data', 'cybersécurité', 'ia']
  },
  {
    name: '💰 Finances locales',
    keywords: ['budget', 'impôt', 'taxe', 'fiscalité', 'dette', 'finances', 'subvention', 'dépense', 'investissement public', 'taxe foncière', 'taxe habitation']
  },
  {
    name: '🗳️ Élections / Campagne',
    keywords: ['élection', 'municipale', 'campagne', 'candidat', 'programme', 'sondage', 'meeting', 'liste', 'vote', 'scrutin', '2026', 'premier tour', 'second tour', 'investiture', 'colistier']
  }
];

// Mots-clés généraux pour filtrer sur Rennes
export const RENNES_KEYWORDS = [
  'rennes',
  'rennais',
  'rennaise',
  'métropole rennaise',
  'rennes métropole',
  'ille-et-vilaine',
  '35000',
  '35200',
  '35700',
  // Quartiers
  'villejean',
  'blosne',
  'maurepas',
  'cleunay',
  'poterie',
  'saint-jacques',
  'thabor',
  'centre-ville rennes',
  'beaulieu',
  'longs champs',
  'bréquigny',
  'francisco ferrer',
  'landry',
  'patton',
  // Lieux emblématiques
  'place de la mairie',
  'esplanade charles de gaulle',
  'place sainte-anne',
  'place des lices',
  'colombier',
  'république rennes',
  'gare de rennes',
  'roazhon park',
  // Communes métropole
  'cesson-sévigné',
  'saint-grégoire',
  'pacé',
  'bruz',
  'chantepie',
  'betton',
  'vezin-le-coquet',
  'saint-jacques-de-la-lande'
];

// Critères de scoring pour les alertes
export const SCORING_RULES = {
  candidatPrioritaire: 5,
  autreCandidat: 3,
  motsClesElections: 3,
  sourceInstitutionnelle: 2,
  themeSécurité: 2,
  sondage: 4,
  polemique: 3,
  annonceEvenement: 3,
  articleLong: 1,
  repriseMultiSources: 4
};

// Seuil pour notification temps réel
export const ALERT_THRESHOLD = 8;

// Configuration des récaps
export const RECAP_CONFIG = {
  daily: {
    cron: '0 7 * * *',
    subject: '📰 Veille Rennes - Récap quotidien'
  },
  weekly: {
    cron: '0 8 * * 1',
    subject: '📊 Veille Rennes - Synthèse hebdomadaire'
  }
};
