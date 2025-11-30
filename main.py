from collections import Counter
import json

with open("result.json") as f:
    data = json.load(f)

counts = Counter(u['item'] for u in data['used'])
print(counts)
