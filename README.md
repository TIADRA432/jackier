# Le Jacquier Restaurant - Backend

Ce backend utilise **Application Default Credentials (ADC)** pour s'authentifier auprès de Google Cloud et Firebase.

## Développement Local

Pour fonctionner en local avec Firebase Admin SDK, vous devez vous authentifier avec Google Cloud CLI.

Exécutez la commande suivante dans votre terminal :

```bash
gcloud auth application-default login
```

Cela permettra à Application Default Credentials d'utiliser vos identifiants locaux pour accéder à Firestore.

## Production

En production (Cloud Functions for Firebase, Firebase App Hosting, Cloud Run), Google fournit automatiquement un Service Account via ADC. Aucune configuration supplémentaire n'est requise. Le code détectera automatiquement l'environnement et s'authentifiera.
