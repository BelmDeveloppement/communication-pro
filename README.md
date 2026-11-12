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
Liaison : les 45 diapositives d'énoncé du support v16 portent l'étiquette `ROUTE_JEU`. Sous Windows, une macro (fichiers `RouteJeu.bas` et `clsRoute.cls`, téléchargés depuis l'onglet « Liaison PowerPoint » de la tour, vue enseignant) envoie le numéro du JEU au relais public ntfy.sh ; la tour l'écoute et ouvre le JEU (modes automatique, avec confirmation, désactivé ; retour en arrière jamais automatique). Secours : « Je suis au JEU n° ». Seul le numéro du JEU transite. Macro non exécutée sous PowerPoint pendant la conception : essai `TesterRoute` à faire.
Corrigés : onglet « Corrigé du JEU ouvert » de la vue enseignant (réponses attendues et explications de chaque carte), absent de la vue projetée.

Corrections du 12 novembre 2026 (soir) : compteur de lecture qui ne repart plus, joueur attaché à une seule partie (message si deux tours répondent), « Quitter la partie » revient au formulaire, bouton « Retirer » pour un joueur hors ligne (onglet Joueurs).

Version du 12 novembre 2026 (nuit) : la partie n'est plus chronométrée (« Démarrer la partie », « Terminer la partie », « Rouvrir la partie ») ; vocabulaire limité à « partie » et « JEU » ; l'écran joueur affiche l'énoncé de chaque JEU, extrait du support (`enonces` dans `plateau-data.js`) ; bouton « Aide outil » seulement pour l'outil rattaché au JEU ; mise (pari) retirée des cartes déclaratives.
