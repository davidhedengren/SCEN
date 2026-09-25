# Egna mallar

En egen mall är HTML och CSS med platshållare. Den följer automatiskt det tema som presentationen använder.

Gör mallen i appen under **Mallar → Ny mall för hand**, eller **Ny mall med Claude** i claude.ai. Spara den med **Spara som fil**, lägg filen i `mallar/` och kör `npm run index`.

```json
{
  "id": "numrerade-kort",
  "name": "Numrerade kort",
  "desc": "Tre till fyra steg eller principer med stora siffror.",
  "html": "<p class=\"eyebrow\">{{etikett}}</p>\n<h2>{{rubrik}}</h2>\n<ol class=\"nums\">{{punkter}}</ol>",
  "css": "& { align-content: center; }\n.nums li b { font-size: 40px; }"
}
```

I manus: `[egen: numrerade-kort]`.

## Platshållare

| Platshållare | Blir |
|---|---|
| `{{rubrik}}` | Rubriken |
| `{{text}}` | Texten |
| `{{etikett}}` | Etiketten |
| `{{svar}}` | Svaret |
| `{{bild}}` | Bildens adress. Använd som `<img src="{{bild}}">` |
| `{{punkter}}` | En `<li>` per rad i listan, var och en ett klicksteg. `- A \| B` blir `<b>A</b><span>B</span>`. |

## Regler

- Bilden är 1920×1080 px. Sektionen har redan `padding: 112px 144px` och `display: grid`.
- CSS skrivs utan yttre selektor. Den läggs inuti mallen automatiskt. Använd `& { }` för själva bildytan.
- Använd temats variabler så att mallen fungerar i alla teman: `--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--accent-2`, `--hl`, `--font-display`, `--font-mono`, `--radius`.
- `data-anim="mask|rise|fade|zoom|words|blur|wipe|pop"` och `data-delay="300"` ger rörelse på vilket element som helst. `data-step="1"` visar ett element på ett klick.
- Script, formulär, iframes och externa adresser tas bort när mallen visas.
