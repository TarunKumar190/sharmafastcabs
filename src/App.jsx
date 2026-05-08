import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

/* ─── GLOBAL STYLES ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --gold: #F5A623; --gold-dk: #D4880A; --gold-lt: #FDF0D9;
      --rust: #C0392B; --teal: #0D6E6E; --teal-lt: #14A3A3; --teal-xlt: #E8F5F5;
      --night: #0B1120; --ink: #1A2233; --sand: #FDF6EC; --mist: #F0F4F8;
      --white: #FFFFFF; --text: #2D3748; --text-lt: #718096; --border: #E2E8F0;
    }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body { font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--white); overflow-x: hidden; }
    img { max-width: 100%; height: auto; }
    h1,h2,h3,h4,h5 { font-family: 'Playfair Display', serif; }
    a { text-decoration: none; color: inherit; }

    /* FLOATING BUTTONS */
    .float-btns { position: fixed; bottom: 2rem; right: 1.5rem; z-index: 9999; display: flex; flex-direction: column; gap: 0.75rem; }
    .float-wa { width: 56px; height: 56px; border-radius: 50%; background: #25D366; color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; box-shadow: 0 4px 20px rgba(37,211,102,0.5); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; text-decoration: none; border: none; }
    .float-wa:hover { transform: scale(1.12); box-shadow: 0 8px 28px rgba(37,211,102,0.6); }
    .float-call { width: 56px; height: 56px; border-radius: 50%; background: var(--teal); color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; box-shadow: 0 4px 20px rgba(13,110,110,0.45); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; text-decoration: none; border: none; }
    .float-call:hover { transform: scale(1.12); box-shadow: 0 8px 28px rgba(13,110,110,0.55); }
    @keyframes pulse { 0%,100% { box-shadow: 0 4px 20px rgba(37,211,102,0.5); } 50% { box-shadow: 0 4px 32px rgba(37,211,102,0.8), 0 0 0 8px rgba(37,211,102,0.12); } }
    .float-wa { animation: pulse 2.5s infinite; }

    /* NAV */
    .nav-wrap { position: sticky; top: 0; z-index: 1000; background: rgba(11,17,32,0.97); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(245,166,35,0.2); }
    .nav-top { background: var(--teal); display: flex; align-items: center; justify-content: flex-end; padding: 0.3rem 2rem; gap: 1.5rem; font-size: 0.78rem; }
    .nav-top a { color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 0.4rem; transition: color 0.2s; }
    .nav-top a:hover { color: var(--gold); }
    .nav-wa { background: #25D366 !important; color: #fff !important; padding: 0.2rem 0.9rem !important; border-radius: 999px !important; font-weight: 700 !important; }
    .nav-main { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 64px; }
    .nav-logo { display: flex; align-items: center; gap: 0.6rem; font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 900; color: var(--gold); }
    .nav-logo span { color: var(--white); }
    .site-logo { width: 40px; height: 40px; object-fit: contain; border-radius: 8px; display: block; }
    .nav-links { display: flex; gap: 0.2rem; align-items: center; }
    .nl { color: rgba(255,255,255,0.75); font-size: 0.875rem; font-weight: 500; padding: 0.45rem 0.85rem; border-radius: 6px; transition: color 0.2s, background 0.2s; }
    .nl:hover { color: var(--gold); background: rgba(245,166,35,0.1); }
    .nl-cta { background: var(--gold) !important; color: var(--night) !important; font-weight: 700 !important; }
    .nl-cta:hover { background: var(--gold-dk) !important; }
    .nl-phone { color: var(--gold) !important; font-weight: 700 !important; }
    .ham { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; }
    .ham span { display: block; width: 22px; height: 2px; background: var(--white); margin: 5px 0; border-radius: 2px; transition: all 0.3s; }
    .mob-menu { display: none; flex-direction: column; background: var(--ink); border-top: 1px solid rgba(245,166,35,0.2); padding: 1rem; }
    .mob-menu.open { display: flex; }
    .mob-link { color: rgba(255,255,255,0.8); padding: 0.75rem 1rem; border-radius: 8px; font-weight: 500; font-size: 0.95rem; transition: background 0.2s, color 0.2s; }
    .mob-link:hover { background: rgba(245,166,35,0.1); color: var(--gold); }
    .mob-cta { background: var(--gold); color: var(--night) !important; font-weight: 700; text-align: center; margin-top: 0.5rem; border-radius: 8px; }
    @media(max-width:900px) { .nav-links { display: none; } .ham { display: block; } .nav-top { display: none; } }

    /* BREADCRUMB */
    .bc { background: var(--mist); padding: 0.6rem 2rem; font-size: 0.8rem; color: var(--text-lt); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
    .bc a { color: var(--teal); font-weight: 500; }
    .bc a:hover { text-decoration: underline; }

    /* HERO */
    .hero { position: relative; height: 92vh; height: 92svh; min-height: 520px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
    .hero-ov { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(11,17,32,0.8) 0%, rgba(13,110,110,0.45) 100%); }
    .hero-content { position: relative; text-align: center; color: var(--white); padding: 0 1.5rem; max-width: 900px; }
    .hero-badge { display: inline-block; background: rgba(245,166,35,0.15); border: 1px solid rgba(245,166,35,0.5); color: var(--gold); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.4rem 1.1rem; border-radius: 999px; margin-bottom: 1.2rem; animation: fadeUp 0.6s ease both; }
    .hero-title { font-size: clamp(2.4rem,5.5vw,4.5rem); font-weight: 900; line-height: 1.05; margin-bottom: 1rem; animation: fadeUp 0.7s 0.1s ease both; }
    .hero-title .acc { color: var(--gold); }
    .hero-sub { font-size: 1.15rem; color: rgba(255,255,255,0.8); margin-bottom: 2rem; max-width: 640px; margin-left: auto; margin-right: auto; animation: fadeUp 0.7s 0.2s ease both; }
    .hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.7s 0.3s ease both; }
    .slider-dots { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem; }
    .dot { width: 8px; height: 8px; border-radius: 999px; background: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.3s; }
    .dot.active { background: var(--gold); width: 24px; }

    /* PAGE HERO */
    .ph { position: relative; overflow: hidden; }
    .ph-bg { position: absolute; inset: 0; background-size: cover; background-position: center; filter: brightness(0.4); }
    .ph-content { position: relative; padding: 5rem 2rem 4rem; text-align: center; color: var(--white); }
    .ph-tag { display: inline-block; background: rgba(245,166,35,0.2); border: 1px solid rgba(245,166,35,0.5); color: var(--gold); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 0.35rem 1rem; border-radius: 999px; margin-bottom: 1rem; }
    .ph-title { font-size: clamp(2rem,5vw,3.5rem); font-weight: 900; margin-bottom: 0.75rem; }
    .ph-sub { color: rgba(255,255,255,0.7); font-size: 1.05rem; max-width: 600px; margin: 0 auto; }
    .ph-simple { background: linear-gradient(135deg, var(--night) 0%, #0D3D3D 100%); padding: 4rem 2rem 3rem; text-align: center; color: var(--white); }
    .ph-simple h1 { font-size: clamp(2rem,5vw,3.2rem); margin-bottom: 0.6rem; }
    .ph-simple p { color: rgba(255,255,255,0.6); font-size: 1rem; }

    /* STATS */
    .stats-band { background: var(--night); color: var(--white); display: grid; grid-template-columns: repeat(4,1fr); text-align: center; padding: 2.2rem 2rem; gap: 1rem; }
    @media(max-width:600px) { .stats-band { grid-template-columns: repeat(2,1fr); } }
    .stat-val { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: var(--gold); font-weight: 900; }
    .stat-lbl { font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-top: 0.25rem; }

    /* SECTIONS */
    .sec { padding: 5rem 2rem; }
    .sec-alt { background: var(--sand); }
    .sec-dark { background: var(--night); color: var(--white); }
    .sec-teal { background: linear-gradient(135deg, var(--teal) 0%, #0A4F4F 100%); color: var(--white); }
    .sec-mist { background: var(--mist); }
    .sec-tag { display: inline-block; font-size: 0.73rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.6rem; }
    .sec-title { font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 900; margin-bottom: 1rem; line-height: 1.1; }
    .sec-sub { color: var(--text-lt); max-width: 560px; margin: 0 auto 3rem; font-size: 1.05rem; line-height: 1.7; }
    .sec-sub.lt { color: rgba(255,255,255,0.65); }
    .tc { text-align: center; }

    /* BUTTONS */
    .btn-primary { background: var(--gold); color: var(--night); font-weight: 700; padding: 0.85rem 2rem; border-radius: 8px; border: none; cursor: pointer; font-size: 1rem; font-family: 'DM Sans', sans-serif; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 20px rgba(245,166,35,0.35); display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-primary:hover { background: var(--gold-dk); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,166,35,0.5); }
    .btn-outline { background: transparent; color: var(--white); font-weight: 600; padding: 0.85rem 2rem; border-radius: 8px; border: 2px solid rgba(255,255,255,0.5); cursor: pointer; font-size: 1rem; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s, background 0.2s, transform 0.15s; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-outline:hover { border-color: var(--white); background: rgba(255,255,255,0.08); transform: translateY(-2px); }
    .btn-teal { background: var(--teal); color: var(--white); font-weight: 700; padding: 0.85rem 2rem; border-radius: 8px; border: none; cursor: pointer; font-size: 1rem; font-family: 'DM Sans', sans-serif; transition: background 0.2s, transform 0.15s; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-teal:hover { background: #0A5555; transform: translateY(-2px); }
    .btn-wa { background: #25D366; color: var(--white); font-weight: 700; padding: 0.85rem 2rem; border-radius: 8px; border: none; cursor: pointer; font-size: 1rem; font-family: 'DM Sans', sans-serif; transition: background 0.2s, transform 0.15s; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 16px rgba(37,211,102,0.35); }
    .btn-wa:hover { background: #1da851; transform: translateY(-2px); }
    .btn-dark { background: var(--night); color: var(--white); font-weight: 700; padding: 0.85rem 2.2rem; border-radius: 8px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 1rem; transition: background 0.2s, transform 0.15s; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-dark:hover { background: var(--ink); transform: translateY(-2px); }
    .btn-ghost { background: transparent; color: var(--teal); font-weight: 700; padding: 0.75rem 1.5rem; border-radius: 8px; border: 2px solid var(--teal); cursor: pointer; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; transition: background 0.2s, color 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-ghost:hover { background: var(--teal); color: var(--white); }

    /* CARDS */
    .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.75rem; }
    .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.75rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
    @media(max-width:1000px) { .grid-4 { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:900px) { .grid-3,.grid-2 { grid-template-columns: 1fr 1fr; } }
    @media(max-width:580px) { .grid-3,.grid-2,.grid-4 { grid-template-columns: 1fr; } }
    .card { background: var(--white); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); transition: transform 0.25s, box-shadow 0.25s; display: flex; flex-direction: column; }
    .card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.13); }
    .card-img { width: 100%; height: 220px; object-fit: cover; display: block; }
    .card-body { padding: 1.4rem; flex: 1; display: flex; flex-direction: column; }
    .card-tag { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--teal); background: rgba(13,110,110,0.1); display: inline-block; padding: 0.25rem 0.6rem; border-radius: 4px; margin-bottom: 0.6rem; }
    .card-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.35rem; }
    .card-meta { font-size: 0.83rem; color: var(--text-lt); margin-bottom: 0.5rem; }
    .card-desc { font-size: 0.9rem; color: var(--text-lt); line-height: 1.6; flex: 1; }
    .card-actions { display: flex; gap: 0.75rem; margin-top: auto; padding-top: 0.75rem; }
    .btn-ce { flex: 1; background: var(--gold); color: var(--night); font-weight: 700; padding: 0.65rem; border-radius: 8px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; transition: background 0.2s; }
    .btn-ce:hover { background: var(--gold-dk); }
    .btn-cv { flex: 1; background: transparent; color: var(--teal); font-weight: 600; padding: 0.65rem; border-radius: 8px; border: 2px solid var(--teal); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; transition: background 0.2s, color 0.2s; }
    .btn-cv:hover { background: var(--teal); color: var(--white); }

    /* SERVICE CARD */
    .svc-card { background: var(--white); border-radius: 12px; padding: 1.3rem 1.2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-left: 4px solid var(--teal); transition: box-shadow 0.2s, transform 0.2s; }
    .svc-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateX(3px); }
    .svc-name { font-weight: 600; font-size: 0.92rem; flex: 1; }
    .svc-btns { display: flex; gap: 0.5rem; flex-shrink: 0; }
    .btn-sv { background: var(--gold); color: var(--night); font-weight: 700; padding: 0.45rem 1rem; border-radius: 6px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; white-space: nowrap; transition: background 0.2s; }
    .btn-sv:hover { background: var(--gold-dk); }
    .btn-svv { background: transparent; color: var(--teal); font-weight: 600; padding: 0.45rem 0.8rem; border-radius: 6px; border: 2px solid var(--teal); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; white-space: nowrap; transition: background 0.2s, color 0.2s; }
    .btn-svv:hover { background: var(--teal); color: var(--white); }
    .svc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
    @media(max-width:900px) { .svc-grid { grid-template-columns: 1fr 1fr; } }
    @media(max-width:580px) { .svc-grid { grid-template-columns: 1fr; } }

    /* FEATURES */
    .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; }
    @media(max-width:700px) { .feat-grid { grid-template-columns: 1fr; } }
    .feat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem 1.5rem; text-align: center; transition: background 0.2s, transform 0.2s; }
    .feat-card:hover { background: rgba(255,255,255,0.09); transform: translateY(-4px); }
    .feat-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .feat-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--gold); font-family: 'DM Sans', sans-serif; }
    .feat-desc { font-size: 0.88rem; color: rgba(255,255,255,0.6); line-height: 1.65; }

    /* DEST TAG CARDS */
    .dest-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
    @media(max-width:800px) { .dest-grid { grid-template-columns: 1fr 1fr; } }
    @media(max-width:500px) { .dest-grid { grid-template-columns: 1fr; } }
    .dest-card { position: relative; border-radius: 16px; overflow: hidden; cursor: pointer; height: 240px; transition: transform 0.25s, box-shadow 0.25s; }
    .dest-card:hover { transform: scale(1.03); box-shadow: 0 16px 40px rgba(0,0,0,0.2); }
    .dest-card img { width: 100%; height: 100%; object-fit: cover; }
    .dest-ov { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(11,17,32,0.8) 0%, transparent 60%); }
    .dest-label { position: absolute; bottom: 1.2rem; left: 1.2rem; color: var(--white); font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; }
    .dest-badge { position: absolute; top: 1rem; right: 1rem; background: var(--gold); color: var(--night); font-size: 0.72rem; font-weight: 700; padding: 0.3rem 0.7rem; border-radius: 999px; }

    /* TESTIMONIALS */
    .testi-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; }
    .testi-stars { color: var(--gold); font-size: 1.1rem; margin-bottom: 1rem; }
    .testi-text { color: rgba(255,255,255,0.8); line-height: 1.75; font-style: italic; margin-bottom: 1.5rem; }
    .testi-author { font-weight: 700; color: var(--white); font-family: 'DM Sans', sans-serif; }
    .testi-city { font-size: 0.82rem; color: rgba(255,255,255,0.45); }

    /* FAQ */
    .faq-item { border-bottom: 1px solid rgba(0,0,0,0.08); padding: 1.2rem 0; }
    .faq-q { width: 100%; background: none; border: none; text-align: left; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; color: var(--text); display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0; }
    .faq-q:hover { color: var(--teal); }
    .faq-a { font-size: 0.92rem; color: var(--text-lt); line-height: 1.75; margin-top: 0.8rem; }
    .faq-chev { font-size: 0.8rem; transition: transform 0.25s; flex-shrink: 0; color: var(--teal); }
    .faq-chev.open { transform: rotate(180deg); }

    /* CTA STRIP */
    .cta-strip { background: linear-gradient(90deg, var(--gold) 0%, #F7C05A 100%); padding: 3rem 2rem; text-align: center; }
    .cta-strip h2 { font-size: clamp(1.5rem,3vw,2rem); color: var(--night); margin-bottom: 0.5rem; }
    .cta-strip p { color: rgba(11,17,32,0.65); margin-bottom: 1.5rem; }

    /* CONTACT */
    .contact-wrap { display: grid; grid-template-columns: 1fr 1.4fr; gap: 3rem; max-width: 1000px; margin: 0 auto; }
    @media(max-width:820px) { .contact-wrap { grid-template-columns: 1fr; } }
    .form-card { background: var(--white); border-radius: 20px; padding: 2.5rem; box-shadow: 0 8px 40px rgba(0,0,0,0.1); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media(max-width:580px) { .form-row { grid-template-columns: 1fr; } }
    .form-group { margin-bottom: 1rem; }
    .form-label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; }
    .form-input, .form-select, .form-textarea { width: 100%; padding: 0.8rem 1rem; border: 2px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--text); background: var(--white); transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
    .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,110,110,0.12); }
    .form-textarea { resize: vertical; min-height: 110px; }

    /* DETAIL PAGE */
    .detail-wrap { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 1fr 340px; gap: 3rem; align-items: start; }
    @media(max-width:900px) { .detail-wrap { grid-template-columns: 1fr; } }
    .detail-main {}
    .detail-sidebar { position: sticky; top: 84px; }
    .detail-img { width: 100%; height: 420px; object-fit: cover; border-radius: 20px; margin-bottom: 2.5rem; }
    .detail-tag { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); background: rgba(13,110,110,0.1); padding: 0.3rem 0.8rem; border-radius: 4px; margin-bottom: 0.75rem; }
    .detail-title { font-size: clamp(1.8rem,3.5vw,2.8rem); font-weight: 900; margin-bottom: 0.75rem; line-height: 1.1; }
    .detail-meta { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border); }
    .detail-meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-lt); }
    .detail-meta-item strong { color: var(--text); font-weight: 600; }
    .detail-section { margin-bottom: 2.5rem; }
    .detail-section h3 { font-size: 1.2rem; font-weight: 700; color: var(--text); margin-bottom: 1rem; font-family: 'DM Sans', sans-serif; letter-spacing: -0.01em; border-left: 3px solid var(--teal); padding-left: 0.75rem; }
    .detail-section p { color: var(--text-lt); line-height: 1.8; font-size: 0.98rem; }
    .detail-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
    .detail-list li { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.93rem; color: var(--text); line-height: 1.5; }
    .detail-list li::before { content: "✓"; color: var(--teal); font-weight: 800; flex-shrink: 0; margin-top: 0.05rem; }
    .detail-list.bullets li::before { content: "•"; color: var(--gold); font-size: 1.2rem; line-height: 1.2; }
    .itinerary-list { list-style: none; display: flex; flex-direction: column; gap: 0; }
    .itin-item { display: flex; gap: 1.2rem; padding-bottom: 1.5rem; position: relative; }
    .itin-item:not(:last-child)::after { content: ''; position: absolute; left: 16px; top: 34px; bottom: 0; width: 2px; background: var(--border); }
    .itin-dot { width: 32px; height: 32px; border-radius: 50%; background: var(--teal); color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; font-family: 'DM Sans'; }
    .itin-text strong { display: block; font-weight: 700; font-size: 0.92rem; margin-bottom: 0.15rem; }
    .itin-text span { color: var(--text-lt); font-size: 0.88rem; line-height: 1.5; }
    .pills-wrap { display: flex; flex-wrap: wrap; gap: 0.6rem; }
    .pill { background: var(--sand); border: 1px solid rgba(13,110,110,0.2); color: var(--text); font-size: 0.82rem; padding: 0.35rem 0.85rem; border-radius: 999px; }

    /* SIDEBAR CARD */
    .sidebar-card { background: var(--white); border-radius: 20px; box-shadow: 0 8px 40px rgba(0,0,0,0.12); overflow: hidden; margin-bottom: 1.5rem; }
    .sidebar-card-head { background: linear-gradient(135deg, var(--night), var(--teal)); padding: 2rem 1.75rem; color: var(--white); }
    .sidebar-card-body { padding: 1.75rem; display: flex; flex-direction: column; gap: 0.85rem; }
    .sidebar-fact { display: flex; align-items: center; gap: 0.75rem; font-size: 0.88rem; }
    .sidebar-fact-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--teal-xlt); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
    .sidebar-fact-text strong { display: block; font-weight: 700; font-size: 0.8rem; color: var(--text-lt); text-transform: uppercase; letter-spacing: 0.06em; }
    .sidebar-fact-text span { font-weight: 600; color: var(--text); }
    .sidebar-actions { padding: 0 1.75rem 1.75rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .sidebar-actions .btn-wa, .sidebar-actions .btn-primary, .sidebar-actions .btn-teal { width: 100%; justify-content: center; padding: 0.95rem; font-size: 0.95rem; }
    .contact-mini { background: var(--teal-xlt); border: 1px solid rgba(13,110,110,0.2); border-radius: 16px; padding: 1.25rem; }
    .contact-mini p { font-size: 0.85rem; color: var(--text-lt); margin-bottom: 0.3rem; }
    .contact-mini a { font-size: 1.3rem; font-weight: 700; color: var(--teal); }

    /* INFO BOXES */
    .info-box { background: var(--teal-xlt); border: 1px solid rgba(13,110,110,0.2); border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .info-box-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; margin-bottom: 2rem; }
    @media(max-width:600px) { .info-box-grid { grid-template-columns: 1fr 1fr; } }
    .info-box-item { background: var(--white); border-radius: 12px; padding: 1.2rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .info-box-icon { font-size: 1.8rem; margin-bottom: 0.4rem; }
    .info-box-label { font-size: 0.75rem; color: var(--text-lt); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 0.2rem; }
    .info-box-val { font-weight: 700; font-size: 0.95rem; }

    /* RELATED */
    .related-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
    @media(max-width:800px) { .related-grid { grid-template-columns: 1fr 1fr; } }
    @media(max-width:500px) { .related-grid { grid-template-columns: 1fr; } }
    .related-card { background: var(--white); border-radius: 14px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.07); transition: transform 0.2s, box-shadow 0.2s; display: block; }
    .related-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
    .related-card img { width: 100%; height: 160px; object-fit: cover; display: block; }
    .related-card-body { padding: 1rem; }
    .related-card-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.3rem; }
    .related-card-meta { font-size: 0.82rem; color: var(--text-lt); }

    /* FOOTER */
    .footer { background: var(--night); border-top: 1px solid rgba(245,166,35,0.15); }
    .footer-main { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; max-width: 1200px; margin: 0 auto; padding: 4rem 2rem 3rem; }
    @media(max-width:900px) { .footer-main { grid-template-columns: 1fr 1fr; gap: 2rem; } }
    @media(max-width:560px) { .footer-main { grid-template-columns: 1fr; } }
    .f-logo { display: flex; align-items: center; gap: 0.6rem; font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: var(--gold); margin-bottom: 1rem; }
    .f-logo span { color: var(--white); }
    .f-desc { color: rgba(255,255,255,0.45); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.5rem; }
    .f-contact { display: flex; align-items: center; gap: 0.6rem; color: rgba(255,255,255,0.7); font-size: 0.88rem; margin-bottom: 0.6rem; }
    .f-contact:hover { color: var(--gold); }
    .f-col h4 { font-family: 'DM Sans'; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.2rem; }
    .f-links { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
    .f-links a { color: rgba(255,255,255,0.55); font-size: 0.88rem; transition: color 0.2s; display: flex; align-items: center; gap: 0.4rem; }
    .f-links a:hover { color: var(--gold); }
    .f-links a::before { content: "›"; color: var(--teal); font-weight: 700; }
    .f-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding: 1.25rem 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; max-width: 1200px; margin: 0 auto; }
    .f-copy { color: rgba(255,255,255,0.35); font-size: 0.8rem; }
    .f-copy span { color: var(--gold); }
    .f-socials { display: flex; gap: 0.75rem; }
    .f-soc { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.5); font-size: 0.9rem; transition: border-color 0.2s, color 0.2s, background 0.2s; }
    .f-soc:hover { border-color: var(--gold); color: var(--gold); background: rgba(245,166,35,0.08); }

    /* ANIMATIONS */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* MAX WIDTH HELPER */
    .mw { max-width: 1200px; margin: 0 auto; }
    .mw-sm { max-width: 900px; margin: 0 auto; }
    .mw-xs { max-width: 720px; margin: 0 auto; }

    /* SEARCH BAR */
    .svc-search { width: 100%; max-width: 480px; padding: 0.75rem 1.2rem; border: 2px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; transition: border-color 0.2s; margin-bottom: 1.5rem; }
    .svc-search:focus { border-color: var(--teal); }

    /* QUOTE BANNER */
    .quote-banner { background: linear-gradient(90deg, var(--teal-xlt), #fff); border: 1px solid rgba(13,110,110,0.2); border-radius: 16px; padding: 1.5rem 2rem; display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .quote-banner-text { flex: 1; }
    .quote-banner-text h3 { font-family: 'DM Sans'; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem; }
    .quote-banner-text p { font-size: 0.88rem; color: var(--text-lt); }

    /* SHARED SMALL-SCREEN HELPERS */
    .filter-bar { background: var(--sand); padding: 1.5rem 2rem; display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
    .filter-chip {
      padding: 0.5rem 1.2rem;
      border-radius: 999px;
      border: 2px solid var(--teal);
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.86rem;
      background: transparent;
      color: var(--teal);
    }
    .filter-chip.active { background: var(--teal); color: var(--white); }
    .split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2.5rem; }

    /* TABLET */
    @media (max-width: 900px) {
      .nav-main, .bc, .sec, .cta-strip, .ph-content, .ph-simple, .detail-wrap, .f-bottom { padding-left: 1.25rem; padding-right: 1.25rem; }
      .hero { min-height: 460px; }
      .detail-sidebar { position: static; }
    }

    /* PHONE */
    @media (max-width: 640px) {
      .nav-main { height: 60px; }
      .nav-logo { font-size: 1rem; gap: 0.45rem; }
      .site-logo { width: 34px; height: 34px; }
      .hero { min-height: 420px; }
      .hero-content { padding: 0 1rem; }
      .hero-sub, .ph-sub, .sec-sub { font-size: 0.95rem; }
      .hero-btns { width: 100%; }
      .hero-btns .btn-primary, .hero-btns .btn-outline { width: 100%; justify-content: center; }
      .sec { padding-top: 3.5rem; padding-bottom: 3.5rem; }
      .stats-band { padding: 1.4rem 1rem; gap: 0.75rem; }
      .stat-val { font-size: 1.7rem; }
      .card-img { height: 200px; }
      .card-actions { flex-direction: column; }
      .svc-card { align-items: flex-start; flex-direction: column; }
      .svc-btns { width: 100%; }
      .btn-sv, .btn-svv { flex: 1; text-align: center; }
      .detail-wrap { padding-top: 2.5rem; gap: 2rem; }
      .detail-img { height: 260px; border-radius: 14px; }
      .info-box-grid { grid-template-columns: 1fr; }
      .quote-banner { padding: 1.1rem; gap: 0.9rem; }
      .quote-banner .btn-wa { width: 100%; justify-content: center; }
      .sidebar-card-head, .sidebar-card-body, .sidebar-actions { padding-left: 1rem; padding-right: 1rem; }
      .sidebar-actions .btn-wa, .sidebar-actions .btn-primary, .sidebar-actions .btn-teal { font-size: 0.9rem; }
      .form-card { padding: 1.4rem; border-radius: 14px; }
      .footer-main { padding: 2.8rem 1.25rem 2rem; }
      .f-logo { font-size: 1.1rem; }
      .split-grid { grid-template-columns: 1fr; }
      .filter-bar { padding: 1rem; gap: 0.55rem; justify-content: flex-start; }
      .filter-chip { font-size: 0.8rem; padding: 0.42rem 0.9rem; }
      .float-btns { right: 0.9rem; bottom: 1rem; }
      .float-wa, .float-call { width: 50px; height: 50px; }
    }

    @media (max-width: 420px) {
      .nav-main, .bc, .sec, .cta-strip, .ph-content, .ph-simple, .detail-wrap, .f-bottom { padding-left: 1rem; padding-right: 1rem; }
      .hero-title { font-size: clamp(1.9rem, 9vw, 2.4rem); }
      .ph-title { font-size: clamp(1.7rem, 8.5vw, 2.3rem); }
      .contact-mini a { font-size: 1.1rem; }
    }
  `}</style>
);

/* ─── DATA ─── */
const slides = [
  { img: "/images/goa.jpg",    dest: "Kedarnath Yatra",    text: "Begin Your Sacred Journey" },
  { img: "/images/jaipur.jpg", dest: "Nainital Escape",    text: "The Lake City Awaits" },
  { img: "/images/manali.jpg", dest: "Char Dham Pilgrimage", text: "Seek Blessings in the Himalayas" },
];

export const packagesData = [
  {
    slug: "mussoorie-weekend-escape",
    name: "Mussoorie Weekend Escape", duration: "3 Days / 2 Nights",
    desc: "Relaxing weekend in Mussoorie with sightseeing and comfortable stays.",
    img: "/images/mussoorie.jpg", tag: "Hill Station",
    heroImg: "/images/mussoorie.jpg",
    distance: "35 km from Dehradun",
    groupSize: "2–10 people",
    difficulty: "Easy",
    bestTime: "March–June, Sept–Nov",
    longDesc: "Escape to the 'Queen of Hills' for a rejuvenating weekend. Stroll along the famous Mall Road, visit the stunning Kempty Falls, and enjoy panoramic views of the Himalayas from Lal Tibba. Our handpicked hotels ensure you sleep comfortably after each full day of exploration.",
    highlights: ["Mall Road evening stroll & shopping", "Kempty Falls — iconic multi-tiered waterfall", "Lal Tibba — highest point with Himalayan panorama", "Camel's Back Road sunrise walk", "Bhatta Falls dip", "Local Garhwali cuisine dinner experience"],
    includes: ["Pickup & drop from Dehradun / Haridwar / Haldwani", "2 nights hotel stay (double occupancy, AC)", "Daily breakfast included", "Cab & fuel for all sightseeing", "Experienced local driver-guide", "All toll, parking & permit charges"],
    excludes: ["Flights / train tickets", "Personal expenses & tips", "Any meals not mentioned", "Ropeway / cable car charges (if applicable)"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Mall Road", desc: "Pickup from Dehradun. Check-in to hotel. Afternoon walk on Mall Road, visit Mussoorie Lake. Evening stroll and dinner at a local restaurant." },
      { day: "Day 2", title: "Kempty Falls & Lal Tibba", desc: "Morning visit to Kempty Falls. Afternoon drive to Lal Tibba for stunning Himalayan views. Camel's Back Road walk at sunset." },
      { day: "Day 3", title: "Bhatta Falls & Departure", desc: "Post-breakfast visit to Bhatta Falls. Explore Company Garden. Checkout and drop back to Dehradun / Haridwar." },
    ],
    faqs: [
      { q: "Is this package suitable for families with kids?", a: "Absolutely! Mussoorie is very family-friendly with gentle walks, waterfalls, and cable car rides." },
      { q: "What is the best time to visit Mussoorie?", a: "March to June offers pleasant weather. September–November gives clear skies and best mountain views." },
    ],
    relatedSlugs: ["nainital-family-tour", "haridwar-spiritual-retreat", "rishikesh-adventure-package"],
  },
  {
    slug: "nainital-family-tour",
    name: "Nainital Family Tour", duration: "4 Days / 3 Nights",
    desc: "Family-friendly itinerary with lake visits, boating and scenic viewpoints.",
    img: "/images/nainital.jpg", tag: "Hill Station",
    heroImg: "/images/nainital.jpg",
    distance: "65 km from Haldwani",
    groupSize: "2–12 people",
    difficulty: "Easy",
    bestTime: "March–June, Oct–Nov",
    longDesc: "Nainital — the jewel of Kumaon — is built around the gorgeous Naini Lake. Enjoy a relaxing boating session, visit the famous Naina Devi Temple, take a cable car ride to Snow View Point, and let the kids have fun at the Zoo.",
    highlights: ["Naini Lake boating (rowing & paddle boats)", "Snow View Point cable car ride", "Naina Devi Temple darshan", "Nainital Zoo & wildlife viewing", "Tiffin Top trekking trail", "Cave Garden & Eco Cave Gardens", "Mall Road shopping for souvenirs"],
    includes: ["Pickup & drop from Haldwani / Delhi", "3 nights hotel stay (AC, double occupancy)", "Breakfast & dinner daily", "All sightseeing by cab", "Parking & toll charges", "Local guide (half-day Nainital city tour)"],
    excludes: ["Cable car / boating tickets", "Flights / train tickets", "Lunch", "Personal expenses"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Naini Lake", desc: "Pickup from Haldwani. Check-in. Afternoon Naini Lake boating. Evening Mall Road stroll, dinner." },
      { day: "Day 2", title: "Snow View & Naina Devi", desc: "Morning cable car to Snow View Point. Naina Devi Temple darshan. Afternoon Eco Cave Gardens." },
      { day: "Day 3", title: "Tiffin Top & Zoo", desc: "Morning trek to Tiffin Top. Afternoon Nainital Zoo. Local market exploration." },
      { day: "Day 4", title: "Sattal & Departure", desc: "Post-breakfast drive to Sattal (Seven Lakes). Lunch en route. Drop back to Haldwani / Delhi." },
    ],
    faqs: [
      { q: "Are meals included?", a: "Yes — breakfast and dinner are included for all 3 days. Lunch is on your own." },
      { q: "Can we customize the itinerary?", a: "Absolutely! We can add Bhimtal, Mukteshwar, or Corbett to your Nainital trip." },
    ],
    relatedSlugs: ["mussoorie-weekend-escape", "almora-cultural-escape", "jim-corbett-safari"],
  },
  {
    slug: "char-dham-yatra",
    name: "Char Dham Yatra", duration: "10 Days / 9 Nights",
    desc: "Complete pilgrimage package with guided transfers, stays and mule arrangements.",
    img: "/images/chardham.jpg", tag: "Spiritual",
    heroImg: "/images/chardham.jpg",
    distance: "1,000+ km circuit from Haridwar",
    groupSize: "2–20 people",
    difficulty: "Moderate–Challenging",
    bestTime: "May–June, Sept–Oct",
    longDesc: "Embark on the most sacred journey in Hinduism — the Char Dham Yatra, visiting Yamunotri, Gangotri, Kedarnath and Badrinath. Our expert team handles every detail — from comfortable transport and verified accommodation to a religious guide who helps you navigate the rituals.",
    highlights: ["Yamunotri temple darshan (source of Yamuna)", "Gangotri — origin of the Ganges", "Kedarnath Jyotirlinga (one of 12 Shiva shrines)", "Badrinath Vishnu shrine", "Ganga Aarti at Haridwar / Rishikesh", "Triyuginarayan temple"],
    includes: ["All cab transfers Haridwar ↔ Char Dham circuit", "9 nights hotel / camp stays (double occupancy)", "All meals (breakfast + dinner)", "Expert religious guide throughout", "Mule / doli arrangement for Kedarnath trek", "Emergency medical support & oxygen cylinder", "All toll, parking, and pilgrim registration"],
    excludes: ["Flights / trains to Haridwar", "Helicopter service (optional add-on)", "Lunch", "Personal expenses & donations"],
    itinerary: [
      { day: "Day 1–2", title: "Haridwar → Yamunotri", desc: "Arrive Haridwar. Overnight to Janki Chatti. Trek to Yamunotri temple. Return to camp." },
      { day: "Day 3–4", title: "Gangotri", desc: "Drive to Gangotri. Temple darshan. Explore Bhairav Ghati & Gaumukh trail." },
      { day: "Day 5–6", title: "Kedarnath", desc: "Drive to Gaurikund. Trek / mule ride to Kedarnath (14 km). Temple darshan and stay." },
      { day: "Day 7–8", title: "Badrinath", desc: "Drive via Pipalkoti to Badrinath. Darshan, Mana Village, Vasudhara Falls." },
      { day: "Day 9", title: "Rishikesh", desc: "Drive to Rishikesh. Evening Ganga Aarti at Triveni Ghat." },
      { day: "Day 10", title: "Departure", desc: "Return to Haridwar / Delhi. Journey concludes." },
    ],
    faqs: [
      { q: "What is the altitude of Kedarnath?", a: "Kedarnath temple is at 3,583 metres above sea level. We recommend acclimatization stops." },
      { q: "Is the mule compulsory for Kedarnath?", a: "No. Fit pilgrims can trek the 14 km path. Mules, dolis and helicopter services are available." },
    ],
    relatedSlugs: ["kedarnath-pilgrimage", "badrinath-spiritual-tour", "haridwar-spiritual-retreat"],
  },
  {
    slug: "rishikesh-adventure-package",
    name: "Rishikesh Adventure Package", duration: "3 Days / 2 Nights",
    desc: "White-water rafting, riverside camping and yoga for adventure lovers.",
    img: "/images/rishikesh.jpg", tag: "Adventure",
    heroImg: "/images/rishikesh.jpg",
    distance: "240 km from Delhi",
    groupSize: "2–20 people",
    difficulty: "Moderate",
    bestTime: "Sept–June (best: Oct–Mar)",
    longDesc: "Rishikesh — the adventure capital of India — sits at the confluence of the Ganges and the Himalayas. Experience the adrenaline rush of Grade III–IV rapids on the sacred Ganges, spend a night under the stars at a riverside camp, and practice sunrise yoga at dawn.",
    highlights: ["16 km Grade III–IV white-water rafting", "Riverside camping under a canopy of stars", "Bungee jumping (83m) — optional add-on", "Sunrise yoga & pranayama session", "Laxman Jhula & Ram Jhula walk", "Evening Ganga Aarti at Triveni Ghat"],
    includes: ["2 nights riverside camp stay (twin sharing)", "All meals at camp (3 meals/day)", "16 km rafting with certified guides & all safety gear", "Yoga session (1.5 hours)", "Pickup & drop from Haridwar / Dehradun", "All permits, forest & river entry fees"],
    excludes: ["Bungee / zip-line add-ons", "Personal gear", "Travel insurance", "Flights / trains"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Evening Aarti", desc: "Arrive Rishikesh / Haridwar pickup. Check in to riverside camp. Evening Ganga Aarti at Triveni Ghat. Campfire dinner." },
      { day: "Day 2", title: "Rafting & Yoga", desc: "5 AM sunrise yoga. After breakfast — 16 km white-water rafting. Afternoon cliff jumping. Campfire stories." },
      { day: "Day 3", title: "Laxman Jhula & Departure", desc: "Morning yoga. Explore Laxman Jhula & Ram Jhula. Beatles Ashram visit. Post-lunch drop to Haridwar / Dehradun." },
    ],
    faqs: [
      { q: "Is rafting safe for non-swimmers?", a: "Yes! All participants are provided with certified life jackets and helmets. Non-swimmers can participate safely." },
      { q: "What is the best season for rafting?", a: "October to June offers the best conditions. July–September (monsoon) is when the river is closed." },
    ],
    relatedSlugs: ["haridwar-spiritual-retreat", "auli-skiing-getaway", "char-dham-yatra"],
  },
  {
    slug: "haridwar-spiritual-retreat",
    name: "Haridwar Spiritual Retreat", duration: "2 Days / 1 Night",
    desc: "Ganga Aarti, holy dip, temple visits and peaceful spiritual vibes.",
    img: "/images/haridwar.jpg", tag: "Spiritual",
    heroImg: "/images/haridwar.jpg",
    distance: "214 km from Delhi",
    groupSize: "1–15 people",
    difficulty: "Easy",
    bestTime: "Oct–Mar, Kumbh years",
    longDesc: "Haridwar — 'Gateway to the Gods' — is where the sacred Ganga descends from the Himalayas to the plains. Witness the breathtaking Ganga Aarti at Har Ki Pauri at dusk, take a sacred dip at dawn, and climb to Mansa Devi by cable car.",
    highlights: ["Ganga Aarti at Har Ki Pauri (dusk & dawn)", "Holy dip in the Ganges at Brahmakund", "Mansa Devi Temple via cable car", "Chandi Devi Temple visit", "Sapt Rishi Ashram meditation", "Local market for prasad & Ayurvedic herbs"],
    includes: ["1 night hotel near Har Ki Pauri", "Breakfast included", "Cab pickup & drop (Delhi / Dehradun)", "All temple entry & cable car tickets", "Local escort guide"],
    excludes: ["Lunch & dinner", "Personal expenses", "Train / flight tickets"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Ganga Aarti", desc: "Arrive Haridwar. Check-in. Cable car to Mansa Devi Temple. Evening — witness the magical Ganga Aarti at Har Ki Pauri." },
      { day: "Day 2", title: "Holy Dip & Departure", desc: "5 AM holy dip at Brahmakund. Chandi Devi Temple. Prasad shopping at Bara Bazaar. Post-breakfast departure." },
    ],
    faqs: [
      { q: "Is Kumbh Mela covered in this package?", a: "During Kumbh Mela years, we offer special packages. Please call us for customized arrangements." },
    ],
    relatedSlugs: ["char-dham-yatra", "rishikesh-adventure-package", "kedarnath-pilgrimage"],
  },
  {
    slug: "auli-skiing-getaway",
    name: "Auli Skiing Getaway", duration: "4 Days / 3 Nights",
    desc: "Snow-covered slopes, Asia's longest gondola and breathtaking Himalayan views.",
    img: "/images/auli.jpg", tag: "Adventure",
    heroImg: "/images/auli.jpg",
    distance: "340 km from Haridwar",
    groupSize: "2–8 people",
    difficulty: "Moderate",
    bestTime: "Dec–Mar (skiing), Sept–Nov (trekking)",
    longDesc: "Auli — sitting at 2,519 metres — is one of India's premier ski resorts with a jaw-dropping backdrop of Nanda Devi, Kamet, Mana Parvat and other Himalayan giants. Asia's longest ropeway connects Joshimath to Auli.",
    highlights: ["Skiing & snowboarding on Auli slopes", "Asia's longest ropeway — 4 km gondola ride", "Nanda Devi & Kamet peak panorama", "Gurso Bugyal meadow trek (3,056 m)", "Joshimath — Adi Shankaracharya's winter abode"],
    includes: ["3 nights hotel / resort", "Breakfast & dinner daily", "Skiing equipment rental", "Certified ski instructor (2 hrs/day for 2 days)", "Ropeway (gondola) tickets both ways", "Cab transfers from Haridwar / Rishikesh"],
    excludes: ["Ropeway additional rides", "Personal ski gear", "Lunch", "Travel insurance"],
    itinerary: [
      { day: "Day 1", title: "Haridwar → Joshimath → Auli", desc: "Pickup from Haridwar. Scenic 8-hour drive. Cable car to Auli. Check-in & evening views." },
      { day: "Day 2", title: "First Day Skiing", desc: "Morning ski instructor session for beginners. Afternoon free skiing. Sunset with Nanda Devi backdrop." },
      { day: "Day 3", title: "Gurso Bugyal Trek", desc: "Short trek to Gurso Bugyal meadow. Afternoon skiing. Campfire." },
      { day: "Day 4", title: "Joshimath & Departure", desc: "Morning Nanda Devi viewpoint. Descend to Joshimath. Drive back to Haridwar." },
    ],
    faqs: [
      { q: "Do I need prior skiing experience?", a: "No! Our certified instructors teach complete beginners. We have slopes for all levels." },
    ],
    relatedSlugs: ["rishikesh-adventure-package", "char-dham-yatra", "badrinath-spiritual-tour"],
  },
  {
    slug: "jim-corbett-safari",
    name: "Jim Corbett Safari", duration: "2 Days / 1 Night",
    desc: "Wildlife jeep safari in India's oldest national park — home of the Bengal Tiger.",
    img: "/images/jimcorbett.jpg", tag: "Wildlife",
    heroImg: "/images/jimcorbett.jpg",
    distance: "250 km from Delhi",
    groupSize: "2–6 people",
    difficulty: "Easy",
    bestTime: "Nov–June (park closed July–Oct)",
    longDesc: "Jim Corbett National Park — established in 1936 — is India's oldest and most prestigious national park. Home to 215+ Bengal Tigers, 600+ bird species, and large herds of Asian elephants.",
    highlights: ["Jeep safari in Bijrani / Dhikala / Jhirna zone", "Bengal Tiger spotting", "Asian elephant herds", "Leopard, Gharial crocodile sightings", "600+ bird species", "Expert certified naturalist guide"],
    includes: ["1 night jungle resort stay (AC cottage)", "All meals at resort (breakfast, lunch, dinner)", "2 jeep safari sessions with all forest permits", "Certified naturalist guide", "Cab transfers from Delhi / Haldwani"],
    excludes: ["Elephant safari (optional)", "Personal expenses", "Flights / trains"],
    itinerary: [
      { day: "Day 1", title: "Arrive & Evening Safari", desc: "Pickup from Delhi / Haldwani. Check-in to jungle resort. Afternoon/evening jeep safari. Campfire dinner with naturalist talk." },
      { day: "Day 2", title: "Dawn Safari & Departure", desc: "5 AM dawn safari (best time for tiger sightings). Post-safari breakfast. Nature walk & Corbett Museum. Post-lunch departure." },
    ],
    faqs: [
      { q: "Is tiger sighting guaranteed?", a: "No wildlife experience can guarantee tiger sightings, but Jim Corbett has one of the highest tiger densities in the world." },
    ],
    relatedSlugs: ["nainital-family-tour", "mussoorie-weekend-escape", "almora-cultural-escape"],
  },
  {
    slug: "kedarnath-pilgrimage",
    name: "Kedarnath Pilgrimage", duration: "5 Days / 4 Nights",
    desc: "Sacred Shiva pilgrimage with comfortable arrangements and expert guidance.",
    img: "/images/chardham.jpg", tag: "Spiritual",
    heroImg: "/images/chardham.jpg",
    distance: "220 km from Rishikesh to Gaurikund",
    groupSize: "2–15 people",
    difficulty: "Moderate–Challenging",
    bestTime: "May–June, Sept–Oct",
    longDesc: "Kedarnath — one of the 12 sacred Jyotirlingas of Lord Shiva — sits at 3,583 metres in the Garhwal Himalayas. Our package handles every arrangement so you can focus entirely on your darshan.",
    highlights: ["Kedarnath temple darshan (Jyotirlinga)", "14 km trek through the scenic Mandakini valley", "Vasuki Tal alpine lake", "Gaurikund hot springs (Tapt Kund) dip", "Triyuginarayan temple", "Bhairavnath temple on the trek"],
    includes: ["4 nights accommodation", "All meals (breakfast + dinner)", "Cab transfers Haridwar ↔ Gaurikund", "Expert pilgrim guide", "Kedarnath Registration & all permits"],
    excludes: ["Helicopter service (add-on)", "Puja materials & donations", "Mule charges (if opted)", "Personal expenses"],
    itinerary: [
      { day: "Day 1", title: "Haridwar → Guptkashi", desc: "Early morning pickup from Haridwar. Scenic drive via Devprayag, Rudraprayag to Guptkashi." },
      { day: "Day 2", title: "Gaurikund → Kedarnath", desc: "Drive to Gaurikund. Begin 14 km trek (or mule). Reach Kedarnath. Evening darshan." },
      { day: "Day 3", title: "Kedarnath Darshan", desc: "4 AM VIP darshan. Bhairavnath temple visit. Post-afternoon trek back to Gaurikund." },
      { day: "Day 4", title: "Guptkashi → Rishikesh", desc: "Drive to Rishikesh. Visit Triyuginarayan temple en route. Evening Ganga Aarti." },
      { day: "Day 5", title: "Departure", desc: "Post-breakfast drive to Haridwar / Delhi. Journey concludes." },
    ],
    faqs: [
      { q: "Is the trek difficult for senior citizens?", a: "We strongly recommend mules or doli (palanquin) for seniors. Helicopter services are also available." },
      { q: "When does Kedarnath open and close?", a: "Kedarnath temple typically opens in early May (Akshaya Tritiya) and closes in November (Diwali)." },
    ],
    relatedSlugs: ["char-dham-yatra", "badrinath-spiritual-tour", "haridwar-spiritual-retreat"],
  },
  {
    slug: "badrinath-spiritual-tour",
    name: "Badrinath Spiritual Tour", duration: "5 Days / 4 Nights",
    desc: "Divine journey to the abode of Lord Vishnu in the Himalayas.",
    img: "/images/badrinath.jpg", tag: "Spiritual",
    heroImg: "/images/badrinath.jpg",
    distance: "297 km from Rishikesh",
    groupSize: "2–15 people",
    difficulty: "Moderate",
    bestTime: "May–June, Sept–Oct",
    longDesc: "Badrinath — the northernmost of the four Dhams — is the sacred abode of Lord Vishnu. Visit Mana Village (the last Indian village before the Tibet border), Vasudhara Falls, and Brahma Kapal.",
    highlights: ["Badrinath Vishnu temple darshan", "Mana Village — last Indian village before Tibet", "Vasudhara Falls — 145-metre waterfall", "Brahma Kapal for ancestral rites", "Tapt Kund hot spring dip before darshan"],
    includes: ["4 nights stay", "All meals (breakfast + dinner)", "Expert religious guide throughout", "Cab transfers Haridwar ↔ Badrinath", "All entry fees & permits"],
    excludes: ["Puja materials & donations", "Helicopter (optional)", "Lunch", "Personal expenses"],
    itinerary: [
      { day: "Day 1", title: "Haridwar → Joshimath", desc: "Pickup from Haridwar. Drive via Devprayag, Chamoli to Joshimath." },
      { day: "Day 2", title: "Joshimath → Badrinath Darshan", desc: "Drive to Badrinath. Tapt Kund dip. Temple darshan. Brahma Kapal rituals." },
      { day: "Day 3", title: "Mana Village & Vasudhara", desc: "Morning darshan. Drive to Mana Village. Bheem Pul, Vyas Gufa, Saraswati River. Trek to Vasudhara Falls." },
      { day: "Day 4", title: "Joshimath → Rishikesh", desc: "Return drive. Visit Narsingh temple Joshimath. Arrive Rishikesh. Evening Aarti." },
      { day: "Day 5", title: "Departure", desc: "Drive to Haridwar. Journey concludes." },
    ],
    faqs: [
      { q: "Can we combine Badrinath and Kedarnath?", a: "Absolutely — the Chota Char Dham package combines both. It takes 7–10 days." },
    ],
    relatedSlugs: ["char-dham-yatra", "kedarnath-pilgrimage", "haridwar-spiritual-retreat"],
  },
  {
    slug: "almora-cultural-escape",
    name: "Almora Cultural Escape", duration: "3 Days / 2 Nights",
    desc: "Kumaoni culture, ancient temples, famous local sweets and panoramic Himalayan views.",
    img: "/images/almora.jpg", tag: "Hill Station",
    heroImg: "/images/almora.jpg",
    distance: "35 km from Kathgodam",
    groupSize: "2–10 people",
    difficulty: "Easy",
    bestTime: "April–June, Sept–Oct",
    longDesc: "Almora — the cultural heart of Kumaon — is a beautiful hilltown at 1,638 metres. Kasar Devi hill is one of the few places on Earth in the Van Allen Belt. Combine ancient temples, Kumaoni cuisine, local handicrafts and breathtaking Himalayan sunrises.",
    highlights: ["Kasar Devi Temple (cosmic energy / Van Allen Belt zone)", "Nanda Devi Temple in the historic bazaar", "Bright End Corner — most beautiful sunrise viewpoint in Kumaon", "Gobind Ballabh Pant Museum", "Chitai Golu Devta Temple", "Almora's famous Bal Mithai & Singodi sweets"],
    includes: ["2 nights heritage / boutique hotel stay", "Breakfast daily", "Cab pickup & drop (Haldwani / Delhi)", "Sightseeing by cab", "Local culture guide (half day)"],
    excludes: ["Lunch & dinner", "Museum entry fees", "Personal shopping"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Bazaar Walk", desc: "Pickup from Haldwani. Check-in. Afternoon Bright End Corner viewpoint. Evening walk through Lal Bazaar." },
      { day: "Day 2", title: "Temples & Museum", desc: "Morning Kasar Devi Temple (sunrise). Chitai Golu Devta. Nanda Devi Temple. Gobind Ballabh Pant Museum." },
      { day: "Day 3", title: "Sunrise & Departure", desc: "Dawn sunrise at Bright End Corner. Post-breakfast departure to Haldwani / Delhi." },
    ],
    faqs: [
      { q: "Is Almora suitable for solo travellers?", a: "Absolutely! Almora is very safe and welcoming. The hilltown has a vibrant arts and spiritual community." },
    ],
    relatedSlugs: ["nainital-family-tour", "mussoorie-weekend-escape", "jim-corbett-safari"],
  },
];

// Helper to build a generic service object
const svc = (slug, name, icon, distance, duration, category, desc, longDesc, vehicles, includes, tips) => ({
  slug, name, icon, distance, duration, category, desc,
  longDesc: longDesc || desc,
  vehicles: vehicles || [],
  includes: includes || [],
  tips: tips || [],
});

export const servicesData = [
  // ── Point-to-Point (Outgoing) ──
  svc("haldwani-to-delhi","Haldwani to Delhi","🚖","300 km","5–6 hrs","Point-to-Point","Comfortable, direct door-to-door cab service from Haldwani to Delhi. AC vehicles, punctual pickup, experienced drivers on NH-9. Available round the clock.","Haldwani is the gateway city to Uttarakhand's Kumaon region, and Delhi is just 300 km away on National Highway 9 (NH-9). Our drivers are familiar with every rest stop, fuel station and shortcut on this route.",["Sedan (Dzire/Etios)","SUV (Ertiga)","Innova Crysta","Tempo Traveller (12 seater)"],["Door-to-door pickup & drop","All toll & parking charges","24/7 availability including night travel","One-way and round-trip options","AC vehicle, sanitized before every trip"],["Book 2–3 hours before travel for best availability","Haldwani to Delhi via Rampur is the fastest route"]),
  svc("rudrapur-to-delhi","Rudrapur to Delhi","🚕","260 km","4–5 hrs","Point-to-Point","Smooth, comfortable transfer from Rudrapur to Delhi NCR with professional drivers. Rudrapur is a major industrial hub with frequent business travellers.","Rudrapur — an industrial and commercial city in Udham Singh Nagar district — has a growing demand for reliable intercity cab service to Delhi.",["Sedan (Dzire/Etios)","SUV (Ertiga)","Innova Crysta"],["Door-to-door service","All tolls included","Night travel available","Single and round-trip options"],["Excellent for business travel from Rudrapur's industrial estates"]),
  svc("ramnagar-to-delhi","Ramnagar to Delhi","🐅","270 km","5 hrs","Point-to-Point","Ramnagar is the gateway to Jim Corbett National Park. We provide reliable cab service from Ramnagar to Delhi after your wildlife safari.","Ramnagar serves as the main entry point for Jim Corbett National Park. We provide clean, comfortable, AC cabs for the return journey.",["Sedan","SUV (Ertiga)","Innova"],["Hotel / resort pickup","All tolls","Flexible departure times for post-safari travel"],["Book return journey in advance — Ramnagar can be busy on weekends"]),
  svc("khatima-to-delhi","Khatima to Delhi","🚗","290 km","5 hrs","Point-to-Point","Dependable cab service from Khatima to Delhi with experienced drivers. Khatima is near the Nepal border.","Khatima is a border town in Udham Singh Nagar district near the Nepal border with regular need for reliable cab connections to Delhi.",["Sedan","SUV","Innova"],["All tolls","AC vehicle","24/7 service","Night travel safe"],[]),
  svc("vanvasa-to-delhi","Vanvasa to Delhi","🌿","310 km","5–6 hrs","Point-to-Point","Reliable cab service from Vanvasa (near Sitarganj) to Delhi NCR with comfortable AC vehicles.","Vanvasa and the Sitarganj area in Udham Singh Nagar district are well-served by our cab network.",["Sedan","SUV"],["All tolls","AC vehicle","Door pickup"],[]),
  svc("rampur-to-delhi","Rampur to Delhi","🏙️","320 km","5–6 hrs","Point-to-Point","Comfortable cab service from Rampur, Uttar Pradesh to Delhi NCR. Rampur is on the main Lucknow–Delhi highway.","Rampur is a historic city in Uttar Pradesh on the route between Lucknow and Delhi, also serving as a gateway towards Haldwani and Uttarakhand.",["Sedan","SUV"],["All tolls","AC vehicle","Night travel"],[]),
  svc("ghaziabad-to-haldwani","Ghaziabad to Haldwani","🌄","270 km","4.5–5.5 hrs","Point-to-Point","Reliable cab service from Ghaziabad (Delhi NCR) to Haldwani — the gateway to Kumaon's hill stations.","Ghaziabad is part of the Delhi NCR region and one of the most common origin points for travellers heading to Uttarakhand's Kumaon region.",["Sedan","SUV (Ertiga)","Innova"],["Toll charges","AC vehicle","Flexible pickup from Ghaziabad / Indirapuram / Vaishali"],["Early morning departures (4–5 AM) get you to Haldwani by 9–10 AM"]),
  svc("noida-to-haldwani","Noida to Haldwani","🏔️","290 km","5 hrs","Point-to-Point","Premium cab service from Noida (Sector 1–150, Greater Noida) to Haldwani. Perfect for Kumaon hill station getaways.","Noida has a huge population of Uttarakhand migrants who frequently visit Nainital, Corbett, and other Kumaon destinations.",["Sedan","SUV (Ertiga)","Innova Crysta"],["Pickup from any Noida sector","All tolls on Yamuna Expressway and NH-9","AC cab, sanitized"],["Noida Sector 18 to Haldwani takes approximately 4.5–5 hrs in normal traffic"]),
  svc("almora-to-delhi-taxi","Almora To Delhi Taxi","🏔️","380 km","7–8 hrs","Point-to-Point","Comfortable taxi service from Almora to Delhi NCR via Haldwani.","We pick you up from any point in Almora and drop you directly at your Delhi destination. The scenic drive via Haldwani and Moradabad takes 7–8 hours.",["Sedan","SUV (Ertiga)","Innova Crysta"],["Door-to-door pickup","All tolls","AC vehicle"],[]),
  svc("bageshwar-to-delhi-taxi","Bageshwar To Delhi Taxi","⛰️","430 km","8–9 hrs","Point-to-Point","Direct cab service from Bageshwar to Delhi. Bageshwar is a sacred town in the Kumaon Himalayas at the confluence of Saryu and Gomati rivers.","Bageshwar — known for the Bagnath Temple — is a popular pilgrimage and trekking base in Kumaon. We provide reliable door-to-door service to Delhi and NCR.",["Sedan","SUV","Innova"],["All tolls","Mountain-experienced driver","AC vehicle"],[]),
  svc("chamoli-to-delhi-taxi","Chamoli To Delhi Taxi","⛰️","460 km","9–10 hrs","Point-to-Point","Cab service from Chamoli district (Badrinath / Joshimath / Gauchar area) to Delhi.","Chamoli district is the gateway to Badrinath and the Nanda Devi region. We provide reliable transfers from anywhere in Chamoli district to Delhi.",["SUV (Ertiga / Innova — recommended for mountain start)"],["Mountain-experienced driver","All tolls","Hotel/resort pickup"],[]),
  svc("champawat-to-delhi-taxi","Champawat To Delhi Taxi","🌄","410 km","8–9 hrs","Point-to-Point","Cab service from Champawat — the ancient capital of the Chand dynasty — to Delhi NCR.","Champawat is a historical district headquarters in Kumaon with ancient temples and forts. We provide reliable transfers to Delhi.",["Sedan","SUV"],["All tolls","AC vehicle"],[]),
  svc("dehradun-to-delhi-taxi","Dehradun To Delhi Taxi","🚖","290 km","5–6 hrs","Point-to-Point","Daily taxi service from Dehradun to Delhi. The capital of Uttarakhand to the capital of India — smooth highway travel on NH-58.","Dehradun to Delhi is one of our busiest routes. The 290 km journey passes through Roorkee, Muzaffarnagar and Meerut on NH-58.",["Sedan (Dzire)","SUV (Ertiga)","Innova Crysta"],["Pickup from any Dehradun area","All tolls","Door-to-door drop"],[]),
  svc("pauri-garhwal-to-delhi-taxi","Pauri Garhwal To Delhi Taxi","🏔️","350 km","7 hrs","Point-to-Point","Cab service from Pauri Garhwal (Lansdowne / Pauri town) to Delhi NCR.","Pauri Garhwal is one of Uttarakhand's scenic district headquarters, known for Lansdowne cantonment and Khirsu viewpoint. We provide comfortable transfers to Delhi.",["Sedan","SUV","Innova"],["All tolls","Mountain-road experienced driver"],[]),
  svc("pithoragarh-to-delhi-taxi","Pithoragarh To Delhi Taxi","⛰️","480 km","9–10 hrs","Point-to-Point","Long-distance taxi from Pithoragarh — the 'Little Kashmir' of Uttarakhand — to Delhi NCR.","Pithoragarh is the last major town before the India-Nepal and India-Tibet borders. We provide comfortable, safe long-distance transfers to Delhi.",["SUV (Ertiga)","Innova Crysta (recommended for long journey)"],["Experienced long-distance driver","All tolls","Comfort stops en route"],[]),
  svc("rudraprayag-to-delhi-taxi","Rudraprayag To Delhi Taxi","🏔️","380 km","7–8 hrs","Point-to-Point","Cab service from Rudraprayag — the sacred confluence of Alaknanda and Mandakini — to Delhi.","Rudraprayag is the jumping-off point for Kedarnath. Many pilgrims complete their yatra and need a comfortable return journey to Delhi. We provide reliable service.",["Sedan","SUV","Innova"],["All tolls","Direct drop to Delhi/NCR"],[]),
  svc("tehri-garhwal-to-delhi-taxi","Tehri Garhwal To Delhi Taxi","🏔️","320 km","6–7 hrs","Point-to-Point","Cab service from Tehri / New Tehri to Delhi. Tehri Dam — Asia's highest dam — is a popular stopover.","New Tehri is a modern hill city built after the old Tehri was submerged under the Tehri Dam reservoir. We provide comfortable transfer services.",["Sedan","SUV","Innova"],["All tolls","AC vehicle"],[]),
  svc("udham-singh-nagar-to-delhi-taxi","Udham Singh Nagar To Delhi Taxi","🚖","270 km","5 hrs","Point-to-Point","Cab service from anywhere in Udham Singh Nagar district (Rudrapur, Kashipur, Khatima, Sitarganj, Bazpur) to Delhi.","Udham Singh Nagar is Uttarakhand's most industrialized district and has the highest demand for Delhi cab services. We cover all towns.",["Sedan","SUV","Innova","Tempo Traveller"],["All tolls","AC vehicle","Pickup from any USN location"],[]),
  svc("uttarkashi-to-delhi-taxi","Uttarkashi To Delhi Taxi","⛰️","400 km","8–9 hrs","Point-to-Point","Long-distance cab service from Uttarkashi — base for Gangotri pilgrimage — to Delhi NCR.","Uttarkashi is the base city for Gangotri and Yamunotri pilgrimages. After their sacred journey, many pilgrims need reliable transport back to Delhi.",["SUV (Ertiga)","Innova Crysta"],["Experienced mountain driver","All tolls","Comfort stops"],[]),
  svc("nainital-to-delhi-taxi","Nainital To Delhi Taxi","🏔️","290 km","6–7 hrs","Point-to-Point","Taxi service from Nainital to Delhi — one of the most popular hill station return routes in North India.","Nainital to Delhi is one of our busiest return routes, especially on Sunday evenings after weekend getaways. We pick up from any hotel in Nainital.",["Sedan (Dzire)","SUV (Ertiga)","Innova Crysta"],["Pickup from any Nainital hotel","All tolls","Round trip available"],["Sunday evening pickups need advance booking"]),
  svc("haridwar-to-delhi-taxi","Haridwar To Delhi Taxi","🛕","220 km","4–5 hrs","Point-to-Point","Daily taxi service from Haridwar to Delhi. Comfortable, clean AC cabs for the reverse journey.","Haridwar to Delhi is a very popular return route after pilgrimages, weekend Ganga Aarti visits, and Rishikesh trips.",["Sedan","SUV (Ertiga)","Innova Crysta"],["Pickup from any Haridwar ghat or hotel","All tolls","Night travel available"],[]),
  svc("kedarnath-to-haridwar","Kedarnath To Haridwar","🙏","250 km","7–8 hrs","Point-to-Point","Return cab service from Gaurikund (base of Kedarnath) to Haridwar after your pilgrimage.","After completing the sacred Kedarnath yatra, we arrange comfortable return transport from Gaurikund back to Haridwar or Rishikesh.",["SUV / Innova Crysta (mountain roads)"],["Pickup from Gaurikund / Sonprayag","All tolls","Experienced mountain driver"],["Book in advance during peak pilgrimage season"]),
  svc("badrinath-to-haridwar","Badrinath To Haridwar","🙏","320 km","8–9 hrs","Point-to-Point","Return cab from Badrinath to Haridwar via the scenic Chamoli corridor.","After Badrinath darshan, we provide comfortable return transport through the beautiful Alaknanda valley back to Haridwar.",["SUV / Innova Crysta"],["Pickup from Badrinath / Joshimath","All tolls","Experienced driver"],[]),

  // ── Delhi to Various ──
  svc("delhi-to-nainital","Delhi To Nainital Taxi","🏔️","290 km","6–7 hrs","Delhi Routes","Comfortable taxi service from Delhi to Nainital — one of the most popular hill station routes in North India.","Delhi to Nainital is one of our busiest routes, especially on weekends and during summer vacation. The journey takes 6–7 hours and passes through Moradabad and Haldwani.",["Sedan (Dzire)","SUV (Ertiga)","Innova Crysta"],["Pickup from any Delhi NCR point","All tolls","Driver waits at Nainital or drop only","Round trip available"],["Friday evenings are busiest — book in advance"]),
  svc("delhi-to-haridwar","Delhi To Haridwar Taxi","🛕","220 km","4–5 hrs","Delhi Routes","Daily taxi service from Delhi to Haridwar — the holy city on the Ganges. Perfect for weekend getaways and Ganga Aarti visits.","Delhi to Haridwar is a very popular weekend getaway. The 220 km journey on NH-58 (via Roorkee) takes 4–5 hours.",["Sedan","SUV (Ertiga)","Innova Crysta"],["Pickup from Delhi / NCR","All tolls","Any Delhi address drop"],["Leave Delhi by 5 AM to arrive for Haridwar's morning aarti"]),
  svc("delhi-to-almora-taxi","Delhi To Almora Taxi","🏔️","360 km","7–8 hrs","Delhi Routes","Direct taxi service from Delhi to Almora — the cultural capital of Kumaon.","Delhi to Almora via Haldwani passes through Moradabad and Rampur. Almora sits on a scenic horseshoe ridge at 1,638 metres.",["Sedan","SUV","Innova"],["Pickup from any Delhi NCR point","All tolls","Door-to-door service"],[]),
  svc("delhi-to-bageshwar-taxi","Delhi To Bageshwar Taxi","⛰️","430 km","8–9 hrs","Delhi Routes","Direct taxi from Delhi to Bageshwar — the sacred Kumaon town known for Bagnath Temple and Kausani proximity.",null,["Sedan","SUV","Innova"],["All tolls","AC vehicle"],[]),
  svc("delhi-to-chamoli-taxi","Delhi To Chamoli Taxi","⛰️","460 km","9–10 hrs","Delhi Routes","Taxi service from Delhi to Chamoli district — gateway to Badrinath and the Nanda Devi region.",null,["SUV (Ertiga)","Innova Crysta"],["All tolls","Mountain-road experienced driver"],[]),
  svc("delhi-to-champawat-taxi","Delhi To Champawat Taxi","🌄","410 km","8–9 hrs","Delhi Routes","Taxi service from Delhi to Champawat — the ancient Chand dynasty capital in Kumaon.",null,["Sedan","SUV"],["All tolls","AC vehicle"],[]),
  svc("delhi-to-dehradun-taxi","Delhi To Dehradun Taxi","🚖","290 km","5–6 hrs","Delhi Routes","Daily taxi from Delhi to Dehradun — the capital of Uttarakhand. Fast, comfortable NH-58 journey.",null,["Sedan (Dzire)","SUV (Ertiga)","Innova Crysta"],["Pickup from any Delhi NCR point","All tolls"],[]),
  svc("delhi-to-pauri-garhwal-taxi","Delhi To Pauri Garhwal Taxi","🏔️","350 km","7 hrs","Delhi Routes","Taxi service from Delhi to Pauri Garhwal — home of Lansdowne, Khirsu and scenic Himalayan viewpoints.",null,["Sedan","SUV","Innova"],["All tolls","Experienced driver"],[]),
  svc("delhi-to-pithoragarh-taxi","Delhi To Pithoragarh Taxi","⛰️","480 km","9–10 hrs","Delhi Routes","Long-distance taxi from Delhi to Pithoragarh — 'Little Kashmir' and gateway to Panchachuli.",null,["SUV (Ertiga)","Innova Crysta"],["Long-distance experienced driver","All tolls","Comfort stops"],[]),
  svc("delhi-to-rudraprayag-taxi","Delhi To Rudraprayag Taxi","🏔️","380 km","7–8 hrs","Delhi Routes","Taxi from Delhi to Rudraprayag — the base for Kedarnath pilgrimage and the Alaknanda-Mandakini confluence.",null,["Sedan","SUV","Innova"],["All tolls","Mountain-road driver"],[]),
  svc("delhi-to-tehri-garhwal-taxi","Delhi To Tehri Garhwal Taxi","🏔️","320 km","6–7 hrs","Delhi Routes","Taxi from Delhi to Tehri / New Tehri — stopover for Tehri Dam, Asia's highest dam.",null,["Sedan","SUV","Innova"],["All tolls","AC vehicle"],[]),
  svc("delhi-to-udham-singh-nagar-taxi","Delhi To Udham Singh Nagar Taxi","🚖","270 km","5 hrs","Delhi Routes","Taxi from Delhi to Udham Singh Nagar — covering Rudrapur, Kashipur, Sitarganj and surrounding areas.",null,["Sedan","SUV","Innova","Tempo Traveller"],["All tolls","Any USN drop point"],[]),
  svc("delhi-to-uttarkashi-taxi","Delhi To Uttarkashi Taxi","⛰️","400 km","8–9 hrs","Delhi Routes","Taxi from Delhi to Uttarkashi — base for Gangotri and Yamunotri pilgrimages.",null,["SUV (Ertiga)","Innova Crysta"],["Mountain-road experienced driver","All tolls"],[]),

  // ── Airport Transfers ──
  svc("delhi-airport-to-uttarakhand","Delhi Airport to All Over Uttarakhand","✈️","Varies by destination","5–12 hrs","Airport Transfer","We pick you up directly from Delhi Airport (T1/T2/T3) and drive you safely to any destination across Uttarakhand.","The most common travel pain point for Uttarakhand-bound travellers is the leg from Delhi Airport to their final hill destination. Our Delhi Airport transfers solve this completely — we track your flight and meet you at the arrival gate.",["Sedan (Dzire)","Ertiga (6 seater)","Innova Crysta","Tempo Traveller"],["Flight number tracking — we wait if delayed","Meet & greet at arrival gate","All toll & parking at airport","24/7 availability","Safe night-time driving to hill stations"],["T3 (International) and T2 (Domestic) are most common","Book at least 4 hours before your flight lands"]),
  svc("pantnagar-airport-to-delhi","Pantnagar Airport to Delhi NCR","✈️","270 km","4.5–5 hrs","Airport Transfer","Reliable cab service from Pantnagar Airport (PGH) to Delhi, Noida, Ghaziabad and the entire NCR region.","Pantnagar Airport serves the Kumaon region of Uttarakhand, with flights to Delhi and other cities. We provide seamless airport transfers.",["Sedan","SUV","Innova"],["Airport pickup with name board","Flight tracking","All tolls","Drop to any Delhi NCR location"],["Pantnagar to Noida via Moradabad Expressway is fastest route"]),
  svc("bareilly-airport-cab","Bareilly Airport Cab Service","✈️","~100 km from Haldwani","2 hrs","Airport Transfer","Cab service to/from Bareilly Airport (BEK) — serving Rohilkhand region and connecting to Kumaon.","Bareilly Airport (Civil Aerodrome) serves the Rohilkhand region and is used by travellers from western Kumaon. We provide transfers from Bareilly Airport to Haldwani, Nainital and all Kumaon destinations.",["Sedan","SUV"],["Airport pickup / drop","All tolls"],[]),
  svc("pantnagar-airport-cab","Pantnagar Airport Cab Service","✈️","20 km from Haldwani","30 mins","Airport Transfer","Comprehensive cab services to/from Pantnagar Airport (PGH) — local transfers, onward to hills, or long-distance.","Pantnagar Airport is the main airport serving Kumaon. Whether arriving for a hill station holiday or departing after a pilgrimage, we handle all your airport transfers.",["Sedan","SUV","Innova"],["Airport pickup with name board","Onward to any Kumaon destination","All tolls"],[]),
  svc("airport-taxi","Airport Taxi","✈️","All airports","Varies","Airport Transfer","Professional airport taxi service for all major airports serving Uttarakhand and North India — Delhi, Pantnagar, Jolly Grant (Dehradun), Bareilly.","We specialize in airport taxi services with flight tracking, on-time pickups, and comfortable AC vehicles. Available 24/7 for any flight time.",["Sedan","SUV (Ertiga)","Innova Crysta"],["Flight tracking","Name-board meet & greet","All airport tolls & parking","24/7 service"],[]),

  // ── Haridwar Routes ──
  svc("haridwar-to-kedarnath","Haridwar to Kedarnath","🙏","~250 km to Gaurikund","7–8 hrs","Pilgrimage Route","Direct cab transfer from Haridwar to Gaurikund (base of Kedarnath trek) via Devprayag, Rudraprayag and Sonprayag.","The journey from Haridwar to Gaurikund passes through some of the most scenic stretches of Uttarakhand — the Devprayag confluence, Rudraprayag, and Sonprayag.",["SUV/Innova Crysta (recommended for mountain roads)","Sedan"],["Door-to-door service","Experienced mountain driver","All tolls","Hotel pickup in Haridwar/Rishikesh"],["Start by 4–5 AM to avoid traffic at Sonprayag"]),
  svc("haridwar-to-badrinath","Haridwar To Badrinath","🙏","320 km","8–9 hrs","Pilgrimage Route","Direct transfer from Haridwar to Badrinath via the beautiful Alaknanda river corridor.","The 320 km drive from Haridwar to Badrinath passes through Devprayag, Rudraprayag, Chamoli, Joshimath — one of Uttarakhand's most scenic routes.",["SUV (Ertiga)","Innova Crysta"],["Mountain-road experienced driver","All tolls","Pickup from Haridwar/Rishikesh"],[]),
  svc("haridwar-to-char-dham","Haridwar To Char Dham","🙏","1,000+ km circuit","10–12 Days","Pilgrimage Route","Complete Char Dham Yatra transfer package from Haridwar — covering Yamunotri, Gangotri, Kedarnath and Badrinath with experienced mountain drivers.","Haridwar is the traditional starting point for the Char Dham Yatra. We provide dedicated vehicles and drivers for the entire circuit with expert knowledge of routes, weather and road conditions.",["Innova Crysta (recommended for full circuit)","Tempo Traveller (for groups)"],["Dedicated vehicle for entire yatra","Experienced Char Dham driver","All tolls & permits","Flexible itinerary"],[]),
  svc("haridwar-to-tungnath","Haridwar To Tungnath","⛰️","220 km to Chopta","5–6 hrs","Pilgrimage Route","Transfer from Haridwar to Chopta — the base for the Tungnath Chandrashila trek and the world's highest Shiva temple.","Chopta is the base for the Tungnath temple trek (world's highest Shiva temple at 3,680 m) and Chandrashila summit (4,130 m). The drive from Haridwar via Rudraprayag to Chopta passes through beautiful Garhwal scenery.",["SUV (Ertiga)","Innova Crysta"],["Mountain-road driver","All tolls"],[]),
  svc("tungnath-to-haridwar","Tungnath To Haridwar","⛰️","220 km from Chopta","5–6 hrs","Pilgrimage Route","Return cab service from Chopta (Tungnath base) back to Haridwar or Rishikesh after your trek.",null,["SUV","Innova"],["Pickup from Chopta","All tolls"],[]),

  // ── General & Special Services ──
  svc("cab-service","Cab Service","🚗","All routes","Varies","General Service","Reliable cab and taxi service across Uttarakhand, Delhi NCR and North India. Book for any route, any time, any vehicle.","Sharma Fast Cabs provides comprehensive cab services covering all major routes across Uttarakhand, Delhi NCR, Uttar Pradesh and North India. Whether it's a short city ride or a long-distance mountain journey, we have the right vehicle for you.",["Sedan (Dzire/Etios)","SUV (Ertiga/Innova)","Tempo Traveller","Luxury vehicles on request"],["24/7 booking support","All tolls & taxes","Sanitized vehicles","Professional drivers","GPS-tracked vehicles"],[]),
  svc("local-car-rental","Local Car Rental","🚗","Within city/district","Half/Full day","General Service","Hire a cab for local use within Haldwani, Nainital, Dehradun, Haridwar or any other city. Ideal for shopping, sightseeing and meetings.","Our local car rental service gives you a cab for a fixed number of hours within a city. Perfect for attending events, hospital visits, shopping trips, or local sightseeing without the hassle of booking per trip.",["Sedan (Dzire/Etios)","SUV (Ertiga)","Innova"],["Driver included","Half-day (4 hrs/40 km) and full-day (8 hrs/80 km) options","AC vehicle","Sanitized cab"],[]),
  svc("pantnagar-university-to-delhi","Pantnagar University to Delhi Cab","🎓","260 km","5 hrs","General Service","Cab service for students and staff from G.B. Pant University of Agriculture & Technology, Pantnagar to Delhi and back.","Pantnagar University is one of India's oldest agricultural universities and has a large student population from Delhi and NCR. We provide reliable, affordable cab services for students, faculty and visitors.",["Sedan","SUV","Innova"],["Pickup from university campus / hostels","All tolls","Safe and reliable"],[]),
  svc("all-over-uttarakhand","All over Uttarakhand","🏔️","State-wide","Varies","General Service","Complete cab services across every corner of Uttarakhand — hill stations, pilgrimages, wildlife parks, trekking bases and more.","No matter where you want to go in Uttarakhand, Sharma Fast Cabs has you covered. From the Himalayan borders at Mana and Chitkul to the foothills at Ramnagar and Rishikesh, we operate across the entire state.",["Sedan","SUV (Ertiga)","Innova Crysta","Tempo Traveller"],["Expert local drivers","Knowledge of all routes including remote areas","Mountain road specialists","24/7 support"],[]),
  svc("custom-services","Custom Services","⚙️","Custom","Custom","General Service","Can't find your route? Tell us your pickup and destination and we'll arrange the perfect cab for you — any route, any time.","We understand that travel doesn't always fit standard routes. Our custom cab service caters to any pickup-drop combination across North India. Just share your requirements via WhatsApp and we'll provide a quote.",["Any vehicle as per requirement"],["Personalized route planning","Best vehicle recommendation","Competitive quote","24/7 WhatsApp support"],[]),

  // ── Pilgrimage Tours ──
  svc("ayodhya-temple-tour","Ayodhya Temple Tour","🕌","650 km from Delhi","1–2 Days","Pilgrimage Tour","Visit the newly inaugurated Ram Mandir in Ayodhya — along with Hanuman Garhi, Kanak Bhavan and the Saryu River ghats.","Ayodhya — the birthplace of Lord Ram — has become the most visited pilgrimage city in India following the consecration of the Ram Mandir in January 2024. The city's transformation is remarkable — beautiful ghats, illuminated temples and a spiritually charged atmosphere.",["Sedan","Innova Crysta"],["Round-trip AC cab","VIP darshan assistance","1 night hotel (optional)","Local guide for temple circuit","All tolls & parking"],["Arrive early morning (5–6 AM) for shorter darshan queues at Ram Mandir","Ayodhya is best visited on weekdays to avoid crowds"]),
  svc("prayagraj-yatra-tour","Prayagraj Yatra Tour","🕌","650 km from Haldwani","1–2 Days","Pilgrimage Tour","Visit Prayagraj — the Sangam city — for the sacred confluence of Ganga, Yamuna and the mystical Saraswati. Triveni Sangam, Akbar Fort, Anand Bhawan and more.","Prayagraj (formerly Allahabad) is one of the holiest cities in Hinduism and home to the Maha Kumbh Mela — the world's largest religious gathering. The Triveni Sangam (confluence of three rivers) is considered among the most sacred spots in India.",["Sedan","Innova Crysta"],["Round-trip cab","All tolls","Local guide"],["Kumbh Mela (every 12 years) and Ardh Kumbh (every 6 years) require advance booking"]),
  svc("kashi-ayodhya-prayagraj","Kashi – Ayodhya – Prayagraj Tour","🕌","~800 km circuit from Haldwani","3–4 Days","Pilgrimage Tour","The ultimate Uttar Pradesh pilgrimage circuit — Kashi (Varanasi), Ayodhya (Ram Mandir) and Prayagraj (Triveni Sangam) in one comprehensive tour.","Three of India's holiest cities in one journey: Varanasi with its ancient ghats and Kashi Vishwanath temple, Ayodhya with the new Ram Mandir, and Prayagraj with the Triveni Sangam. We handle all transfers and accommodation arrangements.",["Innova Crysta","Tempo Traveller (groups)"],["All intercity transfers","Comfortable hotels","Local guides at each destination","All tolls"],[]),
  svc("mathura-vrindavan-agra","Mathura – Vrindavan – Agra Tour","🕌","220–280 km from Delhi","1–2 Days","Pilgrimage Tour","The divine Braj circuit — birthplace of Lord Krishna (Mathura), his childhood home (Vrindavan) and the Taj Mahal (Agra) in one journey.","Mathura is the birthplace of Lord Krishna and one of Hinduism's seven sacred cities. Vrindavan, 15 km away, is where Krishna spent his childhood. Agra's Taj Mahal makes this the perfect combination tour.",["Sedan","SUV","Innova"],["Round-trip or one-way cab","All tolls","Drop-only or guided options"],["Holi in Mathura-Vrindavan is spectacular — book well in advance","Taj Mahal is closed on Fridays"]),
  svc("jageshwar-temple-tour","Jageshwar Temple Tour","🛕","35 km from Almora","1 Day","Pilgrimage Tour","Visit the ancient Jageshwar Dham — a cluster of 124 stone temples in a sacred deodar cedar forest. One of Uttarakhand's most mystical pilgrimage sites.","Jageshwar is an extraordinary complex of 124 stone temples dedicated to Lord Shiva, set in a dense deodar forest at 1,870 metres. It is considered one of the 12 Jyotirlinga shrines by some traditions.",["Sedan","SUV"],["Pickup from Haldwani / Nainital / Almora","All tolls","Round trip"],[]),
  svc("kainchi-dham-temple-tour","Kainchi Dham Temple Tour","🛕","17 km from Nainital","Half Day","Pilgrimage Tour","Visit Kainchi Dham — the ashram of Neem Karoli Baba, revered by icons like Steve Jobs, Mark Zuckerberg and Julia Roberts.","Kainchi Dham is the ashram established by the revered saint Neem Karoli Baba (Maharaj-ji). It has been visited by Steve Jobs, Mark Zuckerberg, Julia Roberts and many others seeking spiritual guidance. The ashram is open to all visitors.",["Sedan","SUV"],["Pickup from Nainital / Haldwani","All tolls"],["The annual Bhandara (feast) on 15 June attracts thousands of devotees"]),
  svc("char-dham-yatra-service","Char Dham Yatra","🙏","1,000+ km circuit","10–12 Days","Pilgrimage Tour","Complete Char Dham Yatra — Yamunotri, Gangotri, Kedarnath and Badrinath — with expert guide, comfortable stays and all transfers.",null,["SUV (Innova Crysta) for mountain terrain"],["All transfers","Religious guide","Mule arrangements","Hotels","All meals"],[]),
  svc("kedarnath-service","Kedarnath","⛰️","440 km from Haridwar","5 Days","Pilgrimage Tour","Sacred Kedarnath pilgrimage with cab, guide and mule arrangements. One of the 12 Jyotirlingas of Lord Shiva.",null,["SUV / Innova for mountain roads"],["Cab to Gaurikund","Mule arrangement","Hotel stays","Expert guide"],[]),

  // ── Heritage / Cultural Tours ──
  svc("agra-tour","Agra Tour","🏛️","200 km from Delhi","1 Day","Heritage Tour","Day trip to Agra covering the Taj Mahal, Agra Fort and Mehtab Bagh — UNESCO World Heritage Sites.","The Taj Mahal is one of the world's most visited monuments. Our Agra day trip takes you from Delhi to see the Taj Mahal at sunrise, Agra Fort and the Mehtab Bagh garden.",["Sedan","SUV"],["AC cab round trip","All tolls on Yamuna Expressway","Driver-guide","Flexible timing"],["Start at 5 AM from Delhi to catch Taj Mahal sunrise","Taj Mahal is closed on Fridays"]),
  svc("ranikhet-tour","Ranikhet Tour","🏔️","80 km from Haldwani","1–2 Days","Heritage Tour","Visit Ranikhet — the beautiful British-era cantonment town — known for its golf course, apple orchards and stunning Himalayan views.","Ranikhet is a charming cantonment town with well-preserved colonial buildings, a world-class golf course and unobstructed views of the Trishul and Nanda Devi peaks.",["Sedan","SUV"],["Pickup from Haldwani / Nainital","All tolls"],[]),
  svc("jim-corbett-tour-service","Jim Corbett Tour","🐅","250 km from Delhi","2 Days","Wildlife Tour","Complete Jim Corbett wildlife safari package — jeep safari, naturalist guide, jungle resort stay and comfortable cab transfers.","Jim Corbett National Park is India's most famous wildlife destination. We offer end-to-end packages covering pickup, resort stay, safari permits in core zones, certified naturalist guide and return drop.",["Dedicated cab for group","Jeep safari on-site"],["Cab transfers","Safari permits","Naturalist guide","Resort stay","All meals"],["Book 2–4 weeks in advance for Dhikala zone","Best chances for tiger sightings in February–April"]),

  // ── Destination-based Services ──
  svc("haridwar-dest","Haridwar","🛕","214 km from Delhi","Half / Full Day","Destination","Cab service to and around Haridwar — the sacred gateway city on the Ganges.","Complete cab services in and around Haridwar for temple visits, ghat tours, and transfers.",["Sedan","SUV","Innova"],["All temple drop-offs","Ghat pickups","24/7 service"],[]),
  svc("rishikesh-dest","Rishikesh","🧘","240 km from Delhi","Varies","Destination","Cab service to Rishikesh — the yoga capital of the world and adventure hub on the Ganges.",null,["Sedan","SUV"],["Door-to-door service","All tolls"],[]),
  svc("dehradun-dest","Dehradun","🏙️","290 km from Delhi","5–6 hrs","Destination","Cab service to Dehradun — the capital of Uttarakhand and gateway to Mussoorie.",null,["Sedan","SUV","Innova"],["All tolls","24/7 service"],[]),
  svc("mussoorie-dest","Mussoorie","🏔️","35 km from Dehradun","1 hr from Dehradun","Destination","Cab service to Mussoorie — the Queen of Hills. Direct transfers from Delhi, Dehradun, Haridwar and Haldwani.",null,["Sedan","SUV"],["All tolls","Hill road expert driver"],[]),
  svc("nainital-dest","Nainital","🏔️","65 km from Haldwani","1.5 hrs from Haldwani","Destination","Cab service to Nainital — the Lake City of Kumaon. Transfers from Delhi, Haldwani and Pantnagar Airport.",null,["Sedan","SUV","Innova"],["All tolls","Ghat road expert"],[]),
  svc("almora-dest","Almora","🏔️","35 km from Kathgodam","1 hr from Kathgodam","Destination","Cab service to Almora — the cultural capital of Kumaon.",null,["Sedan","SUV"],["All tolls"],[]),
  svc("ranikhet-dest","Ranikhet","🏔️","80 km from Haldwani","2 hrs from Haldwani","Destination","Cab service to Ranikhet — the beautiful army cantonment with Himalayan views.",null,["Sedan","SUV"],["All tolls"],[]),
  svc("jim-corbett-dest","Jim Corbett","🐅","250 km from Delhi","5 hrs from Delhi","Destination","Cab service to Jim Corbett National Park — India's oldest tiger reserve.",null,["Sedan","SUV","Innova"],["Hotel/resort pickup","All tolls","Safari arrangement"],[]),
  svc("kedarnath-dest","Kedarnath","⛰️","440 km from Haridwar","Full day","Destination","Transfers to Kedarnath (Gaurikund base) for the sacred Jyotirlinga pilgrimage.",null,["SUV","Innova Crysta"],["Mountain-road driver","All tolls"],[]),
  svc("badrinath-dest","Badrinath","⛰️","297 km from Rishikesh","8–9 hrs","Destination","Transfers to Badrinath — the northernmost Dham and abode of Lord Vishnu.",null,["SUV","Innova Crysta"],["Mountain-road driver","All tolls"],[]),
  svc("roorkee-dest","Roorkee","🏛️","180 km from Delhi","3.5 hrs","Destination","Cab service to Roorkee — home of IIT Roorkee and midway stop to Haridwar.",null,["Sedan","SUV"],["All tolls"],[]),

  // ── Delhi Cab Services ──
  svc("delhi-cabs-services","Delhi Cabs Services","🚖","Delhi & NCR","Varies","Delhi Routes","All cab services within Delhi and Delhi NCR — airport transfers, inter-city, outstation and local rides.",null,["Sedan","SUV","Innova","Tempo Traveller"],["Pickup from any Delhi location","24/7 service","All Delhi NCR covered"],[]),

  // ── Outstation Destinations ──
  svc("agra-dest","Agra","🏛️","200 km from Delhi","4 hrs","Outstation","Cab service to Agra — home of the Taj Mahal, Agra Fort and Fatehpur Sikri.",null,["Sedan","SUV"],["All Yamuna Expressway tolls","Round trip or one-way"],[]),
  svc("ajmer-dest","Ajmer","🕌","420 km from Delhi","7–8 hrs","Outstation","Cab service to Ajmer — the city of the Dargah Sharif of Khwaja Moinuddin Chishti.",null,["Sedan","SUV","Innova"],["All tolls","Long-distance experienced driver"],[]),
  svc("ayodhya-dest","Ayodhya","🕌","650 km from Delhi","10–11 hrs","Outstation","Cab service to Ayodhya — birthplace of Lord Ram and home of the new Ram Mandir.",null,["Sedan","Innova Crysta"],["All tolls","Expert driver"],[]),
  svc("banaras-dest","Banaras","🕌","800 km from Haldwani","12–14 hrs","Outstation","Cab service to Varanasi (Banaras / Kashi) — the oldest living city in the world and Shiva's city on the Ganges.",null,["Sedan","Innova Crysta"],["Long-distance experienced driver","All tolls","Overnight journey option"],[]),
  svc("gaya-dest","Gaya","🕌","970 km from Delhi","16 hrs","Outstation","Cab service to Gaya — the sacred site for Pind Daan and Bodh Gaya (Buddha's enlightenment spot).",null,["Innova Crysta"],["Experienced long-distance driver","Comfort stops","All tolls"],[]),
  svc("jaipur-dest","Jaipur","🏰","280 km from Delhi","5–6 hrs","Outstation","Cab service to Jaipur — the Pink City and capital of Rajasthan.",null,["Sedan","SUV","Innova"],["All Rajasthan expressway tolls","Expert driver"],[]),
  svc("jaisalmer-dest","Jaisalmer","🏜️","800 km from Delhi","13–15 hrs","Outstation","Cab service to Jaisalmer — the Golden City in the heart of the Thar Desert.",null,["Innova Crysta","Tempo Traveller"],["Long-distance experienced driver","All tolls"],[]),
  svc("jodhpur-dest","Jodhpur","🏰","610 km from Delhi","10–11 hrs","Outstation","Cab service to Jodhpur — the Blue City of Rajasthan, home of the majestic Mehrangarh Fort.",null,["Sedan","SUV","Innova"],["All tolls","Expert driver"],[]),
  svc("lucknow-dest","Lucknow","🏛️","500 km from Haldwani","8–9 hrs","Outstation","Cab service to Lucknow — the City of Nawabs and capital of Uttar Pradesh.",null,["Sedan","SUV","Innova"],["All tolls","AC vehicle"],[]),
  svc("mathura-dest","Mathura","🛕","240 km from Delhi","4.5 hrs","Outstation","Cab service to Mathura — the birthplace of Lord Krishna and one of the seven sacred cities.",null,["Sedan","SUV"],["All tolls","Round trip available"],[]),
  svc("patna-dest","Patna","🏛️","1,000 km from Delhi","16–18 hrs","Outstation","Cab service to Patna — the capital of Bihar and a major hub for Buddhist and Sikh pilgrimage.",null,["Innova Crysta"],["Long-distance experienced driver","Comfort stops","All tolls"],[]),
  svc("vrindavan-dest","Vrindavan","🛕","155 km from Delhi","3 hrs","Outstation","Cab service to Vrindavan — the sacred town where Lord Krishna spent his childhood.",null,["Sedan","SUV"],["All tolls","Round trip available"],[]),
];

const destinationsData = {
  "Hill Station": [
    { slug: "mussoorie", name: "Mussoorie", tag: "Hill Station", img: "/images/mussoorie.jpg", tagline: "The Queen of Hills", desc: "The most popular hill station in North India — colonial charm, Mall Road, Kempty Falls and endless Himalayan views at 2,005 metres.", distance: "35 km from Dehradun", altitude: "2,005 m", best: "March–June, Sept–Nov", stay: "2–3 nights", highlights: ["Mall Road — 2 km promenade with shops & cafes", "Kempty Falls — magnificent 40-ft cascade", "Lal Tibba — highest point (2,275 m), Himalayan panorama", "Camel's Back Road — sunrise walk", "Mussoorie Lake — serene pedal boats", "Cable Car to Gun Hill"], getting_there: "Dehradun is the nearest railhead (35 km, 1 hr). Delhi to Mussoorie is 290 km (6–7 hrs). We offer direct cab service from Delhi, Haridwar, Haldwani.", places: [{name:"Mall Road",desc:"The heart of Mussoorie — a 2 km promenade with restaurants, shops, and stunning valley views."},{name:"Kempty Falls",desc:"A 40-foot waterfall 15 km from Mussoorie town, perfect for a refreshing dip."},{name:"Lal Tibba",desc:"The highest peak in Mussoorie at 2,275 m, with telescope views of Bandarpunch and other Himalayan peaks."},{name:"Company Garden",desc:"A beautifully landscaped garden with flower beds, a small lake and rides for kids."}], nearBy: ["Dhanaulti (25 km)", "Surkanda Devi temple (30 km)", "Tehri Dam (70 km)", "Rishikesh (75 km)"], tips: ["Avoid visiting during monsoon (July–Sept) as roads can be waterlogged", "The ropeway to Gun Hill gives the best panoramic view of the Himalayas"] },
    { slug: "nainital", name: "Nainital", tag: "Hill Station", img: "/images/nainital.jpg", tagline: "The Lake City of Kumaon", desc: "Built around the sparkling Naini Lake with iconic colonial architecture, cable cars, boating and a buzzing Mall Road.", distance: "65 km from Haldwani", altitude: "2,084 m", best: "March–June, Oct–Nov", stay: "3–4 nights", highlights: ["Naini Lake boating (rowing & motorboats)", "Snow View Point cable car (2,270 m)", "Naina Devi Temple", "Tiffin Top (Dorothy's Seat) trek", "Nainital Zoo (snow leopard, yak)", "The Mall Road"], getting_there: "Kathgodam is the nearest railhead (35 km). Delhi to Nainital is 290 km (6–7 hrs). We offer direct service from Delhi, Haldwani, Pantnagar Airport.", places: [{name:"Naini Lake",desc:"The emerald lake at the centre of town — boating is a must-do, especially at sunset."},{name:"Snow View Point",desc:"Reached by cable car, this viewpoint at 2,270 m offers views of snow-covered Himalayan peaks including Nanda Devi."},{name:"Nainital Zoo",desc:"One of India's most beautiful zoos at high altitude, home to Snow Leopard, Tibetan Wolf and Himalayan Bear."},{name:"Tiffin Top",desc:"A 4 km trek to a hilltop meadow with spectacular 360° views."}], nearBy: ["Bhimtal (22 km)", "Sattal (22 km)", "Mukteshwar (50 km)", "Ranikhet (60 km)"], tips: ["Visit in October–November for clear skies and best mountain views", "Weekends and summer vacations get very crowded — try weekdays"] },
    { slug: "almora", name: "Almora", tag: "Hill Station", img: "/images/almora.jpg", tagline: "The Cultural Heart of Kumaon", desc: "A historic hilltown on a horseshoe ridge that has inspired spiritual seekers from Vivekananda to Steve Jobs.", distance: "35 km from Kathgodam", altitude: "1,638 m", best: "April–June, Sept–Oct", stay: "2–3 nights", highlights: ["Kasar Devi Temple — cosmic energy zone", "Bright End Corner sunrise viewpoint", "Nanda Devi Temple in old bazaar", "Chitai Golu Devta Temple", "Gobind Ballabh Pant Museum", "Famous Bal Mithai & Singodi sweets"], getting_there: "Kathgodam railhead is 35 km away. Delhi to Almora is 360 km (7–8 hrs). We offer service from Delhi, Haldwani, Pantnagar Airport.", places: [{name:"Kasar Devi",desc:"A hilltop temple that sits in one of Earth's Van Allen Belt cosmic energy zones."},{name:"Bright End Corner",desc:"The most spectacular sunrise viewpoint in Kumaon, with a 180° Himalayan panorama including Nanda Devi."},{name:"Chitai Golu Devta",desc:"Temple of the local deity of justice where devotees tie bells and write letters."},{name:"Binsar Sanctuary",desc:"30 km from Almora — an oak forest reserve with the finest views of the Himalayas."}], nearBy: ["Ranikhet (50 km)", "Binsar (30 km)", "Jageshwar (35 km)", "Kausani (55 km)"], tips: ["Stay for at least 2 nights to absorb the relaxed atmosphere", "Almora's local market sells excellent Kumaoni handicrafts and carved wooden items"] },
  ],
  "Spiritual": [
    { slug: "haridwar", name: "Haridwar", tag: "Spiritual", img: "/images/haridwar.jpg", tagline: "Gateway to the Gods", desc: "Where the Ganges leaves the mountains and enters the plains. One of Hinduism's seven sacred cities — famous for the soul-stirring Ganga Aarti at Har Ki Pauri.", distance: "214 km from Delhi", altitude: "314 m", best: "Oct–Mar (Kumbh Mela every 12 yrs)", stay: "1–2 nights", highlights: ["Ganga Aarti at Har Ki Pauri (dusk & dawn)", "Mansa Devi Temple via cable car", "Chandi Devi Temple", "Brahmakund — holy dip", "Shantikunj Ashram", "Sapt Rishi Ashram"], getting_there: "Haridwar has its own railway station. Delhi to Haridwar by cab is 220 km, 4–5 hrs.", places: [{name:"Har Ki Pauri",desc:"The holiest ghat in Haridwar where the Ganga Aarti takes place every evening."},{name:"Mansa Devi Temple",desc:"Perched on Bilwa Parvat, reached by cable car."},{name:"Chandi Devi Temple",desc:"A Shakti Peetha temple on Neel Parvat, reached by cable car or a 3 km trek."},{name:"Daksha Mahadev Temple",desc:"One of the oldest temples in Haridwar."}], nearBy: ["Rishikesh (24 km)", "Rajaji Tiger Reserve (15 km)", "Dehradun (55 km)", "Roorkee (40 km)"], tips: ["Visit for Kumbh Mela or Ardh Kumbh for the most spectacular experience", "The Ganga Aarti is at approximately 6:30 PM in summer and 5:30 PM in winter"] },
    { slug: "rishikesh", name: "Rishikesh", tag: "Spiritual", img: "/images/rishikesh.jpg", tagline: "Yoga Capital of the World", desc: "Ashrams, yoga centres, white-water rafting and the iconic suspension bridges across the Ganges.", distance: "240 km from Delhi", altitude: "356 m", best: "Oct–Mar", stay: "2–3 nights", highlights: ["Laxman Jhula & Ram Jhula suspension bridges", "Triveni Ghat Ganga Aarti", "White-water rafting (Sept–June)", "Beatles Ashram (Maharishi Mahesh Yogi)", "Yoga & meditation centres", "Bungee jumping (83 m)"], getting_there: "Haridwar (24 km) is the nearest major railhead. Delhi to Rishikesh by cab is 240 km (5 hrs).", places: [{name:"Laxman Jhula",desc:"An iconic 450-ft long suspension bridge over the Ganges."},{name:"Beatles Ashram",desc:"The Maharishi Mahesh Yogi's ashram where the Beatles stayed in 1968."},{name:"Triveni Ghat",desc:"The main bathing ghat where the Ganga Aarti takes place every evening."},{name:"Camping Sites",desc:"Several riverside camping sites offer a night under the stars."}], nearBy: ["Haridwar (24 km)", "Neelkanth Mahadev (35 km)", "Devprayag (70 km)", "Tehri Dam (75 km)"], tips: ["Yoga retreats should be booked well in advance", "Stay on the Laxman Jhula side for a more serene experience"] },
    { slug: "kedarnath-dest", name: "Kedarnath", tag: "Spiritual", img: "/images/chardham.jpg", tagline: "Lord Shiva's Himalayan Abode", desc: "One of the 12 Jyotirlingas — a sacred Shiva temple at 3,583 metres, accessible only by a 14 km trek.", distance: "220 km from Rishikesh to Gaurikund", altitude: "3,583 m", best: "May–June, Sept–Oct", stay: "4–5 nights (including travel)", highlights: ["Kedarnath temple darshan", "14 km Mandakini valley trek", "Gaurikund hot springs", "Bhairavnath Temple", "Vasuki Tal alpine lake"], getting_there: "Haridwar is the base for most pilgrims. The route goes Haridwar–Devprayag–Rudraprayag–Guptkashi–Gaurikund (250 km). The final 14 km is on foot, mule or helicopter.", places: [{name:"Kedarnath Temple",desc:"Built by the Pandavas and restored by Adi Shankaracharya in the 8th century."},{name:"Bhairavnath Temple",desc:"Located on the hill behind Kedarnath, the protector of the main shrine."},{name:"Vasuki Tal",desc:"A high-altitude glacial lake at 4,135 m, 8 km from Kedarnath."},{name:"Gaurikund",desc:"The roadhead for the trek with hot springs (Tapt Kund)."}], nearBy: ["Triyuginarayan Temple (12 km)", "Guptkashi (30 km)", "Badrinath (230 km via road)"], tips: ["Physical fitness is important — train 2–4 weeks before the trek", "Carry warm clothes even in May–June"] },
    { slug: "badrinath-dest", name: "Badrinath", tag: "Spiritual", img: "/images/badrinath.jpg", tagline: "Abode of Lord Vishnu", desc: "The northernmost of the four Dhams — Lord Vishnu's shrine on the Alaknanda river.", distance: "297 km from Rishikesh", altitude: "3,133 m", best: "May–June, Sept–Oct", stay: "4–5 nights (including travel)", highlights: ["Badrinath Temple darshan", "Mana Village — last Indian village", "Vasudhara Falls (145 m)", "Brahma Kapal for ancestral rites", "Tapt Kund hot springs"], getting_there: "Haridwar → Devprayag → Rudraprayag → Chamoli → Joshimath → Badrinath. The drive is 320 km (8–9 hrs).", places: [{name:"Badrinath Temple",desc:"An ancient Vishnu temple rebuilt by Adi Shankaracharya."},{name:"Mana Village",desc:"The last Indian village before the Tibet border, 3 km from Badrinath."},{name:"Vasudhara Falls",desc:"A spectacular 145-metre waterfall 5 km from Mana Village."},{name:"Tapt Kund",desc:"A natural hot spring near the temple where devotees bathe before darshan."}], nearBy: ["Mana Village (3 km)", "Hemkund Sahib (35 km)", "Valley of Flowers (35 km)", "Auli (16 km from Joshimath)"], tips: ["Register online on the Char Dham registration portal before visiting", "Temple opens at 4 AM for Brahma Muhurta darshan"] },
  ],
  "Adventure": [
    { slug: "auli", name: "Auli", tag: "Adventure", img: "/images/auli.jpg", tagline: "India's Premier Ski Resort", desc: "Pristine ski slopes, Asia's longest gondola ropeway and a jaw-dropping panorama of Nanda Devi.", distance: "340 km from Haridwar", altitude: "2,519 m", best: "Dec–Mar (skiing), May–Jun, Sept–Nov (trekking)", stay: "3–4 nights", highlights: ["Skiing & snowboarding", "Asia's longest ropeway — 4.15 km gondola", "Nanda Devi (7,817 m) panorama", "Gurso Bugyal alpine meadow trek", "Artificial lake (2nd highest in the world)"], getting_there: "Haridwar → Devprayag → Rudraprayag → Joshimath (340 km, 8–9 hrs). Ropeway from Joshimath to Auli.", places: [{name:"Auli Gondola",desc:"Asia's longest gondola ropeway, 4.15 km from Joshimath to Auli."},{name:"Ski Slopes",desc:"Auli has 500 metres of slopes ranging from gentle nursery runs to challenging advanced trails."},{name:"Gurso Bugyal",desc:"A stunning alpine meadow at 3,056 m, a 3 km trek from Auli."},{name:"Joshimath",desc:"The winter seat of Badrinath and strategic base for Auli."}], nearBy: ["Valley of Flowers (35 km trek)", "Hemkund Sahib (40 km trek)", "Badrinath (60 km)"], tips: ["Book ski equipment and instructors in advance during peak season (Jan–Feb)", "Joshimath has more hotel options than Auli"] },
    { slug: "rishikesh-adv", name: "Rishikesh", tag: "Adventure", img: "/images/rishikesh.jpg", tagline: "Adventure Capital of India", desc: "India's undisputed adventure capital — white-water rafting, bungee jumping, cliff jumping, zip-lining and overnight riverside camping.", distance: "240 km from Delhi", altitude: "356 m", best: "Sept–June", stay: "2–3 nights", highlights: ["Grade III–IV white-water rafting (16 km)", "Bungee jumping (83 m — one of Asia's highest)", "Cliff jumping & body surfing", "Zip-lining over the Ganges", "Camping on the Ganges banks"], getting_there: "Haridwar (24 km) is nearest railhead. Delhi by cab is 240 km (5 hrs).", places: [{name:"Rafting Stretch",desc:"The most popular stretch is Shivpuri to Rishikesh (16 km) with Grade III–IV rapids."},{name:"Bungee Point",desc:"At Mohanchatti, 26 km from Rishikesh, the 83-metre fixed platform bungee."},{name:"Camping Sites",desc:"Dozens of riverside camps along the Ganges."},{name:"Zip-line",desc:"A 500-metre zip line over the Ganges."}], nearBy: ["Haridwar (24 km)", "Neelkanth Mahadev (35 km)", "Rajaji Tiger Reserve (15 km)"], tips: ["Best rafting: October to June", "Camping is best in October–November for cool weather and clear skies"] },
  ],
  "Wildlife": [
    { slug: "jim-corbett-dest", name: "Jim Corbett National Park", tag: "Wildlife", img: "/images/jimcorbett.jpg", tagline: "India's Original Tiger Reserve", desc: "India's oldest national park (est. 1936) — 520 sq km of pristine sal forests, riversides and grasslands, home to 215+ tigers.", distance: "250 km from Delhi", altitude: "385–1,100 m", best: "Nov–June (park closed July–Oct)", stay: "2–3 nights", highlights: ["Bengal Tiger spotting (highest density in India)", "Asian elephant herds", "Leopard, sloth bear, king cobra", "600+ bird species", "Jim Corbett Museum & author's cottage"], getting_there: "Ramnagar is the nearest railhead (12 km). Delhi to Ramnagar is 250 km (5 hrs).", places: [{name:"Dhikala Zone",desc:"The most famous zone — deep inside the core area. Highest tiger density."},{name:"Bijrani Zone",desc:"Most popular day zone with frequent tiger sightings."},{name:"Jhirna Zone",desc:"Open year-round. Best for sloth bear and leopard sightings."},{name:"Corbett Museum",desc:"Jim Corbett's restored bungalow in Kaladhungi village."}], nearBy: ["Ramnagar (12 km)", "Nainital (55 km)", "Kaladhungi (15 km)", "Almora (100 km)"], tips: ["Book safaris weeks in advance during peak season (Feb–May)", "Carry binoculars — Corbett is a world-class birding destination"] },
  ],
  "Nature & Trekking": [
    { slug: "chopta", name: "Chopta", tag: "Nature & Trekking", img: "/images/chopta.jpg", tagline: "Mini Switzerland of Uttarakhand", desc: "A stunning, largely undiscovered meadow at 2,680 m serving as the base for the Tungnath–Chandrashila trek.", distance: "90 km from Rudraprayag", altitude: "2,680 m", best: "May–June, Sept–Nov", stay: "2–3 nights", highlights: ["Tungnath Temple trek (3 km, 3,680 m)", "Chandrashila summit (4,130 m)", "Deoria Tal — mirror lake reflecting Chaukhamba peaks", "Rhododendron forests (bloom March–April)", "Stargazing from Chopta meadow"], getting_there: "Ukhimath/Rudraprayag are nearest towns. Delhi to Chopta via Haridwar is 440 km (9–10 hrs).", places: [{name:"Tungnath Temple",desc:"The world's highest Shiva temple at 3,680 m."},{name:"Chandrashila Peak",desc:"1 km above Tungnath, the summit at 4,130 m gives a 360° panorama."},{name:"Deoria Tal",desc:"A crystal-clear lake at 2,438 m, 3 km trek from Sari village."},{name:"Chopta Meadow",desc:"A gentle alpine meadow perfect for camping."}], nearBy: ["Ukhimath (15 km)", "Rudraprayag (50 km)", "Kedarnath (80 km via road)"], tips: ["Chopta is best for experienced trekkers", "Carry warm clothes even in summer"] },
  ],
};

const allDestinations = Object.values(destinationsData).flat();

const faqData = [
  { q: "How do I book a cab with Sharma Fast Cabs?", a: "Click 'Book Now' or fill in the enquiry form and we'll respond on WhatsApp within minutes. You can also call or WhatsApp us directly at 8979331110 — we're available 24/7." },
  { q: "Do you offer one-way cab services from Haldwani to Delhi?", a: "Yes! We offer both one-way and round-trip cab services. Our experienced drivers cover this route daily." },
  { q: "What vehicles are available in your fleet?", a: "We offer a range of AC vehicles including Sedans (Dzire, Etios), SUVs (Innova Crysta, Ertiga), and Tempo Travellers for larger groups. All vehicles are well-maintained and hygienically clean." },
  { q: "Do you provide airport pickup from Delhi Airport to Uttarakhand?", a: "Absolutely. We specialize in Delhi Airport (T1/T2/T3) to all destinations across Uttarakhand. We track your flight so we're always there on time, even for late arrivals." },
  { q: "Can you arrange Char Dham Yatra packages?", a: "Yes, we offer comprehensive Char Dham Yatra packages from Haridwar covering Yamunotri, Gangotri, Kedarnath and Badrinath. Packages include cab transfers, hotel stays, meals and a religious guide." },
  { q: "How is the fare calculated?", a: "Fare depends on the vehicle type, distance, number of passengers, travel date and whether it's one-way or round trip. Contact us on WhatsApp or call with your details for an exact quote." },
  { q: "Is it safe to travel in high-altitude areas like Kedarnath?", a: "Safety is our top priority. Our drivers are experienced in high-altitude mountain driving and our vehicles are serviced for challenging terrain." },
  { q: "What is your cancellation policy?", a: "We have a flexible cancellation policy. Please contact us at least 24 hours before your scheduled trip for a full refund." },
];

/* ─── HOOKS ─── */
const useEnquire = () => {
  const navigate = useNavigate();
  return useCallback((service = "") =>
    navigate(`/contact${service ? `?service=${encodeURIComponent(service)}` : ""}`), [navigate]);
};

/* ─── FLOATING BUTTONS ─── */
const FloatingButtons = () => (
  <div className="float-btns">
    <a href="https://wa.me/918979331110?text=Hello%20Sharma%20Fast%20Cabs%2C%20I%20want%20to%20enquire%20about%20a%20cab%20booking." target="_blank" rel="noreferrer" className="float-wa" title="WhatsApp Us">💬</a>
    <a href="tel:+918979331110" className="float-call" title="Call Us">📞</a>
  </div>
);

/* ─── BREADCRUMB ─── */
const Breadcrumb = ({ items }) => (
  <nav className="bc" aria-label="Breadcrumb">
    {items.map((item, i) => (
      <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        {i > 0 && <span>›</span>}
        {i < items.length - 1
          ? <Link to={item.href}>{item.label}</Link>
          : <span aria-current="page">{item.label}</span>}
      </span>
    ))}
  </nav>
);

/* ─── FAQ ─── */
const FAQ = ({ items, dark }) => {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      {items.map((item, i) => (
        <div className="faq-item" key={i} style={{ borderBottomColor: dark ? "rgba(255,255,255,0.1)" : undefined }}>
          <button className="faq-q" onClick={() => setOpen(open === i ? null : i)} style={{ color: dark ? "var(--white)" : undefined }}>
            {item.q}
            <span className={`faq-chev${open === i ? " open" : ""}`}>▼</span>
          </button>
          {open === i && <div className="faq-a" style={{ color: dark ? "rgba(255,255,255,0.65)" : undefined }}>{item.a}</div>}
        </div>
      ))}
    </div>
  );
};

/* ─── NAV ─── */
const Nav = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav-wrap">
      <div className="nav-top">
        <a href="tel:+918979331110">📞 8979331110</a>
        <a href="mailto:sharmafastcabs@gmail.com">✉️ sharmafastcabs@gmail.com</a>
        <a href="https://wa.me/918979331110" target="_blank" rel="noreferrer" className="nav-wa">💬 WhatsApp</a>
      </div>
      <div className="nav-main">
        <Link to="/" className="nav-logo"><img src="/favicon.png" alt="Sharma Fast Cabs" className="site-logo"/>Sharma <span>Fast Cabs</span></Link>
        <div className="nav-links">
          <Link to="/" className="nl">Home</Link>
          <Link to="/packages" className="nl">Packages</Link>
          <Link to="/services" className="nl">Services</Link>
          <Link to="/destinations" className="nl">Destinations</Link>
          <Link to="/about" className="nl">About</Link>
          <a href="tel:+918979331110" className="nl nl-phone">📞 8979331110</a>
          <Link to="/contact" className="nl nl-cta">Book Now</Link>
        </div>
        <button className="ham" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
      <div className={`mob-menu${open ? " open" : ""}`}>
        {[["🏠 Home", "/"], ["🗺️ Packages", "/packages"], ["🚖 Services", "/services"], ["🌍 Destinations", "/destinations"], ["ℹ️ About", "/about"]].map(([l, to]) => (
          <Link key={to} to={to} className="mob-link" onClick={() => setOpen(false)}>{l}</Link>
        ))}
        <a href="tel:+918979331110" className="mob-link" style={{ color: "var(--gold)", border: "1px solid rgba(245,166,35,0.3)", textAlign: "center", borderRadius: 8 }}>📞 8979331110</a>
        <Link to="/contact" className="mob-link mob-cta" onClick={() => setOpen(false)}>Book Now →</Link>
      </div>
    </nav>
  );
};

/* ─── FOOTER ─── */
const Footer = () => (
  <footer className="footer">
    <div className="footer-main">
      <div>
        <Link to="/" className="f-logo"><img src="/favicon.png" alt="Sharma Fast Cabs" className="site-logo"/>Sharma <span>Fast Cabs</span></Link>
        <p className="f-desc">Uttarakhand's most trusted cab and travel partner since 2009. Mountains, temples, wildlife — we get you there safely.</p>
        <a href="tel:+918979331110" className="f-contact">📞 8979331110</a>
        <a href="https://wa.me/918979331110" className="f-contact" target="_blank" rel="noreferrer">💬 WhatsApp: 8979331110</a>
        <a href="mailto:sharmafastcabs@gmail.com" className="f-contact">✉️ sharmafastcabs@gmail.com</a>
        <span className="f-contact">📍 Rudrapur, Uttarakhand, India</span>
        <span className="f-contact">🕐 Available 24 Hours · 7 Days a Week</span>
      </div>
      <div className="f-col">
        <h4>Quick Links</h4>
        <ul className="f-links">
          {[["Home", "/"], ["Packages", "/packages"], ["Services", "/services"], ["Destinations", "/destinations"], ["About", "/about"], ["Contact", "/contact"]].map(([l, to]) => <li key={to}><Link to={to}>{l}</Link></li>)}
        </ul>
      </div>
      <div className="f-col">
        <h4>Popular Routes</h4>
        <ul className="f-links">
          {[["Haldwani → Delhi", "/services/haldwani-to-delhi"], ["Delhi → Nainital", "/services/delhi-to-nainital"], ["Delhi → Haridwar", "/services/delhi-to-haridwar"], ["Haridwar → Kedarnath", "/services/haridwar-to-kedarnath"], ["Delhi Airport → UK", "/services/delhi-airport-to-uttarakhand"]].map(([l, to]) => <li key={to}><Link to={to}>{l}</Link></li>)}
        </ul>
      </div>
      <div className="f-col">
        <h4>Top Packages</h4>
        <ul className="f-links">
          {[["Char Dham Yatra", "/packages/char-dham-yatra"], ["Kedarnath Pilgrimage", "/packages/kedarnath-pilgrimage"], ["Jim Corbett Safari", "/packages/jim-corbett-safari"], ["Nainital Family Tour", "/packages/nainital-family-tour"], ["Rishikesh Adventure", "/packages/rishikesh-adventure-package"]].map(([l, to]) => <li key={to}><Link to={to}>{l}</Link></li>)}
        </ul>
      </div>
    </div>
    <div className="f-bottom">
      <p className="f-copy">© {new Date().getFullYear()} <span>Sharma Fast Cabs</span> · Haldwani, Uttarakhand · Made with ❤️ for travellers</p>
      <div className="f-socials">
        <a href="https://wa.me/918979331110" className="f-soc" target="_blank" rel="noreferrer">💬</a>
        <a href="tel:+918979331110" className="f-soc">📞</a>
        <a href="mailto:sharmafastcabs@gmail.com" className="f-soc">✉️</a>
      </div>
    </div>
  </footer>
);

/* ─── HOME ─── */
const Home = ({ currentSlide }) => {
  const enquire = useEnquire();
  return (
    <>
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${slides[currentSlide].img})` }} />
        <div className="hero-ov" />
        <div className="hero-content">
          <p className="hero-badge">🚖 Uttarakhand's Trusted Cab Partner Since 2009</p>
          <h1 className="hero-title">Explore India with<br /><span className="acc">Sharma Fast Cabs</span></h1>
          <p className="hero-sub">{slides[currentSlide].dest} — {slides[currentSlide].text}</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => enquire()}>Book Now →</button>
            <Link to="/packages" className="btn-outline">View Packages</Link>
          </div>
        </div>
        <div className="slider-dots">{slides.map((_, i) => <div key={i} className={`dot${i === currentSlide ? " active" : ""}`} />)}</div>
      </section>

      <div className="stats-band">
        {[["10,000+", "Happy Customers"], ["500+", "Routes Covered"], ["15+", "Years Experience"], ["24/7", "Support"]].map(([v, l]) => (
          <div key={l}><div className="stat-val">{v}</div><div className="stat-lbl">{l}</div></div>
        ))}
      </div>

      {/* Popular Packages */}
      <section className="sec sec-alt">
        <div className="mw tc">
          <span className="sec-tag">✦ Top Picks</span>
          <h2 className="sec-title">Popular Tour Packages</h2>
          <p className="sec-sub">Handcrafted journeys across Uttarakhand — mountains, temples, wildlife and more.</p>
          <div className="grid-3">
            {packagesData.slice(0, 3).map((pkg, i) => (
              <article className="card" key={i}>
                <img className="card-img" src={pkg.img} alt={pkg.name} loading={i === 0 ? "eager" : "lazy"} />
                <div className="card-body">
                  <span className="card-tag">{pkg.tag}</span>
                  <h3 className="card-title">{pkg.name}</h3>
                  <p className="card-meta">⏱ {pkg.duration}</p>
                  <p className="card-desc">{pkg.desc}</p>
                  <div className="card-actions">
                    <Link to={`/packages/${pkg.slug}`} className="btn-cv" style={{ textAlign: "center" }}>View Details</Link>
                    <button className="btn-ce" onClick={() => enquire(pkg.name)}>Enquire</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Link to="/packages" className="btn-teal" style={{ display: "inline-flex" }}>View All Packages →</Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="sec sec-dark">
        <div className="mw tc">
          <span className="sec-tag">✦ Why Choose Us</span>
          <h2 className="sec-title" style={{ color: "var(--white)" }}>The Sharma Fast Cabs Difference</h2>
          <p className="sec-sub lt">Safety, comfort, and reliability — so you can travel worry-free across Uttarakhand.</p>
          <div className="feat-grid">
            {[["🏷️", "Best Price Guarantee", "Transparent pricing, no hidden charges."], ["⚡", "Quick Booking", "WhatsApp enquiry confirmed within minutes."], ["🛡️", "Verified Drivers", "Background-checked, mountain-road certified."], ["🗺️", "500+ Routes", "Airport to Char Dham, every corner covered."], ["📞", "24/7 Support", "Always reachable — day, night, rain or shine."], ["🚗", "Clean AC Fleet", "Hygienically maintained, sanitized vehicles."]].map(([icon, title, desc]) => (
              <div className="feat-card" key={title}>
                <div className="feat-icon">{icon}</div>
                <div className="feat-title">{title}</div>
                <p className="feat-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="sec sec-alt">
        <div className="mw tc">
          <span className="sec-tag">✦ Destinations</span>
          <h2 className="sec-title">Where Do You Want to Go?</h2>
          <p className="sec-sub">Browse Uttarakhand's most loved destinations by category.</p>
          <div className="dest-grid">
            {[
              { label: "Hill Stations", badge: "Nainital · Mussoorie", img: "/images/mussoorie.jpg", to: "/destinations?cat=Hill+Station" },
              { label: "Spiritual", badge: "Char Dham · Haridwar", img: "/images/haridwar.jpg", to: "/destinations?cat=Spiritual" },
              { label: "Adventure", badge: "Rishikesh · Auli", img: "/images/rishikesh.jpg", to: "/destinations?cat=Adventure" },
              { label: "Wildlife", badge: "Jim Corbett", img: "/images/jimcorbett.jpg", to: "/destinations?cat=Wildlife" },
              { label: "Trekking", badge: "Chopta · Valley of Flowers", img: "/images/chopta.jpg", to: "/destinations?cat=Nature+%26+Trekking" },
            ].map((d) => (
              <Link to={d.to} className="dest-card" key={d.label}>
                <img src={d.img} alt={d.label} loading="lazy" />
                <div className="dest-ov" />
                <div className="dest-label">{d.label}</div>
                <span className="dest-badge">{d.badge}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec">
        <div className="mw-sm tc" style={{ marginBottom: "2.5rem" }}>
          <span className="sec-tag">✦ Common Questions</span>
          <h2 className="sec-title">Frequently Asked Questions</h2>
        </div>
        <FAQ items={faqData} />
      </section>

      <div className="cta-strip">
        <h2>Ready to Start Your Journey?</h2>
        <p>Talk to us on WhatsApp and get your cab booked in minutes.</p>
        <button className="btn-dark" onClick={() => enquire()}>Get a Free Quote →</button>
      </div>
    </>
  );
};

/* ─── PACKAGES LIST ─── */
const Packages = () => {
  const enquire = useEnquire();
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Hill Station", "Spiritual", "Adventure", "Wildlife"];
  const visible = filter === "All" ? packagesData : packagesData.filter(p => p.tag === filter);
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Packages", href: "/packages" }]} />
      <div className="ph-simple"><h1>Tour Packages 🗺️</h1><p>Handcrafted Uttarakhand experiences for every kind of traveller</p></div>
      <div className="filter-bar">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`filter-chip${filter === f ? " active" : ""}`}>{f}</button>
        ))}
      </div>
      <section className="sec sec-alt">
        <div className="mw grid-3">
          {visible.map((pkg, i) => (
            <article className="card" key={i}>
              <img className="card-img" src={pkg.img} alt={pkg.name} loading="lazy" />
              <div className="card-body">
                <span className="card-tag">{pkg.tag}</span>
                <h2 className="card-title">{pkg.name}</h2>
                <p className="card-meta">⏱ {pkg.duration} &nbsp;|&nbsp; 📍 {pkg.distance}</p>
                <p className="card-desc">{pkg.desc}</p>
                <div className="card-actions">
                  <Link to={`/packages/${pkg.slug}`} className="btn-cv" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>View Details</Link>
                  <button className="btn-ce" onClick={() => enquire(pkg.name)}>Enquire</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

/* ─── PACKAGE DETAIL ─── */
const PackageDetail = () => {
  const { slug } = useParams();
  const enquire = useEnquire();
  const pkg = packagesData.find(p => p.slug === slug);
  if (!pkg) return <div style={{ padding: "4rem 2rem", textAlign: "center" }}><h2>Package not found.</h2><Link to="/packages" className="btn-teal" style={{ marginTop: "1rem", display: "inline-flex" }}>← All Packages</Link></div>;
  const related = packagesData.filter(p => pkg.relatedSlugs?.includes(p.slug)).slice(0, 3);
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Packages", href: "/packages" }, { label: pkg.name, href: `/packages/${slug}` }]} />
      <div className="ph" style={{ minHeight: 320 }}>
        <div className="ph-bg" style={{ backgroundImage: `url(${pkg.heroImg || pkg.img})` }} />
        <div className="ph-content">
          <span className="ph-tag">{pkg.tag}</span>
          <h1 className="ph-title">{pkg.name}</h1>
          <p className="ph-sub">{pkg.duration} &nbsp;·&nbsp; {pkg.distance} &nbsp;·&nbsp; Best time: {pkg.bestTime}</p>
        </div>
      </div>
      <div className="detail-wrap">
        <div className="detail-main">
          <div className="info-box-grid">
            {[["⏱", "Duration", pkg.duration], ["📍", "Distance", pkg.distance], ["👥", "Group Size", pkg.groupSize], ["⛰️", "Difficulty", pkg.difficulty], ["🌤️", "Best Time", pkg.bestTime]].map(([icon, label, val]) => (
              <div className="info-box-item" key={label}>
                <div className="info-box-icon">{icon}</div>
                <div className="info-box-label">{label}</div>
                <div className="info-box-val">{val}</div>
              </div>
            ))}
          </div>

          <div className="quote-banner">
            <div>💰</div>
            <div className="quote-banner-text">
              <h3>Get a Personalised Quote</h3>
              <p>Price depends on vehicle type, group size, travel dates & pickup location. Contact us for an exact quote.</p>
            </div>
            <button className="btn-wa" onClick={() => enquire(pkg.name)}>💬 WhatsApp for Price</button>
          </div>

          <div className="detail-section">
            <h3>Overview</h3>
            <p>{pkg.longDesc}</p>
          </div>

          <div className="detail-section">
            <h3>Tour Highlights</h3>
            <ul className="detail-list">
              {pkg.highlights.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>

          <div className="detail-section">
            <h3>Day-by-Day Itinerary</h3>
            <ul className="itinerary-list">
              {pkg.itinerary.map((d, i) => (
                <li className="itin-item" key={i}>
                  <div className="itin-dot">{i + 1}</div>
                  <div className="itin-text">
                    <strong>{d.day}: {d.title}</strong>
                    <span>{d.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="split-grid">
            <div className="detail-section" style={{ margin: 0, background: "var(--teal-xlt)", borderRadius: 14, padding: "1.5rem" }}>
              <h3 style={{ borderLeftColor: "var(--teal)", marginBottom: "1rem" }}>What's Included ✓</h3>
              <ul className="detail-list">
                {pkg.includes.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
            {pkg.excludes && (
              <div className="detail-section" style={{ margin: 0, background: "#FFF5F5", borderRadius: 14, padding: "1.5rem" }}>
                <h3 style={{ borderLeftColor: "var(--rust)", marginBottom: "1rem" }}>Not Included ✗</h3>
                <ul className="detail-list" style={{ listStyle: "none" }}>
                  {pkg.excludes.map((h, i) => <li key={i} style={{ display: "flex", gap: "0.75rem" }}><span style={{ color: "var(--rust)", fontWeight: 800 }}>✗</span>{h}</li>)}
                </ul>
              </div>
            )}
          </div>

          {pkg.faqs && pkg.faqs.length > 0 && (
            <div className="detail-section">
              <h3>Frequently Asked Questions</h3>
              <FAQ items={pkg.faqs} />
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-head">
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>📋 Get a Custom Quote</div>
              <div style={{ color: "var(--white)", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.4 }}>Price based on vehicle, group size & dates</div>
              <div style={{ marginTop: "0.75rem", fontSize: "0.88rem", color: "rgba(255,255,255,0.6)" }}>⏱ {pkg.duration}</div>
            </div>
            <div className="sidebar-card-body">
              {[["📍", "Distance", pkg.distance], ["👥", "Group Size", pkg.groupSize], ["⛰️", "Difficulty", pkg.difficulty], ["🌤️", "Best Season", pkg.bestTime]].map(([icon, label, val]) => (
                <div className="sidebar-fact" key={label}>
                  <div className="sidebar-fact-icon">{icon}</div>
                  <div className="sidebar-fact-text"><strong>{label}</strong><span>{val}</span></div>
                </div>
              ))}
            </div>
            <div className="sidebar-actions">
              <button className="btn-wa" onClick={() => enquire(pkg.name)}>💬 WhatsApp Enquiry</button>
              <button className="btn-primary" onClick={() => enquire(pkg.name)}>📋 Book This Package</button>
              <a href="tel:+918979331110" className="btn-teal" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>📞 Call 8979331110</a>
            </div>
          </div>
          <div className="contact-mini">
            <p>Need help planning?</p>
            <a href="tel:+918979331110">8979331110</a>
            <p style={{ marginTop: "0.4rem" }}>Available 24/7 · Instant WhatsApp reply</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="sec sec-alt">
          <div className="mw tc">
            <h2 className="sec-title">You Might Also Like</h2>
            <div className="related-grid">
              {related.map((r, i) => (
                <Link to={`/packages/${r.slug}`} className="related-card" key={i}>
                  <img src={r.img} alt={r.name} loading="lazy" />
                  <div className="related-card-body">
                    <span className="card-tag">{r.tag}</span>
                    <div className="related-card-title">{r.name}</div>
                    <div className="related-card-meta">⏱ {r.duration}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

/* ─── SERVICES LIST ─── */
const Services = () => {
  const enquire = useEnquire();
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const categories = [...new Set(servicesData.map(s => s.category))];
  const visible = servicesData.filter(s => {
    const matchesCat = cat === "All" || s.category === cat;
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]} />
      <div className="ph-simple"><h1>Cab & Taxi Services 🚖</h1><p>100+ routes covered across Uttarakhand, Delhi NCR & North India</p></div>
      <div className="filter-bar" style={{ justifyContent: "stretch" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <input className="svc-search" placeholder="🔍 Search a route or service..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
          {["All", ...categories].map(c => (
            <button key={c} onClick={() => setCat(c)} className={`filter-chip${cat === c ? " active" : ""}`} style={{ whiteSpace: "nowrap" }}>{c}</button>
          ))}
        </div>
      </div>
      <section className="sec sec-alt">
        <div className="mw">
          <p style={{ textAlign: "center", color: "var(--text-lt)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{visible.length} service{visible.length !== 1 ? "s" : ""} found</p>
          <div className="svc-grid">
            {visible.map((svc, i) => (
              <div className="svc-card" key={i}>
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{svc.icon}</span>
                <span className="svc-name">{svc.name}</span>
                <div className="svc-btns">
                  <Link to={`/services/${svc.slug}`} className="btn-svv">Details</Link>
                  <button className="btn-sv" onClick={() => enquire(svc.name)}>Enquire</button>
                </div>
              </div>
            ))}
          </div>
          {visible.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-lt)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <p>No services found. Try a different search or <button style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans", fontSize: "inherit" }} onClick={() => { setSearch(""); setCat("All"); }}>clear filters</button></p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

/* ─── SERVICE DETAIL ─── */
const ServiceDetail = () => {
  const { slug } = useParams();
  const enquire = useEnquire();
  const svc = servicesData.find(s => s.slug === slug);
  if (!svc) return <div style={{ padding: "4rem 2rem", textAlign: "center" }}><h2>Service not found.</h2><Link to="/services" className="btn-teal" style={{ marginTop: "1rem", display: "inline-flex" }}>← All Services</Link></div>;
  const related = servicesData.filter(s => s.slug !== slug && s.category === svc.category).slice(0, 3);
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: svc.name, href: `/services/${slug}` }]} />
      <div className="ph" style={{ minHeight: 280 }}>
        <div className="ph-bg" style={{ backgroundImage: `url(/images/haridwar.jpg)` }} />
        <div className="ph-content">
          <span className="ph-tag">{svc.category}</span>
          <h1 className="ph-title">{svc.icon} {svc.name}</h1>
          <p className="ph-sub">{svc.distance} &nbsp;·&nbsp; {svc.duration}</p>
        </div>
      </div>
      <div className="detail-wrap">
        <div className="detail-main">
          <div className="info-box-grid">
            {[["📍", "Distance", svc.distance], ["⏱", "Est. Duration", svc.duration], ["🏷️", "Category", svc.category]].map(([icon, label, val]) => (
              <div className="info-box-item" key={label}><div className="info-box-icon">{icon}</div><div className="info-box-label">{label}</div><div className="info-box-val">{val}</div></div>
            ))}
          </div>

          <div className="quote-banner">
            <div>💰</div>
            <div className="quote-banner-text">
              <h3>Get an Instant Price Quote</h3>
              <p>Fare depends on vehicle type, pickup location, number of passengers & travel date. Share details for exact fare.</p>
            </div>
            <button className="btn-wa" onClick={() => enquire(svc.name)}>💬 WhatsApp for Price</button>
          </div>

          <div className="detail-section">
            <h3>About This Service</h3>
            <p>{svc.longDesc || svc.desc}</p>
          </div>

          {svc.vehicles && svc.vehicles.length > 0 && (
            <div className="detail-section">
              <h3>Available Vehicles</h3>
              <div className="pills-wrap">
                {svc.vehicles.map((v, i) => <span className="pill" key={i}>🚗 {v}</span>)}
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-lt)", marginTop: "1rem" }}>* Contact us for exact fare — price depends on travel date, distance, passengers and vehicle. All fares include driver, fuel and tolls.</p>
            </div>
          )}

          {svc.includes && svc.includes.length > 0 && (
            <div className="detail-section">
              <h3>What's Included</h3>
              <ul className="detail-list">
                {svc.includes.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {svc.tips && svc.tips.length > 0 && (
            <div className="detail-section">
              <h3>Traveller Tips</h3>
              <ul className="detail-list bullets">
                {svc.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}

          <div className="info-box" style={{ marginTop: "2rem" }}>
            <p style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "1rem" }}>📞 Get an Instant Quote</p>
            <p style={{ fontSize: "0.9rem", color: "var(--text-lt)", marginBottom: "1rem" }}>Call or WhatsApp us with your pickup location, destination, date and number of passengers for an exact fare.</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="tel:+918979331110" className="btn-teal" style={{ textDecoration: "none" }}>📞 Call 8979331110</a>
              <button className="btn-wa" onClick={() => enquire(svc.name)}>💬 WhatsApp Enquiry</button>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-head">
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>📋 Get a Custom Quote</div>
              <div style={{ color: "var(--white)", fontWeight: 700, fontSize: "1.05rem" }}>Price on request</div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", marginTop: "0.4rem" }}>Depends on vehicle, passengers & date</div>
              <div style={{ marginTop: "0.75rem", fontSize: "0.88rem", color: "rgba(255,255,255,0.6)" }}>{svc.icon} {svc.category}</div>
            </div>
            <div className="sidebar-card-body">
              {[["📍", "Distance", svc.distance], ["⏱", "Duration", svc.duration]].map(([icon, label, val]) => (
                <div className="sidebar-fact" key={label}><div className="sidebar-fact-icon">{icon}</div><div className="sidebar-fact-text"><strong>{label}</strong><span>{val}</span></div></div>
              ))}
            </div>
            <div className="sidebar-actions">
              <button className="btn-wa" onClick={() => enquire(svc.name)}>💬 WhatsApp Enquiry</button>
              <button className="btn-primary" onClick={() => enquire(svc.name)}>📋 Book This Service</button>
              <a href="tel:+918979331110" className="btn-teal" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>📞 Call 8979331110</a>
            </div>
          </div>
          <div className="contact-mini">
            <p>Available 24/7 for instant booking</p>
            <a href="tel:+918979331110">8979331110</a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="sec sec-alt">
          <div className="mw tc">
            <h2 className="sec-title">Related Services</h2>
            <div className="related-grid">
              {related.map((r, i) => (
                <Link to={`/services/${r.slug}`} className="related-card" key={i}>
                  <div style={{ height: 80, background: `linear-gradient(135deg, var(--night), var(--teal))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>{r.icon}</div>
                  <div className="related-card-body">
                    <span className="card-tag">{r.category}</span>
                    <div className="related-card-title">{r.name}</div>
                    <div className="related-card-meta">{r.distance} · {r.duration}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

/* ─── DESTINATIONS LIST ─── */
const Destinations = () => {
  const location = useLocation();
  const enquire = useEnquire();
  const initialCat = new URLSearchParams(location.search).get("cat") || null;
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const categories = Object.keys(destinationsData);
  const allDests = selectedCat ? destinationsData[selectedCat] : Object.values(destinationsData).flat().filter((d, i, arr) => arr.findIndex(x => x.slug === d.slug) === i);
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations" }, ...(selectedCat ? [{ label: selectedCat, href: "/destinations" }] : [])]} />
      <div className="ph-simple"><h1>Explore Destinations 🌍</h1><p>Discover Uttarakhand by category — hills, temples, adventures & wildlife</p></div>
      <div className="filter-bar">
        {["All", ...categories].map(c => (
          <button key={c} onClick={() => setSelectedCat(c === "All" ? null : c)} className={`filter-chip${(c === "All" && !selectedCat) || c === selectedCat ? " active" : ""}`}>{c}</button>
        ))}
      </div>
      <section className="sec sec-alt">
        <div className="mw grid-3">
          {allDests.map((dest, i) => (
            <article className="card" key={i}>
              <img className="card-img" src={dest.img} alt={dest.name} loading="lazy" />
              <div className="card-body">
                <span className="card-tag">{dest.tag}</span>
                <h2 className="card-title">{dest.name}</h2>
                <p className="card-meta">📍 {dest.distance} &nbsp;|&nbsp; 🌤️ {dest.best}</p>
                <p className="card-desc">{dest.desc}</p>
                <div className="card-actions">
                  <Link to={`/destinations/${dest.slug}`} className="btn-cv" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>Explore</Link>
                  <button className="btn-ce" onClick={() => enquire(dest.name + " Tour")}>Enquire</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

/* ─── DESTINATION DETAIL ─── */
const DestinationDetail = () => {
  const { slug } = useParams();
  const enquire = useEnquire();
  const dest = allDestinations.find(d => d.slug === slug);
  if (!dest) return <div style={{ padding: "4rem 2rem", textAlign: "center" }}><h2>Destination not found.</h2><Link to="/destinations" className="btn-teal" style={{ marginTop: "1rem", display: "inline-flex" }}>← All Destinations</Link></div>;
  const relatedPackages = packagesData.filter(p => p.tag === dest.tag).slice(0, 3);
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations" }, { label: dest.name, href: `/destinations/${slug}` }]} />
      <div className="ph" style={{ minHeight: 380 }}>
        <div className="ph-bg" style={{ backgroundImage: `url(${dest.img})` }} />
        <div className="ph-content">
          <span className="ph-tag">{dest.tag}</span>
          <h1 className="ph-title">{dest.name}</h1>
          <p className="ph-sub" style={{ fontStyle: "italic" }}>"{dest.tagline}"</p>
        </div>
      </div>
      <div className="detail-wrap">
        <div className="detail-main">
          <div className="info-box-grid">
            {[["📍", "Distance", dest.distance], ["⛰️", "Altitude", dest.altitude], ["🌤️", "Best Season", dest.best], ["🛏️", "Recommended Stay", dest.stay]].map(([icon, label, val]) => (
              <div className="info-box-item" key={label}><div className="info-box-icon">{icon}</div><div className="info-box-label">{label}</div><div className="info-box-val">{val}</div></div>
            ))}
          </div>

          <div className="detail-section">
            <h3>About {dest.name}</h3>
            <p>{dest.desc}</p>
          </div>

          {dest.highlights && dest.highlights.length > 0 && (
            <div className="detail-section">
              <h3>Top Highlights</h3>
              <div className="pills-wrap">
                {dest.highlights.map((h, i) => <span className="pill" key={i}>{h}</span>)}
              </div>
            </div>
          )}

          {dest.places && dest.places.length > 0 && (
            <div className="detail-section">
              <h3>Places to Visit</h3>
              <div className="grid-2" style={{ gap: "1.2rem" }}>
                {dest.places.map((p, i) => (
                  <div key={i} style={{ background: "var(--sand)", borderRadius: 14, padding: "1.25rem", borderLeft: "3px solid var(--teal)" }}>
                    <div style={{ fontWeight: 700, marginBottom: "0.35rem", fontSize: "1rem" }}>{p.name}</div>
                    <div style={{ fontSize: "0.88rem", color: "var(--text-lt)", lineHeight: 1.6 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dest.getting_there && (
            <div className="detail-section">
              <h3>How to Get There</h3>
              <p>{dest.getting_there}</p>
            </div>
          )}

          {dest.nearBy && dest.nearBy.length > 0 && (
            <div className="detail-section">
              <h3>Nearby Destinations</h3>
              <div className="pills-wrap">
                {dest.nearBy.map((n, i) => <span className="pill" key={i}>📍 {n}</span>)}
              </div>
            </div>
          )}

          {dest.tips && dest.tips.length > 0 && (
            <div className="detail-section">
              <h3>Traveller Tips</h3>
              <ul className="detail-list bullets">
                {dest.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-head">
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🚖</div>
              <div style={{ color: "var(--white)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.4rem" }}>Book a Cab to {dest.name}</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Comfortable AC cabs · 24/7 available</div>
            </div>
            <div className="sidebar-card-body">
              {[["📍", "Distance", dest.distance], ["🌤️", "Best Season", dest.best], ["🛏️", "Ideal Stay", dest.stay], ["⛰️", "Altitude", dest.altitude]].map(([icon, label, val]) => (
                <div className="sidebar-fact" key={label}><div className="sidebar-fact-icon">{icon}</div><div className="sidebar-fact-text"><strong>{label}</strong><span>{val}</span></div></div>
              ))}
            </div>
            <div className="sidebar-actions">
              <button className="btn-wa" onClick={() => enquire(dest.name + " Tour")}>💬 WhatsApp Enquiry</button>
              <button className="btn-primary" onClick={() => enquire(dest.name + " Tour")}>📋 Book a Cab</button>
              <a href="tel:+918979331110" className="btn-teal" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>📞 Call 8979331110</a>
            </div>
          </div>
          <div className="contact-mini">
            <p>Need a customized itinerary?</p>
            <a href="tel:+918979331110">8979331110</a>
            <p style={{ marginTop: "0.4rem" }}>Available 24/7 · Instant reply</p>
          </div>
        </div>
      </div>

      {relatedPackages.length > 0 && (
        <section className="sec sec-alt">
          <div className="mw tc">
            <span className="sec-tag">✦ Related</span>
            <h2 className="sec-title">Packages for {dest.name}</h2>
            <div className="related-grid">
              {relatedPackages.map((pkg, i) => (
                <Link to={`/packages/${pkg.slug}`} className="related-card" key={i}>
                  <img src={pkg.img} alt={pkg.name} loading="lazy" />
                  <div className="related-card-body">
                    <span className="card-tag">{pkg.tag}</span>
                    <div className="related-card-title">{pkg.name}</div>
                    <div className="related-card-meta">⏱ {pkg.duration}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

/* ─── ABOUT ─── */
const About = () => {
  const enquire = useEnquire();
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
      <div className="ph-simple" style={{ padding: "5rem 2rem" }}>
        <h1>Your Trusted Travel Partner 🚖</h1>
        <p>Connecting hearts across Uttarakhand, Delhi & beyond since 2009</p>
      </div>
      <section className="sec sec-dark">
        <div className="mw tc">
          <span className="sec-tag">✦ Why Choose Us</span>
          <h2 className="sec-title" style={{ color: "var(--white)" }}>What Sets Us Apart</h2>
          <div className="feat-grid">
            {[["🏷️", "Best Price Guarantee", "Affordable, transparent pricing on every trip."], ["⚡", "Easy & Quick Booking", "Confirmed in minutes via WhatsApp."], ["📞", "24/7 Customer Support", "Always available to assist you."]].map(([icon, title, desc]) => (
              <div className="feat-card" key={title}><div className="feat-icon">{icon}</div><div className="feat-title">{title}</div><p className="feat-desc">{desc}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="tc" style={{ marginBottom: "2rem" }}>
          <span className="sec-tag">✦ Our Story</span>
          <h2 className="sec-title">About Sharma Fast Cabs</h2>
        </div>
        {["At Sharma Fast Cabs, we believe every journey should be comfortable, safe, and memorable. Our mission is to provide reliable cab services that connect you with the most beautiful destinations across Uttarakhand and beyond.", "Whether you're planning a spiritual trip to Kedarnath or Badrinath, exploring scenic hill stations like Mussoorie and Nainital, or travelling for business — we ensure a smooth, hassle-free experience with expert local knowledge.", "Founded in 2009 and based in Rudrapur, we've built a reputation on punctuality, transparent pricing and genuine care for our passengers. With over 10,000 happy customers and 500+ routes covered, Sharma Fast Cabs is your trusted travel partner."].map((p, i) => <p key={i} style={{ lineHeight: 1.8, color: "var(--text-lt)", marginBottom: "1rem", fontSize: "1.05rem" }}>{p}</p>)}
      </section>
      <section className="sec sec-teal">
        <div className="mw tc">
          <span className="sec-tag">✦ Testimonials</span>
          <h2 className="sec-title" style={{ color: "var(--white)" }}>What Our Customers Say</h2>
          <div className="grid-2" style={{ maxWidth: 900, margin: "2rem auto 0" }}>
            {[{ text: "Excellent and reliable service. Clean cars, punctual drivers and a very smooth experience from Haldwani to Delhi.", name: "Mrs. Sunita Rai", city: "Haldwani" }, { text: "My business trip was seamless. The driver was professional and the service top-notch. Highly recommended!", name: "Mr. Rajesh Sharma", city: "Rudrapur" }, { text: "Booked the Kedarnath package — absolutely wonderful. Everything was arranged perfectly.", name: "Mr. Deepak Verma", city: "Delhi" }, { text: "Best cab service in Uttarakhand! Very affordable prices and the driver knew every mountain road perfectly.", name: "Mrs. Priya Joshi", city: "Nainital" }].map((t, i) => (
              <div className="testi-card" key={i}><div className="testi-stars">★★★★★</div><blockquote className="testi-text">"{t.text}"</blockquote><div className="testi-author">{t.name}</div><div className="testi-city">{t.city}</div></div>
            ))}
          </div>
        </div>
      </section>
      <div className="cta-strip">
        <h2>Ready to Plan Your Trip?</h2>
        <p>Get in touch and we'll craft the perfect itinerary for you.</p>
        <button className="btn-dark" onClick={() => enquire()}>Contact Us →</button>
      </div>
    </>
  );
};

/* ─── CONTACT ─── */
const Contact = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState(new URLSearchParams(location.search).get("service") || "");
  useEffect(() => { setService(new URLSearchParams(location.search).get("service") || ""); }, [location.search]);
  const handleSubmit = () => {
    if (!name) { alert("Please enter your name."); return; }
    const text = `Hello Sharma Fast Cabs 🚖\n\nName: ${name}\nPhone: ${phone || "N/A"}\nService: ${service || "General Enquiry"}\nMessage: ${message || "N/A"}\n\nI want to enquire about this service.`;
    window.open(`https://wa.me/918979331110?text=${encodeURIComponent(text)}`, "_blank");
  };
  const services = [...new Set(servicesData.map(s => s.name)), "Char Dham Yatra", "Kedarnath Tour", "Nainital Tour", "Mussoorie Tour", "Rishikesh Adventure", "Custom Route"];
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
      <div className="ph-simple"><h1>Contact Us 📞</h1><p>We're here to help you plan your perfect journey — 24/7</p></div>
      <section className="sec sec-alt">
        <div className="contact-wrap">
          <address style={{ fontStyle: "normal" }}>
            <span className="sec-tag">✦ Get In Touch</span>
            <h2 style={{ fontFamily: "Playfair Display", fontSize: "2rem", marginBottom: "1rem", marginTop: "0.5rem" }}>Let's Plan Your Journey</h2>
            <p style={{ color: "var(--text-lt)", lineHeight: 1.7, marginBottom: "2rem" }}>Fill the form and we'll respond on WhatsApp within minutes. Or call us directly anytime.</p>
            {[["📞", "Call / WhatsApp", <a href="tel:+918979331110" style={{ color: "var(--teal)", fontWeight: 700 }}>8979331110</a>], ["✉️", "Email", <a href="mailto:sharmafastcabs@gmail.com" style={{ color: "var(--teal)" }}>sharmafastcabs@gmail.com</a>], ["📍", "Based In", "Rudrapur, Uttarakhand, India"], ["🕐", "Available", "24 Hours · 7 Days a Week"], ["🚗", "Fleet", "AC Sedans, SUVs, Tempo Travellers"]].map(([icon, label, val], i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(245,166,35,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{icon}</div>
                <div><strong style={{ display: "block", marginBottom: "0.2rem" }}>{label}</strong><span style={{ color: "var(--text-lt)", fontSize: "0.9rem" }}>{val}</span></div>
              </div>
            ))}
          </address>
          <div className="form-card">
            <h2 style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", marginBottom: "0.4rem" }}>Enquire Now</h2>
            <p style={{ color: "var(--text-lt)", marginBottom: "1.8rem", fontSize: "0.9rem" }}>We'll confirm your booking on WhatsApp</p>
            <div className="form-row" style={{ marginBottom: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="+91 XXXXX XXXXX" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Select Service / Route *</label>
              <select className="form-select" value={service} onChange={e => setService(e.target.value)}>
                <option value="">-- Choose a Service / Route --</option>
                {services.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Message (optional)</label>
              <textarea className="form-textarea" placeholder="Travel dates, number of passengers, pickup point..." value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <button className="btn-wa" style={{ width: "100%", justifyContent: "center", padding: "1rem", fontSize: "1rem" }} onClick={handleSubmit}>
              💬 Send Enquiry on WhatsApp
            </button>
            <p style={{ textAlign: "center", marginTop: "1.2rem", color: "var(--text-lt)", fontSize: "0.85rem" }}>Or call directly: <a href="tel:+918979331110" style={{ color: "var(--teal)", fontWeight: 700 }}>8979331110</a></p>
          </div>
        </div>
      </section>
    </>
  );
};

/* ─── APP ─── */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    document.documentElement.lang = "en-IN";
    const t = setTimeout(() => setLoading(false), 800);
    const s = setInterval(() => setSlide(p => (p + 1) % slides.length), 3500);
    return () => { clearTimeout(t); clearInterval(s); };
  }, []);
  if (loading) return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0B1120", gap: "1rem" }}>
      <div style={{ fontFamily: "Playfair Display,serif", fontSize: "2rem", color: "#F5A623", fontWeight: 900 }}>Sharma Fast Cabs</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Loading your journey...</div>
    </div>
  );
  return (
    <BrowserRouter>
      <GlobalStyles />
      <a href="#main" style={{ position: "absolute", top: "-100px", left: "1rem", background: "var(--gold)", color: "var(--night)", padding: "0.6rem 1.2rem", borderRadius: "0 0 8px 8px", fontWeight: 700, zIndex: 99999 }} onFocus={e => e.target.style.top = "0"} onBlur={e => e.target.style.top = "-100px"}>Skip to main content</a>
      <Nav />
      <FloatingButtons />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home currentSlide={slide} />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:slug" element={<PackageDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}