import type { IconName } from "@/components/ServiceIcon";

export type Service = {
  slug: string;
  name: string;
  short: string;
  /** Longer copy for /services. Facts only — from Noah's form and captions. */
  long: string;
  includes: string[];
  icon: IconName;
  isNew?: boolean;
  /** Work-photo slot used on /services (falls back to an abstract placeholder). */
  photo?: string;
};

// Canonical menu = the 7 services on Noah's "Detailing Quote Form".
export const services: Service[] = [
  {
    slug: "exterior-wash",
    name: "Exterior Wash",
    short: "The road comes off — paint, glass, wheels and tires.",
    long: "A full exterior wash with real attention on the parts most washes rush. Wheels get extra time for brake dust, and faded plastic trim can be brought back to a deep, even finish.",
    includes: ["Extra time on wheels for brake dust", "Plastic trim restoration", "Spray wax or wash-and-wax finish"],
    icon: "mitt",
    photo: "exterior-trim-restoration",
  },
  {
    slug: "interior-wash",
    name: "Interior Wash",
    short: "A standard interior reset, top to bottom.",
    long: "Your cabin, back to the way it should feel. Pick a standard interior to freshen things up, or pair it with an exterior wash for a full detail — inside and out.",
    includes: ["Standard interior or full interior", "Pairs with an exterior wash for a full detail", "Quick maintenance cleans available"],
    icon: "vacuum",
    photo: "4runner-full-detail",
  },
  {
    slug: "paint-correction-wax",
    name: "Paint Correction / Wax",
    short: "Scratches, swirls and water spots out. Gloss in.",
    long: "Correction for the scratches, swirls and water spots that dull your paint — including minor paint-transfer scuffs — finished with protection that makes it pop.",
    includes: ["Minor correction on paint-transfer scuffs", "Hand wax or spray wax", "Polymer paint sealant"],
    icon: "polisher",
    photo: "miata-wash-wax",
  },
  {
    slug: "steam-cleaning-shampoo",
    name: "Seat & Carpet Steam Cleaning & Shampooing",
    short: "Extraction pulls out the dirt your vacuum leaves behind.",
    long: "Extraction isn't just for stains. There's a lot of dirt embedded in carpets and seats that a vacuum never catches — shampoo and extraction pull it out.",
    includes: ["Seat shampoo", "Carpet & seat extraction", "Not just for stains — embedded dirt too"],
    icon: "steam",
    photo: "camry-seat-shampoo",
  },
  {
    slug: "pet-hair-removal",
    name: "Pet Hair Removal",
    short: "Dog hair woven into seats and carpet, pulled out.",
    long: "Pet hair works its way deep into fabric. I extract it from seats and carpets so your car stops shedding on your passengers.",
    includes: ["Dog hair extraction", "Seats & carpets", "Pairs well with a seat shampoo"],
    icon: "paw",
    photo: "dart-pet-hair",
  },
  {
    slug: "headlight-restoration",
    name: "Headlight Restoration",
    short: "Cloudy, yellowed headlights made clear again.",
    long: "New on the menu. Headlight restoration brings back the clarity of cloudy, yellowed headlights so they shine brighter at night — and the whole front end looks younger.",
    includes: ["Restores clarity to cloudy lenses", "Takes out the yellowing", "Brighter headlights at night"],
    icon: "headlight",
    isNew: true,
    photo: "headlight",
  },
  {
    slug: "engine-bay-detail",
    name: "Engine Bay Detail",
    short: "Under the hood, as clean as the rest of it.",
    long: "The detail most people forget. Pop the hood and have the engine bay cleaned up to match the rest of the vehicle.",
    includes: ["Under-the-hood clean-up", "Add it to any exterior or full detail"],
    icon: "engine",
  },
];

export const serviceNames = services.map((s) => s.name);
