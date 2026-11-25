// Solutions, process flow, gallery and shared copy.
// Copy rule: no invented figures, certifications, clients, countries or completed projects.

export interface Solution {
  slug: string;
  num: string;
  name: string;
  short: string;
  intro: string;
  image: string;
  imageAlt: string;
  /** product slugs */
  products: string[];
  process: { title: string; text: string }[];
  applications: string[];
  seoTitle: string;
  seoDescription: string;
  note?: string;
}

const P = (f: string) => `/images/products/${f}.webp`;

export const SOLUTIONS: Solution[] = [
  {
    slug: "cassava-processing",
    num: "01",
    name: "Cassava Processing Systems",
    short: "Integrated lines covering washing, drying, grinding and packaging of cassava flour.",
    intro:
      "A cassava flour line moves product through four units: cleaning and washing, drying, grinding and packing. The reference configuration we work from also covers flow piping, air piping, PLC wiring and installation. Smarctek helps buyers define that scope and discuss it with equipment suppliers.",
    image: "/images/gallery/industrial-processing-hall-equipment-900.webp",
    imageAlt: "Industrial processing hall with a large blue machine and overhead cranes",
    products: ["quadro-plansifter-ke-8x28", "pneumatic-roller-mill-spv-250x1000", "flour-conveyor-vh-200", "bucket-elevator-kel-20x20", "flour-packaging-machine-25-50kg", "plc-control-panels"],
    process: [
      { title: "Cleaning and washing", text: "Raw cassava is received and cleaned before it moves on. The unit scope is defined per project." },
      { title: "Drying", text: "Material is dried before milling. Drying capacity and layout depend on the project specification." },
      { title: "Grinding and milling", text: "Dried product is reduced, ground and sifted by roller mills and plansifters." },
      { title: "Packing", text: "Finished flour is weighed and bagged in 25–50 kg units." },
    ],
    applications: ["Cassava flour production", "Agro-processing plant planning", "Project enquiries tied to a specific tonnage and site"],
    seoTitle: "Cassava Flour Processing Machinery | Smarctek LLC",
    seoDescription:
      "Cassava flour processing line enquiries: cleaning, drying, grinding and packaging equipment, flow piping and PLC control. Request a quote from SMARCTEK LLC.",
  },
  {
    slug: "agricultural-processing-equipment",
    num: "02",
    name: "Agricultural Processing Equipment",
    short: "Cleaning, separating and size-reduction machinery for agricultural produce.",
    intro:
      "Cleaning and separation machines, breakers and degerminators prepare grain and other agricultural product for further processing. We help buyers match machines to their product and throughput and request technical data from suppliers.",
    image: P("vibro-separator-rt-100"),
    imageAlt: "RT-100 vibro separator",
    products: ["vibro-separator-rt-100", "industrial-breaker", "degerminator", "aspirator-asp", "vibrator"],
    process: [
      { title: "Receiving", text: "Product enters the line by conveyor or elevator." },
      { title: "Cleaning and separation", text: "Lighter material and dust are removed with air-assisted separators." },
      { title: "Size reduction", text: "Breakers and degerminators prepare product for milling." },
    ],
    applications: ["Grain cleaning and preparation", "Corn and cereal germ separation", "Plant upgrades that add a single machine"],
    seoTitle: "Agricultural Processing Equipment | Smarctek LLC",
    seoDescription:
      "Agricultural processing equipment enquiries: vibro separators, breakers, degerminators and aspirators. Technical information and quotation support from Smarctek LLC.",
  },
  {
    slug: "flour-milling-grinding",
    num: "03",
    name: "Flour Milling and Grinding Systems",
    short: "Roller mills, plansifters and supporting feeders for flour milling lines.",
    intro:
      "Milling lines combine breaking, roller milling and sifting with controlled feeding between machines. The machines below come from reference supplier documentation, and their suitability for a given product is confirmed during technical review.",
    image: P("quadro-plansifter-ke-8x28"),
    imageAlt: "Quadro plansifter",
    products: ["industrial-breaker", "pneumatic-roller-mill-spv-250x1000", "quadro-plansifter-ke-8x28", "roller-mill-store", "vibrator", "degerminator"],
    process: [
      { title: "Feeding", text: "A roller mill store feeds product to the mill passage in proportion." },
      { title: "Grinding", text: "Pneumatically controlled roller mills grind product." },
      { title: "Sifting", text: "A plansifter classifies the ground product; material can be returned for re-grinding." },
    ],
    applications: ["Industrial flour milling", "Cereal and root-crop flour lines", "Mill passage additions or replacements"],
    seoTitle: "Industrial Flour Milling Equipment | Smarctek LLC",
    seoDescription:
      "Industrial flour milling and grinding equipment: pneumatic roller mills, plansifters, breakers and feeders. Request technical details and a quotation from Smarctek LLC.",
  },
  {
    slug: "material-handling",
    num: "04",
    name: "Industrial Material Handling",
    short: "Screw conveyors, bucket elevators and discharge units for moving product through a plant.",
    intro:
      "Conveyors and elevators link process stages, and discharge units empty silos and filters. Lengths, heights and drives vary with the plant, so each enquiry starts from the site layout.",
    image: P("bucket-elevator-kel-20x20"),
    imageAlt: "KEL-20x20 bucket elevator",
    products: ["flour-conveyor-vh-200", "bucket-elevator-kel-20x20", "rotoflow-rw-60", "vibrator", "air-lock-feeder-eklus"],
    process: [
      { title: "Layout", text: "Machine positions and product routes are set in a layout diagram." },
      { title: "Horizontal transfer", text: "Screw conveyors carry product between machines." },
      { title: "Vertical transfer", text: "Dust-isolated bucket elevators lift product between levels." },
    ],
    applications: ["Flour and grain transfer", "Silo and filter discharge", "Plant layouts with several floors"],
    seoTitle: "Industrial Conveyor Systems | Smarctek LLC",
    seoDescription:
      "Industrial conveyor systems and material handling: screw conveyors, bucket elevators and discharge units. Enquire with Smarctek LLC for specifications and quotations.",
  },
  {
    slug: "pneumatic-filtration",
    num: "05",
    name: "Pneumatic and Filtration Systems",
    short: "Fans, blowers, cyclones, air locks and bag filters for air-handled lines.",
    intro:
      "Pneumatic lines need the right fan, blower, air lock and filter working together. Equipment in this group covers conveying air, dust collection and air breaking, with piping sized to each duty.",
    image: P("pneumatic-cyclone-group"),
    imageAlt: "Pneumatic cyclone group",
    products: ["pneumatic-fan-pf-75", "blower-pump-bp-50-lt", "aspirator-asp", "pneumatic-cyclone-group", "super-sonic-filter-ssf-52x2400", "air-lock-hvk-240", "air-lock-feeder-eklus", "rotoflow-rw-60"],
    process: [
      { title: "Air supply", text: "Fans and blowers provide conveying and cleaning air." },
      { title: "Separation", text: "Cyclones separate product from the air stream." },
      { title: "Filtration", text: "Bag filters clean dusty air before it is released." },
      { title: "Air breaking", text: "Air locks keep air pressure separated at discharge points." },
    ],
    applications: ["Pneumatic conveying of flour, bran and semolina", "Dust collection", "Air supply for cleaning machines"],
    seoTitle: "Pneumatic Conveying Systems & Filters | Smarctek LLC",
    seoDescription:
      "Pneumatic conveying systems and filtration: fans, blowers, cyclones, air locks and bag filters. Request specifications and a quotation from Smarctek LLC.",
  },
  {
    slug: "automation-packaging",
    num: "06",
    name: "Automation and Packaging Solutions",
    short: "Central PLC control and single-station flour packaging.",
    intro:
      "A central PLC panel controls every machine in the line, with alarms and motor protection. At the end of the line, a weighing and bagging machine packs flour in 25–50 kg units.",
    image: P("flour-packaging-machine-25-50kg"),
    imageAlt: "Flour packaging machine",
    products: ["plc-control-panels", "flour-packaging-machine-25-50kg"],
    process: [
      { title: "Control", text: "One panel sends commands to all machines; wiring runs in channels." },
      { title: "Protection", text: "Power is cut automatically on a supply change, and failures raise an alarm." },
      { title: "Packing", text: "Flour is weighed and bagged at a single station." },
    ],
    applications: ["Line-wide machine control", "Bagging of finished flour", "Control upgrades for existing equipment"],
    seoTitle: "Industrial Packaging & Automation Equipment | Smarctek LLC",
    seoDescription:
      "Industrial packaging equipment and PLC control for processing lines: flour bagging 25–50 kg and central control panels. Enquire with Smarctek LLC.",
  },
  {
    slug: "irrigation-project-enquiries",
    num: "07",
    name: "Irrigation-Related Project Enquiries",
    short: "Enquiries that combine irrigation with agricultural processing. Scope confirmed per project.",
    intro:
      "The reference proposal behind this site pairs a cassava flour plant with an irrigation project in Angola. If your project has an irrigation element, tell us about it and we will discuss whether and how it can be supported. Scope is confirmed case by case.",
    image: "/images/gallery/industrial-processing-hall-equipment-900.webp",
    imageAlt: "Industrial processing hall",
    products: [],
    process: [
      { title: "Brief", text: "Share the project location, crops and processing objectives." },
      { title: "Scope check", text: "We confirm whether the enquiry fits before a technical discussion." },
    ],
    applications: ["Projects combining irrigation and processing"],
    note: "Irrigation scope is subject to confirmation and is not offered as a stand-alone catalogue line.",
    seoTitle: "Irrigation-Related Project Enquiries | Smarctek LLC",
    seoDescription:
      "Irrigation-related project enquiries linked to agricultural processing. Share your project with Smarctek LLC for a scope discussion.",
  },
];

export const solutionBySlug = (s: string) => SOLUTIONS.find((x) => x.slug === s);

// ---------------- Process flow (simplified overview) ----------------
export interface Stage {
  id: string;
  n: string;
  title: string;
  summary: string;
  detail: string;
  products: string[];
  image?: { src: string; alt: string };
  caption?: string;
}

export const STAGES: Stage[] = [
  {
    id: "input",
    n: "01",
    title: "Cassava input",
    summary: "Raw material enters the line.",
    detail:
      "Product is received and moved into the cleaning unit by conveyors and elevators. Intake layout, storage and feeding are set in the project diagram.",
    products: ["bucket-elevator-kel-20x20", "flour-conveyor-vh-200"],
    image: { src: P("bucket-elevator-kel-20x20"), alt: "Bucket elevator" },
    caption: "Transfer equipment in the reference configuration",
  },
  {
    id: "wash",
    n: "02",
    title: "Cleaning & washing",
    summary: "Unit A1 of the reference line.",
    detail:
      "The reference proposal lists a complete cleaning and washing unit. Its machine list is not itemised there, so scope is defined with the project.",
    products: [],
    image: { src: "/images/gallery/industrial-processing-hall-equipment-900.webp", alt: "Large blue processing machine in an industrial hall" },
    caption: "Facility photograph. Not a specific line configuration.",
  },
  {
    id: "dry",
    n: "03",
    title: "Drying",
    summary: "Unit B1 of the reference line.",
    detail:
      "A complete drying unit is part of the reference line. Dryer type and capacity are not itemised in the proposal and are set per project.",
    products: [],
    image: { src: "/images/gallery/multi-layer-belt-dryer-workshop.webp", alt: "Multi-layer belt dryer in a workshop" },
    caption: "Belt dryer shown for illustration. Type to be confirmed.",
  },
  {
    id: "grind",
    n: "04",
    title: "Grinding & milling",
    summary: "Unit C1 of the reference line.",
    detail:
      "The grinding unit combines breaking, roller milling and sifting, supported by pneumatic conveying, filtration and feeding equipment.",
    products: ["industrial-breaker", "pneumatic-roller-mill-spv-250x1000", "quadro-plansifter-ke-8x28", "super-sonic-filter-ssf-52x2400", "pneumatic-fan-pf-75"],
    image: { src: P("pneumatic-roller-mill-spv-250x1000"), alt: "Pneumatic roller mill" },
    caption: "Pneumatic roller mill SPV-250 x 1000",
  },
  {
    id: "pack",
    n: "05",
    title: "Packaging",
    summary: "Unit D1 of the reference line.",
    detail: "Finished flour is weighed and bagged in 25–50 kg units. The single-station machine is listed as an alternative item in the reference proposal.",
    products: ["flour-packaging-machine-25-50kg", "plc-control-panels"],
    image: { src: P("flour-packaging-machine-25-50kg"), alt: "Flour packaging machine" },
    caption: "Single-station flour packaging machine",
  },
];

// ---------------- Engineering & integration ----------------
export const ENGINEERING = [
  { t: "Equipment configuration", d: "Selecting and sizing machines for the product and throughput." },
  { t: "Processing line design", d: "A layout study that places machines and sets the capacity and efficiency target." },
  { t: "Material flow planning", d: "Product routes between stages, with flow and air piping sized to each duty." },
  { t: "Flow and air piping", d: "Connection pipes in different diameters, with clips, elbows and inspection pipes." },
  { t: "PLC wiring and control", d: "One panel for all machines, channelled wiring, alarms and motor protection." },
  { t: "Equipment installation requirements", d: "Positioning, fixing to the ground and connecting flow and air pipes." },
  { t: "Technical project coordination", d: "Keeping drawings, equipment data and site requirements aligned." },
];

export const WHY = [
  { t: "Requirement-Focused Solutions", d: "Each enquiry starts from your product, throughput and site, not from a catalogue." },
  { t: "Technical Equipment Information", d: "Specifications are taken from supplier documentation and flagged where they need confirmation." },
  { t: "Industrial Processing Focus", d: "Our attention stays on processing lines, machines and the systems around them." },
  { t: "International Business Coordination", d: "A USA-based contact for discussions that cross borders and time zones." },
  { t: "Integrated Project Planning", d: "Machines, piping, control and installation are considered together." },
  { t: "Professional Communication", d: "Clear questions, written follow-up and straightforward replies." },
];

// ---------------- Gallery (page 14 of the source PDF) ----------------
export type GalleryCat = "interiors" | "machinery" | "handling" | "lines" | "storage" | "installations" | "drying";
export const GALLERY_CATS: { id: GalleryCat; label: string }[] = [
  { id: "interiors", label: "Factory interiors" },
  { id: "machinery", label: "Agricultural processing machinery" },
  { id: "handling", label: "Material handling" },
  { id: "lines", label: "Processing lines" },
  { id: "storage", label: "Storage infrastructure" },
  { id: "installations", label: "Industrial installations" },
  { id: "drying", label: "Drying & handling equipment" },
];

export interface GalleryItem {
  file: string;
  w: number;
  h: number;
  caption: string;
  alt: string;
  cats: GalleryCat[];
  /** published in gallery. Near-duplicate chilli views are held back. */
  show: boolean;
  /** CSS aspect for tile */
  src?: string;
}

const G = (f: string) => `/images/gallery/${f}.webp`;
const GALLERY_RAW: Omit<GalleryItem, "src">[] = [
  { file: "industrial-processing-hall-equipment", w: 1298, h: 722, caption: "Processing equipment inside an industrial hall", alt: "Large blue machine with electric motors inside an industrial hall with overhead cranes", cats: ["interiors", "machinery", "lines", "installations"], show: true },
  { file: "factory-hall-inclined-conveyor-belt-dryer", w: 548, h: 412, caption: "Inclined conveyor feeding a belt dryer", alt: "Factory hall with an inclined conveyor feeding pale material onto a belt dryer", cats: ["interiors", "handling", "drying", "lines"], show: true },
  { file: "multi-layer-belt-dryer-industrial", w: 560, h: 412, caption: "Multi-layer belt dryer", alt: "Multi-layer belt dryer with orange and green end sections inside a steel-framed hall", cats: ["drying", "machinery", "installations"], show: true },
  { file: "grain-storage-silos-steel-towers", w: 536, h: 412, caption: "Steel storage silos and processing towers", alt: "Steel grain silos and processing towers against a blue sky", cats: ["storage", "installations"], show: true },
  { file: "hot-air-furnace-drying-unit-ducting", w: 540, h: 412, caption: "Hot-air unit with ducting for a drying line", alt: "Orange and yellow hot-air unit with large steel ducting beside a dryer", cats: ["drying", "installations"], show: true },
  { file: "chilli-on-belt-dryer", w: 560, h: 416, caption: "Red chilli on a belt-drying line", alt: "Red chilli peppers carried up a belt dryer conveyor", cats: ["drying", "handling", "lines"], show: true },
  { file: "bulk-material-pile-storage-towers", w: 576, h: 416, caption: "Bulk material stored beside steel towers", alt: "Pile of pale bulk material in front of a truck and twin storage towers", cats: ["storage", "handling"], show: true },
  { file: "factory-hall-dryer-installation", w: 540, h: 416, caption: "Dryer installation in a large hall", alt: "Wide empty factory hall with a dryer unit installed along the right wall", cats: ["interiors", "installations", "drying"], show: true },
  { file: "factory-hall-bulk-material-handling", w: 548, h: 424, caption: "Bulk material handled in a factory hall", alt: "Workers beside a pile of pale bulk material inside a steel-framed hall", cats: ["interiors", "handling", "storage"], show: true },
  { file: "inclined-conveyor-chilli-loading", w: 560, h: 424, caption: "Loading product onto an inclined conveyor", alt: "Inclined stainless conveyor carrying red chilli peppers from a loading area", cats: ["handling", "lines"], show: true },
  { file: "heat-pump-dryer-unit", w: 576, h: 424, caption: "Heat-pump dryer unit", alt: "Heat-pump dryer cabinet with red and white compressor section on a green floor", cats: ["drying", "machinery", "installations"], show: true },
  { file: "multi-layer-belt-dryer-workshop", w: 536, h: 424, caption: "Belt dryer during assembly", alt: "Green and orange multi-layer belt dryer with technicians at its side", cats: ["drying", "machinery", "interiors"], show: true },
  { file: "chilli-heaps-inclined-conveyor", w: 548, h: 416, caption: "Product heaps at the foot of an inclined conveyor", alt: "Heaps of red chilli at the foot of an inclined conveyor in a hall", cats: ["handling", "interiors"], show: false },
  { file: "chilli-conveyor-drying-line-feed", w: 576, h: 412, caption: "Feed end of a drying line", alt: "Red chilli on a conveyor at the feed end of a drying line", cats: ["handling", "drying"], show: false },
  { file: "chilli-piles-belt-line", w: 536, h: 416, caption: "Product piles beside a belt line", alt: "Piles of red chilli beside a belt line", cats: ["handling"], show: false },
  { file: "chilli-on-conveyor-belt", w: 540, h: 424, caption: "Product on a conveyor belt", alt: "Red chilli on a conveyor belt", cats: ["handling"], show: false },
];
export const GALLERY: GalleryItem[] = GALLERY_RAW.map((g) => ({ ...g, src: G(g.file) }));

// ---------------- Countries (for the enquiry form) ----------------
export const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Republic)","Congo (Democratic Republic)","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","São Tomé and Príncipe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Türkiye","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe","Other",
];

export const INDUSTRIES = [
  "Agriculture / agro-processing",
  "Food processing",
  "Flour milling",
  "Construction and infrastructure",
  "Engineering / EPC contractor",
  "Trading and distribution",
  "Government or public sector",
  "Other",
];

export const TIMELINES = [
  "Immediate (within 3 months)",
  "3–6 months",
  "6–12 months",
  "More than 12 months",
  "Information gathering only",
];
