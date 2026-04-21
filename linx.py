import json
import urllib.request

with open("media.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for item in data:
    url = item.get("mediumLink")

    if not url:
        print("NO LINK ->", url)
        continue

    try:
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=5) as response:
            print(response.status, "->", url)
    except Exception as e:
        print("ERROR ->", url, "|", e)