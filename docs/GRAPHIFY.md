# Naviguer le projet avec Graphify

Le graphe structurel versionné se trouve dans [`../graphify-out/`](../graphify-out/).
Il est construit en mode **code-only** : il couvre 70 fichiers de code, dont les
points d'entrée `server.ts` et `worker.ts`, sans envoyer le contenu à un service
externe. Les documents Markdown et les ressources images ne font pas partie de ce
graphe ; ils restent consultables dans `docs/` et `public/`.

## Artefacts versionnés

- `graph.json` : données source pour les requêtes Graphify ;
- `GRAPH_REPORT.md` : hubs, communautés et pistes d'investigation ;
- `graph.html` : visualisation interactive à ouvrir localement.

## Pour les agents

`AGENTS.md` demande d'interroger le graphe avant une question d'architecture. À la
racine du dépôt :

```bash
graphify query "Comment une réservation publique atteint-elle Supabase ?"
graphify path "apiHandler" "createReservation()"
graphify explain "RestaurantService"
```

Après une modification de code, exécuter `graphify update .` pour remettre à jour
le graphe localement. Les fichiers temporaires de Graphify peuvent changer ; seuls
les trois artefacts listés plus haut sont des livrables versionnés.

## Mise à jour automatique GitHub Actions

Le workflow `.github/workflows/graphify.yml` installe `graphifyy` puis exécute
`graphify extract . --code-only` à chaque push qui touche autre chose que
`graphify-out/`. Il committe uniquement `graph.json`, `GRAPH_REPORT.md` et, s'il
est produit, `graph.html`. Son propre commit porte `[skip ci]` et le chemin de
sortie est ignoré comme double protection contre une boucle de workflows. Il peut
aussi être lancé manuellement depuis l'onglet **Actions**.

## Intégrité de la version initiale

Mise à jour le 7 septembre 2026 : 486 nœuds, 798 relations et 39 communautés. Le
diagnostic Graphify ne signale ni extrémité manquante, ni arête orpheline, ni fusion
d'arêtes lors de la construction non orientée.
