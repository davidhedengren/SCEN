# Ditt personliga SCEN-bibliotek

SCEN använder samma Supabase-projekt som Kunskapsgymmet och Uppgiftslabbet. Den publika projektadressen och webbläsarnyckeln ligger i `scen-cloud.json`. Mejllänken använder ett redan befintligt användarkonto i projektet. SCEN har en egen lista över vilka konton som får använda biblioteket.

## Aktivera ditt konto en gång

1. Öppna **SQL Editor** i det delade projektet. Skapa en ny fråga, klistra in hela innehållet i [scen.sql](../supabase/scen.sql) och klicka på **Run**. Skriptet skapar SCEN:s kontolista, versionslagring och privata mediebucket. Filreglerna gäller bucketnamnet `scen-private`.
2. Öppna **Authentication → Users** och kopiera **User UID** för ditt eget konto. Kör följande som en ny SQL-fråga efter att du ersatt texten mellan citattecknen med ditt UID.

   ```sql
   insert into public.scen_accounts (owner)
   values ('DITT-USER-UID')
   on conflict do nothing;
   ```

3. Under **Authentication → URL Configuration → Redirect URLs**, lägg till `https://davidhedengren.github.io/SCEN/`. Använd **Add URL** så att de andra apparna behåller sina returadresser och sin Site URL. Projektets mejlmall för Magic Link behöver använda Supabases vanliga bekräftelselänk som respekterar returadressen.
4. Öppna [SCEN](https://davidhedengren.github.io/SCEN/) på den adressen, klicka på **Logga in** och ange ditt kontos e-postadress. Öppna länken från mejlet på samma enhet och i samma webbläsare som du beställde länken från. När det är klart visas **Privat molnbibliotek**.

## Använd biblioteket

- Under **Mitt konto** kan du välja vilka presentationer från den här webbläsaren som ska kopieras till kontot.
- När du är inloggad öppnar **Redigera** eller miniatyren en kurspresentation i redigeraren. Första ändringen sparar din privata version på samma plats i kursen. Därifrån öppnar **Spela** och **Redigera** din version även på en annan dator. Den offentliga kurslänken visar kursoriginalet. **Återgå till original** låter dig välja kursoriginalet igen. Tidigare kopior finns separat i biblioteket.
- SCEN sparar ett lokalt utkast först. **Sparad i molnet** visas först när presentationens mediefiler, de egna mallar som används och manusversionen har sparats. Externa webblänkar, exempelvis YouTube, fortsätter att kräva nät. Inloggningen gäller för din webbläsarflik.
- Öppna samma SCEN-adress på en andra dator och logga in där. De uppladdade bilderna och filmerna hämtas när du öppnar presentationen.
- Med redigeraren öppen kan du fortsätta skriva vid nätavbrott. Utkastet försöker synka vid återanslutning och nästa inloggning. **Mitt konto → Synka nu** gör ett nytt försök. Den fristående HTML-exporten går att spela offline.
- Om två datorer ändrar samma version sparas den parallella ändringen som en egen kopia. **Versioner** i biblioteket öppnar en äldre version som en ny presentation. När en presentation tas bort från biblioteket finns versionsrader och tillhörande media kvar i projektet.

## Prova klickredigeraren

Välj **Redigera** på **AI-agenter och miljöer**, välj scen 17 och klicka på **Dynamisk** i raden under bilden. **Ändra fokusram** låter dig rita eller flytta ramen och välja filmstart. **Lägg till fokus** skapar ett nytt klick. **Repetera från klicket** startar spelaren med det steget valt.

I **Minimax-algoritmen och beskärning**, välj scen 17 och ett bildsteg. Med **Markera nod** klickar du på en triangel eller väljer noden i listan. SCEN sparar markeringen i en egen diagramfil i din presentation, i diagrammets koordinater. Funktionen fungerar med SVG-bildsteg som innehåller markerade nodgrupper med polygoner.
