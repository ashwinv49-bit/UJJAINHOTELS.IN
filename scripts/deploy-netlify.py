#!/usr/bin/env python3
"""
Manual deploy of dist/ to an existing Netlify project through the Netlify API
(no Netlify CLI needed). Use this only until the GitHub repo is linked for
continuous deployment; after that, Netlify builds on every push.

  npm run build
  NETLIFY_AUTH_TOKEN=<personal access token> python3 scripts/deploy-netlify.py <site-id> [--draft]

Production deploy by default; --draft gives a preview permalink only.
Never commit the token. Warning: if the project is linked to a Git repo,
the next push to its production branch replaces a manual production deploy.
"""
import hashlib, json, os, sys, time, urllib.request, urllib.parse

API = "https://api.netlify.com/api/v1"
DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")

def call(method, url, data=None, ctype="application/json"):
    body = json.dumps(data).encode() if (data is not None and ctype == "application/json") else data
    token = os.environ.get("NETLIFY_AUTH_TOKEN", "proxy-injected")  # cloud sessions inject it via proxy
    req = urllib.request.Request(url, data=body, method=method,
                                 headers={"Content-Type": ctype, "Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=120) as r:
        raw = r.read()
        return json.loads(raw) if raw else {}

def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    site_id, draft = sys.argv[1], "--draft" in sys.argv
    if not os.path.exists(os.path.join(DIST, "index.html")):
        sys.exit("dist/ is empty: run `npm run build` first")
    files, paths = {}, {}
    for root, _, names in os.walk(DIST):
        for n in names:
            full = os.path.join(root, n)
            rel = "/" + os.path.relpath(full, DIST).replace(os.sep, "/")
            sha = hashlib.sha1(open(full, "rb").read()).hexdigest()
            files[rel] = sha
            paths.setdefault(sha, []).append(full)
            paths[sha + ":rel"] = rel
    title = os.environ.get("DEPLOY_TITLE", "Manual deploy from scripts/deploy-netlify.py")
    dep = call("POST", f"{API}/sites/{site_id}/deploys", {"files": files, "draft": draft, "title": title})
    did, required = dep["id"], dep.get("required", [])
    print(f"Deploy {did}: {len(files)} files, {len(required)} to upload")
    for sha in required:
        rel = paths[sha + ":rel"]
        for attempt in range(4):
            try:
                call("PUT", f"{API}/deploys/{did}/files/" + urllib.parse.quote(rel.lstrip("/")),
                     open(paths[sha][0], "rb").read(), "application/octet-stream")
                break
            except Exception as e:  # transient network errors
                print(f"  retry {rel}: {e}")
                time.sleep(2 * (attempt + 1))
    for _ in range(60):
        d = call("GET", f"{API}/deploys/{did}")
        if d["state"] in ("ready", "error"):
            break
        time.sleep(3)
    print(f"State: {d['state']} · {d.get('deploy_ssl_url') if draft else d.get('ssl_url')}")
    for m in (d.get("summary") or {}).get("messages", []):
        print(f"  - {m.get('title')}")
    if d["state"] != "ready":
        sys.exit(d.get("error_message") or "deploy did not become ready")

if __name__ == "__main__":
    main()
