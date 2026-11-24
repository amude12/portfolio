import json, sys, os, urllib.request, time
TOKEN = os.environ['FIGMA_TOKEN']; KEY = 'g3tOAmdJQ1ku0PlIII0Ouw'
ids = json.load(open(sys.argv[1])); out = sys.argv[2]; scale = sys.argv[3] if len(sys.argv) > 3 else '2'
os.makedirs(out, exist_ok=True)
todo = [i for i in ids if not os.path.exists(os.path.join(out, i.replace(':', '-').replace(';', '_') + '.png'))]
for k in range(0, len(todo), 10):
    batch = todo[k:k + 10]
    req = urllib.request.Request('https://api.figma.com/v1/images/%s?ids=%s&format=png&scale=%s' % (KEY, ','.join(batch), scale), headers={'X-Figma-Token': TOKEN})
    for attempt in range(4):
        try:
            res = json.load(urllib.request.urlopen(req, timeout=300)); break
        except Exception as e:
            print('retry', e, flush=True); time.sleep(10)
    for i, u in (res.get('images') or {}).items():
        if u: urllib.request.urlretrieve(u, os.path.join(out, i.replace(':', '-').replace(';', '_') + '.png'))
    print(k + len(batch), '/', len(todo), flush=True)
