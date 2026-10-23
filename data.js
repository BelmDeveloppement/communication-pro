/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. */
window.DATA = {
 "exo": {
  "F0": {
   "id": "F0",
   "titre": "Débat, puis vérification : deux phrases entendues",
   "mode": "Binômes, ordinateur",
   "duree": 12,
   "chap": "Carnet · chapitre 1",
   "situation": [
    "Deux phrases entendues à la machine à café, que vous venez de débattre :",
    "« La retraite à vie des ministres. »",
    "« Le paiement systématique des jours de grève pour les fonctionnaires. »",
    "Maintenant, on vérifie : 12 minutes, un moteur de recherche, et uniquement des sources que vous pouvez citer (organisme, titre, date)."
   ],
   "taches": [
    "Phrase 1 (retraite à vie des ministres) : d'après la meilleure source trouvée, la phrase est-elle exacte ?",
    "Phrase 2 (paiement des jours de grève) : d'après la meilleure source trouvée, la phrase est-elle exacte ?",
    "Citez la source de chaque phrase (organisme, titre, date).",
    "En combien de minutes avez-vous trouvé votre première source solide ?",
    "Avec ChatGPT ou une autre IA (notez laquelle) : posez-lui la phrase 1 telle quelle. Cite-t-elle un texte officiel que vous pouvez ouvrir ?"
   ],
   "types": [
    [
     "Exacte",
     "Inexacte",
     "À nuancer"
    ],
    [
     "Exacte",
     "Inexacte",
     "À nuancer"
    ],
    null,
    "num",
    "on"
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Définir d'abord les mots flous (« ministres », « à vie », « systématique », « fonctionnaires »).",
     "Chercher un texte officiel : loi, décret, réponse ministérielle, site public.",
     "Comparer avec des sites secondaires : date, auteur, intérêt commercial.",
     "Écrire ce que la source dit, pas ce que l'on pensait."
    ],
    "cols": [
     "Phrase",
     "Ce que disent les sources lues à la construction (octobre 2026)"
    ],
    "widths": [
     2.4,
     7.0
    ],
    "rows": [
     [
      "1 · mots flous",
      "« Ministres » : membres du gouvernement ou ministres du culte ? (une recherche « pension des ministres » renvoie aussi à la Cavimac, question n° 8167, 2002). « À vie » : toute pension est versée à vie ; la vraie question est : un régime spécial ?"
     ],
     [
      "1 · texte officiel",
      "Réponse du Premier ministre, question écrite n° 16295 (AN, JO 10/09/2019) : tous les membres du Gouvernement cotisent à la CNAV et à l'IRCANTEC."
     ],
     [
      "1 · sites secondaires",
      "La Retraite en Clair (sept. 2025), Cleerly (avril 2026) : pas de retraite à vie spécifique ; indemnité de départ de trois mois au plus ; montants différents selon les sites."
     ],
     [
      "1 · verdict prudent",
      "À nuancer : le texte officiel lu (réponse ministérielle de 2019) ne décrit pas de régime spécial ; la Retraite en Clair (2022, mise à jour en 2025) le confirme."
     ],
     [
      "2 · mots flous",
      "« Systématique » ? « Fonctionnaires » : État, territoriale, hospitalière ? « Payé » : traitement ou primes ?"
     ],
     [
      "2 · texte officiel",
      "Réponse ministérielle du 25/05/2004 (question n° 28642) : toute absence pour fait de grève entraîne une retenue d'un trentième du traitement (loi n° 61-825 de 1961 ; décret n° 62-765 de 1962)."
     ],
     [
      "2 · complément",
      "Maire-info (17/02/2023) : règle du « trentième indivisible » pour l'État, pas pour la territoriale ni l'hospitalière ; jugée contraire à la Charte sociale européenne par le CEDS (saisine CGT)."
     ],
     [
      "2 · verdict prudent",
      "Inexacte pour l'État d'après ces sources (retenue confirmée par la cour administrative d'appel de Versailles, 24/07/2018, n° 16VE03343, d'après Le Monde du Droit). Le débat sur la règle est politique : on le rapporte, on ne le tranche pas."
     ],
     [
      "IA · réponse de l'IA",
      "Souvent non, ou une référence vague. Une IA répond de façon fluide : seule une source officielle ouverte et lue vaut preuve. Comparez avec votre propre source."
     ]
    ],
    "modele": [
     "Phrase 1 : à nuancer. Selon la réponse du Premier ministre à la question écrite n° 16295 (Assemblée nationale, JO du 10/09/2019), les membres du Gouvernement cotisent à la CNAV et à l'IRCANTEC comme les autres salariés ; je n'ai pas trouvé de régime spécial dans ce texte. Réserve : texte de 2019.",
     "Phrase 2 : inexacte pour l'État. Selon la réponse ministérielle du 25/05/2004 (question n° 28642), une absence pour fait de grève entraîne une retenue d'un trentième du traitement. Réserve : la règle du trentième indivisible vaut pour l'État ; elle ne s'applique pas de la même façon à la territoriale ni à l'hospitalière (Maire-info, 2023).",
     "Erreurs fréquentes : débattre de ses opinions avant de définir les mots ; s'arrêter au premier site trouvé ; confondre le texte officiel et le site qui le commente ; conclure « vrai » ou « faux » sans préciser le périmètre."
    ],
    "modele_titre": "Exemple de réponse rédigée, avec source et réserve",
    "retenir": "Une phrase courte et frappante est presque toujours floue : on précise les mots, on cherche la source officielle, on cite, on indique la réserve."
   }
  },
  "EX1": {
   "id": "EX1",
   "titre": "Choisir et formuler votre question de décision",
   "mode": "Équipes",
   "duree": 15,
   "chap": "Carnet · chapitre 1",
   "situation": [
    "La directrice de TransLor (PME de 120 salariés, fictive) vous confie un état de l'art pour éclairer une décision informatique.",
    "Choisissez un sujet dans la liste (page « Sujets », QR) : vous le défendrez devant un jury à la fin du cours. Règle : un seul sujet par personne, et un sujet n'est attribué qu'à une seule personne, la première qui le choisit dans l'application."
   ],
   "taches": [
    "Choisissez un sujet et reformulez-le : « Faut-il … chez TransLor, selon quels critères ? »",
    "Écrivez 4 critères de comparaison (coût, sécurité, facilité d'usage, délai…).",
    "Écrivez 3 mots-clés en français et leur traduction en anglais.",
    "Tapez-les dans Google Scholar : combien de résultats environ ?",
    "Avec Claude ou une autre IA (notez laquelle) : demandez 5 formulations de question de décision pour votre sujet. Gardez-en une ou écrivez la vôtre, et dites pourquoi en une phrase."
   ],
   "livrable": "Votre question de décision, 4 critères et 3 mots-clés → Dossier, section 1.",
   "corr": {
    "methode": [
     "Un thème n'est pas une question : il faut une décision.",
     "Les critères sont des mots que l'on peut comparer.",
     "Les mots-clés viennent de la question, pas du hasard."
    ],
    "cols": [
     "Faible",
     "Bon (exemple)"
    ],
    "widths": [
     3.0,
     6.0
    ],
    "rows": [
     [
      "« Les passkeys »",
      "« Faut-il remplacer les mots de passe par des passkeys chez TransLor, selon le coût, la sécurité, la facilité d'usage et la compatibilité ? »"
     ],
     [
      "« Le cloud, c'est mieux ? »",
      "« Faut-il héberger la messagerie dans un cloud public, chez un hébergeur local ou en interne, selon le coût, la sécurité et la reprise après panne ? »"
     ],
     [
      "Critères : « bien », « moderne »",
      "Critères comparables : coût annuel, délai de déploiement, risque résiduel, satisfaction des utilisateurs"
     ],
     [
      "Mots-clés : « sécurité »",
      "« passkeys » OR « passwordless », « authentification » OR « authentication »"
     ],
     [
      "IA · formulations",
      "Gardez la formulation qui contient une décision, des critères comparables et un périmètre (TransLor). Une IA propose souvent des questions trop larges : resserrez."
     ]
    ],
    "erreurs": [
     "Un sujet trop large : on ne finira pas.",
     "Un sujet sans littérature : vérifiez en deux minutes que vous trouvez au moins cinq résultats sérieux.",
     "Écrire la réponse d'avance : la question reste ouverte."
    ]
   },
   "types": [
    null,
    null,
    null,
    "num",
    null
   ]
  },
  "EX6": {
   "id": "EX6",
   "titre": "Rédiger une note de synthèse d'une page",
   "mode": "Individuel",
   "duree": 20,
   "chap": "Carnet · chapitre 2",
   "situation": [
    "Extrait d'un rapport interne (fictif) sur les sauvegardes de TransLor :",
    "La sauvegarde est faite chaque nuit sur un disque unique, dans la salle serveur. Le disque a trois ans. Un test de restauration en juin a pris 9 heures. L'administrateur estime la probabilité d'une panne de disque à 10 % par an. Une journée d'arrêt coûterait environ 40 000 € (hypothèse inventée). Le prestataire propose une copie hors site pour 150 € par mois, avec restauration en 3 heures."
   ],
   "taches": [
    "Écrivez la conclusion en une phrase.",
    "Donnez trois arguments chiffrés.",
    "Ajoutez une réserve et la décision demandée, avec une date."
   ],
   "livrable": "Une note de synthèse de 6 lignes maximum.",
   "corr": {
    "methode": [
     "Conclusion d'abord.",
     "Trois arguments, chacun avec un chiffre.",
     "Une réserve honnête.",
     "Une décision demandée et une date."
    ],
    "rows": [
     [
      "Conclusion",
      "Ajouter une copie hors site des sauvegardes"
     ],
     [
      "Argument 1",
      "Disque unique de trois ans : risque de panne estimé à 10 % par an"
     ],
     [
      "Argument 2",
      "Restauration actuelle : 9 h, contre 3 h avec la copie hors site"
     ],
     [
      "Argument 3",
      "Coût : 150 × 12 = 1 800 € par an ; perte attendue sans copie : 10 % × 40 000 = 4 000 € par an"
     ],
     [
      "Réserve",
      "La probabilité est une estimation de l'administrateur ; le coût d'un arrêt est une hypothèse"
     ],
     [
      "Décision demandée",
      "Valider 1 800 € par an avant la fin du mois"
     ]
    ],
    "erreurs": [
     "Raconter l'historique au lieu de conclure.",
     "Écrire « coûteux » ou « rapide » sans chiffre.",
     "Oublier la décision demandée et la date."
    ],
    "modele": [
     "Objet : Décision avant fin du mois : copie hors site des sauvegardes",
     "Je recommande d'ajouter une copie hors site (1 800 € par an). Le disque unique a trois ans, avec une panne estimée à 10 % par an ; la restauration prendrait 9 h, contre 3 h avec la copie. Une journée d'arrêt coûterait environ 40 000 € (hypothèse), soit une perte attendue de 4 000 € par an. Réserve : la probabilité est une estimation à confirmer par un test. Décision demandée : valider avant le 30."
    ],
    "retenir": "Une note de synthèse se lit en une minute : conclusion, trois arguments chiffrés, réserve, décision demandée."
   },
   "types": [
    null,
    null,
    null
   ]
  },
  "EX7": {
   "id": "EX7",
   "titre": "Décomposer une question en mots-clés",
   "mode": "Binôme",
   "duree": 15,
   "chap": "Carnet · chapitre 3",
   "situation": [
    "Question d'exemple : « Faut-il activer les mises à jour automatiques sur tous les postes de TransLor ? »",
    "Aujourd'hui, beaucoup d'entre vous interrogent d'abord une IA. Elle comprend une phrase, mais vous devez pouvoir refaire et citer votre recherche : les mots-clés servent dans un moteur comme dans une IA (on les donne à l'IA pour qu'elle cherche mieux)."
   ],
   "taches": [
    "Soulignez les 3 concepts clés de la question.",
    "Écrivez les synonymes français et anglais de chaque concept.",
    "Demandez à une IA : « Propose-moi des mots-clés français et anglais et une requête de recherche pour : <la question> ». Combien de mots-clés proposés n'étaient pas dans votre liste ? Notez le nom de l'IA utilisée.",
    "Parmi les propositions de l'IA, combien sont hors sujet ou trompeurs ?",
    "Assemblez votre requête finale (guillemets, OR), puis faites de même pour votre question (EX1)."
   ],
   "livrable": "Un tableau : concepts, synonymes français et anglais, requête. → Dossier, section 3.",
   "corr": {
    "methode": [
     "Un concept = un mot ou une expression.",
     "Un synonyme par ligne, en français et en anglais.",
     "Guillemets pour les expressions, OR entre synonymes.",
     "Donner à l'IA le contexte, la langue et le format attendu, puis trier ses propositions."
    ],
    "cols": [
     "Concept",
     "Synonymes (FR / EN)"
    ],
    "widths": [
     2.6,
     6.2
    ],
    "rows": [
     [
      "Mises à jour automatiques",
      "« mise à jour automatique » OR « automatic update » OR « auto-update »"
     ],
     [
      "Correctifs de sécurité",
      "correctif OR « patch » OR « security update »"
     ],
     [
      "Postes de travail",
      "« poste de travail » OR « endpoint » OR « workstation »"
     ],
     [
      "Avec une IA",
      "L'IA propose en général 2 à 4 mots-clés de plus (par exemple « patch management », « endpoint ») et 1 à 2 hors sujet. Elle aide à élargir le vocabulaire ; c'est vous qui triez, puis la requête finale est testée dans un moteur ou une base : on peut la refaire et la citer, pas la conversation avec l'IA."
     ],
     [
      "Requête assemblée",
      "(« mise à jour automatique » OR « automatic update ») (« poste de travail » OR « endpoint ») sécurité OR security"
     ]
    ],
    "erreurs": [
     "Taper la question entière : le moteur en tire des résultats flous.",
     "Oublier l'anglais : on perd une grande part de la littérature technique.",
     "Des mots trop généraux (« sécurité » seul)."
    ]
   },
   "types": [
    null,
    null,
    "num",
    "num",
    null
   ]
  },
  "EX8": {
   "id": "EX8",
   "titre": "Chercher dans Google Scholar avec des opérateurs",
   "mode": "Individuel, ordinateur",
   "duree": 20,
   "chap": "Carnet · chapitre 3",
   "situation": [
    "Ouvrez Google Scholar (ou Semantic Scholar) avec la requête de votre question (EX7).",
    "Une recherche doit pouvoir être refaite : notez la requête exacte et la date."
   ],
   "taches": [
    "Lancez une requête simple dans Google Scholar : combien de résultats ?",
    "Précisez avec guillemets, OR, tiret et filtre de dates (5 ans) : écrivez la requête finale.",
    "Combien de résultats après précision ?",
    "Relevez 5 résultats utiles : titre, auteurs, année, type de document.",
    "Posez la même question à un assistant de recherche IA (Semantic Scholar, Consensus, Elicit, Perplexity…) : combien de ses 5 références retrouvez-vous réellement dans Google Scholar ? Notez le nom de l'IA utilisée."
   ],
   "livrable": "La requête finale, la date, et 5 résultats notés. → Dossier, section 3.",
   "corr": {
    "methode": [
     "Partir large, puis préciser.",
     "Comparer avant et après : une bonne requête réduit le nombre de résultats sans perdre l'essentiel.",
     "Noter la trace de la recherche."
    ],
    "cols": [
     "Étape",
     "Ce qui est attendu"
    ],
    "widths": [
     2.2,
     6.6
    ],
    "rows": [
     [
      "Requête simple",
      "Souvent des dizaines de milliers de résultats : inutilisable telle quelle"
     ],
     [
      "Requête précisée",
      "Quelques centaines ou milliers : on peut lire les premières pages"
     ],
     [
      "Exemple d'opérateurs",
      "« authentification forte » OR « multi-factor authentication » -banque, avec le filtre « depuis 2021 » (menu de gauche)"
     ],
     [
      "Natures à repérer",
      "Article de revue, actes de conférence, rapport, thèse, page commerciale, presse"
     ],
     [
      "Trace",
      "Requête, date, nombre de résultats : une recherche doit pouvoir être refaite"
     ],
     [
      "IA · références retrouvées",
      "Souvent 3 ou 4 sur 5. Une référence qu'on ne retrouve pas par son titre exact est à écarter (voir EX15). L'IA donne des pistes, la base permet de refaire la recherche."
     ]
    ],
    "erreurs": [
     "Ne lire que le premier résultat.",
     "Ne pas noter la requête : impossible de la justifier ou de la refaire.",
     "Tout garder sans regarder la nature du document."
    ]
   },
   "types": [
    "num",
    null,
    "num",
    null,
    "num"
   ]
  },
  "EX9": {
   "id": "EX9",
   "titre": "Trouver deux sources institutionnelles",
   "mode": "Équipes",
   "duree": 15,
   "chap": "Carnet · chapitre 3",
   "situation": [
    "Pour votre question, cherchez deux documents : au moins un publié par un organisme public ou de normalisation ; l'autre peut venir d'un expert reconnu du domaine.",
    "Pistes institutionnelles : ANSSI et CNIL (France), ENISA (Europe), NIST (États-Unis), ISO et AFNOR (normes, parfois payantes).",
    "Pistes d'experts en cybersécurité : blogs et centres d'alerte tenus par des spécialistes reconnus (par exemple Krebs on Security, Schneier on Security, SANS Internet Storm Center, Google Project Zero). Un expert n'est pas une institution : regardez qui il est, qui le finance et si d'autres sources le recoupent."
   ],
   "taches": [
    "Trouvez deux documents utiles à votre question (au moins un d'un organisme public).",
    "Notez pour chacun : auteur ou organisme, titre, date, version, adresse.",
    "Recommandation, norme, loi, rapport ou avis d'expert ? Une phrase de synthèse par document.",
    "Avec Le Chat (Mistral) ou une autre IA (notez laquelle) : demandez les organismes et experts qui ont publié sur votre sujet. Combien de ses noms existent vraiment et ont publié sur le sujet (vérifiez sur leur site) ?"
   ],
   "livrable": "Deux références complètes avec une phrase de synthèse chacune. → Dossier, section 4.",
   "corr": {
    "methode": [
     "Chercher d'abord sur le site de l'organisme.",
     "Noter date et version.",
     "Distinguer recommandation, norme et loi."
    ],
    "cols": [
     "Type",
     "Ce que c'est, et exemple"
    ],
    "widths": [
     2.4,
     6.4
    ],
    "rows": [
     [
      "Recommandation",
      "Guide de bonnes pratiques : pas obligatoire, mais fait référence (guides d'une agence nationale, par exemple)"
     ],
     [
      "Norme",
      "Texte consensuel de normalisation (ISO, AFNOR) : applicable si on s'y engage, parfois payante"
     ],
     [
      "Obligation légale",
      "Loi ou règlement : s'impose (par exemple le RGPD pour les données personnelles)"
     ],
     [
      "Rapport d'étude",
      "Observations ou statistiques : à lire avec la méthode et la date"
     ],
     [
      "Expert reconnu",
      "Spécialiste identifiable, travaux cités par d'autres : à lire avec la grille (qui le finance, lien avec un éditeur, recoupement). Il appuie un argument mais ne remplace pas un texte officiel pour établir un fait."
     ],
     [
      "IA · organismes cités",
      "L'IA cite souvent des organismes réels mais leur attribue parfois des documents qu'ils n'ont pas publiés : ouvrez le site de l'organisme et cherchez le titre."
     ]
    ],
    "erreurs": [
     "Prendre une recommandation pour une obligation.",
     "Citer sans date ni version : le document a peut-être été remplacé.",
     "Citer un lien qui ne fonctionnera plus : enregistrer le document (Zotero)."
    ]
   },
   "types": [
    null,
    null,
    null,
    "num"
   ]
  },
  "EX10": {
   "id": "EX10",
   "titre": "Atelier Zotero : enregistrer et citer",
   "mode": "Individuel, ordinateur",
   "duree": 20,
   "chap": "Carnet · chapitre 3",
   "situation": [
    "Zotero est un outil gratuit de gestion de références. Version de bureau avec extension de navigateur (Zotero Connector).",
    "Si l'installation est impossible sur votre poste, utilisez un tableur : auteur, année, titre, lien.",
    "Si Google Scholar se bloque (contrôle anti-robot déclenché par l'extension), changez de base : HAL (hal.science), Semantic Scholar (semanticscholar.org) ou arXiv (arxiv.org). Le bouton de l'extension Zotero y fonctionne. Dernier recours : « Ajouter par identifiant » dans Zotero (collez un DOI)."
   ],
   "taches": [
    "Installez Zotero et son extension (ou ouvrez la version web).",
    "Enregistrez 5 références depuis HAL ou Semantic Scholar (ou Google Scholar si l'extension le permet) et vérifiez auteurs, année, titre.",
    "Générez une bibliographie dans un style au choix.",
    "Avec Perplexity ou une autre IA (notez laquelle) : demandez-lui de mettre vos 2 premières références au format APA. Comparez avec la bibliographie de Zotero : combien de différences ?"
   ],
   "livrable": "Votre bibliographie de 5 références générée par Zotero. → Dossier, section 17.",
   "corr": {
    "methode": [
     "Un clic enregistre la référence.",
     "Toujours vérifier les champs importés.",
     "Classer dès l'enregistrement."
    ],
    "cols": [
     "Geste",
     "Résultat attendu"
    ],
    "widths": [
     3.0,
     5.8
    ],
    "rows": [
     [
      "Enregistrer",
      "Icône de l'extension dans le navigateur : la référence apparaît dans la bibliothèque"
     ],
     [
      "Vérifier",
      "Les champs vides (année, auteurs) se complètent à la main"
     ],
     [
      "Classer",
      "Un dossier par question, des étiquettes pour l'état (retenue, à recouper)"
     ],
     [
      "Bibliographie",
      "Clic droit sur les références, puis « Créer une bibliographie » : style, format, copier"
     ],
     [
      "Sans Zotero",
      "Tableur : auteur, année, titre, lien, note sur 12"
     ],
     [
      "IA · mise en forme",
      "Quelques différences (ponctuation, initiales, majuscules). Zotero tire les données de la page ou du DOI : plus fiable qu'une IA, qui peut déformer un nom ou une année."
     ]
    ],
    "erreurs": [
     "Importer sans vérifier : des champs manquent souvent.",
     "Mélanger plusieurs styles de citation.",
     "Ne pas classer : on retrouve mal ses sources le jour de la rédaction."
    ]
   },
   "types": [
    null,
    null,
    null,
    "num"
   ]
  },
  "EX11": {
   "id": "EX11",
   "titre": "Évaluer cinq sources",
   "mode": "Binôme",
   "duree": 20,
   "chap": "Carnet · chapitre 4",
   "situation": [
    "Sujet : l'authentification forte en entreprise. Cinq sources (fictives) :",
    "S1 — Article de revue à comité de lecture, 2024, méthode décrite, 3 organisations, limites discutées.",
    "S2 — Brochure commerciale d'un éditeur, 2025, chiffres sans méthode.",
    "S3 — Rapport d'une agence publique, 2023, mesures sur 120 organisations, méthode publiée.",
    "S4 — Billet de blog anonyme, 2022, « 100 % fiable » sans source.",
    "S5 — Article de presse généraliste, 2025, cite uniquement S2.",
    "Grille : Qui ? Quand ? Pourquoi ? Sur quoi ? Recoupé ? Reproductible ? (0 à 2 chacune, maximum 12). 9 et plus : fiable ; 5 à 8 : à recouper ; 4 et moins : à écarter ou citer avec prudence."
   ],
   "taches": [
    "Notez S1 à S5 avec la grille (maximum 12).",
    "Classez les sources : lesquelles gardez-vous ?",
    "Pourquoi S5 n'ajoute-t-elle rien à S2 ?"
   ],
   "livrable": "Un tableau de notation et la liste des sources retenues.",
   "corr": {
    "methode": [
     "Qui : auteur identifié et compétent ? Quand : récent pour le sujet ? Pourquoi : informer ou vendre ?",
     "Sur quoi : données et méthode visibles ? Recoupé : d'autres sources concordent ? Reproductible : méthode refaisable ?",
     "Additionner puis appliquer les seuils."
    ],
    "cols": [
     "Source",
     "Q / Q / P / S / R / R",
     "Total",
     "Décision"
    ],
    "widths": [
     0.7,
     2.4,
     0.9,
     4.2
    ],
    "rows": [
     [
      "S1",
      "2 / 2 / 2 / 2 / 1 / 2",
      "11",
      "Fiable : retenue"
     ],
     [
      "S3",
      "2 / 1 / 2 / 2 / 1 / 2",
      "10",
      "Fiable : retenue"
     ],
     [
      "S5",
      "1 / 2 / 1 / 0 / 0 / 0",
      "4",
      "À écarter : source unique, reprend S2"
     ],
     [
      "S2",
      "1 / 2 / 0 / 0 / 0 / 0",
      "3",
      "Citer comme position de l'éditeur seulement"
     ],
     [
      "S4",
      "0 / 1 / 0 / 0 / 0 / 0",
      "1",
      "Écartée"
     ]
    ],
    "erreurs": [
     "Croire qu'un chiffre cité plusieurs fois est vrai : S5 dépend de S2 (source circulaire).",
     "Rejeter une brochure commerciale : on peut la citer comme position de l'acteur.",
     "Ne retenir que les sources qui confirment son idée (biais de confirmation)."
    ]
   },
   "types": [
    null,
    null,
    null
   ]
  },
  "EX12": {
   "id": "EX12",
   "titre": "Évaluer vos propres sources",
   "mode": "Individuel, ordinateur",
   "duree": 30,
   "chap": "Carnet · chapitre 4",
   "situation": [
    "Reprenez les résultats de vos recherches (EX8, EX9) dans Zotero.",
    "Grille en six questions, chacune notée 0 (non), 1 (en partie) ou 2 (oui) : Qui ? auteur identifié, compétent, indépendant. Quand ? date adaptée au sujet. Pourquoi ? informer plutôt que vendre. Sur quoi ? données et méthode visibles. Recoupé ? d'autres sources indépendantes concordent. Reproductible ? la méthode peut être refaite.",
    "Total sur 12 : 9 et plus = fiable ; 5 à 8 = à recouper ; 4 et moins = à écarter ou à citer avec prudence."
   ],
   "taches": [
    "Choisissez 5 sources de votre question et notez-les avec la grille.",
    "Gardez-en 3 au moins et justifiez chaque décision en une phrase.",
    "Dans Zotero, étiquetez-les « retenue » ou « écartée ».",
    "Avec ChatGPT ou une autre IA (notez laquelle) : donnez-lui une de vos sources et la grille, demandez une note sur 12. Quel écart avec votre note, en points ?"
   ],
   "livrable": "La grille de 5 sources remplie et 3 sources retenues dans Zotero. → Dossier, section 5.",
   "corr": {
    "methode": [
     "Noter chaque critère sans regarder le total.",
     "Appliquer les seuils : 9 et plus, 5 à 8, 4 et moins.",
     "Justifier : une phrase, un fait."
    ],
    "cols": [
     "Cas (fictif)",
     "Notation et décision"
    ],
    "widths": [
     3.0,
     5.8
    ],
    "rows": [
     [
      "Rapport d'agence, 2023, méthode publiée",
      "2 / 1 / 2 / 2 / 1 / 2 = 10 : fiable, retenue"
     ],
     [
      "Brochure d'éditeur, 2025, sans méthode",
      "1 / 2 / 0 / 0 / 0 / 0 = 3 : citer comme position de l'éditeur"
     ],
     [
      "Article de revue relue, 2021, 3 organisations",
      "2 / 1 / 2 / 2 / 1 / 2 = 10 : retenue ; date à discuter selon le sujet"
     ],
     [
      "Page de presse reprenant la brochure",
      "1 / 2 / 1 / 0 / 0 / 0 = 4 : écartée (source circulaire)"
     ],
     [
      "IA · écart de notation",
      "Souvent 2 à 4 points : l'IA surestime « Recoupé » et « Reproductible » qu'elle ne peut pas vérifier. Votre note, sourcée, fait foi."
     ]
    ],
    "erreurs": [
     "Noter « Recoupé » sans avoir cherché une autre source indépendante.",
     "Retenir cinq sources du même éditeur : elles ne se recoupent pas.",
     "Écarter sans justifier : le jury demandera pourquoi."
    ]
   },
   "types": [
    null,
    null,
    null,
    "num"
   ]
  },
  "EX13": {
   "id": "EX13",
   "titre": "Remonter à la source d'un chiffre",
   "mode": "Binôme, ordinateur",
   "duree": 20,
   "chap": "Carnet · chapitre 4",
   "situation": [
    "Un article de presse (fictif) écrit : « 60 % des PME victimes d'une cyberattaque disparaissent dans les six mois. »",
    "Ce chiffre est souvent répété ; sa source n'est pas indiquée dans l'article. Retrouvez son origine par vos recherches."
   ],
   "taches": [
    "Cherchez l'origine du chiffre et notez le chemin : article, article, origine.",
    "La source d'origine existe-t-elle ? Que mesure-t-elle exactement ?",
    "Que répondez-vous à la directrice qui veut le citer ?",
    "Avec Claude ou une autre IA (notez laquelle) : demandez l'origine du chiffre « 60 % ». Donne-t-elle une source que vous retrouvez ?"
   ],
   "livrable": "Le chemin de vos recherches et votre phrase de réponse. → Dossier, section 6.",
   "corr": {
    "methode": [
     "Chaque article cite un autre article : remonter jusqu'au document primaire.",
     "Lire ce que la source mesure, sur qui, quand.",
     "À défaut de source primaire : ne pas citer comme un fait."
    ],
    "cols": [
     "Situation trouvée",
     "Que faire ?"
    ],
    "widths": [
     3.2,
     5.6
    ],
    "rows": [
     [
      "Source d'origine trouvée et claire",
      "Citer la source d'origine, avec ce qu'elle mesure vraiment"
     ],
     [
      "Source d'origine trouvée mais différente de l'affirmation",
      "Corriger la formulation : citer ce qui est réellement mesuré"
     ],
     [
      "Aucune source primaire trouvée",
      "Écrire « chiffre fréquemment cité, sans source d'origine vérifiable » ou l'écarter"
     ],
     [
      "Phrase de réponse à la directrice",
      "« Je n'ai pas pu retrouver l'étude d'origine : je propose de citer le chiffre comme non sourcé, ou de ne pas l'utiliser. »"
     ],
     [
      "IA · origine du chiffre",
      "Souvent non : l'IA cite une étude plausible mais introuvable. Un chiffre sans source retrouvable ne se cite pas comme un fait."
     ]
    ],
    "erreurs": [
     "S'arrêter au deuxième article qui répète le chiffre.",
     "Citer le chiffre parce qu'il est « connu ».",
     "Conclure qu'il est faux sans preuve : l'absence de source n'est pas une preuve du contraire."
    ]
   },
   "types": [
    null,
    null,
    null,
    "on"
   ]
  },
  "F5": {
   "id": "F5",
   "titre": "Exit ticket · fin du jour 1",
   "mode": "Individuel",
   "duree": 10,
   "chap": "Carnet · tous chapitres",
   "situation": [
    "Dernier point de la journée : quatre phrases dans votre carnet."
   ],
   "taches": [
    "Ma question de décision est : …",
    "Une source que j'ai écartée et pourquoi : …",
    "Ce que je ne sais pas encore : …",
    "Mon premier pas demain matin : …"
   ],
   "livrable": ""
  },
  "EX14": {
   "id": "EX14",
   "titre": "Lire un vrai article en 10 minutes",
   "mode": "Individuel, ordinateur",
   "duree": 20,
   "chap": "Carnet · chapitre 5",
   "situation": [
    "Choisissez, parmi les sources de votre question (EX8 à EX12), un article scientifique en accès libre : HAL, arXiv, revue en accès ouvert, ou lien « [PDF] » de Google Scholar. Enregistrez-le dans Zotero.",
    "Plan B si vous n'en trouvez pas en 5 minutes : analysez cet article réel en accès libre : Meyer L. A. et al. (Microsoft), « How effective is multifactor authentication at deterring cyberattacks? », arXiv:2305.00945, mai 2023 (arxiv.org/abs/2305.00945). Lisez dans l'ordre : résumé, conclusion, méthode, résultats."
   ],
   "taches": [
    "Écrivez la référence complète et la question de l'article en une phrase.",
    "Quelles sont la méthode et le résultat principal (avec son chiffre) ?",
    "Combien de limites l'article reconnaît-il lui-même ?",
    "Une déclaration de financement ou de conflit d'intérêts est-elle indiquée ?",
    "Écrivez la phrase honnête qui citerait ce résultat dans votre état de l'art.",
    "Avec Gemini ou une autre IA (document public seulement ; notez laquelle) : demandez un résumé de l'article. Le résumé contient-il une erreur ou oublie-t-il une limite ?"
   ],
   "types": [
    null,
    null,
    "num",
    "on",
    null,
    "on"
   ],
   "livrable": "Une fiche de lecture de 7 lignes → Dossier, section 7.",
   "corr": {
    "methode": [
     "Lire dans l'ordre : résumé, conclusion, méthode, limites.",
     "Séparer le résultat (ce qui est mesuré) de l'interprétation.",
     "Toujours regarder qui finance."
    ],
    "cols": [
     "Question",
     "Réponses pour l'article du plan B (Meyer et al., 2023)"
    ],
    "widths": [
     1.5,
     6.5
    ],
    "rows": [
     [
      "Référence",
      "Meyer L. A., Romero S., Bertoli G., Burt T., Weinert A., Ferres J. L. (2023). How effective is multifactor authentication at deterring cyberattacks? arXiv:2305.00945. Tous les auteurs sont employés de Microsoft."
     ],
     [
      "Question",
      "L'authentification multifacteur (MFA) réduit-elle le risque de compromission d'un compte ?"
     ],
     [
      "Méthode",
      "Comptes d'entreprise du service Azure AD de Microsoft présentant une activité suspecte, du 22 avril au 22 septembre 2022 ; un échantillon est examiné à la main par une équipe spécialisée, puis le taux de compromission est estimé par une méthode statistique avec intervalle à 95 %."
     ],
     [
      "Résultat",
      "Le risque de compromission est réduit de 99,22 % pour les comptes avec MFA ; de 98,56 % pour 128 000 comptes dont le mot de passe avait fuité."
     ],
     [
      "Limites",
      "Aucune section « limites ». Les auteurs signalent seulement que les compromissions sont sous-déclarées (d'où l'échantillon) et que leur estimateur est corrigé d'un biais. À ajouter vous-même : un seul service (Azure AD) ; comptes à activité suspecte seulement ; pas de comparaison indépendante."
     ],
     [
      "Financement et conflit",
      "Aucune déclaration de conflit d'intérêts. Les auteurs travaillent pour l'éditeur du service étudié, qui vend le produit : à dire dans votre phrase."
     ],
     [
      "Formulation honnête",
      "« Dans une étude de Microsoft sur des comptes Azure AD (2022), le risque de compromission est réduit de 99,22 % avec l'authentification multifacteur ; l'étude est réalisée par l'éditeur du service, sans déclaration de conflit d'intérêts (Meyer et al., 2023). »"
     ],
     [
      "Lien avec EX18",
      "Ce n'est pas le « 99,9 % » de 2019 : un autre chiffre (99,22 %), une autre mesure (risque de compromission), la même source (Microsoft). Citer le bon chiffre avec sa mesure."
     ],
     [
      "Sur votre article",
      "Mêmes questions, mêmes réponses à chercher : l'enseignant circule et vérifie une fiche par équipe."
     ],
     [
      "IA · résumé de l'article",
      "Souvent oui : limites réduites ou chiffre déformé. Comparez avec votre fiche de lecture, rédigée à partir du texte."
     ]
    ],
    "erreurs": [
     "Généraliser un résultat obtenu sur un seul service à toutes les organisations.",
     "Ignorer l'employeur des auteurs : l'étude est utile, mais ce n'est pas un avis indépendant.",
     "Citer le résumé sans lire la méthode."
    ]
   }
  },
  "EX15": {
   "id": "EX15",
   "titre": "Faire inventer des références à une IA, puis les vérifier",
   "mode": "Binôme, ordinateur",
   "duree": 15,
   "chap": "Carnet · chapitre 5",
   "situation": [
    "Testez une IA générative sur VOTRE question, sans donnée confidentielle ni personnelle.",
    "Consigne : « Donne-moi 5 références (auteurs, année, titre, revue, DOI) sur : <votre question>. »",
    "Vérifiez chaque référence sans demander à l'IA : Google Scholar (titre exact), doi.org (le DOI)."
   ],
   "taches": [
    "Demandez à l'IA 5 références sur votre question (consigne ci-dessus) et recopiez-les. Notez le nom de l'IA utilisée.",
    "Combien existent réellement (titre, auteurs et revue corrects) ?",
    "Y a-t-il au moins une référence inventée ou mélangée ?",
    "Quelle règle appliquerez-vous avant de citer une source donnée par une IA ?"
   ],
   "types": [
    null,
    "num",
    "on",
    null
   ],
   "livrable": "La liste des 5 références vérifiées et la règle → Dossier, section 8.",
   "corr": {
    "methode": [
     "Chercher le titre exact entre guillemets.",
     "Ouvrir l'adresse DOI.",
     "Vérifier que la revue ou la conférence existe.",
     "Vérifier les auteurs, l'année, les pages."
    ],
    "cols": [
     "Indice",
     "Pourquoi c'est suspect"
    ],
    "widths": [
     3.0,
     5.8
    ],
    "rows": [
     [
      "DOI qui ne s'ouvre pas",
      "Le préfixe ou le suffixe est inventé, ou renvoie à un autre article"
     ],
     [
      "Vrais auteurs, faux titre",
      "Mélange fréquent : la référence « ressemble » à ce que l'auteur a écrit"
     ],
     [
      "Titre trop parfait",
      "« Le guide absolu… », « A complete survey of every… » : un titre qui répond exactement à votre question"
     ],
     [
      "Pages incohérentes",
      "Un article de 300 pages, un survey complet en 12 pages"
     ],
     [
      "Revue ou conférence introuvable",
      "Nom vague, aucune page officielle"
     ],
     [
      "Règle",
      "Aucune référence donnée par une IA n'est citée avant d'avoir été ouverte et lue à son origine"
     ],
     [
      "Résultat de votre test",
      "Il varie selon l'IA et la question : l'important est la méthode de vérification, pas le score"
     ]
    ],
    "erreurs": [
     "Demander à la même IA de confirmer : elle peut confirmer une invention.",
     "Vérifier seulement l'orthographe des noms.",
     "Garder « au cas où » une référence introuvable."
    ]
   }
  },
  "F6": {
   "id": "F6",
   "titre": "Flash · Quel biais ? (téléphone)",
   "mode": "Individuel, téléphone",
   "duree": 5,
   "chap": "Carnet · chapitre 5",
   "situation": [
    "Sur votre téléphone : scannez le QR de cette page (ou ouvrez l'application), puis appuyez sur le bouton de votre choix pour chaque situation. Quel biais dans chaque situation ?",
    "1. Les études sans résultat marquant ne sont jamais publiées.",
    "2. L'étude est financée par le fabricant du produit testé.",
    "3. Vous ne gardez que les articles qui disent que votre solution préférée est la meilleure.",
    "4. Seules les entreprises qui ont réussi publient leur retour d'expérience."
   ],
   "taches": [
    "Situation 1 : quel biais ?",
    "Situation 2 : quel biais ?",
    "Situation 3 : quel biais ?",
    "Situation 4 : quel biais ?"
   ],
   "types": [
    [
     "Confirmation",
     "Financement",
     "Publication",
     "Survivant"
    ],
    [
     "Confirmation",
     "Financement",
     "Publication",
     "Survivant"
    ],
    [
     "Confirmation",
     "Financement",
     "Publication",
     "Survivant"
    ],
    [
     "Confirmation",
     "Financement",
     "Publication",
     "Survivant"
    ]
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Chercher aussi ce qui contredit.",
     "Regarder qui publie et qui finance."
    ],
    "rows": [
     [
      "1",
      "Biais de publication : chercher les revues systématiques et les rapports ouverts"
     ],
     [
      "2",
      "Biais de financement : lire les déclarations d'intérêts, rechercher une étude indépendante"
     ],
     [
      "3",
      "Biais de confirmation : chercher activement des sources qui contredisent"
     ],
     [
      "4",
      "Biais du survivant : chercher aussi les échecs"
     ]
    ],
    "erreurs": [
     "Croire qu'une source financée est forcément fausse : elle demande seulement une vérification supplémentaire."
    ],
    "widths": [
     0.7,
     8.1
    ],
    "cols": [
     "N°",
     "Réponse"
    ]
   }
  },
  "EX16": {
   "id": "EX16",
   "titre": "Cartographier un argument avec Toulmin",
   "mode": "Équipes",
   "duree": 20,
   "chap": "Carnet · chapitre 6",
   "situation": [
    "La directrice demande : « Pourquoi activer la double authentification partout ? » Un collègue répond :",
    "« Il faut l'activer partout, parce que 80 % des compromissions viennent de mots de passe volés. Tout le monde le fait. Et ça coûte peu. »"
   ],
   "taches": [
    "Placez chaque élément du propos dans les 6 cases du modèle de Toulmin (écrivez « manquant » si la case n'a pas de contenu).",
    "Repérez ce qui manque et ce qui n'est pas un argument.",
    "Réécrivez l'argument complet.",
    "Avec Le Chat (Mistral) ou une autre IA (notez laquelle) : demandez-lui de cartographier le même propos avec Toulmin. Combien de cases diffèrent de la vôtre ?"
   ],
   "livrable": "Une carte de Toulmin complétée. → Dossier, section 9.",
   "corr": {
    "methode": [
     "Affirmation : ce que je veux faire admettre.",
     "Données : les faits sourcés.",
     "Garantie : le lien entre données et affirmation.",
     "Fondement, réfutation, qualificatif : ce qui rend l'argument solide et honnête."
    ],
    "cols": [
     "Case",
     "Contenu"
    ],
    "widths": [
     1.8,
     7.0
    ],
    "rows": [
     [
      "Affirmation",
      "Activer la double authentification partout"
     ],
     [
      "Données",
      "« 80 % des compromissions viennent de mots de passe volés » : chiffre non sourcé"
     ],
     [
      "Garantie",
      "Si la plupart des compromissions viennent de mots de passe volés, un second facteur en bloque la plupart"
     ],
     [
      "Fondement",
      "Manquant : la source du chiffre"
     ],
     [
      "Réfutation",
      "Manquante : vol du second facteur (SMS détourné, fatigue d'authentification), coût d'assistance"
     ],
     [
      "Qualificatif",
      "Manquant : « probablement, d'abord pour les comptes à privilèges »"
     ],
     [
      "Pas un argument",
      "« Tout le monde le fait » : appel à la popularité"
     ],
     [
      "IA · cartographie",
      "Souvent 1 à 3 cases : l'IA complète les cases manquantes avec du plausible (fondement, réfutation). Repérez ce qu'elle a inventé : une case vide est plus honnête."
     ]
    ],
    "erreurs": [
     "Prendre un chiffre non sourcé pour une donnée.",
     "Oublier la réfutation : l'argument paraît trop sûr de lui.",
     "Garder « tout le monde le fait »."
    ],
    "modele": [
     "Affirmation : Activer la double authentification, d'abord pour les comptes à privilèges.",
     "Données : [chiffre sourcé à trouver] sur la part des compromissions liées à des mots de passe volés.",
     "Garantie : un second facteur bloque l'usage d'un mot de passe volé.",
     "Réfutation : vol du second facteur (SMS détourné, fatigue d'authentification) ; coût d'assistance.",
     "Qualificatif : probablement efficace, sous réserve de choisir un second facteur résistant."
    ],
    "retenir": "Un argument complet : affirmation, données sourcées, garantie, réfutation honnête, qualificatif."
   },
   "types": [
    "toulmin6",
    null,
    null,
    "num"
   ]
  },
  "EX17": {
   "id": "EX17",
   "titre": "Chasser les sophismes (téléphone)",
   "mode": "Individuel, téléphone",
   "duree": 8,
   "chap": "Carnet · chapitre 6",
   "situation": [
    "Sur votre téléphone : scannez le QR de cette page (ou ouvrez l'application) et appuyez sur le bouton du sophisme pour chaque phrase. Six phrases entendues en réunion :",
    "1. « Depuis la mise à jour de jeudi, les tickets ont augmenté : la mise à jour est la cause. »",
    "2. « Si on retarde la migration d'un mois, nous serons piratés. »",
    "3. « Tous les concurrents sont passés au cloud, donc nous devons y passer. »",
    "4. « Deux utilisateurs trouvent le VPN lent : il ne marche pas. »",
    "5. « Ce consultant n'a jamais administré de serveur : ignorez son rapport. »",
    "6. « Soit on interdit l'IA générative, soit on perd toutes nos données. »"
   ],
   "taches": [
    "Phrase 1 : quel sophisme ?",
    "Phrase 2 : quel sophisme ?",
    "Phrase 3 : quel sophisme ?",
    "Phrase 4 : quel sophisme ?",
    "Phrase 5 : quel sophisme ?",
    "Phrase 6 : quel sophisme ?"
   ],
   "types": [
    [
     "Appel à la popularité",
     "Attaque contre la personne",
     "Faux dilemme",
     "Généralisation hâtive",
     "Pente glissante",
     "Post hoc"
    ],
    [
     "Appel à la popularité",
     "Attaque contre la personne",
     "Faux dilemme",
     "Généralisation hâtive",
     "Pente glissante",
     "Post hoc"
    ],
    [
     "Appel à la popularité",
     "Attaque contre la personne",
     "Faux dilemme",
     "Généralisation hâtive",
     "Pente glissante",
     "Post hoc"
    ],
    [
     "Appel à la popularité",
     "Attaque contre la personne",
     "Faux dilemme",
     "Généralisation hâtive",
     "Pente glissante",
     "Post hoc"
    ],
    [
     "Appel à la popularité",
     "Attaque contre la personne",
     "Faux dilemme",
     "Généralisation hâtive",
     "Pente glissante",
     "Post hoc"
    ],
    [
     "Appel à la popularité",
     "Attaque contre la personne",
     "Faux dilemme",
     "Généralisation hâtive",
     "Pente glissante",
     "Post hoc"
    ]
   ],
   "livrable": "",
   "dossier": null,
   "corr": {
    "methode": [
     "Repérer le saut entre les raisons et la conclusion.",
     "Poser la question qui comble le saut."
    ],
    "cols": [
     "Phrase",
     "Sophisme et contre-question"
    ],
    "widths": [
     0.8,
     8.0
    ],
    "rows": [
     [
      "1",
      "Post hoc : Hypothèse testable : si la mise à jour est la cause, les tickets doivent concerner les postes mis à jour"
     ],
     [
      "2",
      "Pente glissante : « Quelle preuve qu'un mois de retard mène à une attaque ? »"
     ],
     [
      "3",
      "Appel à la popularité : « Qu'est-ce qui convient à notre contexte, indépendamment des concurrents ? »"
     ],
     [
      "4",
      "Généralisation hâtive : « Combien d'utilisateurs ont mesuré, avec quelles valeurs ? »"
     ],
     [
      "5",
      "Attaque contre la personne : « Que dit le rapport, et ses données tiennent-elles ? »"
     ],
     [
      "6",
      "Faux dilemme : « Existe-t-il une option encadrée (usages autorisés, données exclues) ? »"
     ]
    ],
    "erreurs": [
     "Nommer le sophisme sans dire pourquoi il est fragile.",
     "Répondre par une attaque : la contre-question doit rester ouverte."
    ]
   }
  },
  "EX18": {
   "id": "EX18",
   "titre": "Interroger un vrai chiffre de fournisseur",
   "mode": "Individuel, ordinateur (une phrase par étudiant)",
   "duree": 20,
   "chap": "Carnet · chapitre 6",
   "situation": [
    "Choisissez une phrase (A à D) différente de celle de vos voisins ; la E est à chercher par vous. A est réelle (EX11b, D4) ; B, C, D sont fictives, dans le style des pages de fournisseurs.",
    "A · « L'authentification multifacteur bloque 99,9 % des attaques de prise de contrôle de compte. » (attribué à Microsoft, 2019)",
    "B · « Notre solution de sauvegarde réduit de 70 % le temps de restauration. »",
    "C · « 9 entreprises sur 10 ont subi une tentative d'hameçonnage cette année. »",
    "D · « Nos clients économisent en moyenne 40 % sur leur facture d'hébergement. »",
    "E · Une affirmation chiffrée trouvée sur le site d'un fournisseur de votre domaine (adresse et date)."
   ],
   "taches": [
    "Choisissez votre phrase (A, B, C ou D), différente de celle de votre voisin de gauche.",
    "Posez à votre phrase les 5 questions (base, mesure, échantillon, auteur, durée) et notez ce que la phrase dit, ou « non indiqué ».",
    "Combien de questions restent sans réponse pour votre phrase ?",
    "Écrivez la phrase honnête que vous mettriez dans votre état de l'art pour votre phrase.",
    "Phrase E : trouvez-en une sur un site de fournisseur, posez les mêmes 5 questions. Combien restent sans réponse ?",
    "Avec Perplexity ou une autre IA (notez laquelle) : demandez-lui les questions à poser à votre phrase. En oublie-t-elle une des cinq (base, mesure, échantillon, auteur, durée) ?"
   ],
   "types": [
    [
     "A",
     "B",
     "C",
     "D"
    ],
    null,
    "num",
    null,
    "num",
    "on"
   ],
   "livrable": "L'affirmation, les cinq questions et la phrase d'état de l'art → Dossier, section 10.",
   "corr": {
    "methode": [
     "Un pourcentage sans base n'est pas un fait.",
     "Chercher la méthode derrière le chiffre.",
     "Citer le chiffre comme une position, avec sa source."
    ],
    "cols": [
     "Phrase",
     "Ce que les 5 questions révèlent"
    ],
    "widths": [
     1.5,
     6.5
    ],
    "rows": [
     [
      "Les 5 questions",
      "Par rapport à quoi (base) ? Mesuré comment ? Sur quel échantillon ? Par qui ? Sur quelle durée ?"
     ],
     [
      "A · 99,9 %",
      "Cas réel (EX11b, D4) : « études » de Microsoft non nommées, attaques automatisées ; le titre généralise. Phrase : « Selon Microsoft (2019, relayé par Slaw.ca), l'authentification multifacteur bloquerait 99,9 % des connexions frauduleuses automatisées ; méthode non publiée. »"
     ],
     [
      "B · −70 %",
      "Base : 70 % de quoi (10 h → 3 h ?) ; mesure, échantillon, durée non indiqués ; auteur = le fournisseur. 4 questions sans réponse. Phrase : « Le fournisseur annonce −70 % de temps de restauration, sans méthode publiée ; à confirmer par notre test. »"
     ],
     [
      "C · 9 sur 10",
      "Échantillon inconnu (combien, lesquelles ?) ; « tentative » non définie ; auteur = un éditeur qui vend une protection ; période vague. Phrase : « Selon l'enquête d'un éditeur (échantillon non précisé), 90 % des entreprises auraient reçu une tentative d'hameçonnage. »"
     ],
     [
      "D · −40 %",
      "Base : quelle facture de départ ? Moyenne de quels clients (les satisfaits seulement : biais du survivant) ? Auteur = le fournisseur. Phrase : « Le fournisseur indique −40 % en moyenne ; clients et méthode non précisés : à recouper. »"
     ],
     [
      "E · votre recherche",
      "Même démarche. Beaucoup de pages commerciales laissent 3 à 5 questions sans réponse : c'est le résultat attendu."
     ],
     [
      "IA · questions",
      "Souvent oui : l'IA oublie l'auteur ou la durée. Gardez les cinq questions du cours comme liste de contrôle."
     ]
    ],
    "erreurs": [
     "Reprendre le chiffre sans le qualifier.",
     "Rejeter la source : on peut la citer comme position du fournisseur.",
     "Généraliser un chiffre sur des attaques automatisées à « toutes les attaques »."
    ]
   }
  },
  "EX19": {
   "id": "EX19",
   "titre": "Construire l'argument de votre équipe",
   "mode": "Équipes",
   "duree": 25,
   "chap": "Carnet · chapitre 6",
   "situation": [
    "Votre équipe a une question (EX1) et des sources notées (EX12). Écrivez votre premier argument avec le modèle de Toulmin.",
    "Exemple (fictif) : Affirmation : « Activons les mises à jour automatiques. » Données : « 3 des 5 postes compromis en 2025 n'étaient pas à jour (journal interne, mars 2026) ; le guide de l'organisme X conseille les correctifs sous 30 jours (réf. 1). » Garantie : un poste à jour est exposé à moins de failles connues. Fondement : bonnes pratiques de gestion des correctifs (réf. 1). Réfutation : sauf si une mise à jour bloque un logiciel métier. Qualificatif : probablement, après test sur un poste pilote."
   ],
   "taches": [
    "Écrivez l'affirmation provisoire (votre recommandation).",
    "Choisissez deux données, chacune avec sa source.",
    "Écrivez la garantie et le fondement.",
    "Cherchez une réfutation et choisissez un qualificatif.",
    "Avec ChatGPT ou une autre IA (notez laquelle) : demandez-lui 2 données possibles pour votre argument. Combien sont retrouvables dans une source réelle ?"
   ],
   "livrable": "Votre fiche de Toulmin dans le carnet. → Dossier, section 9.",
   "corr": {
    "methode": [
     "Les données portent une référence.",
     "La garantie explique le lien.",
     "La réfutation est cherchée, pas subie.",
     "Le qualificatif dit la portée."
    ],
    "cols": [
     "Case",
     "Exemple (sauvegarde de TransLor, fictif)"
    ],
    "widths": [
     1.8,
     7.0
    ],
    "rows": [
     [
      "Affirmation",
      "TransLor devrait ajouter une copie hors site de ses sauvegardes"
     ],
     [
      "Données",
      "Disque unique de 3 ans ; restauration de 9 h lors du test de juin (interne)"
     ],
     [
      "Garantie",
      "Une copie hors site permet de restaurer même si le local est touché, et réduit le temps d'arrêt"
     ],
     [
      "Fondement",
      "Règle 3-2-1 des bonnes pratiques de sauvegarde (à sourcer : guide d'organisme public)"
     ],
     [
      "Réfutation",
      "Sauf si les données sont peu critiques, ou si le débit empêche de restaurer vite"
     ],
     [
      "Qualificatif",
      "Probablement, pour les données d'exploitation ; sous réserve de tester la restauration depuis le cloud"
     ],
     [
      "IA · données proposées",
      "Souvent 0 ou 1 : des chiffres plausibles mais sans source. Une donnée utilisable porte une référence que vous avez ouverte."
     ]
    ],
    "erreurs": [
     "Une donnée sans référence.",
     "Une garantie qui répète l'affirmation.",
     "Pas de réfutation : le jury en trouvera trois."
    ]
   },
   "types": [
    null,
    null,
    null,
    null,
    "num"
   ]
  },
  "EX20": {
   "id": "EX20",
   "titre": "Avocat du diable : l'IA puis l'équipe voisine",
   "mode": "Équipes",
   "duree": 20,
   "chap": "Carnet · chapitre 6",
   "situation": [
    "Votre équipe a sa fiche de Toulmin (EX19). Sans donnée confidentielle, demandez à une IA de jouer l'avocat du diable : « Voici mon argument (affirmation, données, garantie). Donne les 3 objections les plus fortes d'un directeur financier sceptique, sans inventer de chiffres. »",
    "Puis l'équipe voisine ajoute une objection que l'IA n'a pas vue, et vous répondez par un fait, une concession ou une réserve."
   ],
   "taches": [
    "Collez votre argument dans une IA (sans donnée confidentielle) et recopiez ses 3 objections. Notez le nom de l'IA utilisée.",
    "Combien sont pertinentes pour votre cas ?",
    "L'équipe voisine ajoute une objection : laquelle ?",
    "Répondez à deux objections (fait, concession ou réserve)."
   ],
   "types": [
    null,
    "num",
    null,
    null
   ],
   "livrable": "Deux objections et les réponses retenues → Dossier, section 10.",
   "corr": {
    "methode": [
     "Écouter, reformuler, répondre, vérifier.",
     "Fait si on l'a ; concession si l'objection est juste ; réserve si on ne sait pas.",
     "Une IA propose des objections plausibles : c'est à vous de juger leur pertinence."
    ],
    "cols": [
     "Type de réponse",
     "Exemple"
    ],
    "widths": [
     2.2,
     6.6
    ],
    "rows": [
     [
      "Un fait",
      "« Le test de juin donne 9 h de restauration ; le prestataire annonce 3 h. »"
     ],
     [
      "Une concession",
      "« Vous avez raison : le coût mensuel s'ajoute. Je précise la conclusion : rentable si le risque dépasse 5 %. »"
     ],
     [
      "Une réserve",
      "« Je n'ai pas le chiffre du débit : je le vérifie par un test avant la décision. »"
     ],
     [
      "Piège IA",
      "Si l'IA propose un chiffre pour réfuter une objection : le chercher et le sourcer avant de l'utiliser"
     ]
    ],
    "erreurs": [
     "Se justifier longuement.",
     "Nier une objection fondée.",
     "Reprendre tel quel un chiffre proposé par l'IA."
    ]
   }
  },
  "F7": {
   "id": "F7",
   "titre": "Exit ticket · fin du jour 2",
   "mode": "Individuel",
   "duree": 5,
   "chap": "Carnet · tous chapitres",
   "situation": [
    "Dernier point de la journée : quatre phrases dans votre carnet."
   ],
   "taches": [
    "Mon argument principal est : …",
    "Ma réfutation la plus forte est : …",
    "Ce qu'il me manque pour conclure : …",
    "Mon premier pas demain matin : …"
   ],
   "livrable": ""
  },
  "EX21": {
   "id": "EX21",
   "titre": "Comparer trois solutions avec une matrice pondérée",
   "mode": "Binômes, calculatrice ou tableur",
   "duree": 30,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "TransLor choisit sa sauvegarde. Notes de 1 à 5 (5 = meilleur) ; poids = importance du critère (total 100 %).",
    "Total = somme de note × poids. Exemple, disque local : 5×0,30 + 2×0,30 + 2×0,25 + 5×0,15 = 3,35.",
    "Sensibilité : même calcul avec coût 50 %, sécurité 20 %, restauration 20 %, simplicité 10 %."
   ],
   "taches": [
    "Calculez le total du Cloud seul avec les poids de départ (3×0,30 + 4×0,30 + 4×0,25 + 4×0,15).",
    "Calculez le total de l'Hybride avec les poids de départ.",
    "Quelle solution est première avec les poids de départ ?",
    "Avec les poids 50 / 20 / 20 / 10, calculez le total du disque local.",
    "Avec ces nouveaux poids, le classement change-t-il ? (calculez aussi le cloud et l'hybride)",
    "Écrivez la conclusion en 2 phrases, avec un qualificatif (« probablement ») et une réserve.",
    "Avec Gemini ou une autre IA (notez laquelle) : demandez-lui de calculer les trois totaux sans tableur. Trouve-t-elle exactement 3,35, 3,70 et 3,80 ?"
   ],
   "livrable": "Votre tableur et la conclusion. → Dossier, section 11.",
   "corr": {
    "methode": [
     "Note = somme (score × poids).",
     "Refaire avec d'autres poids pour voir si le classement tient.",
     "Conclure avec une réserve : les scores sont à sourcer."
    ],
    "cols": [
     "Solution",
     "Poids de départ (30/30/25/15)",
     "Poids coût 50 % (50/20/20/10)"
    ],
    "widths": [
     1.5,
     3.4,
     3.6
    ],
    "rows": [
     [
      "Disque local",
      "5×0,30 + 2×0,30 + 2×0,25 + 5×0,15 = 1,5 + 0,6 + 0,5 + 0,75 = 3,35",
      "5×0,5 + 2×0,2 + 2×0,2 + 5×0,1 = 2,5 + 0,4 + 0,4 + 0,5 = 3,80"
     ],
     [
      "Cloud seul",
      "3×0,30 + 4×0,30 + 4×0,25 + 4×0,15 = 0,9 + 1,2 + 1,0 + 0,6 = 3,70",
      "3×0,5 + 4×0,2 + 4×0,2 + 4×0,1 = 1,5 + 0,8 + 0,8 + 0,4 = 3,50"
     ],
     [
      "Hybride",
      "2×0,30 + 5×0,30 + 5×0,25 + 3×0,15 = 0,6 + 1,5 + 1,25 + 0,45 = 3,80",
      "2×0,5 + 5×0,2 + 5×0,2 + 3×0,1 = 1,0 + 1,0 + 1,0 + 0,3 = 3,30"
     ],
     [
      "Classement",
      "1. Hybride (3,80) · 2. Cloud (3,70) · 3. Disque local (3,35)",
      "1. Disque local (3,80) · 2. Cloud (3,50) · 3. Hybride (3,30) : le classement s'inverse"
     ],
     [
      "Dans un tableur",
      "Une ligne par solution (notes en B à E), les poids en ligne 6 : =SOMMEPROD(B2:E2;$B$6:$E$6)",
      ""
     ],
     [
      "IA · calcul sans tableur",
      "Les modèles de langage se trompent parfois sur les calculs enchaînés : refaites le calcul vous-même. L'IA peut en revanche proposer la formule.",
      ""
     ]
    ],
    "erreurs": [
     "Présenter un classement sans test de sensibilité : il peut s'inverser.",
     "Oublier que les scores sont des données à sourcer.",
     "Conclure sans réserve."
    ],
    "modele": "« Avec les pondérations de départ, la solution hybride paraît la plus adaptée (3,80 contre 3,70 et 3,35), mais l'écart avec le cloud est faible. Si le coût devient prioritaire (50 %), le classement s'inverse : disque local 3,80, cloud 3,50, hybride 3,30. Avant de décider, il faut sourcer les scores (coûts réels, tests de restauration) ; ces notes sont fictives. »",
    "retenir": "Un état de l'art honnête : critères explicites, test de sensibilité, réserve, sources à citer."
   },
   "types": [
    "num",
    "num",
    [
     "Disque local",
     "Cloud seul",
     "Hybride"
    ],
    "num",
    "on",
    null,
    "on"
   ],
   "tableau": {
    "header": [
     "Solution",
     "Coût",
     "Sécurité",
     "Restauration",
     "Simplicité"
    ],
    "widths": [
     2.2,
     1,
     1.2,
     1.5,
     1.4
    ],
    "rows": [
     [
      "Disque local",
      "5",
      "2",
      "2",
      "5"
     ],
     [
      "Cloud seul",
      "3",
      "4",
      "4",
      "4"
     ],
     [
      "Hybride",
      "2",
      "5",
      "5",
      "3"
     ],
     [
      "Poids de départ",
      "30 %",
      "30 %",
      "25 %",
      "15 %"
     ]
    ]
   }
  },
  "EX22": {
   "id": "EX22",
   "titre": "Votre matrice de comparaison",
   "mode": "Équipes, tableur",
   "duree": 40,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "Votre équipe construit sa propre matrice : trois solutions, quatre critères (EX1), des scores sourcés."
   ],
   "taches": [
    "Choisissez 3 solutions et 4 critères pondérés (total 100 %), selon les priorités de la directrice.",
    "Remplissez les scores en citant la source (référence Zotero) pour chacun.",
    "Calculez avec =SOMMEPROD et classez.",
    "Test de sensibilité sur le critère le plus discutable : le classement change-t-il ?",
    "Avec Copilot ou une autre IA (notez laquelle) : demandez-lui 3 critères qui manquent à votre matrice. En gardez-vous un, et pourquoi ?"
   ],
   "livrable": "Votre matrice avec sources, le test de sensibilité et la conclusion. → Dossier, section 11.",
   "corr": {
    "methode": [
     "Chaque score a une source ou est signalé « estimation ».",
     "Poids justifiés.",
     "Test de sensibilité sur le point faible."
    ],
    "cols": [
     "Critère de qualité",
     "Ce qui vaut le maximum"
    ],
    "widths": [
     2.6,
     6.2
    ],
    "rows": [
     [
      "Critères",
      "Comparables, mesurables, utiles à la décision"
     ],
     [
      "Poids",
      "Justifiés par un besoin, somme égale à 100 %"
     ],
     [
      "Scores",
      "Sourcés ; les estimations sont signalées"
     ],
     [
      "Sensibilité",
      "Au moins un autre jeu de poids testé, résultat commenté"
     ],
     [
      "Conclusion",
      "Recommandation avec qualificatif et réserve"
     ],
     [
      "IA · critères proposés",
      "Gardez un critère s'il est mesurable, comparable et sourcé (voir « Choisir des critères mesurables »). Une IA propose souvent des critères flous (« innovation »)."
     ]
    ],
    "erreurs": [
     "Des scores sans source.",
     "Des critères qui se recouvrent (double comptage).",
     "Un classement présenté comme une vérité."
    ]
   },
   "types": [
    null,
    null,
    null,
    "on",
    null
   ]
  },
  "EX23": {
   "id": "EX23",
   "titre": "Plan de l'état de l'art et résumé d'ouverture",
   "mode": "Équipes",
   "duree": 20,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "Votre état de l'art tient en deux pages. Avant d'écrire, il faut un plan et un résumé d'ouverture de trois lignes (en journalisme on dit le chapô) : la question, la méthode et la conclusion, pour que le lecteur ait la réponse tout de suite."
   ],
   "taches": [
    "Écrivez le plan : chaque partie en une ligne, avec sa longueur (en %).",
    "Écrivez le résumé d'ouverture : question, méthode, conclusion.",
    "Relisez : le lecteur a-t-il la réponse dans le résumé d'ouverture ?",
    "Avec Le Chat (Mistral) ou une autre IA (notez laquelle) : demandez-lui quelle décision elle comprend de votre résumé. Correspond-elle à votre conclusion ?"
   ],
   "livrable": "Le plan et le résumé d'ouverture de votre état de l'art. → Dossier, section 12.",
   "corr": {
    "methode": [
     "Le plan suit la démarche.",
     "Le résumé d'ouverture donne la conclusion d'abord."
    ],
    "cols": [
     "Partie",
     "Contenu",
     "Longueur"
    ],
    "widths": [
     2.6,
     5.0,
     1.2
    ],
    "rows": [
     [
      "1. Question",
      "Contexte et décision à éclairer",
      "10 %"
     ],
     [
      "2. Méthode de recherche",
      "Requêtes, bases, période, sources retenues et écartées",
      "15 %"
     ],
     [
      "3. Panorama",
      "Les solutions, chacune avec ses sources",
      "25 %"
     ],
     [
      "4. Comparaison",
      "Matrice, test de sensibilité",
      "25 %"
     ],
     [
      "5. Discussion et limites",
      "Réfutations, ce qu'on ne sait pas",
      "15 %"
     ],
     [
      "6. Conclusion",
      "Recommandation avec qualificatif et réserve",
      "10 %"
     ],
     [
      "Références",
      "Hors pages",
      ""
     ]
    ],
    "erreurs": [
     "Un panorama sans comparaison : on liste sans conclure.",
     "Une méthode absente : le lecteur ne peut pas refaire la recherche.",
     "Un résumé d'ouverture qui annonce le plan au lieu de la conclusion."
    ],
    "modele": [
     "Résumé d'ouverture (fictif) : « Pour décider si TransLor doit ajouter une copie hors site à ses sauvegardes, nous avons comparé trois solutions à partir de neuf sources évaluées. L'option hybride est la plus adaptée sous les pondérations de départ, mais le classement s'inverse si le coût devient prioritaire. Recommandation : tester la restauration depuis le cloud avant de décider. »"
    ],
    "retenir": "Un résumé d'ouverture donne la réponse : question, méthode, conclusion et réserve.",
    "modele_titre": "Résumé d'ouverture (modèle)"
   },
   "types": [
    null,
    null,
    "on",
    "on"
   ]
  },
  "EX24": {
   "id": "EX24",
   "titre": "Rédiger l'état de l'art (2 pages)",
   "mode": "Équipes, document partagé",
   "duree": 70,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "Rédigez l'état de l'art de votre équipe en deux pages, avec le plan (EX23), la matrice (EX22) et les sources notées (EX12).",
    "Chaque affirmation de fait porte une référence ; la bibliographie vient de Zotero."
   ],
   "taches": [
    "Répartissez les parties dans l'équipe.",
    "Rédigez en pyramide inversée, avec au moins 6 sources citées.",
    "Générez la bibliographie avec Zotero.",
    "Relisez avec la liste (question, méthode, sources, comparaison, réserve).",
    "Si vous avez utilisé une IA (laquelle ? notez-la) (relecture, reformulation), écrivez la phrase de déclaration à ajouter en fin de document : outil, usage, vérification."
   ],
   "livrable": "L'état de l'art de 2 pages dans un document partagé (lien) avec sa bibliographie. → Dossier, section 13.",
   "corr": {
    "methode": [
     "Plan d'abord, puis rédaction par partie.",
     "Une affirmation de fait = une référence.",
     "Relire avec la grille de notation."
    ],
    "cols": [
     "Critère",
     "Points",
     "Ce qui vaut le maximum"
    ],
    "widths": [
     2.4,
     0.9,
     5.5
    ],
    "rows": [
     [
      "Question et contexte",
      "2",
      "Décision claire, critères explicites"
     ],
     [
      "Méthode de recherche",
      "3",
      "Requêtes, bases, dates, sources écartées : la recherche peut être refaite"
     ],
     [
      "Qualité des sources",
      "4",
      "Sources variées, notées, avec au moins 3 fiables"
     ],
     [
      "Comparaison",
      "4",
      "Matrice, test de sensibilité, résultats commentés"
     ],
     [
      "Argumentation",
      "4",
      "Toulmin, réfutation, qualificatif et réserve"
     ],
     [
      "Clarté et références",
      "3",
      "Pyramide inversée, bibliographie complète (total 20)"
     ],
     [
      "IA · déclaration d'usage",
      "",
      "Exemple : « Une IA générative a servi à relire l'orthographe et à proposer des reformulations ; chaque source a été ouverte et lue par l'équipe. » L'IA n'est jamais citée comme source."
     ]
    ],
    "erreurs": [
     "Lister des sources sans comparer.",
     "Citer sans référence précise.",
     "Une conclusion sans réserve."
    ],
    "modele_titre": "Exemple d'extrait (fictif) : méthode de recherche",
    "modele": "« Nous avons interrogé Google Scholar (requête : « sauvegarde hors site » OR « off-site backup », période 2021-2026) et les publications de deux organismes publics. Sur 60 résultats lus, 9 ont été retenus après évaluation avec une grille en six questions (note de 9 ou plus sur 12). Les brochures commerciales sont citées comme positions d'éditeurs. »",
    "retenir": "Une méthode de recherche qu'un lecteur peut refaire vaut des points : requêtes, bases, dates, critères."
   },
   "types": [
    null,
    null,
    null,
    null,
    null
   ]
  },
  "EX25": {
   "id": "EX25",
   "titre": "Relecture croisée avec la grille",
   "mode": "Équipes croisées",
   "duree": 20,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "Échangez votre état de l'art avec une autre équipe. Relisez avec la grille de notation (EX24) pendant 10 minutes, puis donnez un feedback SBI."
   ],
   "taches": [
    "Relisez le document de l'autre équipe avec la grille : deux points forts, deux améliorations, chacun avec un fait.",
    "Formulez un feedback en SBI : situation, comportement, impact.",
    "Écoutez le feedback reçu sans vous justifier ; décidez deux corrections.",
    "Avec ChatGPT ou une autre IA (notez laquelle ; document de l'autre équipe, si elle l'accepte) : demandez-lui une relecture avec la grille. Combien de ses remarques utiles n'aviez-vous pas relevées ?"
   ],
   "livrable": "Deux points forts, deux améliorations, deux corrections décidées. → Dossier, section 14.",
   "corr": {
    "methode": [
     "Faits, pas jugements.",
     "SBI : situation, comportement, impact.",
     "Recevoir : écouter, reformuler, décider."
    ],
    "cols": [
     "Feedback faible",
     "Feedback SBI (exemple)"
    ],
    "widths": [
     3.0,
     5.8
    ],
    "rows": [
     [
      "« Votre méthode est floue. »",
      "« Dans la partie 2 (S), les requêtes ne sont pas données (B) : un lecteur ne peut pas refaire la recherche (I). »"
     ],
     [
      "« Bien écrit. »",
      "« Dans la conclusion (S), vous donnez une réserve précise (B) : le lecteur sait jusqu'où va votre recommandation (I). »"
     ],
     [
      "IA · relecture par une IA",
      "Souvent 1 ou 2 (coquilles, redites). L'IA ne sait pas si une source existe : la vérification des références reste humaine."
     ]
    ],
    "erreurs": [
     "Juger la personne au lieu de décrire le texte.",
     "Se justifier au lieu de noter la correction."
    ]
   },
   "types": [
    null,
    null,
    null,
    "num"
   ]
  },
  "EX26": {
   "id": "EX26",
   "titre": "Préparer le pitch de 5 minutes",
   "mode": "Équipes",
   "duree": 20,
   "chap": "Carnet · chapitre 8",
   "situation": [
    "Vous défendez votre état de l'art en 5 minutes devant un jury composé de la directrice (non technique) et de ses collaborateurs. Puis 4 minutes de questions."
   ],
   "taches": [
    "Écrivez le message clé en une phrase.",
    "Construisez le plan : accroche, problème, solution, preuve, appel à décision.",
    "Préparez les réponses aux 3 objections les plus probables.",
    "Chronométrez-vous une fois.",
    "Avec Claude ou une autre IA (notez laquelle) : demandez-lui de jouer la directrice non technique et de poser 3 questions sur votre pitch. Notez celle qui vous met le plus en difficulté."
   ],
   "livrable": "Votre message clé, votre plan et les trois objections préparées. → Dossier, section 15.",
   "corr": {
    "methode": [
     "Un message clé : une phrase que la directrice peut répéter.",
     "Un chiffre, une analogie, une demande.",
     "S'entraîner à voix haute, chronomètre en main."
    ],
    "cols": [
     "Étape",
     "Exemple (fictif)"
    ],
    "widths": [
     2.0,
     6.8
    ],
    "rows": [
     [
      "Message clé",
      "« Une copie hors site coûte 1 800 € par an et évite une perte attendue de 4 000 €. »"
     ],
     [
      "Accroche",
      "« En juin, restaurer la sauvegarde a pris 9 heures. »"
     ],
     [
      "Problème",
      "« Un seul disque de 3 ans porte toute notre sauvegarde. »"
     ],
     [
      "Solution",
      "« Ajouter une copie hors site, avec un test de restauration. »"
     ],
     [
      "Preuve",
      "« 9 h contre 3 h ; 10 % de risque annuel (estimation). »"
     ],
     [
      "Appel",
      "« Validez 1 800 € par an avant la fin du mois. »"
     ],
     [
      "IA · jury simulé",
      "Gardez la question la plus difficile et préparez une réponse en trois temps : reformuler, fait, réserve."
     ]
    ],
    "erreurs": [
     "Tout dire : 5 minutes = un message.",
     "Lire ses notes.",
     "Oublier l'appel à décision."
    ]
   },
   "types": [
    null,
    null,
    null,
    null,
    null
   ]
  },
  "EX27": {
   "id": "EX27",
   "titre": "Pitch et défense devant le jury",
   "mode": "Équipes, jury",
   "duree": 65,
   "chap": "Carnet · chapitre 8",
   "situation": [
    "Chaque équipe présente 5 minutes, puis répond aux questions du jury 4 minutes. Les autres équipes observent et notent avec la grille (sur 20)."
   ],
   "taches": [
    "Présentez votre état de l'art (5 minutes chronométrées).",
    "Répondez aux questions : reformuler, puis fait, concession ou réserve.",
    "Observateurs : notez avec la grille et écrivez un feedback SBI."
   ],
   "livrable": "La grille de notation de chaque équipe et un feedback SBI. → Dossier, section 15.",
   "corr": {
    "methode": [
     "Jury : un barème, des questions préparées, un feedback SBI.",
     "Équipe : message clé, preuve, réserve."
    ],
    "cols": [
     "Critère",
     "Points",
     "Ce qui vaut le maximum"
    ],
    "widths": [
     2.4,
     0.9,
     5.5
    ],
    "rows": [
     [
      "Message clé",
      "3",
      "Une phrase claire, répétée à la fin"
     ],
     [
      "Structure",
      "3",
      "Accroche, problème, solution, preuve, appel enchaînés"
     ],
     [
      "Clarté et vulgarisation",
      "3",
      "Aucun jargon non expliqué ; une analogie"
     ],
     [
      "Preuves et sources",
      "4",
      "Chiffres sourcés, sources citées oralement"
     ],
     [
      "Réponse aux questions",
      "4",
      "Reformule, répond par un fait, une concession ou une réserve"
     ],
     [
      "Voix et posture",
      "3",
      "Débit calme, regard, pas de lecture (total 20)"
     ]
    ],
    "erreurs": [
     "Dépasser le temps.",
     "Répondre sans reformuler la question.",
     "Défendre sa conclusion sans réserve."
    ],
    "modele_titre": "Questions types du jury",
    "modele": [
     "Pourquoi avoir retenu ces trois solutions et pas d'autres ?",
     "Comment avez-vous choisi les poids de vos critères ?",
     "Que se passe-t-il si votre chiffre principal est faux ?",
     "Quelle source est la plus fragile de votre état de l'art ?",
     "Quelle est votre réserve principale ?",
     "Que feriez-vous avec un mois de plus ?"
    ],
    "retenir": "Défendre, c'est dire ce que l'on sait, ce que l'on ne sait pas, et comment on le vérifiera."
   },
   "types": [
    null,
    null,
    null
   ]
  },
  "EX28": {
   "id": "EX28",
   "titre": "Fiche : une vulnérabilité clé de mon organisation",
   "mode": "Individuel",
   "duree": 20,
   "chap": "Carnet · chapitre 9",
   "situation": [
    "Projet tutoré : dans l'organisation où vous êtes en apprentissage, repérez une vulnérabilité clé (pas seulement technique) : dépendance à une personne, information perdue, décision sans preuve, outil mal maîtrisé, message mal compris."
   ],
   "taches": [
    "Décrivez la vulnérabilité : qui, quoi, quand, impact.",
    "Donnez une preuve : donnée, observation ou source.",
    "Construisez l'argument en Toulmin condensé.",
    "Rédigez une recommandation avec qualificatif et réserve, et dites comment la vérifier."
   ],
   "livrable": "Une fiche d'une page, à rendre au tuteur. → Dossier, section 16.",
   "corr": {
    "methode": [
     "Un fait observable, pas un jugement.",
     "Une preuve, même simple.",
     "Une recommandation datée et vérifiable."
    ],
    "cols": [
     "Case",
     "Exemple (TransLor, fictif)"
    ],
    "widths": [
     2.0,
     6.8
    ],
    "rows": [
     [
      "Vulnérabilité",
      "Une seule personne (l'administrateur) sait restaurer le logiciel de tournées"
     ],
     [
      "Qui, quoi, quand, impact",
      "Administrateur ; restauration ; en cas d'absence ; 60 conducteurs bloqués"
     ],
     [
      "Preuve",
      "Test de juin : restauration faite par une seule personne, 9 h ; aucune procédure écrite"
     ],
     [
      "Argument",
      "Affirmation : écrire la procédure et former un suppléant. Garantie : une procédure testée réduit la dépendance."
     ],
     [
      "Recommandation",
      "Probablement : procédure écrite et test par le suppléant sous 60 jours ; réserve : charge de travail à confirmer"
     ],
     [
      "Vérification",
      "Test chronométré avec le suppléant ; point avec le tuteur à J+60"
     ]
    ],
    "erreurs": [
     "Décrire un problème sans preuve.",
     "Une vulnérabilité trop large (« la cybersécurité »).",
     "Aucune manière de vérifier la recommandation."
    ]
   },
   "types": [
    null,
    null,
    null,
    null
   ]
  },
  "EX29": {
   "id": "EX29",
   "titre": "Entraînement : questions de type examen",
   "mode": "Individuel",
   "duree": 15,
   "chap": "Carnet · chapitre 10",
   "situation": [
    "Format d'examen écrit (inventé : à adapter à votre format réel). Cinq questions courtes."
   ],
   "taches": [
    "Q1. Complétez la carte de Toulmin de : « Il faut passer au cloud : tous nos concurrents l'ont fait. »",
    "Q2. Notez la source « blog anonyme, 2022, chiffres sans source » avec la grille en six questions.",
    "Q3. Quel sophisme dans « Soit on migre ce mois-ci, soit on perd nos clients » ?",
    "Q4. Réécrivez avec un qualificatif et une réserve : « Les passkeys sont meilleurs que les mots de passe. »"
   ],
   "livrable": "Vos réponses, comparées à la correction.",
   "corr": {
    "methode": [
     "Répondre à la question posée, avec la méthode du cours.",
     "Citer un critère ou un terme précis."
    ],
    "cols": [
     "Question",
     "Réponse attendue"
    ],
    "widths": [
     1.0,
     7.8
    ],
    "rows": [
     [
      "Q1",
      "Affirmation : passer au cloud. Données : « tous nos concurrents l'ont fait » (popularité, pas une donnée). Garantie manquante. Réfutation et qualificatif manquants."
     ],
     [
      "Q2",
      "Qui 0, Quand 1, Pourquoi 0 ou 1, Sur quoi 0, Recoupé 0, Reproductible 0 : total 1 à 2 sur 12 : écarter"
     ],
     [
      "Q3",
      "Faux dilemme : d'autres options existent (migration progressive, test sur un service)"
     ],
     [
      "Q4",
      "« sauvegarde hors site » OR « off-site backup » OR « offsite backup », avec le filtre de dates"
     ],
     [
      "Q5",
      "« Les passkeys sont probablement plus sûrs que les mots de passe pour l'hameçonnage ; réserve : compatibilité et coût de déploiement à chiffrer. »"
     ]
    ],
    "erreurs": [
     "Répondre hors sujet : relire la consigne.",
     "Oublier la réserve dans une conclusion.",
     "Écrire une requête sans synonymes."
    ]
   },
   "types": [
    null,
    null,
    [
     "Appel à la popularité",
     "Attaque contre la personne",
     "Pente glissante",
     "Faux dilemme",
     "Généralisation hâtive",
     "Post hoc"
    ],
    null
   ]
  },
  "EX2": {
   "id": "EX2",
   "titre": "Diagnostiquer son style de communication",
   "mode": "Individuel",
   "duree": 10,
   "chap": "Carnet · chapitre 2",
   "situation": [
    "Notez chaque affirmation de 1 (pas du tout d'accord) à 4 (tout à fait d'accord).",
    "A. Direct / Nuancé",
    "1. Je dis franchement ce que je pense, même si cela peut déplaire.",
    "2. En réunion, je donne mon avis en premier plutôt que d'attendre.",
    "3. Je préfère une réponse courte et claire à un long développement.",
    "4. Quand je ne suis pas d'accord, je le dis tout de suite.",
    "B. Tâche / Relation",
    "5. Avant de parler d'un problème, je prends des nouvelles de la personne.",
    "6. Je repère vite l'ambiance et l'état d'esprit d'une équipe.",
    "7. Je préfère régler un désaccord à l'oral plutôt que par document.",
    "8. J'explique le contexte, pas seulement la consigne."
   ],
   "taches": [
    "Additionnez vos points A (affirmations 1 à 4) et B (5 à 8) : le calculateur le fait pour vous.",
    "Lisez votre profil dans le tableau de la correction.",
    "Comparez avec votre voisin : sur quelle situation vos styles se heurteraient-ils ?"
   ],
   "livrable": "Votre profil et un point d'attention, à noter dans le carnet (chapitre 1).",
   "corr": {
    "methode": [
     "Calculer A (4 à 16) et B (4 à 16).",
     "Direct si A ≥ 11, sinon Nuancé ; Relation si B ≥ 11, sinon Tâche.",
     "Lire la ligne du profil : force, risque, conseil.",
     "Se rappeler : aucun profil n'est meilleur, le piège est de parler à tout le monde comme à soi."
    ],
    "cols": [
     "Profil",
     "Force",
     "Risque en entreprise",
     "Conseil"
    ],
    "widths": [
     1.4,
     2,
     2.6,
     2.6
    ],
    "rows": [
     [
      "Décideur\nDirect + Tâche",
      "Clarté, rapidité",
      "Paraît brusque, oublie le contexte",
      "Ajouter une phrase de contexte"
     ],
     [
      "Animateur\nDirect + Relation",
      "Énergie, lien",
      "Dilue le message dans l'ambiance",
      "Finir par une demande précise"
     ],
     [
      "Analyste\nNuancé + Tâche",
      "Rigueur, précision",
      "Trop long, décision retardée",
      "Donner la conclusion d'abord"
     ],
     [
      "Facilitateur\nNuancé + Relation",
      "Écoute, consensus",
      "Évite le désaccord nécessaire",
      "Oser dire non avec une alternative"
     ]
    ],
    "erreurs": [
     "Se noter selon l'image que l'on voudrait donner plutôt que selon ses réactions réelles.",
     "Croire que le test mesure la personnalité : c'est un modèle pédagogique simplifié, pas un outil de recrutement.",
     "Sur TransLor : Marc (Décideur) écrit court ; Paul (Facilitateur) peut lire ses messages comme brusques. Le problème est l'écart, pas le style."
    ],
    "matrix": {
     "cols": [
      [
       "Nuancé",
       "A de 4 à 10"
      ],
      [
       "Direct",
       "A de 11 à 16"
      ]
     ],
     "rows": [
      [
       "Tâche",
       "B de 4 à 10"
      ],
      [
       "Relation",
       "B de 11 à 16"
      ]
     ],
     "cells": [
      [
       [
        "Analyste",
        "3B6FD8",
        "rigueur, précision",
        "trop long, décision retardée",
        "donner la conclusion d'abord"
       ],
       [
        "Décideur",
        "E4572E",
        "clarté, rapidité",
        "paraît brusque",
        "ajouter une phrase de contexte"
       ]
      ],
      [
       [
        "Facilitateur",
        "2E9E6B",
        "écoute, consensus",
        "évite le désaccord nécessaire",
        "oser dire non avec une alternative"
       ],
       [
        "Animateur",
        "E9A400",
        "énergie, lien",
        "dilue le message",
        "finir par une demande précise"
       ]
      ]
     ]
    }
   },
   "types": [
    null,
    null,
    null
   ]
  },
  "F1": {
   "id": "F1",
   "titre": "Flash · Vrai ou faux sur la communication (téléphone)",
   "mode": "Solo puis voisin",
   "duree": 5,
   "chap": "Carnet · chapitre 2",
   "situation": [
    "Pour chaque affirmation, appuyez sur VRAI ou FAUX sur votre téléphone, puis la correction."
   ],
   "taches": [
    "93 % du message passe par le non-verbal.",
    "Un silence peut être une réponse.",
    "Le récepteur décode toujours le message comme l'émetteur l'a encodé.",
    "Le feedback ferme la boucle de communication.",
    "Pour un désaccord chargé d'émotion, un e-mail est plus sûr qu'un appel."
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Séparer ce qui est établi de ce qui est un mythe.",
     "Penser à un exemple concret."
    ],
    "rows": [
     [
      "1",
      "Faux : les 7 % / 38 % / 55 % de Mehrabian portent sur des messages de sentiments incohérents en laboratoire, pas sur toute communication."
     ],
     [
      "2",
      "Vrai : le silence est un signal (accord, désaccord, réflexion) à vérifier par une question."
     ],
     [
      "3",
      "Faux : le décodage dépend du cadre de référence ; d'où le feedback."
     ],
     [
      "4",
      "Vrai : sans retour, l'émetteur ignore ce qui a été compris."
     ],
     [
      "5",
      "Faux : l'écrit supprime le ton et amplifie les malentendus ; on appelle d'abord, on confirme ensuite par écrit."
     ]
    ],
    "erreurs": [
     "Retenir « 93 % non-verbal » : chiffre souvent cité hors contexte."
    ],
    "widths": [
     0.7,
     8.1
    ],
    "cols": [
     "N°",
     "Réponse"
    ]
   },
   "types": [
    "vf",
    "vf",
    "vf",
    "vf",
    "vf"
   ]
  },
  "EX3": {
   "id": "EX3",
   "titre": "Reformuler : écho, clarification, synthèse, reflet (avec test IA)",
   "mode": "Binôme, ordinateur",
   "duree": 15,
   "chap": "Carnet · chapitre 2",
   "situation": [
    "Trois phrases entendues chez TransLor. Pour chacune, écrivez une reformulation de 15 mots maximum et nommez son type (écho, clarification, synthèse, reflet).",
    "1. Marc : « Je n'en peux plus de ces tableaux Excel. »",
    "2. Léa : « La tablette plante dès que j'arrive à l'entrepôt. »",
    "3. La directrice : « Il me faut une solution pour le dernier kilomètre avant l'été, sans exploser le budget. »"
   ],
   "taches": [
    "Écrivez vos trois reformulations et nommez le type de chacune.",
    "Retirez tout conseil ou jugement caché.",
    "Test IA (ordinateur) : collez vos reformulations avec la consigne « Repère tout conseil ou jugement caché » ; combien de remarques retenez-vous ? Notez le nom de l'IA utilisée."
   ],
   "livrable": "Six reformulations, chacune avec son type.",
   "corr": {
    "methode": [
     "Repérer le fait et l'émotion dans la phrase.",
     "Choisir le type : écho, clarification, synthèse ou reflet.",
     "Redire avec ses mots, sans conseil ni jugement.",
     "Terminer par une invitation à confirmer ou à préciser."
    ],
    "cols": [
     "Phrase",
     "Type conseillé",
     "Exemple de reformulation"
    ],
    "widths": [
     0.8,
     1.5,
     4.6
    ],
    "rows": [
     [
      "1",
      "Reflet",
      "« Cette saisie manuelle vous épuise ? »"
     ],
     [
      "2",
      "Écho + clarification",
      "« Elle plante à l'arrivée à l'entrepôt : à chaque fois ? »"
     ],
     [
      "3",
      "Synthèse",
      "« Deux contraintes : avant l'été et budget maîtrisé. Laquelle prime si on doit choisir ? »"
     ],
     [
      "Test IA",
      "Elle repère souvent un conseil caché (« vous devriez… »). Elle peut aussi se tromper ou juger à tort : vous décidez, phrase par phrase.",
      "Ne jamais coller de vrais échanges avec des personnes identifiables"
     ]
    ],
    "erreurs": [
     "Répéter mot à mot : cela ressemble à un écho de perroquet et n'apporte rien.",
     "Glisser un conseil : « Vous devriez demander une tablette neuve ».",
     "Reformuler en changeant le sens : la phrase 5 est un jugement de Paul, pas un fait ; la clarification demande les faits."
    ]
   },
   "types": [
    null,
    null,
    "num"
   ]
  },
  "EX4": {
   "id": "EX4",
   "titre": "Recueillir un besoin : l'entretien avec Marc",
   "mode": "Binôme (enquêteur / Marc)",
   "duree": 20,
   "chap": "Carnet · chapitre 2",
   "situation": [
    "Marc, gestionnaire d'exploitation, vous dit : « Je voudrais un export Excel des tournées du jour. »",
    "Vous êtes l'ingénieur chargé d'étudier la demande. Votre binôme joue Marc (sa fiche de rôle est sur l'application, à ne pas montrer à l'enquêteur).",
    "Vous avez 8 minutes. Ne proposez aucune solution avant d'avoir compris le besoin.",
    "Exemple de 6 questions pour une autre demande (« un tableau de bord ») : Qui le lira ? Quelles décisions en dépendent ? À quelle fréquence ? Où se trouvent les données ? Combien de temps y consacrez-vous aujourd'hui ? Comment saurez-vous qu'il est réussi ?"
   ],
   "taches": [
    "Préparez 6 questions avec QQOQCCP, en entonnoir (large, précis, confirmation).",
    "Menez l'entretien (8 minutes) sans proposer de solution.",
    "Reformulez le besoin réel en une phrase.",
    "Chiffrez le coût annuel actuel, en euros (45 min par jour et par gestionnaire, 225 jours, 15 gestionnaires, 32 € de l'heure).",
    "Après l'entretien, demandez à une IA 6 questions QQOQCCP pour la demande de Marc. Combien de ses questions auraient apporté une information que vous n'avez pas obtenue ? Notez le nom de l'IA utilisée."
   ],
   "livrable": "Besoin reformulé, coût annuel, critère de réussite. → Dossier, section 2.",
   "fiche_role": "FICHE DE MARC (secrète). Demande affichée : un export Excel des tournées. Besoin réel : savoir avant 7 h quelles tournées risquent un retard pour prévenir les clients. À dévoiler seulement si l'enquêteur pose des questions ouvertes : 20 tournées par jour, 12 % dépassent le créneau, il recopie les heures dans Excel 45 minutes par jour, 3 clients (60 % du CA) pénalisent les retards, budget maximal 2 k€, critère de réussite : une alerte au moins 30 minutes avant le créneau. Si on vous propose une solution trop vite, répondez « oui, peut-être ».",
   "corr": {
    "methode": [
     "Questions larges (« Racontez-moi une matinée type »), puis précises (fréquence, durée, impact), puis une question de confirmation : voir les 6 questions attendues.",
     "Demander à quoi servira l'export (le besoin derrière la solution).",
     "Reformuler en une phrase besoin + critère.",
     "Chiffrer l'impact avant de proposer."
    ],
    "rows": [
     [
      "Les 6 questions attendues (QQOQCCP, en entonnoir)",
      "1. Racontez-moi une matinée type. (large)  2. Qui utilise ces tournées, et qui décide ensuite ? (qui)  3. À quelle fréquence et à quelle heure cherchez-vous ces données ? (quand)  4. Où se trouvent ces données aujourd'hui ? (où)  5. Combien de temps y consacrez-vous, et que coûte un retard ? (combien)  6. À quoi servira l'export ? Comment saurez-vous que c'est réussi ? (pourquoi, confirmation)"
     ],
     [
      "Ce que Marc répond (fiche de rôle)",
      "Il ressaisit chaque matin les tournées dans Excel pour repérer celles qui risquent d'être en retard (45 minutes par jour) et prévenir les clients avant 7 h."
     ],
     [
      "Besoin réel",
      "Voir avant 7 h les tournées à risque de retard, pour prévenir les clients à temps"
     ],
     [
      "Fréquence du problème",
      "20 tournées × 12 % = 2,4 tournées en retard par jour ; 2,4 × 225 = 540 par an"
     ],
     [
      "Coût actuel de la ressaisie",
      "0,75 h × 225 j × 32 € = 5 400 € par gestionnaire ; × 15 = 81 000 € par an"
     ],
     [
      "Critère de réussite",
      "Alerte au moins 30 minutes avant le créneau, budget ≤ 2 k€"
     ],
     [
      "Phrase de reformulation",
      "« Vous voulez être alerté 30 minutes avant un retard probable pour prévenir vos clients, sans ressaisie ; l'export n'est qu'un moyen. »"
     ],
     [
      "IA · questions oubliées",
      "Souvent 1 à 3 (budget, contraintes de sécurité, qui accède aux données). Gardez celles qui servent la décision ; les questions génériques n'apportent rien."
     ]
    ],
    "erreurs": [
     "Proposer « on vous fait un export » dès la première minute : la solution précède le besoin.",
     "Enchaîner des questions fermées : on obtient oui ou non, pas le contexte.",
     "Oublier de chiffrer : sans 81 000 €, la demande ne passe pas l'arbitrage du budget."
    ]
   },
   "types": [
    null,
    null,
    null,
    "num",
    "num"
   ]
  },
  "EX5": {
   "id": "EX5",
   "titre": "Corriger trois e-mails : avant / après",
   "mode": "Binôme",
   "duree": 15,
   "chap": "Carnet · chapitre 2",
   "situation": [
    "Trois e-mails reçus chez TransLor. Lisez-les, puis corrigez-les.",
    "E1, envoyé à la directrice. Objet : « Question ». Texte : « Je pense qu'on pourrait faire autrement, mais je ne sais pas si c'est possible. Qu'en pensez-vous ? »",
    "E2, envoyé à Marc. Objet : « Re: Re: Re: Fwd: tournées ». Texte : trois sujets mélangés (planning de lundi, tablette de Léa, facture carburant), sans demande claire.",
    "E3 : « OK merci ! » envoyé en « Répondre à tous » à 40 personnes."
   ],
   "taches": [
    "Pour E1, E2 et E3, trouvez les défauts (un par e-mail pour commencer).",
    "Réécrivez l'objet de E1 et de E2 (8 mots maximum) et le texte de E1 en 4 lignes, conclusion en premier.",
    "Test IA (ordinateur) : collez votre E1 réécrit et demandez « Quelle action attend-on du lecteur, pour quand ? ». Notez le nom de l'IA utilisée."
   ],
   "livrable": "Trois e-mails corrigés.",
   "corr": {
    "methode": [
     "Objet = sujet + action attendue.",
     "Un e-mail = un sujet.",
     "Conclusion d'abord, détails ensuite.",
     "Répondre à tous seulement si tous doivent le savoir."
    ],
    "rows": [
     [
      "E1 : défauts",
      "Objet vide ; idée vague (« autrement ») ; pas d'action ni d'échéance"
     ],
     [
      "E1 : objet",
      "« Décision avant jeudi : changer l'ordre des tournées ? »"
     ],
     [
      "E1 : corps",
      "« Je propose d'inverser les tournées 3 et 4 pour gagner 20 minutes. Votre accord est nécessaire avant jeudi 12 h. Contexte : deux retards cette semaine. Je vous détaille en annexe. »"
     ],
     [
      "E2 : traitement",
      "Trois e-mails séparés, chacun avec son objet : « Planning lundi : validation », « Tablette Léa : panne », « Facture carburant : justificatif »"
     ],
     [
      "E3 : conseil",
      "Ne pas répondre à tous ; pour remercier, utiliser une réaction ou répondre à l'expéditeur seul"
     ]
    ],
    "erreurs": [
     "Laisser un fil « Re: Re: Fwd » qui ne reflète plus le sujet.",
     "Mettre la demande à la fin d'un long paragraphe.",
     "Aucune échéance : la demande n'est jamais traitée."
    ]
   },
   "outil": "e-mail réel, IA générative (test de lisibilité)",
   "types": [
    null,
    null,
    null
   ]
  },
  "F9": {
   "id": "F9",
   "titre": "Exit ticket · fin du cours",
   "mode": "Individuel",
   "duree": 5,
   "chap": "Carnet · tous chapitres",
   "situation": [
    "Sur une demi-page du carnet, en 5 minutes."
   ],
   "taches": [
    "Ce que j'ai appris de plus utile.",
    "Ce que je fais différemment dès lundi.",
    "Ce qui manquait ou était de trop dans ce cours.",
    "Une note de 1 à 5 : utilité en entreprise."
   ],
   "livrable": ""
  },
  "AX2": {
   "id": "AX2",
   "titre": "Chiffrer le coût de la non-communication",
   "mode": "Binôme",
   "duree": 12,
   "chap": "Carnet · chapitre 1",
   "situation": [
    "TransLor : 120 salariés, 14 M€ de chiffre d'affaires, marge d'environ 280 k€ (2 %).",
    "Hypothèses pédagogiques (inventées) : chaque salarié perd en moyenne 1,5 h par semaine en précisions, reprises et messages inutiles ; 45 semaines travaillées ; coût horaire chargé moyen 32 €.",
    "Un plan de communication (une journée de formation par salarié, 7 h, plus 6 000 € de prestation) pourrait réduire cette perte de 40 %."
   ],
   "taches": [
    "Calculez les heures perdues par an.",
    "Calculez le coût annuel.",
    "Exprimez-le en % du chiffre d'affaires puis en % de la marge.",
    "Calculez le gain annuel si la perte baisse de 40 %.",
    "Calculez le coût du plan, le ROI de la première année et le délai de retour en mois.",
    "Refaites le calcul avec une décote de 50 % sur le gain (prudence). Que décidez-vous ?"
   ],
   "livrable": "Un tableau de calcul ligne par ligne et une recommandation en deux phrases.",
   "corr": {
    "methode": [
     "Heures = salariés × h/semaine × semaines.",
     "Coût = heures × coût horaire.",
     "Rapporter au CA (14 M€) et à la marge (280 k€).",
     "Gain = coût × 40 %. Coût du plan = 120 × 7 h × 32 € + 6 000 €.",
     "ROI = (gain − coût) / coût ; retour (mois) = coût / gain × 12."
    ],
    "rows": [
     [
      "Heures perdues par an",
      "120 × 1,5 × 45 = 8 100 h"
     ],
     [
      "Coût annuel",
      "8 100 × 32 = 259 200 €"
     ],
     [
      "En % du CA et de la marge",
      "259 200 / 14 000 000 = 1,85 % du CA ; 259 200 / 280 000 = 92,6 % de la marge"
     ],
     [
      "Gain à −40 %",
      "259 200 × 0,40 = 103 680 €"
     ],
     [
      "Coût du plan, ROI, retour",
      "120 × 7 × 32 = 26 880 ; + 6 000 = 32 880 € ; ROI = 70 800 / 32 880 = 215 % ; retour 32 880 / 103 680 × 12 = 3,8 mois"
     ],
     [
      "Avec décote de 50 %",
      "Gain 51 840 € ; ROI = 18 960 / 32 880 = 57,7 % ; retour 7,6 mois → reste rentable : on lance le plan"
     ]
    ],
    "erreurs": [
     "Oublier le coût de présence des salariés en formation (26 880 €), qui est le plus gros poste du plan.",
     "Présenter 259 200 € comme un fait : ce sont des hypothèses inventées. Toujours annoncer les hypothèses et tester une version prudente.",
     "Confondre ROI (215 %) et délai de retour (3,8 mois)."
    ]
   }
  },
  "AX3": {
   "id": "AX3",
   "titre": "Analyser un échange raté entre exploitation et informatique",
   "mode": "Binôme",
   "duree": 10,
   "chap": "Carnet · chapitre 1",
   "situation": [
    "Messagerie interne de TransLor, entre Marc (gestionnaire d'exploitation) et l'administrateur système :",
    "Lundi 8 h 10, Marc : « Le TMS est lent, il faut régler ça vite. »",
    "Lundi 8 h 40, Admin : « OK, je regarde. »",
    "Jeudi 9 h 05, Marc : « Toujours rien ! Mes gars perdent un temps fou. »",
    "Jeudi 9 h 30, Admin : « J'ai ajouté de la mémoire au serveur, c'est fait. »",
    "Jeudi 9 h 45, Marc : « Mais c'est l'écran des tournées qui rame, vers 7 h, pas le serveur… »"
   ],
   "taches": [
    "Pour chaque message, notez ce qui manque (quoi, où, quand, combien, pour quand).",
    "Nommez le type de bruit en cause (technique, sémantique, psychologique, organisationnel).",
    "Retrouvez le vrai problème tel que Marc le décrit.",
    "Quelle question de clarification l'administrateur aurait-il dû poser dès lundi ?",
    "Réécrivez le message initial de Marc en 4 lignes, conclusion d'abord."
   ],
   "livrable": "Le message de Marc réécrit et la question de clarification de l'administrateur.",
   "corr": {
    "methode": [
     "Relire chaque message avec les 5 questions : quoi, où, quand, combien, pour quand.",
     "Repérer les mots flous (« lent », « vite », « je regarde »).",
     "Chercher quelle solution a été choisie avant le diagnostic.",
     "Réécrire : conclusion, impact, attendu, échéance."
    ],
    "rows": [
     [
      "Ce qui manque",
      "« lent » : quelle fonction, quand, combien de secondes ? « vite » : pour quand ? « je regarde » : aucun retour promis"
     ],
     [
      "Bruit en cause",
      "Sémantique (mots flous), organisationnel (pas de ticket), psychologique (agacement croissant)"
     ],
     [
      "Vrai problème",
      "L'écran Tournées ralentit autour de 7 h (pic de connexions) ; l'ajout de mémoire du serveur répondait à une autre question"
     ],
     [
      "Question de clarification",
      "« Quelle fonction est lente, à quelle heure, et combien de temps cela dure-t-il ? Qu'est-ce qui serait acceptable ? »"
     ],
     [
      "Cause racine de l'échec",
      "Solution choisie avant le diagnostic, sans critère de réussite partagé"
     ]
    ],
    "erreurs": [
     "Chercher un coupable (Marc trop vague ou l'admin trop passif) : les deux ont une part, le système n'imposait aucune précision.",
     "Proposer « plus de réunions » : il fallait un ticket avec impact et critère de réussite.",
     "Oublier de rappeler la date de retour : « je regarde » sans échéance équivaut à « je ne m'engage pas »."
    ],
    "modele": "Objet : TMS – écran Tournées : 25 s de chargement entre 6 h 45 et 7 h 30\n\nMarc, à l'administrateur : « L'écran Tournées met environ 25 secondes à s'ouvrir entre 6 h 45 et 7 h 30, pour les 15 gestionnaires. Les départs sont retardés d'environ 10 minutes. J'attends moins de 5 secondes. Pouvez-vous me proposer un diagnostic d'ici jeudi ? Je suis disponible à 7 h pour reproduire le problème. »\n\n(Valeurs 25 s et 10 min inventées pour l'exemple.)",
    "retenir": "Un message utile contient : conclusion, impact chiffré, attendu mesurable, échéance."
   }
  },
  "AX5": {
   "id": "AX5",
   "titre": "Triades d'écoute : parleur, écouteur, observateur",
   "mode": "Groupe de 3",
   "duree": 18,
   "chap": "Carnet · chapitre 2",
   "situation": [
    "Trois manches de 6 minutes : 3 min d'entretien, 2 min de retour, 1 min de changement de rôle. Chacun joue les trois rôles.",
    "Parleur : raconte une situation professionnelle réelle et non confidentielle (ou le cas de Léa : « la tablette plante et on ne m'écoute pas »).",
    "Écouteur : n'a le droit qu'aux reformulations et aux questions ouvertes. Aucun conseil, aucune histoire personnelle.",
    "Observateur : note les comportements sur la grille (chronomètre, silences, reformulations, questions, conseils)."
   ],
   "taches": [
    "Parleur : exposez la situation en 1 minute, puis répondez.",
    "Écouteur : faites au moins 3 reformulations et 2 questions ouvertes.",
    "Observateur : remplissez la grille d'observation.",
    "Retour en 3 minutes : l'observateur parle d'abord, puis le parleur dit ce qui l'a aidé.",
    "Notez un geste d'écoute à conserver et un à abandonner."
   ],
   "livrable": "La grille d'observation remplie pour chaque manche.",
   "corr": {
    "methode": [
     "L'observateur compte, ne juge pas.",
     "Le parleur dit ce qui l'a aidé avant tout commentaire.",
     "L'écouteur se corrige sur un seul point à la fois.",
     "Chacun note un engagement concret dans le carnet."
    ],
    "cols": [
     "Critère observé",
     "Cible",
     "Comment le noter"
    ],
    "widths": [
     2.5,
     1.2,
     4.3
    ],
    "rows": [
     [
      "Temps de parole de l'écouteur",
      "moins de 30 %",
      "Chronomètre : secondes de parole / 180"
     ],
     [
      "Reformulations",
      "3 ou plus",
      "Un trait par reformulation réussie, sans conseil"
     ],
     [
      "Questions ouvertes",
      "2 ou plus",
      "« Comment », « Qu'est-ce que », « Raconte-moi »"
     ],
     [
      "Conseils ou jugements",
      "0",
      "Un trait par « tu devrais », « moi à ta place »"
     ],
     [
      "Silence toléré",
      "au moins 3 s une fois",
      "L'écouteur laisse un blanc sans le combler"
     ],
     [
      "Synthèse finale",
      "oui",
      "Résumé en une phrase validé par le parleur"
     ]
    ],
    "erreurs": [
     "Remplir les silences : le parleur n'a pas le temps de creuser.",
     "Raconter « moi aussi » : l'attention passe de l'autre à soi.",
     "Observateur qui intervient pendant l'entretien : il note, il ne parle pas."
    ]
   }
  },
  "AX7": {
   "id": "AX7",
   "titre": "Reconnaître les quatre comportements",
   "mode": "Binôme",
   "duree": 8,
   "chap": "Carnet · chapitre 3",
   "situation": [
    "Classez chaque phrase : passif, agressif, manipulateur ou assertif.",
    "1. « Bon, d'accord, je m'en occupe… (soupir) comme d'habitude. »",
    "2. « Encore un retard ! Vous ne servez à rien ! »",
    "3. « Je ne peux pas livrer demain, mais vendredi à 12 h. Qu'en pensez-vous ? »",
    "4. « Oh, ce n'est pas grave, ne vous inquiétez pas pour moi. » (alors qu'il y a un vrai problème)",
    "5. « Tout le monde pense que ton code est mauvais. »",
    "6. « Si tu m'appréciais, tu prendrais mon astreinte. »"
   ],
   "taches": [
    "Classez les 6 phrases.",
    "Justifiez chaque classement par un indice (ton, généralisation, reproche, chantage…).",
    "Réécrivez les phrases 2 et 5 en version assertive.",
    "Identifiez votre comportement par défaut quand vous êtes sous pression.",
    "Citez une situation de TransLor où vous seriez tenté par l'un des trois comportements non assertifs."
   ],
   "livrable": "Le tableau de classement et deux phrases réécrites.",
   "corr": {
    "methode": [
     "Chercher qui est respecté : moi, l'autre, ou les deux ?",
     "Repérer les mots absolus (« toujours », « jamais », « tout le monde »).",
     "L'assertif décrit un fait, exprime un besoin et propose.",
     "Réécrire sans jugement sur la personne."
    ],
    "cols": [
     "Phrase",
     "Comportement",
     "Indice",
     "Version assertive"
    ],
    "widths": [
     0.6,
     1.4,
     2.4,
     3.6
    ],
    "rows": [
     [
      "1",
      "Manipulateur (passif-agressif)",
      "Accord de façade + reproche indirect",
      "« Je peux le faire cette semaine ; la prochaine fois, partageons-nous la charge. »"
     ],
     [
      "2",
      "Agressif",
      "Jugement sur les personnes, généralisation",
      "« Ce colis est arrivé avec 2 h de retard. Je veux comprendre pourquoi. »"
     ],
     [
      "3",
      "Assertif",
      "Fait, limite, alternative, question",
      "—"
     ],
     [
      "4",
      "Passif",
      "Nie son besoin pour éviter le conflit",
      "« Si, c'est un souci : j'ai besoin de… »"
     ],
     [
      "5",
      "Agressif / manipulateur",
      "Appel au « tout le monde », jugement",
      "« Dans cette revue, j'ai relevé trois fonctions sans test. Peux-tu en ajouter ? »"
     ],
     [
      "6",
      "Manipulateur",
      "Chantage affectif",
      "« Peux-tu prendre mon astreinte ? Je te rends la pareille le mois prochain. »"
     ]
    ],
    "erreurs": [
     "Confondre assertif et poli : on peut être très poli et passif-agressif.",
     "Prendre « tout le monde pense » pour un fait : c'est une pression sociale.",
     "Croire que l'assertivité impose d'obtenir gain de cause : elle garantit d'être clair et respectueux, pas d'avoir raison."
    ]
   }
  },
  "AX8": {
   "id": "AX8",
   "titre": "Six situations : DESC, SBI ou « oui, si… » ?",
   "mode": "Groupe de 3",
   "duree": 20,
   "chap": "Carnet · chapitre 3",
   "situation": [
    "Pour chaque situation, choisissez la méthode (DESC : décrire, exprimer, spécifier, conséquences ; SBI : situation, comportement, impact ; « oui, si… ») et écrivez la phrase clé.",
    "1. Revue de code : un collègue a écrit « code illisible » sur votre demande de fusion.",
    "2. Un collègue livre en retard pour la 3e fois ; votre propre livraison est bloquée.",
    "3. La directrice demande une démo pour demain, alors que l'équipe est à 100 % de charge.",
    "4. Un client appelle, furieux : sa livraison est partie à la mauvaise adresse.",
    "5. Un collègue vous coupe la parole en réunion.",
    "6. Le prestataire du TMS livre la mise à jour avec 3 jours de retard."
   ],
   "taches": [
    "Choisissez la méthode pour chaque situation.",
    "Écrivez la phrase clé (30 mots maximum).",
    "Vérifiez qu'elle contient un fait observable et pas un jugement.",
    "Choisissez la situation la plus délicate et dites quel canal (oral, écrit) convient.",
    "Jouez la situation 5 à deux, 1 minute."
   ],
   "livrable": "Un tableau situation, méthode, phrase clé.",
   "corr": {
    "methode": [
     "Situation entre pairs sur un comportement : SBI ou DESC.",
     "Demande qui dépasse la capacité : « oui, si… » avec alternatives.",
     "Client en colère : écouter, reformuler, puis proposer.",
     "Relire : aucun adjectif sur la personne."
    ],
    "cols": [
     "Situation",
     "Méthode",
     "Phrase clé"
    ],
    "widths": [
     0.7,
     1.3,
     6.3
    ],
    "rows": [
     [
      "1",
      "SBI",
      "« Dans ma demande de fusion de ce matin, ton commentaire « illisible » ne m'indique pas quoi changer ; peux-tu citer les lignes concernées ? »"
     ],
     [
      "2",
      "DESC",
      "« Trois livraisons ont dépassé la date. Je suis bloqué sur ma partie. Peux-tu me donner une date ferme ? Sinon, je préviens le chef de projet vendredi. »"
     ],
     [
      "3",
      "Oui, si…",
      "« Oui pour une démo demain si nous retirons la fonction B ; sinon je propose jeudi pour la version complète. »"
     ],
     [
      "4",
      "Écoute puis solution",
      "« Votre colis est parti à la mauvaise adresse, c'est inacceptable. Je confirme : adresse, heure. Je rappelle dans 30 minutes avec une solution. »"
     ],
     [
      "5",
      "SBI immédiat",
      "« Je n'avais pas fini ma phrase. Je termine, puis je te laisse la parole. »"
     ],
     [
      "6",
      "DESC écrit",
      "« La mise à jour devait arriver lundi et arrive jeudi, ce qui retarde nos tests. Nous attendons un planning révisé d'ici demain. »"
     ]
    ],
    "erreurs": [
     "Écrire « il est toujours en retard » : jugement, pas comportement.",
     "Dire non sans alternative à la directrice : la relation se tend et la décision se retarde.",
     "Régler par écrit une situation émotionnelle (4) : décrocher d'abord, confirmer par écrit ensuite."
    ]
   }
  },
  "AF2": {
   "id": "AF2",
   "titre": "Flash · Questions ouvertes, fermées ou biaisées ?",
   "mode": "Binôme",
   "duree": 5,
   "chap": "Carnet · chapitre 2",
   "situation": [
    "a. « Pourquoi n'avez-vous pas fait la saisie ? »",
    "b. « Peux-tu me décrire une tournée type ? »",
    "c. « Le retard vient-il du chargement ? »",
    "d. « Combien de temps cela prend-il ? »",
    "e. « Vous êtes d'accord, non ? »",
    "f. « Qu'est-ce qui serait un bon résultat pour toi ? »"
   ],
   "taches": [
    "Classez chaque question : ouverte, fermée ou biaisée (suggestive ou accusatoire).",
    "Réécrivez a et e en questions neutres.",
    "Gardez les deux meilleures pour un entretien de recueil de besoin."
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Ouverte : appelle un développement. Fermée : oui, non ou un chiffre.",
     "Biaisée : suggère la réponse ou contient un reproche."
    ],
    "rows": [
     [
      "a",
      "Ouverte mais accusatoire : « Qu'est-ce qui a empêché la saisie ? »"
     ],
     [
      "b",
      "Ouverte : excellente pour démarrer"
     ],
     [
      "c",
      "Fermée : utile pour vérifier une hypothèse"
     ],
     [
      "d",
      "Fermée chiffrée : utile pour quantifier"
     ],
     [
      "e",
      "Biaisée (suggestive) : « Qu'en pensez-vous ? »"
     ],
     [
      "f",
      "Ouverte : fait émerger le critère de réussite"
     ]
    ],
    "erreurs": [
     "Abuser des « pourquoi », perçus comme un reproche.",
     "Rester sur des questions fermées : on confirme ses hypothèses au lieu de découvrir le besoin."
    ]
   }
  },
  "AF3": {
   "id": "AF3",
   "titre": "Flash · Fait observable ou jugement ?",
   "mode": "Solo puis voisin",
   "duree": 4,
   "chap": "Carnet · chapitre 3",
   "situation": [
    "1. « Tu es négligent. »",
    "2. « Hier, tu as livré sans scanner trois colis. »",
    "3. « Tu fais mal ton travail. »",
    "4. « En réunion de 9 h, tu as coupé la parole à Sonia deux fois. »",
    "5. « Tu te moques des délais. »"
   ],
   "taches": [
    "Marquez F (fait observable) ou J (jugement).",
    "Transformez chaque jugement en fait observable (SBI : situation, comportement)."
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Un fait se filme : on peut le voir ou le mesurer.",
     "Un jugement qualifie la personne."
    ],
    "rows": [
     [
      "1",
      "J → « Lundi, le chargement n'a pas été vérifié sur deux palettes. »"
     ],
     [
      "2",
      "F : date, action, quantité"
     ],
     [
      "3",
      "J → « Cette fonction n'est pas testée. »"
     ],
     [
      "4",
      "F : lieu, moment, nombre de fois"
     ],
     [
      "5",
      "J → « Les trois dernières livraisons ont dépassé la date prévue. »"
     ]
    ],
    "erreurs": [
     "Croire qu'un adjectif est un fait : « négligent » ne se filme pas."
    ]
   }
  },
  "AX9": {
   "id": "AX9",
   "titre": "Dire non à la directrice : « oui, si… »",
   "mode": "Binôme",
   "duree": 12,
   "chap": "Carnet · chapitre 3",
   "situation": [
    "La directrice vous écrit : « Je veux le suivi des colis en temps réel pour notre client le plus important, dès demain. »",
    "Données : l'équipe informatique a 10 jours-homme disponibles ce mois-ci, dont 8 déjà engagés sur la migration du TMS. La demande représente environ 6 jours-homme."
   ],
   "taches": [
    "Calculez la capacité disponible et le manque.",
    "Listez trois options (oui si, version réduite, nouveau délai) avec leur coût en jours-homme.",
    "Rédigez la réponse à la directrice en 5 lignes, décision proposée d'abord.",
    "Choisissez le canal (appel, e-mail) et justifiez.",
    "Quelle contrepartie demandez-vous à la direction ?"
   ],
   "livrable": "Une réponse écrite de 5 lignes.",
   "corr": {
    "methode": [
     "Capacité disponible = capacité − engagements.",
     "Écart = demande − capacité disponible.",
     "Proposer des alternatives chiffrées, jamais un non sec.",
     "Mettre la décision d'abord, la contrainte ensuite."
    ],
    "rows": [
     [
      "Capacité disponible",
      "10 − 8 = 2 jours-homme"
     ],
     [
      "Manque",
      "6 − 2 = 4 jours-homme"
     ],
     [
      "Option 1 : oui, si",
      "Oui si la migration du TMS est décalée de 4 j-h (coût : migration retardée d'une semaine)"
     ],
     [
      "Option 2 : version réduite",
      "2 j-h : alerte SMS de retard, sans suivi en temps réel complet"
     ],
     [
      "Option 3 : délai",
      "Livrer la version complète dans 3 semaines, une fois la migration terminée"
     ],
     [
      "Canal",
      "Appel puis e-mail de confirmation : la direction attend une décision, l'écrit garde la trace"
     ]
    ],
    "erreurs": [
     "Répondre « impossible » : la directrice cherche des options, pas un refus.",
     "Oublier de chiffrer les options en jours-homme : sans chiffre, l'arbitrage est impossible.",
     "Dire oui puis subir : un oui sans condition crée la dette de délai."
    ],
    "modele": "« Bonjour, je vous propose de livrer demain une alerte SMS de retard (2 jours-homme, dans notre capacité) et la version complète dans 3 semaines, après la migration du TMS. La version complète demain exigerait de retarder la migration d'une semaine (4 jours-homme manquants). Quel arbitrage préférez-vous ? Je vous appelle à 14 h pour en discuter. »",
    "retenir": "« Oui, si… » : une décision proposée, des options chiffrées, une question d'arbitrage."
   }
  },
  "AX10": {
   "id": "AX10",
   "titre": "Réécrire quatre messages de messagerie instantanée",
   "mode": "Individuel",
   "duree": 8,
   "chap": "Carnet · chapitre 4",
   "situation": [
    "Messages réellement envoyés (reconstitués) dans l'équipe de TransLor :",
    "1. « Ça marche pas. »",
    "2. « URGENT !!! Appelle-moi. »",
    "3. « Tu as vu mon mail ? »",
    "4. « Je ne suis pas d'accord. »"
   ],
   "taches": [
    "Pour chaque message, identifiez ce qui manque.",
    "Réécrivez-le en 2 phrases maximum.",
    "Précisez le canal le plus adapté.",
    "Vérifiez que l'autre peut agir sans vous poser de question.",
    "Appliquez à un message de votre messagerie récente."
   ],
   "livrable": "Quatre messages réécrits.",
   "corr": {
    "methode": [
     "Qui, quoi, où, quand, pour quand ?",
     "Mettre la demande en premier.",
     "Donner de quoi agir sans question supplémentaire."
    ],
    "cols": [
     "Avant",
     "Défaut",
     "Après"
    ],
    "widths": [
     1.6,
     2.2,
     4.6
    ],
    "rows": [
     [
      "« Ça marche pas. »",
      "Aucun objet, aucun contexte",
      "« L'application Tablette affiche l'erreur 504 depuis 6 h 40 sur 14 tablettes. Peux-tu regarder avant 8 h ? »"
     ],
     [
      "« URGENT !!! Appelle-moi. »",
      "Anxiogène, sans raison",
      "« Un client conteste une livraison à 14 h. Peux-tu m'appeler avant 13 h 30 ? »"
     ],
     [
      "« Tu as vu mon mail ? »",
      "Relance sans contenu",
      "« Pour la décision sur le transporteur, j'attends ton choix d'ici jeudi 12 h. »"
     ],
     [
      "« Je ne suis pas d'accord. »",
      "Désaccord sans raison ni piste",
      "« Je ne vois pas comment tenir la date de vendredi. Que penses-tu de jeudi de la semaine prochaine ? »"
     ]
    ],
    "erreurs": [
     "Écrire « URGENT » sans dire pourquoi ni pour quand.",
     "Multiplier les points d'exclamation : le ton se lit comme de l'agressivité.",
     "Prendre une décision importante en message privé, sans trace partagée."
    ]
   }
  },
  "AX12": {
   "id": "AX12",
   "titre": "À / Cc / Cci, ton et droit à la déconnexion",
   "mode": "Binôme",
   "duree": 8,
   "chap": "Carnet · chapitre 4",
   "situation": [
    "E4 — Un développeur écrit à un client : « Salut, ton problème est réglé, c'était la faute de ton prestataire. » ; il met en copie toute l'équipe commerciale, et en copie cachée (Cci) son chef.",
    "E5 — Un chef de projet envoie à 22 h 15 à un collaborateur : « Il me faut ça demain 8 h, merci. »"
   ],
   "taches": [
    "Pour E4 : relevez les problèmes de ton, de Cc et de Cci.",
    "Réécrivez E4 en trois phrases, vouvoiement.",
    "Pour E5 : quel est le problème ? Que proposer ?",
    "Rappelez la règle sur le droit à la déconnexion (cadre légal : Code du travail, art. L2242-17).",
    "Écrivez la règle de messagerie que vous proposez pour TransLor."
   ],
   "livrable": "Deux messages corrigés et une règle d'équipe.",
   "corr": {
    "methode": [
     "À = qui agit ; Cc = qui doit savoir ; Cci = exception, jamais pour surveiller.",
     "Faire descendre le ton d'un cran vers le neutre.",
     "Envoi différé pour respecter les horaires d'autrui."
    ],
    "rows": [
     [
      "E4 : problèmes",
      "Tutoiement avec un client ; reproche à un tiers ; Cc inutile (toute l'équipe) ; Cci d'un chef = défiance"
     ],
     [
      "E4 : version corrigée",
      "« Bonjour Madame, le problème est résolu depuis 15 h. Il venait d'un paramétrage que nous avons corrigé. Nous restons disponibles. »"
     ],
     [
      "E5 : problème",
      "Demande hors horaires, délai court : pression implicite"
     ],
     [
      "E5 : solution",
      "Programmer l'envoi à 8 h 00 et demander une réponse avant 17 h"
     ],
     [
      "Cadre légal",
      "Droit à la déconnexion : les modalités se négocient dans l'entreprise (Code du travail, art. L2242-17)"
     ],
     [
      "Règle TransLor",
      "Pas d'attente de réponse entre 19 h et 7 h 30 ; urgence = appel, pas message"
     ]
    ],
    "erreurs": [
     "Utiliser Cci pour « se couvrir » : si un chef doit savoir, il va en Cc.",
     "Penser que « urgent » justifie un envoi nocturne : prévoir un canal d'astreinte.",
     "Citer un article de loi de mémoire : toujours vérifier avant diffusion."
    ]
   }
  },
  "AX13": {
   "id": "AX13",
   "titre": "Rédiger un compte rendu de réunion",
   "mode": "Groupe de 3, document partagé",
   "duree": 12,
   "chap": "Carnet · chapitre 4",
   "situation": [
    "Notes brutes de la réunion « Dernier kilomètre » (9 personnes, 6 juin) :",
    "Directrice : lancement visé en septembre. — Marc : 14 tournées urbaines de plus, besoin de tablettes. — Admin : 2 jours-homme maximum, migration TMS d'abord. — Sonia : budget total 400 k€ pour 6 projets, ce projet 90 k€. — Décision : pilote à Nancy centre à partir du 15 septembre. — Marc liste les tournées avant le 30 juin. — Admin chiffre l'intégration avant le 5 juillet. — Paul : formation des conducteurs à planifier. — Sonia : budget validé en comité le 10 juillet. — Point ouvert : zones à faibles émissions, règles de circulation à vérifier."
   ],
   "taches": [
    "Triez les notes : décisions, actions, points ouverts.",
    "Écrivez chaque action : qui / quoi / quand.",
    "Dans un document partagé, collez le modèle de la boîte à outils et rédigez le compte rendu (10 lignes maximum).",
    "Écrivez l'objet de l'e-mail d'envoi et les destinataires (À, Cc)."
   ],
   "livrable": "Le compte rendu dans un document partagé (lien) avec le modèle.",
   "corr": {
    "methode": [
     "Trier les notes en trois catégories.",
     "Toute action = qui + quoi + quand.",
     "Décisions d'abord, actions ensuite, points ouverts à la fin.",
     "Envoyer sous 24 h."
    ],
    "rows": [
     [
      "Décision",
      "Pilote à Nancy centre à partir du 15 septembre"
     ],
     [
      "Action 1",
      "Marc : lister les tournées urbaines avant le 30 juin"
     ],
     [
      "Action 2",
      "Admin : chiffrer l'intégration avant le 5 juillet"
     ],
     [
      "Action 3",
      "Sonia : faire valider le budget de 90 k€ au comité du 10 juillet"
     ],
     [
      "Action 4",
      "Paul : proposer un calendrier de formation (date à fixer : à valider)"
     ],
     [
      "Point ouvert",
      "Règles de circulation en zone à faibles émissions : responsable à désigner"
     ]
    ],
    "erreurs": [
     "Retranscrire la discussion au lieu des décisions.",
     "Action sans responsable ou sans date : elle ne sera pas faite.",
     "Envoyer le compte rendu une semaine après : la mémoire s'efface."
    ],
    "modele": [
     "Objet : Compte rendu — Dernier kilomètre, 6 juin : pilote Nancy centre décidé",
     "Décision : pilote à Nancy centre à partir du 15 septembre. Budget visé : 90 k€ sur 400 k€ (6 projets).",
     "Actions : Marc, liste des tournées urbaines (14 de plus), avant le 30 juin. Admin, chiffrage de l'intégration (2 j-h maximum), avant le 5 juillet. Sonia, validation du budget, comité du 10 juillet. Paul, calendrier de formation des conducteurs, date à fixer.",
     "Point ouvert : règles en zone à faibles émissions, responsable à désigner. À : participants. Cc : directrice."
    ],
    "retenir": "Un bon compte rendu se lit en 1 minute : décisions, actions (qui, quoi, quand), points ouverts."
   }
  },
  "AX14": {
   "id": "AX14",
   "titre": "Écrire un ticket d'incident exploitable",
   "mode": "Binôme, GitHub Issues",
   "duree": 10,
   "chap": "Carnet · chapitre 4",
   "situation": [
    "Message reçu : « La synchro des tablettes ne marche plus depuis ce matin, c'est urgent, les gars sont bloqués. »",
    "Faits recueillis : début 6 h 40 ; 14 tablettes sur 60 touchées ; message d'erreur « 504 » ; problème sur le Wi-Fi du quai ; application version 3.2.1 ; dernier changement : mise à jour de dimanche ; les conducteurs peuvent travailler sur papier, avec 10 minutes de retard par tournée."
   ],
   "taches": [
    "Ouvrez un ticket (GitHub Issues sur un dépôt de test) ou collez le modèle .md de la boîte à outils.",
    "Écrivez le titre (une ligne), puis contexte, impact, observé / attendu, étapes pour reproduire.",
    "Calculez la part de tablettes touchées et choisissez la priorité (P1 à P4) ; justifiez."
   ],
   "livrable": "Un ticket complet (lien ou texte copié).",
   "corr": {
    "methode": [
     "Titre = où + quoi + quand.",
     "Impact en nombre de personnes et en temps.",
     "Observé / attendu / reproduire.",
     "Priorité selon une grille écrite."
    ],
    "rows": [
     [
      "Titre",
      "Tablettes conducteurs : erreur 504 à la synchro depuis 6 h 40 (Wi-Fi du quai)"
     ],
     [
      "Part touchée",
      "14 / 60 = 23 % des tablettes"
     ],
     [
      "Impact",
      "14 conducteurs sur papier, environ 10 minutes de retard par tournée"
     ],
     [
      "Observé / attendu",
      "Observé : erreur 504 à la synchro. Attendu : synchro en moins de 30 s"
     ],
     [
      "À reproduire / pièces",
      "Ouvrir l'application v3.2.1 sur le Wi-Fi du quai, lancer la synchro ; joindre une capture de l'erreur ; changement suspect : mise à jour de dimanche"
     ],
     [
      "Priorité",
      "P2 : dégradation majeure avec contournement coûteux ; pas P1 car l'activité continue"
     ]
    ],
    "erreurs": [
     "Titre « urgent » sans information.",
     "Mélanger plusieurs problèmes dans un seul ticket.",
     "Oublier de mentionner le dernier changement : c'est la première piste de l'équipe technique."
    ]
   }
  },
  "AX15": {
   "id": "AX15",
   "titre": "Cartographier un argument : le modèle de Toulmin",
   "mode": "Binôme",
   "duree": 12,
   "chap": "Carnet · chapitre 5",
   "situation": [
    "Marc affirme : « TransLor doit passer aux camions électriques pour le dernier kilomètre. »",
    "Éléments disponibles : 14 tournées urbaines de 80 km par jour ; autonomie annoncée de 200 km (donnée du constructeur, non mesurée) ; zones à faibles émissions en extension ; aides à l'achat de véhicules propres ; prix d'achat plus élevé qu'un diesel."
   ],
   "taches": [
    "Identifiez l'affirmation (A), les données (D), la garantie (G) qui relie D à A, le fondement (F) de la garantie.",
    "Formulez la réfutation possible (R) et la réserve (Q, « sauf si… »).",
    "Quelle donnée est la plus fragile ?",
    "Reformulez l'affirmation avec un qualificatif (probablement, dans les conditions…).",
    "Quelle preuve supplémentaire demandez-vous avant de décider ?"
   ],
   "livrable": "Un schéma de Toulmin complété.",
   "corr": {
    "methode": [
     "Écrire l'affirmation en une phrase.",
     "Lister les données vérifiables.",
     "Expliciter la garantie : pourquoi ces données mènent à cette affirmation.",
     "Chercher la réfutation avant l'adversaire."
    ],
    "cols": [
     "Élément",
     "Contenu"
    ],
    "widths": [
     1.8,
     6.4
    ],
    "rows": [
     [
      "Affirmation",
      "Passer aux camions électriques pour le dernier kilomètre"
     ],
     [
      "Données",
      "80 km/jour pour 14 tournées ; autonomie 200 km ; extension des zones à faibles émissions ; aides"
     ],
     [
      "Garantie",
      "Si l'autonomie couvre la tournée et que les zones restreignent le diesel, l'électrique est adapté"
     ],
     [
      "Fondement",
      "Mesures d'autonomie réelles (hiver, chargement) et textes sur les zones"
     ],
     [
      "Réfutation / réserve",
      "Autonomie réelle plus faible en hiver ; coût d'achat ; points de recharge : sauf si le coût total est supérieur"
     ],
     [
      "Donnée fragile",
      "L'autonomie de 200 km est annoncée, non mesurée"
     ]
    ],
    "erreurs": [
     "Prendre la donnée du constructeur pour un fait établi.",
     "Oublier la garantie : l'argument semble évident, mais l'adversaire la conteste.",
     "Ne pas prévoir de réserve : l'argument paraît absolu et se brise sur la première objection."
    ]
   }
  },
  "AX16": {
   "id": "AX16",
   "titre": "Chasser les sophismes",
   "mode": "Binôme",
   "duree": 8,
   "chap": "Carnet · chapitre 5",
   "situation": [
    "Six phrases entendues en réunion :",
    "1. « Le concurrent X a des camions électriques, donc nous devons en acheter. »",
    "2. « Ce consultant n'a jamais conduit un camion, ignorez son rapport. »",
    "3. « Si on retarde le projet d'un mois, on perdra tous nos clients. »",
    "4. « Soit on passe tout à l'électrique, soit on disparaît. »",
    "5. « Deux conducteurs se sont plaints de la tablette, donc elle ne marche pas. »",
    "6. « Depuis le changement de TMS, les retards ont augmenté : le TMS est en cause. »"
   ],
   "taches": [
    "Nommez le sophisme (popularité, attaque contre la personne, pente glissante, faux dilemme, généralisation hâtive, post hoc).",
    "Expliquez en une phrase pourquoi le raisonnement est fragile.",
    "Écrivez une contre-question.",
    "Citez une phrase de ce type que vous avez entendue en entreprise.",
    "Reformulez la phrase 6 comme une hypothèse à tester."
   ],
   "livrable": "Un tableau sophisme / explication / contre-question.",
   "corr": {
    "methode": [
     "Chercher le lien logique entre l'affirmation et la raison donnée.",
     "Nommer le procédé.",
     "Répondre par une question, pas par une accusation."
    ],
    "cols": [
     "N°",
     "Sophisme",
     "Contre-question"
    ],
    "widths": [
     0.5,
     2.2,
     5.5
    ],
    "rows": [
     [
      "1",
      "Appel à la popularité",
      "« Leur contexte est-il le même que le nôtre ? »"
     ],
     [
      "2",
      "Attaque contre la personne",
      "« Quels points du rapport sont faux ? »"
     ],
     [
      "3",
      "Pente glissante",
      "« Quelles preuves relient un mois de retard à la perte de tous les clients ? »"
     ],
     [
      "4",
      "Faux dilemme",
      "« Existe-t-il une étape intermédiaire, comme un pilote ? »"
     ],
     [
      "5",
      "Généralisation hâtive",
      "« Combien de tablettes sont touchées sur 60 ? »"
     ],
     [
      "6",
      "Post hoc (corrélation prise pour cause)",
      "« Qu'a-t-il changé d'autre en même temps ? Comparons avec les mois précédents. »"
     ]
    ],
    "erreurs": [
     "Traiter l'interlocuteur de « sophiste » : cela devient une attaque personnelle.",
     "Croire qu'un argument faux oblige à rejeter la conclusion : la conclusion peut rester vraie, mais non prouvée."
    ]
   }
  },
  "AX17": {
   "id": "AX17",
   "titre": "Évaluer cinq sources",
   "mode": "Binôme",
   "duree": 15,
   "chap": "Carnet · chapitre 5",
   "situation": [
    "Sujet : les camions électriques en milieu urbain. Cinq sources (fictives) :",
    "S1 — Article de revue à comité de lecture, 2024, méthode décrite, 3 villes, limites discutées.",
    "S2 — Brochure commerciale d'un constructeur, 2025, chiffres sans méthode.",
    "S3 — Rapport d'une agence publique, 2023, mesures sur 120 véhicules, méthode publiée.",
    "S4 — Billet de blog anonyme, 2022, « 100 % rentable » sans source.",
    "S5 — Article de presse généraliste, 2025, cite uniquement S2."
   ],
   "taches": [
    "Notez chaque source de 0 à 2 sur 6 critères : Qui ? Quand ? Pourquoi ? Sur quoi (preuves) ? Recoupé ? Reproductible ? (maximum 12).",
    "Seuils : 9 et plus fiable ; 5 à 8 à recouper ; 4 et moins à écarter ou à citer avec prudence.",
    "Classez les sources.",
    "Que gardez-vous pour un état de l'art ?",
    "Pourquoi S5 n'ajoute-t-elle rien à S2 ?"
   ],
   "livrable": "Un tableau de notation et la liste des sources retenues.",
   "corr": {
    "methode": [
     "Qui : auteur identifié et compétent ? Quand : récent pour le sujet ? Pourquoi : informer ou vendre ?",
     "Sur quoi : données et méthode visibles ? Recoupé : d'autres sources concordent ? Reproductible : méthode refaisable ?",
     "Additionner puis appliquer les seuils."
    ],
    "cols": [
     "Source",
     "Q / Q / P / S / R / R",
     "Total",
     "Décision"
    ],
    "widths": [
     0.7,
     2.4,
     0.9,
     4.2
    ],
    "rows": [
     [
      "S1",
      "2 / 2 / 2 / 2 / 1 / 2",
      "11",
      "Fiable : retenue"
     ],
     [
      "S3",
      "2 / 1 / 2 / 2 / 1 / 2",
      "10",
      "Fiable : retenue"
     ],
     [
      "S5",
      "1 / 2 / 1 / 0 / 0 / 0",
      "4",
      "À écarter : source unique, reprend S2"
     ],
     [
      "S2",
      "1 / 2 / 0 / 0 / 0 / 0",
      "3",
      "Citer comme position du constructeur seulement"
     ],
     [
      "S4",
      "0 / 1 / 0 / 0 / 0 / 0",
      "1",
      "Écartée"
     ]
    ],
    "erreurs": [
     "Croire qu'un chiffre cité plusieurs fois est vrai : S5 dépend de S2 (source circulaire).",
     "Rejeter une brochure commerciale : on peut la citer comme position de l'acteur.",
     "Retenir seulement les sources qui confirment son idée (biais de confirmation)."
    ]
   }
  },
  "AX18": {
   "id": "AX18",
   "titre": "Mini état de l'art : comparer trois solutions de verdissement",
   "mode": "Groupe de 3",
   "duree": 20,
   "chap": "Carnet · chapitre 5",
   "situation": [
    "Pour le dernier kilomètre, trois solutions (scores fictifs de 1 à 5, 5 = meilleur) :",
    "Électrique : coût 3, autonomie 2, émissions 5, disponibilité 3.",
    "BioGNV : coût 4, autonomie 4, émissions 4, disponibilité 3.",
    "HVO (biocarburant pour moteur diesel) : coût 4, autonomie 5, émissions 3, disponibilité 4.",
    "Pondérations de départ : coût 30 %, autonomie 25 %, émissions 25 %, disponibilité 20 %."
   ],
   "taches": [
    "Calculez la note pondérée de chaque solution.",
    "Classez-les.",
    "Test de sensibilité : émissions 40 %, les autres 20 % chacune. Le classement change-t-il ?",
    "Rédigez la conclusion en 3 phrases avec un qualificatif et une réserve.",
    "Quelles données réelles faudrait-il collecter avant de décider ?"
   ],
   "livrable": "Tableau de calcul et conclusion rédigée.",
   "corr": {
    "methode": [
     "Note = somme (score × poids).",
     "Refaire avec d'autres poids pour voir si le classement est stable.",
     "Conclure avec réserve : les scores sont fictifs et à sourcer."
    ],
    "cols": [
     "Solution",
     "Base (30/25/25/20)",
     "Émissions 40 % (20/20/40/20)"
    ],
    "widths": [
     1.6,
     3.2,
     3.5
    ],
    "rows": [
     [
      "Électrique",
      "0,9 + 0,5 + 1,25 + 0,6 = 3,25",
      "0,6 + 0,4 + 2,0 + 0,6 = 3,60"
     ],
     [
      "BioGNV",
      "1,2 + 1,0 + 1,0 + 0,6 = 3,80",
      "0,8 + 0,8 + 1,6 + 0,6 = 3,80"
     ],
     [
      "HVO",
      "1,2 + 1,25 + 0,75 + 0,8 = 4,00",
      "0,8 + 1,0 + 1,2 + 0,8 = 3,80"
     ],
     [
      "Classement",
      "HVO > BioGNV > Électrique",
      "BioGNV = HVO (3,80) > Électrique (3,60)"
     ],
     [
      "Lecture",
      "Le choix dépend de la pondération : les pondérations sont un argument, pas un fait",
      ""
     ]
    ],
    "erreurs": [
     "Présenter un classement sans test de sensibilité : il peut s'inverser avec d'autres poids.",
     "Oublier que les scores sont des données à sourcer, pas des vérités.",
     "Conclure sans réserve : « le HVO est le meilleur » alors que l'écart est faible."
    ],
    "modele": "« Sous les pondérations actuelles, le HVO paraît la solution la plus adaptée (4,00 contre 3,80 et 3,25). Si les émissions deviennent la priorité (40 %), le HVO et le bioGNV sont à égalité (3,80). Avant de décider, il faut vérifier les scores sur des sources mesurées (autonomie réelle, disponibilité locale) ; ces notes sont fictives. »",
    "retenir": "Un état de l'art honnête : critères explicites, test de sensibilité, réserve, sources à citer."
   }
  },
  "AX19": {
   "id": "AX19",
   "titre": "Synthèse du jour 1 : une situation de communication complète",
   "mode": "Binôme",
   "duree": 25,
   "chap": "Carnet · chapitres 2 à 4",
   "situation": [
    "Paul (DRH) écrit à Marc, copie à la directrice : « Encore un planning de formation changé sans me prévenir. Vous faites n'importe quoi à l'exploitation. »",
    "Faits : le planning a été modifié mardi pour absorber une absence ; Paul n'a pas été prévenu ; 4 conducteurs étaient convoqués à une formation obligatoire."
   ],
   "taches": [
    "Quel niveau d'écoute Paul attend-il ? Écrivez une reformulation en 2 phrases.",
    "Formulez un feedback SBI sur le message de Paul (comportement : copie à la directrice et ton).",
    "Choisissez le canal pour répondre : appel ou e-mail ? Justifiez.",
    "Rédigez l'e-mail de confirmation en 8 lignes maximum, conclusion d'abord.",
    "Proposez une règle pour éviter la répétition."
   ],
   "livrable": "Un appel préparé (3 phrases) et un e-mail.",
   "corr": {
    "methode": [
     "Écouter d'abord : reconnaître l'émotion et le fait.",
     "Feedback SBI sans jugement sur la personne.",
     "Appeler pour l'émotion, écrire pour la trace.",
     "Terminer par une règle ou une action datée."
    ],
    "rows": [
     [
      "Reformulation",
      "« Vous découvrez un changement qui touche une formation obligatoire, et vous n'avez pas été prévenu. C'est cela ? »"
     ],
     [
      "SBI",
      "« Dans votre message de ce matin copié à la directrice, la phrase « n'importe quoi » ne m'aide pas à corriger ; j'aimerais qu'on parle d'abord des 4 conducteurs. »"
     ],
     [
      "Canal",
      "Appel immédiat (émotion), puis e-mail pour confirmer la décision"
     ],
     [
      "Action",
      "Marc informe Paul avant tout changement qui touche une formation (message avant 16 h la veille)"
     ],
     [
      "Règle",
      "Un changement de planning de formation = information du RH en 2 heures, via un canal partagé"
     ]
    ],
    "erreurs": [
     "Répondre à chaud par écrit avec la directrice en copie : le conflit s'amplifie.",
     "S'excuser sans corriger la cause : la même situation reviendra.",
     "Oublier les 4 conducteurs : c'est l'impact réel."
    ],
    "modele": "Objet : Planning de formation du 12 — conducteurs confirmés\n\nPaul, suite à notre échange de 10 h : les 4 conducteurs seront convoqués à la formation du jeudi 14 à 9 h ; vous recevrez désormais tout changement dans les 2 heures par message partagé. Je suis désolé de ne pas vous avoir prévenu mardi. Je vous confirme la liste avant 16 h. Marc",
    "retenir": "Écouter, appeler, confirmer par écrit, fixer une règle."
   }
  },
  "AF5": {
   "id": "AF5",
   "titre": "Flash · Messagerie instantanée : vrai ou faux ?",
   "mode": "Solo puis voisin",
   "duree": 3,
   "chap": "Carnet · chapitre 4",
   "situation": [
    "1. Écrire « Bonjour » seul et attendre une réponse est une bonne pratique.",
    "2. Utiliser @tous pour une information non urgente est acceptable.",
    "3. Répondre dans le fil (thread) aide à garder les sujets séparés.",
    "4. Une décision importante prise en message privé n'a pas besoin de trace partagée.",
    "5. Les émojis sont acceptables selon la culture de l'équipe."
   ],
   "taches": [
    "Répondez Vrai ou Faux.",
    "Corrigez les affirmations fausses.",
    "Écrivez une règle de messagerie pour TransLor."
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Penser à l'autre : peut-il agir sans poser de question ?"
    ],
    "rows": [
     [
      "1",
      "Faux : « Bonjour + la question complète »"
     ],
     [
      "2",
      "Faux : réserver @tous aux urgences"
     ],
     [
      "3",
      "Vrai"
     ],
     [
      "4",
      "Faux : consigner dans un canal ou un compte rendu"
     ],
     [
      "5",
      "Vrai : se mettre d'accord sur les usages"
     ]
    ],
    "erreurs": [
     "Attendre le « bonjour » de l'autre avant d'écrire la question : on perd du temps à chaque échange."
    ]
   }
  },
  "AX20": {
   "id": "AX20",
   "titre": "Pitch de 2 minutes : le projet « dernier kilomètre »",
   "mode": "Groupe de 3",
   "duree": 30,
   "chap": "Carnet · chapitre 6",
   "situation": [
    "Public : la directrice de TransLor (non technique) et le comité de direction. Sujet : le projet de dernier kilomètre en ville (pilote à Nancy centre le 15 septembre, 90 k€ sur 400 k€, 14 tournées urbaines de 80 km par jour).",
    "Contrainte : 2 minutes, sans diapositive, un message clé.",
    "Organisation : 10 minutes de préparation individuelle ; 3 × (2 min de pitch + 3 min de retour) en groupe de 3."
   ],
   "taches": [
    "Écrivez votre message clé en une phrase.",
    "Construisez le plan : accroche, problème, solution, preuve, appel à décision.",
    "Préparez une analogie et un chiffre.",
    "Pitchez 2 minutes (chronométrées).",
    "Évaluez vos deux pairs avec la grille sur 20 : accroche 3, message clé 4, structure 4, clarté 4, voix et posture 3, appel à décision 2."
   ],
   "livrable": "Votre message clé et la grille de vos pairs.",
   "corr": {
    "methode": [
     "Message clé : une phrase que la directrice peut répéter.",
     "Accroche : un fait ou une scène, pas « bonjour, je vais vous parler de… ».",
     "Un chiffre, une analogie, une demande.",
     "S'entraîner à voix haute avec un chronomètre."
    ],
    "cols": [
     "Critère",
     "Points",
     "Ce qui vaut le maximum"
    ],
    "widths": [
     2.2,
     0.9,
     5.2
    ],
    "rows": [
     [
      "Accroche",
      "3",
      "Scène ou chiffre qui crée l'attention en 10 secondes"
     ],
     [
      "Message clé",
      "4",
      "Une phrase claire, répétée à la fin"
     ],
     [
      "Structure",
      "4",
      "Problème, solution, preuve, appel enchaînés sans digression"
     ],
     [
      "Clarté / vulgarisation",
      "4",
      "Aucun jargon non expliqué ; une analogie"
     ],
     [
      "Voix et posture",
      "3",
      "Débit calme, pauses, regard, mains visibles"
     ],
     [
      "Appel à décision",
      "2",
      "Une demande datée et chiffrée (total : 20)"
     ]
    ],
    "erreurs": [
     "Lire ses notes : on perd le regard et la voix.",
     "Vouloir tout dire : 2 minutes = 1 message.",
     "Terminer par « voilà, c'est tout » au lieu d'une demande."
    ],
    "modele_titre": "Exemple modèle (moins de 2 minutes)",
    "modele": "« Lundi, 7 h : quatorze tournées urbaines quittent Nancy, et 12 % dépassent le créneau promis à nos clients. Nos trois plus gros clients, 60 % de notre chiffre d'affaires, pénalisent les retards. Notre projet : un pilote de dernier kilomètre à Nancy centre à partir du 15 septembre, avec des véhicules propres adaptés à 80 km par jour et une alerte de retard 30 minutes avant le créneau. Pourquoi cela marche : les tournées urbaines sont courtes, l'e-commerce progresse et les zones à faibles émissions arrivent. Il demande 90 k€ sur les 400 k€ des six projets, et nous permet de mesurer avant d'étendre. Les risques : autonomie en hiver, disponibilité des véhicules ; nous les suivons avec deux indicateurs, taux de retard et kilomètres réels. Ce que je vous demande aujourd'hui : valider le pilote et ses 90 k€ au comité du 10 juillet. »",
    "retenir": "Accroche, problème, solution, preuve, risque, appel : une idée par phrase."
   }
  },
  "AX21": {
   "id": "AX21",
   "titre": "Répondre aux objections de la directrice",
   "mode": "Binôme",
   "duree": 12,
   "chap": "Carnet · chapitre 6",
   "situation": [
    "Après votre pitch, la directrice objecte :",
    "1. « Pourquoi ne pas simplement sous-traiter le dernier kilomètre ? »",
    "2. « C'est trop cher. »",
    "3. « Et si les clients n'en veulent pas ? »"
   ],
   "taches": [
    "Pour chaque objection, reformulez l'inquiétude derrière (1 phrase).",
    "Répondez avec un fait ou un chiffre (2 phrases).",
    "Terminez par une vérification : « Cela répond-il à votre inquiétude ? »",
    "Calculez la part du budget : 90 k€ sur 400 k€.",
    "Jouez l'échange à deux, 3 minutes, avec un observateur."
   ],
   "livrable": "Trois réponses structurées.",
   "corr": {
    "methode": [
     "Écouter sans interrompre.",
     "Reformuler l'inquiétude.",
     "Répondre avec un fait ou un chiffre.",
     "Vérifier : « Cela répond-il à votre question ? »"
    ],
    "cols": [
     "Objection",
     "Reformulation",
     "Réponse modèle"
    ],
    "widths": [
     1.8,
     2.5,
     4.2
    ],
    "rows": [
     [
      "Sous-traiter ?",
      "« Vous craignez d'investir dans une activité que d'autres savent faire ? »",
      "« Sous-traiter limite l'investissement, mais nous perdons la relation client et les données. Le pilote nous permet de comparer le coût par livraison. »"
     ],
     [
      "Trop cher",
      "« 90 k€ vous semblent élevés ? »",
      "« C'est 22,5 % du budget de 400 k€ (90 / 400). Le pilote limite le risque : nous mesurons avant d'étendre. »"
     ],
     [
      "Clients ?",
      "« Vous voulez être sûre de la demande avant d'engager ? »",
      "« Le pilote se fait avec des clients volontaires ; nous fixons un seuil d'arrêt à 3 mois. Cela répond-il à votre inquiétude ? »"
     ]
    ],
    "erreurs": [
     "Se défendre avant d'avoir compris l'objection.",
     "Répondre à côté : la question pose un risque, la réponse parle d'un avantage.",
     "Mentir ou inventer un chiffre : « je reviens vers vous avec la source » est meilleur."
    ]
   }
  },
  "AF7": {
   "id": "AF7",
   "titre": "Flash · Combien coûte une réunion ?",
   "mode": "Binôme",
   "duree": 4,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "Réunion hebdomadaire : 8 participants, 1 heure, 45 semaines par an, coût horaire chargé 32 €."
   ],
   "taches": [
    "Calculez le coût d'une réunion et le coût annuel.",
    "Économie si 3 participants inutiles ne viennent plus.",
    "Économie si la durée passe à 30 minutes.",
    "Combinez les deux : coût annuel et économie."
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Coût = participants × durée × coût horaire.",
     "Annuel = coût × nombre de semaines."
    ],
    "rows": [
     [
      "Une réunion",
      "8 × 1 × 32 = 256 €"
     ],
     [
      "Par an",
      "256 × 45 = 11 520 €"
     ],
     [
      "3 participants en moins",
      "5 × 32 × 45 = 7 200 € ; économie 4 320 €"
     ],
     [
      "30 minutes",
      "8 × 0,5 × 32 × 45 = 5 760 € ; économie 5 760 €"
     ],
     [
      "Les deux",
      "5 × 0,5 × 32 × 45 = 3 600 € ; économie 7 920 €"
     ]
    ],
    "erreurs": [
     "Compter seulement la durée et oublier le coût des participants.",
     "Conclure qu'il faut supprimer la réunion : l'objectif est une réunion utile, pas aucune."
    ]
   }
  },
  "AX22": {
   "id": "AX22",
   "titre": "Annoncer le report du pilote",
   "mode": "Binôme",
   "duree": 10,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "Le pilote à Nancy centre prévu le 15 septembre est reporté de 8 semaines (nouvelle date : 10 novembre) car la livraison des véhicules est retardée. 14 tournées urbaines sont concernées.",
    "Publics : les conducteurs, les gestionnaires, trois clients impliqués, la directrice."
   ],
   "taches": [
    "Identifiez les publics et ce que chacun veut savoir.",
    "Structure : fait, cause, impact, plan, soutien, prochain point.",
    "Rédigez l'annonce aux conducteurs en 6 lignes.",
    "Choisissez le canal et le moment pour chaque public.",
    "Anticipez deux questions difficiles et leurs réponses."
   ],
   "livrable": "L'annonce aux conducteurs.",
   "corr": {
    "methode": [
     "Fait d'abord, sans enrobage.",
     "Cause factuelle, sans chercher de coupable.",
     "Impact sur le public concerné.",
     "Plan et prochaine information datée."
    ],
    "rows": [
     [
      "Directrice",
      "Avant tout le monde : appel, 5 minutes (décision et plan)"
     ],
     [
      "Conducteurs",
      "Réunion courte puis message écrit le même jour"
     ],
     [
      "Clients",
      "Appel personnalisé du responsable, puis e-mail"
     ],
     [
      "Questions difficiles",
      "« Pourquoi si tard ? » : date de la notification fournisseur. « Mes tournées changent-elles ? » : non avant le 10 novembre"
     ]
    ],
    "erreurs": [
     "Annoncer par e-mail sans l'expliquer à l'oral : les rumeurs partent.",
     "Minimiser : « petit retard » pour 8 semaines.",
     "Promettre une date sans l'avoir confirmée avec le fournisseur."
    ],
    "modele": "« Le pilote du dernier kilomètre ne démarrera pas le 15 septembre mais le 10 novembre, soit 8 semaines plus tard. La cause : la livraison des véhicules est retardée par le constructeur. Vos tournées actuelles ne changent pas avant cette date. La formation est reportée en conséquence. Je vous donne un point d'étape le 15 octobre et je reste disponible après la réunion pour vos questions. »",
    "retenir": "Fait, cause, impact, plan, prochain point : dans cet ordre, sans minimiser."
   }
  },
  "AX23": {
   "id": "AX23",
   "titre": "Réunion tendue : exploitation contre informatique",
   "mode": "Groupe de 4",
   "duree": 12,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "Rôles : Marc (exploitation), Admin (informatique), animateur, observateur.",
    "Marc : « L'informatique ne comprend rien à nos contraintes. » Admin : « Vous nous envoyez vos demandes à la dernière minute. »",
    "Mission de l'animateur : en 10 minutes, obtenir deux engagements (qui, quoi, quand). L'observateur remplit la grille."
   ],
   "taches": [
    "Animateur : poser le cadre (objectif, durée, règles).",
    "Reformuler chaque position et séparer faits et jugements.",
    "Chercher un intérêt commun.",
    "Obtenir deux engagements datés.",
    "Observateur : noter les reformulations, les jugements évités, les engagements obtenus."
   ],
   "livrable": "Deux engagements écrits et la grille remplie.",
   "corr": {
    "methode": [
     "Cadre : objectif, durée, règle de parole.",
     "Reformuler, puis séparer faits et jugements.",
     "Chercher l'intérêt commun.",
     "Conclure par des engagements qui / quoi / quand."
    ],
    "cols": [
     "Moment",
     "Phrase d'animateur"
    ],
    "widths": [
     1.8,
     6.4
    ],
    "rows": [
     [
      "Cadre",
      "« Nous avons 10 minutes pour sortir avec deux engagements, chacun parle à son tour. »"
     ],
     [
      "Reformuler",
      "« Marc, vous avez besoin d'une réponse rapide ; Admin, vous avez besoin de délais réalistes. »"
     ],
     [
      "Faits / jugements",
      "« Combien de demandes sont arrivées à moins de 24 h le mois dernier ? »"
     ],
     [
      "Intérêt commun",
      "« Vous voulez tous les deux des tournées sans panne. »"
     ],
     [
      "Engagements",
      "Marc dépose ses demandes par ticket avant 16 h pour J+2 ; Admin répond sous 24 h avec une estimation"
     ]
    ],
    "erreurs": [
     "Donner raison à l'un des deux : l'animateur perd sa neutralité.",
     "Rester sur des jugements (« ne comprend rien ») sans mesurer.",
     "Terminer sans engagement daté : la tension reviendra."
    ]
   }
  },
  "AX24": {
   "id": "AX24",
   "titre": "Mon plan d'action 30-60-90 jours",
   "mode": "Individuel puis binôme",
   "duree": 15,
   "chap": "Carnet · chapitre 8",
   "situation": [
    "Vous avez vu écoute, affirmation, écrit, argumentation, oral et gestion de la tension. Choisissez trois compétences à progresser dans votre contexte (alternance, stage, projet)."
   ],
   "taches": [
    "Choisissez 3 compétences.",
    "Pour chacune, une action à 30 jours, une à 60 jours, une à 90 jours.",
    "Un indicateur mesurable par action.",
    "Un premier pas demain (moins de 15 minutes).",
    "Partagez-le avec votre voisin et fixez une date de point."
   ],
   "livrable": "Le plan rempli dans le carnet.",
   "corr": {
    "methode": [
     "Une compétence = une action observable.",
     "Indicateur chiffré ou daté.",
     "Premier pas demain : se rendre un engagement impossible à ignorer."
    ],
    "cols": [
     "Compétence",
     "30 jours",
     "60 jours",
     "90 jours"
    ],
    "widths": [
     1.7,
     2.2,
     2.2,
     2.2
    ],
    "rows": [
     [
      "Écoute",
      "Reformuler dans 3 entretiens",
      "Faire une triade avec un collègue",
      "Recueillir un besoin et le faire valider"
     ],
     [
      "Écrit",
      "Objet précis sur 100 % de mes e-mails",
      "Compte rendu sous 24 h",
      "Un ticket ou une note de synthèse relue"
     ],
     [
      "Oral",
      "Pitch de 2 min devant un pair",
      "Prise de parole en réunion d'équipe",
      "Présentation à un public averti"
     ]
    ],
    "erreurs": [
     "Plan trop large : trois compétences, pas six.",
     "Aucune date de point : sans suivi, le plan s'oublie.",
     "Objectifs vagues : « mieux communiquer »."
    ]
   }
  },
  "AF8": {
   "id": "AF8",
   "titre": "Exit ticket · fin du jour 1",
   "mode": "Individuel",
   "duree": 5,
   "chap": "Carnet · tous chapitres",
   "situation": [
    "Sur une demi-page du carnet, en 5 minutes."
   ],
   "taches": [
    "Une idée que je retiens du jour 1.",
    "Une pratique que j'applique dès demain.",
    "Une question ou une difficulté qui reste.",
    "Un exemple de TransLor qui m'a aidé."
   ],
   "livrable": ""
  },
  "AF0": {
   "id": "AF0",
   "titre": "Accroche · Le SMS de la directrice",
   "mode": "Binôme",
   "duree": 5,
   "chap": "Carnet · chapitre 1",
   "situation": [
    "La directrice envoie ce SMS à Marc à 6 h 30 : « Décale le chargement de 14 h, il est prioritaire. »",
    "Marc a une réunion à 7 h. Il ne peut pas la joindre avant 10 h."
   ],
   "taches": [
    "Combien de lectures différentes du message trouvez-vous ? Au moins quatre.",
    "Qu'est-ce qui manque pour agir sans risque ?",
    "Réécrivez le SMS en une ligne."
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Lire mot à mot : verbe, objet, moment, personne.",
     "Lister ce qui est implicite.",
     "Réécrire avec qui, quoi, quand."
    ],
    "rows": [
     [
      "« Décale »",
      "Avancer ou retarder ? De combien ?"
     ],
     [
      "« le chargement de 14 h »",
      "Lequel, s'il y en a plusieurs à cette heure ?"
     ],
     [
      "« il est prioritaire »",
      "Le chargement décalé, ou celui qui prend sa place ?"
     ],
     [
      "Ce qui manque",
      "Nouvel horaire, raison, qui prévenir"
     ],
     [
      "Version claire",
      "« Marc, avance le chargement du client A de 14 h à 12 h, il passe avant les autres. Préviens les conducteurs. »"
     ]
    ],
    "erreurs": [
     "Agir sans vérifier : si Marc se trompe, le retard est pour lui.",
     "Reprocher à la directrice : elle est pressée, la clarification est à la charge des deux."
    ]
   }
  },
  "EX11b": {
   "id": "EX11b",
   "titre": "Évaluer de vrais documents sur l'authentification",
   "mode": "Binôme, ordinateur",
   "duree": 15,
   "chap": "Carnet · chapitre 4",
   "situation": [
    "Cinq vrais documents (relevés en octobre 2026). Retrouvez-les avec leur titre dans un moteur de recherche :",
    "D1 · NIST, SP 800-63B-4, Digital Identity Guidelines: Authentication and Authenticator Management (juillet 2025).",
    "D2 · ANSSI, Recommandations relatives à l'authentification multifacteur et aux mots de passe (2021).",
    "D3 · IT-Connect, « Nouveau guide ANSSI sur les mots de passe et l'authentification multifacteur » (11 octobre 2021).",
    "D4 · Slaw.ca, « Using multi-factor authentication blocks 99.9 % of account takeover attacks » (27 septembre 2019).",
    "D5 · ENISA, ENISA Threat Landscape 2025 (plusieurs versions).",
    "Grille en six questions, chacune notée 0 (non), 1 (en partie) ou 2 (oui) : Qui ? auteur identifié, compétent, indépendant. Quand ? date adaptée au sujet. Pourquoi ? informer plutôt que vendre. Sur quoi ? données et méthode visibles. Recoupé ? d'autres sources indépendantes concordent. Reproductible ? la méthode peut être refaite.",
    "Total sur 12 : 9 et plus = fiable ; 5 à 8 = à recouper ; 4 et moins = à écarter ou à citer avec prudence."
   ],
   "taches": [
    "Appliquez la grille de six questions à chaque document (brouillon ou dossier, section 5). D1 : quel verdict ?",
    "D2 : quel verdict ?",
    "D3 : quel verdict ?",
    "D4 : quel verdict ?",
    "D5 : quel verdict ?",
    "D4 : le chiffre « 99,9 % » renvoie-t-il à une étude précise nommée dans l'article ?",
    "Quel document est un relais à ne pas citer à la place du guide d'origine ?",
    "Avec Perplexity ou une autre IA (notez laquelle) : demandez-lui de noter D4 avec la grille. Est-elle d'accord avec vous ?"
   ],
   "types": [
    [
     "Origine : à retenir",
     "Relais : citer l'origine",
     "Position d'un acteur : à citer avec réserve",
     "À écarter"
    ],
    [
     "Origine : à retenir",
     "Relais : citer l'origine",
     "Position d'un acteur : à citer avec réserve",
     "À écarter"
    ],
    [
     "Origine : à retenir",
     "Relais : citer l'origine",
     "Position d'un acteur : à citer avec réserve",
     "À écarter"
    ],
    [
     "Origine : à retenir",
     "Relais : citer l'origine",
     "Position d'un acteur : à citer avec réserve",
     "À écarter"
    ],
    [
     "Origine : à retenir",
     "Relais : citer l'origine",
     "Position d'un acteur : à citer avec réserve",
     "À écarter"
    ],
    "on",
    [
     "D1",
     "D2",
     "D3",
     "D4",
     "D5"
    ],
    "on"
   ],
   "livrable": "Le tableau de notation de 5 documents réels → Dossier, section 5.",
   "corr": {
    "methode": [
     "Remonter de chaque document à son auteur et à sa date.",
     "Distinguer la source d'origine du relais (article qui commente).",
     "Noter avec la grille, puis décider : garder, citer avec prudence, écarter."
    ],
    "cols": [
     "Doc.",
     "Ce qu'on peut dire (notation indicative, discutable)"
    ],
    "widths": [
     0.8,
     8.0
    ],
    "rows": [
     [
      "Verdicts attendus",
      "D1 origine, à retenir · D2 origine, à retenir · D3 relais : citer le guide D2 · D4 position d'un acteur, à citer avec réserve · D5 origine, à retenir (noter version et date)"
     ],
     [
      "D1",
      "Source d'origine : organisme américain de normalisation, version finale (juillet 2025) qui remplace celle de mars 2020. Périmètre : systèmes d'identité de l'administration américaine ; référence technique mondiale. Indicatif : 10 à 11 / 12."
     ],
     [
      "D2",
      "Source d'origine : agence nationale française ; guide de 2021 (42 recommandations selon IT-Connect) qui recommande l'authentification multifacteur et déconseille le SMS comme second facteur (attaque par échange de carte SIM). Vérifier qu'une version plus récente n'existe pas. Indicatif : 10 / 12."
     ],
     [
      "D3",
      "Source secondaire : article qui relaie le guide D2. Utile pour le trouver, à ne pas citer à sa place : citer le guide. Indicatif : 6 / 12."
     ],
     [
      "D4",
      "Relais d'une annonce de Microsoft (2019) : le chiffre est attribué à des « études » non nommées ; l'article précise qu'il vise surtout des attaques automatisées mais son titre généralise. À citer comme « selon Microsoft (2019), non sourcé » ou à écarter. Indicatif : 4 / 12."
     ],
     [
      "D5",
      "Source d'origine (agence européenne, période du 1er juillet 2024 au 30 juin 2025 d'après sa page de présentation) : relever la version et la date, car plusieurs versions existent."
     ],
     [
      "Décision",
      "Fait : citer D1 ou D2 (d'origine). Position d'un acteur : D4, avec réserve. D3 : piste, pas une preuve."
     ],
     [
      "IA · note de D4",
      "Une IA note souvent D4 plus haut que vous : elle voit le titre et la date, pas l'absence d'étude nommée ni le financement. Elle résume ; vérifier la source reste votre travail."
     ]
    ],
    "erreurs": [
     "Citer l'article qui relaie au lieu du document d'origine.",
     "Croire un chiffre parce qu'il vient d'une grande entreprise.",
     "Citer sans version ni date : ces documents sont mis à jour."
    ],
    "retenir": "Un document réel se note comme un fictif : qui, quand, pourquoi, sur quoi, recoupé, reproductible. Et on cite l'origine, pas le relais."
   }
  },
  "EX0": {
   "id": "EX0",
   "titre": "Lire une offre d'emploi d'ingénieur : que demande-t-on vraiment ?",
   "mode": "Individuel, ordinateur",
   "duree": 10,
   "chap": "Carnet · chapitre 1",
   "situation": [
    "Deux offres réelles, relevées en octobre 2026 (elles peuvent avoir expiré) :",
    "ANSSI, « Analyste sécurité expert – Veille et vulnérabilités H/F » (réf. 2026-2261375, choisirleservicepublic.gouv.fr) : « assurer une veille quotidienne sur les vulnérabilités et codes d'exploitation » ; « rédiger les synthèses et les avis de sécurité » ; « participer aux échanges avec les CERT et CSIRT homologues ». Diplôme d'ingénieur ou master.",
    "Bouygues Telecom, « Analyste Vulnérabilité Confirmé H/F » (France Travail, publiée le 6 mars 2025) : veille continue des vulnérabilités, rapports orientés risques, vulgarisation de sujets techniques, « excellentes capacités de communication et pédagogie ».",
    "À vous : trouvez une offre réelle d'ingénieur dans le métier que vous visez (France Travail, APEC, site d'une entreprise ou talents.ssi.gouv.fr)."
   ],
   "taches": [
    "Notez l'employeur, l'intitulé, la date et l'adresse de votre offre.",
    "Soulignez les verbes qui concernent chercher ou veiller, écrire, présenter : combien de verbes de ce type trouvez-vous ?",
    "L'offre demande-t-elle explicitement de la veille ?",
    "Associez trois verbes aux objectifs du syllabus (O1, O2, O3, P1, P2).",
    "Quelle compétence de cette offre ce cours vous fera-t-il travailler en priorité ?",
    "Avec ChatGPT ou une autre IA (notez laquelle) : collez l'offre et demandez « quelles compétences de communication attend-on ? ». Combien de compétences l'IA ajoute-t-elle que vous n'aviez pas relevées ?"
   ],
   "types": [
    null,
    "num",
    "on",
    null,
    null,
    "num"
   ],
   "livrable": "Votre offre cible et la correspondance avec les objectifs → Dossier, section 0.",
   "corr": {
    "methode": [
     "Repérer les verbes d'action : veiller, rédiger, vulgariser, présenter.",
     "Relier chaque verbe à un objectif du syllabus.",
     "Garder la date et l'adresse : une offre disparaît, la trace reste."
    ],
    "cols": [
     "Extrait de l'offre",
     "Objectif du syllabus"
    ],
    "widths": [
     4.6,
     4.2
    ],
    "rows": [
     [
      "ANSSI : « assurer une veille quotidienne sur les vulnérabilités »",
      "O3 : chercher, évaluer, valider (et projet tutoré)"
     ],
     [
      "ANSSI : « rédiger les synthèses et les avis de sécurité »",
      "P2 : restituer par écrit ; O1 : un avis recommande, donc argumente"
     ],
     [
      "ANSSI : échanges avec les CERT et CSIRT homologues",
      "P1 : communiquer en posture d'ingénieur"
     ],
     [
      "Bouygues Telecom : rapports orientés risques",
      "P2 : restituer ; O1 : argumenter à partir de faits"
     ],
     [
      "Bouygues Telecom : vulgariser des sujets techniques",
      "O2 : maîtriser l'information spécialisée, puis la traduire"
     ],
     [
      "Limite",
      "Deux offres ne forment pas un échantillon : l'objectif est d'apprendre à lire une offre, pas de conclure sur « le » marché"
     ],
     [
      "IA · compétences ajoutées",
      "Souvent 1 à 3 : écrire des synthèses, vulgariser, travailler avec d'autres équipes. Retenez celles que l'offre dit réellement ; rejetez celles que l'IA invente."
     ]
    ],
    "erreurs": [
     "Lister les compétences techniques et oublier les verbes de communication.",
     "Citer une offre sans date ni adresse.",
     "Généraliser à partir d'une seule offre."
    ],
    "modele": [
     "Employeur : (exemple) un hébergeur ; intitulé : ingénieur sécurité ; offre du 12/10/2026. Verbes : surveiller les alertes (O3), rédiger une note de risque pour la direction (P2), présenter au comité de sécurité (P1) : trois verbes de communication. Veille demandée : oui. Priorité pour moi : rédiger une note courte et sourcée."
    ],
    "modele_titre": "Exemple de réponse (offre fictive)",
    "retenir": "Une offre d'ingénieur demande de chercher, de rédiger et de convaincre autant que de maîtriser la technique."
   }
  },
  "V4": {
   "id": "V4",
   "titre": "Monter sa veille en 15 minutes",
   "mode": "Individuel, ordinateur",
   "duree": 15,
   "chap": "Carnet · chapitre 3",
   "situation": [
    "Votre question de décision (EX1) doit rester d'actualité pendant le projet. Vous mettez en place une veille minimale avec des outils gratuits.",
    "Outils proposés : Google Alerts (alerte sur une requête, reçue par e-mail ou en flux RSS) ; Inoreader (lecteur de flux RSS, plan gratuit de 150 abonnements) ; le flux RSS du CERT-FR (https://cert.cyber.gouv.fr/flux-rss/).",
    "Aucune donnée personnelle ou confidentielle dans ces outils. Si un compte est exigé, utilisez l'adresse de l'école."
   ],
   "taches": [
    "Écrivez la requête de votre alerte (guillemets, OR) et créez l'alerte : est-elle créée ?",
    "Dans un lecteur de flux, ajoutez trois sources de types différents (institutionnelle, scientifique, presse ou éditeur) : notez-les.",
    "Combien d'articles non lus apparaissent après 5 minutes ?",
    "Exportez votre liste au format OPML : l'export a-t-il réussi ?",
    "Parmi les articles, repérez un signal fort et un signal faible (peu cité mais important) : justifiez.",
    "Avec Claude ou une autre IA (notez laquelle) : demandez-lui 5 sources à suivre sur votre question. Combien existent, publient encore et sont utiles ?"
   ],
   "types": [
    "on",
    null,
    "num",
    "on",
    null,
    "num"
   ],
   "livrable": "Votre plan de veille (requête, trois sources, fréquence) et votre journal de sources → Dossier, section 19.",
   "corr": {
    "methode": [
     "Écrire une requête précise (opérateurs vus en EX8).",
     "Créer l'alerte Google Alerts.",
     "Abonner un lecteur de flux à trois sources de types différents.",
     "Exporter en OPML pour ne pas dépendre d'un outil.",
     "Trier : signal fort ou faible, puis noter date et action."
    ],
    "cols": [
     "Point",
     "À retenir"
    ],
    "widths": [
     2.4,
     6.4
    ],
    "rows": [
     [
      "1 · Requête",
      "Écrivez la requête comme à l'EX8 : passkeys OR « passwordless authentication » -banque. Trop large = du bruit ; trop étroite = rien."
     ],
     [
      "2 · Google Alerts",
      "Ouvrir google.com/alerts avec un compte Google ; saisir la requête ; « Afficher les options » : choisir la fréquence et l'envoi par e-mail ou par flux RSS ; créer l'alerte. Elle apparaît dans la liste de vos alertes."
     ],
     [
      "3 · Lecteur de flux",
      "Créer un compte gratuit Inoreader ; ajouter trois flux de types différents : une institutionnelle (CERT-FR : https://cert.cyber.gouv.fr/flux-rss/), une scientifique (flux d'un dépôt d'articles), une presse ou éditeur (à pondérer)."
     ],
     [
      "4 · Plan gratuit",
      "Inoreader : 150 abonnements, 30 règles, 50 filtres en gratuit d'après sa page tarifs (consultée le 23/10/2026) : largement suffisant ici."
     ],
     [
      "5 · Lecture après 5 minutes",
      "Le nombre d'articles non lus dépend des flux (de quelques dizaines à quelques centaines) ; ne pas tout lire : trier."
     ],
     [
      "6 · Export OPML",
      "L'export OPML (menu des préférences ou de l'import/export du lecteur) donne un fichier de votre liste de flux. Un outil peut disparaître (Pocket a fermé le 8 juillet 2025, Netvibes le 2 juin 2025) ; le format reste."
     ],
     [
      "7 · Signal fort ou faible",
      "Fort : cité par plusieurs sources indépendantes. Faible : rare, ambigu, mais qui pourrait changer la décision. Un signal faible se vérifie avant de s'y fier : on cherche une deuxième source."
     ],
     [
      "8 · Carnet de veille",
      "Notez date de lecture, source, une ligne de résumé et l'action (garder, recouper, écarter) : une veille se refait et se date."
     ]
    ],
    "erreurs": [
     "S'abonner à trente sources et ne rien lire.",
     "Une seule source, ou trois sources du même éditeur.",
     "Ne pas noter la date de lecture : une veille se refait et se date."
    ],
    "modele": [
     "Question : « Faut-il des passkeys chez TransLor ? » Requête : passkeys OR « passwordless authentication ». Sources : flux du CERT-FR (institutionnelle), flux d'un dépôt d'articles en sécurité (scientifique), blog d'un éditeur (commerciale, à pondérer). Fréquence : 10 minutes le lundi. Signal faible : un billet isolé signale un contournement des passkeys, à recouper avant d'en tenir compte."
    ],
    "modele_titre": "Exemple de plan de veille (fictif)",
    "retenir": "Une veille se réduit à : une requête, trois sources, une fréquence, une date. L'export OPML la rend portable."
   }
  },
  "V5": {
   "id": "V5",
   "titre": "Veille vulnérabilités : croiser NVD, EUVD, KEV et EPSS",
   "mode": "Binôme, ordinateur",
   "duree": 15,
   "chap": "Carnet · chapitre 9",
   "situation": [
    "Le CERT-FR publie des avis ; la direction de TransLor demande : faut-il traiter cette vulnérabilité cette semaine ? Choisissez une CVE récente parmi les cinq dernières ajoutées au catalogue KEV de la CISA (vulnérabilités exploitées).",
    "Quatre sources à croiser : NVD (nvd.nist.gov, gravité CVSS), EUVD (base de l'ENISA, euvd.enisa.europa.eu), KEV (catalogue des vulnérabilités exploitées de la CISA, cisa.gov) et EPSS (first.org/epss : probabilité d'exploitation dans les 30 jours).",
    "Notez la date de consultation de chaque source : elles changent chaque jour."
   ],
   "taches": [
    "Notez l'identifiant CVE, le produit concerné et la date d'ajout au KEV.",
    "Dans NVD, quel est le score CVSS ? (le nombre)",
    "La CVE figure-t-elle dans l'EUVD ?",
    "Dans EPSS, quelle est la probabilité d'exploitation dans les 30 jours, en % ? (le nombre)",
    "Décision pour TransLor (hypothèse : le produit est installé et exposé sur Internet).",
    "Justifiez en deux phrases, avec les sources."
   ],
   "types": [
    null,
    "num",
    "on",
    "num",
    [
     "Cette semaine",
     "Ce mois-ci",
     "Surveiller"
    ],
    null
   ],
   "livrable": "Une fiche de veille sur une CVE : quatre sources, date, décision justifiée → Dossier, section 20 (elle alimente la section 16).",
   "corr": {
    "methode": [
     "Gravité (CVSS) n'est pas risque : il faut aussi l'exploitation réelle et l'exposition.",
     "KEV : exploitation constatée. EPSS : probabilité estimée.",
     "Citer la source et la date de chaque valeur.",
     "Décider avec une règle explicite, puis dire la réserve."
    ],
    "cols": [
     "Source",
     "Ce qu'elle dit, et sa limite"
    ],
    "widths": [
     1.8,
     7.0
    ],
    "rows": [
     [
      "NVD / CVE",
      "Description de la faille et score CVSS (gravité théorique, de 0 à 10). Ne dit rien de l'exposition de TransLor"
     ],
     [
      "KEV (CISA)",
      "Liste des vulnérabilités dont l'exploitation est constatée ; formats JSON et CSV gratuits, mise à jour quasi quotidienne "
     ],
     [
      "EPSS (FIRST)",
      "Probabilité d'exploitation sous 30 jours, calculée par un modèle, mise à jour quotidienne, données libres (page FIRST lue le 23/10/2026)"
     ],
     [
      "EUVD (ENISA)",
      "Base européenne lancée officiellement le 13 mai 2025 : agrège CSIRT, KEV et programme CVE (Infosecurity Magazine) ; compare avec NVD"
     ],
     [
      "Règle indicative",
      "Dans le KEV et exposée : cette semaine. Gravité élevée sans exploitation constatée : ce mois-ci. Sinon : surveiller. (règle pédagogique, à adapter)"
     ],
     [
      "Valeurs",
      "Elles dépendent de la CVE choisie : il n'y a pas une réponse unique, mais une méthode"
     ]
    ],
    "erreurs": [
     "Prendre le score CVSS pour le risque.",
     "Ne pas dire si le produit est réellement présent chez soi.",
     "Recopier une valeur sans date ni adresse."
    ],
    "modele": [
     "CVE choisie : (exemple) CVE-AAAA-NNNNN, produit X, ajoutée au KEV le jj/mm. NVD : CVSS 9,8. EUVD : présente. EPSS : 74 % (consulté le jj/mm). Décision : cette semaine. Justification : exploitation constatée (KEV) et probabilité élevée (EPSS) ; réserve : à confirmer que la version installée est concernée."
    ],
    "modele_titre": "Exemple de fiche de veille (valeurs fictives)",
    "retenir": "Une décision de sécurité croise la gravité, l'exploitation réelle et l'exposition de l'organisation."
   }
  },
  "V1": {
   "id": "V1",
   "titre": "Kodak « faute de veille » : le récit est-il étayé ?",
   "mode": "Équipes",
   "duree": 15,
   "chap": "Carnet · chapitre 6",
   "situation": [
    "Un support de cours présente Kodak comme une chute « par manque de veille ». Un article reprend : « Kodak a disparu faute de veille technologique. »",
    "Faits relevés dans deux sources (PetaPixel 2017, d'après un entretien avec l'inventeur ; NPR, janvier 2012) :",
    "En 1975, Steven Sasson, ingénieur chez Kodak, construit le premier appareil photo numérique (environ 3,6 kg, 0,01 mégapixel, 23 secondes par image).",
    "Selon Sasson, les dirigeants n'ont pas vu l'intérêt de l'invention et ne voulaient pas nuire à l'activité argentique, alors très rentable.",
    "Kodak est entré en procédure de faillite en 2012 et en est sorti en 2013."
   ],
   "taches": [
    "Placez le récit dans le modèle de Toulmin : affirmation, donnée, garantie.",
    "Les faits ci-dessus montrent-ils un manque d'information chez Kodak ?",
    "Quelle autre explication les faits soutiennent-ils ?",
    "Réécrivez l'affirmation avec un qualificatif et une réserve.",
    "Avec Gemini ou une autre IA (notez laquelle) : demandez « Pourquoi Kodak a-t-elle fait faillite ? ». Sa réponse évoque-t-elle plusieurs causes ?"
   ],
   "types": [
    null,
    "on",
    null,
    null,
    "on"
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Affirmation, donnée, garantie : la garantie est-elle étayée ?",
     "Chercher dans les faits ce qui contredit le récit.",
     "Réécrire avec qualificatif et réserve."
    ],
    "cols": [
     "Case",
     "Contenu"
    ],
    "widths": [
     2.2,
     6.6
    ],
    "rows": [
     [
      "Affirmation",
      "« Kodak a disparu faute de veille technologique. »"
     ],
     [
      "Donnée",
      "Kodak a inventé l'appareil numérique en 1975 : l'information était chez elle"
     ],
     [
      "Garantie implicite",
      "« Qui ne veille pas échoue » : elle ne s'applique pas ici, puisque Kodak savait"
     ],
     [
      "Deux erreurs",
      "« A disparu » : Kodak est sortie de procédure en 2013. « Faute de veille » : les faits indiquent plutôt un choix de protéger l'argentique"
     ],
     [
      "Réserve",
      "Source unique pour le choix de la direction (le témoignage de l'inventeur) ; les causes de la faillite n'ont pas été étudiées ici"
     ],
     [
      "IA · explication de l'IA",
      "Souvent oui : l'IA cite l'argentique rentable, le retard sur le numérique, la concurrence. Elle écrit sans date ni source : comparez avec les faits lus."
     ]
    ],
    "erreurs": [
     "Reprendre un récit célèbre sans chercher d'où il vient.",
     "Confondre information disponible et décision prise.",
     "Remplacer une cause unique par une autre cause unique."
    ],
    "modele": [
     "« Kodak connaissait la technologie numérique dès 1975, puisqu'un de ses ingénieurs l'a inventée (PetaPixel, 2017). Selon cet ingénieur, la direction a préféré protéger l'activité argentique : la difficulté semble donc venir d'une décision plutôt que d'un défaut de veille. Réserve : un seul témoignage ; les causes de la faillite de 2012 ne sont pas étudiées ici. »"
    ],
    "modele_titre": "Phrase honnête",
    "retenir": "La veille apporte l'information ; il faut encore décider d'agir. Un récit célèbre se vérifie comme n'importe quelle source."
   }
  },
  "V2": {
   "id": "V2",
   "titre": "Même chiffre, deux lectures : le chiffre d'affaires d'Inditex",
   "mode": "Binôme",
   "duree": 15,
   "chap": "Carnet · chapitre 6",
   "situation": [
    "Deux phrases exactes sur le même groupe (Inditex, première moitié de l'exercice 2025, d'après Retail Gazette, septembre 2025) :",
    "« Le chiffre d'affaires a augmenté de 1,6 %. » (données publiées, 18,4 milliards d'euros)",
    "« Le chiffre d'affaires a augmenté de 5,1 %. » (à taux de change constants)",
    "Un support de cours écrit seulement « 1,6 %, bien en dessous des attentes » : cette dernière partie n'est pas confirmée par l'article lu."
   ],
   "taches": [
    "Quelle phrase correspond aux données publiées ?",
    "Quel est l'écart entre les deux chiffres, en points de pourcentage ? (le nombre)",
    "Pour juger la dynamique commerciale hors effet des devises, quel chiffre citez-vous ?",
    "Écrivez une phrase honnête qui donne les deux chiffres et la source.",
    "Avec Copilot ou une autre IA (notez laquelle) : demandez « De combien le chiffre d'affaires d'Inditex a-t-il progressé ? ». Précise-t-elle les conditions (données publiées ou taux de change constants) ?"
   ],
   "types": [
    [
     "La phrase à 1,6 %",
     "La phrase à 5,1 %"
    ],
    "num",
    [
     "Données publiées",
     "Taux de change constants"
    ],
    null,
    "on"
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Demander : par rapport à quoi, mesuré comment ?",
     "Distinguer chiffre publié et chiffre à taux de change constants.",
     "Citer les deux, avec la source."
    ],
    "cols": [
     "Question",
     "Réponse"
    ],
    "widths": [
     3.0,
     5.8
    ],
    "rows": [
     [
      "Publié",
      "Chiffre en euros, avec l'effet des variations de change : +1,6 %"
     ],
     [
      "Taux de change constants",
      "Même activité, sans l'effet des devises : +5,1 %"
     ],
     [
      "Écart",
      "3,5 points : c'est l'effet des devises, pas une erreur"
     ],
     [
      "Quel chiffre citer ?",
      "Pour la dynamique commerciale, le chiffre à taux de change constants (indicatif) ; pour les comptes en euros, le chiffre publié. Dans tous les cas, dire lequel"
     ],
     [
      "Contrôle",
      "L'article lu ne confirme pas « bien en dessous des attentes » : ne pas le reprendre sans source"
     ],
     [
      "IA · réponse de l'IA",
      "Souvent non : un seul chiffre, sans condition ni date. Il faut demander la source et la période."
     ]
    ],
    "erreurs": [
     "Citer 1,6 % sans dire « publié ».",
     "Comparer un chiffre publié à un chiffre à taux constants.",
     "Ajouter « attentes » sans source."
    ],
    "modele": [
     "« Selon Retail Gazette (septembre 2025), le chiffre d'affaires d'Inditex au premier semestre a progressé de 1,6 % en données publiées (18,4 milliards d'euros) et de 5,1 % à taux de change constants. »"
    ],
    "modele_titre": "Phrase honnête",
    "retenir": "Un pourcentage sans base ni mode de mesure n'est pas un fait. Deux chiffres peuvent être vrais en même temps."
   }
  },
  "V7": {
   "id": "V7",
   "titre": "Critiquer un classement ou un comparateur",
   "mode": "Binôme, ordinateur",
   "duree": 15,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "Les benchmarks s'appuient souvent sur des classements ou des sites d'avis. Qui les finance, et comment sont-ils construits ?",
    "Choisissez une page de classement ou de comparaison dans votre domaine (« meilleur gestionnaire de mots de passe », « comparatif de solutions de sauvegarde », résumé public d'un classement d'analystes, site d'avis).",
    "Exemple connu : le témoignage de Colas publié par le fournisseur Sindup (fr.sindup.com, page non datée) ne donne aucun chiffre de retour sur investissement : c'est une position du fournisseur.",
    "Où trouver les réponses ? Sur la page même et ses pages voisines : « À propos », « Méthodologie » ou « Comment nous testons », mentions « partenaire », « affilié », « sponsorisé », mentions légales, logos de partenaires. Si rien n'est indiqué, répondez « non indiqué » : c'est déjà une information."
   ],
   "taches": [
    "Notez l'adresse, la date et l'auteur de la page.",
    "Qui finance le classement ?",
    "La méthode (critères, mesures, nombre d'avis) est-elle publiée ? Cherchez « Méthodologie » ou « Comment nous testons ».",
    "Combien de critères sont réellement mesurables ? (le nombre)",
    "Comment citeriez-vous ce classement dans votre état de l'art ?",
    "Avec Le Chat (Mistral) ou une autre IA (notez laquelle) : demandez « Quel est le meilleur … ? » pour votre domaine. Indique-t-elle qui finance ses sources ?"
   ],
   "types": [
    null,
    [
     "Publicité ou affiliation",
     "Un éditeur évalué",
     "Indépendant déclaré",
     "Non indiqué"
    ],
    "on",
    "num",
    null,
    "on"
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Identifier l'auteur et celui qui finance.",
     "Chercher la méthode : critères, données, nombre d'avis.",
     "Classer : fait, position, publicité.",
     "Citer avec sa nature."
    ],
    "cols": [
     "Type de page",
     "Comment la traiter"
    ],
    "widths": [
     3.0,
     5.8
    ],
    "rows": [
     [
      "Témoignage client publié par le fournisseur",
      "Position du fournisseur ; sans chiffre vérifiable (cas Colas / Sindup lu le 23/10/2026)"
     ],
     [
      "Comparatif avec liens d'affiliation",
      "Le revenu dépend du clic : à pondérer, chercher une autre source"
     ],
     [
      "Classement d'un cabinet d'analystes",
      "Vérifier qui l'a commandé et si la méthode est publiée (selon le classement choisi)"
     ],
     [
      "Site d'avis d'utilisateurs",
      "Nombre d'avis, avis vérifiés ou non, biais de sélection"
     ],
     [
      "Phrase possible",
      "« Selon <site> (date), <produit> est classé premier ; la méthode n'est pas publiée et le site perçoit une commission : position à recouper. »"
     ],
     [
      "IA · meilleur choix selon l'IA",
      "Rarement. Une IA réécrit des classements existants sans dire qui les finance : remontez à la page d'origine."
     ],
     [
      "Où chercher",
      "« À propos », « Méthodologie », mentions légales, mentions « affilié » ou « sponsorisé ». Absence d'indication = « non indiqué », à signaler dans la citation."
     ]
    ],
    "erreurs": [
     "Prendre un classement pour une mesure.",
     "Ignorer le financement.",
     "Ne pas citer la date."
    ],
    "modele": [
     "« Le comparatif de <site> (consulté le jj/mm) classe l'outil A premier selon 5 critères, dont 2 seulement mesurables ; le site perçoit une commission d'affiliation. Je le cite comme position, après recoupement avec la documentation de l'éditeur et un rapport indépendant. »"
    ],
    "modele_titre": "Exemple de citation prudente",
    "retenir": "Un classement est une source comme une autre : on cherche qui l'a écrit, qui le finance et comment il est construit."
   }
  },
  "V8": {
   "id": "V8",
   "titre": "Écart réel ou bruit ? Deux comparaisons de mesures",
   "mode": "Individuel, tableur",
   "duree": 15,
   "chap": "Carnet · chapitre 7",
   "situation": [
    "TransLor teste 4 outils de sauvegarde (5 mesures chacun, en minutes, valeurs fictives). A est-il plus rapide que B ? C plus rapide que D ?",
    "Comparez l'écart entre outils au bruit. Écart-type pas à pas : page précédente ; tableur : =MOYENNE(plage), =ECARTYPE(plage).",
    "Règle : rapport < 1 bruit ; > 2 probablement réel."
   ],
   "taches": [
    "A et B : écart entre les moyennes, en minutes.",
    "A : écart-type, arrondi à 0,1.",
    "A–B : l'écart des moyennes est-il plus petit ou plus grand que l'écart-type ?",
    "A–B : que concluez-vous ?",
    "C et D : écart entre les moyennes, en minutes.",
    "C–D : que concluez-vous ?",
    "Écrivez une phrase de conclusion pour A–B et une pour C–D, comme dans un état de l'art.",
    "Avec Perplexity ou une autre IA (notez laquelle) : demandez-lui si « B est meilleur que A ». Donne-t-elle ses calculs, et sont-ils exacts (refaites-les) ?"
   ],
   "types": [
    "num",
    "num",
    [
     "Plus petit",
     "Plus grand"
    ],
    [
     "Écart réel",
     "Bruit (aucune différence établie)",
     "À refaire avec plus de mesures"
    ],
    "num",
    [
     "Écart réel",
     "Bruit (aucune différence établie)",
     "À refaire avec plus de mesures"
    ],
    null,
    "on"
   ],
   "livrable": "Un tableau de mesures avec moyennes et dispersion, et votre phrase de conclusion → Dossier, section 21.",
   "corr": {
    "methode": [
     "Calculer la moyenne et la dispersion de chaque outil.",
     "Comparer l'écart des moyennes à la dispersion.",
     "Conclure avec prudence : cinq mesures, c'est peu."
    ],
    "cols": [
     "Comparaison",
     "Résultat"
    ],
    "widths": [
     2.6,
     6.2
    ],
    "rows": [
     [
      "Écart-type de A, pas à pas",
      "Moyenne : 200 ÷ 5 = 40. Écarts à la moyenne : +1, −2, +5, 0, −4. Carrés : 1, 4, 25, 0, 16 ; somme = 46. Variance : 46 ÷ (5−1) = 11,5. Écart-type : √11,5 = 3,4. (Même résultat que =ECARTYPE.)"
     ],
     [
      "A et B",
      "Moyennes 40,0 et 39,6 : écart 0,4 ; écarts-types 3,4 et 3,9. L'écart (0,4) est bien plus petit que l'écart-type (3,4) : bruit. Conclusion : aucune différence établie."
     ],
     [
      "C et D",
      "Moyennes 52,0 et 42,0 : écart 10 ; écarts-types 1,6 et 1,6 : l'écart vaut plus de 6 écarts-types : probablement réel. Conclusion : D est plus rapide d'environ 10 minutes sur ces cinq mesures."
     ],
     [
      "Test statistique (facultatif)",
      "Un test de Student (fonction de tableur, ou avis d'un statisticien) donne environ 0,87 pour A–B et 0,00001 pour C–D (calcul fait à la construction du cours). Plus ce nombre est petit, moins l'écart s'explique par le hasard."
     ],
     [
      "t-test et ANOVA",
      "À connaître de nom : le t-test compare deux groupes, l'ANOVA plus de deux. Pour les utiliser correctement, demandez conseil à un statisticien."
     ],
     [
      "Phrases possibles",
      "A–B : « l'écart observé (0,4 min) est inférieur à la dispersion des mesures ; aucune différence n'est établie. » C–D : « D est plus rapide d'environ 10 min sur ces cinq mesures ; à confirmer avec plus de mesures. »"
     ],
     [
      "IA · B meilleur que A ?",
      "Une IA répond souvent « oui, B est légèrement meilleur » en comparant 39,6 à 40,0, sans parler de la dispersion. Refaites le calcul : l'écart est du bruit."
     ]
    ],
    "erreurs": [
     "Conclure « B est meilleur » avec 0,4 minute d'écart.",
     "Oublier de dire le nombre de mesures.",
     "Croire qu'un test remplace la réflexion sur la façon de mesurer."
    ],
    "retenir": "Avant de classer deux solutions, comparer l'écart à la dispersion et dire le nombre de mesures."
   },
   "tableau": {
    "header": [
     "Outil",
     "1",
     "2",
     "3",
     "4",
     "5"
    ],
    "widths": [
     1.4,
     1,
     1,
     1,
     1,
     1
    ],
    "rows": [
     [
      "A",
      "41",
      "38",
      "45",
      "40",
      "36"
     ],
     [
      "B",
      "37",
      "44",
      "35",
      "43",
      "39"
     ],
     [
      "C",
      "52",
      "50",
      "53",
      "51",
      "54"
     ],
     [
      "D",
      "41",
      "43",
      "40",
      "42",
      "44"
     ]
    ]
   }
  },
  "AG1": {
   "id": "AG1",
   "titre": "Annexe G · SWOT appliqué à un choix de TransLor",
   "mode": "Individuel",
   "duree": 20,
   "chap": "Annexe G",
   "situation": [
    "TransLor envisage de passer à une sauvegarde hybride (copie locale et copie dans le cloud) : coût d'environ 1 800 € par an (fictif), restauration de 9 h à 3 h (fictif).",
    "Dressez un SWOT : forces et faiblesses (internes à TransLor), opportunités et menaces (externes)."
   ],
   "taches": [
    "Écrivez deux forces et deux faiblesses internes.",
    "Écrivez deux opportunités et deux menaces externes.",
    "Combien de vos éléments sont réellement internes ou externes à TransLor ? (le nombre)",
    "Formulez une action « force × opportunité » et une action « faiblesse × menace »."
   ],
   "types": [
    null,
    null,
    "num",
    null
   ],
   "livrable": "",
   "corr": {
    "methode": [
     "Interne : sous le contrôle de TransLor. Externe : on ne le contrôle pas.",
     "Un élément = un fait, avec sa source si possible.",
     "Croiser pour passer du constat à l'action."
    ],
    "cols": [
     "Case",
     "Exemple"
    ],
    "widths": [
     2.0,
     6.8
    ],
    "rows": [
     [
      "Forces (interne)",
      "Équipe informatique de trois personnes ; test de restauration déjà fait en juin"
     ],
     [
      "Faiblesses (interne)",
      "Un seul disque de trois ans ; compétence cloud limitée"
     ],
     [
      "Opportunités (externe)",
      "Offres de stockage à prix décroissant (à sourcer) ; guide d'un organisme public sur la règle 3-2-1"
     ],
     [
      "Menaces (externe)",
      "Rançongiciels visant les PME (à sourcer) ; dépendance à un fournisseur"
     ],
     [
      "Force × opportunité",
      "S'appuyer sur le test de juin pour négocier une offre cloud"
     ],
     [
      "Faiblesse × menace",
      "Remplacer le disque unique avant la prochaine campagne de rançongiciels"
     ]
    ],
    "erreurs": [
     "Classer « le prix du cloud baisse » dans les forces : c'est externe.",
     "Lister sans chiffre ni source.",
     "S'arrêter au tableau, sans action."
    ]
   },
   "notes_extra": ""
  },
  "M1": {
   "id": "M1",
   "titre": "Défi chrono : retrouver le texte officiel en 3 minutes",
   "mode": "Binômes, ordinateur",
   "duree": 15,
   "chap": "Carnet · chapitre 3",
   "outil": "Google (site:, filetype:), sites officiels",
   "situation": [
    "Trois documents à retrouver, 3 minutes chacun, avec une requête qui contient au moins un opérateur. Le lien final doit mener au site de l'organisme ou au journal officiel, pas à un blog qui le cite.",
    "① Le guide de l'ANSSI sur l'authentification multifacteur et les mots de passe (2021). ② La publication NIST SP 800-63B sur l'authentification. ③ Le texte officiel de la directive européenne NIS2 (directive (UE) 2022/2555)."
   ],
   "taches": [
    "Document ① : écrivez la requête gagnante et le nom de domaine du site trouvé.",
    "Document ② : même chose.",
    "Document ③ : même chose.",
    "Quel opérateur vous a fait gagner le plus de temps ?",
    "Avec ChatGPT ou une autre IA (notez laquelle) : demandez-lui l'adresse du document ③. L'adresse proposée s'ouvre-t-elle et mène-t-elle au bon texte ?"
   ],
   "types": [
    null,
    null,
    null,
    [
     "site:",
     "filetype:pdf",
     "guillemets",
     "intitle:",
     "OR"
    ],
    "on"
   ],
   "livrable": "Trois requêtes gagnantes à copier dans votre carnet → Dossier, section 4.",
   "corr": {
    "methode": [
     "Écrire le titre exact entre guillemets (ou le numéro du texte).",
     "Limiter au bon site avec site: (cyber.gouv.fr, nist.gov, eur-lex.europa.eu).",
     "Ajouter filetype:pdf si vous voulez le document, puis l'ouvrir : titre, date, version."
    ],
    "cols": [
     "Document",
     "Requête efficace (exemple)",
     "À contrôler"
    ],
    "widths": [
     1.4,
     3.4,
     3.2
    ],
    "rows": [
     [
      "① Guide ANSSI",
      "« authentification multifacteur » « mots de passe » site:cyber.gouv.fr filetype:pdf",
      "Titre exact « Recommandations relatives à l'authentification multifacteur et aux mots de passe », version de 2021 (ancien domaine : ssi.gouv.fr)."
     ],
     [
      "② NIST",
      "« 800-63B » site:nist.gov",
      "Prendre la version la plus récente : SP 800-63B-4 (juillet 2025) ; les anciennes versions restent en ligne."
     ],
     [
      "③ NIS2",
      "directive 2022/2555 site:eur-lex.europa.eu",
      "Numéro (UE) 2022/2555 ; texte du Journal officiel de l'Union européenne ; choisir la langue française."
     ],
     [
      "Opérateur gagnant",
      "site: pour presque tous les cas ; filetype:pdf pour le guide.",
      "Sans site:, les premiers résultats sont souvent des blogs ou des résumés."
     ],
     [
      "IA · adresse proposée",
      "Souvent une adresse plausible mais fausse ou périmée (page déplacée, version ancienne).",
      "Ouvrez toujours l'adresse : une IA propose, le site officiel prouve."
     ]
    ],
    "erreurs": [
     "Se contenter du premier résultat, un blog qui cite le guide : remontez au site de l'organisme.",
     "Oublier la version et la date du document.",
     "Taper la question entière au lieu des mots exacts du titre."
    ],
    "retenir": "Titre exact entre guillemets + site: = le document officiel en moins de 3 minutes."
   }
  },
  "M2": {
   "id": "M2",
   "titre": "Défi chrono : trouver l'article en accès libre",
   "mode": "Binômes, ordinateur",
   "duree": 15,
   "chap": "Carnet · chapitre 3",
   "outil": "Google Scholar, arXiv, HAL, Unpaywall, Zotero",
   "situation": [
    "Un article payant n'est pas un article inaccessible : l'auteur en dépose souvent une version gratuite (archive ouverte). Vous avez 5 minutes par article.",
    "Article 1 : Meyer L. A. et al. (2023), « How effective is multifactor authentication at deterring cyberattacks? ». Article 2 : un article payant de votre sujet, trouvé dans Google Scholar (ou, à défaut, tout article dont le PDF vous est refusé)."
   ],
   "taches": [
    "Article 1 : cherchez son titre exact entre guillemets dans Google Scholar. Combien de versions propose le lien « Toutes les versions » ?",
    "Article 1 : quelle est l'adresse de la version gratuite ?",
    "Article 2 : essayez dans l'ordre le lien [PDF] de Scholar, « Toutes les versions », HAL, arXiv, puis l'extension Unpaywall. Quelle voie a marché ?",
    "Si rien ne marche pour l'article 2 : notez la référence et le résumé, et indiquez « accès payant » dans votre fiche.",
    "Avec Gemini ou une autre IA (notez laquelle) : demandez le lien gratuit de l'article 2. Le lien proposé est-il réel ?"
   ],
   "types": [
    "num",
    null,
    [
     "Lien [PDF] de Scholar",
     "Toutes les versions",
     "HAL ou arXiv",
     "Unpaywall",
     "Aucune"
    ],
    null,
    "on"
   ],
   "livrable": "Une référence avec son lien d'accès libre, enregistrée dans Zotero → Dossier, section 17.",
   "corr": {
    "methode": [
     "Chercher le titre exact entre guillemets.",
     "Ouvrir « Toutes les versions » avant de payer quoi que ce soit.",
     "Tester une archive ouverte (HAL, arXiv), puis Unpaywall ; sinon noter « accès payant »."
    ],
    "cols": [
     "Étape",
     "Résultat attendu (article 1)"
    ],
    "widths": [
     1.8,
     6.2
    ],
    "rows": [
     [
      "Recherche",
      "Titre exact entre guillemets dans Scholar : la page de résultats propose une version arXiv (arxiv.org/abs/2305.00945) et la page de l'éditeur."
     ],
     [
      "Version gratuite",
      "arXiv : arxiv.org/abs/2305.00945 (version 1 du 1er mai 2023), PDF libre."
     ],
     [
      "Voies pour l'article 2",
      "1. Lien [PDF] à droite du résultat. 2. « Toutes les versions ». 3. HAL (hal.science) pour les travaux français, arXiv en informatique. 4. L'extension Unpaywall (unpaywall.org) signale une version légale gratuite. 5. Le bouton « Find Available PDF » de Zotero fait la même recherche."
     ],
     [
      "Si aucune version",
      "Ne pas contourner l'accès payant : citer le résumé comme tel, ou demander l'article par la bibliothèque de l'école."
     ],
     [
      "IA · lien proposé",
      "Souvent un lien inventé ou un site pirate : n'ouvrez que des adresses d'éditeurs, d'archives ouvertes ou d'institutions."
     ]
    ],
    "erreurs": [
     "Payer un article sans avoir cherché une version gratuite.",
     "Citer un article dont on n'a lu que le titre.",
     "Utiliser un site pirate : illégal et risqué pour le poste."
    ],
    "retenir": "Titre exact + « Toutes les versions » + archive ouverte : trois gestes avant de payer."
   }
  },
  "M3": {
   "id": "M3",
   "titre": "Mission : écrire la phrase honnête (source, chiffre, limite)",
   "mode": "Équipes",
   "duree": 20,
   "chap": "Carnet · chapitre 7",
   "outil": "modèle de phrase, IA (relecture)",
   "situation": [
    "Un état de l'art contient des phrases qui portent un chiffre. Chaque phrase suit le même modèle : « Selon [qui] ([année]), [chiffre avec ce qui est mesuré] ; [limite : échantillon, auteur, durée]. Verbe prudent. »",
    "Trois faits bruts. ① Étude de Microsoft (Meyer et al., 2023) : l'authentification multifacteur réduit de 99,22 % le risque de compromission de comptes Azure AD. ② Brochure d'un fournisseur de sauvegarde (2025) : « restauration 70 % plus rapide », sans méthode. ③ Test interne de TransLor (juin) : restauration en 9 h, un seul essai."
   ],
   "taches": [
    "Écrivez la phrase d'état de l'art pour le fait ①.",
    "Écrivez la phrase pour le fait ②.",
    "Écrivez la phrase pour le fait ③.",
    "Écrivez une quatrième phrase, avec une vraie source de votre sujet (EX12).",
    "Avec Copilot ou une autre IA (notez laquelle) : demandez-lui de rendre vos phrases « plus percutantes ». Garde-t-elle la limite et le verbe prudent ?"
   ],
   "types": [
    null,
    null,
    null,
    null,
    "on"
   ],
   "livrable": "Quatre phrases sourcées, à placer dans votre état de l'art → Dossier, section 13.",
   "corr": {
    "methode": [
     "Qui dit quoi, et quand ? (source + année).",
     "Qu'est-ce qui est mesuré, avec quel chiffre ?",
     "Quelle limite : auteur, échantillon, durée, méthode ?",
     "Un verbe prudent : « indique », « annonce », « suggère »."
    ],
    "cols": [
     "Fait",
     "Phrase possible"
    ],
    "widths": [
     1.2,
     7.0
    ],
    "rows": [
     [
      "①",
      "« Selon une étude de Microsoft sur ses propres comptes Azure AD (Meyer et al., 2023), l'authentification multifacteur réduit de 99,22 % le risque de compromission ; l'étude est réalisée par l'éditeur du service. »"
     ],
     [
      "②",
      "« Le fournisseur annonce une restauration 70 % plus rapide (brochure, 2025) ; la méthode et la base de comparaison ne sont pas publiées : à confirmer par un test. »"
     ],
     [
      "③",
      "« Lors d'un test interne en juin, la restauration a pris 9 heures (un seul essai) ; à confirmer par plusieurs mesures. »"
     ],
     [
      "④ votre sujet",
      "L'enseignant vérifie une phrase par équipe : la source est-elle ouverte et lue ? Le chiffre est-il bien celui de la source ? La limite est-elle dite ?"
     ],
     [
      "IA · plus percutant",
      "Une IA enlève souvent la limite et durcit le verbe (« prouve »). Remettez la limite : une phrase honnête est plus crédible qu'une phrase forte."
     ]
    ],
    "erreurs": [
     "Donner le chiffre sans dire ce qu'il mesure.",
     "Oublier l'auteur ou son intérêt (éditeur, fournisseur).",
     "Écrire « prouve » là où la source dit « suggère »."
    ],
    "retenir": "Une phrase d'état de l'art = source + chiffre + limite."
   }
  },
  "M4": {
   "id": "M4",
   "titre": "Défi chrono : que disait la page avant ?",
   "mode": "Binômes, ordinateur",
   "duree": 10,
   "chap": "Carnet · chapitre 4",
   "outil": "Wayback Machine (web.archive.org)",
   "situation": [
    "Une page peut être modifiée ou supprimée sans prévenir : le chiffre que vous avez cité a peut-être changé. La Wayback Machine (web.archive.org) conserve des copies datées de pages web.",
    "Prenez l'adresse d'une page de vos sources (EX12), ou à défaut la page d'accueil d'un fournisseur de sauvegarde."
   ],
   "taches": [
    "Collez l'adresse dans web.archive.org. Combien de copies datées existent ? (ordre de grandeur : aucune, quelques-unes, des centaines)",
    "Ouvrez la copie la plus ancienne et la plus récente : qu'est-ce qui a changé (chiffre, offre, texte) ?",
    "Votre page est-elle modifiée depuis que vous l'avez citée ?",
    "Écrivez comment vous citez la page : adresse, date de consultation, et au besoin l'adresse de la copie archivée."
   ],
   "types": [
    [
     "Aucune",
     "Quelques-unes",
     "Des centaines"
    ],
    null,
    "on",
    null
   ],
   "livrable": "La référence complète d'une page, avec date de consultation → Dossier, section 6.",
   "corr": {
    "methode": [
     "Coller l'adresse exacte de la page dans web.archive.org.",
     "Comparer deux dates avec le calendrier.",
     "Citer avec la date de consultation ; archiver soi-même si la page est importante."
    ],
    "cols": [
     "Étape",
     "Ce que vous devez constater"
    ],
    "widths": [
     1.8,
     6.2
    ],
    "rows": [
     [
      "Copies",
      "Une page très consultée a souvent des centaines de copies ; une page récente ou peu visible peut n'en avoir aucune."
     ],
     [
      "Comparaison",
      "Les chiffres, les prix, les promesses (« −70 % ») et la date de mise à jour changent souvent : c'est la preuve que citer sans date est fragile."
     ],
     [
      "Page modifiée ?",
      "Si oui, citez la version que vous avez lue, avec sa date."
     ],
     [
      "Citation modèle",
      "« Nom de l'organisme, titre de la page, adresse, consulté le jj/mm/aaaa (copie archivée : adresse web.archive.org). »"
     ]
    ],
    "erreurs": [
     "Citer une page sans date de consultation.",
     "Croire qu'une page en ligne est stable.",
     "Ne pas archiver une page clé pour votre argument."
    ],
    "retenir": "Une page sans date de consultation ne se vérifie pas : datez, et archivez ce qui compte."
   }
  }
 },
 "quiz": [
  {
   "id": "G01",
   "fam": "G",
   "famille": "Argumenter et informer",
   "pts": 1,
   "q": "Dans le modèle de Toulmin, la garantie…",
   "options": [
    "relie les données à l'affirmation",
    "est la conclusion",
    "est la preuve chiffrée",
    "est la réfutation"
   ],
   "bonne": 0,
   "expl": "Elle explicite pourquoi ces données mènent à cette conclusion."
  },
  {
   "id": "G02",
   "fam": "G",
   "famille": "Argumenter et informer",
   "pts": 1,
   "q": "« Tout le monde le fait, donc nous devons le faire. » Quel sophisme ?",
   "options": [
    "Attaque contre la personne",
    "Appel à la popularité",
    "Pente glissante",
    "Faux dilemme"
   ],
   "bonne": 1,
   "expl": "Ce que font les autres ne prouve pas que ce soit adapté à notre cas."
  },
  {
   "id": "G03",
   "fam": "G",
   "famille": "Argumenter et informer",
   "pts": 1,
   "q": "Qu'est-ce qu'une source primaire ?",
   "options": [
    "Un article de presse qui cite un rapport",
    "Une encyclopédie",
    "Les données ou le témoignage d'origine, comme un rapport d'essai",
    "Un manuel de cours"
   ],
   "bonne": 2,
   "expl": "On remonte à l'origine de l'information."
  },
  {
   "id": "G04",
   "fam": "G",
   "famille": "Argumenter et informer",
   "pts": 2,
   "q": "Premier réflexe pour valider une affirmation chiffrée ?",
   "options": [
    "La répéter si elle est citée souvent",
    "Prendre la plus récente",
    "Demander à un collègue",
    "Remonter à la source d'origine et la recouper"
   ],
   "bonne": 3,
   "expl": "Un chiffre cité plusieurs fois peut venir d'une seule source."
  },
  {
   "id": "G05",
   "fam": "G",
   "famille": "Argumenter et informer",
   "pts": 2,
   "q": "Le biais de confirmation, c'est…",
   "options": [
    "chercher surtout ce qui confirme son idée de départ",
    "croire les experts",
    "douter de tout",
    "oublier les chiffres"
   ],
   "bonne": 0,
   "expl": "On corrige en cherchant des arguments contraires."
  },
  {
   "id": "G06",
   "fam": "G",
   "famille": "Argumenter et informer",
   "pts": 2,
   "q": "Un état de l'art, c'est…",
   "options": [
    "une liste de sources",
    "un panorama comparé et critique des solutions selon des critères explicites",
    "un résumé d'un seul article",
    "une opinion argumentée"
   ],
   "bonne": 1,
   "expl": "Il compare, il ne fait pas que lister."
  },
  {
   "id": "G07",
   "fam": "G",
   "famille": "Argumenter et informer",
   "pts": 3,
   "q": "Une IA générative propose une référence bibliographique. Que faire ?",
   "options": [
    "La citer telle quelle",
    "La citer si le titre est crédible",
    "Vérifier qu'elle existe réellement avant de la citer",
    "La supprimer sans vérifier"
   ],
   "bonne": 2,
   "expl": "Ces outils peuvent produire des références inexistantes."
  },
  {
   "id": "R01",
   "fam": "R",
   "famille": "Chercher l'information",
   "pts": 1,
   "q": "Dans Google Scholar, que font les guillemets autour de plusieurs mots ?",
   "options": [
    "Ils excluent ces mots",
    "Ils limitent aux articles récents",
    "Ils cherchent seulement dans le titre",
    "Ils cherchent l'expression exacte"
   ],
   "bonne": 3,
   "expl": "Les guillemets cherchent la suite exacte de mots ; le tiret exclut un mot ; la période se règle avec le filtre de dates."
  },
  {
   "id": "R02",
   "fam": "R",
   "famille": "Chercher l'information",
   "pts": 1,
   "q": "Quel opérateur permet d'accepter plusieurs synonymes dans une même requête ?",
   "options": [
    "OR (ou)",
    "Le tiret devant le mot",
    "Les guillemets",
    "Le point d'exclamation"
   ],
   "bonne": 0,
   "expl": "« cloud » OR « nuage » accepte les deux termes ; le tiret exclut, les guillemets fixent une expression."
  },
  {
   "id": "R03",
   "fam": "R",
   "famille": "Chercher l'information",
   "pts": 1,
   "q": "Pourquoi chercher aussi en anglais sur un sujet technique ?",
   "options": [
    "Les sources françaises sont toujours moins fiables",
    "Une grande part des publications techniques y est écrite",
    "Pour obtenir plus de résultats, quelle que soit leur qualité",
    "Parce que Scholar refuse le français"
   ],
   "bonne": 1,
   "expl": "Chercher dans les deux langues élargit le panorama ; cela ne dit rien de la fiabilité des sources françaises."
  },
  {
   "id": "R04",
   "fam": "R",
   "famille": "Chercher l'information",
   "pts": 2,
   "q": "Quelle est la première étape d'une démarche de recherche ?",
   "options": [
    "Ouvrir un moteur de recherche",
    "Lire le premier résultat",
    "Préciser la question et le besoin",
    "Rédiger la conclusion"
   ],
   "bonne": 2,
   "expl": "Sans question précise, on cherche au hasard et on ne sait pas quand s'arrêter."
  },
  {
   "id": "R05",
   "fam": "R",
   "famille": "Chercher l'information",
   "pts": 2,
   "q": "Où trouver un guide officiel de bonnes pratiques de cybersécurité en France ?",
   "options": [
    "Sur un forum anonyme",
    "Dans une brochure commerciale",
    "Sur un réseau social",
    "Sur le site d'une agence publique (par exemple l'ANSSI)"
   ],
   "bonne": 3,
   "expl": "Les agences publiques publient des guides sourcés : vérifiez la date et la version."
  },
  {
   "id": "R06",
   "fam": "R",
   "famille": "Chercher l'information",
   "pts": 2,
   "q": "Pourquoi noter la référence dès la première lecture ?",
   "options": [
    "Pour retrouver et citer la source sans la rechercher à nouveau",
    "Pour allonger la bibliographie",
    "Parce que cela se fait sans raison",
    "Pour éviter de lire l'article"
   ],
   "bonne": 0,
   "expl": "Retrouver une source oubliée coûte du temps ; l'outil de références (Zotero) la garde en un clic."
  },
  {
   "id": "R07",
   "fam": "R",
   "famille": "Chercher l'information",
   "pts": 3,
   "q": "Que permet un outil comme Zotero ?",
   "options": [
    "Vérifier automatiquement qu'une source est fiable",
    "Enregistrer, classer et citer des références",
    "Traduire les articles",
    "Écrire l'état de l'art à votre place"
   ],
   "bonne": 1,
   "expl": "Il gère les références ; la fiabilité reste à évaluer par vous."
  },
  {
   "id": "R08",
   "fam": "R",
   "famille": "Chercher l'information",
   "pts": 3,
   "q": "Votre première requête donne 40 000 résultats. Que faites-vous ?",
   "options": [
    "Lire les 100 premiers",
    "Ne garder que la première page",
    "La préciser : mots plus spécifiques, guillemets, filtre de dates",
    "Abandonner la question"
   ],
   "bonne": 2,
   "expl": "Une requête trop large se resserre ; on note la requête exacte pour pouvoir la refaire."
  },
  {
   "id": "V01",
   "fam": "V",
   "famille": "Évaluer et valider",
   "pts": 1,
   "q": "Un article cite une étude sans donner sa méthode. Que faites-vous ?",
   "options": [
    "La citer telle quelle",
    "La considérer comme fausse",
    "La recopier avec les mêmes mots",
    "Chercher l'étude d'origine avant de la citer"
   ],
   "bonne": 3,
   "expl": "Remonter à la source d'origine permet de juger la méthode, ou de constater qu'elle n'existe pas."
  },
  {
   "id": "V02",
   "fam": "V",
   "famille": "Évaluer et valider",
   "pts": 1,
   "q": "Deux articles donnent le même chiffre ; tous deux citent la même brochure commerciale. Combien de sources indépendantes ?",
   "options": [
    "Une seule : la brochure",
    "Deux",
    "Trois",
    "Aucune"
   ],
   "bonne": 0,
   "expl": "Deux citations d'une même source ne la recoupent pas : c'est une source circulaire."
  },
  {
   "id": "V03",
   "fam": "V",
   "famille": "Évaluer et valider",
   "pts": 1,
   "q": "Qu'est-ce qu'un preprint ?",
   "options": [
    "Un article rejeté par une revue",
    "Un article diffusé avant relecture par des pairs",
    "Un article de presse",
    "Un article déjà validé par une revue"
   ],
   "bonne": 1,
   "expl": "Un preprint n'a pas encore été évalué par des pairs : à utiliser avec prudence et à signaler."
  },
  {
   "id": "V04",
   "fam": "V",
   "famille": "Évaluer et valider",
   "pts": 2,
   "q": "Qu'est-ce qui rend une brochure commerciale à utiliser avec prudence ?",
   "options": [
    "Elle est récente",
    "Elle est mise en page avec soin",
    "Son but est de vendre : elle présente ses propres résultats, souvent sans méthode",
    "Elle est écrite en anglais"
   ],
   "bonne": 2,
   "expl": "On peut la citer comme position de l'acteur, pas comme preuve."
  },
  {
   "id": "V05",
   "fam": "V",
   "famille": "Évaluer et valider",
   "pts": 2,
   "q": "Une référence proposée par une IA générative semble parfaite. Que faire avant de la citer ?",
   "options": [
    "La citer : l'IA est fiable",
    "Demander à la même IA de confirmer",
    "La citer sans l'année",
    "Vérifier qu'elle existe (auteurs, revue, adresse DOI)"
   ],
   "bonne": 3,
   "expl": "Une IA peut inventer des références plausibles ; lui demander de confirmer ne prouve rien."
  },
  {
   "id": "V06",
   "fam": "V",
   "famille": "Évaluer et valider",
   "pts": 2,
   "q": "Le biais de confirmation consiste à…",
   "options": [
    "retenir surtout les sources qui confirment son idée",
    "citer trop de sources",
    "ne chercher que des sources récentes",
    "ne citer que des sources en anglais"
   ],
   "bonne": 0,
   "expl": "Chercher aussi ce qui contredit son idée protège contre ce biais."
  },
  {
   "id": "V07",
   "fam": "V",
   "famille": "Évaluer et valider",
   "pts": 3,
   "q": "Une donnée de 2012 sur les usages du cloud : quel est le problème principal ?",
   "options": [
    "Elle est forcément fausse",
    "Elle peut être périmée dans un domaine qui évolue vite",
    "Elle est trop précise",
    "Elle est en chiffres"
   ],
   "bonne": 1,
   "expl": "La date doit correspondre au sujet : en informatique, quelques années suffisent à changer la donne."
  },
  {
   "id": "V08",
   "fam": "V",
   "famille": "Évaluer et valider",
   "pts": 3,
   "q": "Qu'est-ce qui distingue le mieux une revue à comité de lecture d'un blog ?",
   "options": [
    "Le nombre de lecteurs",
    "La longueur des textes",
    "Des experts indépendants évaluent l'article avant publication",
    "La présence d'images"
   ],
   "bonne": 2,
   "expl": "La relecture par des pairs filtre une partie des erreurs, sans les supprimer toutes."
  },
  {
   "id": "T01",
   "fam": "T",
   "famille": "Argumenter",
   "pts": 1,
   "q": "Dans le modèle de Toulmin, que désigne la « garantie » ?",
   "options": [
    "La conclusion",
    "La source du chiffre",
    "La liste des objections",
    "Le lien qui explique pourquoi les données mènent à l'affirmation"
   ],
   "bonne": 3,
   "expl": "Données + garantie → affirmation : sans garantie, les faits ne prouvent rien."
  },
  {
   "id": "T02",
   "fam": "T",
   "famille": "Argumenter",
   "pts": 1,
   "q": "Que représente la « réfutation » dans le modèle de Toulmin ?",
   "options": [
    "Les cas où l'argument ne tient pas",
    "La réponse de l'adversaire",
    "Le résumé final",
    "La source principale"
   ],
   "bonne": 0,
   "expl": "La chercher soi-même rend la conclusion plus honnête et plus crédible."
  },
  {
   "id": "T03",
   "fam": "T",
   "famille": "Argumenter",
   "pts": 1,
   "q": "« Tout le monde passe au cloud, faisons pareil » est un exemple de…",
   "options": [
    "pente glissante",
    "appel à la popularité",
    "faux dilemme",
    "post hoc"
   ],
   "bonne": 1,
   "expl": "Le nombre de personnes qui font une chose ne prouve pas qu'elle convient à votre cas."
  },
  {
   "id": "T04",
   "fam": "T",
   "famille": "Argumenter",
   "pts": 2,
   "q": "« Soit on achète cet outil, soit on se fait pirater » est un…",
   "options": [
    "appel à la popularité",
    "généralisation hâtive",
    "faux dilemme",
    "attaque contre la personne"
   ],
   "bonne": 2,
   "expl": "D'autres options existent presque toujours : il faut les chercher."
  },
  {
   "id": "T05",
   "fam": "T",
   "famille": "Argumenter",
   "pts": 2,
   "q": "Un fournisseur annonce « 99 % d'incidents en moins ». Quelle première question posez-vous ?",
   "options": [
    "Quel est son prix ?",
    "Est-il connu ?",
    "La page est-elle bien mise en forme ?",
    "Par rapport à quoi, mesuré comment, sur quel échantillon ?"
   ],
   "bonne": 3,
   "expl": "Un chiffre sans base de comparaison, méthode ni échantillon ne prouve rien."
  },
  {
   "id": "T06",
   "fam": "T",
   "famille": "Argumenter",
   "pts": 2,
   "q": "À quoi sert un qualificatif (« probablement », « dans ces conditions ») ?",
   "options": [
    "À dire honnêtement la portée de la conclusion",
    "À éviter de conclure",
    "À allonger le texte",
    "À cacher les données"
   ],
   "bonne": 0,
   "expl": "Un qualificatif précis protège contre la sur-généralisation."
  },
  {
   "id": "T07",
   "fam": "T",
   "famille": "Argumenter",
   "pts": 3,
   "q": "Votre matrice pondérée donne le même classement quel que soit le poids des critères. Que dire ?",
   "options": [
    "Les poids sont inutiles",
    "Le résultat résiste au test de sensibilité ; les scores restent à sourcer",
    "Les scores sont forcément exacts",
    "L'analyse est terminée sans réserve"
   ],
   "bonne": 1,
   "expl": "Un classement stable est plus solide, mais il repose toujours sur des scores à vérifier."
  },
  {
   "id": "T08",
   "fam": "T",
   "famille": "Argumenter",
   "pts": 3,
   "q": "Pourquoi chercher soi-même les objections à sa recommandation ?",
   "options": [
    "Pour les cacher",
    "Pour allonger la présentation",
    "Pour y répondre avant le public et gagner en crédibilité",
    "Pour changer de sujet"
   ],
   "bonne": 2,
   "expl": "Anticiper les objections montre que l'on a regardé les limites de sa propre proposition."
  }
 ],
 "injects": [
  {
   "id": "I1",
   "repere": "H+0 · 6 h 50",
   "titre": "Le TMS est à l'arrêt",
   "contexte": "60 conducteurs sont sur le quai, aucune tournée n'est affichée. Trois grands clients attendent des livraisons avant 9 h. La cause est inconnue ; l'équipe informatique est en diagnostic.",
   "questions": [
    {
     "q": "À qui adressez-vous un message en premier ?",
     "options": [
      [
       "Les clients : les prévenir d'un retard",
       2,
       "Utile, mais les conducteurs sur le quai doivent d'abord savoir quoi faire."
      ],
      [
       "Les salariés (conducteurs et exploitation) : consigne immédiate",
       3,
       "Ce sont eux qui doivent agir tout de suite ; ils attendent une consigne."
      ],
      [
       "Le public sur les réseaux : prendre les devants",
       0,
       "Rien ne justifie de s'adresser au public avant les personnes concernées."
      ],
      [
       "La direction : l'alerter",
       1,
       "Nécessaire en parallèle, mais la direction est déjà dans la cellule de crise."
      ]
     ]
    },
    {
     "q": "Quel message envoyez-vous aux conducteurs ?",
     "options": [
      [
       "« Panne du TMS. Restez au quai. Prochain point à 7 h 30 avec la marche à suivre. »",
       3,
       "Fait, consigne et prochain point daté : le trio d'un bon message de crise."
      ],
      [
       "« Tout va bien, on gère, continuez. »",
       -1,
       "Inexact : rien ne fonctionne. Le message perd en crédibilité."
      ],
      [
       "« Panne du TMS. Aucune information pour l'instant. »",
       1,
       "Honnête, mais sans consigne ni prochain point."
      ],
      [
       "« Panne du TMS, c'est la faute de l'informatique, on attend. »",
       0,
       "Chercher un coupable ne fait pas avancer et dresse les équipes."
      ]
     ]
    }
   ]
  },
  {
   "id": "I2",
   "repere": "H+3 · 9 h 50",
   "titre": "Une vidéo circule",
   "contexte": "Un conducteur a publié une vidéo : « Arrêtés depuis trois heures. » Le client le plus important appelle, inquiet. La cause est identifiée : un serveur de base de données est en défaut ; un retour est estimé à 14 h, avec incertitude.",
   "questions": [
    {
     "q": "Qui traitez-vous en priorité ?",
     "options": [
      [
       "Le public sur les réseaux : démentir la vidéo",
       1,
       "La vidéo est vraie : démentir serait faux et aggraverait la situation."
      ],
      [
       "Les salariés : rappeler la règle de publication",
       2,
       "À faire, sans ton punitif, mais le client attend une réponse."
      ],
      [
       "Le client le plus important",
       3,
       "Il est directement touché et a appelé : il passe avant la rumeur."
      ],
      [
       "L'assureur : déclarer le sinistre",
       0,
       "Pas urgent à cette heure."
      ]
     ]
    },
    {
     "q": "Que dites-vous au client ?",
     "options": [
      [
       "« Retour à la normale dans une heure. »",
       -1,
       "Promesse non fondée : si elle est fausse, la confiance s'effondre."
      ],
      [
       "« Pas de commentaire. »",
       0,
       "Le client conclut que vous cachez quelque chose."
      ],
      [
       "« Retard dû à un incident technique, nous nous excusons. »",
       1,
       "Poli mais vague : aucune information utile."
      ],
      [
       "« Le TMS est en panne depuis 6 h 50. Livraisons de ce matin décalées. Retour estimé à 14 h, avec incertitude ; je vous confirme à 12 h et traite vos urgences par téléphone. »",
       3,
       "Faits, estimation honnête, prochain point daté, solution pour les urgences."
      ]
     ]
    }
   ]
  },
  {
   "id": "I3",
   "repere": "H+24 · mercredi 7 h",
   "titre": "La presse appelle",
   "contexte": "Le service est rétabli depuis 15 h hier. Trois tournées sur 20 sont encore retardées. La presse locale demande : « Combien de colis perdus ? Des données clients ont-elles fuité ? » Vos faits : aucun colis perdu ; aucune trace de fuite à ce stade, mais l'analyse n'est pas terminée.",
   "questions": [
    {
     "q": "Qui répond à la presse ?",
     "options": [
      [
       "Un porte-parole désigné, avec des éléments validés",
       3,
       "Une voix unique évite les contradictions."
      ],
      [
       "Personne : ne pas décrocher",
       0,
       "Le silence laisse la place aux rumeurs."
      ],
      [
       "Le prestataire du TMS en direct",
       1,
       "Il peut éclairer la technique, mais la parole de l'entreprise doit être la vôtre."
      ],
      [
       "Le premier conducteur disponible",
       -1,
       "Un conducteur n'a pas les faits validés."
      ]
     ]
    },
    {
     "q": "Que dit-il sur les données ?",
     "options": [
      [
       "« Aucune donnée n'a fuité. »",
       -1,
       "Non établi : si l'analyse montre le contraire, la crédibilité est perdue."
      ],
      [
       "« C'est un acte de malveillance. »",
       -1,
       "Non établi également."
      ],
      [
       "« Panne de 6 h 50 à 15 h ; aucun colis perdu ; l'analyse est en cours pour exclure tout impact sur les données ; résultat communiqué d'ici vendredi. »",
       3,
       "Ce qui est sûr, ce qui est en cours, et une échéance."
      ],
      [
       "« Nous ne communiquons pas. »",
       0,
       "Refus pur : la presse écrira sans vos faits."
      ]
     ]
    }
   ]
  },
  {
   "id": "I4",
   "repere": "H+72 · vendredi",
   "titre": "Le client menace",
   "contexte": "Le prestataire du TMS reconnaît une mise à jour non testée. Le client le plus important évoque une clause de pénalité et menace de réduire ses volumes. Vous préparez votre réponse.",
   "questions": [
    {
     "q": "Par quel canal répondez-vous au client ?",
     "options": [
      [
       "Un e-mail générique",
       0,
       "Impersonnel pour un client critique."
      ],
      [
       "Attendre qu'il relance",
       -1,
       "Il verra l'inaction comme un mépris."
      ],
      [
       "Un communiqué public",
       0,
       "Hors sujet : le client attend un échange direct."
      ],
      [
       "Un appel de la directrice, puis un courrier de confirmation",
       3,
       "Personnel, rapide, avec une trace écrite."
      ]
     ]
    },
    {
     "q": "Quel contenu donner à cet échange ?",
     "options": [
      [
       "Rejeter la faute sur le prestataire",
       -1,
       "Le client a contracté avec TransLor, pas avec le prestataire."
      ],
      [
       "Causes, mesures datées (test avant mise à jour, mode de secours manuel en moins de 30 minutes) et discussion d'un geste commercial",
       3,
       "Faits, mesures chiffrées et datées, ouverture sur la réparation."
      ],
      [
       "Une remise immédiate, sans analyse",
       0,
       "Une réponse commerciale sans explication ni plan."
      ],
      [
       "Des excuses sans plan",
       1,
       "Nécessaires, insuffisantes."
      ]
     ]
    }
   ]
  },
  {
   "id": "I5",
   "repere": "J+30 · retour d'expérience",
   "titre": "Tirer les leçons",
   "contexte": "Un mois après la panne, la direction veut un retour d'expérience partagé avec toute l'entreprise, et un dispositif durable.",
   "questions": [
    {
     "q": "Que doit contenir le retour d'expérience ?",
     "options": [
      [
       "Les faits, les causes, ce qui a marché ou non, des actions (qui, quoi, quand), sans coupable",
       3,
       "Un retour d'expérience utile est factuel, sans coupable, avec des actions datées."
      ],
      [
       "Seulement les bonnes décisions",
       1,
       "Incomplet : on apprend aussi des erreurs."
      ],
      [
       "Rien : la page est tournée",
       0,
       "On répétera les mêmes erreurs."
      ],
      [
       "Le nom du responsable",
       -1,
       "La recherche de coupable bloque la remontée d'informations."
      ]
     ]
    },
    {
     "q": "Quel dispositif de communication pérenne mettez-vous en place ?",
     "options": [
      [
       "Un e-mail annuel de rappel",
       1,
       "Insuffisant."
      ],
      [
       "Un nouvel outil de messagerie",
       0,
       "Un outil ne remplace ni les rôles ni les messages prêts."
      ],
      [
       "Aucun dispositif",
       0,
       "Le prochain incident repartira de zéro."
      ],
      [
       "Un plan de crise : annuaire, canal hors bande (SMS), messages pré-rédigés, porte-parole",
       3,
       "Prêt à l'emploi le jour où le TMS tombe."
      ]
     ]
    }
   ]
  }
 ],
 "publics": [
  [
   "Salariés",
   "Conducteurs, exploitation, support"
  ],
  [
   "Clients",
   "Grands comptes et clients touchés"
  ],
  [
   "Direction",
   "Directrice et comité de direction"
  ],
  [
   "Public",
   "Réseaux sociaux, presse locale"
  ],
  [
   "Partenaires",
   "Prestataire du TMS, assureur"
  ]
 ],
 "scenario": "Mardi 6 h 50. Le logiciel de tournées (TMS) de TransLor est inaccessible. 60 conducteurs attendent sur le quai, 20 tournées doivent partir, trois grands clients attendent leurs livraisons avant 9 h. Cause inconnue. Vous êtes la cellule de communication de crise : à chaque inject, répondez en équipe (2 décisions).",
 "titres": [
  [
   0,
   "Communicant en herbe"
  ],
  [
   12,
   "Chargé de communication"
  ],
  [
   20,
   "Directeur de la communication"
  ],
  [
   26,
   "Porte-parole de l'année"
  ]
 ],
 "familles": {
  "R": "Chercher l'information",
  "V": "Évaluer et valider",
  "T": "Argumenter",
  "G": "Argumenter et informer"
 },
 "sujets": [
  [
   "Passkeys",
   "Faut-il remplacer les mots de passe par des passkeys ?"
  ],
  [
   "Gestionnaire de mots de passe",
   "Faut-il un gestionnaire de mots de passe d'entreprise ?"
  ],
  [
   "Double authentification",
   "SMS, application ou clé physique pour la double authentification ?"
  ],
  [
   "Sauvegarde",
   "Cloud, disque local ou les deux (règle 3-2-1) ?"
  ],
  [
   "IA générative au travail",
   "L'autoriser, l'encadrer ou l'interdire ?"
  ],
  [
   "Télétravail et productivité",
   "L'effet du télétravail sur la productivité est-il établi ?"
  ],
  [
   "Télétravail et accès",
   "VPN ou accès par navigateur sécurisé ?"
  ],
  [
   "Hébergement",
   "Cloud public, hébergeur local ou serveur interne ?"
  ],
  [
   "Ordinateurs personnels (BYOD)",
   "Faut-il autoriser les ordinateurs personnels au travail ?"
  ],
  [
   "Sensibilisation au phishing",
   "Formation, simulations d'attaque, ou les deux ?"
  ],
  [
   "Mises à jour automatiques",
   "Activer partout ou tester d'abord ?"
  ],
  [
   "Logiciel libre ou propriétaire",
   "Bureautique et messagerie : lequel choisir ?"
  ],
  [
   "Low-code",
   "Low-code ou développement classique pour des outils internes ?"
  ],
  [
   "Microservices ou monolithe",
   "Quelle architecture pour une PME ?"
  ],
  [
   "Empreinte du numérique",
   "Quels leviers pour réduire l'empreinte environnementale de l'informatique d'une PME ?"
  ],
  [
   "Motorisation de la flotte",
   "Électrique, bioGNV ou HVO pour les livraisons ?"
  ],
  [
   "Chiffrement des disques",
   "Chiffrer les portables : utile, et à quel coût ?"
  ],
  [
   "Messagerie d'équipe",
   "Réseau social interne ou messagerie d'équipe pour faire circuler l'information ?"
  ],
  [
   "Cahier des charges ou agile",
   "Quelle méthode pour un projet interne ?"
  ]
 ],
 "ordre": [
  "F0",
  "EX0",
  "EX1",
  "EX5",
  "EX6",
  "EX4",
  "EX7",
  "M1",
  "EX8",
  "EX9",
  "M2",
  "EX10",
  "V4",
  "EX11b",
  "EX12",
  "EX13",
  "M4",
  "EX14",
  "F6",
  "EX15",
  "EX16",
  "EX17",
  "EX18",
  "EX19",
  "EX20",
  "V7",
  "V8",
  "EX21",
  "EX22",
  "EX23",
  "M3",
  "EX24",
  "EX25",
  "EX26",
  "EX27",
  "EX29",
  "F9"
 ],
 "annexe": [
  "EX11",
  "F5",
  "F7",
  "EX28",
  "EX2",
  "F1",
  "EX3",
  "AX2",
  "AX3",
  "AX5",
  "AX7",
  "AX8",
  "AF2",
  "AF3",
  "AX9",
  "AX10",
  "AX12",
  "AX13",
  "AX14",
  "AX15",
  "AX16",
  "AX17",
  "AX18",
  "AX19",
  "AF5",
  "AX20",
  "AX21",
  "AF7",
  "AX22",
  "AX23",
  "AX24",
  "AF8",
  "AF0",
  "V5",
  "V1",
  "V2",
  "AG1"
 ]
};
