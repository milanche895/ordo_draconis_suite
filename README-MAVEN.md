# Maven Wrapper - Uputstvo

## Kako koristiti Maven Wrapper

Pošto nemate Maven instaliran globalno, možete koristiti Maven Wrapper koji je sada dodat u projekat.

### Windows (PowerShell):

```powershell
cd backend
.\mvnw.cmd clean
.\mvnw.cmd compile
.\mvnw.cmd spring-boot:run
```

### Alternativno - Instalacija Maven-a

Ako želite da instalirate Maven globalno:

1. **Preuzmite Maven:**
   - Idite na https://maven.apache.org/download.cgi
   - Preuzmite `apache-maven-3.9.5-bin.zip`

2. **Ekstraktujte i dodajte u PATH:**
   - Ekstraktujte u `C:\Program Files\Apache\maven`
   - Dodajte `C:\Program Files\Apache\maven\bin` u PATH environment variable

3. **Proverite instalaciju:**
   ```powershell
   mvn -version
   ```

### Koristeći IDE (IntelliJ IDEA / VS Code)

Većina IDE-ova ima ugrađenu Maven podršku:
- **IntelliJ IDEA**: Desni klik na `pom.xml` → `Maven` → `Reload Project`
- **VS Code**: Instalirajte "Extension Pack for Java" i "Maven for Java"

### Trenutni status

Vidim da već postoji `target/` folder, što znači da je projekat već kompajliran (verovatno kroz IDE).

**Za build koristite:**
```powershell
cd backend
.\mvnw.cmd clean compile
```

**Za pokretanje:**
```powershell
.\mvnw.cmd spring-boot:run
```
