// Configuration des sources de veille et des entités à suivre

export const RSS_SOURCES = [
  // Presse Quotidienne Régionale
  {
    name: 'Ouest-France Rennes',
    url: 'https://www.ouest-france.fr/rss/france/bretagne/ille-et-vilaine/rennes',
    notionSource: 'Ouest-France',
    priority: 1
  },
  {
    name: 'France Bleu Armorique',
    url: 'https://www.francebleu.fr/rss/armorique/infos.xml',
    notionSource: 'France Bleu',
    priority: 1
  },
  {
    name: '20 Minutes Rennes',
    url: 'https://www.20minutes.fr/rss/rennes.xml',
    notionSource: '20 Minutes',
    priority: 2
  },
  // Médias locaux
  {
    name: 'Unidivers',
    url: 'https://www.unidivers.fr/feed/',
    notionSource: 'Unidivers',
    priority: 2,
    filter: 'rennes'
  },
  // Presse nationale (filtrage sur Rennes/Bretagne)
  {
    name: 'Le Monde Politique',
    url: 'https://www.lemonde.fr/politique/rss_full.xml',
    notionSource: 'Le Monde',
    priority: 3,
    filter: 'rennes|bretagne|ille-et-vilaine'
  },
  {
    name: 'Le Figaro Politique',
    url: 'https://www.lefigaro.fr/rss/figaro_politique.xml',
    notionSource: 'Le Figaro',
    priority: 3,
    filter: 'rennes|bretagne'
  },
  {
    name: 'Libération France',
    url: 'https://www.liberation.fr/arc/outboundfeeds/rss-all/collection/accueil-une/',
    notionSource: 'Libération',
    priority: 3,
    filter: 'rennes|bretagne'
  }
];

// Candidats aux municipales 2026 à Rennes
export const CANDIDATS = [
  {
    name: 'Charles Compagnon',
    notionValue: 'Charles Compagnon',
    parti: 'Horizons',
    liste: 'Vivre Rennes !',
    priority: 5, // Score bonus
    keywords: ['compagnon', 'charles compagnon', 'vivre rennes'],
    twitter: '@CharlesCompagnon',
    color: 'blue'
  },
  {
    name: 'Carole Gandon',
    notionValue: 'Carole Gandon',
    parti: 'Renaissance',
    liste: 'Vivre Rennes !',
    priority: 3,
    keywords: ['gandon', 'carole gandon'],
    twitter: '@CGandon35',
    color: 'purple'
  },
  {
    name: 'Nathalie Appéré',
    notionValue: 'Nathalie Appéré',
    parti: 'PS',
    liste: 'Rennes Solidaire',
    priority: 3,
    keywords: ['appéré', 'appere', 'nathalie appéré', 'maire de rennes', 'rennes solidaire'],
    twitter: '@NathalieAppere',
    color: 'pink'
  },
  {
    name: 'Thomas Rousseau',
    notionValue: 'Thomas Rousseau',
    parti: 'LR',
    liste: "L'Espoir rennais",
    priority: 2,
    keywords: ['thomas rousseau', 'espoir rennais'],
    twitter: '@ThRousseau35',
    color: 'green'
  },
  {
    name: 'Julien Masson',
    notionValue: 'Julien Masson',
    parti: 'RN',
    liste: 'Rassemblement pour Rennes',
    priority: 2,
    keywords: ['julien masson', 'masson rn', 'rassemblement pour rennes'],
    twitter: '@JMasson35',
    color: 'brown'
  },
  {
    name: 'Marie Mesmeur',
    notionValue: 'Marie Mesmeur',
    parti: 'LFI',
    liste: null,
    priority: 2,
    keywords: ['marie mesmeur', 'mesmeur', 'lfi rennes'],
    twitter: '@MarieMesmeur',
    color: 'red'
  },
  {
    name: 'Ulysse Rabaté',
    notionValue: 'Ulysse Rabaté',
    parti: 'ex-LFI',
    liste: 'Rennes-Commune',
    priority: 1,
    keywords: ['ulysse rabaté', 'rabate', 'rennes commune'],
    twitter: null,
    color: 'orange'
  }
];

// Compétences municipales DGCL
export const COMPETENCES_MUNICIPALES = [
  {
    name: '🚔 Sécurité',
    keywords: ['sécurité', 'police municipale', 'vidéosurveillance', 'vidéoprotection', 'délinquance', 'insécurité', 'violence', 'agression', 'cambriolage', 'drogue', 'trafic', 'fusillade']
  },
  {
    name: '🏥 Action sociale & Santé',
    keywords: ['ccas', 'aide sociale', 'santé', 'hôpital', 'chu', 'médecin', 'désert médical', 'solidarité', 'précarité', 'sans-abri', 'sdf']
  },
  {
    name: '👶 Petite enfance & Jeunesse',
    keywords: ['crèche', 'petite enfance', 'jeunesse', 'jeunes', 'périscolaire', 'garderie', 'halte-garderie']
  },
  {
    name: '🏫 Enseignement',
    keywords: ['école', 'maternelle', 'élémentaire', 'primaire', 'cantine', 'scolaire', 'rentrée', 'éducation', 'rythmes scolaires']
  },
  {
    name: '⚽ Sports',
    keywords: ['sport', 'stade', 'piscine', 'gymnase', 'équipement sportif', 'subvention club', 'stade rennais', 'srfc']
  },
  {
    name: '🎭 Culture',
    keywords: ['culture', 'bibliothèque', 'médiathèque', 'musée', 'théâtre', 'opéra', 'festival', 'concert', 'spectacle', 'patrimoine', 'transmusicales']
  },
  {
    name: '🏗️ Urbanisme & Aménagement',
    keywords: ['urbanisme', 'plu', 'permis de construire', 'zac', 'aménagement', 'construction', 'bétonisation', 'densification', 'quartier']
  },
  {
    name: '🏠 Logement & Habitat',
    keywords: ['logement', 'hlm', 'logement social', 'habitat', 'loyer', 'immobilier', 'rénovation', 'copropriété']
  },
  {
    name: '🚇 Transports & Mobilités',
    keywords: ['transport', 'métro', 'bus', 'star', 'vélo', 'mobilité', 'circulation', 'stationnement', 'parking', 'piste cyclable', 'ligne b']
  },
  {
    name: '🌳 Environnement',
    keywords: ['environnement', 'écologie', 'biodiversité', 'espace vert', 'parc', 'arbre', 'nature', 'pollution', 'qualité air', 'climat']
  },
  {
    name: '🗑️ Déchets & Propreté',
    keywords: ['déchet', 'poubelle', 'tri', 'propreté', 'ordures', 'collecte', 'déchetterie', 'saleté', 'tags', 'graffiti']
  },
  {
    name: '💧 Eau & Assainissement',
    keywords: ['eau', 'assainissement', 'eau potable', 'égout', 'station épuration', 'inondation']
  },
  {
    name: '💼 Économie locale',
    keywords: ['économie', 'commerce', 'emploi', 'entreprise', 'zone activité', 'chômage', 'attractivité', 'investissement']
  },
  {
    name: '🏖️ Tourisme',
    keywords: ['tourisme', 'office tourisme', 'visiteur', 'attractivité touristique', 'hôtel']
  },
  {
    name: '💻 Numérique',
    keywords: ['numérique', 'fibre', 'digital', 'smart city', 'wifi', 'open data']
  },
  {
    name: '💰 Finances locales',
    keywords: ['budget', 'impôt', 'taxe', 'fiscalité', 'dette', 'finances', 'subvention', 'dépense', 'investissement public']
  },
  {
    name: '🗳️ Élections / Campagne',
    keywords: ['élection', 'municipale', 'campagne', 'candidat', 'programme', 'sondage', 'meeting', 'liste', 'vote', 'scrutin', '2026', 'premier tour', 'second tour']
  }
];

// Mots-clés généraux pour filtrer sur Rennes
export const RENNES_KEYWORDS = [
  'rennes',
  'rennais',
  'rennaise',
  'métropole rennaise',
  'ille-et-vilaine',
  '35000',
  'villejean',
  'blosne',
  'maurepas',
  'cleunay',
  'poterie',
  'saint-jacques',
  'thabor',
  'centre-ville rennes',
  'place de la mairie',
  'esplanade charles de gaulle'
];

// Critères de scoring pour les alertes
export const SCORING_RULES = {
  // Mention d'un candidat prioritaire (Charles Compagnon)
  candidatPrioritaire: 5,
  // Mention d'un autre candidat
  autreCandidat: 3,
  // Mots-clés élections
  motsClesElections: 3,
  // Source institutionnelle
  sourceInstitutionnelle: 2,
  // Thème sécurité (sujet majeur campagne)
  themeSécurité: 2,
  // Sondage ou enquête
  sondage: 4,
  // Polémique / clash
  polemique: 3,
  // Annonce programme / meeting
  annonceEvenement: 3,
  // Article long / enquête approfondie
  articleLong: 1,
  // Reprise multi-sources (sera calculé dynamiquement)
  repriseMultiSources: 4
};

// Seuil pour notification temps réel
export const ALERT_THRESHOLD = 8;

// Configuration des récaps
export const RECAP_CONFIG = {
  daily: {
    cron: '0 7 * * *', // Tous les jours à 7h
    subject: '📰 Veille Rennes - Récap quotidien'
  },
  weekly: {
    cron: '0 8 * * 1', // Tous les lundis à 8h
    subject: '📊 Veille Rennes - Synthèse hebdomadaire'
  }
};
