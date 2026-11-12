// Venues from https://en.wikipedia.org/wiki/List_of_music_venues_in_Toronto
// type: stadium | arena | outdoor | hall | club | listening
window.VENUES = [
 {
  "id": "rogers-stadium",
  "name": "Rogers Stadium",
  "capacity": "50,000",
  "type": "stadium",
  "address": "105 Carl Hall Road",
  "lat": 43.7445,
  "lon": -79.474,
  "colors": [
   "#DA291C",
   "#1F1F1F"
  ],
  "website": "https://www.livenation.com/venue/KovZ917A_Y0/rogers-stadium-events"
 },
 {
  "id": "rogers-centre",
  "name": "Rogers Centre",
  "capacity": "40,000 – 50,000",
  "type": "stadium",
  "address": "1 Blue Jays Way",
  "lat": 43.64166,
  "lon": -79.3892,
  "colors": [
   "#DA291C",
   "#134A8E"
  ],
  "website": "https://www.mlb.com/bluejays/ballpark/events"
 },
 {
  "id": "scotiabank-arena",
  "name": "Scotiabank Arena",
  "capacity": "19,800",
  "type": "arena",
  "address": "40 Bay Street",
  "lat": 43.64343,
  "lon": -79.37908,
  "colors": [
   "#EC111A",
   "#1E1E1E"
  ],
  "website": "https://www.scotiabankarena.com/events"
 },
 {
  "id": "rbc-amphitheatre",
  "name": "RBC Amphitheatre",
  "capacity": "17,000",
  "type": "outdoor",
  "address": "909 Lake Shore Boulevard West",
  "lat": 43.629,
  "lon": -79.415,
  "colors": [
   "#005DAA",
   "#FFD200"
  ],
  "website": "https://www.livenation.com/venue/KovZpZAEkn6A/rbc-amphitheatre-events"
 },
 {
  "id": "cne-bandshell",
  "name": "CNE Bandshell",
  "capacity": "10,000",
  "type": "outdoor",
  "address": "60 Prince Edward Island Crescent",
  "lat": 43.6315,
  "lon": -79.4232,
  "colors": [
   "#E31837",
   "#00539B"
  ],
  "website": "https://theex.com"
 },
 {
  "id": "coca-cola-coliseum",
  "name": "Coca-Cola Coliseum",
  "capacity": "4,100 – 9,200",
  "type": "arena",
  "address": "45 Manitoba Drive",
  "lat": 43.6363,
  "lon": -79.4152,
  "colors": [
   "#F40009",
   "#2B2B2B"
  ],
  "website": "https://www.coca-colacoliseum.com/events"
 },
 {
  "id": "sobeys-stadium",
  "name": "Sobeys Stadium",
  "capacity": "9,100",
  "type": "arena",
  "address": "1 Shoreham Drive",
  "lat": 43.7716,
  "lon": -79.5124,
  "colors": [
   "#0E7C3A",
   "#E21F26"
  ],
  "website": "https://www.sobeysstadium.com/"
 },
 {
  "id": "great-canadian-theatre",
  "name": "The Theatre at Great Canadian Toronto",
  "capacity": "5,000",
  "type": "hall",
  "address": "1133 Queens Plate Drive",
  "lat": 43.7168,
  "lon": -79.597,
  "colors": [
   "#B8892D",
   "#1A1A1A"
  ],
  "website": "https://www.greatcanadian.com/destinations/ontario/toronto/entertainment/"
 },
 {
  "id": "rbc-echo-beach",
  "name": "RBC Echo Beach",
  "capacity": "4,000",
  "type": "outdoor",
  "address": "909 Lake Shore Boulevard West",
  "lat": 43.6323,
  "lon": -79.4195,
  "colors": [
   "#005DAA",
   "#E8B86D"
  ],
  "website": "https://ontarioplace.com/en/rbc-echo-beach/"
 },
 {
  "id": "meridian-hall",
  "name": "Meridian Hall",
  "capacity": "3,200",
  "type": "hall",
  "address": "1 Front Street East",
  "lat": 43.64666,
  "lon": -79.37607,
  "colors": [
   "#5F259F",
   "#00A3AD"
  ],
  "website": "https://www.tolive.com/Meridian-Hall-Events"
 },
 {
  "id": "massey-hall",
  "name": "Massey Hall",
  "capacity": "2,700",
  "type": "hall",
  "address": "178 Victoria Street",
  "lat": 43.65397,
  "lon": -79.37898,
  "colors": [
   "#8C1D2F",
   "#C9A14A"
  ],
  "website": "https://masseyhall.mhrth.com/"
 },
 {
  "id": "roy-thomson-hall",
  "name": "Roy Thomson Hall",
  "capacity": "2,600",
  "type": "hall",
  "address": "60 Simcoe Street",
  "lat": 43.64656,
  "lon": -79.38634,
  "colors": [
   "#1D3557",
   "#8DA9C4"
  ],
  "website": "https://roythomsonhall.mhrth.com/"
 },
 {
  "id": "history",
  "name": "History",
  "capacity": "2,600",
  "type": "club",
  "address": "1663 Queen Street East",
  "lat": 43.6667,
  "lon": -79.31331,
  "colors": [
   "#141414",
   "#C9A227"
  ],
  "website": "https://www.historytoronto.com/events"
 },
 {
  "id": "rebel",
  "name": "Rebel",
  "capacity": "2,500",
  "type": "club",
  "address": "11 Polson Street",
  "lat": 43.6409,
  "lon": -79.3543,
  "colors": [
   "#E6007E",
   "#1B1B1B"
  ],
  "website": "https://rebeltoronto.com/events/"
 },
 {
  "id": "elgin-theatre",
  "name": "Elgin Theatre",
  "capacity": "2,100",
  "type": "hall",
  "address": "189 Yonge Street",
  "lat": 43.65303,
  "lon": -79.37929,
  "colors": [
   "#A0172F",
   "#D4AF37"
  ],
  "website": "https://www.heritagetrust.on.ca/ewg/calendar"
 },
 {
  "id": "four-seasons-centre",
  "name": "Four Seasons Centre",
  "capacity": "2,000",
  "type": "hall",
  "address": "145 Queen Street West",
  "lat": 43.6506,
  "lon": -79.38553,
  "colors": [
   "#9B1B30",
   "#2C2C2C"
  ],
  "website": "https://www.coc.ca/tickets"
 },
 {
  "id": "harbourfront-centre",
  "name": "Harbourfront Centre Concert Stage",
  "capacity": "2,000",
  "type": "outdoor",
  "address": "235 Queens Quay West",
  "lat": 43.6386,
  "lon": -79.3822,
  "colors": [
   "#0072CE",
   "#F2A900"
  ],
  "website": "https://harbourfrontcentre.com/events/"
 },
 {
  "id": "convocation-hall",
  "name": "Convocation Hall",
  "capacity": "1,700",
  "type": "hall",
  "address": "31 King's College Circle",
  "lat": 43.6608,
  "lon": -79.3951,
  "colors": [
   "#1E3765",
   "#D0D1C9"
  ],
  "website": "https://convocationhall.utoronto.ca/"
 },
 {
  "id": "meridian-arts-centre",
  "name": "Meridian Arts Centre",
  "capacity": "1,700",
  "type": "hall",
  "address": "5040 Yonge Street",
  "lat": 43.76602,
  "lon": -79.41445,
  "colors": [
   "#5F259F",
   "#E87722"
  ],
  "website": "https://www.tolive.com/Meridian-Arts-Centre-Events"
 },
 {
  "id": "danforth-music-hall",
  "name": "Danforth Music Hall",
  "capacity": "1,400",
  "type": "club",
  "address": "147 Danforth Avenue",
  "lat": 43.6762,
  "lon": -79.35702,
  "colors": [
   "#C8102E",
   "#F4C430"
  ],
  "website": "https://www.thedanforth.com/events"
 },
 {
  "id": "winter-garden-theatre",
  "name": "Winter Garden Theatre",
  "capacity": "1,410",
  "type": "hall",
  "address": "189 Yonge Street",
  "lat": 43.6532,
  "lon": -79.379,
  "colors": [
   "#3A7D44",
   "#C9A14A"
  ],
  "website": "https://www.heritagetrust.on.ca/ewg/calendar"
 },
 {
  "id": "phoenix",
  "name": "Phoenix Concert Theatre",
  "capacity": "1,350",
  "type": "club",
  "address": "410 Sherbourne Street",
  "lat": 43.66472,
  "lon": -79.37416,
  "colors": [
   "#E85D04",
   "#6A040F"
  ],
  "website": "https://thephoenixconcerttheatre.com/events/"
 },
 {
  "id": "queen-elizabeth-theatre",
  "name": "Queen Elizabeth Theatre",
  "capacity": "1,250",
  "type": "hall",
  "address": "190 Princes' Boulevard",
  "lat": 43.636,
  "lon": -79.4133,
  "colors": [
   "#5B2A86",
   "#C9A14A"
  ],
  "website": "https://www.queenelizabeththeatre.ca/events"
 },
 {
  "id": "concert-hall",
  "name": "The Concert Hall",
  "capacity": "1,200",
  "type": "club",
  "address": "888 Yonge Street",
  "lat": 43.67308,
  "lon": -79.38829,
  "colors": [
   "#7B2D26",
   "#BFA181"
  ],
  "website": "https://www.theconcerthall.ca/events"
 },
 {
  "id": "koerner-hall",
  "name": "Koerner Hall",
  "capacity": "1,100",
  "type": "hall",
  "address": "273 Bloor Street West",
  "lat": 43.6679,
  "lon": -79.3964,
  "colors": [
   "#B5651D",
   "#002D62"
  ],
  "website": "https://www.rcmusic.com/events-and-performances"
 },
 {
  "id": "opera-house",
  "name": "The Opera House",
  "capacity": "800",
  "type": "club",
  "address": "735 Queen Street East",
  "lat": 43.65899,
  "lon": -79.34879,
  "colors": [
   "#6B0F1A",
   "#D9A441"
  ],
  "website": "https://www.theoperahousetoronto.com/events"
 },
 {
  "id": "el-mocambo",
  "name": "The El Mocambo",
  "capacity": "650",
  "type": "club",
  "address": "464 Spadina Avenue",
  "lat": 43.65753,
  "lon": -79.40017,
  "colors": [
   "#FF2A6D",
   "#05A660"
  ],
  "website": "https://elmocambo.com/events/"
 },
 {
  "id": "mod-club",
  "name": "Mod Club",
  "capacity": "620",
  "type": "club",
  "address": "722 College Street",
  "lat": 43.65537,
  "lon": -79.41935,
  "colors": [
   "#D7263D",
   "#1B4F9C"
  ],
  "website": "https://themodclub.com/events"
 },
 {
  "id": "lees-palace",
  "name": "Lee's Palace",
  "capacity": "550",
  "type": "club",
  "address": "529 Bloor Street West",
  "lat": 43.6653,
  "lon": -79.40946,
  "colors": [
   "#7E3FBF",
   "#F28C28"
  ],
  "website": "https://www.leespalace.com/events"
 },
 {
  "id": "adelaide-hall",
  "name": "Adelaide Hall",
  "capacity": "550",
  "type": "club",
  "address": "250 Adelaide Street West",
  "lat": 43.64832,
  "lon": -79.38911,
  "colors": [
   "#2B9EB3",
   "#1F1F1F"
  ],
  "website": "https://www.adelaidehallto.com/events"
 },
 {
  "id": "great-hall",
  "name": "The Great Hall",
  "capacity": "480",
  "type": "club",
  "address": "1087 Queen Street West",
  "lat": 43.64334,
  "lon": -79.4221,
  "colors": [
   "#A23B2A",
   "#E0B04C"
  ],
  "website": "https://thegreathall.ca/events/"
 },
 {
  "id": "horseshoe-tavern",
  "name": "Horseshoe Tavern",
  "capacity": "400",
  "type": "club",
  "address": "370 Queen Street West",
  "lat": 43.64905,
  "lon": -79.3959,
  "colors": [
   "#B22222",
   "#1A1A1A"
  ],
  "website": "https://www.horseshoetavern.com/events"
 },
 {
  "id": "royal-theatre",
  "name": "The Royal Theatre",
  "capacity": "400",
  "type": "listening",
  "address": "608 College Street",
  "lat": 43.65538,
  "lon": -79.41457,
  "colors": [
   "#1F3A93",
   "#D4AF37"
  ],
  "website": "https://theroyal.to/"
 },
 {
  "id": "lula-lounge",
  "name": "Lula Lounge",
  "capacity": "340",
  "type": "listening",
  "address": "1585 Dundas Street West",
  "lat": 43.64965,
  "lon": -79.43458,
  "colors": [
   "#E4007C",
   "#FF7F11"
  ],
  "website": "https://www.lula.ca/"
 },
 {
  "id": "ground-control",
  "name": "Ground Control",
  "capacity": "330",
  "type": "club",
  "address": "1279 Queen Street West",
  "lat": 43.64145,
  "lon": -79.43188,
  "colors": [
   "#E10600",
   "#00A3E0"
  ],
  "website": "https://www.torontogothevents.com/locations/ground-control/"
 },
 {
  "id": "garrison",
  "name": "The Garrison",
  "capacity": "270",
  "type": "club",
  "address": "1197 Dundas Street West",
  "lat": 43.64915,
  "lon": -79.42234,
  "colors": [
   "#556B2F",
   "#C2B280"
  ],
  "website": "https://www.garrisontoronto.com/"
 },
 {
  "id": "rivoli",
  "name": "The Rivoli",
  "capacity": "240",
  "type": "club",
  "address": "334 Queen Street West",
  "lat": 43.64941,
  "lon": -79.39494,
  "colors": [
   "#00808C",
   "#E3B23C"
  ],
  "website": "https://www.rivolitoronto.com/events"
 },
 {
  "id": "mazzoleni-hall",
  "name": "Mazzoleni Concert Hall",
  "capacity": "240",
  "type": "hall",
  "address": "273 Bloor Street West",
  "lat": 43.6676,
  "lon": -79.3961,
  "colors": [
   "#1C2E5A",
   "#B5651D"
  ],
  "website": "https://www.rcmusic.com/events-and-performances"
 },
 {
  "id": "redwood-theatre",
  "name": "The Redwood Theatre",
  "capacity": "240",
  "type": "listening",
  "address": "1300 Gerrard Street East",
  "lat": 43.6714,
  "lon": -79.32725,
  "colors": [
   "#A45A52",
   "#3E2723"
  ],
  "website": "https://www.theredwoodtheatre.com/events"
 },
 {
  "id": "hughs-room",
  "name": "Hugh's Room",
  "capacity": "200",
  "type": "listening",
  "address": "296 Broadview Avenue",
  "lat": 43.66384,
  "lon": -79.35226,
  "colors": [
   "#2E7D5B",
   "#E0A458"
  ],
  "website": "https://hughsroomlive.com/"
 },
 {
  "id": "sneaky-dees",
  "name": "Sneaky Dee's",
  "capacity": "200",
  "type": "club",
  "address": "431 College Street",
  "lat": 43.65625,
  "lon": -79.40743,
  "colors": [
   "#39B54A",
   "#EC008C"
  ],
  "website": "https://www.livenation.com/venue/KovZpZAFle1A/sneaky-dee-s-events"
 },
 {
  "id": "drake-hotel",
  "name": "The Drake Hotel",
  "capacity": "200",
  "type": "club",
  "address": "1150 Queen Street West",
  "lat": 43.64325,
  "lon": -79.42452,
  "colors": [
   "#C0392B",
   "#2C2C2C"
  ],
  "website": "https://www.thedrake.ca/events/"
 },
 {
  "id": "918-bathurst",
  "name": "918 Bathurst Centre (The Music Gallery)",
  "capacity": "200",
  "type": "listening",
  "address": "918 Bathurst Street",
  "lat": 43.66857,
  "lon": -79.41299,
  "colors": [
   "#F5A623",
   "#2D2D2D"
  ],
  "website": "https://musicgallery.org/"
 },
 {
  "id": "bovine-sex-club",
  "name": "Bovine Sex Club",
  "capacity": "200",
  "type": "club",
  "address": "542 Queen Street West",
  "lat": 43.64757,
  "lon": -79.40271,
  "colors": [
   "#8B4513",
   "#8E8E8E"
  ],
  "website": "https://www.bovinesexclub.com/"
 },
 {
  "id": "baby-g",
  "name": "The Baby G",
  "capacity": "170",
  "type": "club",
  "address": "1608 Dundas Street West",
  "lat": 43.64997,
  "lon": -79.43534,
  "colors": [
   "#FF5FA2",
   "#2A2A2A"
  ],
  "website": "https://www.thebabyg.com/"
 },
 {
  "id": "the-rex",
  "name": "The Rex",
  "capacity": "150",
  "type": "listening",
  "address": "194 Queen Street West",
  "lat": 43.65054,
  "lon": -79.38847,
  "colors": [
   "#1F4E79",
   "#C9A227"
  ],
  "website": "https://www.therex.ca/"
 },
 {
  "id": "monarch-tavern",
  "name": "The Monarch Tavern",
  "capacity": "120",
  "type": "club",
  "address": "12 Clinton Street",
  "lat": 43.65406,
  "lon": -79.41358,
  "colors": [
   "#B8860B",
   "#4A1C1C"
  ],
  "website": "https://www.themonarchtavern.com/"
 },
 {
  "id": "grossmans",
  "name": "Grossman's Tavern",
  "capacity": "120",
  "type": "listening",
  "address": "377 Spadina Avenue",
  "lat": 43.65597,
  "lon": -79.39897,
  "colors": [
   "#1565C0",
   "#F2C14E"
  ],
  "website": "https://grossmanstavern.com/"
 },
 {
  "id": "free-times-cafe",
  "name": "Free Times Cafe",
  "capacity": "110",
  "type": "listening",
  "address": "320 College Street",
  "lat": 43.65766,
  "lon": -79.40247,
  "colors": [
   "#8D6E63",
   "#6B8E23"
  ],
  "website": "https://www.freetimescafe.com/"
 },
 {
  "id": "drom-taberna",
  "name": "DROM Taberna",
  "capacity": "75",
  "type": "listening",
  "address": "458 Queen Street West",
  "lat": 43.64821,
  "lon": -79.39956,
  "colors": [
   "#C1121F",
   "#FDF0D5"
  ],
  "website": "https://www.dromtaberna.com/"
 },
 {
  "id": "cameron-house",
  "name": "The Cameron House",
  "capacity": "70",
  "type": "listening",
  "address": "408 Queen Street West",
  "lat": 43.64862,
  "lon": -79.39758,
  "colors": [
   "#2F6B3B",
   "#B23A48"
  ],
  "website": "https://www.thecameron.com/"
 }
];
