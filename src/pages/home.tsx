import { IMAGE_SOURCE } from "../lib/config";
import { SOLUTIONS, ENGINEERING, WHY } from "../data/content";
import { PRODUCTS } from "../data/products";
import { Btn, Icon, SectionHead, Eyebrow } from "../components/ui";
import { Catalogue, Gallery, ProcessFlow, WorldMap } from "../components/blocks";

export function HomePage() {
  const sol = (slug: string) => SOLUTIONS.find((s) => s.slug === slug)!;
  const homeProducts = PRODUCTS.filter((p) => p.home);
  return (
    <>
      {/* 01 — HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <img
          className="hero__img"
          src="/images/gallery/industrial-processing-hall-equipment.webp"
          srcSet="/images/gallery/industrial-processing-hall-equipment-900.webp 900w, /images/gallery/industrial-processing-hall-equipment.webp 1298w"
          sizes="100vw"
          width="1298"
          height="722"
          alt="Large blue processing machine with electric motors inside an industrial hall"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__grid" aria-hidden="true" />
        <div className="container hero__inner">
          <p className="eyebrow eyebrow--light eyebrow--rule">INDUSTRIAL MACHINERY &amp; GLOBAL BUSINESS SOLUTIONS</p>
          <h1 id="hero-title">Engineering Solutions for a World in Motion.</h1>
          <p className="hero__lead">
            Explore industrial machinery, agricultural processing systems and integrated equipment solutions designed around evolving business and infrastructure requirements.
          </p>
          <div className="hero__actions">
            <Btn href="/request-a-quote/" size="lg" icon="arrow-right">Request a Quote</Btn>
            <Btn href="/solutions/" variant="ghost-light" size="lg">Explore Our Solutions</Btn>
          </div>
        </div>
        <div className="container hero__strip" aria-label="Business focus">
          <ul>
            <li><span>01</span>Industrial machinery</li>
            <li><span>02</span>Agricultural processing systems</li>
            <li><span>03</span>Equipment sourcing</li>
            <li><span>04</span>International project discussions</li>
          </ul>
        </div>
        <a className="scroll-cue" href="#intro" aria-label="Scroll to introduction">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
        <p className="img-credit">{IMAGE_SOURCE.credit}</p>
      </section>

      {/* 02 — INTRODUCTION */}
      <section className="section intro" id="intro" aria-labelledby="intro-title">
        <div className="container intro__grid">
          <div className="intro__text reveal">
            <Eyebrow num="01">About Smarctek</Eyebrow>
            <h2 id="intro-title">Connecting Industrial Requirements with Engineering Possibilities.</h2>
            <p className="lead">
              SMARCTEK LLC is a Connecticut-based business working where an industrial requirement meets the equipment that can answer it.
            </p>
            <p>
              We start from what a plant needs to produce, where it will be built and how it has to run, then look at machinery and integrated processing configurations that fit. Equipment information comes from supplier documentation and is flagged wherever it still needs technical confirmation.
            </p>
            <ul className="focus-list">
              <li>
                <Icon name="sliders" size={22} />
                <div><strong>Equipment requirements</strong><span>Matching machines to product, capacity and site.</span></div>
              </li>
              <li>
                <Icon name="sprout" size={22} />
                <div><strong>Agricultural processing opportunities</strong><span>Lines for cassava, flour milling and related produce.</span></div>
              </li>
              <li>
                <Icon name="globe" size={22} />
                <div><strong>International sourcing</strong><span>Coordinating equipment enquiries across borders.</span></div>
              </li>
            </ul>
            <Btn href="/about-us/" variant="navy" icon="arrow-right">Discover Smarctek</Btn>
          </div>
          <div className="intro__media reveal reveal--delay">
            <figure className="intro__main">
              <img src="/images/gallery/industrial-processing-hall-equipment-900.webp" alt="Industrial processing hall with large machinery" width="900" height="501" loading="lazy" decoding="async" />
            </figure>
            <figure className="intro__inset">
              <img src="/images/products/quadro-plansifter-ke-8x28.webp" alt="Quadro plansifter" width="479" height="720" loading="lazy" decoding="async" />
            </figure>
            <div className="intro__tag">
              <Icon name="map-pin" size={18} />
              <span>Business contact<br /><strong>Glastonbury, Connecticut, USA</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — SOLUTIONS */}
      <section className="section section--soft solutions" id="solutions" aria-labelledby="sol-title">
        <div className="container">
          <SectionHead eyebrow="Core industrial solutions" num="02" title="Solutions Built Around Industrial Requirements." lead="Six areas of industrial equipment and processing, each with machinery, process detail and project enquiry options." />
          <div className="bento">
            {/* feature */}
            <a href={`/solutions/${sol("cassava-processing").slug}/`} className="sol sol--feature reveal">
              <img src={sol("cassava-processing").image} alt="" loading="lazy" decoding="async" />
              <div className="sol__shade" aria-hidden="true" />
              <div className="sol__body">
                <span className="sol__num">{sol("cassava-processing").num}</span>
                <Icon name="sprout" size={26} />
                <h3>{sol("cassava-processing").name}</h3>
                <p>{sol("cassava-processing").short}</p>
                <span className="sol__link">Explore Solution <Icon name="arrow-right" size={18} /></span>
              </div>
            </a>
            {/* split */}
            <a href={`/solutions/${sol("agricultural-processing-equipment").slug}/`} className="sol sol--split reveal">
              <div className="sol__body">
                <span className="sol__num">{sol("agricultural-processing-equipment").num}</span>
                <h3>{sol("agricultural-processing-equipment").name}</h3>
                <p>{sol("agricultural-processing-equipment").short}</p>
                <span className="sol__link">Explore Solution <Icon name="arrow-right" size={18} /></span>
              </div>
              <img src={sol("agricultural-processing-equipment").image} alt="" loading="lazy" decoding="async" />
            </a>
            <a href={`/solutions/${sol("flour-milling-grinding").slug}/`} className="sol sol--split sol--split-alt reveal">
              <img src={sol("flour-milling-grinding").image} alt="" loading="lazy" decoding="async" />
              <div className="sol__body">
                <span className="sol__num">{sol("flour-milling-grinding").num}</span>
                <h3>{sol("flour-milling-grinding").name}</h3>
                <p>{sol("flour-milling-grinding").short}</p>
                <span className="sol__link">Explore Solution <Icon name="arrow-right" size={18} /></span>
              </div>
            </a>
            {/* tall trio */}
            <a href={`/solutions/${sol("material-handling").slug}/`} className="sol sol--tall reveal">
              <div className="sol__fig"><img src={sol("material-handling").image} alt="" loading="lazy" decoding="async" /></div>
              <div className="sol__body">
                <span className="sol__num">{sol("material-handling").num}</span>
                <h3>{sol("material-handling").name}</h3>
                <p>{sol("material-handling").short}</p>
                <span className="sol__link">Explore Solution <Icon name="arrow-right" size={18} /></span>
              </div>
            </a>
            <a href={`/solutions/${sol("pneumatic-filtration").slug}/`} className="sol sol--tall sol--dark reveal">
              <div className="sol__fig"><img src={sol("pneumatic-filtration").image} alt="" loading="lazy" decoding="async" /></div>
              <div className="sol__body">
                <span className="sol__num">{sol("pneumatic-filtration").num}</span>
                <h3>{sol("pneumatic-filtration").name}</h3>
                <p>{sol("pneumatic-filtration").short}</p>
                <span className="sol__link">Explore Solution <Icon name="arrow-right" size={18} /></span>
              </div>
            </a>
            <a href={`/solutions/${sol("automation-packaging").slug}/`} className="sol sol--tall sol--line reveal">
              <div className="sol__fig"><img src={sol("automation-packaging").image} alt="" loading="lazy" decoding="async" /></div>
              <div className="sol__body">
                <span className="sol__num">{sol("automation-packaging").num}</span>
                <h3>{sol("automation-packaging").name}</h3>
                <p>{sol("automation-packaging").short}</p>
                <span className="sol__link">Explore Solution <Icon name="arrow-right" size={18} /></span>
              </div>
            </a>
          </div>
          <a href="/solutions/irrigation-project-enquiries/" className="sol-strip reveal">
            <Icon name="globe" size={22} />
            <span><strong>Additional enquiry category:</strong> irrigation-related projects, subject to confirmation of scope.</span>
            <span className="sol__link">Explore <Icon name="arrow-right" size={18} /></span>
          </a>
        </div>
      </section>

      {/* 04 — FEATURED PROCESSING SOLUTION */}
      <section className="section section--navy featured" id="featured" aria-labelledby="feat-title">
        <div className="grid-bg" aria-hidden="true" />
        <div className="container featured__grid">
          <div className="featured__text reveal">
            <Eyebrow light num="03">FEATURED INDUSTRIAL PROJECT CONCEPT</Eyebrow>
            <h2 id="feat-title">From Agricultural Produce to Industrial-Scale Processing.</h2>
            <p className="lead">
              Explore an integrated cassava flour processing configuration covering cleaning, washing, drying, grinding and packaging.
            </p>
            <div className="spec-callout">
              <span className="spec-callout__big">400<small>-ton</small></span>
              <p>
                Project specification referenced in the supplier proposal for a cassava flour processing line. The time basis of the 400-ton figure is not stated and is confirmed with the project specification.
              </p>
            </div>
            <p className="featured__note">
              <Icon name="clipboard" size={16} /> A reference project concept. It is not a completed, commissioned or Smarctek-owned plant.
            </p>
            <div className="featured__actions">
              <Btn href="/solutions/cassava-processing/" icon="arrow-right">Explore Processing System</Btn>
              <Btn href="/request-a-quote/" variant="ghost-light">Discuss Your Project</Btn>
            </div>
          </div>
          <div className="featured__board reveal reveal--delay">
            <ol className="units">
              <li><span>Unit 01</span><strong>Cleaning &amp; washing</strong></li>
              <li><span>Unit 02</span><strong>Drying</strong></li>
              <li><span>Unit 03</span><strong>Grinding</strong></li>
              <li><span>Unit 04</span><strong>Packing</strong></li>
            </ol>
            <div className="featured__tiles">
              <figure className="tile tile--a"><img src="/images/products/quadro-plansifter-ke-8x28.webp" alt="Quadro plansifter" loading="lazy" decoding="async" /><figcaption>Quadro plansifter</figcaption></figure>
              <figure className="tile tile--b"><img src="/images/products/pneumatic-roller-mill-spv-250x1000.webp" alt="Pneumatic roller mill" loading="lazy" decoding="async" /><figcaption>Pneumatic roller mill</figcaption></figure>
              <figure className="tile tile--c"><img src="/images/products/flour-packaging-machine-25-50kg.webp" alt="Flour packaging machine" loading="lazy" decoding="async" /><figcaption>Flour packaging</figcaption></figure>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — PROCESS FLOW */}
      <section className="section process" id="process" aria-labelledby="proc-title">
        <div className="container">
          <SectionHead eyebrow="Processing flow" num="04" title="From Cassava Input to Packaged Flour." lead="Select a stage to see what it involves and which equipment is referenced for it." />
          <ProcessFlow />
        </div>
      </section>

      {/* 06 — FEATURED MACHINERY */}
      <section className="section section--soft machinery" id="machinery" aria-labelledby="mach-title">
        <div className="container">
          <div className="machinery__head">
            <SectionHead eyebrow="Featured machinery" num="05" title="Explore Industrial Equipment." lead="Photographs and specifications are drawn from supplier documentation. Prices are not published; request a quote for any machine." />
            <Btn href="/products/" variant="link" icon="arrow-right">Open the full catalogue</Btn>
          </div>
          <Catalogue items={homeProducts} collapsedTo={8} />
        </div>
      </section>

      {/* 07 — ENGINEERING */}
      <section className="section engineering" id="engineering" aria-labelledby="eng-title">
        <div className="container engineering__grid">
          <div className="engineering__media reveal">
            <figure className="eng-a"><img src="/images/engineering/flow-and-air-piping-fabrication.webp" alt="Fabricated steel flow and air piping sections" loading="lazy" decoding="async" /></figure>
            <figure className="eng-b"><img src="/images/products/plc-control-panel-cabinet.webp" alt="PLC control cabinets" loading="lazy" decoding="async" /></figure>
            <figure className="eng-c"><img src="/images/engineering/installation-hand-tools.webp" alt="Hand tools used for equipment installation" loading="lazy" decoding="async" /></figure>
          </div>
          <div className="engineering__text">
            <SectionHead eyebrow="Engineering and integration" num="06" title="Beyond Equipment. Towards Integrated Solutions." lead="The reference proposal covers more than machines: piping, control, installation and the drawings that tie them together." />
            <ol className="eng-list">
              {ENGINEERING.map((e, i) => (
                <li key={e.t} className="reveal">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div><strong>{e.t}</strong><p>{e.d}</p></div>
                </li>
              ))}
            </ol>
            <p className="scope-note"><Icon name="clipboard" size={16} /> The extent of Smarctek's involvement in design, supply or installation is agreed for each project.</p>
          </div>
        </div>
      </section>

      {/* 08 — WHY */}
      <section className="section section--soft why" id="why" aria-labelledby="why-title">
        <div className="container">
          <SectionHead eyebrow="Why Smarctek" num="07" title="A Business Approach Built Around Your Requirements." />
          <ul className="why__grid">
            {WHY.map((w, i) => (
              <li key={w.t} className="reveal">
                <span className="why__idx">{String(i + 1).padStart(2, "0")}</span>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 09 — INTERNATIONAL */}
      <section className="section section--deep intl" id="international" aria-labelledby="intl-title">
        <div className="container intl__grid">
          <div className="intl__text reveal">
            <Eyebrow light num="08">International business</Eyebrow>
            <h2 id="intl-title">Local Presence. Global Business Perspective.</h2>
            <p className="lead">
              Smarctek is based in Glastonbury, Connecticut, and welcomes equipment and project discussions from other countries.
            </p>
            <p>
              The reference proposal behind this site pairs machinery of Türkiye origin with a project destination in Angola. It is shown as project context only. It does not indicate Smarctek offices or established operations in either country.
            </p>
            <Btn href="/global-business/" icon="arrow-right">Discuss International Opportunities</Btn>
          </div>
          <div className="intl__map reveal reveal--delay">
            <WorldMap />
            <ul className="map-key">
              <li><i className="k k--hq" />Smarctek business contact</li>
              <li><i className="k" />Reference project context</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 10 — GALLERY */}
      <section className="section gallery-sec" id="gallery" aria-labelledby="gal-title">
        <div className="container">
          <SectionHead eyebrow="Industrial image gallery" num="09" title="A Closer Look at Industrial Processing." lead="Reference photographs of industrial halls, drying equipment, handling and storage. Select an image to enlarge it." />
          <Gallery />
          <p className="gallery-note">Photographs were supplied by {IMAGE_SOURCE.owner} and are shown as reference images, not Smarctek facilities.</p>
        </div>
      </section>

      {/* 11 — CTA */}
      <section className="cta-band" aria-labelledby="cta-title">
        <div className="cta-band__grid" aria-hidden="true" />
        <div className="container cta-band__inner">
          <div>
            <h2 id="cta-title">Have an Industrial Project in Mind?</h2>
            <p>Share your equipment requirements, processing objectives and project location to begin a focused business discussion.</p>
          </div>
          <div className="cta-band__actions">
            <Btn href="/request-a-quote/" variant="navy" size="lg" icon="arrow-right">Discuss Your Project</Btn>
            <Btn href="/contact/" variant="ghost" size="lg" className="btn--on-orange">Contact Our Team</Btn>
          </div>
        </div>
      </section>
    </>
  );
}

