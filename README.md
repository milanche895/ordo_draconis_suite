# OrdoDraconis - Средњовековни тематски парк

Full-stack web aplikacija za тематски парк "OrdoDraconis" у Грачаници, са дизајном инспирисаним medieval-istria.com.

## Stack

### Backend
- Java 21
- Spring Boot 3
- Maven
- MongoDB
- Spring Security (JWT)
- Lombok
- MapStruct

### Frontend
- React 18
- Vite
- Material-UI (MUI)
- React Router
- TanStack Query
- i18next

## Структура пројекта

```
ordo_draconis/
├── backend/          # Spring Boot backend
├── frontend/         # React frontend
└── docker-compose.yml
```

## Покретање локално

### Предуслови
- Java 21+
- Maven 3.9+
- Node.js 20+
- MongoDB (или Docker)

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend ће се покренути на `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend ће се покренути на `http://localhost:5173`

## Покретање са Docker Compose

```bash
docker-compose up -d
```

Сервиси:
- MongoDB: `localhost:27017`
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

## Конфигурација

### Backend Environment Variables

Креирајте `.env` фајл у `backend/` директоријуму или користите `application.yml`:

```yaml
MONGODB_URI: mongodb://localhost:27017/ordodraconis
JWT_SECRET: dGhpc2lzYXNlY3JldGtleWZvcmRldmVsb3BtZW50b25seWNoYW5nZWlucHJvZHVjdGlvbg==
ADMIN_EMAIL: admin@ordodraconis.com
ADMIN_PASSWORD: admin123
TRANSLATION_PROVIDER: mock
UPLOAD_DIR: ./uploads
```

**Napomena**: `JWT_SECRET` мора бити base64 encoded string (минимум 32 карактера). За production, генеришите нови тајни кључ.

### Frontend Environment Variables

Креирајте `.env` фајл у `frontend/` директоријуму:

```
VITE_API_URL=http://localhost:8080/api
```

## Admin приступ

- URL: `/admin/login`
- Email: `admin@ordodraconis.com` (или из env)
- Password: `admin123` (или из env)

## Функционалности

### Public странице
- **Home**: Hero секција, testimonials, feature cards, stats, latest news
- **Muzej**: Преглед музејске колекције
- **Radionice**: Преглед средњовековних радиonica
- **Galerija**: Албуми фотографија
- **Vesti**: Листа вести са детаљима
- **Prodavnica**: Листа производа са детаљима и корпа
- **Kontakt**: Контакт форма

### Admin панел
- CRUD за вести (News)
- CRUD за производе (Products)
- CRUD за албуме (Albums)
- Media library (upload/delete слика)

## Језици и писма

Апликација подржава:
- **sr-Cyrl** (Српски ћирилица) - примарни језик
- **sr-Latn** (Српски латиница) - аутоматска транслитерација
- **en** (English) - аутоматски превод на publish

URL структура:
- `/sr/...` - српски ћирилица
- `/sr-latn/...` - српски латиница
- `/en/...` - енглески

## API Endpoints

### Public
- `GET /api/public/news?lang=sr&script=cyrl&page=0&size=10`
- `GET /api/public/news/{slug}?lang=sr&script=cyrl`
- `GET /api/public/products?lang=sr&script=cyrl`
- `GET /api/public/products/{slug}?lang=sr&script=cyrl`
- `GET /api/public/albums?lang=sr&script=cyrl`
- `GET /api/public/albums/{id}?lang=sr&script=cyrl`
- `POST /api/public/contact`

### Auth
- `POST /api/auth/login`

### Admin (JWT required)
- `GET /api/admin/news`
- `POST /api/admin/news`
- `PUT /api/admin/news/{id}`
- `DELETE /api/admin/news/{id}`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`
- `GET /api/admin/albums`
- `POST /api/admin/albums`
- `PUT /api/admin/albums/{id}`
- `DELETE /api/admin/albums/{id}`
- `GET /api/admin/media`
- `POST /api/admin/media/upload`
- `DELETE /api/admin/media/{id}`

## Seed подаци

При покретању, backend аутоматски креира:
- Admin корисник (из env променљивих)
- Пример вести (2)
- Пример производа (3)
- Пример албума (2)

## Превод и транслитерација

- **Транслитерација**: Локална имплементација (Cyrillic → Latin)
- **Превод**: Mock сервис (враћа текст са префиксом `[EN]`)
  - Припремљено за интеграцију са OpenAI/DeepL/Google Translate
  - Подесите `TRANSLATION_PROVIDER` env променљиву

## Развој

### Backend структура
```
backend/
├── src/main/java/com/ordodraconis/
│   ├── config/          # Конфигурације
│   ├── controller/      # REST контролери
│   ├── dto/            # Data Transfer Objects
│   ├── model/          # MongoDB ентитети
│   ├── repository/     # MongoDB репозиторијуми
│   ├── security/       # JWT и Security
│   ├── service/        # Бизнис логика
│   └── util/           # Утилити
```

### Frontend структура
```
frontend/
├── src/
│   ├── api/            # API клијент
│   ├── components/     # React компоненте
│   ├── pages/         # Странице
│   ├── theme.js       # MUI тема
│   ├── i18n.js        # i18next конфигурација
│   └── utils/         # Утилити
```

## Лиценца

Приватни пројекат за OrdoDraconis тематски парк.
