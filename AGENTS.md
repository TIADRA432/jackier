## graphify

This project has a Graphify architecture report at `graphify-out/GRAPH_REPORT.md`.

When the user types `/graphify`, use the installed Graphify skill or instructions before doing anything else.

Rules:
- For a codebase question, run `graphify query "<question>"` when `graphify-out/graph.json` exists.
- If that graph is absent or stale, rebuild it locally with `graphify extract . --code-only`, then use `graphify query`, `graphify path`, or `graphify explain`.
- Read `graphify-out/GRAPH_REPORT.md` for broad architecture review.
- After modifying code, run `graphify update .` to keep the local graph current (AST-only, no API cost).
