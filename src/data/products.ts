// Product catalogue. Source of truth: TGG Group proforma, pages 2–8.
// RULES
//  * Specifications are transcribed from the PDF. European decimal/thousand separators are
//    normalised to US format (documented in docs/SPEC_REVIEW_FLAGS.md) — nothing else is altered.
//  * A spec with `review` set is HELD BACK from public pages (see PUBLISH_UNREVIEWED_SPECS) and
//    listed in docs/SPEC_REVIEW_FLAGS.md for technical sign-off.
//  * No prices, quantities, payment or banking data are stored here.
//  * To add machinery: append one object to PRODUCTS. Pages, filters, sitemap and schema follow.

export type CategoryId =
  | "conveying"
  | "milling"
  | "cleaning"
  | "feeding"
  | "pneumatic"
  | "packaging"
  | "controls";

export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "conveying", label: "Conveying & Elevating", blurb: "Screw conveyors and bucket elevators for moving product through the line." },
  { id: "milling", label: "Milling & Size Reduction", blurb: "Breaking, germ separation, roller milling and sifting." },
  { id: "cleaning", label: "Cleaning & Separation", blurb: "Removal of lighter material and dust from product." },
  { id: "feeding", label: "Feeding & Discharge", blurb: "Controlled feeding and even discharge of product." },
  { id: "pneumatic", label: "Pneumatic & Filtration", blurb: "Fans, blowers, cyclones, filters and air locks for air-handled lines." },
  { id: "packaging", label: "Packaging & Weighing", blurb: "Weighing and bagging of finished flour." },
  { id: "controls", label: "Control Systems", blurb: "Central PLC control and wiring." },
];

export interface Spec {
  label: string;
  value: string;
  /** Reason the figure is withheld pending technical review. */
  review?: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  model?: string;
  short: string;
  overview: string;
  applications: string[];
  specs: Spec[];
  features: string[];
  image: string;
  imageAlt: string;
  extraImages?: { src: string; alt: string }[];
  related: string[];
  solutions: string[];
  /** Show in the homepage machinery preview (the 17 items named in the brief). */
  home: boolean;
  /** Internal: PDF item code(s) for audit. Never rendered. */
  pdfRef: string;
  /** Internal notes surfaced in docs/SPEC_REVIEW_FLAGS.md. Never rendered. */
  flags?: string[];
}

const img = (f: string) => `/images/products/${f}.webp`;

export const PRODUCTS: Product[] = [
  {
    slug: "flour-conveyor-vh-200",
    name: "Flour Conveyor",
    category: "conveying",
    model: "VH-200",
    short: "Screw conveyor for moving flour between machines in a processing line.",
    overview:
      "The VH-200 is a 200 mm screw conveyor with a pressed sheet-metal casing, listed in the reference configuration at 10–15 tons per hour of flour. Spiral, inner pipe and bearing details follow the supplier specification below. Conveyor length depends on the plant layout.",
    applications: ["Flour transfer between machines in a processing line", "Connecting milling, sifting and packaging stages"],
    specs: [
      { label: "Model", value: "VH-200" },
      { label: "Motor", value: "5.5 kW, 100 rpm" },
      { label: "Capacity", value: "10–15 tons/hour of flour" },
      { label: "Screw diameter", value: "200 mm (cold drawn)" },
      { label: "Pitch", value: "200 mm" },
      { label: "Inner spiral pipe diameter", value: "60 mm" },
      { label: "Spiral casing", value: "2 mm pressed sheet metal" },
      { label: "Upper cap", value: "1 mm sheet metal" },
      { label: "Internal bearing", value: "Level adjustable, Derlin bush Ø 60 mm" },
      { label: "Bearing", value: "UCF 208" },
      { label: "Length", value: "Configuration-specific" },
    ],
    features: [
      "Cold-drawn spiral, 200 mm diameter and 200 mm pitch",
      "Level-adjustable internal bearing with Derlin bush",
      "Pressed sheet-metal casing with lighter upper cap",
    ],
    image: img("flour-conveyor-vh-200"),
    imageAlt: "VH-200 flour screw conveyor with green geared motor and white pressed-steel casing",
    related: ["bucket-elevator-kel-20x20", "rotoflow-rw-60", "flour-packaging-machine-25-50kg"],
    solutions: ["material-handling", "cassava-processing", "flour-milling-grinding"],
    home: true,
    pdfRef: "B5, B6, B8",
    flags: [
      "Three conveyors are listed (13.5 m, 3.5 m, 3.5 m). Length is shown as 'Configuration-specific'.",
    ],
  },
  {
    slug: "bucket-elevator-kel-20x20",
    name: "Bucket Elevator",
    category: "conveying",
    model: "KEL-20x20",
    short: "Dust-isolated elevator for vertical transport of product.",
    overview:
      "The KEL-20x20 bucket elevator carries product vertically. The reference configuration lists a 25 m height with a 3 kW drive. Enclosed construction isolates dust, and inspection covers allow product flow to be checked.",
    applications: ["Vertical transport of product between process stages"],
    specs: [
      { label: "Model", value: "KEL-20x20" },
      { label: "Motor", value: "3 kW, 100 rpm" },
      { label: "Height", value: "25 m" },
      { label: "Elevator pipe", value: "20x20" },
      { label: "Upper and lower caps", value: "4 mm sheet metal" },
      { label: "Belt / bucket quantities", value: "—", review: "Source lists 'Elevator Belt: 180 no.' and 'Elevator Bucket: 160 no.'; the meaning of the belt figure is unclear." },
      { label: "Capacity", value: "—", review: "Source states '8 ton/h Wheat' for a cassava flour line, and it does not match the 10–15 t/h flour conveyors in the same configuration." },
    ],
    features: [
      "Dust-isolated housing",
      "Control covers for checking product flow",
      "Motor connection suitable for coupling or sprocket",
      "Portable upper caps that can be positioned in any direction",
      "Belt tightening through the lower-cap bearings",
    ],
    image: img("bucket-elevator-kel-20x20"),
    imageAlt: "KEL-20x20 bucket elevator, tall white vertical housing with inspection covers",
    related: ["flour-conveyor-vh-200", "rotoflow-rw-60", "vibro-separator-rt-100"],
    solutions: ["material-handling", "cassava-processing"],
    home: true,
    pdfRef: "B7, C1",
    flags: [
      "Capacity '8 ton/h Wheat' conflicts with the flour line capacity; withheld.",
      "'Elevator Belt: 180 no.' and 'Elevator Bucket: 160 no.' unclear; withheld.",
      "'Table and motor can be used in both directions' — unclear wording; omitted from features.",
    ],
  },
  {
    slug: "industrial-breaker",
    name: "Industrial Breaker",
    category: "milling",
    short: "Dual-rotation breaker with a quick-change hammer and sieve system.",
    overview:
      "A hammer-type breaker with dual rotation and a hammer and sieve system designed for easy changeover. Hammers and bars are heat-treated for hardness.",
    applications: ["Size reduction ahead of milling in a flour processing line"],
    specs: [
      { label: "Rotation", value: "Dual" },
      { label: "Body", value: "4–6 mm St-37" },
      { label: "Rotor", value: "8 mm St-37" },
      { label: "Hammers and bars", value: "Hardened, heat-treated" },
      { label: "Knives", value: "—", review: "Source reads '6mm Hatdox Knives'; the material name appears to be misspelt, so it is not published until confirmed." },
      { label: "Model / capacity / motor", value: "—", review: "Not stated in the source." },
    ],
    features: ["Dual rotation", "Easy-to-change hammer and sieve system", "Hardened, heat-treated hammers and bars"],
    image: img("industrial-breaker-hammer-system"),
    imageAlt: "Industrial breaker with orange hammer housing, electric motor and white steel base frame",
    related: ["degerminator", "pneumatic-roller-mill-spv-250x1000", "quadro-plansifter-ke-8x28"],
    solutions: ["flour-milling-grinding", "agricultural-processing-equipment"],
    home: true,
    pdfRef: "B9",
    flags: ["'Hatdox' (probably Hardox) – withheld.", "Source wording 'Body Sadi' / 'Rotor Saji' is unclear; published as body/rotor material only."],
  },
  {
    slug: "degerminator",
    name: "Degerminator",
    category: "milling",
    short: "Separates germ material from corn and cereals with a steady product flow.",
    overview:
      "The supplier describes the degerminator as used to separate germ material in corn cereals, with constant product flow on a quiet machine. Suitability for a cassava flour configuration needs technical confirmation.",
    applications: ["Separating germ material in corn and other cereals"],
    specs: [{ label: "Model / motor / capacity", value: "—", review: "Not stated in the source." }],
    features: ["Constant product flow", "Quiet operation"],
    image: img("degerminator-cereal-germ-separator"),
    imageAlt: "Degerminator machine with yellow guard, small control head and white frame",
    related: ["industrial-breaker", "pneumatic-roller-mill-spv-250x1000", "vibro-separator-rt-100"],
    solutions: ["flour-milling-grinding", "agricultural-processing-equipment"],
    home: true,
    pdfRef: "B10",
    flags: [
      "Described for corn cereals ('ruseym' = germ in Turkish). Suitability for cassava to be confirmed by engineering.",
      "No model, motor or capacity stated.",
    ],
  },
  {
    slug: "vibro-separator-rt-100",
    name: "Vibro Separator",
    category: "cleaning",
    model: "RT-100",
    short: "Removes lower-density material from grain using an internal fan and eccentric motion.",
    overview:
      "The RT-100 vibro separator removes lower-density material from grain. It draws air from an internal fan system, clears captured dust with an internal piston, and spreads incoming product by eccentric motion.",
    applications: ["Removing lower-density material from grain ahead of milling"],
    specs: [
      { label: "Model", value: "RT-100" },
      { label: "Capacity", value: "15 tons/hour" },
      { label: "Motor", value: "0.55 kW, 250 rpm" },
      { label: "Body", value: "4 mm sheet metal" },
    ],
    features: [
      "Internal fan system supplies the air requirement",
      "Internal piston removes captured dust",
      "Eccentric motion spreads incoming product",
    ],
    image: img("vibro-separator-rt-100"),
    imageAlt: "RT-100 vibro separator, white cabinet machine with orange side cover and control window",
    related: ["aspirator-asp", "vibrator", "degerminator"],
    solutions: ["agricultural-processing-equipment", "flour-milling-grinding", "cassava-processing"],
    home: true,
    pdfRef: "B11, C11 ('Vibro Tarar')",
    flags: [
      "Items B11 ('Vibro Separator') and C11 ('Vibro Tarar') share type RT-100 and identical specifications; treated as one product.",
      "Described for grain / wheat; basis for the 15 t/h figure not stated.",
    ],
  },
  {
    slug: "roller-mill-store",
    name: "Roller Mill Store",
    category: "feeding",
    model: "500 kg",
    short: "Hopper that feeds product to a roller mill passage in proportion.",
    overview:
      "A 500 kg store for proportional feeding of product to a roller mill passage. Sensors on the store start and stop the connected machines.",
    applications: ["Proportional feeding of a roller mill passage"],
    specs: [
      { label: "Type", value: "500 kg" },
      { label: "Control", value: "Level sensors start and stop connected machines" },
    ],
    features: ["Proportional feeding", "Sensor-based start/stop of connected machines"],
    image: img("roller-mill-store-feeding-hopper"),
    imageAlt: "White conical roller mill store hopper with a small inspection window",
    related: ["pneumatic-roller-mill-spv-250x1000", "vibrator", "rotoflow-rw-60"],
    solutions: ["flour-milling-grinding"],
    home: false,
    pdfRef: "C2",
    flags: ["Source names it 'B1 Roller Mill Store'; 'B1' is a mill passage reference in the original layout."],
  },
  {
    slug: "super-sonic-filter-ssf-52x2400",
    name: "Super Sonic Filter",
    category: "pneumatic",
    model: "SSF-52 x 2400",
    short: "Bag filter for dusty air, usable in pressurised and vacuum systems.",
    overview:
      "The SSF-52 x 2400 is a bag filter with electronic control for dusty air. It can be used in pressurised and vacuum systems, and the supplier lists a cleaning efficiency of 99.98%.",
    applications: ["Dust filtration in pneumatic conveying and aspiration systems"],
    specs: [
      { label: "Model", value: "SSF-52 x 2400" },
      { label: "Bag diameter", value: "120 mm" },
      { label: "Airflow range", value: "2.5–800 m³/min (as stated for the filter type)" },
      { label: "Body", value: "5 mm sheet metal" },
      { label: "Cleaning efficiency", value: "99.98%" },
      { label: "Supplied with", value: "Filter brain, clamps, filter bags, filter wire" },
    ],
    features: ["Electronic control system", "Suitable for pressurised and vacuum systems"],
    image: img("super-sonic-filter-ssf-52x2400"),
    imageAlt: "Super Sonic Filter SSF-52 bag filter housing with green access panel and conical hopper outlet",
    related: ["blower-pump-bp-50-lt", "rotoflow-rw-60", "pneumatic-cyclone-group"],
    solutions: ["pneumatic-filtration"],
    home: true,
    pdfRef: "C3",
    flags: ["Airflow range 2.5–800 m³/min describes the filter family; the airflow of this unit is not given."],
  },
  {
    slug: "rotoflow-rw-60",
    name: "Rotoflow",
    category: "pneumatic",
    model: "RW-60",
    short: "Vibrating discharge unit for silos and filters.",
    overview:
      "The RW-60 Rotoflow discharges product from a silo or filter. It works by vibration, and its internal surfaces are epoxy-coated to ease product flow.",
    applications: ["Discharge of product from silos and filters"],
    specs: [
      { label: "Model", value: "RW-60" },
      { label: "Motor", value: "0.18 kW, 900 rpm" },
      { label: "Body", value: "4 mm metal" },
      { label: "Internal surfaces", value: "Epoxy paint" },
    ],
    features: [
      "Vibration-assisted discharge",
      "Epoxy-coated interior for easier flow",
      "Outlet adjusted for tube-spiral connection to the ejector outlet",
      "Manufactured with respect to the product handled",
    ],
    image: img("rotoflow-rw-60-discharge-unit"),
    imageAlt: "Rotoflow RW-60 discharge unit, white circular hopper with green and copper-coloured bands",
    related: ["super-sonic-filter-ssf-52x2400", "air-lock-hvk-240", "flour-conveyor-vh-200"],
    solutions: ["pneumatic-filtration", "material-handling"],
    home: true,
    pdfRef: "C4",
  },
  {
    slug: "blower-pump-bp-50-lt",
    name: "Blower Pump",
    category: "pneumatic",
    model: "BP-50 LT",
    short: "Complete blower set for filter-bag shaking and conveying low-density products.",
    overview:
      "The BP-50 LT arrives with blower, filter, muffler and safety valve fitted, and can be dismounted easily. It is used for shaking filter bags and for vertical and horizontal transport of low-density products such as flour, bran and semolina.",
    applications: ["Shaking filter bags", "Vertical and horizontal transport of flour, bran and semolina"],
    specs: [
      { label: "Model", value: "BP-50 LT" },
      { label: "Motor", value: "4 kW, 1500 rpm" },
      { label: "Included", value: "Blower, filter, muffler, safety valve" },
    ],
    features: ["Supplied ready, with blower, filter, muffler and safety valve", "Easily dismounted"],
    image: img("blower-pump-bp-50-lt"),
    imageAlt: "BP-50 LT blower pump set on a white frame with green blower casing and motor",
    related: ["super-sonic-filter-ssf-52x2400", "pneumatic-fan-pf-75", "air-lock-feeder-eklus"],
    solutions: ["pneumatic-filtration"],
    home: true,
    pdfRef: "C5",
  },
  {
    slug: "air-lock-feeder-eklus",
    name: "Air Lock Feeder (Eklüs)",
    category: "pneumatic",
    short: "Feeds granular and ground product into pressurised air conveying.",
    overview:
      "The supplier describes this unit as feeding cereals, both granular and ground, in a form suitable for conveying by air under pressure.",
    applications: ["Feeding product into pressurised pneumatic conveying lines"],
    specs: [{ label: "Model / motor", value: "—", review: "Not stated in the source." }],
    features: ["Suitable for both granular and ground product"],
    image: img("air-lock-feeder-pneumatic-conveying"),
    imageAlt: "Air lock feeder with teal hopper, white rotary valve body and blue gear motor",
    related: ["air-lock-hvk-240", "blower-pump-bp-50-lt", "pneumatic-cyclone-group"],
    solutions: ["pneumatic-filtration", "material-handling"],
    home: false,
    pdfRef: "C6",
    flags: ["Source name 'Eklüs'. 'Air lock feeder' is our reading of the described function; confirm."],
  },
  {
    slug: "aspirator-asp",
    name: "Aspirator",
    category: "pneumatic",
    model: "ASP",
    short: "Fan unit that provides air to cleaning machines.",
    overview: "The ASP aspirator provides air to the cleaning machines in the line. It is motor-coupled, with a 4 mm sheet-metal body.",
    applications: ["Supplying air to cleaning and separation machines"],
    specs: [
      { label: "Type", value: "ASP" },
      { label: "Motor", value: "15 kW, 1500 rpm" },
      { label: "Air volume", value: "320 m³/min" },
      { label: "Body", value: "4 mm sheet metal" },
      { label: "Drive", value: "Coupled with motor" },
    ],
    features: ["Direct motor coupling", "Provides air for cleaning machines"],
    image: img("aspirator-asp-industrial-fan"),
    imageAlt: "ASP aspirator fan with green inlet ring on a white spiral housing",
    related: ["vibro-separator-rt-100", "pneumatic-fan-pf-75", "pneumatic-cyclone-group"],
    solutions: ["pneumatic-filtration", "agricultural-processing-equipment"],
    home: true,
    pdfRef: "C7",
  },
  {
    slug: "pneumatic-cyclone-group",
    name: "Pneumatic Cyclone Group",
    category: "pneumatic",
    short: "Set of cyclones, collector pipes and air valves for air-handled product.",
    overview:
      "A set that brings together cyclones, collector pipes, elbows and steel pipes in various diameters, inspection windows and air-adjusting valves for a pneumatic line.",
    applications: ["Separating product from conveying air in a pneumatic line"],
    specs: [
      {
        label: "Scope of set",
        value: "Collector pipes; pneumatic cyclones; elbows and steel pipes in various diameters; control windows and muffs; pneumatic air-adjusting valves",
      },
    ],
    features: ["Supplied as a set", "Control windows for visual checks", "Air-adjusting valves"],
    image: img("pneumatic-cyclone-group"),
    imageAlt: "Pneumatic cyclone with elbow outlet pipe above a green rotary air lock",
    related: ["air-lock-hvk-240", "super-sonic-filter-ssf-52x2400", "pneumatic-fan-pf-75"],
    solutions: ["pneumatic-filtration"],
    home: true,
    pdfRef: "C8 (1 set)",
    flags: ["Source also lists 'Stove and pipe injectors' and 'Air lock tables' — translation unclear; omitted."],
  },
  {
    slug: "air-lock-hvk-240",
    name: "Air Lock",
    category: "pneumatic",
    model: "HVK-240 + 220",
    short: "Cast-iron rotary air breaker for pneumatic systems.",
    overview: "The HVK-240 + 220 acts as an air breaker in pneumatic systems and has a cast-iron body.",
    applications: ["Air breaking at product discharge points in pneumatic lines"],
    specs: [
      { label: "Type", value: "HVK-240 + 220" },
      { label: "Motor", value: "6 × 2.2 kW, 63 rpm (as stated)" },
      { label: "Body", value: "Cast iron" },
    ],
    features: ["Cast-iron body", "Air breaker function"],
    image: img("air-lock-hvk-240-rotary-valve"),
    imageAlt: "Green rotary air lock valve with gear motor, shown beneath a pneumatic cyclone",
    related: ["pneumatic-cyclone-group", "air-lock-feeder-eklus", "rotoflow-rw-60"],
    solutions: ["pneumatic-filtration"],
    home: true,
    pdfRef: "C9",
    flags: [
      "Photograph is a crop of the shared cyclone-group/air-lock picture (C8/C9).",
      "'6 x 2,2 Kw – 63 rpm' for a single type; number of motors vs units to be confirmed.",
    ],
  },
  {
    slug: "pneumatic-fan-pf-75",
    name: "Pneumatic Fan",
    category: "pneumatic",
    model: "PF-75",
    short: "Vibration-isolated, balanced fan for pneumatic conveying.",
    overview:
      "The PF-75 is a 75 kW fan mounted on a chassis with a steel cage on rubber feet to limit vibration. It is statically and dynamically balanced for low noise, and rubber flanges at inlet and outlet stop vibration passing into the pipework.",
    applications: ["Air supply for pneumatic conveying lines"],
    specs: [
      { label: "Model", value: "PF-75" },
      { label: "Motor", value: "75 kW, 3000 rpm" },
      { label: "Air volume", value: "20,000 m³/h (source format: 20.000 m³/H)" },
      { label: "Body", value: "4 mm metal" },
    ],
    features: [
      "Chassis with steel cage on rubber feet",
      "Static and dynamic balancing for low noise",
      "Rubber flanges at inlet and outlet connections",
    ],
    image: img("pneumatic-fan-pf-75"),
    imageAlt: "PF-75 pneumatic fan with green inlet cone, white volute housing and large electric motor",
    related: ["aspirator-asp", "blower-pump-bp-50-lt", "pneumatic-cyclone-group"],
    solutions: ["pneumatic-filtration"],
    home: true,
    pdfRef: "C10",
    flags: ["Air volume written '20.000 m³/H' (European thousands separator); shown as 20,000 m³/h — confirm."],
  },
  {
    slug: "vibrator",
    name: "Vibrator",
    category: "feeding",
    short: "Small vibrating unit for even product discharge and returning material for re-grinding.",
    overview:
      "A vibration unit used to discharge product evenly and to return raw material to a roller machine for repeat grinding. It runs at a uniform speed.",
    applications: ["Even product discharge", "Returning material to a roller machine for re-grinding"],
    specs: [{ label: "Engine power", value: "0.08 kW (vibro)" }],
    features: ["Uniform-speed operation", "Even discharge of product"],
    image: img("vibrator-vibro-discharge-unit"),
    imageAlt: "Vibrating discharge unit with a white hopper above a small control display",
    related: ["roller-mill-store", "pneumatic-roller-mill-spv-250x1000", "vibro-separator-rt-100"],
    solutions: ["flour-milling-grinding", "material-handling"],
    home: true,
    pdfRef: "C12",
    flags: ["Photograph is very small in the source (91 × 163 px)."],
  },
  {
    slug: "quadro-plansifter-ke-8x28",
    name: "Quadro Plansifter",
    category: "milling",
    model: "KE 8 x 28",
    short: "High-capacity plansifter for grading ground product.",
    overview:
      "A multi-passage plansifter for high-capacity sifting at grain plants. Frame types can be changed to adjust how ground product is classified, and the internal structure is built to sanitary conditions with smooth walls that resist build-up.",
    applications: ["High-capacity sifting at grain and flour plants", "Classification of ground product"],
    specs: [
      { label: "Type", value: "KE, item 8 x 28" },
      { label: "Number of passages", value: "8" },
      { label: "Sieves per passage", value: "—", review: "Source gives 28 sieves per passage but also says each passage can take up to 24 frames." },
      { label: "Sieve cloth", value: "—", review: "Source reads 'Sweden clothes are used'; wording unclear." },
      { label: "Outlet bag", value: "Ø 120 mm" },
      { label: "Inlet bag", value: "Ø 200 mm" },
      { label: "Bearings", value: "FAG or SKF" },
      { label: "Construction", value: "A1 quality sheet metal" },
      { label: "Motor", value: "5.5 kW, 1000 rpm, with flange" },
    ],
    features: [
      "Press equipment for compressing the screen frames",
      "Sealed separation between screens",
      "Frames can be removed easily",
      "Centrifugal force adjustable with weights",
      "Sanitary internal structure with smooth walls",
    ],
    image: img("quadro-plansifter-ke-8x28"),
    imageAlt: "Quadro plansifter, tall white cabinet with green panel edges and multiple access doors",
    related: ["pneumatic-roller-mill-spv-250x1000", "industrial-breaker", "flour-conveyor-vh-200"],
    solutions: ["flour-milling-grinding", "cassava-processing"],
    home: true,
    pdfRef: "C16",
    flags: [
      "28 sieves per passage vs 'up to 24 frames' per passage — contradictory; both withheld.",
      "'Sweden clothes' unclear; withheld.",
      "'Two inlets and two passages for each passage can be used' is garbled; omitted.",
      "Intended for grain plants; suitability for cassava flour to be confirmed.",
    ],
  },
  {
    slug: "pneumatic-roller-mill-spv-250x1000",
    name: "Pneumatic Roller Mill",
    category: "milling",
    model: "SPV-250 x 1000",
    short: "Roller mill with pneumatic roll control and automatic roll cleaning.",
    overview:
      "The SPV-250 x 1000 has a welded steel body and balanced, parallel rollers. Roll opening and closing are controlled pneumatically, and the rollers are cleaned automatically by control brushes.",
    applications: ["Grinding stage of a flour processing line"],
    specs: [
      { label: "Type", value: "SPV-250 x 1000" },
      { label: "Rolls", value: "Steel" },
      { label: "Body", value: "Welded steel plate, 2–8 mm" },
      { label: "Reducer", value: "2 × 0.75 kW" },
      { label: "Bearings", value: "FAG or SKF" },
    ],
    features: [
      "Welded steel body with minimum vibration",
      "Balanced rollers placed parallel",
      "Pneumatic opening and closing of rollers",
      "Manual roller adjustment by two levers and a pointer",
      "Pneumatically controlled product flow to the rollers",
      "Inspection cover for foreign bodies",
      "Automatic roll cleaning by control brushes",
    ],
    image: img("pneumatic-roller-mill-spv-250x1000"),
    imageAlt: "SPV-250 pneumatic roller mill, silver and blue cabinet with a glass feed column on top",
    related: ["quadro-plansifter-ke-8x28", "roller-mill-store", "vibrator"],
    solutions: ["flour-milling-grinding", "cassava-processing"],
    home: true,
    pdfRef: "C17",
    flags: [
      "'Grainers are made of steel' read as rolls; confirm.",
      "Source describes wheat flow to the rollers; suitability for cassava flour to be confirmed.",
    ],
  },
  {
    slug: "flour-packaging-machine-25-50kg",
    name: "Flour Packaging Machine",
    category: "packaging",
    model: "Single station, 25–50 kg",
    short: "Single-station weighing and bagging machine for 25–50 kg bags of flour.",
    overview:
      "A single-weigher, single-station packaging machine for flour in 25–50 kg bags, with an output of 8,750–15,000 kg/hour. A 1,953-litre upper bunker feeds a weighing pan, and contact parts are steel alloy with RAL 7035 paint.",
    applications: ["Bagging finished flour in 25–50 kg units"],
    specs: [
      { label: "Bulk material", value: "Flour" },
      { label: "Weighing range", value: "25–50 kg" },
      { label: "Maximum", value: "55 kg" },
      { label: "Screen resolution", value: "1 / 60,000" },
      { label: "Indicator resolution", value: "20 bit" },
      { label: "Sensitivity", value: "0.001–0.003" },
      { label: "Upper bunker capacity", value: "1,953 L" },
      { label: "Balance pan capacity", value: "100 L" },
      { label: "Output capacity", value: "8,750–15,000 kg/hour" },
      { label: "Bags per hour", value: "350–300 units/hour across the 25–50 kg range" },
      { label: "Contact parts", value: "Steel alloy, RAL 7035 paint" },
      { label: "Electrical supply", value: "400 V AC, 50–60 Hz, +10% / −12%" },
      { label: "Protection", value: "IP 54" },
      { label: "Aeration", value: "6 m³/min at 0.01 bar negative pressure (optional)" },
      { label: "Bulk density", value: "—", review: "Source gives '0,55 kg/m3', which is not a plausible flour density in that unit." },
      { label: "Power consumption", value: "—", review: "Source gives '6,5 kW / hour'; the unit is wrong for a power rating." },
      { label: "Compressed air", value: "—", review: "Source gives '8 NL / 5-6 Bar'; the flow unit is unclear." },
    ],
    features: ["Single weighing, single station", "Steel-alloy contact parts", "Optional aeration"],
    image: img("flour-packaging-machine-25-50kg"),
    imageAlt: "Single-station flour packaging machine with upper bunker, weighing pan and blue-railed platform",
    related: ["plc-control-panels", "flour-conveyor-vh-200", "quadro-plansifter-ke-8x28"],
    solutions: ["automation-packaging", "cassava-processing"],
    home: true,
    pdfRef: "C18 (marked 'ALT')",
    flags: [
      "Item is marked 'ALT' in the source (alternative / optional?). Confirm it is part of the quoted line.",
      "Density, power-consumption and compressed-air figures withheld (unit errors).",
      "Output 8.750–15.000 kg/hour shown as 8,750–15,000 kg/hour (European separators).",
    ],
  },
  {
    slug: "plc-control-panels",
    name: "PLC Control Panels",
    category: "controls",
    short: "Central panel that controls every machine in the line, with alarms and power protection.",
    overview:
      "Control of all machines is collected in one panel, from which commands are sent to each machine. Wiring between panel and machines runs in channels, and all panel equipment is installed. Power is cut automatically on a supply change to protect motors, and an alarm system signals failures.",
    applications: ["Central control of a complete processing line"],
    specs: [
      { label: "Architecture", value: "Single central panel for all machines" },
      { label: "Wiring", value: "Between panel and machines, in channels" },
      { label: "Protection", value: "Automatic power cut on supply change" },
      { label: "Alarm", value: "Failure alarm system" },
    ],
    features: [
      "One panel for all machine commands",
      "Channelled wiring between panel and machines",
      "Panel equipment fully installed",
      "Motor protection on power change",
      "Failure alarm system",
    ],
    image: img("plc-control-panel-cabinet"),
    imageAlt: "Row of white PLC control cabinets with front indicator panels",
    extraImages: [
      { src: img("plc-control-panel-motor-cabinets"), alt: "Open motor control cabinets showing internal switchgear" },
    ],
    related: ["flour-packaging-machine-25-50kg", "blower-pump-bp-50-lt", "pneumatic-fan-pf-75"],
    solutions: ["automation-packaging", "cassava-processing"],
    home: true,
    pdfRef: "G3",
    flags: ["Controller make, I/O count and panel dimensions are not given."],
  },
];

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const categoryLabel = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!.label;
