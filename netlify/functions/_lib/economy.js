/* ============================================================
   THE AUTHORITATIVE ECONOMY
   ------------------------------------------------------------
   Every price, fare, fine and XP threshold lives here, on the
   server. The game client never sends money - it reports what
   happened, and this file decides what that was worth.
   Editing the client cannot change any number below.
   ============================================================ */

const ROUTES = [
  {
    "id": "cairo_hurghada",
    "name": "Cairo → Hurghada",
    "fare": 420,
    "lvl": 15,
    "len": "long",
    "km": 450,
    "stops": 6,
    "coachOnly": true
  },
  {
    "id": "cairo_gouna",
    "name": "Cairo → El Gouna",
    "fare": 470,
    "lvl": 18,
    "len": "long",
    "km": 470,
    "stops": 6,
    "coachOnly": true
  },
  {
    "id": "cairo_sharm",
    "name": "Cairo → Sharm El Sheikh",
    "fare": 520,
    "lvl": 20,
    "len": "long",
    "km": 490,
    "stops": 6,
    "coachOnly": true
  },
  {
    "id": "maadi_tahrir",
    "name": "Maadi → Tahrir",
    "fare": 8,
    "lvl": 1,
    "len": "short",
    "km": 13,
    "stops": 6,
    "coachOnly": false
  },
  {
    "id": "giza_haram",
    "name": "Giza Square → Pyramids",
    "fare": 6,
    "lvl": 1,
    "len": "short",
    "km": 10,
    "stops": 5,
    "coachOnly": false
  },
  {
    "id": "ramses_hussein",
    "name": "Ramses → El Hussein",
    "fare": 7,
    "lvl": 2,
    "len": "short",
    "km": 5,
    "stops": 5,
    "coachOnly": false
  },
  {
    "id": "asher_ramses",
    "name": "El Hay El Asher → Ramses",
    "fare": 13,
    "lvl": 3,
    "len": "medium",
    "km": 17,
    "stops": 6,
    "coachOnly": false
  },
  {
    "id": "alex_corniche",
    "name": "Raml Station → Montaza",
    "fare": 7,
    "lvl": 4,
    "len": "medium",
    "km": 18,
    "stops": 8,
    "coachOnly": false
  },
  {
    "id": "asher_shorouk",
    "name": "El Hay El Asher → El Shorouk",
    "fare": 18,
    "lvl": 5,
    "len": "medium",
    "km": 30,
    "stops": 5,
    "coachOnly": false
  },
  {
    "id": "asher_capital",
    "name": "El Hay El Asher → New Capital",
    "fare": 34,
    "lvl": 6,
    "len": "long",
    "km": 45,
    "stops": 5,
    "coachOnly": false
  },
  {
    "id": "banha",
    "name": "El Mo’assasa → Banha",
    "fare": 30,
    "lvl": 7,
    "len": "long",
    "km": 48,
    "stops": 5,
    "coachOnly": false
  },
  {
    "id": "cairo_sokhna",
    "name": "Qattameya → Ain Sokhna",
    "fare": 95,
    "lvl": 9,
    "len": "long",
    "km": 120,
    "stops": 4,
    "coachOnly": false
  },
  {
    "id": "cairo_alex",
    "name": "El Mo’assasa → Moharram Bek",
    "fare": 150,
    "lvl": 10,
    "len": "long",
    "km": 220,
    "stops": 6,
    "coachOnly": false
  },
  {
    "id": "bus_tahrir_korba",
    "name": "Abdel Moneim Riad → Korba",
    "fare": 14,
    "lvl": 12,
    "len": "medium",
    "km": 14,
    "stops": 6,
    "coachOnly": false
  },
  {
    "id": "bus_ramses_haram",
    "name": "Ramses → Pyramids",
    "fare": 14,
    "lvl": 12,
    "len": "medium",
    "km": 19,
    "stops": 6,
    "coachOnly": false
  },
  {
    "id": "mini_ramses_october",
    "name": "Ramses → El Hosary (6th Oct.)",
    "fare": 25,
    "lvl": 9,
    "len": "medium",
    "km": 36,
    "stops": 6,
    "coachOnly": false
  },
  {
    "id": "coach_cairo_alex",
    "name": "Cairo Gateway → Sidi Gaber",
    "fare": 260,
    "lvl": 18,
    "len": "long",
    "km": 225,
    "stops": 5,
    "coachOnly": false
  }
];

const VEHICLES = [
  {
    "id": "v_suzuki",
    "name": "Suzuki Every Minivan",
    "price": 95000,
    "lvl": 1,
    "cat": "micro",
    "seats": 7
  },
  {
    "id": "v_foton",
    "name": "Foton Gratour Mini",
    "price": 120000,
    "lvl": 2,
    "cat": "micro",
    "seats": 8
  },
  {
    "id": "v_n300",
    "name": "Chevrolet N300 Van",
    "price": 0,
    "lvl": 1,
    "cat": "micro",
    "seats": 11
  },
  {
    "id": "micro_classic",
    "name": "Toyota HiAce H200",
    "price": 165000,
    "lvl": 5,
    "cat": "micro",
    "seats": 14
  },
  {
    "id": "van_euro",
    "name": "Foton Toano Long",
    "price": 190000,
    "lvl": 4,
    "cat": "micro",
    "seats": 14
  },
  {
    "id": "micro_hr",
    "name": "King Long Kingo Wide",
    "price": 230000,
    "lvl": 6,
    "cat": "micro",
    "seats": 15
  },
  {
    "id": "micro_jumbo",
    "name": "Golden Dragon 6532",
    "price": 280000,
    "lvl": 7,
    "cat": "micro",
    "seats": 16
  },
  {
    "id": "v_shineray",
    "name": "Foton View CS2",
    "price": 420000,
    "lvl": 8,
    "cat": "minibus",
    "seats": 18
  },
  {
    "id": "van_xl",
    "name": "King Long Kingo 6600",
    "price": 450000,
    "lvl": 8,
    "cat": "minibus",
    "seats": 19
  },
  {
    "id": "v_joya6",
    "name": "Joylong Joya 6",
    "price": 480000,
    "lvl": 9,
    "cat": "minibus",
    "seats": 19
  },
  {
    "id": "mini_rosa",
    "name": "Mitsubishi Fuso Rosa",
    "price": 700000,
    "lvl": 10,
    "cat": "minibus",
    "seats": 25
  },
  {
    "id": "coaster",
    "name": "Toyota Coaster B70",
    "price": 640000,
    "lvl": 11,
    "cat": "minibus",
    "seats": 26
  },
  {
    "id": "v_isuzu",
    "name": "Isuzu NPR Bus",
    "price": 720000,
    "lvl": 12,
    "cat": "minibus",
    "seats": 28
  },
  {
    "id": "v_higer",
    "name": "Higer KLQ6728",
    "price": 780000,
    "lvl": 12,
    "cat": "minibus",
    "seats": 29
  },
  {
    "id": "v_yutong77",
    "name": "Yutong ZK6770",
    "price": 850000,
    "lvl": 13,
    "cat": "minibus",
    "seats": 30
  },
  {
    "id": "citybus",
    "name": "King Long XMQ6127",
    "price": 1250000,
    "lvl": 15,
    "cat": "bus",
    "seats": 35
  },
  {
    "id": "v_zk6128",
    "name": "Yutong ZK6128HG",
    "price": 1600000,
    "lvl": 16,
    "cat": "bus",
    "seats": 38
  },
  {
    "id": "coach",
    "name": "Golden Dragon Navigator 6125",
    "price": 2400000,
    "lvl": 19,
    "cat": "bus",
    "seats": 49
  },
  {
    "id": "v_tourismo",
    "name": "Mercedes-Benz Tourismo RHD",
    "price": 3400000,
    "lvl": 22,
    "cat": "bus",
    "seats": 51
  },
  {
    "id": "car_old",
    "name": "Fiat 128 Nasr",
    "price": 55000,
    "lvl": 1,
    "cat": "car",
    "seats": 3
  },
  {
    "id": "hatch_city",
    "name": "Lada 2107 Riva",
    "price": 90000,
    "lvl": 2,
    "cat": "car",
    "seats": 3
  },
  {
    "id": "hatch",
    "name": "Hyundai Verna",
    "price": 140000,
    "lvl": 4,
    "cat": "car",
    "seats": 3
  },
  {
    "id": "sedan_compact",
    "name": "Daewoo Lanos (Nasr)",
    "price": 170000,
    "lvl": 3,
    "cat": "car",
    "seats": 4
  },
  {
    "id": "sedan16",
    "name": "Chevrolet Optra",
    "price": 260000,
    "lvl": 7,
    "cat": "car",
    "seats": 4
  },
  {
    "id": "sedan_mid",
    "name": "Toyota Corolla 1.8",
    "price": 380000,
    "lvl": 9,
    "cat": "car",
    "seats": 4
  }
];

const FUEL = {
  "diesel": {
    "price": 10.25,
    "name": "Diesel"
  },
  "b80": {
    "price": 10.4,
    "name": "Petrol 80"
  },
  "b92": {
    "price": 11.15,
    "name": "Petrol 92"
  },
  "b95": {
    "price": 12,
    "name": "Petrol 95"
  },
  "cng": {
    "price": 6.5,
    "name": "Natural gas"
  }
};

const LICENCES = [
  {
    "id": "private",
    "price": 1800,
    "days": 120
  },
  {
    "id": "pro",
    "price": 5200,
    "days": 90
  }
];

/* XP needed to reach each level (index 0 = level 1 -> 2) */
const XP_CURVE = [
  220,
  644,
  1208,
  1886,
  2666,
  3536,
  4491,
  5523,
  6630,
  7806,
  9049,
  10355,
  11723,
  13150,
  14634,
  16174,
  17767,
  19413,
  21110,
  22857
];

/* fines, in EGP */
const FINES = {
  no_licence:      1500,
  licence_expired:  800,
  wrong_class:     1200,
  over_capacity:    500,
  poor_condition:   400,
  at_fault_crash:   300,   // + 22 per km/h over the limit
  speed_camera:     150,   // + 14 per km/h over the limit
  red_light:        400,
  pedestrian:      3000
};

/* what a completed trip is worth, before fines */
const PAY = {
  perPassenger:      1.00,  // x the route fare, per seat filled
  onTimeBonus:       0.15,  // fraction of base added for punctuality
  fiveStarBonus:     0.10,
  fuelCostPerLitre:  null,  // taken from FUEL below
  maxTipPerPax:      5
};

/* physical limits used to spot impossible reports */
const SANITY = {
  minSecPerKm:      18,     // faster than this is not possible
  maxSecPerKm:     900,     // slower than this is idling, not driving
  maxPassengers:    70,
  maxTripPayout: 120000,
  maxBalanceJumpPerMinute: 60000
};

module.exports = { ROUTES, VEHICLES, FUEL, LICENCES, XP_CURVE, FINES, PAY, SANITY };
