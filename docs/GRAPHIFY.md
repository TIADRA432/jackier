# Naviguer le projet avec Graphify

Le rapport Graphify versionné se trouve dans [`../graphify-out/GRAPH_REPORT.md`](../graphify-out/GRAPH_REPORT.md).
Il est construit en mode **code-only** : il couvre les points d’entrée `server.ts`,
`worker.ts`, le front Angular et l’API Express, sans envoyer le contenu à un service
externe.

## Pour les agents

`AGENTS.md` demande d’interroger le graphe avant une question d’architecture. À la
racine du dépôt :

```bash
graphify extract . --code-only
graphify query "Comment une réservation publique atteint-elle Supabase ?"
graphify path "apiHandler" "createReservation()"
graphify explain "RestaurantService"
```

Le premier ordre régénère localement `graphify-out/graph.json` et
`graphify-out/graph.html`, qui ne sont pas versionnés pour éviter d’alourdir le dépôt.
Après une modification de code, exécuter `graphify update .`.

## Intégrité de la version initiale

Générée le 7 septembre 2026 : 486 nœuds, 798 relations et 39 communautés. Le
diagnostic Graphify ne signale ni extrémité manquante, ni arête orpheline, ni fusion
d’arêtes lors de la construction non orientée.
