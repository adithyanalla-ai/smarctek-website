import type { ReactNode } from "react";
import { SITE, IMAGE_SOURCE, SPEC_DISCLAIMER } from "../lib/config";
import { SOLUTIONS, STAGES, ENGINEERING, type Solution } from "../data/content";
import { PRODUCTS, CATEGORIES, bySlug, categoryLabel, type Product } from "../data/products";
import { Btn, Icon, PageHero, SectionHead, Eyebrow, Breadcrumbs } from "../components/ui";
import { Catalogue, Gallery, ProductCard, EnquiryForm, WorldMap, visibleSpecs, productLabel } from "../components/blocks";

const BUILD_DATE = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

function CtaBand({ title = "Have an Industrial Project in Mind?", text = "Share your equipment requirements, processing objectives and project location to begin a focused business discussion.", href = "/request-a-quote/" }: { title?: string; text?: string; href?: string }) {
  return (
    <section className="cta-band" aria-label="Project enquiry">
      <div className="cta-band__grid" aria-hidden="true" />
      <div className="container cta-band__inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-band__actions">
          <Btn href={href} variant="navy" size="lg" icon="arrow-right">Discuss Your Project</Btn>
          <Btn href="/contact/" variant="ghost" size="lg" className="btn--on-orange">Contact Our Team</Btn>
        </div>
      </div>
    </section>
  );
}

const Disclaimer = ({ children = SPEC_DISCLAIMER }: { children?: ReactNode }) => (
  <p className="disclaimer"><Icon name="clipboard" size={16} /> <span>{children}</span></p>
);

// ============================================================ ABOUT
export function AboutPage() {
  return (
    <>
      <PageHero
        title="About SMARCTEK LLC"
        eyebrow="Company"
        lead="A Connecticut-based business focused on industrial machinery, agricultural processing systems, equipment sourcing and international project opportunities."
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />
      <section className="section">
        <div className="container split">
          <div className="split__text">
            <Eyebrow num="01">Company overview</Eyebrow>
            <h2>Industrial requirements, answered with the right equipment.</h2>
            <p className="lead">SMARCTEK LLC is a limited liability company based in Glastonbury, Connecticut.</p>
            <p>We work with buyers, developers and project teams who need industrial equipment or a complete processing line and want a clear, technically informed route to a quotation.</p>
            <p>Our attention is on processing: agricultural produce going in, a finished product coming out, and the machinery, air handling, controls and packaging in between.</p>
          </div>
          <figure className="split__media">
            <img src="/images/gallery/industrial-processing-hall-equipment-900.webp" alt="Industrial hall with a large blue processing machine" width="900" height="501" loading="lazy" decoding="async" />
            <figcaption>{IMAGE_SOURCE.credit}. Reference photograph.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Business approach" num="02" title="How an enquiry is handled." />
          <ol className="steps">
            {[
              ["Understand the requirement", "Product, capacity, site and timeline come first."],
              ["Match the equipment", "We look at machinery and line configurations that fit the brief."],
              ["Confirm technical details", "Specifications are checked against supplier documentation. Anything unclear is flagged, not smoothed over."],
              ["Quote and follow up", "Quotations are issued in writing, with questions answered in writing too."],
            ].map(([t, d], i) => (
              <li key={t} className="reveal">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <Eyebrow num="03">Vision</Eyebrow>
            <h2>A dependable link between requirement and engineering.</h2>
            <p className="lead">To connect industrial requirements with the engineering that meets them, across borders and over the long term.</p>
          </div>
          <div>
            <Eyebrow num="04">Values</Eyebrow>
            <ul className="values">
              <li><strong>Clarity.</strong> We say what is known and what still needs confirmation.</li>
              <li><strong>Technical honesty.</strong> Specifications are never rounded up to look better.</li>
              <li><strong>Long-term relationships.</strong> A good first quotation should lead to a second conversation.</li>
              <li><strong>Professional conduct.</strong> Prompt, courteous and in writing.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Industrial focus" num="05" title="Where our attention goes." />
          <ul className="focus-grid">
            {SOLUTIONS.filter((s) => s.products.length).map((s) => (
              <li key={s.slug}>
                <a href={`/solutions/${s.slug}/`}>
                  <span>{s.num}</span>
                  <strong>{s.name}</strong>
                  <Icon name="arrow-right" size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <Eyebrow num="06">Business contact</Eyebrow>
            <h2>Talk to the team.</h2>
            <p>Share a requirement, ask for equipment information or start a project discussion.</p>
            <Btn href="/contact/" variant="navy" icon="arrow-right">Contact us</Btn>
          </div>
          <ContactList />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

function ContactList() {
  return (
    <ul className="contact-list">
      <li><Icon name="map-pin" size={22} /><div><strong>Address</strong><address>{SITE.address.street},<br />{SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}, {SITE.address.country}</address></div></li>
      <li><Icon name="phone" size={22} /><div><strong>Phone</strong><a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a></div></li>
      <li><Icon name="mail" size={22} /><div><strong>Email</strong><a href={`mailto:${SITE.email.info}`}>{SITE.email.info}</a><br /><a href={`mailto:${SITE.email.contact}`}>{SITE.email.contact}</a></div></li>
      <li><Icon name="globe" size={22} /><div><strong>Website</strong><a href="/">www.smarctekllc.com</a></div></li>
    </ul>
  );
}

// ============================================================ SOLUTIONS
export function SolutionsIndexPage() {
  return (
    <>
      <PageHero
        title="Solutions Built Around Industrial Requirements"
        eyebrow="Solutions"
        lead="Six areas of industrial equipment and processing, plus irrigation-related project enquiries. Each page lists the machinery involved, how the process runs and how to start an enquiry."
        crumbs={[{ label: "Home", href: "/" }, { label: "Solutions" }]}
      />
      <section className="section">
        <div className="container">
          <ul className="sol-rows">
            {SOLUTIONS.map((s, i) => (
              <li key={s.slug} className={`sol-row ${i % 2 ? "sol-row--flip" : ""} reveal`}>
                <a href={`/solutions/${s.slug}/`} className="sol-row__media" tabIndex={-1} aria-hidden="true">
                  <img src={s.image} alt="" loading="lazy" decoding="async" />
                </a>
                <div className="sol-row__text">
                  <span className="sol-row__num">{s.num}</span>
                  <h2><a href={`/solutions/${s.slug}/`}>{s.name}</a></h2>
                  <p>{s.short}</p>
                  {s.products.length ? (
                    <ul className="taglist">
                      {s.products.slice(0, 4).map((slug) => (
                        <li key={slug}><a href={`/products/${slug}/`}>{bySlug(slug)!.name}</a></li>
                      ))}
                      {s.products.length > 4 ? <li><a href={`/solutions/${s.slug}/`}>+{s.products.length - 4} more</a></li> : null}
                    </ul>
                  ) : null}
                  <Btn href={`/solutions/${s.slug}/`} variant="link" icon="arrow-right">Explore Solution</Btn>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function SolutionPage({ s }: { s: Solution }) {
  const products = s.products.map((slug) => bySlug(slug)!);
  const others = SOLUTIONS.filter((x) => x.slug !== s.slug && x.products.length).slice(0, 3);
  return (
    <>
      <PageHero
        title={s.name}
        eyebrow={`Solution ${s.num}`}
        lead={s.short}
        crumbs={[{ label: "Home", href: "/" }, { label: "Solutions", href: "/solutions/" }, { label: s.name }]}
        image={s.image}
        imageAlt={s.imageAlt}
      >
        <div className="page-hero__actions">
          <Btn href={`/request-a-quote/?solution=${s.slug}`} icon="arrow-right">Request a Quote</Btn>
          <Btn href="/contact/" variant="ghost-light">Contact Our Team</Btn>
        </div>
      </PageHero>

      <section className="section">
        <div className="container split">
          <div className="split__text">
            <Eyebrow num="01">Overview</Eyebrow>
            <h2>What this solution covers.</h2>
            <p className="lead">{s.intro}</p>
            {s.note ? <Disclaimer>{s.note}</Disclaimer> : null}
          </div>
          <aside className="panel" aria-label="Application areas">
            <h3>Application areas</h3>
            <ul className="ticks">
              {s.applications.map((a) => <li key={a}><Icon name="check" size={18} />{a}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Process information" num="02" title="How the process runs." />
          <ol className="steps steps--wide">
            {s.process.map((p, i) => (
              <li key={p.title} className="reveal">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {products.length ? (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow="Relevant machinery" num="03" title="Equipment for this solution." lead="Photographs and specifications are drawn from supplier documentation." />
            <div className="pgrid">
              {products.map((p) => <ProductCard p={p} key={p.slug} />)}
            </div>
            <Disclaimer />
          </div>
        </section>
      ) : null}

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Other solutions" title="Related areas." />
          <ul className="focus-grid">
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`/solutions/${o.slug}/`}><span>{o.num}</span><strong>{o.name}</strong><Icon name="arrow-right" size={18} /></a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand href={`/request-a-quote/?solution=${s.slug}`} />
    </>
  );
}

// ============================================================ PRODUCTS
export function ProductsIndexPage() {
  return (
    <>
      <PageHero
        title="Products and Machinery"
        eyebrow="Catalogue"
        lead="Industrial machinery for cassava, flour and agricultural processing lines. Search by name or model, filter by category and build a combined quote list. Prices are not published."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <section className="section section--soft">
        <div className="container">
          <h2 className="sr-only">Machinery catalogue</h2>
          <Catalogue items={PRODUCTS} />
          <Disclaimer />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Categories" title="What each category covers." />
          <dl className="cat-list">
            {CATEGORIES.map((c) => (
              <div key={c.id}>
                <dt><a href={`/products/?category=${c.id}`}>{c.label}</a></dt>
                <dd>{c.blurb}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <CtaBand title="Looking for a machine that is not listed?" text="Tell us what you need to process and where. We will say plainly whether we can help." />
    </>
  );
}

export function ProductPage({ p }: { p: Product }) {
  const specs = visibleSpecs(p);
  const related = p.related.map((s) => bySlug(s)!).filter(Boolean);
  const sols = p.solutions.map((s) => SOLUTIONS.find((x) => x.slug === s)!).filter(Boolean);
  const images = [{ src: p.image, alt: p.imageAlt }, ...(p.extraImages ?? [])];
  return (
    <>
      <section className="product-top">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products/" }, { label: categoryLabel(p.category), href: `/products/?category=${p.category}` }, { label: p.name }]} />
          <div className="product-top__grid">
            <div className="product-gallery">
              <a href={images[0].src} className="product-gallery__main" data-lightbox="product" data-caption={`${p.name}${p.model ? ` ${p.model}` : ""}. ${IMAGE_SOURCE.credit}`}>
                <img src={images[0].src} alt={images[0].alt} loading="eager" decoding="async" />
                <span className="masonry__zoom" aria-hidden="true"><Icon name="zoom-in" size={18} /></span>
              </a>
              {images.slice(1).map((im) => (
                <a href={im.src} key={im.src} className="product-gallery__thumb" data-lightbox="product" data-caption={`${p.name}. ${IMAGE_SOURCE.credit}`}>
                  <img src={im.src} alt={im.alt} loading="lazy" decoding="async" />
                </a>
              ))}
              <p className="product-gallery__credit">{IMAGE_SOURCE.credit}. Representative image.</p>
            </div>
            <div className="product-info">
              <p className="pcard__cat">{categoryLabel(p.category)}</p>
              <h1>{p.name}</h1>
              {p.model ? <p className="product-info__model">Model <strong>{p.model}</strong></p> : null}
              <p className="lead">{p.short}</p>
              <div className="product-info__actions">
                <a className="btn btn--primary btn--lg" href={`/request-a-quote/?add=${p.slug}`} data-quote-go={p.slug} data-name={productLabel(p)}>
                  <span>Request a Quote</span><Icon name="arrow-right" size={18} />
                </a>
                <a className="btn btn--ghost btn--lg" href={`/request-a-quote/?add=${p.slug}`} data-quote-add={p.slug} data-name={productLabel(p)}>
                  <span>Add to quote list</span><Icon name="plus" size={18} />
                </a>
              </div>
              <p className="product-info__help">Prefer to talk? Call <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>.</p>
              {sols.length ? (
                <p className="product-info__sols">Used in: {sols.map((s, i) => (<span key={s.slug}>{i ? ", " : ""}<a href={`/solutions/${s.slug}/`}>{s.name}</a></span>))}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container product-body">
          <div className="product-body__main">
            <div className="block">
              <h2>Equipment overview</h2>
              <p>{p.overview}</p>
            </div>
            <div className="block">
              <h2>Applications</h2>
              <ul className="ticks">{p.applications.map((a) => <li key={a}><Icon name="check" size={18} />{a}</li>)}</ul>
            </div>
            <div className="block">
              <h2>Functional features</h2>
              <ul className="ticks">{p.features.map((a) => <li key={a}><Icon name="check" size={18} />{a}</li>)}</ul>
            </div>
          </div>
          <div className="product-body__specs">
            <div className="block block--specs" data-specs>
              <h2>Technical specifications</h2>
              {specs.length ? (
                <>
                  <table className="spec-table">
                    <tbody>
                      {specs.map((s, i) => (
                        <tr key={s.label} data-spec-row={i}>
                          <th scope="row">{s.label}</th>
                          <td>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {specs.length > 8 ? (
                    <button type="button" className="btn btn--ghost btn--sm spec-toggle" data-spec-toggle aria-expanded="false" hidden>
                      <span>Show all {specs.length} specifications</span><Icon name="chevron-down" size={16} />
                    </button>
                  ) : null}
                </>
              ) : (
                <p>Detailed specifications for this item are provided on request.</p>
              )}
              <Disclaimer>Final equipment configuration and specifications are subject to technical confirmation.</Disclaimer>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Related equipment" title="Often considered alongside." />
          <div className="pgrid pgrid--3">
            {related.map((r) => <ProductCard p={r} key={r.slug} />)}
          </div>
        </div>
      </section>
      <CtaBand title={`Interested in the ${p.name}?`} text="Tell us the product, capacity and site. We will come back with a focused technical discussion." href={`/request-a-quote/?add=${p.slug}`} />
    </>
  );
}

// ============================================================ PROJECTS
export function ProjectsPage() {
  const refEquipment = PRODUCTS.filter((p) => p.home || p.slug === "roller-mill-store" || p.slug === "air-lock-feeder-eklus");
  return (
    <>
      <PageHero
        title="Projects and Engineering"
        eyebrow="Reference project configuration"
        lead="A 400-ton cassava flour processing line paired with an irrigation processing plant for Angola, shown as a reference configuration."
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        image="/images/gallery/industrial-processing-hall-equipment-900.webp"
        imageAlt="Industrial processing hall with large machinery"
      />
      <section className="section pt0">
        <div className="container">
          <SectionHead eyebrow="Processing stages" num="01" title="Four units make up the cassava flour line." lead="The proposal specifies a 400-ton project. The time basis of that figure is not stated and is confirmed with the project specification." />
          <ol className="units-grid">
            {STAGES.filter((s) => s.id !== "input").map((s, i) => (
              <li key={s.id} className="reveal">
                <span className="units-grid__n">Unit {String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Equipment requirements" num="02" title="Machinery listed in the reference configuration." lead="Select any machine for details. Quantities and commercial terms are not published." />
          <ul className="chip-links">
            {refEquipment.map((p) => (
              <li key={p.slug}>
                <a href={`/products/${p.slug}/`}>
                  <img src={p.image} alt="" width="48" height="48" loading="lazy" decoding="async" />
                  <span><strong>{p.name}</strong><small>{categoryLabel(p.category)}</small></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <SectionHead eyebrow="Conceptual scope" num="03" title="What a complete line includes." />
            <ol className="eng-list eng-list--plain">
              {ENGINEERING.map((e, i) => (
                <li key={e.t}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{e.t}</strong><p>{e.d}</p></div></li>
              ))}
            </ol>
          </div>
          <div className="stack-figs">
            <figure><img src="/images/engineering/flow-and-air-piping-fabrication.webp" alt="Fabricated flow and air piping sections" loading="lazy" decoding="async" /><figcaption>Flow and air piping sections. {IMAGE_SOURCE.credit}</figcaption></figure>
            <figure><img src="/images/products/plc-control-panel-motor-cabinets.webp" alt="Motor control cabinets" loading="lazy" decoding="async" /><figcaption>Control cabinets. {IMAGE_SOURCE.credit}</figcaption></figure>
          </div>
        </div>
      </section>
      <section className="section pt0">
        <div className="container">
          <Disclaimer>This is a simplified overview, not a finalised engineering schematic. The extent of Smarctek's involvement in design, supply or installation is agreed for each project. {SPEC_DISCLAIMER}</Disclaimer>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

// ============================================================ GLOBAL
export function GlobalPage() {
  return (
    <>
      <PageHero
        title="Global Business"
        eyebrow="International"
        lead="A USA-based contact for equipment sourcing, collaboration enquiries and project-specific discussions with buyers in other countries."
        crumbs={[{ label: "Home", href: "/" }, { label: "Global Business" }]}
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="How we work internationally" num="01" title="Three kinds of conversation." />
          <ul className="triad">
            <li className="reveal"><Icon name="package" size={28} /><h3>International equipment sourcing</h3><p>Tell us what you need to process. We look at suitable machinery and request the technical information to compare it.</p></li>
            <li className="reveal"><Icon name="users" size={28} /><h3>Business collaboration enquiries</h3><p>Engineers, EPC contractors, traders and project developers who want to discuss working together on an enquiry.</p></li>
            <li className="reveal"><Icon name="clipboard" size={28} /><h3>Project-specific discussions</h3><p>A defined project with a product, capacity, location and timeline. We take it from first brief to written quotation.</p></li>
          </ul>
        </div>
      </section>

      <section className="section section--deep intl" id="context">
        <div className="container intl__grid">
          <div className="intl__text">
            <Eyebrow light num="02">Reference project context</Eyebrow>
            <h2>Local Presence. Global Business Perspective.</h2>
            <p className="lead">Smarctek is based in Glastonbury, Connecticut.</p>
            <p>The reference proposal on our Projects page pairs machinery of Türkiye origin with a project destination in Luanda, Angola. It shows the kind of cross-border enquiry we discuss. It is not evidence of Smarctek offices or established operations in Türkiye or Angola.</p>
            <Btn href="/projects/" variant="ghost-light" icon="arrow-right">View the reference project</Btn>
          </div>
          <div className="intl__map">
            <WorldMap />
            <ul className="map-key"><li><i className="k k--hq" />Smarctek business contact</li><li><i className="k" />Reference project context</li></ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <SectionHead eyebrow="Your first message" num="03" title="What helps us reply quickly." />
            <ul className="ticks">
              {["Your country and the project location", "The product you want to process", "Required capacity, with the time basis (per hour, per day)", "Equipment you already have in mind", "Expected timeline", "Any drawings or specifications you can attach"].map((t) => (
                <li key={t}><Icon name="check" size={18} />{t}</li>
              ))}
            </ul>
          </div>
          <div className="panel panel--cta">
            <h3>Discuss International Opportunities</h3>
            <p>Send a project enquiry and we will respond by email. Phone: <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>. Please allow for the US Eastern time zone.</p>
            <Btn href="/request-a-quote/" icon="arrow-right">Start an enquiry</Btn>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

// ============================================================ GALLERY
export function GalleryPage() {
  return (
    <>
      <PageHero
        title="A Closer Look at Industrial Processing"
        eyebrow="Gallery"
        lead="Reference photographs of industrial halls, drying equipment, material handling and storage. Select any image to view it larger."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <section className="section">
        <div className="container">
          <Gallery />
          <p className="gallery-note">Photographs were supplied by {IMAGE_SOURCE.owner} and are shown as reference images. They do not depict Smarctek facilities or completed Smarctek projects.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

// ============================================================ CONTACT / QUOTE
export function ContactPage() {
  const q = encodeURIComponent(`${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`);
  return (
    <>
      <PageHero
        title="Contact Us"
        eyebrow="Contact"
        lead="Send a structured project enquiry, or reach the team directly by phone or email."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="section">
        <div className="container contact-grid">
          <aside className="contact-card">
            <h2>SMARCTEK LLC</h2>
            <ContactList />
            <a className="btn btn--navy btn--md" href={`tel:${SITE.phoneHref}`}><Icon name="phone" size={18} /><span>Call {SITE.phone}</span></a>
            <a className="btn btn--ghost btn--md" href={`https://www.google.com/maps/search/?api=1&query=${q}`} rel="noopener" target="_blank"><Icon name="map-pin" size={18} /><span>Open location in Maps</span></a>
          </aside>
          <div className="contact-form">
            <h2>Project enquiry</h2>
            <p className="lead">Share your equipment requirements, processing objectives and project location.</p>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}

export function QuotePage() {
  return (
    <>
      <PageHero
        title="Request a Quote"
        eyebrow="Quotation enquiry"
        lead="Select one or more machines or solutions and send a single combined request. Prices are not published; we reply with a written quotation."
        crumbs={[{ label: "Home", href: "/" }, { label: "Request a Quote" }]}
      />
      <section className="section">
        <div className="container contact-grid contact-grid--quote">
          <aside className="contact-card quote-list" data-quote-panel>
            <h2>Your quote list</h2>
            <ul className="quote-list__items" data-quote-items />
            <p className="quote-list__empty" data-quote-empty>No items yet. <a href="/products/">Browse the catalogue</a> and choose Request Quote, or select items in the form.</p>
            <button type="button" className="btn btn--ghost btn--sm" data-quote-clear hidden><Icon name="trash" size={16} /><span>Clear list</span></button>
            <hr />
            <p className="quote-list__help">Questions first? Call <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a> or email <a href={`mailto:${SITE.email.info}`}>{SITE.email.info}</a>.</p>
          </aside>
          <div className="contact-form">
            <h2>Your details</h2>
            <EnquiryForm id="quote-form" />
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================================ LEGAL / 404
function LegalShell({ title, children, crumb }: { title: string; children: ReactNode; crumb: string }) {
  return (
    <>
      <PageHero title={title} crumbs={[{ label: "Home", href: "/" }, { label: crumb }]} lead={`Last updated ${BUILD_DATE}.`} />
      <section className="section">
        <div className="container prose">{children}</div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" crumb="Privacy Policy">
      <h2>1. Who we are</h2>
      <p>This website is operated by {SITE.name}, {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}, {SITE.address.country}. You can reach us at <a href={`mailto:${SITE.email.info}`}>{SITE.email.info}</a>.</p>
      <h2>2. Information we collect</h2>
      <ul>
        <li><strong>Enquiry details.</strong> When you submit the enquiry form we receive your name, company, business email, phone number, country, industry, the equipment you select, capacity, project location, timeline, your description and any files you attach.</li>
        <li><strong>Correspondence.</strong> Emails and calls with our team.</li>
        <li><strong>Technical data.</strong> Our web server records standard request information such as IP address, time and page requested, used for security and troubleshooting.</li>
        <li><strong>Quote list.</strong> The machines you add to your quote list are kept in your own browser storage and are sent to us only if you submit the form.</li>
      </ul>
      <p>This site does not currently use advertising or analytics cookies. If that changes, this policy and a consent banner will be updated first.</p>
      <h2>3. Third-party services</h2>
      <ul>
        <li><strong>Google Fonts.</strong> Fonts are loaded from Google, which receives your IP address and browser details when a page loads.</li>
        <li><strong>Email delivery.</strong> Enquiries are delivered to us through an email delivery provider.</li>
        <li><strong>Spam protection.</strong> The form uses hidden checks and may use a bot-detection service such as Cloudflare Turnstile.</li>
      </ul>
      <h2>4. How we use information</h2>
      <p>We use enquiry information to respond to you, prepare quotations, discuss technical requirements and keep records of our business dealings. We also use it to protect the site against abuse and to meet legal obligations.</p>
      <h2>5. Sharing</h2>
      <p>We do not sell personal information. We may share enquiry details with equipment suppliers where this is needed to prepare a quotation you have asked for, with service providers who help us run the site and email, and with advisers or authorities where the law requires.</p>
      <h2>6. International use</h2>
      <p>We are based in the United States. If you contact us from another country, your information is processed in the United States.</p>
      <h2>7. Retention</h2>
      <p>We keep enquiry information for as long as it is needed to deal with your enquiry and any resulting business relationship, and for legal and accounting purposes.</p>
      <h2>8. Your choices and rights</h2>
      <p>You can ask us to access, correct or delete the personal information we hold about you by emailing <a href={`mailto:${SITE.email.info}`}>{SITE.email.info}</a>. Depending on where you live, additional rights may apply.</p>
      <h2>9. Security</h2>
      <p>We use reasonable technical and organisational measures to protect information. No online transmission is completely secure.</p>
      <h2>10. Children</h2>
      <p>This site is intended for business users and is not directed at children.</p>
      <h2>11. Changes</h2>
      <p>We may update this policy. The date at the top shows the latest version.</p>
    </LegalShell>
  );
}

export function TermsPage() {
  return (
    <LegalShell title="Terms of Use" crumb="Terms of Use">
      <h2>1. Acceptance</h2>
      <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>2. Information only</h2>
      <p>Content on this site is provided for general information. It is not an offer, quotation or contract. Any supply of equipment is subject to a written quotation and agreement signed by {SITE.name}.</p>
      <h2>3. Product information</h2>
      <p>Equipment descriptions, specifications and photographs are drawn from reference supplier documentation and are representative. Final configurations and specifications are subject to technical confirmation. Prices are not published.</p>
      <h2>4. Reference projects</h2>
      <p>Projects described on this site as reference configurations or proposals are examples of how a processing line can be specified. They are not completed, commissioned or owned projects of {SITE.name} unless stated otherwise.</p>
      <h2>5. Images and intellectual property</h2>
      <p>Equipment and facility photographs are credited to their owner, {IMAGE_SOURCE.owner}. The {SITE.name} name, logo and original text are the property of {SITE.name}. You may not copy or reuse site content for commercial purposes without written permission.</p>
      <h2>6. Enquiries and submissions</h2>
      <p>Information you submit through the enquiry form must be accurate and lawful. Do not upload files you have no right to share.</p>
      <h2>7. Acceptable use</h2>
      <p>You agree not to interfere with the site, attempt unauthorised access, send automated submissions or use the site for unlawful purposes.</p>
      <h2>8. Links to other sites</h2>
      <p>We are not responsible for the content or practices of third-party sites that this site may link to.</p>
      <h2>9. Disclaimer and liability</h2>
      <p>The site is provided as is. To the extent permitted by law, {SITE.name} is not liable for losses arising from use of, or reliance on, this site.</p>
      <h2>10. Governing law</h2>
      <p>These terms are governed by the laws of the State of Connecticut, USA.</p>
      <h2>11. Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${SITE.email.info}`}>{SITE.email.info}</a>.</p>
    </LegalShell>
  );
}

export function NotFoundPage() {
  return (
    <section className="section notfound">
      <div className="container">
        <Eyebrow>404</Eyebrow>
        <h1>This page could not be found.</h1>
        <p className="lead">The address may have changed. Try the catalogue or get in touch.</p>
        <div className="page-hero__actions">
          <Btn href="/" variant="navy">Home</Btn>
          <Btn href="/products/" variant="ghost">Products</Btn>
          <Btn href="/contact/" variant="ghost">Contact</Btn>
        </div>
      </div>
    </section>
  );
}
