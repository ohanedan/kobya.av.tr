import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const html = document.documentElement;
const motion = html.classList.contains('motion');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  root.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

let lenis: Lenis | null = null;
let menuOpen = false;
let currentSection: string | null = null;

/* ---------------------------------------------------------------- scrolling */

function initSmoothScroll() {
  if (!motion) return;
  lenis = new Lenis({ lerp: 0.085 });
  lenis.on('scroll', () => ScrollTrigger.update());
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target: HTMLElement | number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, {
      immediate,
      force: true,
      duration: 1.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: motion && !immediate ? 'smooth' : 'auto' });
}

function initAnchors() {
  /*
   * Navigation links carry a full path ("/#iletisim") so that they also work from the question
   * pages, so an in-page jump is recognised by the path rather than by the "#" prefix. Links to
   * another document are left to the browser.
   */
  $$<HTMLAnchorElement>('a[href*="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.hash;
      const samePage = link.host === location.host && link.pathname === location.pathname;
      const target = samePage && hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (!target) return;
      event.preventDefault();
      if (menuOpen) setMenu(false);

      const isTop = hash === '#top';
      scrollToTarget(isTop ? 0 : target);
      history.replaceState(null, '', isTop ? location.pathname : hash);

      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

function scrollToInitialHash() {
  if (location.hash.length < 2) return;
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) window.setTimeout(() => scrollToTarget(target, true), 60);
}

/* ------------------------------------------------------------------- header */

function initHeader() {
  const header = $('[data-header]');
  const progress = $('[data-progress]');
  if (!header) return;

  // The header stays on screen at every scroll position: it is the only navigation, and a visitor
  // who jumped into a section needs it to move on without scrolling back to the top. It only
  // condenses and takes its translucent background once the page has moved.
  const update = (y: number) => {
    header.classList.toggle('is-scrolled', y > 24);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
  };

  if (lenis) lenis.on('scroll', (instance: Lenis) => update(instance.scroll));
  else window.addEventListener('scroll', () => update(window.scrollY), { passive: true });

  update(window.scrollY);
}

function initActiveSection() {
  const links = $$<HTMLAnchorElement>('[data-nav-link]');
  const activate = (section: HTMLElement | null) => {
    currentSection = section?.dataset.section ?? null;
    links.forEach((link) => {
      link.classList.toggle('is-active', !!section && link.hash === `#${section.id}`);
    });
  };

  $$('[data-section]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && activate(section),
    });
  });

  if ($('[data-hero]')) {
    ScrollTrigger.create({
      trigger: '[data-hero]',
      start: 'top top',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && activate(null),
    });
  }
}

function initLangLinks() {
  $$<HTMLAnchorElement>('[data-lang-link]').forEach((link) => {
    link.addEventListener('click', () => {
      if (!currentSection) return;
      const ids = JSON.parse(link.dataset.ids ?? '{}') as Record<string, string>;
      if (ids[currentSection]) link.href = `${link.pathname}#${ids[currentSection]}`;
    });
  });
}

/* --------------------------------------------------------------------- menu */

let menuTimer = 0;

function setMenu(open: boolean) {
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  const menu = $('[data-menu]');
  if (!toggle || !menu) return;

  menuOpen = open;
  window.clearTimeout(menuTimer);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', (open ? toggle.dataset.labelClose : toggle.dataset.labelOpen) ?? '');
  html.classList.toggle('menu-open', open);

  if (open) {
    menu.hidden = false;
    void menu.offsetHeight;
    menu.classList.add('is-open');
    lenis?.stop();
    if (motion) {
      gsap.fromTo(
        $$('.line-inner', menu),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out', delay: 0.25 },
      );
    }
    $('a', menu)?.focus({ preventScroll: true });
  } else {
    menu.classList.remove('is-open');
    lenis?.start();
    menuTimer = window.setTimeout(() => {
      if (!menuOpen) menu.hidden = true;
    }, 800);
  }
}

function initMenu() {
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  if (!toggle) return;

  toggle.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => {
    if (event.matches && menuOpen) setMenu(false);
  });
}

/* -------------------------------------------------------------------- intro */

function heroIntro() {
  if (!$('[data-hero]')) return gsap.timeline();
  return gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .fromTo('[data-hero-grid] span', { scaleY: 0 }, { scaleY: 1, duration: 1.8, ease: 'expo.inOut', stagger: 0.08 }, 0)
    // y: 0 discards the pixel offset GSAP parses from the CSS pre-reveal transform.
    .fromTo('[data-hero-title] .line-inner', { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.15)
    .fromTo('[data-hero-rise]', { y: 24 }, { y: 0, duration: 1.3, stagger: 0.08 }, 0.5)
    .fromTo('[data-hero-fade]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.3 }, 0.75)
    .fromTo('.hero-watermark', { opacity: 0, rotate: -8 }, { opacity: 1, rotate: 0, duration: 2.6 }, 0.2)
    .fromTo('.marquee', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.9);
}

function initIntro() {
  const preloader = $('[data-preloader]');
  const showPreloader = motion && !!preloader && !html.classList.contains('intro-seen');

  if (!showPreloader) {
    preloader?.remove();
    if (motion) heroIntro();
    return;
  }

  try {
    sessionStorage.setItem('kobya-intro', '1');
  } catch {
    /* storage unavailable — intro simply plays again next time */
  }

  lenis?.stop();
  gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    // Kept deliberately short: the hero headline is the LCP element, so it must land within ~2s.
    .to($$('.monogram > *', preloader), { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.06 })
    .to($('.preloader-text', preloader), { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
    .to(preloader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, '+=0.05')
    .add(heroIntro(), '-=0.5')
    .add(() => lenis?.start(), '<')
    .add(() => preloader.remove());
}

/* ------------------------------------------------------------ scroll motion */

function initScrollMotion() {
  // Hero drifts away as the page scrolls. Pages without a hero (the questions) skip this.
  if ($('[data-hero]')) {
    const heroScroll = { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('[data-hero-inner]', { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: heroScroll });
    gsap.to('.hero-watermark', { yPercent: 16, ease: 'none', scrollTrigger: heroScroll });
  }

  // Generic fade-up reveals.
  gsap.set('[data-reveal]', { opacity: 0, y: 30 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (elements) =>
      gsap.to(elements, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1, overwrite: true }),
  });

  // Masked line reveals for headings.
  $$('[data-lines]').forEach((heading) => {
    const lines = $$('.line-inner', heading);
    gsap.set(lines, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: heading,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1 }),
    });
  });

  // Staggered groups (principles, list rows, contact channels…).
  $$('[data-stagger]').forEach((group) => {
    const items = $$('[data-stagger-item]', group);
    const rules = $$('[data-rule]', group);
    gsap.set(items, { opacity: 0, y: 40 });
    gsap.set(rules, { scaleX: 0 });
    ScrollTrigger.create({
      trigger: group,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(items, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09 });
        gsap.to(rules, { scaleX: 1, duration: 1.6, ease: 'expo.inOut', stagger: 0.12 });
      },
    });
  });

  // Attorney emblem: frame wipes in, monogram draws itself.
  const emblem = $('[data-emblem]');
  if (emblem) {
    const frame = $('.emblem-frame', emblem);
    gsap.fromTo(
      frame,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: emblem, start: 'top 80%', once: true },
      },
    );
    gsap.fromTo(
      $$('.emblem-mark > *', emblem),
      { strokeDasharray: 1, strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: emblem, start: 'top 85%', end: 'top 35%', scrub: 1 },
      },
    );
    gsap.fromTo(
      $('[data-emblem-inner]', emblem),
      { yPercent: -6, scale: 1.08 },
      {
        yPercent: 6,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: emblem, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }

}

function initApproach() {
  const pin = $('[data-approach-pin]');
  const track = $('[data-approach-track]');
  const bar = $('[data-approach-bar]');
  if (!pin || !track) return;

  gsap.matchMedia().add('(min-width: 900px)', () => {
    const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
    if (distance() === 0) return;

    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance() * 0.55}`,
        pin: true,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
        },
      },
    });
  });
}

function initMarquee() {
  const track = $('[data-marquee]');
  if (!track) return;

  const loop = gsap.to(track, { xPercent: -50, duration: 60, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    trigger: track,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => loop.paused(!self.isActive),
    onUpdate: (self) => {
      const boost = Math.min(Math.abs(self.getVelocity()) / 300, 6);
      gsap.to(loop, {
        timeScale: 1 + boost,
        duration: 0.25,
        overwrite: true,
        onComplete: () => void gsap.to(loop, { timeScale: 1, duration: 1.4, ease: 'power2.out' }),
      });
    },
  });
}

/* ------------------------------------------------------------- interaction */

function initPractice() {
  const items = $$('[data-practice-item]');

  const setOpen = (item: HTMLElement, open: boolean) => {
    item.classList.toggle('is-open', open);
    $('button', item)?.setAttribute('aria-expanded', String(open));
  };

  items.forEach((item, index) => {
    const button = $<HTMLButtonElement>('button', item);
    button?.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach((other) => other !== item && setOpen(other, false));
      setOpen(item, open);
    });
  });

}

function initPointerEffects() {
  if (!finePointer) return;

  $$('[data-magnetic]').forEach((element) => {
    const strength = 0.3;
    const xTo = gsap.quickTo(element, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(element, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.45)' });
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      xTo((event.clientX - rect.left - rect.width / 2) * strength);
      yTo((event.clientY - rect.top - rect.height / 2) * strength);
    });
    element.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });

  $$('[data-glow-area]').forEach((area) => {
    const glow = $('[data-glow]', area);
    if (!glow) return;
    const rect = area.getBoundingClientRect();
    gsap.set(glow, {
      left: 0,
      top: 0,
      xPercent: -50,
      yPercent: -50,
      x: rect.width * (glow.closest('.contact') ? 0.2 : 0.68),
      y: rect.height * (glow.closest('.contact') ? 0.3 : 0.42),
    });
    const xTo = gsap.quickTo(glow, 'x', { duration: 2, ease: 'power3.out' });
    const yTo = gsap.quickTo(glow, 'y', { duration: 2, ease: 'power3.out' });
    area.addEventListener('pointermove', (event) => {
      const bounds = area.getBoundingClientRect();
      xTo(event.clientX - bounds.left);
      yTo(event.clientY - bounds.top);
    });
  });
}

function initMap() {
  const map = $('[data-map]');
  const button = $<HTMLButtonElement>('[data-map-load]', map ?? document);
  if (!map || !button) return;

  button.addEventListener('click', () => {
    if (map.classList.contains('is-loaded')) return;
    const frame = document.createElement('iframe');
    frame.src = map.dataset.src ?? '';
    frame.title = map.dataset.title ?? '';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.allowFullscreen = true;
    frame.addEventListener('load', () => map.classList.add('is-loaded'), { once: true });
    map.prepend(frame);
    button.disabled = true;
  });
}

function initRefresh() {
  let timer = 0;
  const main = $('main');
  if (main) {
    new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    }).observe(main);
  }
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/* --------------------------------------------------------------------- boot */

html.classList.add('ready');

initSmoothScroll();
initHeader();
initMenu();
initAnchors();
initLangLinks();
initPractice();
initMap();

if (motion) {
  initApproach();
  initScrollMotion();
  initMarquee();
  initPointerEffects();
  initRefresh();
}

initActiveSection();
initIntro();
scrollToInitialHash();
