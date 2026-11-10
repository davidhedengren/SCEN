"""Bygger diagrammen till presentationen Minimax-algoritmen och beskärning.

Kör:  python3 scripts/build-minimax-visuals.py

Skriver SVG-tillstånd till bilder/minimax/v3/. Inga beroenden utöver Pillow
(bara för att komprimera robotbilden i scen 7).

Principer
- Spelträden för tre-i-rad byggs från riktiga spelställningar. Värdena räknas
  med minimax här i skriptet och kontrolleras mot det som står i manuset.
- Alla markeringar (fokusramar, val, beskärning) ritas utifrån nodens egna
  koordinater i samma SVG. Inget placeras med gissade procentkoordinater.
- Alla tillstånd i en serie har samma viewBox, så diagrammet står stilla
  mellan klicken. Bara fokus och avslöjade värden ändras.
- Fokus styrs med kontrast: aktuella noder är fulla och omringade,
  resten tonas ned men går att läsa.
"""
from pathlib import Path
import base64, html, io, json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'bilder/minimax/v3'
OUT.mkdir(parents=True, exist_ok=True)

# Färger efter temat Natt. Bakgrunden är genomskinlig så att temat syns.
INK = '#E6F1F5'
MUTED = '#8BA3B4'
FAINT = '#5B7389'
EDGE = '#3B5572'
CARD = '#0F1A2B'
CARD_LINE = '#28405C'
GRID = '#365571'
MAXC = '#3DD6D0'   # X / MAX
MINC = '#FFB547'   # O / MIN
CUT = '#FF7A6E'    # beskärning
FONT = "'IBM Plex Sans','Segoe UI',Inter,Helvetica,Arial,sans-serif"
MONO = "'IBM Plex Mono','SFMono-Regular',Menlo,Consolas,monospace"
DIM = .42          # opacitet för det som inte är i fokus

W = 1760           # gemensam bredd för alla diagram


def esc(s):
    return html.escape(str(s))


def fmtnum(v):
    if isinstance(v, (int, float)):
        return ('−' + str(abs(v))) if v < 0 else str(v)
    return str(v).replace('-', '−')


def text(x, y, s, size=28, fill=INK, anchor='middle', weight=400, family=FONT, extra=''):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{extra}>{esc(s)}</text>')


DEFS = ('<defs>'
        '<filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>'
        '<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>'
        '</defs>')


def save(name, body, h):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {h}" width="{W}" height="{h}" role="img">'
           f'{DEFS}{body}</svg>')
    (OUT / f'{name}.svg').write_text(svg)


def pill(x, y, s, color, size=24, anchor='start', family=MONO, fill=CARD):
    """Liten etikett med ram. x,y = vänster/mitt-punkt beroende på anchor."""
    w = len(s) * size * .62 + 30
    h = size + 20
    left = x if anchor == 'start' else x - w if anchor == 'end' else x - w / 2
    return (f'<rect x="{left:.1f}" y="{y - h / 2:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{h / 2:.1f}" '
            f'fill="{fill}" stroke="{color}" stroke-width="2.5"/>'
            + text(left + w / 2, y + size * .36, s, size, color, 'middle', 600, family))


def legend_ttt(x=0, y=34):
    s = ''
    s += f'<g transform="translate({x},{y})">'
    s += f'<path d="M4,-12L24,8M24,-12L4,8" stroke="{MAXC}" stroke-width="4" stroke-linecap="round"/>'
    s += text(36, 6, 'X = MAX  ·  vinst +1', 22, MUTED, 'start')
    s += f'<circle cx="284" cy="-2" r="11" fill="none" stroke="{MINC}" stroke-width="4"/>'
    s += text(306, 6, 'O = MIN  ·  vinst −1', 22, MUTED, 'start')
    s += text(560, 6, 'Oavgjort 0', 22, MUTED, 'start')
    s += '</g>'
    return s


def legend_tree(x=0, y=34):
    s = f'<g transform="translate({x},{y})">'
    s += f'<polygon points="14,-14 28,10 0,10" fill="{MAXC}" fill-opacity=".2" stroke="{MAXC}" stroke-width="3"/>'
    s += text(40, 6, 'MAX väljer största', 22, MUTED, 'start')
    s += f'<polygon points="250,-14 278,-14 264,10" fill="{MINC}" fill-opacity=".2" stroke="{MINC}" stroke-width="3"/>'
    s += text(290, 6, 'MIN väljer minsta', 22, MUTED, 'start')
    s += '</g>'
    return s


# ---------------------------------------------------------------------------
# Tre-i-rad: spellogik
# ---------------------------------------------------------------------------
LINES = [(0, 1, 2), (3, 4, 5), (6, 7, 8), (0, 3, 6), (1, 4, 7), (2, 5, 8), (0, 4, 8), (2, 4, 6)]


def winner(b):
    for a, c, d in LINES:
        if b[a] != '.' and b[a] == b[c] == b[d]:
            return b[a], (a, c, d)
    return None, None


def build_game(board, player, order=None, depth=0, key='r'):
    """Fullständigt spelträd från en ställning. order: valfri ordning på dragen per nyckel."""
    w, line = winner(board)
    node = {'key': key, 'board': board, 'player': player, 'depth': depth, 'children': [], 'win': line, 'winner': w}
    if w:
        node['value'] = 1 if w == 'X' else -1
        return node
    empties = [i for i, c in enumerate(board) if c == '.']
    if not empties:
        node['value'] = 0
        return node
    if order and key in order:
        empties = order[key]
    for j, i in enumerate(empties):
        b = board[:i] + player + board[i + 1:]
        child = build_game(b, 'O' if player == 'X' else 'X', order, depth + 1, f'{key}{j}')
        child['move'] = i
        node['children'].append(child)
    vals = [c['value'] for c in node['children']]
    node['value'] = max(vals) if player == 'X' else min(vals)
    return node


def walk(n):
    yield n
    for c in n['children']:
        yield from walk(c)


def parse_board(rows):
    s = ''.join(rows.split())
    assert len(s) == 9, rows
    return s


# ---------------------------------------------------------------------------
# Tre-i-rad: ritning
# ---------------------------------------------------------------------------

def draw_board(x, y, s, b, last=None, win=None):
    out = f'<rect x="{x:.1f}" y="{y:.1f}" width="{s}" height="{s}" rx="{s * .09:.1f}" fill="{CARD}" stroke="{CARD_LINE}" stroke-width="2"/>'
    pad = s * .09
    c = (s - 2 * pad) / 3
    if last is not None:
        cx, cy = x + pad + (last % 3) * c, y + pad + (last // 3) * c
        col = MAXC if b[last] == 'X' else MINC
        out += f'<rect x="{cx + 2:.1f}" y="{cy + 2:.1f}" width="{c - 4:.1f}" height="{c - 4:.1f}" rx="{c * .14:.1f}" fill="{col}" fill-opacity=".17"/>'
    for k in (1, 2):
        out += f'<path d="M{x + pad + k * c:.1f},{y + pad:.1f}V{y + s - pad:.1f}M{x + pad:.1f},{y + pad + k * c:.1f}H{x + s - pad:.1f}" stroke="{GRID}" stroke-width="2" stroke-linecap="round"/>'
    sw = max(3, s * .042)
    for i, ch in enumerate(b):
        cx, cy = x + pad + (i % 3 + .5) * c, y + pad + (i // 3 + .5) * c
        m = c * .27
        if ch == 'X':
            out += f'<path d="M{cx - m:.1f},{cy - m:.1f}L{cx + m:.1f},{cy + m:.1f}M{cx + m:.1f},{cy - m:.1f}L{cx - m:.1f},{cy + m:.1f}" stroke="{MAXC}" stroke-width="{sw:.1f}" stroke-linecap="round"/>'
        elif ch == 'O':
            out += f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{c * .29:.1f}" fill="none" stroke="{MINC}" stroke-width="{sw:.1f}"/>'
    if win:
        a, d = win[0], win[2]
        ax, ay = x + pad + (a % 3 + .5) * c, y + pad + (a // 3 + .5) * c
        dx, dy = x + pad + (d % 3 + .5) * c, y + pad + (d // 3 + .5) * c
        ex, ey = (dx - ax) * .14, (dy - ay) * .14
        col = MAXC if b[a] == 'X' else MINC
        seg = f'M{ax - ex:.1f},{ay - ey:.1f}L{dx + ex:.1f},{dy + ey:.1f}'
        out += f'<path d="{seg}" stroke="{col}" stroke-width="{s * .11:.1f}" stroke-linecap="round" opacity=".35" filter="url(#soft)"/>'
        out += f'<path d="{seg}" stroke="{INK}" stroke-width="{s * .035:.1f}" stroke-linecap="round" opacity=".95"/>'
    return out


def result_word(n):
    if n['winner'] == 'X':
        return 'X vinner'
    if n['winner'] == 'O':
        return 'O vinner'
    if not n['children']:
        return 'Oavgjort'
    return ''


def game_tree_svg(tree, pos, s, h, shown, focus=(), chosen=(), callouts=None, extra='', row_labels=None, leftpad=0):
    """pos: key -> (x, y) övre vänstra hörnet på brädet.
    shown: nycklar vars värde syns. focus: nycklar i fokus. chosen: kanter (förälder, barn) som visar valet."""
    callouts = callouts or {}
    nodes = {n['key']: n for n in walk(tree)}
    r = max(26, s * .24)
    gap = 12
    body = ''
    anyfocus = bool(focus)
    # radetiketter
    if row_labels:
        for y, label, sub in row_labels:
            body += text(leftpad, y + s / 2 - 4, label, 24, INK, 'start', 600)
            if sub:
                body += text(leftpad, y + s / 2 + 26, sub, 20, MUTED, 'start')
    # kanter
    for k, n in nodes.items():
        for c in n['children']:
            (px, py), (cx, cy) = pos[k], pos[c['key']]
            x1, y1 = px + s / 2, py + s + 8
            x2, y2 = cx + s / 2, cy - 8
            on = (k, c['key']) in chosen
            col = (MAXC if n['player'] == 'X' else MINC) if on else EDGE
            op = 1 if (not anyfocus or (k in focus and c['key'] in focus) or on) else DIM
            body += f'<path d="M{x1:.1f},{y1:.1f}L{x2:.1f},{y2:.1f}" stroke="{col}" stroke-width="{5 if on else 2.5}" stroke-linecap="round" opacity="{op}"/>'
    # fokusramar under noderna
    for k in focus:
        x, y = pos[k]
        n = nodes[k]
        fw = s + gap + 2 * r + 30
        fh = s + 30 + (34 if (k in shown and result_word(n)) else 0)
        col = MAXC if n['player'] == 'X' else MINC
        if not n['children']:
            col = INK
        body += f'<rect x="{x - 15:.1f}" y="{y - 15:.1f}" width="{fw:.1f}" height="{fh:.1f}" rx="20" fill="{col}" fill-opacity=".07" stroke="{col}" stroke-width="10" stroke-opacity=".25" filter="url(#glow)"/>'
        body += f'<rect data-focus-board="{k}" x="{x - 15:.1f}" y="{y - 15:.1f}" width="{fw:.1f}" height="{fh:.1f}" rx="20" fill="{col}" fill-opacity=".06" stroke="{col}" stroke-width="3"/>'
    # noder
    for k, n in nodes.items():
        x, y = pos[k]
        op = 1 if (not anyfocus or k in focus) else DIM
        g = f'<g data-node="{k}" opacity="{op}">'
        g += f'<rect data-board="{k}" x="{x:.1f}" y="{y:.1f}" width="{s}" height="{s}" fill="none"/>'
        g += draw_board(x, y, s, n['board'], n.get('move'), n['win'] if k in shown else None)
        bx, by = x + s + gap + r, y + s / 2
        terminal = not n['children']
        col = INK if terminal else (MAXC if n['player'] == 'X' else MINC)
        if k in shown:
            g += f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{r:.1f}" fill="{col}" fill-opacity=".16" stroke="{col}" stroke-width="3"/>'
            g += text(bx, by + r * .36, fmtnum(n['value']), r * 1.0, INK, 'middle', 700)
            word = result_word(n)
            if word:
                g += text(x + s / 2, y + s + 30, word, 21, MUTED, 'middle', 500)
        else:
            g += f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{r:.1f}" fill="none" stroke="{FAINT}" stroke-width="2.5" stroke-dasharray="6 6"/>'
            g += text(bx, by + r * .34, '?', r * .9, FAINT, 'middle', 600)
        g += '</g>'
        body += g
    for k, (label, side) in callouts.items():
        x, y = pos[k]
        n = nodes[k]
        col = MAXC if n['player'] == 'X' else MINC
        if side == 'right':
            body += pill(x + s + gap + 2 * r + 26, y + s / 2, label, col)
        elif side == 'left':
            body += pill(x - 26, y + s / 2, label, col, anchor='end')
        else:
            body += pill(x + s / 2 + (gap + 2 * r) / 2, y + s + 46, label, col, anchor='middle')
    return body + extra


def tidy_positions(tree, s, x0, x1, y0, row_h, node_w):
    """Löv i ordning, föräldrar centrerade över barnen."""
    leaves = [n for n in walk(tree) if not n['children']]
    # Ett slott per löv (ett terminalt inre led räknas som löv).
    slots = len(leaves)
    span = (x1 - x0)
    step = span / slots
    xs = {}

    def lay(n):
        if not n['children']:
            idx = leaves.index(n)
            xs[n['key']] = x0 + step * (idx + .5)
        else:
            for c in n['children']:
                lay(c)
            xs[n['key']] = sum(xs[c['key']] for c in n['children']) / len(n['children'])
    lay(tree)
    return {k: (xs[k] - node_w / 2, y0 + nodes_depth * row_h) for k, nodes_depth in ((n['key'], n['depth']) for n in walk(tree))}


def check_values(tree, expected):
    nodes = {n['key']: n for n in walk(tree)}
    for k, v in expected.items():
        assert nodes[k]['value'] == v, f'{k}: räknat {nodes[k]["value"]}, väntat {v}'


# ---------------------------------------------------------------------------
# Scen 6: beslutsträd för tre-i-rad
# ---------------------------------------------------------------------------

def scene6():
    h = 900
    s0, s1, s2 = 118, 104, 78
    left = 210
    span = W - left
    root = (left + span / 2 - s0 / 2, 40)
    kids = []
    for i in range(9):
        cx = left + span * (i + .5) / 9
        kids.append((cx - s1 / 2, 330))
    focus_child = 4  # X i mitten ger symmetriska svar
    replies = [i for i in range(9) if i != 4]
    rep_pos = []
    for j in range(8):
        cx = left + 70 + (span - 140) * (j + .5) / 8
        rep_pos.append((cx - s2 / 2, 700))

    def frame(step):
        body = ''
        # radetiketter med antal ställningar
        rows = [(root[1], 'Tomt bräde', '1 ställning'), (kids[0][1], 'X:s drag', '9 ställningar'), (rep_pos[0][1] - 8, 'O:s svar', '9 · 8 = 72 ställningar')]
        for i, (y, a, b) in enumerate(rows):
            if i == 2 and step < 3:
                continue
            sz = (s0, s1, s2)[i]
            body += text(0, y + sz / 2 - 2, a, 25, INK, 'start', 600)
            body += text(0, y + sz / 2 + 28, b, 21, MUTED, 'start')
        dim_root = step in (2, 3)
        dim_kids = step in (1,)
        # kanter rot → barn
        rx, ry = root[0] + s0 / 2, root[1] + s0 + 6
        for i, (x, y) in enumerate(kids):
            on = step == 2 or (step == 3 and i == focus_child)
            op = 1 if (step == 0 or on) else DIM
            col = MAXC if on else EDGE
            body += f'<path d="M{rx:.1f},{ry:.1f}L{x + s1 / 2:.1f},{y - 6:.1f}" stroke="{col}" stroke-width="{3.5 if on else 2.2}" stroke-linecap="round" opacity="{op}"/>'
        # solfjädrar under varje barn: 8 möjliga svar
        for i, (x, y) in enumerate(kids):
            if step == 3 and i == focus_child:
                continue
            cx, cy = x + s1 / 2, y + s1 + 6
            op = .55 if step == 0 else .22
            for j in range(8):
                ex = cx + (j - 3.5) * 13
                body += f'<path d="M{cx:.1f},{cy:.1f}L{ex:.1f},{cy + 92:.1f}" stroke="{EDGE}" stroke-width="1.6" opacity="{op}"/>'
            body += text(cx, cy + 128, '8 svar', 18, FAINT, 'middle', 400, extra=f' opacity="{op + .2:.2f}"')
        # svar för barnet i fokus
        if step == 3:
            kx, ky = kids[focus_child]
            cx, cy = kx + s1 / 2, ky + s1 + 6
            for j, (x, y) in enumerate(rep_pos):
                body += f'<path d="M{cx:.1f},{cy:.1f}L{x + s2 / 2:.1f},{y - 6:.1f}" stroke="{MINC}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>'
        # rot
        if step == 1:
            body += f'<rect data-focus-board="rot" x="{root[0] - 14}" y="{root[1] - 14}" width="{s0 + 28}" height="{s0 + 28}" rx="20" fill="{INK}" fill-opacity=".06" stroke="{INK}" stroke-width="3"/>'
        body += f'<g data-node="rot" opacity="{DIM if dim_root else 1}"><rect data-board="rot" x="{root[0]}" y="{root[1]}" width="{s0}" height="{s0}" fill="none"/>' + draw_board(*root, s0, '.' * 9) + '</g>'
        if step == 1:
            body += text(root[0] + s0 + 30, root[1] + s0 / 2 + 8, 'Rotnod: spelet innan första draget', 24, INK, 'start', 500)
        for i, (x, y) in enumerate(kids):
            b = '.' * i + 'X' + '.' * (8 - i)
            on = step == 2 or (step == 3 and i == focus_child)
            if on:
                body += f'<rect data-focus-board="k{i}" x="{x - 10}" y="{y - 10}" width="{s1 + 20}" height="{s1 + 20}" rx="16" fill="{MAXC}" fill-opacity=".06" stroke="{MAXC}" stroke-width="3"/>'
            op = 1 if (step == 0 or on) else DIM
            body += f'<g data-node="k{i}" opacity="{op}"><rect data-board="k{i}" x="{x:.1f}" y="{y}" width="{s1}" height="{s1}" fill="none"/>' + draw_board(x, y, s1, b, i) + '</g>'
        if step == 3:
            base = '....X....'
            for j, (x, y) in enumerate(rep_pos):
                i = replies[j]
                b = base[:i] + 'O' + base[i + 1:]
                body += f'<g data-node="s{j}"><rect data-board="s{j}" x="{x:.1f}" y="{y}" width="{s2}" height="{s2}" fill="none"/>' + draw_board(x, y, s2, b, i) + '</g>'
        return body

    for step in range(4):
        save(f'speltrad-{step}', frame(step), h)


# ---------------------------------------------------------------------------
# Scen 7, 8, 10: konkreta minimaxträd för tre-i-rad
# ---------------------------------------------------------------------------

def robot_image_data():
    src = ROOT / 'bilder/minimax/original/image6.png'
    try:
        from PIL import Image
        im = Image.open(src).convert('RGB')
        im.thumbnail((560, 560))
        buf = io.BytesIO()
        im.save(buf, 'JPEG', quality=82, optimize=True)
        return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
    except ImportError:
        return 'data:image/png;base64,' + base64.b64encode(src.read_bytes()).decode()


def scene7():
    board = parse_board('.XO OXX X.O')
    tree = build_game(board, 'O', order={'r': [0, 7]})
    check_values(tree, {'r': 0, 'r0': 1, 'r1': 0, 'r00': 1, 'r10': 0})
    h = 860
    s = 150
    left = 620
    pos = {'r': (left + 400, 70), 'r0': (left + 150, 360), 'r1': (left + 660, 360), 'r00': (left + 150, 640), 'r10': (left + 660, 640)}
    img = robot_image_data()
    art = (f'<clipPath id="rc"><rect x="0" y="40" width="560" height="560" rx="26"/></clipPath>'
           f'<image href="{img}" x="0" y="40" width="560" height="560" clip-path="url(#rc)" preserveAspectRatio="xMidYMid slice"/>'
           f'<rect x="0" y="40" width="560" height="560" rx="26" fill="none" stroke="{CARD_LINE}" stroke-width="2"/>')
    # Originalets citat, ordagrant.
    quote = ['”Jag baserar mitt drag nu på vad min', 'motståndare kommer göra i nästa drag', 'och för att göra det funderar jag över',
             'vad jag skulle göra efter det och så', 'vidare”']
    art += f'<rect x="0" y="630" width="5" height="{len(quote) * 37 - 4}" rx="2.5" fill="{MINC}"/>'
    for i, line in enumerate(quote):
        art += text(26, 656 + i * 37, line, 24, INK, 'start', 400, extra=' font-style="italic"')
    rows = [(70, 'O:s tur', 'MIN väljer'), (360, 'X:s tur', 'MAX väljer'), (640, 'Slut', 'Färdigt spel')]
    labels = ''
    for y, a, b in rows:
        labels += text(left - 10, y + s / 2 - 2, a, 24, INK, 'start', 600) + text(left - 10, y + s / 2 + 28, b, 20, MUTED, 'start')
    # Etiketterna står till vänster om träden; flytta noderna så att de inte krockar.
    frames = [
        (set(), set(), set(), {}),
        ({'r00', 'r10'}, {'r00', 'r10'}, set(), {}),
        ({'r00', 'r10', 'r0', 'r1'}, {'r0', 'r1', 'r00', 'r10'}, {('r0', 'r00'), ('r1', 'r10')}, {}),
        ({'r00', 'r10', 'r0', 'r1', 'r'}, {'r', 'r1', 'r10'}, {('r0', 'r00'), ('r1', 'r10'), ('r', 'r1')}, {'r': ('min(1, 0) = 0', 'right')}),
    ]
    for i, (shown, focus, chosen, calls) in enumerate(frames):
        body = art + labels + game_tree_svg(tree, pos, s, h, shown, focus, chosen, calls)
        save(f'spel-7-{i}', body, h)


def scene8():
    board = parse_board('.XO OX. X.O')
    # Ordning som i originalet: vänster X i mitten höger, sedan X uppe till vänster, sist X i mitten nere.
    tree = build_game(board, 'X', order={'r': [5, 0, 7], 'r0': [0, 7], 'r1': [5, 7]})
    check_values(tree, {'r': 1, 'r0': 0, 'r1': -1, 'r2': 1, 'r00': 1, 'r01': 0, 'r10': -1, 'r11': 0})
    h = 910
    s = 124
    nw = s + 12 + 2 * max(26, s * .24)
    pos = tidy_positions(tree, s, 170, W, 50, 222, nw)
    rows = [(50, 'X:s tur', 'MAX'), (272, 'O:s tur', 'MIN'), (494, 'X:s tur', 'MAX'), (716, 'Slut', '')]
    labels = ''
    for y, a, b in rows:
        labels += text(0, y + s / 2 - 2, a, 24, INK, 'start', 600) + (text(0, y + s / 2 + 28, b, 20, MUTED, 'start') if b else '')
    A = {'r000', 'r010'}
    frames = []
    shown = set()
    chosen = set()
    plan = [
        (A, A, set(), {}),
        ({'r00', 'r01'}, {'r00', 'r01', 'r000', 'r010'}, {('r00', 'r000'), ('r01', 'r010')}, {}),
        ({'r0'}, {'r0', 'r00', 'r01'}, {('r0', 'r01')}, {'r0': ('min(1, 0) = 0', 'left')}),
        ({'r10', 'r110', 'r11', 'r1'}, {'r1', 'r10', 'r11', 'r110'}, {('r11', 'r110'), ('r1', 'r10')}, {'r1': ('min(−1, 0) = −1', 'below')}),
        ({'r2'}, {'r2'}, set(), {}),
        ({'r'}, {'r', 'r2'}, {('r', 'r2')}, {'r': ('max(0, −1, 1) = 1', 'right')}),
    ]
    save('spel-8-0', labels + game_tree_svg(tree, pos, s, h, set()), h)
    for i, (add, focus, ch, calls) in enumerate(plan, 1):
        shown |= add
        chosen |= ch
        save(f'spel-8-{i}', labels + game_tree_svg(tree, pos, s, h, shown, focus, chosen, calls), h)


def scene10():
    board = parse_board('O.O OXX X..')
    # Originalets ordning: X uppe i mitten, X nere i mitten, X nere till höger.
    tree = build_game(board, 'X', order={'r': [1, 7, 8], 'r0': [7, 8], 'r1': [1, 8], 'r2': [1, 7]})
    # Värdena räknas, inte avskrivna. Högra grenen är −1: O vinner direkt med övre mitten.
    check_values(tree, {'r': 0, 'r0': 0, 'r1': -1, 'r2': -1,
                        'r00': 0, 'r01': 1, 'r10': -1, 'r11': 1, 'r20': -1, 'r21': 0})
    h = 910
    s = 124
    nw = s + 12 + 2 * max(26, s * .24)
    pos = tidy_positions(tree, s, 170, W, 50, 222, nw)
    rows = [(50, 'X:s tur', 'MAX'), (272, 'O:s tur', 'MIN'), (494, 'X:s tur', 'MAX'), (716, 'Slut', '')]
    labels = ''
    for y, a, b in rows:
        labels += text(0, y + s / 2 - 2, a, 24, INK, 'start', 600) + (text(0, y + s / 2 + 28, b, 20, MUTED, 'start') if b else '')
    leaves = {'r000', 'r010', 'r10', 'r110', 'r20', 'r210'}
    maxes = {'r00', 'r01', 'r11', 'r21'}
    mins = {'r0', 'r1', 'r2'}
    plan = [
        (leaves, leaves, set(), {}),
        (maxes, maxes | {'r000', 'r010', 'r110', 'r210'}, {('r00', 'r000'), ('r01', 'r010'), ('r11', 'r110'), ('r21', 'r210')}, {}),
        (mins, mins | {'r00', 'r01', 'r10', 'r11', 'r20', 'r21'}, {('r0', 'r00'), ('r1', 'r10'), ('r2', 'r20')},
         {'r0': ('min(0, 1) = 0', 'below'), 'r1': ('min(−1, 1) = −1', 'below'), 'r2': ('min(−1, 0) = −1', 'below')}),
        ({'r'}, {'r', 'r0', 'r00', 'r000'}, {('r', 'r0')}, {'r': ('max(0, −1, −1) = 0', 'right')}),
    ]
    shown = set()
    chosen = set()
    save('spel-10-0', labels + game_tree_svg(tree, pos, s, h, set()), h)
    for i, (add, focus, ch, calls) in enumerate(plan, 1):
        shown |= add
        chosen |= ch
        save(f'spel-10-{i}', labels + game_tree_svg(tree, pos, s, h, shown, focus, chosen, calls), h)
    return tree


# ---------------------------------------------------------------------------
# Talträd med trianglar: ▲ MAX, ▼ MIN
# ---------------------------------------------------------------------------

def tri_points(x, y, role, w, h, grow=1.0):
    w, h = w * grow, h * grow
    if role == 'min':
        return [(x - w / 2, y - h / 2), (x + w / 2, y - h / 2), (x, y + h / 2)]
    return [(x, y - h / 2), (x + w / 2, y + h / 2), (x - w / 2, y + h / 2)]


def pts(p):
    return ' '.join(f'{a:.1f},{b:.1f}' for a, b in p)


def num_tree(name, nodes, edges, values, h, focus=(), chosen=(), pruned=(), callouts=None, bounds=None,
             size=1.0, counter='', legend=True, hidden=(), changed=(), rule=''):
    """nodes: key -> (x, y, role). values: key -> text. pruned: barn vars inkommande kant är beskuren.
    hidden: noder som inte är upptäckta ännu (ritas som konturer)."""
    callouts = callouts or {}
    bounds = bounds or {}
    tw, th = 124 * size, 108 * size
    anyfocus = bool(focus)
    children = {}
    for a, b in edges:
        children.setdefault(a, []).append(b)

    def subtree(k):
        out = {k}
        for c in children.get(k, []):
            out |= subtree(c)
        return out
    cut = set()
    for k in pruned:
        cut |= subtree(k)

    body = legend_tree(0, 30) if legend else ''
    if counter:
        body += text(W, 36, counter, 24, INK, 'end', 600, MONO)
    # kanter
    for a, b in edges:
        x1, y1, r1 = nodes[a]
        x2, y2, r2 = nodes[b]
        y1 += th / 2 + 4
        y2 -= th / 2 + 4
        on = (a, b) in chosen
        isfocus = a in focus and b in focus
        if b in cut:
            op = .55 if b in pruned else .25
            col = CUT if b in pruned else EDGE
            body += f'<path data-edge="{a}:{b}" d="M{x1:.1f},{y1:.1f}L{x2:.1f},{y2:.1f}" stroke="{col}" stroke-width="2.5" stroke-dasharray="9 8" opacity="{op}"/>'
            if b in pruned:
                mx, my = x1 + (x2 - x1) * .55, y1 + (y2 - y1) * .55
                body += f'<g data-cut="{b}"><circle cx="{mx:.1f}" cy="{my:.1f}" r="19" fill="{CUT}" fill-opacity=".14" stroke="{CUT}" stroke-width="2.5"/><path d="M{mx - 8:.1f},{my - 8:.1f}L{mx + 8:.1f},{my + 8:.1f}M{mx + 8:.1f},{my - 8:.1f}L{mx - 8:.1f},{my + 8:.1f}" stroke="{CUT}" stroke-width="4" stroke-linecap="round"/></g>'
            continue
        col = (MAXC if r1 == 'max' else MINC) if on else (INK if isfocus else EDGE)
        op = 1 if (not anyfocus or isfocus or on) else DIM + .1
        body += f'<path data-edge="{a}:{b}" d="M{x1:.1f},{y1:.1f}L{x2:.1f},{y2:.1f}" stroke="{col}" stroke-width="{5 if on else 3 if isfocus else 2.5}" stroke-linecap="round" fill="none" opacity="{op}"/>'
    # fokusglöd
    for k in focus:
        x, y, role = nodes[k]
        col = MAXC if role == 'max' else MINC
        p = tri_points(x, y + (th * .06 if role == 'max' else -th * .06), role, tw, th, 1.42)
        body += f'<polygon points="{pts(p)}" fill="{col}" fill-opacity=".14" stroke="{col}" stroke-width="12" stroke-opacity=".28" stroke-linejoin="round" filter="url(#glow)"/>'
        body += f'<polygon data-focus-node="{k}" points="{pts(p)}" fill="{col}" fill-opacity=".05" stroke="{col}" stroke-width="3" stroke-linejoin="round"/>'
    # noder
    for k, (x, y, role) in nodes.items():
        col = MAXC if role == 'max' else MINC
        if k in cut:
            op = .22
        elif anyfocus and k not in focus:
            op = DIM + .16
        else:
            op = 1
        p = tri_points(x, y, role, tw, th)
        if k in hidden:
            body += f'<g data-node="{k}" opacity="{op}"><polygon points="{pts(p)}" fill="none" stroke="{col}" stroke-width="2.5" stroke-dasharray="7 7" stroke-linejoin="round" opacity=".7"/></g>'
            continue
        v = values.get(k, '')
        ty = y + th * .26 if role == 'max' else y + th * .02
        fs = 40 * size if len(str(v)) < 3 else 30 * size
        g = f'<g data-node="{k}" opacity="{op}"><polygon points="{pts(p)}" fill="{col}" fill-opacity="{.26 if v != "" else .1}" stroke="{col}" stroke-width="3" stroke-linejoin="round"/>'
        if v != '':
            g += text(x, ty, fmtnum(v), fs, INK, 'middle', 700)
        g += '</g>'
        body += g
    # α/β: som i simuleringen har varje besökt nod sitt eget sökfönster.
    # α (MAX:s garanti) överst i MAX-färg, β (MIN:s garanti) under i MIN-färg.
    # Ett värde som just ändrats visas som "gammalt → nytt" och lyser.
    changed = changed if isinstance(changed, dict) else {k: None for k in changed}
    for k, (a, b) in bounds.items():
        x, y, role = nodes[k]
        op = .4 if k in cut else (.62 if anyfocus and k not in focus else 1)
        ch = changed.get(k)
        rows = []
        for which, sym, val, col, dy in (('a', 'α', a, MAXC, -25), ('b', 'β', b, MINC, 25)):
            hot = ch is not None and ch[0] == which
            lab = f'{sym} = {fmtnum(ch[1])} → {fmtnum(val)}' if hot else f'{sym} = {fmtnum(val)}'
            rows.append((lab, col, dy, hot))
        wmax = max(len(r[0]) for r in rows) * 23 * .62 + 30
        left = x + tw / 2 + 14 if x + tw / 2 + 14 + wmax < W else x - tw / 2 - 14 - wmax
        g = f'<g data-bounds="{k}" opacity="{op}">'
        for lab, col, dy, hot in rows:
            w = len(lab) * 23 * .62 + 30
            if hot:
                g += f'<rect x="{left:.1f}" y="{y + dy - 20:.1f}" width="{w:.1f}" height="40" rx="20" fill="{col}" fill-opacity=".35" filter="url(#glow)"/>'
            g += (f'<rect x="{left:.1f}" y="{y + dy - 20:.1f}" width="{w:.1f}" height="40" rx="20" fill="{col if hot else CARD}" '
                  f'fill-opacity="{.22 if hot else 1}" stroke="{col}" stroke-opacity="{1 if hot else .55}" stroke-width="{3 if hot else 1.6}"/>')
            g += text(left + 15, y + dy + 8, lab, 23, INK if hot else col, 'start', 700 if hot else 600, MONO)
        body += g + '</g>'
    if rule:
        body += text(0, 76, rule, 22, MUTED, 'start', 500)
    for k, (label, side, color) in callouts.items():
        x, y, role = nodes[k]
        col = color or (MAXC if role == 'max' else MINC)
        if side == 'right':
            body += pill(x + tw / 2 + 22, y, label, col)
        elif side == 'pills':
            body += pill(x + tw / 2 + 14, y + 78, label, col)
        elif side == 'left':
            body += pill(x - tw / 2 - 22, y, label, col, anchor='end')
        elif side == 'above':
            body += pill(x, y - th / 2 - 36, label, col, anchor='middle')
        else:
            body += pill(x, y + th / 2 + 38, label, col, anchor='middle')
    save(name, body, h)


def layout_nested(spec, x0, x1, y0, row_h, root_role):
    """spec: lista av barn eller ett tal (löv). Returnerar nodes, edges, värden (löv)."""
    nodes, edges, leaves = {}, [], {}
    order = []

    def count(t):
        return 1 if not isinstance(t, list) else sum(count(c) for c in t)
    total = count(spec)
    step = (x1 - x0) / total
    pos = [0]

    def lay(t, key, depth, role):
        if not isinstance(t, list):
            x = x0 + step * (pos[0] + .5)
            pos[0] += 1
            nodes[key] = (x, y0 + depth * row_h, role)
            leaves[key] = t
            return x
        xs = []
        for i, c in enumerate(t):
            ck = f'{key}{i}'
            xs.append(lay(c, ck, depth + 1, 'min' if role == 'max' else 'max'))
            edges.append((key, ck))
        x = sum(xs) / len(xs)
        nodes[key] = (x, y0 + depth * row_h, role)
        return x
    lay(spec, 'r', 0, root_role)
    return nodes, edges, leaves


def minimax_values(nodes, edges, leaves):
    children = {}
    for a, b in edges:
        children.setdefault(a, []).append(b)
    vals = dict(leaves)

    def ev(k):
        if k in vals:
            return vals[k]
        cs = [ev(c) for c in children[k]]
        vals[k] = max(cs) if nodes[k][2] == 'max' else min(cs)
        return vals[k]
    ev('r')
    return vals, children


def scene11():
    nodes, edges, leaves = layout_nested([4, 3, 2], 300, W - 300, 170, 420, 'max')
    v = dict(leaves)
    h = 720
    num_tree('val-0', nodes, edges, v, h)
    vals, _ = minimax_values(nodes, edges, leaves)
    assert vals['r'] == 4
    v['r'] = 4
    num_tree('val-1', nodes, edges, v, h, focus={'r', 'r0', 'r1', 'r2'}, chosen={('r', 'r0')},
             callouts={'r': ('max(4, 3, 2) = 4', 'right', None)})


SPEC12 = [[8, 5, 6], [9, 3, 7], [2, 4, 6]]


def scene12():
    nodes, edges, leaves = layout_nested(SPEC12, 120, W - 120, 150, 260, 'max')
    vals, ch = minimax_values(nodes, edges, leaves)
    assert [vals['r0'], vals['r1'], vals['r2'], vals['r']] == [5, 3, 2, 5]
    h = 790
    v = dict(leaves)
    num_tree('minimax-0', nodes, edges, v, h)
    chosen = set()
    for i, k in enumerate(['r0', 'r1', 'r2'], 1):
        v[k] = vals[k]
        best = next(c for c in ch[k] if vals[c] == vals[k])
        chosen.add((k, best))
        args = ', '.join(str(leaves[c]) for c in ch[k])
        num_tree(f'minimax-{i}', nodes, edges, v, h, focus={k, *ch[k]}, chosen=set(chosen),
                 callouts={k: (f'min({args}) = {vals[k]}', 'right' if i < 3 else 'left', None)})
    v['r'] = vals['r']
    chosen.add(('r', 'r0'))
    num_tree('minimax-4', nodes, edges, v, h, focus={'r', 'r0', 'r1', 'r2'}, chosen=chosen,
             callouts={'r': ('max(5, 3, 2) = 5', 'right', None)})


def scene13():
    spec = [[[[4, 3, 2], [6, 1, 5]], [[2, 2, 3], [6, 9, 2]]], [[[1]], [[2, 1, 0], [4, 8, 6]]]]
    nodes, edges, leaves = layout_nested(spec, 40, W - 40, 70, 170, 'min')
    vals, ch = minimax_values(nodes, edges, leaves)
    assert vals['r'] == 2 and vals['r0'] == 4 and vals['r1'] == 2
    h = 860
    depth = {k: len(k) - 1 for k in nodes}
    maxd = max(depth.values())
    v = dict(leaves)
    num_tree('rotnod-0', nodes, edges, v, h, size=.66)
    chosen = set()
    for i, d in enumerate(range(maxd - 1, -1, -1), 1):
        level = [k for k in nodes if depth[k] == d and k not in leaves]
        for k in level:
            v[k] = vals[k]
            best = next(c for c in ch[k] if vals[c] == vals[k])
            chosen.add((k, best))
        focus = set(level) | {c for k in level for c in ch[k]}
        num_tree(f'rotnod-{i}', nodes, edges, v, h, focus=focus, chosen=set(chosen), size=.66)


def scene14_17():
    nodes, edges, leaves = layout_nested(SPEC12, 120, W - 120, 150, 260, 'max')
    h = 790
    # Scen 14: begreppet beskärning
    v = dict(leaves)
    v.update({'r0': 5, 'r': '≥5'})
    num_tree('beskarning-0', nodes, edges, v, h, focus={'r', 'r0'}, chosen={('r0', 'r01')})
    v['r1'] = '≤3'
    num_tree('beskarning-1', nodes, edges, v, h, focus={'r1', 'r10', 'r11'}, chosen={('r0', 'r01')}, pruned={'r12'},
             callouts={'r1': ('3 < 5', 'right', CUT)})
    v['r2'] = '≤2'
    num_tree('beskarning-2', nodes, edges, v, h, focus={'r2', 'r20'}, chosen={('r0', 'r01')}, pruned={'r12', 'r21', 'r22'},
             callouts={'r2': ('2 < 5', 'left', CUT)})
    v['r'] = 5
    num_tree('beskarning-3', nodes, edges, v, h, focus={'r', 'r0'}, chosen={('r0', 'r01'), ('r', 'r0')}, pruned={'r12', 'r21', 'r22'},
             callouts={'r': ('max(5, ≤3, ≤2) = 5', 'right', None)})

    # Scen 17: α och β steg för steg, djupet först, som i simuleringen på ai-aktiviteter.se.
    # Varje steg är en händelse: besök (ärv sökfönster), löv (uppdatera β/α), kontroll α ≥ β, tillbaka.
    inf, ninf = '+∞', '−∞'
    R = 'MAX höjer α  ·  MIN sänker β  ·  α ≥ β → beskär resten'
    leafkeys = list(leaves)
    st = {'v': {}, 'b': {'r': (ninf, inf)}, 'pruned': set(), 'chosen': set()}

    def frame(name, focus, path, changed=None, calls=None):
        hidden = {k for k in leafkeys if k not in st['v']}
        hidden -= {k for k in hidden if any(k.startswith(p) for p in st['pruned'])}
        seen = sum(1 for k in leafkeys if k in st['v'])
        num_tree(name, nodes, edges, dict(st['v']), h, focus=set(focus), chosen=set(path) | st['chosen'],
                 pruned=set(st['pruned']), callouts=calls or {}, bounds=dict(st['b']), hidden=hidden,
                 counter=f'Undersökta löv: {seen} / 9', changed=changed or {}, rule=R)

    frame('alpha-0', {'r'}, set())
    steps = [
        # (nya värden, nya fönster, fokus, väg, ändrat, beskurna, callouts)
        ({}, {'r0': (ninf, inf)}, {'r0'}, {('r', 'r0')}, {}, set(), {}),
        ({'r00': 8, 'r0': 8}, {'r0': (ninf, 8)}, {'r0', 'r00'}, {('r', 'r0'), ('r0', 'r00')}, {'r0': ('b', inf)}, set(), {}),
        ({'r01': 5, 'r0': 5}, {'r0': (ninf, 5)}, {'r0', 'r01'}, {('r', 'r0'), ('r0', 'r01')}, {'r0': ('b', 8)}, set(), {}),
        ({'r02': 6}, {}, {'r0', 'r02'}, {('r', 'r0'), ('r0', 'r02')}, {}, set(), {'r0': ('6 > 5: β stannar', 'pills', MINC)}),
        ({'r': 5}, {'r': (5, inf)}, {'r', 'r0'}, {('r', 'r0')}, {'r': ('a', ninf)}, set(), {}),
        ({}, {'r1': (5, inf)}, {'r1'}, {('r', 'r1')}, {}, set(), {}),
        ({'r10': 9, 'r1': 9}, {'r1': (5, 9)}, {'r1', 'r10'}, {('r', 'r1'), ('r1', 'r10')}, {'r1': ('b', inf)}, set(), {'r1': ('α 5 < β 9: fortsätt', 'pills', INK)}),
        ({'r11': 3, 'r1': 3}, {'r1': (5, 3)}, {'r1', 'r11'}, {('r', 'r1'), ('r1', 'r11')}, {'r1': ('b', 9)}, set(), {}),
        ({}, {}, {'r1'}, {('r', 'r1')}, {}, {'r12'}, {'r1': ('α 5 ≥ β 3: beskär', 'pills', CUT)}),
        ({}, {}, {'r', 'r1'}, {('r', 'r1')}, {}, set(), {'r': ('3 < 5: α stannar', 'left', MAXC)}),
        ({}, {'r2': (5, inf)}, {'r2'}, {('r', 'r2')}, {}, set(), {}),
        ({'r20': 2, 'r2': 2}, {'r2': (5, 2)}, {'r2', 'r20'}, {('r', 'r2'), ('r2', 'r20')}, {'r2': ('b', inf)}, {'r21', 'r22'}, {'r2': ('α 5 ≥ β 2: beskär', 'pills', CUT)}),
        ({}, {}, {'r', 'r0'}, set(), {}, set(), {'r': ('max(5, 3, 2) = 5', 'left', MAXC)}),
    ]
    for i, (vals, wins, focus, path, ch, pr, calls) in enumerate(steps, 1):
        st['v'].update(vals)
        st['b'].update(wins)
        st['pruned'] |= pr
        if i == len(steps):
            st['chosen'] = {('r', 'r0'), ('r0', 'r01')}
        frame(f'alpha-{i}', focus, path, ch, calls)
    seen = sum(1 for k in leafkeys if k in st['v'])
    assert seen == 6 and st['v']['r'] == 5
    # Kontroll mot en riktig alfa-beta-sökning.
    order = []

    def ab(k, a, b):
        if k in leaves:
            order.append(k)
            return leaves[k]
        kids = [c for p, c in edges if p == k]
        if nodes[k][2] == 'max':
            v = float('-inf')
            for c in kids:
                v = max(v, ab(c, a, b)); a = max(a, v)
                if a >= b:
                    break
        else:
            v = float('inf')
            for c in kids:
                v = min(v, ab(c, a, b)); b = min(b, v)
                if a >= b:
                    break
        return v
    assert ab('r', float('-inf'), float('inf')) == 5
    assert order == [k for k in leafkeys if k in st['v']], order


def scene18_19():
    spec = [[[5, 3], [8, 2]], [[7, 1], [2, 3]]]
    nodes, edges, leaves = layout_nested(spec, 80, W - 80, 110, 230, 'max')
    vals, ch = minimax_values(nodes, edges, leaves)
    # Godkänd rättelse 2026-10-13: MAX över 2 och 3 är 3, MIN ovanför är 3. Roten är 5.
    assert vals['r11'] == 3 and vals['r1'] == 3 and vals['r'] == 5
    h = 900
    v = dict(leaves)
    num_tree('ovning-0', nodes, edges, v, h)
    plan = [
        ({'r00': 5, 'r0': '≤5'}, {'r00', 'r000', 'r001'}, set(), {'r00': ('max(5, 3) = 5', 'right', None)}, {('r00', 'r000')}),
        ({'r01': '≥8'}, {'r01', 'r010', 'r0'}, {'r011'}, {'r01': ('8 ≥ 5', 'right', CUT)}, set()),
        ({'r0': 5, 'r': '≥5'}, {'r0', 'r00', 'r01'}, set(), {'r0': ('min(5, ≥8) = 5', 'left', None)}, {('r0', 'r00')}),
        ({'r10': 7}, {'r10', 'r100', 'r101'}, set(), {'r10': ('max(7, 1) = 7', 'left', None)}, {('r10', 'r100')}),
        ({'r11': 3}, {'r11', 'r110', 'r111'}, set(), {'r11': ('max(2, 3) = 3', 'left', None)}, {('r11', 'r111')}),
        ({'r1': 3}, {'r1', 'r10', 'r11'}, set(), {'r1': ('min(7, 3) = 3', 'right', None)}, {('r1', 'r11')}),
        ({'r': 5}, {'r', 'r0', 'r1'}, set(), {'r': ('max(5, 3) = 5', 'right', None)}, {('r', 'r0')}),
    ]
    pruned, chosen = set(), set()
    for i, (add, focus, pr, calls, chs) in enumerate(plan, 1):
        v.update(add)
        pruned |= pr
        chosen |= chs
        num_tree(f'ovning-{i}', nodes, edges, v, h, focus=focus, chosen=set(chosen), pruned=set(pruned), callouts=calls)


def scene20():
    data = json.loads((ROOT / 'docs/minimax/diagramdata-v2.json').read_text())['source20']
    ns, es, root = data['nodes'], [tuple(e) for e in data['edges']], data['root']
    assert len(ns) == 22 and len(set(es)) == 21
    children = {k: [] for k in ns}
    for a, b in es:
        children[a].append(b)
    for k in children:
        children[k].sort(key=lambda q: ns[q]['x'])
    leafindex = [0]
    positions = {}

    def lay(k, depth):
        if not children[k]:
            x = leafindex[0]
            leafindex[0] += 1
        else:
            xs = [lay(c, depth + 1) for c in children[k]]
            x = sum(xs) / len(xs)
        positions[k] = (x, depth)
        return x
    lay(root, 0)
    maxdepth = max(d for _, d in positions.values())
    nodes = {k: (110 + x * (W - 220) / (leafindex[0] - 1), 110 + d * 730 / maxdepth, ns[k]['role']) for k, (x, d) in positions.items()}
    # Lärarens beslut 2026-11-10: i aktiviteten är alla inre noder tomma; bara löven har värden.
    num_tree('rakna-noder', nodes, es, {k: (v['value'] if not children[k] else '') for k, v in ns.items()}, 900, size=.72)


if __name__ == '__main__':
    scene6()
    scene7()
    scene8()
    scene10()
    scene11()
    scene12()
    scene13()
    scene14_17()
    scene18_19()
    scene20()
    print('Skrev', len(list(OUT.glob('*.svg'))), 'diagramtillstånd till', OUT.relative_to(ROOT))
