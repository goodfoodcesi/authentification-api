# 🚀 Installation rapide du projet

## Prérequis

- [Bun](https://bun.sh/) installé sur votre PC
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé

## Installation

### 1. Installer Bun (si pas déjà fait)
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Cloner et installer le projet
```bash
git clone <URL_DU_REPO>
cd <NOM_DU_PROJECT>
bun install
```

### 3. Lancer la base de données
```bash
# Lancer PostgreSQL avec Docker
docker compose up -d

# Appliquer le schéma de base de données
bunx drizzle-kit push
```

### 4. Démarrer le serveur
```bash
bun run dev
```

## 📖 Documentation API

Une fois le serveur lancé, accédez à la documentation interactive :

👉 **[http://localhost:3000/openapi](http://localhost:3000/openapi)**

Vous y trouverez la documentation de tous les endpoints disponibles.

---

## ⚠️ Troubleshooting

- **Docker n'est pas lancé** : Vérifiez que Docker Desktop est bien ouvert
- **Port 3000 déjà utilisé** : Arrêtez le processus qui utilise le port ou changez le port dans la config
- **Erreur Drizzle** : Assurez-vous que PostgreSQL est bien lancé (`docker ps`)