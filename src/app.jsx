import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   SEO HELMET COMPONENT
   Injects <title>, <meta>, <link> and JSON-LD
   into document.head for each page.
───────────────────────────────────────────── */
const SEO = ({ title, description, canonical, keywords, schema }) => {
  useEffect(() => {
    // Title
    document.title = title;

    const setMeta = (name, content, prop = false) => {
      const selector = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        prop ? el.setAttribute("property", name) : el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
      el.setAttribute("href", href);
    };

    const SITE = "https://www.sharmafastcabs.com";
    const fullCanonical = `${SITE}${canonical}`;

    // Core meta
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMeta("author", "Sharma Fast Cabs");
    setMeta("geo.region", "IN-UK");
    setMeta("geo.placename", "Haldwani, Uttarakhand");
    setMeta("geo.position", "29.2183;79.5130");
    setMeta("ICBM", "29.2183, 79.5130");

    // Open Graph
    setMeta("og:type", "website", true);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", fullCanonical, true);
    setMeta("og:site_name", "Sharma Fast Cabs", true);
    setMeta("og:locale", "en_IN", true);
    setMeta("og:image", `${SITE}/images/og-cover.jpg`, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", `${SITE}/images/og-cover.jpg`);

    // Canonical
    setLink("canonical", fullCanonical);

    // JSON-LD structured data
    const schemaId = "schema-ld";
    let schemaEl = document.getElementById(schemaId);
    if (!schemaEl) { schemaEl = document.createElement("script"); schemaEl.id = schemaId; schemaEl.type = "application/ld+json"; document.head.appendChild(schemaEl); }
    schemaEl.textContent = JSON.stringify(schema);

  }, [title, description, canonical, keywords, schema]);

  return null;
};

/* ─────────────────────────────────────────────
   SHARED SCHEMA FRAGMENTS
───────────────────────────────────────────── */
const BASE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": "https://www.sharmafastcabs.com/#organization",
  "name": "Sharma Fast Cabs",
  "alternateName": ["Sharma Cabs", "Sharma Fast Cab Haldwani"],
  "url": "https://www.sharmafastcabs.com",
  "logo": "https://www.sharmafastcabs.com/images/logo.png",
  "image": "https://www.sharmafastcabs.com/images/og-cover.jpg",
  "description": "Sharma Fast Cabs is Uttarakhand's most trusted cab and tour operator since 2009. We offer cab services, holiday packages, Char Dham Yatra, Kedarnath tours, Jim Corbett safari and more.",
  "telephone": "+918979331110",
  "email": "sharmafastcabs@gmail.com",
  "foundingDate": "2009",
  "priceRange": "₹₹",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, UPI, Bank Transfer",
  "openingHours": "Mo-Su 00:00-23:59",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Haldwani",
    "addressLocality": "Haldwani",
    "addressRegion": "Uttarakhand",
    "postalCode": "263139",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 29.2183,
    "longitude": 79.5130
  },
  "areaServed": [
    "Uttarakhand","Delhi","Noida","Ghaziabad","Haldwani","Nainital",
    "Haridwar","Rishikesh","Mussoorie","Dehradun","Jim Corbett",
    "Kedarnath","Badrinath","Char Dham"
  ],
  "sameAs": [
    "https://wa.me/918979331110",
    "https://www.google.com/maps?q=Sharma+Fast+Cabs+Haldwani"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Cab & Tour Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Haldwani to Delhi Cab Service" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Char Dham Yatra Package" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Kedarnath Tour Package" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Jim Corbett Safari Package" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Delhi Airport Transfer Uttarakhand" } },
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "387",
    "bestRating": "5",
    "worstRating": "1"
  }
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --gold:     #F5A623;
      --gold-dk:  #D4880A;
      --rust:     #C0392B;
      --teal:     #0D6E6E;
      --teal-lt:  #14A3A3;
      --night:    #0B1120;
      --ink:      #1A2233;
      --sand:     #FDF6EC;
      --mist:     #F0F4F8;
      --white:    #FFFFFF;
      --text:     #2D3748;
      --text-lt:  #718096;
    }

    body { font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--white); }
    h1,h2,h3,h4 { font-family: 'Playfair Display', serif; }

    /* ── NAV ── */
    .nav-wrap {
      position: sticky; top: 0; z-index: 1000;
      background: rgba(11,17,32,0.97);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(245,166,35,0.2);
    }
    .nav-top-bar {
      background: var(--teal);
      display: flex; align-items: center; justify-content: flex-end;
      padding: 0.35rem 2rem; gap: 1.5rem;
      font-size: 0.78rem; color: rgba(255,255,255,0.9);
    }
    .nav-top-bar a { color: rgba(255,255,255,0.9); text-decoration: none; display: flex; align-items: center; gap: 0.4rem; }
    .nav-top-bar a:hover { color: var(--gold); }
    .nav-main {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2rem; height: 64px;
    }
    .nav-logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem; font-weight: 900;
      color: var(--gold); letter-spacing: 0.02em; text-decoration: none;
    }
    .nav-logo span { color: var(--white); }
    .nav-links { display: flex; gap: 0.25rem; align-items: center; }
    .nav-link {
      color: rgba(255,255,255,0.75); text-decoration: none;
      font-size: 0.875rem; font-weight: 500; letter-spacing: 0.04em;
      padding: 0.45rem 0.85rem; border-radius: 6px;
      transition: color 0.2s, background 0.2s;
    }
    .nav-link:hover { color: var(--gold); background: rgba(245,166,35,0.1); }
    .nav-cta {
      background: var(--gold) !important; color: var(--night) !important;
      font-weight: 700 !important; border-radius: 6px !important;
    }
    .nav-cta:hover { background: var(--gold-dk) !important; }

    .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; }
    .hamburger span { display: block; width: 22px; height: 2px; background: var(--white); margin: 5px 0; border-radius: 2px; transition: all 0.3s; }
    .mobile-menu {
      display: none; flex-direction: column; background: var(--ink);
      border-top: 1px solid rgba(245,166,35,0.2); padding: 1rem;
    }
    .mobile-menu.open { display: flex; }
    .mobile-link {
      color: rgba(255,255,255,0.8); text-decoration: none; padding: 0.75rem 1rem;
      border-radius: 8px; font-weight: 500; font-size: 0.95rem;
      transition: background 0.2s, color 0.2s;
    }
    .mobile-link:hover { background: rgba(245,166,35,0.1); color: var(--gold); }
    .mobile-cta {
      background: var(--gold); color: var(--night) !important; font-weight: 700;
      text-align: center; margin-top: 0.5rem; border-radius: 8px;
    }
    .mobile-phone {
      color: var(--gold) !important; border: 1px solid rgba(245,166,35,0.3);
      text-align: center; margin-top: 0.5rem; border-radius: 8px;
    }

    @media(max-width:820px) {
      .nav-links { display: none; }
      .hamburger { display: block; }
      .nav-top-bar { display: none; }
    }

    /* ── BREADCRUMB ── */
    .breadcrumb {
      background: var(--mist); padding: 0.6rem 2rem;
      font-size: 0.8rem; color: var(--text-lt);
      display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;
    }
    .breadcrumb a { color: var(--teal); text-decoration: none; font-weight: 500; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb span { color: var(--text-lt); }

    /* ── HERO ── */
    .hero {
      position: relative; height: 92vh; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background-size: cover; background-position: center;
      transition: background-image 0.8s ease;
    }
    .hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(11,17,32,0.78) 0%, rgba(13,110,110,0.45) 100%);
    }
    .hero-content { position: relative; text-align: center; color: var(--white); padding: 0 1.5rem; }
    .hero-badge {
      display: inline-block; background: rgba(245,166,35,0.15);
      border: 1px solid rgba(245,166,35,0.5); color: var(--gold);
      font-size: 0.8rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
      padding: 0.4rem 1.1rem; border-radius: 999px; margin-bottom: 1.2rem;
      animation: fadeUp 0.6s ease both;
    }
    .hero-title {
      font-size: clamp(2.6rem, 6vw, 5rem); font-weight: 900; line-height: 1.05;
      margin-bottom: 1rem; animation: fadeUp 0.7s 0.1s ease both;
    }
    .hero-title .accent { color: var(--gold); }
    .hero-sub {
      font-size: 1.2rem; color: rgba(255,255,255,0.8); margin-bottom: 2rem;
      animation: fadeUp 0.7s 0.2s ease both;
    }
    .hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.7s 0.3s ease both; }
    .btn-primary {
      background: var(--gold); color: var(--night); font-weight: 700;
      padding: 0.85rem 2rem; border-radius: 8px; border: none; cursor: pointer;
      font-size: 1rem; font-family: 'DM Sans', sans-serif;
      transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(245,166,35,0.4);
    }
    .btn-primary:hover { background: var(--gold-dk); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,166,35,0.5); }
    .btn-outline {
      background: transparent; color: var(--white); font-weight: 600;
      padding: 0.85rem 2rem; border-radius: 8px; border: 2px solid rgba(255,255,255,0.5);
      cursor: pointer; font-size: 1rem; font-family: 'DM Sans', sans-serif;
      transition: border-color 0.2s, background 0.2s, transform 0.15s;
    }
    .btn-outline:hover { border-color: var(--white); background: rgba(255,255,255,0.08); transform: translateY(-2px); }
    .slider-dots { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem; }
    .dot { width: 8px; height: 8px; border-radius: 999px; background: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.3s; }
    .dot.active { background: var(--gold); width: 24px; }

    /* ── STATS ── */
    .stats-band {
      background: var(--night); color: var(--white);
      display: grid; grid-template-columns: repeat(4, 1fr); text-align: center;
      padding: 2.2rem 2rem; gap: 1rem;
    }
    @media(max-width:600px) { .stats-band { grid-template-columns: repeat(2,1fr); } }
    .stat-val { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: var(--gold); font-weight: 900; }
    .stat-lbl { font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-top: 0.25rem; }

    /* ── SECTIONS ── */
    .section { padding: 5rem 2rem; }
    .section-alt { background: var(--sand); }
    .section-dark { background: var(--night); color: var(--white); }
    .section-teal { background: linear-gradient(135deg, var(--teal) 0%, #0A4F4F 100%); color: var(--white); }
    .section-tag {
      display: inline-block; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--gold); margin-bottom: 0.6rem;
    }
    .section-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; margin-bottom: 1rem; line-height: 1.1; }
    .section-sub { color: var(--text-lt); max-width: 560px; margin: 0 auto 3rem; font-size: 1.05rem; line-height: 1.7; }
    .section-sub.light { color: rgba(255,255,255,0.65); }
    .text-center { text-align: center; }

    /* ── CARDS ── */
    .cards-grid { display: grid; gap: 1.75rem; }
    .cards-grid-3 { grid-template-columns: repeat(3, 1fr); }
    .cards-grid-2 { grid-template-columns: repeat(2, 1fr); }
    @media(max-width:900px) { .cards-grid-3,.cards-grid-2 { grid-template-columns: 1fr 1fr; } }
    @media(max-width:580px) { .cards-grid-3,.cards-grid-2 { grid-template-columns: 1fr; } }
    .card {
      background: var(--white); border-radius: 16px; overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      transition: transform 0.25s, box-shadow 0.25s;
      display: flex; flex-direction: column;
    }
    .card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.13); }
    .card-img { width: 100%; height: 220px; object-fit: cover; display: block; }
    .card-body { padding: 1.4rem; flex: 1; display: flex; flex-direction: column; }
    .card-tag {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--teal); background: rgba(13,110,110,0.1); display: inline-block;
      padding: 0.25rem 0.6rem; border-radius: 4px; margin-bottom: 0.6rem;
    }
    .card-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.35rem; }
    .card-meta { font-size: 0.83rem; color: var(--text-lt); margin-bottom: 0.5rem; }
    .card-desc { font-size: 0.9rem; color: var(--text-lt); line-height: 1.6; flex: 1; }
    .card-price { font-size: 1.4rem; font-family: 'Playfair Display', serif; font-weight: 900; color: var(--rust); margin: 0.8rem 0; }
    .card-actions { display: flex; gap: 0.75rem; margin-top: auto; padding-top: 0.75rem; }
    .btn-card-enq {
      flex: 1; background: var(--gold); color: var(--night); font-weight: 700;
      padding: 0.65rem; border-radius: 8px; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-card-enq:hover { background: var(--gold-dk); transform: translateY(-1px); }
    .btn-card-view {
      flex: 1; background: transparent; color: var(--teal); font-weight: 600;
      padding: 0.65rem; border-radius: 8px; border: 2px solid var(--teal);
      cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
      transition: background 0.2s, color 0.2s;
    }
    .btn-card-view:hover { background: var(--teal); color: var(--white); }

    /* ── MODAL ── */
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(11,17,32,0.85); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    .modal-box {
      background: var(--white); border-radius: 20px; max-width: 680px; width: 100%;
      max-height: 90vh; overflow-y: auto; box-shadow: 0 32px 80px rgba(0,0,0,0.4);
      animation: slideUp 0.3s ease;
    }
    .modal-img { width: 100%; height: 260px; object-fit: cover; border-radius: 20px 20px 0 0; }
    .modal-body { padding: 2rem; }
    .modal-tag {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--teal); background: rgba(13,110,110,0.1);
      padding: 0.3rem 0.7rem; border-radius: 4px; display: inline-block; margin-bottom: 0.8rem;
    }
    .modal-title { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; }
    .modal-price { font-size: 2rem; font-family: 'Playfair Display', serif; color: var(--rust); font-weight: 900; margin-bottom: 1.2rem; }
    .modal-price small { font-size: 0.85rem; color: var(--text-lt); font-family: 'DM Sans', sans-serif; font-weight: 400; }
    .modal-section { margin-bottom: 1.4rem; }
    .modal-section h4 { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--teal); margin-bottom: 0.6rem; }
    .modal-section p { font-size: 0.95rem; color: var(--text-lt); line-height: 1.75; }
    .modal-list { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
    .modal-list li { font-size: 0.9rem; color: var(--text); display: flex; align-items: flex-start; gap: 0.6rem; }
    .modal-list li::before { content: "✓"; color: var(--teal); font-weight: 700; flex-shrink: 0; margin-top: 0.05rem; }
    .modal-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.6rem; }
    .modal-pill {
      background: var(--sand); border: 1px solid rgba(13,110,110,0.2);
      color: var(--text); font-size: 0.8rem; padding: 0.3rem 0.75rem; border-radius: 999px;
    }
    .modal-actions { display: flex; gap: 1rem; margin-top: 1.8rem; }
    .modal-close {
      position: absolute; top: 1rem; right: 1rem;
      background: rgba(11,17,32,0.6); color: var(--white); border: none;
      border-radius: 50%; width: 36px; height: 36px; cursor: pointer;
      font-size: 1rem; display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .modal-close:hover { background: var(--rust); }
    .modal-img-wrap { position: relative; }

    /* ── FEATURES ── */
    .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; }
    @media(max-width:700px) { .features-grid { grid-template-columns:1fr; } }
    .feature-card {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px; padding: 2rem 1.5rem; text-align: center;
      transition: background 0.2s, transform 0.2s;
    }
    .feature-card:hover { background: rgba(255,255,255,0.09); transform: translateY(-4px); }
    .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .feature-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--gold); }
    .feature-desc { font-size: 0.88rem; color: rgba(255,255,255,0.6); line-height: 1.65; }

    /* ── SERVICES ── */
    .svc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
    @media(max-width:900px) { .svc-grid { grid-template-columns:1fr 1fr; } }
    @media(max-width:580px) { .svc-grid { grid-template-columns:1fr; } }
    .svc-card {
      background: var(--white); border-radius: 12px; padding: 1.3rem 1.2rem;
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      border-left: 4px solid var(--teal);
      transition: box-shadow 0.2s, transform 0.2s; cursor: pointer;
    }
    .svc-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateX(3px); }
    .svc-name { font-weight: 600; font-size: 0.92rem; flex: 1; }
    .svc-btns { display: flex; gap: 0.5rem; flex-shrink: 0; }
    .btn-svc {
      background: var(--gold); color: var(--night); font-weight: 700;
      padding: 0.45rem 1rem; border-radius: 6px; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.8rem; white-space: nowrap;
      transition: background 0.2s;
    }
    .btn-svc:hover { background: var(--gold-dk); }
    .btn-svc-view {
      background: transparent; color: var(--teal); font-weight: 600;
      padding: 0.45rem 0.8rem; border-radius: 6px; border: 2px solid var(--teal);
      cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; white-space: nowrap;
      transition: background 0.2s, color 0.2s;
    }
    .btn-svc-view:hover { background: var(--teal); color: var(--white); }

    /* ── DESTINATIONS ── */
    .dest-tag-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
    @media(max-width:800px) { .dest-tag-grid { grid-template-columns:1fr 1fr; } }
    @media(max-width:500px) { .dest-tag-grid { grid-template-columns:1fr; } }
    .dest-tag-card {
      position: relative; border-radius: 16px; overflow: hidden; cursor: pointer;
      height: 240px; transition: transform 0.25s, box-shadow 0.25s;
    }
    .dest-tag-card:hover { transform: scale(1.03); box-shadow: 0 16px 40px rgba(0,0,0,0.2); }
    .dest-tag-card img { width: 100%; height: 100%; object-fit: cover; }
    .dest-tag-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(0deg, rgba(11,17,32,0.75) 0%, transparent 60%);
    }
    .dest-tag-label {
      position: absolute; bottom: 1.2rem; left: 1.2rem;
      color: var(--white); font-family: 'Playfair Display', serif;
      font-size: 1.3rem; font-weight: 700;
    }
    .dest-tag-badge {
      position: absolute; top: 1rem; right: 1rem;
      background: var(--gold); color: var(--night); font-size: 0.72rem; font-weight: 700;
      padding: 0.3rem 0.7rem; border-radius: 999px; letter-spacing: 0.05em;
    }

    /* ── TESTIMONIALS ── */
    .testi-card {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px; padding: 2rem;
    }
    .testi-stars { color: var(--gold); font-size: 1.1rem; margin-bottom: 1rem; letter-spacing: 0.1em; }
    .testi-text { color: rgba(255,255,255,0.8); line-height: 1.75; font-style: italic; margin-bottom: 1.5rem; }
    .testi-author { font-weight: 700; color: var(--white); }
    .testi-city { font-size: 0.82rem; color: rgba(255,255,255,0.45); }

    /* ── FAQ ── */
    .faq-item {
      border-bottom: 1px solid rgba(0,0,0,0.08); padding: 1.2rem 0;
    }
    .faq-question {
      width: 100%; background: none; border: none; text-align: left; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
      color: var(--text); display: flex; justify-content: space-between; align-items: center; gap: 1rem;
      padding: 0;
    }
    .faq-question:hover { color: var(--teal); }
    .faq-answer { font-size: 0.92rem; color: var(--text-lt); line-height: 1.75; margin-top: 0.8rem; }
    .faq-chevron { font-size: 0.8rem; transition: transform 0.25s; flex-shrink: 0; color: var(--teal); }
    .faq-chevron.open { transform: rotate(180deg); }

    /* ── CONTACT ── */
    .contact-wrap { display: grid; grid-template-columns: 1fr 1.4fr; gap: 3rem; max-width: 1000px; margin: 0 auto; }
    @media(max-width:820px) { .contact-wrap { grid-template-columns:1fr; } }
    .contact-info h2 { font-size: 2rem; margin-bottom: 1rem; }
    .contact-detail { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
    .contact-detail-icon { font-size: 1.4rem; background: rgba(245,166,35,0.15); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .contact-detail-text strong { display: block; font-weight: 600; margin-bottom: 0.2rem; }
    .contact-detail-text span { color: var(--text-lt); font-size: 0.9rem; }
    .form-card { background: var(--white); border-radius: 20px; padding: 2.5rem; box-shadow: 0 8px 40px rgba(0,0,0,0.1); }
    .form-card h3 { font-size: 1.5rem; margin-bottom: 0.4rem; }
    .form-card p { color: var(--text-lt); margin-bottom: 1.8rem; font-size: 0.9rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media(max-width:580px) { .form-row { grid-template-columns:1fr; } }
    .form-group { margin-bottom: 1rem; }
    .form-label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text); }
    .form-input, .form-select, .form-textarea {
      width: 100%; padding: 0.8rem 1rem; border: 2px solid #E2E8F0; border-radius: 10px;
      font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--text);
      background: var(--white); transition: border-color 0.2s, box-shadow 0.2s; outline: none;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,110,110,0.12);
    }
    .form-textarea { resize: vertical; min-height: 110px; }
    .btn-whatsapp {
      width: 100%; background: #25D366; color: var(--white); font-weight: 700;
      padding: 1rem; border-radius: 10px; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 1rem;
      display: flex; align-items: center; justify-content: center; gap: 0.6rem;
      transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
      box-shadow: 0 4px 16px rgba(37,211,102,0.35);
    }
    .btn-whatsapp:hover { background: #1da851; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,211,102,0.45); }

    /* ── PAGE HERO ── */
    .page-hero {
      background: linear-gradient(135deg, var(--night) 0%, var(--teal) 100%);
      padding: 4rem 2rem; text-align: center; color: var(--white);
    }
    .page-hero h1 { font-size: clamp(2rem,5vw,3.2rem); margin-bottom: 0.6rem; }
    .page-hero p { color: rgba(255,255,255,0.65); font-size: 1rem; }

    .about-hero {
      background: linear-gradient(135deg, var(--night) 0%, var(--teal) 100%);
      padding: 5rem 2rem; text-align: center; color: var(--white);
    }
    .about-hero h1 { font-size: clamp(2rem,5vw,3.5rem); margin-bottom: 1rem; }
    .about-hero p { color: rgba(255,255,255,0.7); font-size: 1.1rem; }

    /* ── CTA STRIP ── */
    .cta-strip {
      background: linear-gradient(90deg, var(--gold) 0%, #F7C05A 100%);
      padding: 2.5rem 2rem; text-align: center;
    }
    .cta-strip h2 { font-size: 1.8rem; color: var(--night); margin-bottom: 0.5rem; }
    .cta-strip p { color: rgba(11,17,32,0.65); margin-bottom: 1.5rem; }
    .btn-dark {
      background: var(--night); color: var(--white); font-weight: 700;
      padding: 0.85rem 2.2rem; border-radius: 8px; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 1rem;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-dark:hover { background: var(--ink); transform: translateY(-2px); }

    .btn-back {
      background: var(--ink); color: var(--white); border: none; padding: 0.6rem 1.4rem;
      border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif;
      font-weight: 600; transition: background 0.2s;
    }
    .btn-back:hover { background: var(--teal); }

    /* ── FOOTER ── */
    .footer { background: var(--night); border-top: 1px solid rgba(245,166,35,0.15); }
    .footer-main {
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem;
      max-width: 1200px; margin: 0 auto; padding: 4rem 2rem 3rem;
    }
    @media(max-width:900px) { .footer-main { grid-template-columns: 1fr 1fr; gap: 2rem; } }
    @media(max-width:560px) { .footer-main { grid-template-columns: 1fr; } }
    .footer-brand-logo {
      font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900;
      color: var(--gold); margin-bottom: 1rem; display: block; text-decoration: none;
    }
    .footer-brand-logo span { color: var(--white); }
    .footer-brand-desc { color: rgba(255,255,255,0.45); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.5rem; }
    .footer-contact-item {
      display: flex; align-items: center; gap: 0.6rem;
      color: rgba(255,255,255,0.7); font-size: 0.88rem; margin-bottom: 0.6rem; text-decoration: none;
    }
    .footer-contact-item:hover { color: var(--gold); }
    .footer-contact-item .icon { font-size: 1rem; width: 20px; flex-shrink: 0; }
    .footer-col h4 {
      font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.2rem;
    }
    .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
    .footer-links a {
      color: rgba(255,255,255,0.55); text-decoration: none; font-size: 0.88rem;
      transition: color 0.2s; display: flex; align-items: center; gap: 0.4rem;
    }
    .footer-links a:hover { color: var(--gold); }
    .footer-links a::before { content: "›"; color: var(--teal); font-weight: 700; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.07);
      padding: 1.25rem 2rem;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;
      max-width: 1200px; margin: 0 auto;
    }
    .footer-bottom-text { color: rgba(255,255,255,0.35); font-size: 0.8rem; }
    .footer-bottom-text span { color: var(--gold); }
    .footer-socials { display: flex; gap: 0.75rem; }
    .footer-social {
      width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.5); font-size: 0.9rem;
      text-decoration: none; transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .footer-social:hover { border-color: var(--gold); color: var(--gold); background: rgba(245,166,35,0.08); }
    .footer-wrap { border-top: 1px solid rgba(245,166,35,0.15); }

    /* ── SKIP LINK (accessibility) ── */
    .skip-link {
      position: absolute; top: -100px; left: 1rem; z-index: 99999;
      background: var(--gold); color: var(--night); padding: 0.6rem 1.2rem;
      border-radius: 0 0 8px 8px; font-weight: 700; text-decoration: none;
      transition: top 0.2s;
    }
    .skip-link:focus { top: 0; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const slides = [
  { img: "/images/goa.jpg", dest: "Goa", text: "Sun, Sand & Sea Await" },
  { img: "/images/jaipur.jpg", dest: "Jaipur", text: "The Pink City Beckons" },
  { img: "/images/manali.jpg", dest: "Manali", text: "Mountains Call Your Name" },
];

const packagesData = [
  {
    name: "Mussoorie Weekend Escape", duration: "3 Days / 2 Nights", price: "",
    desc: "Relaxing weekend in Mussoorie with sightseeing and comfortable stays.",
    img: "/images/mussoorie.jpg", tag: "Hill Station",
    longDesc: "Escape to the 'Queen of Hills' for a rejuvenating weekend. Stroll along the famous Mall Road, visit the stunning Kempty Falls, and enjoy panoramic views of the Himalayas from Lal Tibba. Our handpicked hotels ensure you sleep comfortably after each full day of exploration.",
    highlights: ["Mall Road evening stroll","Kempty Falls visit","Lal Tibba sunrise viewpoint","Camel's Back Road walk","Local cuisine dinner experience"],
    includes: ["Pickup & drop from Dehradun/Delhi","2 nights hotel stay (double occupancy)","Daily breakfast","Experienced local driver-guide","All toll & parking"],
    itinerary: ["Day 1: Pickup → check-in → Mall Road & Kempty Falls","Day 2: Lal Tibba → Camel's Back → Company Garden","Day 3: Bhatta Falls → departure"],
  },
  {
    name: "Nainital Family Tour", duration: "4 Days / 3 Nights", price: "",
    desc: "Family-friendly itinerary with lake visits and viewpoints.",
    img: "/images/nainital.jpg", tag: "Hill Station",
    longDesc: "Nainital is the perfect family destination, built around the gorgeous Naini Lake. Enjoy a relaxing boating session, visit the famous Naina Devi Temple, take a cable car ride to Snow View Point, and let the kids enjoy the Zoo.",
    highlights: ["Naini Lake boating","Snow View Point cable car","Naina Devi Temple darshan","Nainital Zoo","Tiffin Top trekking trail"],
    includes: ["Pickup & drop from Haldwani/Delhi","3 nights hotel stay","Breakfast & dinner daily","All sightseeing by cab","Parking & toll charges"],
    itinerary: ["Day 1: Arrival → Naini Lake → Mall Road","Day 2: Snow View → Naina Devi Temple","Day 3: Tiffin Top → Zoo → local market","Day 4: Sattal Lake → departure"],
  },
  {
    name: "Char Dham Yatra", duration: "10 Days / 9 Nights", price: "",
    desc: "Complete pilgrimage package with guided transfers and stays.",
    img: "/images/chardham.jpg", tag: "Spiritual",
    longDesc: "Embark on the most sacred journey in Hinduism — visiting Yamunotri, Gangotri, Kedarnath and Badrinath. Our expert team handles every detail of this challenging high-altitude pilgrimage.",
    highlights: ["Yamunotri temple darshan","Gangotri Ganga source","Kedarnath Jyotirlinga","Badrinath Vishnu shrine","Ganga Aarti at Haridwar/Rishikesh"],
    includes: ["All cab transfers Haridwar ↔ Char Dham","9 nights hotel/camp stays","All meals (breakfast + dinner)","Expert religious guide","Mule/doli arrangement for Kedarnath","Emergency medical support"],
    itinerary: ["Day 1-2: Haridwar → Yamunotri","Day 3-4: Gangotri","Day 5-6: Kedarnath","Day 7-8: Badrinath","Day 9: Rishikesh","Day 10: Departure"],
  },
  {
    name: "Rishikesh Adventure Package", duration: "3 Days / 2 Nights", price: "",
    desc: "Rafting, camping and yoga for adventure lovers.",
    img: "/images/rishikesh.jpg", tag: "Adventure",
    longDesc: "Rishikesh is the adventure capital of India. Experience the adrenaline rush of Grade III-IV rapids on the Ganges, spend a night under the stars at a riverside camp, practice yoga at dawn.",
    highlights: ["16 km white-water rafting","Riverside camping under stars","Bungee jumping option (add-on)","Yoga & meditation session","Laxman Jhula & Ram Jhula walk"],
    includes: ["2 nights riverside camp stay","All meals at camp","Rafting with certified guides & safety gear","Pickup & drop Haridwar/Dehradun","All permits & entry fees"],
    itinerary: ["Day 1: Arrival → evening Ganga Aarti","Day 2: Morning yoga → Rafting → campfire","Day 3: Yoga → Laxman Jhula → departure"],
  },
  {
    name: "Haridwar Spiritual Retreat", duration: "2 Days / 1 Night", price: "",
    desc: "Experience Ganga aarti and peaceful spiritual vibes.",
    img: "/images/haridwar.jpg", tag: "Spiritual",
    longDesc: "Haridwar, where the Ganga descends from the mountains to the plains, is one of the seven holiest cities in Hinduism. Witness the breathtaking Ganga Aarti at Har Ki Pauri at dusk.",
    highlights: ["Ganga Aarti at Har Ki Pauri","Holy dip in the Ganga","Mansa Devi Temple via cable car","Chandi Devi Temple visit","Local market & prasad shopping"],
    includes: ["1 night hotel near Har Ki Pauri","Breakfast included","Cab pickup & drop (Delhi / Dehradun)","All temple entry & cable car tickets","Local escort guide"],
    itinerary: ["Day 1: Arrival → Mansa Devi → Ganga Aarti at sunset","Day 2: Morning dip → Chandi Devi → departure"],
  },
  {
    name: "Auli Skiing Getaway", duration: "4 Days / 3 Nights", price: "",
    desc: "Snow adventure with skiing and Himalayan views.",
    img: "/images/auli.jpg", tag: "Adventure",
    longDesc: "Auli is one of India's premier ski resorts, offering pristine slopes with a jaw-dropping backdrop of Nanda Devi and other Himalayan peaks.",
    highlights: ["Skiing on Auli slopes (beginner to advanced)","Auli Gondola (longest ropeway in Asia)","Nanda Devi viewpoint","Gurso Bugyal meadow trek","Joshimath sightseeing"],
    includes: ["3 nights hotel/resort in Auli/Joshimath","Breakfast & dinner daily","Skiing equipment rental","Certified ski instructor (2 hrs/day)","Ropeway tickets","Cab transfers from Haridwar"],
    itinerary: ["Day 1: Haridwar → Joshimath → Auli check-in","Day 2-3: Skiing sessions & Nanda Devi views","Day 4: Gurso Bugyal → departure"],
  },
  {
    name: "Jim Corbett Safari", duration: "2 Days / 1 Night", price: "",
    desc: "Wildlife safari and jungle exploration.",
    img: "/images/jimcorbett.jpg", tag: "Wildlife",
    longDesc: "Jim Corbett National Park — India's oldest national park and home to the magnificent Bengal Tiger. Our package includes two safari sessions (dawn and dusk) in the core zones.",
    highlights: ["Jeep safari in Bijrani/Dhikala zone","Bengal Tiger spotting opportunity","Elephant, leopard, deer & bird watching","Expert naturalist guide","Riverside nature walk"],
    includes: ["1 night jungle resort stay","All meals at resort","2 jeep safari sessions with permits","Forest department fees","Cab transfers from Delhi/Haldwani"],
    itinerary: ["Day 1: Arrive → evening safari → campfire dinner","Day 2: Dawn safari → naturalist walk → departure"],
  },
  {
    name: "Kedarnath Pilgrimage", duration: "5 Days / 4 Nights", price: "",
    desc: "Peaceful spiritual journey with safe arrangements.",
    img: "/images/chardham.jpg", tag: "Spiritual",
    longDesc: "Kedarnath, one of the 12 Jyotirlingas of Lord Shiva, sits at 3,583 metres in the Garhwal Himalayas. Our package takes the stress out of this challenging trek.",
    highlights: ["Kedarnath temple darshan","Trek through scenic Mandakini valley","Vasuki Tal lake (optional add-on)","Gaurikund hot springs dip","Triyuginarayan temple visit"],
    includes: ["4 nights stay (Haridwar/Guptkashi/Kedarnath)","All meals included","Mule arrangement for the trek (optional)","Expert pilgrim guide","Cab transfers Haridwar ↔ Gaurikund"],
    itinerary: ["Day 1: Haridwar → Guptkashi","Day 2: Gaurikund → Kedarnath trek","Day 3: Temple darshan → return to Gaurikund","Day 4: Guptkashi → Rishikesh","Day 5: Rishikesh → departure"],
  },
  {
    name: "Badrinath Spiritual Tour", duration: "5 Days / 4 Nights", price: "",
    desc: "Divine experience with guided temple visits.",
    img: "/images/badrinath.jpg", tag: "Spiritual",
    longDesc: "Badrinath, the abode of Lord Vishnu, is one of the four holy dhams and part of the Chota Char Dham circuit. Situated on the banks of the Alaknanda River with the Neelkanth peak.",
    highlights: ["Badrinath temple darshan (Vishnu)","Mana Village — last Indian village before Tibet border","Vasudhara Falls trek","Brahma Kapal (ancestral rites site)","Tapt Kund hot springs"],
    includes: ["4 nights stay (Haridwar/Joshimath/Badrinath)","All meals","Expert religious guide","Cab transfers Haridwar ↔ Badrinath","All entry fees & permits"],
    itinerary: ["Day 1: Haridwar → Joshimath","Day 2: Joshimath → Badrinath darshan","Day 3: Mana Village → Vasudhara Falls","Day 4: Joshimath → Rishikesh","Day 5: Rishikesh → departure"],
  },
  {
    name: "Almora Cultural Escape", duration: "3 Days / 2 Nights", price: "",
    desc: "Explore Kumaoni culture and scenic hill views.",
    img: "/images/almora.jpg", tag: "Hill Station",
    longDesc: "Almora is the cultural heart of Kumaon — a beautiful hilltown that has inspired poets, writers and spiritual seekers for centuries.",
    highlights: ["Kasar Devi Temple (cosmic energy zone)","Nanda Devi Temple in old bazaar","Bright End Corner sunrise viewpoint","Gobind Ballabh Pant Museum","Almora bal mithai & local craft shopping"],
    includes: ["2 nights heritage hotel stay","Breakfast daily","Cab pickup & drop Haldwani/Delhi","Sightseeing by cab","Local culture guide (half day)"],
    itinerary: ["Day 1: Arrival → Bright End Corner → old bazaar walk","Day 2: Kasar Devi → Nanda Devi Temple → museum","Day 3: Sunrise view → departure"],
  },
];

const servicesData = [
  "Haldwani to Delhi","Rudrapur to Delhi","Ramnagar to Delhi","Khatima to Delhi",
  "Vanvasa to Delhi","Delhi Airport to All Over Uttarakhand","Rampur to Delhi",
  "Ghaziabad to Haldwani","Noida to Haldwani","Pantnagar Airport to Delhi NCR",
  "Cab Service","Local Car Rental","Airport Taxi","Ayodhya Temple Tour",
  "Prayagraj Yatra Tour","Kashi – Ayodhya – Prayagraj Tour","Mathura – Vrindavan – Agra Tour",
  "Bareilly Airport Cab Service","Pantnagar Airport Cab Service","Pantnagar University to Delhi Cab",
  "Jim Corbett Tour","Jageshwar Temple Tour","Agra Tour","Ranikhet Tour",
  "Kainchi Dham Temple Tour","All over Uttarakhand","Custom Services","Agra","Ajmer",
  "Almora To Delhi Taxi","Almora","Ayodhya","Badrinath To Haridwar","Badrinath",
  "Bageshwar To Delhi Taxi","Banaras","Chamoli To Delhi Taxi","Champawat To Delhi Taxi",
  "Dehradun To Delhi Taxi","Dehradun","Delhi Cabs Services","Delhi To Almora Taxi",
  "Delhi To Bageshwar Taxi","Delhi To Chamoli Taxi","Delhi To Champawat Taxi",
  "Delhi To Dehradun Taxi","Delhi To Haridwar Taxi","Delhi To Nainital Taxi",
  "Delhi To Pauri Garhwal Taxi","Delhi To Pithoragarh Taxi","Delhi To Rudraprayag Taxi",
  "Delhi To Tehri Garhwal Taxi","Delhi To Udham Singh Nagar Taxi","Delhi To Uttarkashi Taxi",
  "Gaya","Haridwar To Badrinath","Haridwar To Char Dham","Haridwar To Delhi Taxi",
  "Haridwar To Kedarnath","Haridwar To Tungnath","Haridwar","Jaipur","Jaisalmer",
  "Jim Corbett","Jodhpur","Kedarnath To Haridwar","Kedarnath","Lucknow","Mathura",
  "Mussoorie","Nainital To Delhi Taxi","Patna","Pauri Garhwal To Delhi Taxi",
  "Pithoragarh To Delhi Taxi","Ranikhet","Rishikesh","Roorkee","Rudraprayag To Delhi Taxi",
  "Tehri Garhwal To Delhi Taxi","Tungnath To Haridwar","Udham Singh Nagar To Delhi Taxi",
  "Uttarkashi To Delhi Taxi","Vrindavan",
];

const serviceDetails = {
  "Haldwani to Delhi": { icon:"🚖", distance:"300 km", duration:"5-6 hrs", price:"From ₹3,500", desc:"Comfortable door-to-door cab service from Haldwani to Delhi. AC vehicles, punctual pickup, experienced drivers on NH-9.", includes:["AC cab (Sedan/SUV/Innova)","Toll & parking included","Night driving available","Single or round trip"] },
  "Rudrapur to Delhi": { icon:"🚕", distance:"260 km", duration:"4-5 hrs", price:"From ₹3,000", desc:"Smooth, comfortable transfer from Rudrapur to Delhi NCR with professional drivers.", includes:["AC cab","Door-to-door pickup","Night travel safe","All tolls included"] },
  "Delhi Airport to All Over Uttarakhand": { icon:"✈️", distance:"Varies", duration:"Varies", price:"From ₹3,500", desc:"We pick you up directly from Delhi Airport (T1/T2/T3) and drive you to any destination across Uttarakhand.", includes:["Flight number tracking","Meet & greet at arrival gate","All toll & parking","24/7 availability"] },
  "Char Dham Yatra": { icon:"🙏", distance:"1,000+ km", duration:"10-12 Days", price:"From ₹24,999", desc:"Complete Char Dham circuit — Yamunotri, Gangotri, Kedarnath and Badrinath.", includes:["Experienced religious guide","Mule/doli arrangement","High altitude vehicle (SUV/Tempo)","All permits"] },
  "Jim Corbett Tour": { icon:"🐅", distance:"250 km from Delhi", duration:"2 Days", price:"From ₹4,999", desc:"Wildlife safari package to Jim Corbett National Park with jeep safari permits, naturalist guide and jungle resort stay.", includes:["Jeep safari permits","Expert naturalist","Resort stay","All meals"] },
  "Ayodhya Temple Tour": { icon:"🕌", distance:"650 km from Delhi", duration:"1-2 Days", price:"From ₹8,500", desc:"Visit the newly inaugurated Ram Mandir in Ayodhya along with Hanuman Garhi, Kanak Bhavan and ghats on the Saryu river.", includes:["AC cab round trip","VIP darshan assistance","1 night hotel (optional)","Local guide"] },
  "Agra Tour": { icon:"🏛️", distance:"200 km from Delhi", duration:"1 Day", price:"From ₹2,800", desc:"Day trip to Agra covering the Taj Mahal, Agra Fort and Mehtab Bagh.", includes:["AC cab","All tolls","Driver-guide","Flexible timing"] },
  "Kedarnath": { icon:"⛰️", distance:"440 km from Haridwar", duration:"5 Days", price:"From ₹9,999", desc:"Sacred pilgrimage to Kedarnath Jyotirlinga with cab transfers, mule arrangement and guided support.", includes:["Cab to Gaurikund","Mule arrangement","Hotel stays","Expert guide"] },
};

const defaultServiceDetail = (name) => ({
  icon: "🚗", distance:"Varies", duration:"Varies", price:"Call for price",
  desc:`Reliable and comfortable cab service for ${name}. Contact us for exact pricing and vehicle options.`,
  includes:["AC vehicle","Experienced driver","Flexible pickup","24/7 support"],
});

const tags = [
  { name: "Hill Station", img: "/images/mussoorie.jpg", count: 3 },
  { name: "Spiritual",   img: "/images/haridwar.jpg", count: 4 },
  { name: "Adventure",   img: "/images/almora.jpg", count: 2 },
  { name: "Wildlife",    img: "/images/jimcorbett.jpg", count: 1 },
  { name: "Nature & Trekking", img: "/images/chopta.jpg", count: 1 },
];

const destinationsByTag = {
  "Hill Station": [
    { name: "Mussoorie", img: "/images/mussoorie.jpg", desc:"The Queen of Hills — Mall Road, Kempty Falls and endless Himalayan views.", best:"March–June, Sept–Nov", distance:"35 km from Dehradun", stay:"2-3 nights", highlights:["Mall Road","Kempty Falls","Lal Tibba","Camel's Back Road"] },
    { name: "Nainital",  img: "/images/nainital.jpg", desc:"A jewel in the Kumaon hills built around the sparkling Naini Lake.", best:"March–June, Oct–Nov", distance:"65 km from Haldwani", stay:"3-4 nights", highlights:["Naini Lake boating","Snow View Point","Naina Devi Temple","Tiffin Top"] },
    { name: "Almora",    img: "/images/almora.jpg", desc:"The cultural capital of Kumaon — ancient temples, epic sunrises and famous local sweets.", best:"April–June, Sept–Oct", distance:"35 km from Kathgodam", stay:"2-3 nights", highlights:["Kasar Devi Temple","Nanda Devi Temple","Bright End Corner","Kumaoni cuisine"] },
  ],
  "Spiritual": [
    { name: "Haridwar",  img: "/images/haridwar.jpg", desc:"The gateway to the gods — where the Ganges meets the plains and Ganga Aarti lights up the sky.", best:"Oct–Mar, Kumbh years", distance:"214 km from Delhi", stay:"1-2 nights", highlights:["Har Ki Pauri Ganga Aarti","Mansa Devi Temple","Chandi Devi Temple","Holy Ganga dip"] },
    { name: "Rishikesh", img: "/images/rishikesh.jpg", desc:"The yoga capital of the world — ashrams, river rafting and the iconic jhulas across the Ganges.", best:"Oct–Mar", distance:"240 km from Delhi", stay:"2-3 nights", highlights:["Laxman Jhula","Triveni Ghat Aarti","Ganges Rafting","Beatles Ashram"] },
    { name: "Kedarnath", img: "/images/chardham.jpg", desc:"One of the 12 Jyotirlingas — a sacred Shiva temple high in the Himalayas, accessible by trek.", best:"May–June, Sept–Oct", distance:"220 km from Rishikesh", stay:"4-5 nights", highlights:["Kedarnath Temple","Mandakini Valley trek","Gaurikund hot springs","Vasuki Tal"] },
    { name: "Badrinath", img: "/images/badrinath.jpg", desc:"The northernmost Char Dham — Lord Vishnu's abode on the banks of the Alaknanda river.", best:"May–June, Sept–Oct", distance:"297 km from Rishikesh", stay:"4-5 nights", highlights:["Badrinath Temple","Mana Village","Vasudhara Falls","Tapt Kund"] },
  ],
  "Adventure": [
    { name: "Auli",      img: "/images/auli.jpg", desc:"India's premier skiing destination with Asia's longest gondola and breathtaking Nanda Devi views.", best:"Dec–Mar (skiing), Sept–Nov (trekking)", distance:"16 km from Joshimath", stay:"3-4 nights", highlights:["Skiing & snowboarding","Gondola (ropeway) ride","Gurso Bugyal meadows","Nanda Devi panorama"] },
    { name: "Rishikesh", img: "/images/rishikesh.jpg", desc:"White-water rafting, bungee jumping and cliff jumping make Rishikesh India's adventure capital.", best:"Sept–June", distance:"240 km from Delhi", stay:"2-3 nights", highlights:["Grade III-IV Rafting","Bungee jumping","Zip-lining","Camping by Ganga"] },
  ],
  "Wildlife": [
    { name: "Jim Corbett National Park", img: "/images/jimcorbett.jpg", desc:"India's oldest national park — home to the Bengal Tiger, Asian elephant and over 600 bird species.", best:"Nov–June (park closed Jul-Oct for rains)", distance:"250 km from Delhi", stay:"2-3 nights", highlights:["Bengal Tiger sightings","Elephant herds","Jeep safari (Bijrani/Dhikala)","Corbett Museum"] },
  ],
  "Nature & Trekking": [
    { name: "Chopta", img: "/images/chopta.jpg", desc:"The 'Mini Switzerland of Uttarakhand' — a stunning meadow and base for the Tungnath-Chandrashila trek.", best:"May–June, Sept–Nov", distance:"90 km from Rudraprayag", stay:"2-3 nights", highlights:["Tungnath Temple trek","Chandrashila summit","Rhododendron forests","Star gazing"] },
  ],
};

const contactServices = [
  "Haldwani to Delhi","Rudrapur to Delhi","Ramnagar to Delhi","Khatima to Delhi",
  "Delhi Airport Transfer","Cab Service","Local Car Rental","Kedarnath Tour",
  "Badrinath Tour","Mussoorie Trip","Nainital Trip","Char Dham Yatra",
  "Rishikesh Adventure","Jim Corbett Safari","Auli Skiing","Custom Route",
];

const faqData = [
  { q: "How do I book a cab with Sharma Fast Cabs?", a: "Simply click 'Book Now' or fill in the enquiry form and we'll respond on WhatsApp within minutes. You can also call or WhatsApp us directly at 8979331110 — we're available 24/7." },
  { q: "Do you offer one-way cab services from Haldwani to Delhi?", a: "Yes! We offer both one-way and round-trip cab services from Haldwani to Delhi and vice versa. Our one-way fare from Haldwani to Delhi starts at ₹3,500 depending on the vehicle type." },
  { q: "What vehicles are available in your fleet?", a: "We offer a range of AC vehicles including Sedans (Dzire, Etios), SUVs (Innova Crysta, Ertiga), and Tempo Travellers for larger groups. All vehicles are well-maintained and hygienically clean." },
  { q: "Do you provide airport pickup from Delhi Airport to Uttarakhand?", a: "Absolutely. We specialize in Delhi Airport (T1/T2/T3) to all destinations across Uttarakhand. We track your flight so we're always there on time, even for late arrivals." },
  { q: "Can you arrange Char Dham Yatra packages?", a: "Yes, we offer comprehensive Char Dham Yatra packages from Haridwar covering Yamunotri, Gangotri, Kedarnath and Badrinath. Packages include cab transfers, hotel stays, meals and a religious guide. Starting from ₹24,999 per person." },
  { q: "Is it safe to travel in high-altitude areas like Kedarnath or Badrinath?", a: "Safety is our top priority. Our drivers are experienced in high-altitude mountain driving and our vehicles are serviced for challenging terrain. We also provide emergency support throughout your journey." },
  { q: "Do you provide cab services from Noida and Ghaziabad to Haldwani?", a: "Yes, we offer cab services from Noida, Ghaziabad, and the entire Delhi NCR region to Haldwani and all of Uttarakhand. Contact us for pricing based on your exact pickup location." },
  { q: "What is your cancellation policy?", a: "We have a flexible cancellation policy. Please contact us at least 24 hours before your scheduled trip for a full refund. Last-minute cancellations are handled on a case-by-case basis. We always try to accommodate our customers." },
];

/* ─────────────────────────────────────────────
   BREADCRUMB COMPONENT
───────────────────────────────────────────── */
const Breadcrumb = ({ items }) => {
  // items: [{label, href}]
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.label,
      "item": `https://www.sharmafastcabs.com${item.href}`
    }))
  };
  useEffect(() => {
    const el = document.getElementById("breadcrumb-ld") || (() => {
      const s = document.createElement("script"); s.id="breadcrumb-ld"; s.type="application/ld+json";
      document.head.appendChild(s); return s;
    })();
    el.textContent = JSON.stringify(schema);
  }, [items]);

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
          {i > 0 && <span aria-hidden="true">›</span>}
          {i < items.length - 1
            ? <Link to={item.href}>{item.label}</Link>
            : <span aria-current="page">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  );
};

/* ─────────────────────────────────────────────
   FAQ COMPONENT
───────────────────────────────────────────── */
const FAQ = ({ items, title = "Frequently Asked Questions" }) => {
  const [open, setOpen] = useState(null);
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };
  useEffect(() => {
    const el = document.getElementById("faq-ld") || (() => {
      const s = document.createElement("script"); s.id="faq-ld"; s.type="application/ld+json";
      document.head.appendChild(s); return s;
    })();
    el.textContent = JSON.stringify(schema);
  }, []);

  return (
    <section className="section" aria-labelledby="faq-heading">
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div className="text-center" style={{ marginBottom: "2.5rem" }}>
          <span className="section-tag">✦ Common Questions</span>
          <h2 className="section-title" id="faq-heading">{title}</h2>
        </div>
        {items.map((item, i) => (
          <div className="faq-item" key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <button
              className="faq-question"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-controls={`faq-answer-${i}`}
              itemProp="name"
            >
              {item.q}
              <span className={`faq-chevron ${open === i ? "open" : ""}`} aria-hidden="true">▼</span>
            </button>
            {open === i && (
              <div
                id={`faq-answer-${i}`}
                className="faq-answer"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p itemProp="text">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   MODAL COMPONENT
───────────────────────────────────────────── */
const Modal = ({ item, type, onClose, onEnquire }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleEsc); };
  }, []);

  if (!item) return null;

  if (type === "package") {
    return (
      <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="modal-img-wrap" style={{ position: "relative" }}>
            <img className="modal-img" src={item.img} alt={`${item.name} tour package`} loading="lazy" width="680" height="260" />
            <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
          </div>
          <div className="modal-body">
            <span className="modal-tag">{item.tag}</span>
            <h2 className="modal-title" id="modal-title">{item.name}</h2>
            <div style={{ display:"flex", gap:"1.5rem", marginBottom:"1.2rem", flexWrap:"wrap" }}>
              <span style={{ fontSize:"0.88rem", color:"var(--text-lt)" }}>⏱ {item.duration}</span>
              <span style={{ fontSize:"0.88rem", color:"var(--text-lt)" }}>🚗 Cab Included</span>
            </div>
            <div className="modal-price">{item.price} <small>per person</small></div>
            <div className="modal-section"><h4>Overview</h4><p>{item.longDesc}</p></div>
            <div className="modal-section">
              <h4>Highlights</h4>
              <ul className="modal-list">{item.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
            </div>
            <div className="modal-section">
              <h4>Itinerary</h4>
              <ul className="modal-list">{item.itinerary.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
            <div className="modal-section">
              <h4>What's Included</h4>
              <ul className="modal-list">{item.includes.map((inc, i) => <li key={i}>{inc}</li>)}</ul>
            </div>
            <div className="modal-actions">
              <button className="btn-card-enq" style={{ padding:"0.9rem", fontSize:"1rem" }} onClick={() => { onClose(); onEnquire(item.name); }}>
                💬 Enquire on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "destination") {
    return (
      <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="modal-img-wrap" style={{ position:"relative" }}>
            <img className="modal-img" src={item.img} alt={`${item.name} destination`} loading="lazy" width="680" height="260" />
            <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
          </div>
          <div className="modal-body">
            <h2 className="modal-title" id="modal-title">{item.name}</h2>
            <div className="modal-section"><p>{item.desc}</p></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.4rem" }}>
              {[["Best Season", item.best], ["Distance", item.distance], ["Recommended Stay", item.stay]].map(([label, val]) => (
                <div key={label} style={{ background:"var(--sand)", borderRadius:"10px", padding:"1rem" }}>
                  <div style={{ fontSize:"0.75rem", color:"var(--text-lt)", marginBottom:"0.2rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</div>
                  <div style={{ fontWeight:600, fontSize:"0.9rem" }}>{val}</div>
                </div>
              ))}
            </div>
            <div className="modal-section">
              <h4>Top Highlights</h4>
              <div className="modal-pills">{item.highlights.map((h, i) => <span className="modal-pill" key={i}>{h}</span>)}</div>
            </div>
            <div className="modal-actions">
              <button className="btn-card-enq" style={{ padding:"0.9rem", fontSize:"1rem" }} onClick={() => { onClose(); onEnquire(item.name + " Tour"); }}>
                💬 Book This Destination
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "service") {
    const details = serviceDetails[item] || defaultServiceDetail(item);
    return (
      <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div style={{ background:"linear-gradient(135deg, var(--night) 0%, var(--teal) 100%)", padding:"2.5rem 2rem", borderRadius:"20px 20px 0 0", position:"relative" }}>
            <button className="modal-close" onClick={onClose} style={{ position:"absolute", top:"1rem", right:"1rem" }} aria-label="Close modal">✕</button>
            <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>{details.icon}</div>
            <h2 id="modal-title" style={{ color:"var(--white)", fontSize:"1.7rem", marginBottom:"0.5rem" }}>{item}</h2>
            <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.88rem" }}>📍 {details.distance}</span>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.88rem" }}>⏱ {details.duration}</span>
              <span style={{ color:"var(--gold)", fontSize:"0.95rem", fontWeight:700 }}>{details.price}</span>
            </div>
          </div>
          <div className="modal-body">
            <div className="modal-section"><h4>About this Service</h4><p>{details.desc}</p></div>
            <div className="modal-section">
              <h4>What's Included</h4>
              <ul className="modal-list">{details.includes.map((inc, i) => <li key={i}>{inc}</li>)}</ul>
            </div>
            <div style={{ background:"rgba(13,110,110,0.07)", border:"1px solid rgba(13,110,110,0.2)", borderRadius:"12px", padding:"1.2rem", marginBottom:"1rem" }}>
              <p style={{ fontSize:"0.88rem", color:"var(--text-lt)", marginBottom:"0.4rem" }}>📞 <strong>Call / WhatsApp us for exact pricing:</strong></p>
              <a href="tel:+918979331110" style={{ fontSize:"1.4rem", fontWeight:700, color:"var(--teal)", textDecoration:"none" }}>8979331110</a>
            </div>
            <div className="modal-actions">
              <button className="btn-card-enq" style={{ padding:"0.9rem", fontSize:"1rem" }} onClick={() => { onClose(); onEnquire(item); }}>
                💬 Enquire on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

/* ─────────────────────────────────────────────
   HOOK
───────────────────────────────────────────── */
const useEnquire = () => {
  const navigate = useNavigate();
  return useCallback((service = "") =>
    navigate(`/contact${service ? `?service=${encodeURIComponent(service)}` : ""}`), [navigate]);
};

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="nav-wrap" aria-label="Main navigation">
      <div className="nav-top-bar">
        <a href="tel:+918979331110" aria-label="Call Sharma Fast Cabs">📞 8979331110</a>
        <a href="mailto:sharmafastcabs@gmail.com" aria-label="Email Sharma Fast Cabs">✉️ sharmafastcabs@gmail.com</a>
        <a href="https://wa.me/918979331110" target="_blank" rel="noreferrer noopener" aria-label="Chat on WhatsApp" style={{ background:"#25D366", color:"#fff", padding:"0.2rem 0.8rem", borderRadius:"999px", fontWeight:700, display:"flex", alignItems:"center", gap:"0.35rem" }}>💬 WhatsApp</a>
      </div>
      <div className="nav-main">
        <Link to="/" className="nav-logo" aria-label="Sharma Fast Cabs - Home">Sharma <span>Fast Cabs</span></Link>
        <div className="nav-links" role="list">
          <Link to="/"             className="nav-link" role="listitem">Home</Link>
          <Link to="/packages"     className="nav-link" role="listitem">Packages</Link>
          <Link to="/services"     className="nav-link" role="listitem">Services</Link>
          <Link to="/destinations" className="nav-link" role="listitem">Destinations</Link>
          <Link to="/about"        className="nav-link" role="listitem">About</Link>
          <a href="tel:+918979331110" className="nav-link" style={{ color:"var(--gold)", fontWeight:700 }} aria-label="Call us">📞 8979331110</a>
          <Link to="/contact"      className="nav-link nav-cta" role="listitem">Book Now</Link>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>
      </div>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} role="menu">
        {[["🏠 Home","/"],["🗺️ Packages","/packages"],["🚖 Services","/services"],["🌍 Destinations","/destinations"],["ℹ️ About Us","/about"]].map(([label, to]) => (
          <Link key={to} to={to} className="mobile-link" role="menuitem" onClick={() => setMenuOpen(false)}>{label}</Link>
        ))}
        <a href="tel:+918979331110" className="mobile-link mobile-phone" role="menuitem" onClick={() => setMenuOpen(false)}>📞 Call: 8979331110</a>
        <Link to="/contact" className="mobile-link mobile-cta" role="menuitem" onClick={() => setMenuOpen(false)}>Book Now →</Link>
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = () => (
  <footer className="footer-wrap" itemScope itemType="https://schema.org/Organization">
    <div className="footer">
      <div className="footer-main">
        <div>
          <Link to="/" className="footer-brand-logo" aria-label="Sharma Fast Cabs Home" itemProp="url">Sharma <span>Fast Cabs</span></Link>
          <p className="footer-brand-desc" itemProp="description">
            Uttarakhand's most trusted cab and travel partner since 2009. We connect you to the most beautiful destinations — mountains, temples, wildlife and beyond — safely and comfortably.
          </p>
          <a href="tel:+918979331110" className="footer-contact-item" itemProp="telephone" aria-label="Call Sharma Fast Cabs"><span className="icon">📞</span> 8979331110</a>
          <a href="https://wa.me/918979331110" className="footer-contact-item" target="_blank" rel="noreferrer noopener" aria-label="WhatsApp Sharma Fast Cabs"><span className="icon">💬</span> WhatsApp: 8979331110</a>
          <a href="mailto:sharmafastcabs@gmail.com" className="footer-contact-item" itemProp="email" aria-label="Email Sharma Fast Cabs"><span className="icon">✉️</span> sharmafastcabs@gmail.com</a>
          <span className="footer-contact-item" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <span className="icon">📍</span>
            <span itemProp="addressLocality">Haldwani</span>,&nbsp;
            <span itemProp="addressRegion">Uttarakhand</span>, India
          </span>
          <span className="footer-contact-item"><span className="icon">🕐</span> <span itemProp="openingHours" content="Mo-Su 00:00-23:59">Available 24 Hours · 7 Days a Week</span></span>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/packages">Travel Packages</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact / Book</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Popular Routes</h4>
          <ul className="footer-links">
            {[
              ["Haldwani → Delhi","/contact?service=Haldwani+to+Delhi"],
              ["Delhi → Nainital","/contact?service=Delhi+To+Nainital+Taxi"],
              ["Delhi → Haridwar","/contact?service=Delhi+To+Haridwar+Taxi"],
              ["Haridwar → Kedarnath","/contact?service=Haridwar+To+Kedarnath"],
              ["Delhi Airport → Uttarakhand","/contact?service=Delhi+Airport+to+All+Over+Uttarakhand"],
              ["Haridwar → Char Dham","/contact?service=Haridwar+To+Char+Dham"],
            ].map(([label, to]) => <li key={to}><Link to={to}>{label}</Link></li>)}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Top Packages</h4>
          <ul className="footer-links">
            {["Char Dham Yatra","Kedarnath Pilgrimage","Jim Corbett Safari","Nainital Family Tour","Rishikesh Adventure","Auli Skiing"].map(p => (
              <li key={p}><Link to="/packages">{p}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", maxWidth:1200, margin:"0 auto" }}>
        <div className="footer-bottom">
          <p className="footer-bottom-text">© {new Date().getFullYear()} <span>Sharma Fast Cabs</span> · Haldwani, Uttarakhand · Made with ❤️ for travellers</p>
          <div className="footer-socials">
            <a href="https://wa.me/918979331110" target="_blank" rel="noreferrer noopener" className="footer-social" title="WhatsApp Sharma Fast Cabs" aria-label="WhatsApp">💬</a>
            <a href="tel:+918979331110" className="footer-social" title="Call Sharma Fast Cabs" aria-label="Call">📞</a>
            <a href="mailto:sharmafastcabs@gmail.com" className="footer-social" title="Email Sharma Fast Cabs" aria-label="Email">✉️</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
const Home = ({ currentSlide }) => {
  const enquire = useEnquire();
  const [modal, setModal] = useState(null);

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      BASE_SCHEMA,
      {
        "@type": "WebSite",
        "@id": "https://www.sharmafastcabs.com/#website",
        "url": "https://www.sharmafastcabs.com",
        "name": "Sharma Fast Cabs",
        "description": "Uttarakhand cab service, Char Dham Yatra, Kedarnath tour, Delhi to Nainital taxi",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.sharmafastcabs.com/services?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.sharmafastcabs.com/#webpage",
        "url": "https://www.sharmafastcabs.com",
        "name": "Sharma Fast Cabs – Uttarakhand Cab Service & Tour Packages",
        "description": "Book trusted cab services from Haldwani, Delhi, Haridwar. Char Dham Yatra, Kedarnath, Jim Corbett, Nainital & more. Call 8979331110.",
        "isPartOf": { "@id": "https://www.sharmafastcabs.com/#website" },
        "about": { "@id": "https://www.sharmafastcabs.com/#organization" },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sharmafastcabs.com" }]
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Sharma Fast Cabs – Uttarakhand Cab Service | Char Dham Yatra | Kedarnath Tours"
        description="Book reliable cab service from Haldwani, Delhi & Haridwar to all Uttarakhand destinations. Char Dham Yatra, Kedarnath, Nainital, Jim Corbett & more. 15+ years experience. Call 8979331110."
        canonical="/"
        keywords="cab service Haldwani, Uttarakhand cab service, Char Dham Yatra package, Kedarnath tour, Delhi to Nainital taxi, Haridwar to Kedarnath cab, Jim Corbett tour package, Sharma Fast Cabs"
        schema={homeSchema}
      />

      {modal && <Modal item={modal.item} type={modal.type} onClose={() => setModal(null)} onEnquire={enquire} />}

      {/* HERO */}
      <section className="hero" aria-label="Hero banner">
        <div className="hero-bg" style={{ backgroundImage: `url(${slides[currentSlide].img})` }} role="img" aria-label={`${slides[currentSlide].dest} destination`} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-badge">🚖 Uttarakhand's Trusted Cab Partner Since 2009</p>
          <h1 className="hero-title">Explore India with<br /><span className="accent">Sharma Fast Cabs</span></h1>
          <p className="hero-sub">{slides[currentSlide].dest} — {slides[currentSlide].text}</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => enquire()} aria-label="Book a cab now">Book Now</button>
            <button className="btn-outline" onClick={() => window.location.href = "/packages"} aria-label="View all tour packages">View Packages</button>
          </div>
        </div>
        <div className="slider-dots" aria-label="Slide indicators" role="tablist">
          {slides.map((s, i) => <div key={i} className={`dot ${i === currentSlide ? "active" : ""}`} role="tab" aria-selected={i === currentSlide} aria-label={`Slide ${i + 1}: ${s.dest}`} />)}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-band" aria-label="Business statistics">
        {[["10,000+","Happy Customers"],["500+","Routes Covered"],["15+","Years Experience"],["24/7","Support Available"]].map(([v,l],i) => (
          <div key={i} itemScope itemType="https://schema.org/QuantitativeValue">
            <div className="stat-val" itemProp="value">{v}</div>
            <div className="stat-lbl" itemProp="description">{l}</div>
          </div>
        ))}
      </section>

      {/* POPULAR PACKAGES */}
      <section className="section section-alt" aria-labelledby="packages-heading">
        <div className="text-center">
          <span className="section-tag">✦ Top Picks</span>
          <h2 className="section-title" id="packages-heading">Popular Tour Packages</h2>
          <p className="section-sub">Handcrafted journeys across Uttarakhand — mountains, temples, wildlife and more.</p>
        </div>
        <div className="cards-grid cards-grid-3" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {packagesData.slice(0, 3).map((pkg, i) => (
            <article className="card" key={i} itemScope itemType="https://schema.org/TouristTrip">
              <img className="card-img" src={pkg.img} alt={`${pkg.name} - Uttarakhand tour package`} loading={i === 0 ? "eager" : "lazy"} width="380" height="220" itemProp="image" />
              <div className="card-body">
                <span className="card-tag" itemProp="touristType">{pkg.tag}</span>
                <h3 className="card-title" itemProp="name">{pkg.name}</h3>
                <p className="card-meta" itemProp="duration">⏱ {pkg.duration}</p>
                <div className="card-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <span itemProp="price">{pkg.price}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-lt)", fontFamily: "DM Sans", fontWeight: 400 }}> per person</span>
                </div>
                <div className="card-actions">
                  <button className="btn-card-view" onClick={() => setModal({ item: pkg, type: "package" })} aria-label={`View details for ${pkg.name}`}>View Details</button>
                  <button className="btn-card-enq" onClick={() => enquire(pkg.name)} aria-label={`Enquire about ${pkg.name}`}>Enquire</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: "2.5rem" }}>
          <Link to="/packages" style={{ background: "var(--teal)", color: "#fff", fontWeight: 700, padding: "0.85rem 2.2rem", borderRadius: "8px", textDecoration: "none", fontSize: "1rem", display: "inline-block" }} aria-label="See all tour packages">
            View All Packages →
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section className="section section-dark" aria-labelledby="why-heading">
        <div className="text-center">
          <span className="section-tag">✦ Why Choose Us</span>
          <h2 className="section-title" id="why-heading" style={{ color: "var(--white)" }}>The Sharma Fast Cabs Difference</h2>
          <p className="section-sub light">Safety, comfort, and reliability — so you can travel worry-free across Uttarakhand.</p>
        </div>
        <div className="features-grid" style={{ maxWidth: 1000, margin: "0 auto" }}>
          {[
            ["🏷️","Best Price Guarantee","Transparent pricing with no hidden charges. Always competitive fares on every route."],
            ["⚡","Quick & Easy Booking","Enquire on WhatsApp in seconds. Get confirmed within minutes."],
            ["🛡️","Safe & Verified Drivers","Background-verified drivers trained for mountain roads and high-altitude terrain."],
            ["🗺️","500+ Routes","Airport transfers to Char Dham — we cover every corner of Uttarakhand and beyond."],
            ["📞","24/7 Support","Our team is always reachable — day or night, rain or shine."],
            ["🚗","Clean AC Fleet","AC cabs maintained to the highest hygiene and comfort standards."],
          ].map(([icon,title,desc],i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon" aria-hidden="true">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqData} title="Frequently Asked Questions About Our Cab Services" />

      <section className="cta-strip" aria-labelledby="cta-heading">
        <h2 id="cta-heading">Ready to Start Your Journey?</h2>
        <p>Talk to us on WhatsApp and get your cab booked in minutes.</p>
        <button className="btn-dark" onClick={() => enquire()} aria-label="Get a free cab quote">Get a Free Quote →</button>
      </section>
    </>
  );
};

/* ─────────────────────────────────────────────
   PACKAGES PAGE
───────────────────────────────────────────── */
const Packages = () => {
  const enquire = useEnquire();
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const filters = ["All", "Hill Station", "Spiritual", "Adventure", "Wildlife"];
  const visible = filter === "All" ? packagesData : packagesData.filter(p => p.tag === filter);

  const packageSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Tour Packages by Sharma Fast Cabs",
    "url": "https://www.sharmafastcabs.com/packages",
    "description": "Curated tour packages in Uttarakhand — Char Dham Yatra, Kedarnath, Nainital, Rishikesh, Jim Corbett and more.",
    "itemListElement": packagesData.map((pkg, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "TouristTrip",
        "name": pkg.name,
        "description": pkg.desc,
        "touristType": pkg.tag,
        "duration": pkg.duration,
        "image": `https://www.sharmafastcabs.com${pkg.img}`,
        "provider": { "@id": "https://www.sharmafastcabs.com/#organization" }
      }
    }))
  };

  return (
    <>
      <SEO
        title="Tour Packages Uttarakhand | Char Dham Yatra, Kedarnath, Nainital, Jim Corbett | Sharma Fast Cabs"
        description="Explore handcrafted tour packages by Sharma Fast Cabs. Char Dham Yatra, Kedarnath Pilgrimage, Nainital Family Tour, Rishikesh Adventure, Jim Corbett Safari, Auli Skiing and more. Book now at 8979331110."
        canonical="/packages"
        keywords="Char Dham Yatra package, Kedarnath tour package, Nainital family tour, Rishikesh adventure package, Jim Corbett safari, Auli skiing, Mussoorie tour, Haridwar spiritual tour, Uttarakhand packages"
        schema={packageSchema}
      />
      {modal && <Modal item={modal.item} type={modal.type} onClose={() => setModal(null)} onEnquire={enquire} />}

      <Breadcrumb items={[{label:"Home",href:"/"},{label:"Packages",href:"/packages"}]} />

      <div className="page-hero">
        <h1>Tour Packages 🗺️</h1>
        <p>Handcrafted Uttarakhand experiences for every kind of traveller</p>
      </div>

      <div style={{ background: "var(--sand)", padding: "1.5rem 2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }} role="group" aria-label="Filter packages by category">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} style={{
            padding: "0.5rem 1.3rem", borderRadius: "999px", border: "2px solid var(--teal)",
            fontWeight: 600, fontFamily: "DM Sans,sans-serif", cursor: "pointer",
            transition: "all 0.2s", fontSize: "0.88rem",
            background: filter === f ? "var(--teal)" : "transparent",
            color: filter === f ? "var(--white)" : "var(--teal)",
          }}>{f}</button>
        ))}
      </div>

      <section className="section section-alt" aria-label="Package listings">
        <div className="cards-grid cards-grid-3" style={{ maxWidth: 1200, margin: "0 auto" }}>
          {visible.map((pkg, i) => (
            <article className="card" key={i} itemScope itemType="https://schema.org/TouristTrip">
              <img className="card-img" src={pkg.img} alt={`${pkg.name} - ${pkg.tag} tour in Uttarakhand`} loading="lazy" width="380" height="220" itemProp="image" />
              <div className="card-body">
                <span className="card-tag" itemProp="touristType">{pkg.tag}</span>
                <h2 className="card-title" itemProp="name">{pkg.name}</h2>
                <p className="card-meta" itemProp="duration">⏱ {pkg.duration}</p>
                <p className="card-desc" itemProp="description">{pkg.desc}</p>
                <div className="card-price">{pkg.price}</div>
                <div className="card-actions">
                  <button className="btn-card-view" onClick={() => setModal({ item: pkg, type: "package" })} aria-label={`View details for ${pkg.name}`}>View Details</button>
                  <button className="btn-card-enq" onClick={() => enquire(pkg.name)} aria-label={`Enquire about ${pkg.name}`}>Enquire</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

/* ─────────────────────────────────────────────
   SERVICES PAGE
───────────────────────────────────────────── */
const Services = () => {
  const enquire = useEnquire();
  const [modal, setModal] = useState(null);

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Cab & Taxi Services by Sharma Fast Cabs",
    "url": "https://www.sharmafastcabs.com/services",
    "description": "Complete list of cab and taxi services — Haldwani to Delhi, Delhi Airport transfers, Char Dham tours, Jim Corbett and all Uttarakhand routes.",
    "itemListElement": servicesData.slice(0, 20).map((svc, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Service",
        "name": svc,
        "provider": { "@id": "https://www.sharmafastcabs.com/#organization" },
        "areaServed": "Uttarakhand, Delhi, India"
      }
    }))
  };

  return (
    <>
      <SEO
        title="Cab & Taxi Services | Haldwani to Delhi, Airport Transfers, Char Dham | Sharma Fast Cabs"
        description="Complete cab services — Haldwani to Delhi, Delhi to Nainital, Airport transfers, Char Dham Yatra, Kedarnath tours and 500+ routes across Uttarakhand. Reliable AC cabs. Call 8979331110."
        canonical="/services"
        keywords="Haldwani to Delhi cab, Delhi to Nainital taxi, Delhi Airport to Uttarakhand, Haridwar to Kedarnath taxi, cab service Uttarakhand, taxi service Haldwani, airport transfer Uttarakhand"
        schema={servicesSchema}
      />
      {modal && <Modal item={modal.item} type={modal.type} onClose={() => setModal(null)} onEnquire={enquire} />}

      <Breadcrumb items={[{label:"Home",href:"/"},{label:"Services",href:"/services"}]} />

      <div className="page-hero">
        <h1>Cab & Taxi Services 🚖</h1>
        <p>Point-to-point transfers, pilgrimages and everything in between</p>
      </div>

      <section className="section section-alt" aria-label="All cab services">
        <div className="svc-grid" style={{ maxWidth: 1200, margin: "0 auto" }}>
          {servicesData.map((svc, i) => (
            <div className="svc-card" key={i} itemScope itemType="https://schema.org/Service">
              <span className="svc-name" itemProp="name">{svc}</span>
              <div className="svc-btns">
                <button className="btn-svc-view" onClick={() => setModal({ item: svc, type: "service" })} aria-label={`View details for ${svc}`}>Details</button>
                <button className="btn-svc" onClick={() => enquire(svc)} aria-label={`Enquire about ${svc}`}>Enquire</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

/* ─────────────────────────────────────────────
   DESTINATIONS PAGE
───────────────────────────────────────────── */
const Destinations = () => {
  const enquire = useEnquire();
  const [selectedTag, setSelectedTag] = useState(null);
  const [modal, setModal] = useState(null);

  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Travel Destinations in Uttarakhand",
    "url": "https://www.sharmafastcabs.com/destinations",
    "description": "Explore Uttarakhand's top destinations — hill stations, spiritual sites, adventure spots and wildlife parks.",
    "itemListElement": Object.values(destinationsByTag).flat().map((d, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "TouristDestination",
        "name": d.name,
        "description": d.desc,
        "touristType": ["Leisure", "Pilgrimage", "Adventure"],
        "includesAttraction": d.highlights.map(h => ({ "@type": "TouristAttraction", "name": h }))
      }
    }))
  };

  return (
    <>
      <SEO
        title="Uttarakhand Destinations | Hill Stations, Char Dham, Adventure, Wildlife | Sharma Fast Cabs"
        description="Explore top Uttarakhand destinations — Nainital, Mussoorie, Haridwar, Rishikesh, Kedarnath, Badrinath, Jim Corbett, Auli and more. Book cab & tour packages at 8979331110."
        canonical="/destinations"
        keywords="Uttarakhand destinations, Nainital tourism, Mussoorie tourism, Haridwar pilgrimage, Rishikesh yoga, Kedarnath trek, Badrinath temple, Jim Corbett wildlife, Auli skiing, hill stations Uttarakhand"
        schema={destinationSchema}
      />
      {modal && <Modal item={modal.item} type={modal.type} onClose={() => setModal(null)} onEnquire={enquire} />}

      <Breadcrumb items={[
        {label:"Home",href:"/"},
        {label:"Destinations",href:"/destinations"},
        ...(selectedTag ? [{label:selectedTag,href:"/destinations"}] : [])
      ]} />

      <div className="page-hero">
        <h1>Explore Destinations 🌍</h1>
        <p>Discover Uttarakhand by category — hills, temples, adventures & wildlife</p>
      </div>

      <section className="section section-alt" aria-label="Destination categories">
        {!selectedTag ? (
          <>
            <div className="text-center" style={{ marginBottom: "2.5rem" }}>
              <span className="section-tag">✦ Browse by Category</span>
              <h2 className="section-title">Where Do You Want to Go?</h2>
            </div>
            <div className="dest-tag-grid" style={{ maxWidth: 1100, margin: "0 auto" }}>
              {tags.map((tag, i) => (
                <div className="dest-tag-card" key={i} onClick={() => setSelectedTag(tag.name)} role="button" tabIndex={0} onKeyPress={e => e.key==="Enter" && setSelectedTag(tag.name)} aria-label={`Explore ${tag.name} destinations`}>
                  <img src={tag.img} alt={`${tag.name} destinations in Uttarakhand`} loading="lazy" width="340" height="240" />
                  <div className="dest-tag-overlay" />
                  <h2 className="dest-tag-label">{tag.name}</h2>
                  <span className="dest-tag-badge">{tag.count} Destinations</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center" style={{ marginBottom: "2.5rem" }}>
              <span className="section-tag">✦ {selectedTag}</span>
              <h2 className="section-title">{selectedTag} Destinations in Uttarakhand</h2>
            </div>
            <div className="cards-grid cards-grid-3" style={{ maxWidth: 1000, margin: "0 auto" }}>
              {destinationsByTag[selectedTag]?.map((place, i) => (
                <article className="card" key={i} itemScope itemType="https://schema.org/TouristDestination">
                  <img className="card-img" src={place.img} alt={`${place.name} - ${selectedTag} destination`} loading="lazy" width="320" height="220" itemProp="image" />
                  <div className="card-body">
                    <h3 className="card-title" itemProp="name">{place.name}</h3>
                    <p className="card-desc" itemProp="description">{place.desc}</p>
                    <div className="card-actions" style={{ marginTop: "1rem" }}>
                      <button className="btn-card-view" onClick={() => setModal({ item: place, type: "destination" })} aria-label={`View details for ${place.name}`}>View Details</button>
                      <button className="btn-card-enq" onClick={() => enquire(place.name + " Tour")} aria-label={`Book ${place.name} tour`}>Enquire</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: "2.5rem" }}>
              <button className="btn-back" onClick={() => setSelectedTag(null)} aria-label="Back to destination categories">← Back to Categories</button>
            </div>
          </>
        )}
      </section>
    </>
  );
};

/* ─────────────────────────────────────────────
   ABOUT PAGE
───────────────────────────────────────────── */
const About = () => {
  const enquire = useEnquire();

  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      BASE_SCHEMA,
      {
        "@type": "AboutPage",
        "url": "https://www.sharmafastcabs.com/about",
        "name": "About Sharma Fast Cabs – Uttarakhand's Trusted Cab Service",
        "description": "Sharma Fast Cabs has been connecting travellers to Uttarakhand's most beautiful destinations since 2009. Professional drivers, clean AC vehicles, 24/7 support.",
        "about": { "@id": "https://www.sharmafastcabs.com/#organization" }
      },
      {
        "@type": "Review",
        "itemReviewed": { "@id": "https://www.sharmafastcabs.com/#organization" },
        "author": { "@type": "Person", "name": "Mrs. Sunita Rai" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "Excellent and reliable service. Clean cars, punctual drivers and a very smooth experience from Haldwani to Delhi."
      }
    ]
  };

  return (
    <>
      <SEO
        title="About Sharma Fast Cabs | Trusted Uttarakhand Cab Service Since 2009"
        description="Sharma Fast Cabs has been Uttarakhand's most trusted cab and tour operator since 2009. Professional drivers, AC vehicles, 500+ routes, 24/7 support. Based in Haldwani."
        canonical="/about"
        keywords="about Sharma Fast Cabs, Uttarakhand cab company, trusted cab service Haldwani, cab service reviews Uttarakhand"
        schema={aboutSchema}
      />

      <Breadcrumb items={[{label:"Home",href:"/"},{label:"About",href:"/about"}]} />

      <div className="about-hero">
        <h1>Your Trusted Travel Partner 🚖</h1>
        <p>Connecting hearts across Uttarakhand, Delhi & beyond since 2009</p>
      </div>

      <section className="section section-dark" aria-labelledby="why-heading">
        <div className="text-center">
          <span className="section-tag">✦ Why Choose Us</span>
          <h2 className="section-title" id="why-heading" style={{ color: "var(--white)" }}>What Sets Us Apart</h2>
        </div>
        <div className="features-grid" style={{ maxWidth: 900, margin: "0 auto" }}>
          {[
            ["🏷️","Best Price Guarantee","Affordable, transparent pricing on every trip. No hidden charges."],
            ["⚡","Easy & Quick Booking","Smooth booking in minutes via WhatsApp or call."],
            ["📞","24/7 Customer Support","Always available to assist you, anytime of the day or night."],
          ].map(([icon,title,desc],i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon" aria-hidden="true">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ maxWidth: 860, margin: "0 auto" }} aria-labelledby="story-heading">
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          <span className="section-tag">✦ Our Story</span>
          <h2 className="section-title" id="story-heading">About Sharma Fast Cabs</h2>
        </div>
        {[
          "At Sharma Fast Cabs, we believe every journey should be comfortable, safe, and memorable. Our mission is to provide reliable cab services that connect you with the most beautiful destinations across Uttarakhand and beyond.",
          "Whether you're planning a spiritual trip to Kedarnath or Badrinath, exploring scenic hill stations like Mussoorie, Nainital, and Ranikhet, or travelling for business — we ensure a smooth, hassle-free experience with expert local knowledge.",
          "Founded in 2009 and based in Haldwani, we've built a reputation on punctuality, transparent pricing and genuine care for our passengers. With over 10,000 happy customers and 500+ routes covered, Sharma Fast Cabs is your trusted travel partner for every journey across Uttarakhand."
        ].map((p, i) => (
          <p key={i} style={{ lineHeight: 1.8, color: "var(--text-lt)", marginBottom: "1rem", fontSize: "1.05rem" }}>{p}</p>
        ))}
      </section>

      <section className="section section-teal" aria-labelledby="reviews-heading">
        <div className="text-center">
          <span className="section-tag">✦ Testimonials</span>
          <h2 className="section-title" id="reviews-heading" style={{ color: "var(--white)" }}>What Our Customers Say</h2>
        </div>
        <div className="cards-grid cards-grid-2" style={{ maxWidth: 900, margin: "0 auto" }}>
          {[
            { text: "Excellent and reliable service. Clean cars, punctual drivers and a very smooth experience from Haldwani to Delhi.", name: "Mrs. Sunita Rai", city: "Haldwani" },
            { text: "My business trip was seamless. The driver was professional and the service top-notch. Highly recommended!", name: "Mr. Rajesh Sharma", city: "Rudrapur" },
            { text: "Booked the Kedarnath package — absolutely wonderful. Everything was arranged perfectly.", name: "Mr. Deepak Verma", city: "Delhi" },
            { text: "Best cab service in Uttarakhand! Very affordable prices and the driver knew every mountain road perfectly.", name: "Mrs. Priya Joshi", city: "Nainital" },
          ].map((t, i) => (
            <div className="testi-card" key={i} itemScope itemType="https://schema.org/Review">
              <div className="testi-stars" aria-label="5 star rating">★★★★★</div>
              <blockquote className="testi-text" itemProp="reviewBody">"{t.text}"</blockquote>
              <div className="testi-author" itemProp="author" itemScope itemType="https://schema.org/Person">
                <span itemProp="name">{t.name}</span>
              </div>
              <div className="testi-city">{t.city}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-strip" aria-labelledby="about-cta-heading">
        <h2 id="about-cta-heading">Ready to Plan Your Trip?</h2>
        <p>Get in touch and we'll craft the perfect itinerary for you.</p>
        <button className="btn-dark" onClick={() => enquire()} aria-label="Contact Sharma Fast Cabs">Contact Us →</button>
      </section>
    </>
  );
};

/* ─────────────────────────────────────────────
   CONTACT PAGE
───────────────────────────────────────────── */
const Contact = () => {
  const location = useLocation();
  const getServiceFromURL = () => new URLSearchParams(location.search).get("service") || "";
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState(getServiceFromURL);

  useEffect(() => { setService(getServiceFromURL()); }, [location.search]);

  const handleSubmit = () => {
    if (!name || !service) { alert("Please fill your name and select a service."); return; }
    const wp   = "918979331110";
    const text = `Hello Sharma Fast Cabs 🚖\n\nName: ${name}\nPhone: ${phone || "N/A"}\nService: ${service}\nMessage: ${message || "N/A"}\n\nI want to enquire about this service.`;
    window.open(`https://wa.me/${wp}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "url": "https://www.sharmafastcabs.com/contact",
    "name": "Contact Sharma Fast Cabs – Book Your Cab or Tour",
    "description": "Contact Sharma Fast Cabs to book a cab or tour package. WhatsApp, call or email us — we respond within minutes.",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Sharma Fast Cabs",
      "telephone": "+918979331110",
      "email": "sharmafastcabs@gmail.com",
      "openingHours": "Mo-Su 00:00-23:59",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Haldwani",
        "addressRegion": "Uttarakhand",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <>
      <SEO
        title="Contact Sharma Fast Cabs | Book Cab – WhatsApp 8979331110 | Haldwani Uttarakhand"
        description="Book your cab or tour package with Sharma Fast Cabs. WhatsApp or call 8979331110 for instant confirmation. Haldwani, Uttarakhand. Available 24/7."
        canonical="/contact"
        keywords="book cab Uttarakhand, contact Sharma Fast Cabs, cab booking Haldwani, WhatsApp cab booking, Uttarakhand tour booking"
        schema={contactSchema}
      />

      <Breadcrumb items={[{label:"Home",href:"/"},{label:"Contact",href:"/contact"}]} />

      <div className="page-hero">
        <h1>Contact Us 📞</h1>
        <p>We're here to help you plan your perfect journey — 24/7</p>
      </div>

      <section className="section section-alt" aria-label="Contact form">
        <div className="contact-wrap">
          <address className="contact-info" style={{ fontStyle:"normal" }}>
            <span className="section-tag">✦ Get In Touch</span>
            <h2>Let's Plan Your Journey</h2>
            <p style={{ color: "var(--text-lt)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Fill the form and we'll respond on WhatsApp within minutes. Or call us directly anytime.
            </p>
            {[
              ["📞","Call / WhatsApp",<a href="tel:+918979331110" style={{ color:"var(--teal)", fontWeight:700 }}>8979331110</a>],
              ["✉️","Email",<a href="mailto:sharmafastcabs@gmail.com" style={{ color:"var(--teal)" }}>sharmafastcabs@gmail.com</a>],
              ["📍","Based In","Haldwani, Uttarakhand, India"],
              ["🕐","Available","24 Hours · 7 Days a Week"],
              ["🚗","Fleet","AC Sedans, SUVs, Tempo Travellers"],
            ].map(([icon,label,val],i) => (
              <div className="contact-detail" key={i}>
                <div className="contact-detail-icon" aria-hidden="true">{icon}</div>
                <div className="contact-detail-text">
                  <strong>{label}</strong>
                  <span>{val}</span>
                </div>
              </div>
            ))}
          </address>

          <div className="form-card" role="form" aria-label="Cab booking enquiry form">
            <h2 style={{ fontSize:"1.5rem" }}>Enquire Now</h2>
            <p>We'll confirm your booking on WhatsApp</p>
            <div className="form-row" style={{ marginBottom: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="contact-name">Full Name *</label>
                <input id="contact-name" className="form-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="contact-phone">Phone Number</label>
                <input id="contact-phone" className="form-input" placeholder="+91 XXXXX XXXXX" value={phone} onChange={e => setPhone(e.target.value)} type="tel" autoComplete="tel" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-service">Select Service *</label>
              <select id="contact-service" className="form-select" value={service} onChange={e => setService(e.target.value)} required>
                <option value="">-- Choose a Service / Route --</option>
                {contactServices.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">Message (optional)</label>
              <textarea id="contact-message" className="form-textarea" placeholder="Travel dates, number of passengers, pickup point..." value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <button className="btn-whatsapp" onClick={handleSubmit} aria-label="Send enquiry on WhatsApp">
              <span aria-hidden="true">💬</span> Send Enquiry on WhatsApp
            </button>
            <p style={{ textAlign: "center", marginTop: "1.2rem", color: "var(--text-lt)", fontSize: "0.85rem" }}>
              Or call directly: <a href="tel:+918979331110" style={{ color: "var(--teal)", fontWeight: 700 }}>8979331110</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  const [loading, setLoading]           = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Set global meta charset and viewport if missing
    if (!document.querySelector('meta[charset]')) {
      const c = document.createElement("meta"); c.setAttribute("charset","UTF-8"); document.head.prepend(c);
    }
    if (!document.querySelector('meta[name="viewport"]')) {
      const v = document.createElement("meta"); v.name="viewport"; v.content="width=device-width, initial-scale=1"; document.head.appendChild(v);
    }
    // Language
    document.documentElement.lang = "en-IN";

    const timer  = setTimeout(() => setLoading(false), 900);
    const slider = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 3500);
    return () => { clearTimeout(timer); clearInterval(slider); };
  }, []);

  if (loading) {
    return (
      <div role="status" aria-label="Loading Sharma Fast Cabs" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0B1120", gap: "1rem" }}>
        <div style={{ fontFamily: "Playfair Display,serif", fontSize: "2rem", color: "#F5A623", fontWeight: 900 }}>Sharma Fast Cabs</div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", letterSpacing: "0.1em" }}>Loading your journey...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <GlobalStyles />
      {/* Skip to main content for screen readers */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content">
        <Routes>
          <Route path="/"             element={<Home currentSlide={currentSlide} />} />
          <Route path="/packages"     element={<Packages />} />
          <Route path="/services"     element={<Services />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/about"        element={<About />} />
          <Route path="/contact"      element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}