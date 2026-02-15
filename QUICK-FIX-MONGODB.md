# Kako rešiti MongoDB Connection Error

## Problem
Greška: `MongoSocketOpenException: Connection refused`

## Rešenje 1: Koristite lokalni MongoDB (Najbrže)

```powershell
# Pokrenite MongoDB kroz Docker Compose
docker-compose up mongodb -d

# Proverite da li radi
docker ps | findstr mongodb

# Promenite application.properties da koristi lokalni MongoDB:
# spring.data.mongodb.uri=mongodb://localhost:27017/ordodraconis
```

## Rešenje 2: Popravite MongoDB Atlas Connection

### Korak 1: Whitelist IP adresu u MongoDB Atlas

1. Idite na [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Network Access → Add IP Address
3. Dodajte:
   - **`0.0.0.0/0`** (dozvoljava sve IP adrese - samo za test!)
   - Ili vašu specifičnu IP adresu

### Korak 2: Proverite Database User

1. Database Access → proverite da korisnik `buta-shop` postoji
2. Proverite password: `kFfRYm03zoDs3Qxh`
3. Proverite da korisnik ima prava za database `ordo-dev`

### Korak 3: Proverite Cluster Status

1. Clusters → proverite da je cluster `Cluster0` aktivan i running

## Rešenje 3: Koristite Environment Variable

Umesto hardkodovanog URI-ja, koristite environment variable:

```powershell
# Postavite environment variable
$env:MONGODB_URI="mongodb+srv://buta-shop:kFfRYm03zoDs3Qxh@cluster0.joplbml.mongodb.net/ordo-dev?retryWrites=true&w=majority&appName=Cluster0"

# Ili za lokalni MongoDB
$env:MONGODB_URI="mongodb://localhost:27017/ordodraconis"
```

## Test konekcije

```powershell
# Test sa MongoDB Compass ili CLI
mongosh "mongodb+srv://buta-shop:kFfRYm03zoDs3Qxh@cluster0.joplbml.mongodb.net/ordo-dev"

# Ili lokalni
mongosh "mongodb://localhost:27017/ordodraconis"
```

## Preporuka

Za **lokalni razvoj**, koristite **lokalni MongoDB** (Docker Compose) jer:
- Ne zavisi od interneta
- Brži pristup
- Nema problema sa whitelist-om
- Jednostavniji setup
