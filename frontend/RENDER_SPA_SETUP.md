# Render – SPA (React Router) podešavanje

Da bi rute kao `/admin/login`, `/sr/muzej` itd. radile na produkciji (ne samo na lokalu), Render mora da **rewrite-uje** sve putanje na `index.html`, da React Router može da ih obradi.

## Koraci u Render Dashboardu

1. Otvori [Render Dashboard](https://dashboard.render.com/) i izaberi svoj **Static Site** (frontend).
2. U levom meniju otvori **Redirects/Rewrites**.
3. Klikni **Add Rule** i unesi:
   - **Source Path:** `/*`
   - **Destination Path:** `/index.html`
   - **Action:** **Rewrite** (ne Redirect)
4. Sačuvaj.

Posle redeploy-a, direktan pristup ili osvežavanje na `https://ordo-draconis-suite.onrender.com/admin/login` treba da radi.

## Zašto Rewrite a ne Redirect?

- **Redirect** menja URL u adresnoj traci i šalje 301/302 – to ne želimo za SPA.
- **Rewrite** servira sadržaj fajla `/index.html` na originalnoj putanji (npr. `/admin/login`), tako da browser i dalje vidi isti URL, a React Router preuzima rutiranje.

## Ako na ordo-draconis-suite.onrender.com radi samo backend (Spring Boot)

Ako je taj domen pokazivan na **backend** servis (a ne na Static Site), onda GET `/admin/login` stiže do Springa koji nema tu rutu i vraća 404.

Moguća rešenja:

- **A)** Imam i poseban **Static Site** za frontend na Renderu → koristi URL tog Static Site-a za aplikaciju (npr. `https://ordo-draconis-suite.onrender.com` ako je on podešen za frontend), i na njemu dodaj Rewrite pravilo kao gore.
- **B)** Želiš jedan servis (samo backend) → tada backend mora da servira build frontenda i da za sve ne-API putanje vrati `index.html` (SPA fallback). To zahteva izmene u Spring Boot projektu i build korak koji uključuje frontend.
