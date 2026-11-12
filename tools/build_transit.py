"""Convert the Overpass dump (routes_geom.json) into data/transit.js."""
import json
import math
import os

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "..", "data", "transit.js")

LINES = {
    102388: dict(id="L1", name="Line 1 Yonge–University", kind="subway", color="#F8C300"),
    102386: dict(id="L2", name="Line 2 Bloor–Danforth", kind="subway", color="#00923F"),
    7871815: dict(id="L4", name="Line 4 Sheppard", kind="subway", color="#A21A68"),
    6549497: dict(id="L5", name="Line 5 Eglinton", kind="subway", color="#FF8000"),
    19931999: dict(id="L6", name="Line 6 Finch West", kind="subway", color="#969594"),
    10094533: dict(id="LW", name="GO Lakeshore West", kind="go", color="#98002E"),
    207770: dict(id="LE", name="GO Lakeshore East", kind="go", color="#EE3124"),
    149440: dict(id="MI", name="GO Milton", kind="go", color="#F57F25"),
    113816: dict(id="KI", name="GO Kitchener", kind="go", color="#00853F"),
    148585: dict(id="BR", name="GO Barrie", kind="go", color="#003767"),
    365949: dict(id="RH", name="GO Richmond Hill", kind="go", color="#0099C7"),
    166145: dict(id="ST", name="GO Stouffville", kind="go", color="#794500"),
    7641341: dict(id="UP", name="UP Express", kind="go", color="#5B2C86"),
}


def dist(a, b):
    dx = (a[0] - b[0]) * math.cos(math.radians(43.7))
    dy = a[1] - b[1]
    return math.hypot(dx, dy) * 111_000


def simplify(pts, tol_m):
    if len(pts) < 3:
        return pts
    out = [pts[0]]
    for p in pts[1:-1]:
        if dist(p, out[-1]) >= tol_m:
            out.append(p)
    out.append(pts[-1])
    return out


def clean_name(name, kind):
    for suffix in (" Subway Station", " Station", " GO Station", " GO", " station", " Platform"):
        if name.endswith(suffix):
            name = name[: -len(suffix)]
    name = name.replace(" GO Station", "").replace(" Subway", "")
    return name.strip()


def seg_dist(p, a, b):
    kx = math.cos(math.radians(43.7))
    ax, ay, bx, by, px, py = a[0] * kx, a[1], b[0] * kx, b[1], p[0] * kx, p[1]
    dx, dy = bx - ax, by - ay
    L = dx * dx + dy * dy
    t = 0 if L == 0 else max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy)) * 111_000


def go_station_nodes():
    path = os.path.join(HERE, "go_stations.json")
    if not os.path.exists(path):
        return []
    out = []
    for e in json.load(open(path))["elements"]:
        t = e.get("tags", {})
        tagstr = t.get("network", "") + t.get("operator", "")
        if "GO" not in tagstr and "UP Express" not in tagstr:
            continue
        lat = e.get("lat") or e.get("center", {}).get("lat")
        lon = e.get("lon") or e.get("center", {}).get("lon")
        name = t.get("name", "").split(";")[-1]
        name = name.replace(" Central Station", "").replace(" GO Centre", "").replace(" GO", "")
        out.append(dict(name=name, lat=round(lat, 5), lon=round(lon, 5)))
    return out


GO_NODES = None


def add_go_stations(segments, stations):
    global GO_NODES
    if GO_NODES is None:
        GO_NODES = go_station_nodes()
    for s in GO_NODES:
        p = (s["lon"], s["lat"])
        if any(dist(p, (o["lon"], o["lat"])) < 400 for o in stations):
            continue
        near = min(
            (seg_dist(p, seg[i], seg[i + 1]) for seg in segments for i in range(len(seg) - 1)),
            default=1e9,
        )
        if near < 120:
            stations.append(s)


def main():
    data = json.load(open(os.path.join(HERE, "routes_geom.json")))
    nodes = {e["id"]: e for e in data["elements"] if e["type"] == "node"}
    lines = []
    for rel in (e for e in data["elements"] if e["type"] == "relation"):
        meta = LINES.get(rel["id"])
        if not meta:
            continue
        tol = 15 if meta["kind"] == "subway" else 40
        segments = []
        stations = []
        seen = set()
        for m in rel["members"]:
            role = m.get("role", "")
            if m["type"] == "way" and role in ("", "forward", "backward") and "geometry" in m:
                pts = [(round(g["lon"], 5), round(g["lat"], 5)) for g in m["geometry"] if g]
                segments.append(simplify(pts, tol))
            elif m["type"] == "node" and role.startswith("stop"):
                n = nodes.get(m["ref"], {})
                tags = n.get("tags", {})
                name = tags.get("name") or tags.get("official_name")
                if not name:
                    continue
                name = clean_name(name, meta["kind"])
                if name in seen:
                    continue
                seen.add(name)
                stations.append(dict(name=name, lat=round(n["lat"], 5), lon=round(n["lon"], 5)))
        if meta["kind"] == "go":
            add_go_stations(segments, stations)
        lines.append(dict(**meta, segments=segments, stations=stations))
        print(f'{meta["id"]}: {len(segments)} segments, {len(stations)} stations')

    order = [v["id"] for v in LINES.values()]
    lines.sort(key=lambda l: order.index(l["id"]))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        f.write("// Generated by tools/build_transit.py from OpenStreetMap (ODbL).\n")
        f.write("window.TRANSIT = ")
        json.dump(lines, f, separators=(",", ":"), ensure_ascii=False)
        f.write(";\n")
    print("wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    main()
