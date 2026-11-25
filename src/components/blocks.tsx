import { PRODUCTS, CATEGORIES, categoryLabel, bySlug, type Product } from "../data/products";
import { SOLUTIONS, STAGES, GALLERY, GALLERY_CATS, COUNTRIES, INDUSTRIES, TIMELINES } from "../data/content";
import { PUBLISH_UNREVIEWED_SPECS, IMAGE_SOURCE, SITE } from "../lib/config";
import { dotPath, project, MAP } from "../lib/worldmap";
import { Icon } from "./ui";

export const visibleSpecs = (p: Product) =>
  p.specs.filter((s) => PUBLISH_UNREVIEWED_SPECS || !s.review).filter((s) => s.value !== "—");

const keySpecs = (p: Product) =>
  visibleSpecs(p)
    .filter((s) => !["Model", "Type", "Scope of set", "Architecture", "Bulk material", "Rotation"].includes(s.label))
    .slice(0, 3);

export const productLabel = (p: Product) => (p.model ? `${p.name} (${p.model})` : p.name);

// ------------------------------------------------------------------ product card
export function ProductCard({ p, lazy = true }: { p: Product; lazy?: boolean }) {
  const href = `/products/${p.slug}/`;
  const search = [p.name, p.model, p.short, categoryLabel(p.category), ...p.applications].join(" ").toLowerCase();
  return (
    <article className="pcard" data-category={p.category} data-search={search}>
      <a className="pcard__media" href={href} tabIndex={-1} aria-hidden="true">
        <img src={p.image} alt="" loading={lazy ? "lazy" : "eager"} decoding="async" />
      </a>
      <div className="pcard__body">
        <p className="pcard__cat">{categoryLabel(p.category)}</p>
        <h3 className="pcard__title">
          <a href={href}>{p.name}</a>
        </h3>
        {p.model ? <p className="pcard__model">Model {p.model}</p> : null}
        <p className="pcard__short">{p.short}</p>
        {keySpecs(p).length ? (
          <dl className="pcard__specs">
            {keySpecs(p).map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="pcard__actions">
          <a className="btn btn--navy btn--sm" href={href}>
            <span>View Details</span>
          </a>
          <a
            className="btn btn--ghost btn--sm"
            href={`/request-a-quote/?add=${p.slug}`}
            data-quote-add={p.slug}
            data-name={productLabel(p)}
          >
            <span>Request Quote</span>
          </a>
        </div>
      </div>
    </article>
  );
}

// ------------------------------------------------------------------ catalogue (search + filters)
export function Catalogue({ items, collapsedTo }: { items: Product[]; collapsedTo?: number }) {
  const used = CATEGORIES.filter((c) => items.some((p) => p.category === c.id));
  return (
    <div className="catalogue" data-catalogue data-collapsed-to={collapsedTo ?? ""}>
      <div className="catalogue__tools">
        <label className="search">
          <span className="sr-only">Search equipment</span>
          <Icon name="search" size={18} />
          <input type="search" placeholder="Search by name, model or function" data-product-search autoComplete="off" />
        </label>
        <div className="chips" role="group" aria-label="Filter by category">
          <button type="button" className="chip is-active" data-filter="all" aria-pressed="true">
            All <span>{items.length}</span>
          </button>
          {used.map((c) => (
            <button type="button" className="chip" data-filter={c.id} aria-pressed="false" key={c.id}>
              {c.label} <span>{items.filter((p) => p.category === c.id).length}</span>
            </button>
          ))}
        </div>
        <p className="catalogue__count" data-count aria-live="polite">
          Showing {items.length} of {items.length} machines
        </p>
      </div>
      <div className="pgrid" data-product-grid>
        {items.map((p) => (
          <ProductCard p={p} key={p.slug} />
        ))}
      </div>
      <p className="empty" data-empty hidden>
        No equipment matches your search. Try a different word, or <a href="/contact/">tell us what you need</a>.
      </p>
      {collapsedTo ? (
        <div className="catalogue__more">
          <button type="button" className="btn btn--ghost btn--md" data-show-all hidden>
            <span>Show all {items.length} machines</span>
            <Icon name="chevron-down" size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ gallery
export function Gallery({ limit }: { limit?: number }) {
  const items = GALLERY.filter((g) => g.show).slice(0, limit ?? 99);
  const cats = GALLERY_CATS.filter((c) => items.some((g) => g.cats.includes(c.id)));
  return (
    <div className="gallery" data-gallery-wrap>
      <div className="chips" role="group" aria-label="Filter gallery by category">
        <button type="button" className="chip is-active" data-gfilter="all" aria-pressed="true">All</button>
        {cats.map((c) => (
          <button type="button" className="chip" data-gfilter={c.id} aria-pressed="false" key={c.id}>
            {c.label}
          </button>
        ))}
      </div>
      <ul className="masonry" data-gallery>
        {items.map((g, i) => (
          <li key={g.file} data-cats={g.cats.join(" ")} className={i === 0 ? "masonry__wide" : undefined}>
            <a href={g.src} data-lightbox="gallery" data-caption={`${g.caption}. ${IMAGE_SOURCE.credit}`} className="masonry__item">
              <img src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" decoding="async" />
              <span className="masonry__zoom" aria-hidden="true"><Icon name="zoom-in" size={18} /></span>
              <span className="masonry__cap">
                {g.caption}
                <small>{IMAGE_SOURCE.credit}</small>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="empty" data-gempty hidden>No photographs in this category.</p>
    </div>
  );
}

// ------------------------------------------------------------------ interactive process flow
export function ProcessFlow() {
  return (
    <div className="flow" data-flow>
      <ol className="flow__rail" role="list">
        {STAGES.map((s, i) => (
          <li key={s.id} className={`flow__stage ${i === 0 ? "is-open" : ""}`} data-stage>
            <button
              type="button"
              className="flow__btn"
              id={`stage-btn-${s.id}`}
              aria-expanded={i === 0 ? "true" : "false"}
              aria-controls={`stage-panel-${s.id}`}
            >
              <span className="flow__num">{s.n}</span>
              <span className="flow__title">{s.title}</span>
              <span className="flow__sum">{s.summary}</span>
              <Icon name="chevron-down" size={18} className="flow__chev" />
            </button>
            <div
              className="flow__panel"
              id={`stage-panel-${s.id}`}
              role="region"
              aria-labelledby={`stage-btn-${s.id}`}
              hidden={i === 0 ? undefined : true}
            >
              <div className="flow__panel-inner">
                <div className="flow__text">
                  <h3>{s.title}</h3>
                  <p>{s.detail}</p>
                  {s.products.length ? (
                    <>
                      <p className="flow__label">Equipment in the reference configuration (indicative)</p>
                      <ul className="taglist">
                        {s.products.map((slug) => {
                          const p = bySlug(slug)!;
                          return (
                            <li key={slug}>
                              <a href={`/products/${slug}/`}>{p.name}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <p className="flow__label">Equipment list is defined with the project scope.</p>
                  )}
                </div>
                {s.image ? (
                  <figure className="flow__fig">
                    <img src={s.image.src} alt={s.image.alt} loading="lazy" decoding="async" />
                    {s.caption ? <figcaption>{s.caption}</figcaption> : null}
                  </figure>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="flow__note">
        <Icon name="clipboard" size={16} /> Simplified process overview. Equipment mapping is indicative; the final line layout is subject to technical confirmation.
      </p>
    </div>
  );
}

// ------------------------------------------------------------------ world map
export function WorldMap() {
  const d = dotPath();
  const ct = project(-72.6, 41.7);
  const tr = project(35, 39);
  const ao = project(13.2, -8.8);
  const labelProps = { fontSize: 5.2, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600 } as const;
  return (
    <svg className="worldmap" viewBox={`0 0 ${MAP.w} ${MAP.h}`} role="img" aria-labelledby="map-title map-desc">
      <title id="map-title">World map showing the Smarctek contact in Connecticut, USA, and reference project context in Türkiye and Angola</title>
      <desc id="map-desc">
        A dotted world map with three marked locations: Glastonbury, Connecticut (Smarctek business contact); Türkiye (origin of the reference machinery); and Luanda, Angola (destination of the reference project).
      </desc>
      <path d={d} className="worldmap__dots" />
      <path d={`M${tr[0]} ${tr[1]} Q${(tr[0] + ao[0]) / 2 + 6} ${(tr[1] + ao[1]) / 2 - 6} ${ao[0]} ${ao[1]}`} className="worldmap__arc" />
      <g className="worldmap__pin worldmap__pin--hq">
        <circle cx={ct[0]} cy={ct[1]} r="6.5" className="pulse" />
        <circle cx={ct[0]} cy={ct[1]} r="2.6" />
        <text x={ct[0] - 4} y={ct[1] + 12} textAnchor="middle" {...labelProps}>Glastonbury, CT</text>
      </g>
      <g className="worldmap__pin">
        <circle cx={tr[0]} cy={tr[1]} r="2" />
        <text x={tr[0] + 4} y={tr[1] - 4} {...labelProps}>Türkiye</text>
      </g>
      <g className="worldmap__pin">
        <circle cx={ao[0]} cy={ao[1]} r="2" />
        <text x={ao[0] - 4} y={ao[1] + 9} textAnchor="end" {...labelProps}>Luanda, Angola</text>
      </g>
    </svg>
  );
}

// ------------------------------------------------------------------ enquiry form
export function EnquiryForm({ id = "enquiry", compact = false }: { id?: string; compact?: boolean }) {
  const sites = SITE.turnstileSiteKey;
  return (
    <form className="form" id={id} method="post" action="/api/enquiry" encType="multipart/form-data" noValidate data-enquiry-form>
      <div className="form__error-summary" role="alert" tabIndex={-1} hidden data-error-summary />
      <div className="form__status" role="status" aria-live="polite" data-status />

      <div className="form__grid">
        <Field name="fullName" label="Full name" autoComplete="name" required />
        <Field name="company" label="Company name" autoComplete="organization" required />
        <Field name="email" label="Business email" type="email" autoComplete="email" required />
        <Field name="phone" label="Phone number" type="tel" autoComplete="tel" hint="Include the country code" required />
        <label className="field">
          <span className="field__label">Country <i aria-hidden="true">*</i></span>
          <select name="country" required autoComplete="country-name">
            <option value="">Select a country</option>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="field__error" data-error-for="country" />
        </label>
        <label className="field">
          <span className="field__label">Industry <i aria-hidden="true">*</i></span>
          <select name="industry" required>
            <option value="">Select an industry</option>
            {INDUSTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="field__error" data-error-for="industry" />
        </label>
      </div>

      <fieldset className="equip" data-equip>
        <legend>Equipment or solution required <i aria-hidden="true">*</i></legend>
        <p className="field__hint">Select one or more. Your quote list from the catalogue appears here.</p>
        <ul className="equip__selected" data-equip-selected aria-live="polite" />
        <details className="equip__picker">
          <summary>
            <span>Choose from the catalogue</span>
            <Icon name="chevron-down" size={18} />
          </summary>
          <div className="equip__groups">
            <div className="equip__group">
              <h3>Solutions</h3>
              {SOLUTIONS.map((s) => (
                <label className="check" key={s.slug}>
                  <input type="checkbox" name="equipment" value={`Solution: ${s.name}`} data-key={`s:${s.slug}`} />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
            {CATEGORIES.map((c) => (
              <div className="equip__group" key={c.id}>
                <h3>{c.label}</h3>
                {PRODUCTS.filter((p) => p.category === c.id).map((p) => (
                  <label className="check" key={p.slug}>
                    <input type="checkbox" name="equipment" value={`Product: ${productLabel(p)}`} data-key={`p:${p.slug}`} />
                    <span>{productLabel(p)}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </details>
        <span className="field__error" data-error-for="equipment" />
      </fieldset>

      <div className="form__grid">
        <Field name="capacity" label="Required processing capacity" hint="State the quantity and the time basis, for example tons per day" />
        <Field name="location" label="Project location" hint="City and country" autoComplete="off" />
        <label className="field">
          <span className="field__label">Expected timeline</span>
          <select name="timeline">
            <option value="">Select a timeline</option>
            {TIMELINES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="field">
          <span className="field__label">Technical requirement attachment</span>
          <input type="file" name="attachments" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip" data-files />
          <span className="field__hint">Up to 3 files, 5 MB each: PDF, Word, Excel, image or ZIP.</span>
          <span className="field__error" data-error-for="attachments" />
        </label>
      </div>

      <label className="field field--wide">
        <span className="field__label">Project description <i aria-hidden="true">*</i></span>
        <textarea name="description" rows={compact ? 4 : 6} required minLength={20} maxLength={4000} placeholder="Product to be processed, objectives, site conditions and anything else that helps us understand the requirement." />
        <span className="field__error" data-error-for="description" />
      </label>

      {/* spam traps: honeypot + signed time token */}
      <div className="hp" aria-hidden="true">
        <label>Leave this field empty <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input type="hidden" name="formToken" data-token />
      {sites ? <div className="cf-turnstile" data-sitekey={sites} data-theme="light" /> : null}

      <label className="check check--consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>
          I agree that SMARCTEK LLC may use these details to respond to my enquiry, as described in the <a href="/privacy-policy/">Privacy Policy</a>. <i aria-hidden="true">*</i>
        </span>
      </label>
      <span className="field__error" data-error-for="consent" />

      <div className="form__foot">
        <button type="submit" className="btn btn--primary btn--lg" data-submit>
          <span>Send enquiry</span>
          <Icon name="arrow-right" size={18} />
        </button>
        <p className="form__note">
          Enquiries are sent to our team at {SITE.email.info}. If the form is unavailable, email us directly.
        </p>
      </div>
    </form>
  );
}

function Field({
  name, label, type = "text", required, hint, autoComplete,
}: { name: string; label: string; type?: string; required?: boolean; hint?: string; autoComplete?: string }) {
  return (
    <label className="field">
      <span className="field__label">{label} {required ? <i aria-hidden="true">*</i> : null}</span>
      <input type={type} name={name} required={required} autoComplete={autoComplete} maxLength={200} />
      {hint ? <span className="field__hint">{hint}</span> : null}
      <span className="field__error" data-error-for={name} />
    </label>
  );
}
