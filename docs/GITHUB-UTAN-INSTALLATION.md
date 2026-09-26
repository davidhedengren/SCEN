# Publicera Scen på GitHub utan att installera något

Allt görs i webbläsaren på github.com.

## 1. Skapa repot

1. Logga in på **github.com**. Skapa ett konto om du inte har något.
2. Klicka på **+** uppe till höger och välj **New repository**.
3. Skriv `scen` som **Repository name**. Välj **Public**, eftersom GitHub Pages är gratis för publika repon.
4. Kryssa inte i något under *Initialize this repository*.
5. Klicka **Create repository**.

## 2. Ladda upp filerna

1. Klicka på länken **uploading an existing file** på sidan som visas.
2. Öppna mappen `scen-repo` på datorn och markera **allt innehåll i den** (Ctrl + A), inte själva mappen.
3. Dra in det markerade i webbläsarfönstret. Mapparna `src`, `presentationer`, `bilder` och så vidare följer med.
4. Skriv till exempel `Första versionen` i rutan under **Commit changes** och klicka **Commit changes**.

## 3. Lägg till filen .nojekyll

Filer vars namn börjar med punkt kan försvinna vid uppladdningen. Den här filen måste finnas, annars gör GitHub om manusen till webbsidor.

1. Klicka **Add file → Create new file** i repot.
2. Skriv `.nojekyll` som filnamn och lämna innehållet tomt.
3. Klicka **Commit changes…** och sedan **Commit changes**.

## 4. Slå på GitHub Pages

1. Klicka på **Settings** i repot och välj **Pages** i menyn till vänster.
2. Under **Build and deployment → Source**, välj **Deploy from a branch**.
3. Under **Branch**, välj `main` och `/ (root)`. Klicka **Save**.
4. Vänta en till två minuter och ladda om sidan. Överst står adressen, till exempel `https://ditt-namn.github.io/scen/`.

## Redigera efteråt

- **Ändra ett manus:** öppna filen i `presentationer/`, klicka på pennan (**Edit this file**), ändra och klicka **Commit changes**. Sidan uppdateras efter någon minut.
- **Ny presentation:** välj **Spara på datorn → Manus (.md)** i Scen. Gå till `presentationer/` på GitHub, välj **Add file → Upload files** och ladda upp filen. Öppna sedan `presentationer/index.json` och lägg till filnamnet i listan:
  ```json
  [
    "ai-agenter-och-miljoer.md",
    "kastrorelse.md",
    "min-nya-presentation.md"
  ]
  ```
- **Bilder:** ladda upp dem till en mapp i `bilder/` och skriv `bild: bilder/mapp/fil.jpg` i manuset.
- **Ny egen mall:** välj **Spara som fil** under Mallar. Ladda upp filen till `mallar/` och lägg till filnamnet i `mallar/index.json`.

`scen.html` uppdateras inte av sig själv när du ändrar i repot. Den kan byggas om med `node scripts/scen.mjs bygg` på en dator som har Node, eller av Claude.
