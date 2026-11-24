"""Convert Figma auto-layout frames into a JSON layout tree for the React renderer.
Usage: convert.py node.json out_dir  (writes <slug>.<variant>.json + exports.json)"""
import json, sys, os, math

SRC, OUT = sys.argv[1], sys.argv[2]
doc = json.load(open(SRC))['nodes']['1:5']['document']
IDX = {}
def index(n):
    IDX[n['id']] = n
    for c in n.get('children', []): index(c)
index(doc)

PAGES = {
    'medtigo':               ('61:1666', '61:2320'),
    'student-management':    ('42:1638', '42:2697'),
    'one-ecosystem':         ('68:5016', '68:5494'),
    'license-tracking':      ('68:4207', '68:4583'),
    'role-based-dashboards': ('68:4417', '68:4823'),
}
EXPORTS = {}   # id -> {'fmt': 'png'|'svg', 'w', 'h'}

def rgba(c, op=1.0):
    a = c.get('a', 1) * op
    r, g, b = (round(c[k] * 255) for k in 'rgb')
    if a >= 0.999: return '#%02x%02x%02x' % (r, g, b)
    return 'rgba(%d,%d,%d,%.3f)' % (r, g, b, a)

def vis(lst): return [f for f in (lst or []) if f.get('visible', True)]

def bg(n):
    out = []
    for f in reversed(vis(n.get('fills'))):   # css: first = top
        op = f.get('opacity', 1)
        if f['type'] == 'SOLID':
            c = rgba(f['color'], op); out.append('linear-gradient(%s,%s)' % (c, c))
        elif f['type'] in ('GRADIENT_LINEAR', 'GRADIENT_RADIAL'):
            stops = ','.join('%s %d%%' % (rgba(s['color'], op), round(s['position'] * 100)) for s in f['gradientStops'])
            if f['type'] == 'GRADIENT_RADIAL':
                out.append('radial-gradient(%s)' % stops)
            else:
                h = f.get('gradientHandlePositions') or [{'x': 0, 'y': 0}, {'x': 0, 'y': 1}]
                ang = math.degrees(math.atan2(h[1]['x'] - h[0]['x'], -(h[1]['y'] - h[0]['y'])))
                out.append('linear-gradient(%ddeg,%s)' % (round(ang), stops))
    if not out: return None
    if len(out) == 1 and out[0].startswith('linear-gradient(') and out[0].count(',') == 1 and 'deg' not in out[0]:
        return {'backgroundColor': out[0][len('linear-gradient('):].split(',')[0]}
    return {'background': ','.join(out)}

def has_img_fill(n): return any(f['type'] == 'IMAGE' for f in vis(n.get('fills')))

def box(n): return n.get('absoluteBoundingBox') or {'x': 0, 'y': 0, 'width': 0, 'height': 0}

def text_stats(n, acc):
    if n.get('visible', True) is False: return acc
    if n['type'] == 'TEXT':
        s = n['style']
        tiny = s.get('fontSize', 16) < 11 or s.get('fontFamily') != 'Poppins'
        acc[0 if tiny else 1] += 1
    for c in n.get('children', []): text_stats(c, acc)
    return acc

def has_text(n):
    if n['type'] == 'TEXT': return True
    return any(has_text(c) for c in n.get('children', []))

VECTORISH = {'VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'REGULAR_POLYGON'}

def is_visual(n, depth):
    """Should this node be exported as a flat image?"""
    t = n['type']
    if t in VECTORISH: return True
    if t == 'TEXT': return False
    if has_img_fill(n): return True
    if t in ('RECTANGLE', 'LINE', 'ELLIPSE'): return False
    kids = [c for c in n.get('children', []) if c.get('visible', True)]
    if t == 'GROUP': return True
    if n.get('layoutMode', 'NONE') == 'NONE' and kids:
        # a free-positioned frame: keep simple "box with one centered text" as DOM
        return True
    if depth < 2: return False
    if any(c['type'] == 'TEXT' and c['style'].get('fontSize', 0) >= 12 and c['style'].get('fontFamily') == 'Poppins' for c in kids):
        return False
    tiny, big = text_stats(n, [0, 0])
    return tiny >= 3 and tiny / (tiny + big) >= 0.5

def export(n):
    b = box(n)
    tiny, big = text_stats(n, [0, 0])
    svg = (not has_text(n)) and not _deep_img(n) and b['width'] <= 240 and b['height'] <= 240
    EXPORTS[n['id']] = {'fmt': 'svg' if svg else 'png', 'w': b['width'], 'h': b['height']}
    return 'figma/%s.%s' % (n['id'].replace(':', '-').replace(';', '_'), 'svg' if svg else 'webp')

def _deep_img(n):
    return has_img_fill(n) or any(_deep_img(c) for c in n.get('children', []))

def px(v): return round(v, 2)

def common_style(n, st):
    b = bg(n)
    if b: st.update(b)
    strokes = vis(n.get('strokes'))
    if strokes and strokes[0]['type'] == 'SOLID':
        col = rgba(strokes[0]['color'], strokes[0].get('opacity', 1))
        style = 'dashed' if n.get('strokeDashes') else 'solid'
        isw = n.get('individualStrokeWeights')
        if isw:
            for side in ('top', 'right', 'bottom', 'left'):
                w = isw.get(side, 0)
                if w: st['border' + side.capitalize()] = '%spx %s %s' % (px(w), style, col)
        elif n.get('strokeWeight', 0):
            st['border'] = '%spx %s %s' % (px(n['strokeWeight']), style, col)
    if n.get('rectangleCornerRadii'):
        st['borderRadius'] = ' '.join('%spx' % px(r) for r in n['rectangleCornerRadii'])
    elif n.get('cornerRadius'):
        st['borderRadius'] = '%spx' % px(n['cornerRadius'])
    sh = []
    for e in vis(n.get('effects')):
        if e['type'] in ('DROP_SHADOW', 'INNER_SHADOW'):
            o = e.get('offset', {'x': 0, 'y': 0})
            sh.append('%s%spx %spx %spx %spx %s' % ('inset ' if e['type'] == 'INNER_SHADOW' else '', px(o['x']), px(o['y']), px(e.get('radius', 0)), px(e.get('spread', 0)), rgba(e['color'])))
        elif e['type'] == 'BACKGROUND_BLUR':
            st['backdropFilter'] = 'blur(%spx)' % px(e.get('radius', 0) / 2)
    if sh: st['boxShadow'] = ','.join(sh)
    if n.get('opacity', 1) < 1: st['opacity'] = round(n['opacity'], 3)
    if n.get('clipsContent') and n.get('layoutMode', 'NONE') != 'NONE' and n.get('children'):
        st['overflow'] = 'hidden'

def sizing(n, parent_mode, st, is_img=False, root=False):
    b = box(n)
    W, H = b['width'], b['height']
    sh = n.get('layoutSizingHorizontal', 'FIXED')
    sv = n.get('layoutSizingVertical', 'FIXED')
    if root:
        st['width'] = '100%'; return
    if n.get('layoutPositioning') == 'ABSOLUTE':
        return
    textish = has_text(n) and not is_img
    if parent_mode == 'HORIZONTAL':
        if sh == 'FILL': st['flex'] = '1 1 0'; st['minWidth'] = 0
        elif sh == 'FIXED': st['flex'] = '0 1 %spx' % px(W); st['minWidth'] = 0 if W > 120 else px(W)
        else: st['flexShrink'] = 1 if textish else 0
        if sv == 'FILL': st['alignSelf'] = 'stretch'
        elif sv == 'FIXED' and not is_img:
            st['minHeight' if textish else 'height'] = px(H)
    else:  # VERTICAL / none
        if sh == 'FILL': st['alignSelf'] = 'stretch'
        elif sh == 'FIXED':
            if W >= 200 or is_img: st['width'] = '100%'; st['maxWidth'] = px(W)
            else: st['width'] = px(W); st['flexShrink'] = 0
        if sv == 'FILL': st['flex'] = '1 1 0'
        elif sv == 'FIXED' and not is_img:
            st['minHeight' if textish else 'height'] = px(H)
    if is_img:
        st['aspectRatio'] = '%s / %s' % (px(W), px(H))
        if sh == 'HUG' or (parent_mode == 'HORIZONTAL' and sh == 'FIXED'):
            st['width'] = px(W); st['maxWidth'] = '100%'
        if W < 200 and parent_mode != 'HORIZONTAL':
            st['width'] = px(W); st.pop('maxWidth', None)

JUST = {'MIN': 'flex-start', 'CENTER': 'center', 'MAX': 'flex-end', 'SPACE_BETWEEN': 'space-between', 'BASELINE': 'baseline'}

def text_node(n, st):
    s = n['style']
    fills = vis(n.get('fills'))
    if fills and fills[0]['type'] == 'SOLID': st['color'] = rgba(fills[0]['color'], fills[0].get('opacity', 1))
    st['fontSize'] = px(s['fontSize'])
    st['fontWeight'] = s.get('fontWeight', 400)
    if s.get('lineHeightPx'): st['lineHeight'] = '%spx' % px(s['lineHeightPx'])
    if s.get('letterSpacing'): st['letterSpacing'] = '%spx' % px(s['letterSpacing'])
    if s.get('italic'): st['fontStyle'] = 'italic'
    al = s.get('textAlignHorizontal', 'LEFT')
    if al != 'LEFT': st['textAlign'] = {'CENTER': 'center', 'RIGHT': 'right', 'JUSTIFIED': 'justify'}[al]
    if s.get('textCase') == 'UPPER': st['textTransform'] = 'uppercase'
    if s.get('textDecoration') == 'UNDERLINE': st['textDecoration'] = 'underline'
    if s.get('textAutoResize') == 'WIDTH_AND_HEIGHT' and box(n)['width'] < 400: st['whiteSpace'] = 'nowrap'
    out = {'t': 'x', 's': st, 'v': n['characters']}
    ov = n.get('characterStyleOverrides') or []
    table = n.get('styleOverrideTable') or {}
    if ov and table:
        runs, cur, start = [], None, 0
        chars = n['characters']
        ov = ov + [0] * (len(chars) - len(ov))
        for i, k in enumerate(ov + [None]):
            if i == len(chars) or k != cur:
                if i > start:
                    rs = {}
                    o = table.get(str(cur)) if cur else None
                    if o:
                        if o.get('fontWeight'): rs['fontWeight'] = o['fontWeight']
                        if o.get('italic'): rs['fontStyle'] = 'italic'
                        if o.get('textDecoration') == 'UNDERLINE': rs['textDecoration'] = 'underline'
                        f = vis(o.get('fills'))
                        if f and f[0]['type'] == 'SOLID': rs['color'] = rgba(f[0]['color'])
                    runs.append([chars[start:i], rs] if rs else [chars[start:i]])
                start, cur = i, k
        if len(runs) > 1: out['r'] = runs
    return out

def convert(n, depth=0, parent_mode='VERTICAL', parent=None):
    if n.get('visible', True) is False: return None
    t = n['type']
    st = {}
    absolute = n.get('layoutPositioning') == 'ABSOLUTE'
    if absolute and parent is not None:
        b, pb = box(n), box(parent)
        st.update({'position': 'absolute', 'left': px(b['x'] - pb['x']), 'top': px(b['y'] - pb['y']), 'width': px(b['width']), 'height': px(b['height'])})
    if t == 'TEXT':
        sizing(n, parent_mode, st)
        return text_node(n, st)
    if is_visual(n, depth):
        src = export(n)
        sizing(n, parent_mode, st, is_img=True)
        if n.get('layoutPositioning') != 'ABSOLUTE' and n.get('opacity', 1) < 1: st['opacity'] = round(n['opacity'], 3)
        out = {'t': 'i', 's': st, 'src': src, 'w': px(box(n)['width']), 'h': px(box(n)['height']), 'alt': n['name'].replace(' (horizontal scroll)', '')}
        if n.get('overflowDirection') == 'HORIZONTAL_SCROLLING' and n.get('children'):
            inner = n['children'][0]
            out['hs'] = px(box(inner)['width'])
            EXPORTS[n['id']]['inner'] = inner['name']
            st.pop('aspectRatio', None)
        return out
    common_style(n, st)
    sizing(n, parent_mode, st, root=(depth == 0))
    if t == 'ELLIPSE': st['borderRadius'] = '50%'
    if t == 'LINE':
        strokes = vis(n.get('strokes'))
        col = rgba(strokes[0]['color']) if strokes else '#d2deeb'
        st.pop('border', None); st['borderTop'] = '%spx solid %s' % (px(n.get('strokeWeight', 1)), col)
        st.setdefault('alignSelf', 'stretch')
    if t in ('RECTANGLE', 'ELLIPSE', 'LINE'):
        b = box(n)
        if 'height' not in st and 'minHeight' not in st and st.get('alignSelf') != 'stretch': st['height'] = px(b['height'])
        if parent_mode == 'VERTICAL' and 'width' not in st and st.get('alignSelf') != 'stretch':
            st['width'] = px(b['width'])
        if n.get('layoutSizingVertical') == 'FIXED' and t != 'LINE': st['height'] = px(b['height'])
        st['flexShrink'] = 0
        return {'t': 'r', 's': st}
    mode = n.get('layoutMode', 'NONE')
    kids = []
    if mode != 'NONE':
        st['display'] = 'flex'
        st['flexDirection'] = 'row' if mode == 'HORIZONTAL' else 'column'
        if n.get('itemSpacing'): st['gap'] = px(n['itemSpacing'])
        if n.get('layoutWrap') == 'WRAP':
            st['flexWrap'] = 'wrap'
            if n.get('counterAxisSpacing'): st['rowGap'] = px(n['counterAxisSpacing'])
        pads = [n.get('paddingTop', 0), n.get('paddingRight', 0), n.get('paddingBottom', 0), n.get('paddingLeft', 0)]
        if any(pads): st['padding'] = ' '.join('%spx' % px(p) for p in pads)
        j = JUST.get(n.get('primaryAxisAlignItems', 'MIN'))
        if j != 'flex-start': st['justifyContent'] = j
        a = JUST.get(n.get('counterAxisAlignItems', 'MIN'))
        st['alignItems'] = a
        if any(c.get('layoutPositioning') == 'ABSOLUTE' for c in n.get('children', [])): st['position'] = 'relative'
        for c in n.get('children', []):
            k = convert(c, depth + 1, mode, n)
            if k: kids.append(k)
    node = {'t': 'f', 's': st, 'c': kids, 'n': n['name']}
    return node

def link_fix(node):
    """Turn breadcrumb texts into router links."""
    if node.get('t') == 'x':
        v = node['v']
        if v.startswith('←') or v in ('Home', 'Case studies'):
            node['href'] = '/' if v == 'Home' else '/#work'
    for c in node.get('c', []): link_fix(c)

os.makedirs(OUT, exist_ok=True)
for slug, (dk, mb) in PAGES.items():
    for variant, fid in (('desktop', dk), ('mobile', mb)):
        frame = IDX[fid]
        secs = []
        for sec in frame['children']:
            nm = sec['name'].lower()
            if 'header' in nm and 'principle' not in nm or 'footer' in nm: continue
            node = convert(sec, 0, 'VERTICAL', frame)
            if node:
                node['n'] = sec['name']; link_fix(node); secs.append(node)
        json.dump({'title': frame['name'], 'sections': secs}, open(os.path.join(OUT, '%s.%s.json' % (slug, variant)), 'w'), separators=(',', ':'))
json.dump(EXPORTS, open(os.path.join(OUT, '_exports.json'), 'w'), indent=0)
print(len(EXPORTS), 'exports;', sum(1 for e in EXPORTS.values() if e['fmt'] == 'png'), 'png')
