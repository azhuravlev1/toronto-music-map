"""One-off: geocode the venue seed list and write data/venues.js.

After the first run, data/venues.js is the hand-editable source of truth.
Re-running only geocodes venues that are missing from tools/geocache.json.
"""
import json
import os
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(__file__)
CACHE = os.path.join(HERE, "geocache.json")
OUT = os.path.join(HERE, "..", "data", "venues.js")

# id, name, capacity (concert config), type, address, [primary, secondary] colours, website
VENUES = [
    ("rogers-stadium", "Rogers Stadium", "50,000", "stadium", "105 Carl Hall Road, Toronto", ["#DA291C", "#1F1F1F"], "https://www.livenation.com/venue/KovZ917A_Y0/rogers-stadium-events"),
    ("rogers-centre", "Rogers Centre", "40,000 – 50,000", "stadium", "1 Blue Jays Way, Toronto", ["#DA291C", "#134A8E"], "https://www.mlb.com/bluejays/ballpark/events"),
    ("scotiabank-arena", "Scotiabank Arena", "19,800", "arena", "40 Bay Street, Toronto", ["#EC111A", "#1E1E1E"], "https://www.scotiabankarena.com/events"),
    ("rbc-amphitheatre", "RBC Amphitheatre", "17,000", "outdoor", "909 Lake Shore Boulevard West, Toronto", ["#005DAA", "#FFD200"], "https://www.livenation.com/venue/KovZpZAEkn6A/rbc-amphitheatre-events"),
    ("cne-bandshell", "CNE Bandshell", "10,000", "outdoor", "60 Prince Edward Island Crescent, Toronto", ["#E31837", "#00539B"], "https://theex.com"),
    ("coca-cola-coliseum", "Coca-Cola Coliseum", "4,100 – 9,200", "arena", "45 Manitoba Drive, Toronto", ["#F40009", "#2B2B2B"], "https://www.coca-colacoliseum.com/events"),
    ("sobeys-stadium", "Sobeys Stadium", "9,100", "arena", "1 Shoreham Drive, Toronto", ["#0E7C3A", "#E21F26"], "https://www.sobeysstadium.com/"),
    ("great-canadian-theatre", "The Theatre at Great Canadian Toronto", "5,000", "hall", "1133 Queens Plate Drive, Toronto", ["#B8892D", "#1A1A1A"], "https://www.greatcanadian.com/destinations/ontario/toronto/entertainment/"),
    ("rbc-echo-beach", "RBC Echo Beach", "4,000", "outdoor", "909 Lake Shore Boulevard West, Toronto", ["#005DAA", "#E8B86D"], "https://ontarioplace.com/en/rbc-echo-beach/"),
    ("meridian-hall", "Meridian Hall", "3,200", "hall", "1 Front Street East, Toronto", ["#5F259F", "#00A3AD"], "https://www.tolive.com/Meridian-Hall-Events"),
    ("massey-hall", "Massey Hall", "2,700", "hall", "178 Victoria Street, Toronto", ["#8C1D2F", "#C9A14A"], "https://masseyhall.mhrth.com/"),
    ("roy-thomson-hall", "Roy Thomson Hall", "2,600", "hall", "60 Simcoe Street, Toronto", ["#1D3557", "#8DA9C4"], "https://roythomsonhall.mhrth.com/"),
    ("history", "History", "2,600", "club", "1663 Queen Street East, Toronto", ["#141414", "#C9A227"], "https://www.historytoronto.com/events"),
    ("rebel", "Rebel", "2,500", "club", "11 Polson Street, Toronto", ["#E6007E", "#1B1B1B"], "https://rebeltoronto.com/events/"),
    ("elgin-theatre", "Elgin Theatre", "2,100", "hall", "189 Yonge Street, Toronto", ["#A0172F", "#D4AF37"], "https://www.heritagetrust.on.ca/ewg/calendar"),
    ("four-seasons-centre", "Four Seasons Centre", "2,000", "hall", "145 Queen Street West, Toronto", ["#9B1B30", "#2C2C2C"], "https://www.coc.ca/tickets"),
    ("harbourfront-centre", "Harbourfront Centre Concert Stage", "2,000", "outdoor", "235 Queens Quay West, Toronto", ["#0072CE", "#F2A900"], "https://harbourfrontcentre.com/events/"),
    ("convocation-hall", "Convocation Hall", "1,700", "hall", "31 King's College Circle, Toronto", ["#1E3765", "#D0D1C9"], "https://convocationhall.utoronto.ca/"),
    ("meridian-arts-centre", "Meridian Arts Centre", "1,700", "hall", "5040 Yonge Street, Toronto", ["#5F259F", "#E87722"], "https://www.tolive.com/Meridian-Arts-Centre-Events"),
    ("danforth-music-hall", "Danforth Music Hall", "1,400", "club", "147 Danforth Avenue, Toronto", ["#C8102E", "#F4C430"], "https://www.thedanforth.com/events"),
    ("winter-garden-theatre", "Winter Garden Theatre", "1,410", "hall", "189 Yonge Street, Toronto", ["#3A7D44", "#C9A14A"], "https://www.heritagetrust.on.ca/ewg/calendar"),
    ("phoenix", "Phoenix Concert Theatre", "1,350", "club", "410 Sherbourne Street, Toronto", ["#E85D04", "#6A040F"], "https://thephoenixconcerttheatre.com/events/"),
    ("queen-elizabeth-theatre", "Queen Elizabeth Theatre", "1,250", "hall", "190 Princes' Boulevard, Toronto", ["#5B2A86", "#C9A14A"], "https://www.queenelizabeththeatre.ca/events"),
    ("concert-hall", "The Concert Hall", "1,200", "club", "888 Yonge Street, Toronto", ["#7B2D26", "#BFA181"], "https://www.theconcerthall.ca/events"),
    ("koerner-hall", "Koerner Hall", "1,100", "hall", "273 Bloor Street West, Toronto", ["#B5651D", "#002D62"], "https://www.rcmusic.com/events-and-performances"),
    ("opera-house", "The Opera House", "800", "club", "735 Queen Street East, Toronto", ["#6B0F1A", "#D9A441"], "https://www.theoperahousetoronto.com/events"),
    ("el-mocambo", "The El Mocambo", "650", "club", "464 Spadina Avenue, Toronto", ["#FF2A6D", "#05A660"], "https://elmocambo.com/events/"),
    ("mod-club", "Mod Club", "620", "club", "722 College Street, Toronto", ["#D7263D", "#1B4F9C"], "https://themodclub.com/events"),
    ("lees-palace", "Lee's Palace", "550", "club", "529 Bloor Street West, Toronto", ["#7E3FBF", "#F28C28"], "https://www.leespalace.com/events"),
    ("adelaide-hall", "Adelaide Hall", "550", "club", "250 Adelaide Street West, Toronto", ["#2B9EB3", "#1F1F1F"], "https://www.adelaidehallto.com/events"),
    ("great-hall", "The Great Hall", "480", "club", "1087 Queen Street West, Toronto", ["#A23B2A", "#E0B04C"], "https://thegreathall.ca/events/"),
    ("horseshoe-tavern", "Horseshoe Tavern", "400", "club", "370 Queen Street West, Toronto", ["#B22222", "#1A1A1A"], "https://www.horseshoetavern.com/events"),
    ("royal-theatre", "The Royal Theatre", "400", "listening", "608 College Street, Toronto", ["#1F3A93", "#D4AF37"], "https://theroyal.to/"),
    ("lula-lounge", "Lula Lounge", "340", "listening", "1585 Dundas Street West, Toronto", ["#E4007C", "#FF7F11"], "https://www.lula.ca/"),
    ("ground-control", "Ground Control", "330", "club", "1279 Queen Street West, Toronto", ["#E10600", "#00A3E0"], "https://www.torontogothevents.com/locations/ground-control/"),
    ("garrison", "The Garrison", "270", "club", "1197 Dundas Street West, Toronto", ["#556B2F", "#C2B280"], "https://www.garrisontoronto.com/"),
    ("rivoli", "The Rivoli", "240", "club", "334 Queen Street West, Toronto", ["#00808C", "#E3B23C"], "https://www.rivolitoronto.com/events"),
    ("mazzoleni-hall", "Mazzoleni Concert Hall", "240", "hall", "273 Bloor Street West, Toronto", ["#1C2E5A", "#B5651D"], "https://www.rcmusic.com/events-and-performances"),
    ("redwood-theatre", "The Redwood Theatre", "240", "listening", "1300 Gerrard Street East, Toronto", ["#A45A52", "#3E2723"], "https://www.theredwoodtheatre.com/events"),
    ("hughs-room", "Hugh's Room", "200", "listening", "296 Broadview Avenue, Toronto", ["#2E7D5B", "#E0A458"], "https://hughsroomlive.com/"),
    ("sneaky-dees", "Sneaky Dee's", "200", "club", "431 College Street, Toronto", ["#39B54A", "#EC008C"], "https://www.livenation.com/venue/KovZpZAFle1A/sneaky-dee-s-events"),
    ("drake-hotel", "The Drake Hotel", "200", "club", "1150 Queen Street West, Toronto", ["#C0392B", "#2C2C2C"], "https://www.thedrake.ca/events/"),
    ("918-bathurst", "918 Bathurst Centre (The Music Gallery)", "200", "listening", "918 Bathurst Street, Toronto", ["#F5A623", "#2D2D2D"], "https://musicgallery.org/"),
    ("bovine-sex-club", "Bovine Sex Club", "200", "club", "542 Queen Street West, Toronto", ["#8B4513", "#8E8E8E"], "https://www.bovinesexclub.com/"),
    ("baby-g", "The Baby G", "170", "club", "1608 Dundas Street West, Toronto", ["#FF5FA2", "#2A2A2A"], "https://www.thebabyg.com/"),
    ("the-rex", "The Rex", "150", "listening", "194 Queen Street West, Toronto", ["#1F4E79", "#C9A227"], "https://www.therex.ca/"),
    ("monarch-tavern", "The Monarch Tavern", "120", "club", "12 Clinton Street, Toronto", ["#B8860B", "#4A1C1C"], "https://www.themonarchtavern.com/"),
    ("grossmans", "Grossman's Tavern", "120", "listening", "377 Spadina Avenue, Toronto", ["#1565C0", "#F2C14E"], "https://grossmanstavern.com/"),
    ("free-times-cafe", "Free Times Cafe", "110", "listening", "320 College Street, Toronto", ["#8D6E63", "#6B8E23"], "https://www.freetimescafe.com/"),
    ("drom-taberna", "DROM Taberna", "75", "listening", "458 Queen Street West, Toronto", ["#C1121F", "#FDF0D5"], "https://www.dromtaberna.com/"),
    ("cameron-house", "The Cameron House", "70", "listening", "408 Queen Street West, Toronto", ["#2F6B3B", "#B23A48"], "https://www.thecameron.com/"),
]

# Manual coordinates where geocoding by address is unreliable.
MANUAL = {
    "rogers-stadium": (43.7445, -79.4740),
    "rbc-amphitheatre": (43.6290, -79.4150),
    "rbc-echo-beach": (43.6323, -79.4195),
    "cne-bandshell": (43.6315, -79.4232),
    "great-canadian-theatre": (43.7168, -79.5970),
    "harbourfront-centre": (43.6386, -79.3822),
    "sobeys-stadium": (43.7716, -79.5124),
    "queen-elizabeth-theatre": (43.6360, -79.4133),
    "coca-cola-coliseum": (43.6363, -79.4152),
    "rebel": (43.6409, -79.3543),
    "convocation-hall": (43.6608, -79.3951),
    "mazzoleni-hall": (43.6676, -79.3961),
    "koerner-hall": (43.6679, -79.3964),
    "winter-garden-theatre": (43.6532, -79.3790),
}


def geocode(address):
    q = urllib.parse.urlencode({"q": address + ", Ontario, Canada", "format": "json", "limit": 1})
    req = urllib.request.Request(
        "https://nominatim.openstreetmap.org/search?" + q,
        headers={"User-Agent": "toronto-music-map/0.1 (personal prototype)"},
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                res = json.load(r)
            break
        except Exception as e:
            print("  retry", address, e)
            time.sleep(3 * (attempt + 1))
    else:
        return None
    time.sleep(1.1)
    if not res:
        return None
    return round(float(res[0]["lat"]), 5), round(float(res[0]["lon"]), 5)


def main():
    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    out = []
    for vid, name, cap, typ, addr, colors, site in VENUES:
        if vid in MANUAL:
            lat, lon = MANUAL[vid]
        else:
            if addr not in cache:
                cache[addr] = geocode(addr)
                print("geocoded", name, cache[addr])
                json.dump(cache, open(CACHE, "w"), indent=1)
            if not cache[addr]:
                print("!! no result for", name)
                continue
            lat, lon = cache[addr]
        out.append(dict(id=vid, name=name, capacity=cap, type=typ, address=addr.replace(", Toronto", ""),
                        lat=lat, lon=lon, colors=colors, website=site))
    with open(OUT, "w") as f:
        f.write("// Venues from https://en.wikipedia.org/wiki/List_of_music_venues_in_Toronto\n")
        f.write("// type: stadium | arena | outdoor | hall | club | listening\n")
        f.write("window.VENUES = ")
        json.dump(out, f, indent=1, ensure_ascii=False)
        f.write(";\n")
    print("wrote", len(out), "venues")


if __name__ == "__main__":
    main()
