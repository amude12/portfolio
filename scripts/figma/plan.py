import json, os, re
e = json.load(open('out/_exports.json'))
d = json.load(open('figma/node.json'))['nodes']['1:5']['document']
idx, par = {}, {}
def w(n, p=None):
    idx[n['id']] = n; par[n['id']] = p
    for c in n.get('children', []): w(c, n['id'])
w(d)
PAGES = {'61:1666': '61:2320', '42:1638': '42:2697', '68:5016': '68:5494', '68:4207': '68:4583', '68:4417': '68:4823'}
DESK = set(PAGES); MOB = {v: k for k, v in PAGES.items()}
def chain(i):
    c = []
    while i:
        c.append(i); i = par[i]
    return c
def frame_and_section(i):
    c = chain(i)
    for k, x in enumerate(c):
        if x in DESK or x in MOB: return x, c[k - 1]
fid = lambda i: i.replace(':', '-').replace(';', '_')
plan, remap = {}, {}
desk_by_page = {}
for k, v in e.items():
    f, s = frame_and_section(k)
    if f in DESK:
        desk_by_page.setdefault(f, []).append(k)
        b, sb = idx[k]['absoluteBoundingBox'], idx[s]['absoluteBoundingBox']
        raw = 'raw/%s.png' % fid(k)
        plan[fid(k)] = {'raw': raw if os.path.exists(raw) else None, 'crop': {'file': 'figma/cs/%s.png' % fid(s), 'x': b['x'] - sb['x'], 'y': b['y'] - sb['y'], 'w': b['width'], 'h': b['height'], 'scale': 0.6}}
norm = lambda s: re.sub(r'[^a-z0-9]+', ' ', s.lower()).strip()
miss = []
for k, v in e.items():
    f, s = frame_and_section(k)
    if f not in MOB: continue
    cands = desk_by_page[MOB[f]]
    nm = norm(v.get('inner') or idx[k]['name']); ar = v['w'] / v['h']
    if v.get('inner'): ar = None
    if nm == 'screen image':
        nm = norm(idx[k]['name'].replace('(horizontal scroll)', ''))
    strip = lambda c: re.sub(r'^screen ', '', norm(idx[c]['name']))
    exact = [c for c in cands if strip(c) == nm]
    sec_nm0 = norm(idx[s]['name'])
    exact.sort(key=lambda c: norm(idx[frame_and_section(c)[1]]['name']) != sec_nm0)
    sec_nm = norm(idx[s]['name'])
    same_sec = [c for c in cands if norm(idx[frame_and_section(c)[1]]['name']) == sec_nm]
    pool = exact or same_sec
    if pool:
        best = pool[0] if ar is None else min(pool, key=lambda c: abs(e[c]['w'] / e[c]['h'] - ar))
        remap[fid(k)] = fid(best)
        if not exact: miss.append((k, idx[k]['name'], v.get('inner'), '->', best, idx[best]['name']))
    else:
        miss.append((k, idx[k]['name'], v.get('inner'), None))
remap['42-2870'] = '42-1824'; remap['42-2889'] = None
remap['42-3508'] = '42-2464'
json.dump({'plan': plan, 'remap': remap}, open('out/_plan.json', 'w'), indent=1)
print(len(plan), 'desktop;', len(remap), 'mobile remapped;', sum(1 for p in plan.values() if p['raw']), 'have raw')
for m in miss: print(m)
