# Validation restaurant — V1 École Gastronomique

Date de préparation : 24 septembre 2026

## Objectif

Présenter au restaurant une V1 fonctionnelle et obtenir une validation métier avant toute nouvelle extension. Aucun staging, paiement en ligne, e-mail automatique, WhatsApp/SMS, PDF ou BI avancée ne doit être ajouté avant cette validation.

## État actuellement démontrable

- 1 programme publié : **Ateliers Grand Public & Passionnés**
- 1 session future : **12 au 20 novembre 2026**
- lieu : **Le Jacquier, Kipé**
- capacité : **8 places**
- 1 inscription : **En attente**
- jauge publique : **7 places restantes**
- parcours public : programme → session → jauge → formulaire → demande En attente
- parcours admin : programmes → sessions → inscriptions → changement de statut
- protection anti-surbooking active
- données participants privées côté Supabase/RLS

## Parcours de démonstration au restaurant

1. Ouvrir la page publique **École de Gastronomie**.
2. Montrer le programme publié et son contenu.
3. Montrer la session du 12 au 20 novembre 2026.
4. Montrer la jauge et le nombre de places restantes.
5. Ouvrir le formulaire d'inscription sans soumettre de fausse demande.
6. Montrer dans l'admin les onglets **Programmes**, **Sessions & jauges**, **Inscriptions**.
7. Montrer les statuts : En attente, Confirmé, Payé, Annulé.
8. Montrer qu'une annulation libère une place et qu'une session complète refuse une nouvelle inscription.
9. Montrer les filtres et le badge **À relancer**.
10. Expliquer explicitement qu'aucun paiement, message WhatsApp ou e-mail automatique n'est encore envoyé.

## Questions à faire valider par le restaurant

### Programme

- Les champs actuels sont-ils suffisants : titre, public/niveau, durée, prix, capacité, prérequis, formateur, matériel inclus ?
- Faut-il distinguer **atelier**, **masterclass**, **formation longue** ou d'autres types ?
- Un programme doit-il avoir une image dédiée ?
- Le restaurant veut-il afficher le nom du formateur publiquement ?

### Sessions

- Une session doit-elle accepter une période sur plusieurs jours ou uniquement un créneau unique ?
- La capacité est-elle définie par programme ou doit-elle toujours être ajustable par session ?
- Une liste d'attente est-elle nécessaire quand une session est complète ?
- Quel délai minimum faut-il imposer avant fermeture des inscriptions ?

### Inscriptions

- Quelles informations participant sont réellement obligatoires ?
- Une inscription **En attente** doit-elle réserver immédiatement une place ? La V1 actuelle répond **oui**.
- Qui peut confirmer ou annuler une inscription ?
- À quel moment une inscription passe-t-elle à **Payé** ?
- Faut-il ajouter un statut **Contacté** ou **Absent** ?

### Paiement et confirmation

- Paiement sur place, mobile money, carte, acompte ou paiement total ?
- Le restaurant veut-il générer un reçu ou une facture ?
- Quel canal de confirmation doit être prioritaire : appel, WhatsApp, SMS ou e-mail ?
- Les relances doivent-elles être automatiques ou manuelles ?

### Administration

- Les trois onglets actuels sont-ils assez clairs ?
- Faut-il un agenda/calendrier visuel ?
- Les filtres actuels sont-ils suffisants ?
- Quels indicateurs sont réellement utiles au quotidien : remplissage, CA encaissé, impayés, annulations ?

## Décision après validation

Classer chaque demande dans l'une des catégories suivantes :

- **V1.0 correction** : bug, sécurité, incohérence ou problème de compréhension bloquant.
- **V1.1** : amélioration légère sans fournisseur externe.
- **V2** : paiement, notifications externes, PDF, automatisation, BI avancée ou intégration tierce.

## Éléments explicitement reportés après validation

- activation/utilisation du staging préparé
- e-mails transactionnels
- WhatsApp/SMS automatisés
- génération de devis/reçus PDF
- paiement en ligne
- liste d'attente automatisée
- rappels automatiques
- analytics avancées École/Traiteur
- calendrier avancé si demandé par le restaurant

## Critère de validation

La V1 École peut être considérée comme validée lorsque le restaurant confirme explicitement :

1. les champs Programme ;
2. le fonctionnement des Sessions ;
3. la logique de jauge ;
4. les statuts d'inscription ;
5. le parcours public ;
6. le workflow admin ;
7. les éléments à reporter en V1.1/V2.

Tant que cette validation n'est pas obtenue, ne pas étendre le périmètre fonctionnel.
