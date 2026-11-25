/* Smarctek client script. Progressive enhancement only: every page works without it
 * (filters show everything, forms post natively, links open images directly). */

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ------------------------------------------------------------------ toast
let toastTimer: number | undefined;
function toast(msg: string, link?: { href: string; label: string }) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg + " ";
  if (link) {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.label;
    el.appendChild(a);
  }
  el.classList.add("is-on");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("is-on"), 4500);
}

// ------------------------------------------------------------------ navigation
(function nav() {
  const header = $("#site-header");
  const btn = $<HTMLButtonElement>(".nav-toggle");
  const navEl = $("#primary-nav");
  if (!header || !btn || !navEl) return;
  const set = (open: boolean) => {
    header.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-lock", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      set(false);
      btn.focus();
    }
  });
  navEl.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) set(false);
  });
  window.matchMedia("(min-width: 1200px)").addEventListener("change", (m) => m.matches && set(false));
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ------------------------------------------------------------------ reveal on scroll
(function reveal() {
  const els = $$(".reveal");
  if (!els.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  els.forEach((e) => io.observe(e));
})();

// ------------------------------------------------------------------ scroll to top
(function toTop() {
  const b = $<HTMLButtonElement>("#to-top");
  if (!b) return;
  const upd = () => (b.hidden = window.scrollY < 700);
  upd();
  window.addEventListener("scroll", upd, { passive: true });
  b.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
})();

// ------------------------------------------------------------------ catalogue: search + filter
(function catalogue() {
  $$("[data-catalogue]").forEach((root) => {
    const cards = $$<HTMLElement>(".pcard", root);
    const chips = $$<HTMLButtonElement>("[data-filter]", root);
    const search = $<HTMLInputElement>("[data-product-search]", root);
    const count = $("[data-count]", root);
    const empty = $("[data-empty]", root);
    const grid = $("[data-product-grid]", root);
    const more = $<HTMLButtonElement>("[data-show-all]", root);
    const limit = Number(root.dataset.collapsedTo || 0);
    let cat = "all";
    let expanded = false;

    const apply = () => {
      const q = (search?.value ?? "").trim().toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      const filtering = cat !== "all" || terms.length > 0;
      let shown = 0;
      let matched = 0;
      cards.forEach((c) => {
        const ok = (cat === "all" || c.dataset.category === cat) && terms.every((t) => (c.dataset.search ?? "").includes(t));
        if (ok) matched++;
        const hide = !ok || (limit > 0 && !filtering && !expanded && matched > limit);
        c.hidden = hide;
        if (!hide) shown++;
      });
      if (count) count.textContent = `Showing ${shown} of ${cards.length} machines`;
      if (empty) empty.hidden = matched > 0;
      if (grid) grid.hidden = matched === 0;
      if (more) {
        more.hidden = !(limit > 0 && !filtering && !expanded && cards.length > limit);
      }
    };
    chips.forEach((b) =>
      b.addEventListener("click", () => {
        cat = b.dataset.filter ?? "all";
        chips.forEach((x) => {
          const on = x === b;
          x.classList.toggle("is-active", on);
          x.setAttribute("aria-pressed", String(on));
        });
        apply();
      }),
    );
    search?.addEventListener("input", apply);
    more?.addEventListener("click", () => {
      expanded = true;
      apply();
    });
    const wanted = new URLSearchParams(location.search).get("category");
    if (wanted) chips.find((c) => c.dataset.filter === wanted)?.click();
    else apply();
  });
})();

// ------------------------------------------------------------------ gallery filter
(function galleryFilter() {
  $$("[data-gallery-wrap]").forEach((root) => {
    const chips = $$<HTMLButtonElement>("[data-gfilter]", root);
    const items = $$<HTMLElement>("[data-gallery] > li", root);
    const empty = $("[data-gempty]", root);
    chips.forEach((b) =>
      b.addEventListener("click", () => {
        const f = b.dataset.gfilter ?? "all";
        chips.forEach((x) => {
          x.classList.toggle("is-active", x === b);
          x.setAttribute("aria-pressed", String(x === b));
        });
        let n = 0;
        items.forEach((li) => {
          const ok = f === "all" || (li.dataset.cats ?? "").split(" ").includes(f);
          li.hidden = !ok;
          if (ok) n++;
        });
        if (empty) empty.hidden = n > 0;
      }),
    );
  });
})();

// ------------------------------------------------------------------ process flow
(function flow() {
  $$("[data-flow]").forEach((root) => {
    const stages = $$<HTMLElement>("[data-stage]", root);
    const btns = stages.map((s) => $<HTMLButtonElement>(".flow__btn", s)!);
    const open = (i: number) => {
      stages.forEach((s, k) => {
        const on = k === i;
        s.classList.toggle("is-open", on);
        btns[k].setAttribute("aria-expanded", String(on));
        const panel = $<HTMLElement>(".flow__panel", s)!;
        panel.hidden = !on;
      });
    };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => open(i));
      b.addEventListener("keydown", (e) => {
        const k = e.key;
        let n = -1;
        if (k === "ArrowRight" || k === "ArrowDown") n = (i + 1) % btns.length;
        else if (k === "ArrowLeft" || k === "ArrowUp") n = (i - 1 + btns.length) % btns.length;
        else if (k === "Home") n = 0;
        else if (k === "End") n = btns.length - 1;
        if (n >= 0) {
          e.preventDefault();
          btns[n].focus();
          open(n);
        }
      });
    });
  });
})();

// ------------------------------------------------------------------ lightbox
(function lightbox() {
  const dlg = $<HTMLDialogElement>("#lightbox");
  if (!dlg || typeof dlg.showModal !== "function") return;
  const img = $<HTMLImageElement>("img", dlg)!;
  const cap = $("figcaption", dlg)!;
  const count = $(".lightbox__count", dlg)!;
  const prev = $<HTMLButtonElement>(".lightbox__prev", dlg)!;
  const next = $<HTMLButtonElement>(".lightbox__next", dlg)!;
  let list: HTMLAnchorElement[] = [];
  let idx = 0;
  let opener: HTMLElement | null = null;

  const show = (i: number) => {
    idx = (i + list.length) % list.length;
    const a = list[idx];
    const thumb = $("img", a) as HTMLImageElement | null;
    img.src = a.href;
    img.alt = thumb?.alt ?? "";
    cap.textContent = a.dataset.caption ?? "";
    count.textContent = list.length > 1 ? `${idx + 1} / ${list.length}` : "";
    prev.hidden = next.hidden = list.length < 2;
  };
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-lightbox]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const group = a.dataset.lightbox;
    list = $$<HTMLAnchorElement>(`a[data-lightbox="${group}"]`).filter((x) => !x.closest("[hidden]"));
    opener = a;
    show(list.indexOf(a));
    dlg.showModal();
    $<HTMLButtonElement>(".lightbox__close", dlg)?.focus();
  });
  prev.addEventListener("click", () => show(idx - 1));
  next.addEventListener("click", () => show(idx + 1));
  $(".lightbox__close", dlg)?.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  dlg.addEventListener("close", () => {
    img.removeAttribute("src");
    opener?.focus();
  });
})();

// ------------------------------------------------------------------ product specs expander
(function specs() {
  $$("[data-specs]").forEach((box) => {
    const rows = $$<HTMLElement>("[data-spec-row]", box);
    const btn = $<HTMLButtonElement>("[data-spec-toggle]", box);
    if (!btn || rows.length <= 8) return;
    btn.hidden = false;
    const set = (all: boolean) => {
      rows.forEach((r, i) => (r.hidden = !all && i >= 8));
      btn.setAttribute("aria-expanded", String(all));
      const label = $("span", btn)!;
      label.textContent = all ? "Show fewer specifications" : `Show all ${rows.length} specifications`;
    };
    set(false);
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
  });
})();

// ------------------------------------------------------------------ quote list (shortlist)
const QKEY = "smarctek.quote.v1";
const quote = {
  read(): string[] {
    try {
      const v = JSON.parse(localStorage.getItem(QKEY) || "[]");
      return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  },
  write(list: string[]) {
    try {
      localStorage.setItem(QKEY, JSON.stringify(Array.from(new Set(list))));
    } catch {
      /* private mode: list lives for this page only */
    }
    quote.sync();
  },
  has: (k: string) => quote.read().includes(k),
  add(k: string) {
    quote.write([...quote.read(), k]);
  },
  remove(k: string) {
    quote.write(quote.read().filter((x) => x !== k));
  },
  sync() {
    const list = quote.read();
    $$("[data-quote-count]").forEach((c) => {
      c.textContent = String(list.length);
      c.hidden = list.length === 0;
    });
    $$<HTMLElement>("[data-quote-add]").forEach((b) => {
      const on = list.includes("p:" + b.dataset.quoteAdd);
      b.classList.toggle("is-added", on);
      const label = $("span", b);
      if (label) label.textContent = on ? "In quote list" : b.hasAttribute("data-quote-go") ? label.textContent : b.dataset.label || label.textContent;
    });
    $$<HTMLInputElement>("input[data-key]").forEach((i) => (i.checked = list.includes(i.dataset.key!)));
    renderQuoteUI(list);
  },
};

function renderQuoteUI(list: string[]) {
  const labels = new Map<string, string>();
  $$<HTMLInputElement>("input[data-key]").forEach((i) => {
    if (!labels.has(i.dataset.key!)) labels.set(i.dataset.key!, $("span", i.parentElement!)?.textContent ?? i.value);
  });
  const mk = (k: string, cls: string) => {
    const li = document.createElement("li");
    li.className = cls;
    const t = document.createElement("span");
    t.textContent = labels.get(k) ?? k;
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "x";
    rm.setAttribute("aria-label", `Remove ${t.textContent}`);
    rm.textContent = "×";
    rm.addEventListener("click", () => quote.remove(k));
    li.append(t, rm);
    return li;
  };
  $$("[data-equip-selected]").forEach((ul) => {
    ul.replaceChildren(...list.filter((k) => labels.has(k)).map((k) => mk(k, "chip-sel")));
  });
  const items = $("[data-quote-items]");
  if (items) {
    items.replaceChildren(...list.filter((k) => labels.has(k)).map((k) => mk(k, "qitem")));
    const empty = $("[data-quote-empty]");
    if (empty) empty.hidden = list.length > 0;
    const clr = $<HTMLButtonElement>("[data-quote-clear]");
    if (clr) clr.hidden = list.length === 0;
  }
}

(function quoteInit() {
  // seed from URL (?add=slug / ?solution=slug)
  const params = new URLSearchParams(location.search);
  const add = params.get("add");
  const sol = params.get("solution");
  if (add && /^[a-z0-9-]+$/.test(add)) quote.add("p:" + add);
  if (sol && /^[a-z0-9-]+$/.test(sol)) quote.add("s:" + sol);
  if ((add || sol) && history.replaceState) history.replaceState(null, "", location.pathname);

  $$<HTMLElement>("[data-quote-add]").forEach((b) => {
    b.dataset.label = $("span", b)?.textContent ?? "";
  });
  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const go = t.closest<HTMLElement>("[data-quote-go]");
    if (go) {
      quote.add("p:" + go.dataset.quoteGo); // then follow the link
      return;
    }
    const b = t.closest<HTMLElement>("[data-quote-add]");
    if (b) {
      e.preventDefault();
      const k = "p:" + b.dataset.quoteAdd;
      if (quote.has(k)) {
        quote.remove(k);
        toast(`Removed ${b.dataset.name} from your quote list.`);
      } else {
        quote.add(k);
        toast(`Added ${b.dataset.name}.`, { href: "/request-a-quote/", label: "View quote list" });
      }
    }
    if (t.closest("[data-quote-clear]")) {
      quote.write([]);
    }
  });
  document.addEventListener("change", (e) => {
    const i = e.target as HTMLInputElement;
    if (i.matches?.("input[data-key]")) {
      const list = quote.read();
      quote.write(i.checked ? [...list, i.dataset.key!] : list.filter((x) => x !== i.dataset.key));
    }
  });
  window.addEventListener("storage", (e) => e.key === QKEY && quote.sync());
  quote.sync();
})();

// ------------------------------------------------------------------ enquiry form
(function enquiry() {
  const forms = $$<HTMLFormElement>("form[data-enquiry-form]");
  if (!forms.length) return;
  const MAX = 5 * 1024 * 1024;
  const EXT = /\.(pdf|docx?|xlsx?|jpe?g|png|zip)$/i;

  let token = "";
  fetch("/api/form-token", { headers: { Accept: "application/json" }, cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((j) => {
      token = j.token || "";
      $$<HTMLInputElement>("input[data-token]").forEach((i) => (i.value = token));
    })
    .catch(() => {
      /* backend not reachable: submit will report it */
    });

  if ($(".cf-turnstile")) {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }

  forms.forEach((form) => {
    const summary = $<HTMLElement>("[data-error-summary]", form)!;
    const status = $<HTMLElement>("[data-status]", form)!;
    const submit = $<HTMLButtonElement>("[data-submit]", form)!;
    const val = (n: string) => ((form.elements.namedItem(n) as HTMLInputElement | null)?.value ?? "").trim();

    const clear = () => {
      $$("[data-error-for]", form).forEach((e) => (e.textContent = ""));
      $$("[aria-invalid]", form).forEach((e) => e.removeAttribute("aria-invalid"));
      summary.hidden = true;
      summary.replaceChildren();
    };
    const fieldFor = (name: string) => form.elements.namedItem(name) as HTMLElement | RadioNodeList | null;
    const setErr = (name: string, msg: string, errs: { name: string; msg: string }[]) => {
      errs.push({ name, msg });
      const out = $(`[data-error-for="${name}"]`, form);
      if (out) {
        out.textContent = msg;
        out.id = out.id || `${form.id}-err-${name}`;
      }
      const f = fieldFor(name);
      const el = f instanceof RadioNodeList ? (f[0] as HTMLElement) : f;
      if (el && out) {
        el.setAttribute("aria-invalid", "true");
        el.setAttribute("aria-describedby", out.id);
      }
    };
    const showSummary = (errs: { name: string; msg: string }[]) => {
      const h = document.createElement("strong");
      h.textContent = `Please fix ${errs.length} ${errs.length === 1 ? "item" : "items"} before sending:`;
      const ul = document.createElement("ul");
      errs.forEach((er) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = er.msg;
        a.addEventListener("click", (ev) => {
          ev.preventDefault();
          const f = fieldFor(er.name);
          const el = f instanceof RadioNodeList ? (f[0] as HTMLElement) : f;
          if (el) {
            const d = el.closest("details");
            if (d) d.open = true;
            el.focus();
          }
        });
        li.appendChild(a);
        ul.appendChild(li);
      });
      summary.replaceChildren(h, ul);
      summary.hidden = false;
      summary.focus();
    };

    const validate = () => {
      const errs: { name: string; msg: string }[] = [];
      clear();
      if (val("fullName").length < 2) setErr("fullName", "Enter your full name.", errs);
      if (val("company").length < 2) setErr("company", "Enter your company name.", errs);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("email"))) setErr("email", "Enter a valid business email address.", errs);
      if (val("phone").replace(/\D/g, "").length < 7) setErr("phone", "Enter a phone number including the country code.", errs);
      if (!val("country")) setErr("country", "Select your country.", errs);
      if (!val("industry")) setErr("industry", "Select your industry.", errs);
      if (!$$<HTMLInputElement>('input[name="equipment"]:checked', form).length) setErr("equipment", "Select at least one machine or solution.", errs);
      if (val("description").length < 20) setErr("description", "Describe your project in at least 20 characters.", errs);
      const files = ((form.elements.namedItem("attachments") as HTMLInputElement)?.files ?? []) as FileList;
      if (files.length > 3) setErr("attachments", "Attach no more than 3 files.", errs);
      Array.from(files).forEach((f) => {
        if (f.size > MAX) setErr("attachments", `${f.name} is larger than 5 MB.`, errs);
        else if (!EXT.test(f.name)) setErr("attachments", `${f.name} is not an accepted file type.`, errs);
      });
      if (!(form.elements.namedItem("consent") as HTMLInputElement).checked) setErr("consent", "Please confirm the privacy consent.", errs);
      return errs;
    };

    const fail = (msg: string) => {
      status.className = "form__status form__status--error";
      status.replaceChildren();
      status.append(msg + " You can also email ");
      const a = document.createElement("a");
      a.href = "mailto:info@smarctekllc.com";
      a.textContent = "info@smarctekllc.com";
      status.append(a, ".");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      status.className = "form__status";
      const errs = validate();
      if (errs.length) {
        showSummary(errs);
        return;
      }
      const fd = new FormData(form);
      fd.set("formToken", token || val("formToken"));
      submit.disabled = true;
      const label = $("span", submit)!;
      const old = label.textContent;
      label.textContent = "Sending…";
      try {
        const res = await fetch(form.action, { method: "POST", body: fd, headers: { Accept: "application/json" } });
        let body: { ok?: boolean; errors?: Record<string, string>; error?: string; message?: string } = {};
        try {
          body = await res.json();
        } catch {
          /* non-JSON */
        }
        if (res.ok && body.ok) {
          const done = document.createElement("div");
          done.className = "form__done";
          done.setAttribute("role", "status");
          done.tabIndex = -1;
          const h = document.createElement("h3");
          h.textContent = "Thank you. Your enquiry has been sent.";
          const p = document.createElement("p");
          p.textContent = "Our team will review the details and reply by email. For anything urgent, call +1 (617) 380-9644.";
          done.append(h, p);
          form.replaceWith(done);
          done.focus();
          quote.write([]);
          return;
        }
        if (res.status === 400 && body.errors) {
          const list: { name: string; msg: string }[] = [];
          clear();
          Object.entries(body.errors).forEach(([n, m]) => setErr(n, m, list));
          showSummary(list);
        } else if (res.status === 429) {
          fail("Too many enquiries from this connection. Please try again later.");
        } else if (res.status === 503) {
          fail("The enquiry service is not available right now.");
        } else {
          fail(body.message || "We could not send your enquiry.");
        }
      } catch {
        fail("We could not reach the enquiry service.");
      } finally {
        submit.disabled = false;
        label.textContent = old;
      }
    });
  });
})();
