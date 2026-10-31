# Communication professionnelle · TransLor

© 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.

Application du cours « Communication professionnelle de l'ingénieur » (10 h 30) : énoncés, minuteurs, corrections détaillées, Jeu 20 (quiz de 54 questions), Jeu 21 (crise « Mardi 6 h 50 »), quiz final.

Publication : GitHub Pages, branche main, dossier racine. Adresse : https://belmdeveloppement.github.io/communication-pro/
Routes des QR codes : `#/ex/EX1` à `#/ex/EX24`, `#/f/F0` à `#/f/F9`, `#/jeu20`, `#/jeu21`, `#/quiz-final`.
Ne pas renommer le dépôt ni le compte : les QR codes du PowerPoint casseraient.

Les jeux utilisent une connexion directe entre téléphones (PeerJS, WebRTC) : le serveur public de mise en relation de PeerJS est nécessaire au démarrage. Cas fictif : chiffres inventés.

## Plateau « 5 · La route de l'état de l'art » (16 jeux)
Pages : `#/plateau` (accueil), `#/plateau/regles`, `#/j` (joueurs, code ROUTE), `#/tour` (tour de contrôle enseignant, PIN), `#/test` (mode test sur les 16 jeux).
63 cases en deux niveaux (0 à 31 puis 32 à 62), recul à 0 point, pari, cases Aléa, Outil, Piège, Duel et Relecture, atelier de 16 outils. Données : `plateau-data.js` (générées, 16 jeux, 366 cartes) ; moteur : `plateau-engine.js` (notation) et `jeu51-core.js` (règles).
Tests : `node test_plateau.js` (contenu, notation, équilibrage des réponses, ordre du jeu 5.4) et `node test_j51.js` (règles).
PDF à imprimer : `Plateau_5_80x60.pdf` (5 tables + vierge, fond perdu 5 mm), `Plateau_5_A3.pdf` (essai), `Plateau_5_pions.pdf`. La fiche enseignant (corrigés) n'est pas publiée ici.
