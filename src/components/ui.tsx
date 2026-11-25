import type { ReactNode } from "react";

// Inline icon set (Lucide-style geometry, hand-authored: the lucide package could not be installed offline).
const ICONS: Record<string, string> = {
  "arrow-right": "M5 12h14 M13 6l6 6-6 6",
  "arrow-up": "M12 19V5 M6 11l6-6 6 6",
  "arrow-down": "M12 5v14 M6 13l6 6 6-6",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-left": "M15 6l-6 6 6 6",
  "chevron-right": "M9 6l6 6-6 6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  "map-pin": "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  x: "M6 6l12 12 M18 6L6 18",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-4.3-4.3",
  plus: "M12 5v14 M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.8 3 2.8 15 0 18 M12 3c-2.8 3-2.8 15 0 18",
  sliders: "M4 7h10 M18 7h2 M4 17h2 M10 17h10 M14 4v6 M6 14v6",
  sprout: "M12 21v-8 M12 13c0-4 3-6 7-6 0 4-3 6-7 6z M12 15c0-3-2-5-6-5 0 3 2 5 6 5z",
  factory: "M3 21V10l6 3V10l6 3V6h3v15z M3 21h18",
  wind: "M3 9h11a3 3 0 1 0-3-3 M3 15h15a3 3 0 1 1-3 3 M3 12h8",
  package: "M3 8l9-5 9 5v8l-9 5-9-5z M3 8l9 5 9-5 M12 13v8",
  cpu: "M7 7h10v10H7z M10 3v4 M14 3v4 M10 17v4 M14 17v4 M3 10h4 M3 14h4 M17 10h4 M17 14h4",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M8 17h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8",
  ruler: "M3 17L17 3l4 4L7 21z M7 13l2 2 M10 10l2 2 M13 7l2 2",
  layers: "M12 3l9 5-9 5-9-5z M3 12.5l9 5 9-5",
  clipboard: "M9 4h6v3H9z M7 5H5v16h14V5h-2 M9 12h6 M9 16h4",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2 20a7 7 0 0 1 14 0 M17 4.5a3.5 3.5 0 0 1 0 6.6 M18 14a6 6 0 0 1 4 6",
  message: "M4 5h16v11H9l-5 4z",
  file: "M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 16h6",
  "zoom-in": "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-4.3-4.3 M11 8v6 M8 11h6",
  trash: "M4 7h16 M9 7V4h6v3 M6 7l1 14h10l1-14",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2",
  paperclip: "M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7",
  cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z",
  list: "M8 6h13 M8 12h13 M8 18h13 M3.5 6h.01 M3.5 12h.01 M3.5 18h.01",
};

export function Icon({ name, size = 20, className = "" }: { name: keyof typeof ICONS | string; size?: number; className?: string }) {
  const d = ICONS[name] ?? ICONS.check;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={(i ? "M" : "") + seg} />
      ))}
    </svg>
  );
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "navy" | "ghost" | "ghost-light" | "light" | "link";
  icon?: string;
  className?: string;
  size?: "md" | "lg" | "sm";
};

export function Btn({ href, children, variant = "primary", icon, className = "", size = "md" }: BtnProps) {
  return (
    <a href={href} className={`btn btn--${variant} btn--${size} ${className}`}>
      <span>{children}</span>
      {icon ? <Icon name={icon} size={size === "sm" ? 16 : 18} /> : null}
    </a>
  );
}

export function Eyebrow({ children, light = false, num }: { children: ReactNode; light?: boolean; num?: string }) {
  return (
    <p className={`eyebrow ${light ? "eyebrow--light" : ""}`}>
      {num ? <span className="eyebrow__num">{num}</span> : null}
      {children}
    </p>
  );
}

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  return (
    <nav className={`crumbs ${light ? "crumbs--light" : ""}`} aria-label="Breadcrumb">
      <ol>
        {items.map((c, i) => (
          <li key={i}>
            {c.href && i < items.length - 1 ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  title,
  lead,
  crumbs,
  eyebrow,
  image,
  imageAlt,
  children,
}: {
  title: string;
  lead?: string;
  crumbs: Crumb[];
  eyebrow?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-hero">
      <div className="page-hero__grid" aria-hidden="true" />
      <div className="container page-hero__inner">
        <div className="page-hero__text">
          <Breadcrumbs items={crumbs} light />
          {eyebrow ? <Eyebrow light>{eyebrow}</Eyebrow> : null}
          <h1>{title}</h1>
          {lead ? <p className="lead">{lead}</p> : null}
          {children}
        </div>
        {image ? (
          <div className="page-hero__media">
            <img src={image} alt={imageAlt ?? ""} loading="eager" decoding="async" />
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function SectionHead({
  eyebrow,
  num,
  title,
  lead,
  light = false,
  className = "",
}: {
  eyebrow?: string;
  num?: string;
  title: string;
  lead?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`section-head ${className}`}>
      {eyebrow ? <Eyebrow light={light} num={num}>{eyebrow}</Eyebrow> : null}
      <h2>{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}
