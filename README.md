# Communication professionnelle · TransLor

© 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.

Application du cours « Communication professionnelle de l'ingénieur » (10 h 30) : énoncés, minuteurs, corrections détaillées, Jeu 20 (quiz de 54 questions), Jeu 21 (crise « Mardi 6 h 50 »), quiz final.

Publication : GitHub Pages, branche main, dossier racine. Adresse : https://belmdeveloppement.github.io/communication-pro/
Routes des QR codes : `#/ex/EX1` à `#/ex/EX24`, `#/f/F0` à `#/f/F9`, `#/jeu20`, `#/jeu21`, `#/quiz-final`.
Ne pas renommer le dépôt ni le compte : les QR codes du PowerPoint casseraient.

Les jeux utilisent une connexion directe entre téléphones (PeerJS, WebRTC) : le serveur public de mise en relation de PeerJS est nécessaire au démarrage. Cas fictif : chiffres inventés.

## Plateau « La route de l'état de l'art » (45 JEUX, mode synchrone)
Pages : `#/plateau` (accueil), `#/plateau/regles`, `#/j` (joueurs, code ROUTE), `#/tour` (tour de contrôle enseignant, PIN), `#/test` (mode test sur les 45 jeux), `#/outils-test` (test des 16 outils depuis le réseau de la salle). Un seul plateau 80 × 60 cm pour toute la classe.
63 cases : 45 cases JEU dans l'ordre du cours, 15 cases à effet (Aléa, Outil, Piège, Duel, Relecture), mi-parcours case 31, arrivée case 62. Un pion par table. Quand l'enseignant ouvre un JEU (bouton de la tour ou diapositive du PowerPoint), toutes les tables passent sur ce JEU ; une table au milieu d'une carte la termine d'abord ; un JEU non joué est sauté (ni point, ni pénalité, retiré du total possible des jauges). Points : 0 à 3 par JEU, pari ±1, effets en points, bonus « table solidaire ». Cinq jauges de maîtrise (10 jetons) et niveau Débutant / Confirmé / Expert par objectif (table et joueur), seuils cachés. Tour de contrôle : classement des tables, classement individuel (enseignant), arbitrage des relectures, correction des points par JEU.
Lecture obligatoire : document commun (10 s) avant le premier jeu, fiche du jeu (8 s) quand on y arrive ; personne ne tire tant qu'un joueur connecté de la table n'a pas lu. Aide outil à trois niveaux par outil, bouton « Cet outil ne marche pas » (tour passé sans pénalité), désactivation d'un outil depuis la tour. Les guides des outils sont rédigés sans test en direct : à vérifier.
Tests : `node test_plateau.js` (contenu, notation, équilibrage des réponses, ordre des items) et `node test_j51.js` (règles).
PDF à imprimer : `Plateau_80x60.pdf` (plateau unique 80 × 60 cm, fond perdu 5 mm). La fiche enseignant (corrigés) n'est pas publiée ici.

## Liaison PowerPoint et corrigés (12 novembre 2026)
Liaison : les diapositives d'énoncé des JEUX (support v25) et les 4 questions du nuage de mots portent l'étiquette `ROUTE_JEU` (n° du JEU ; 101 à 104 pour le nuage de mots). Sous Windows, le complément commun `JeuxLive.ppam` (installé une fois par PC, voir la convention JeuxLive du projet) envoie `JEU|n|diapo` au relais Cloudflare (`POST /pub?room=<clé>&t=diapos`, voie principale) puis à ntfy.sh (secours seulement). La tour (onglet « Liaison PowerPoint », vue enseignant) écoute le relais par WebSocket (`/ps`, sujet `diapos`, salle = clé de liaison sans tirets) et ntfy en parallèle ; elle ignore les signaux de plus de 30 minutes ; modes automatique, avec confirmation, désactivé ; retour en arrière jamais automatique. Secours : « Je suis au JEU n° ». Seuls le n° du JEU et celui de la diapositive transitent. Module à fusionner dans le complément : `JeuxLivePlateau.bas` (`EnvoyerPlateau`, `TesterPlateau`, `ConfigurerCle`). Non essayé sous PowerPoint : essai `TesterPlateau` à faire. RouteJeu.bas / clsRoute.cls sont abandonnés.
Corrigés : onglet « Corrigé du JEU ouvert » de la vue enseignant (réponses attendues et explications de chaque carte), absent de la vue projetée.

Corrections du 12 novembre 2026 (soir) : compteur de lecture qui ne repart plus, joueur attaché à une seule partie (message si deux tours répondent), « Quitter la partie » revient au formulaire, bouton « Retirer » pour un joueur hors ligne (onglet Joueurs).

Version du 12 novembre 2026 (nuit) : la partie n'est plus chronométrée (« Démarrer la partie », « Terminer la partie », « Rouvrir la partie ») ; vocabulaire limité à « partie » et « JEU » ; l'écran joueur affiche l'énoncé de chaque JEU, extrait du support (`enonces` dans `plateau-data.js`) ; bouton « Aide outil » seulement pour l'outil rattaché au JEU ; mise (pari) retirée des cartes déclaratives.

Version du 13 novembre 2026 (support v21) : choix du sujet dans l'application (bouton « Choisir mon sujet », un sujet par personne, attribué au premier qui l'appuie, onglet « Sujets (n/19) » de la tour avec « Libérer ») ; le JEU 28 recopie la fiche de Toulmin du JEU 27 ; le JEU 20 s'appuie sur des cas réels (Pentagone 2023, pape en doudoune, requin sur l'autoroute) ; correction du JEU 19 (la signature prouve qui a signé et que le fichier n'a pas changé) ; lien « syllabus ECUE-S7-1-2 » dans le but de chaque JEU ; pages du support renumérotées (262 diapositives). Tests : saisies 901, plateau 2506, tables/joueurs 190.
