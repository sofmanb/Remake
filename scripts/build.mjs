// Generates the static pages from shared header/footer partials.
// Usage: node scripts/build.mjs
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const NAV = [
  ["index.html", "Home"],
  ["data-centres.html", "Data Centres"],
  ["services.html", "Services"],
  ["sustainability.html", "Sustainability"],
  ["about.html", "About"],
];

const logo = `<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="#e4002b"/><path d="M8 9l8 15 8-15" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const icon = (d) => `<div class="icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg></div>`;
const ICONS = {
  server: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
  leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l7-7"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7M18 20a6 6 0 00-3-5.2"/>',
  tool: '<path d="M14.7 6.3a4 4 0 015 5L12 19l-4 1 1-4z"/>',
};

function page({ file, title, description, body }) {
  const navItems = NAV.map(([href, label]) =>
    `<li><a href="${href}"${href === file ? ' aria-current="page"' : ""}>${label}</a></li>`
  ).join("");
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta name="theme-color" content="#0b1220">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(logo.replace(' class="logo-mark"', ' xmlns="http://www.w3.org/2000/svg"'))}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap">
<link rel="stylesheet" href="assets/styles.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="logo" href="index.html" aria-label="VIRTUS Data Centres home">${logo}<span>VIRTUS</span></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <ul>${navItems}<li><a class="btn" href="contact.html"${file === "contact.html" ? ' aria-current="page"' : ""}>Contact us</a></li></ul>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="logo" href="index.html" style="color:#fff">${logo}<span>VIRTUS</span></a>
        <p style="margin-top:16px;max-width:340px">London's hyperscale and colocation data centre platform, part of ST Telemedia Global Data Centres.</p>
      </div>
      <div>
        <h4>Data centres</h4>
        <ul>
          <li><a href="data-centres.html#stockley-park">Stockley Park</a></li>
          <li><a href="data-centres.html#slough">Slough</a></li>
          <li><a href="data-centres.html#enfield">Enfield</a></li>
          <li><a href="data-centres.html#hayes">Hayes</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="services.html">Services</a></li>
          <li><a href="sustainability.html">Sustainability</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Get in touch</h4>
        <ul>
          <li>London, United Kingdom</li>
          <li><a href="contact.html">Book a site tour</a></li>
          <li><a href="https://www.linkedin.com/company/virtus-data-centres/" rel="noopener">LinkedIn</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="year">2026</span> VIRTUS Data Centres. Unofficial redesign concept.</span>
      <span><a href="about.html">Privacy</a> · <a href="about.html">Modern slavery statement</a></span>
    </div>
  </div>
</footer>
<script src="assets/campuses.js"></script>
<script src="assets/main.js"></script>
</body>
</html>
`;
}

const ctaBlock = (heading, text) => `
<section>
  <div class="container">
    <div class="cta reveal">
      <div>
        <h2>${heading}</h2>
        <p>${text}</p>
      </div>
      <a class="btn" href="contact.html">Talk to our team</a>
    </div>
  </div>
</section>`;

const pageHero = (eyebrow, h1, lead) => `
<section class="hero page-hero">
  <div class="grid-bg"></div>
  <div class="container">
    <p class="eyebrow">${eyebrow}</p>
    <h1>${h1}</h1>
    <p class="lead">${lead}</p>
  </div>
</section>`;

const campusSvg = `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration of data hall racks">
  <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a3d63"/><stop offset="1" stop-color="#15213a"/></linearGradient></defs>
  ${Array.from({ length: 6 }, (_, i) => {
    const x = 30 + i * 58;
    const leds = Array.from({ length: 9 }, (_, j) => `<rect x="${x + 8}" y="${70 + j * 18}" width="30" height="8" rx="2" fill="#0b1220"/><circle cx="${x + 34}" cy="${74 + j * 18}" r="2" fill="${(i + j) % 3 === 0 ? "#e4002b" : "#00a3e0"}"/>`).join("");
    return `<rect x="${x}" y="60" width="46" height="180" rx="4" fill="url(#g)" stroke="#33476e"/>${leds}`;
  }).join("")}
  <rect x="20" y="246" width="360" height="4" rx="2" fill="#33476e"/>
</svg>`;

const londonMap = `<svg viewBox="0 0 600 360" role="img" aria-label="Map of VIRTUS campus locations around London">
  <rect width="600" height="360" fill="none"/>
  <ellipse cx="360" cy="190" rx="200" ry="140" fill="#22304d" stroke="#33476e" stroke-dasharray="6 6"/>
  <text x="360" y="62" fill="#7f8db0" font-size="12" text-anchor="middle" font-family="Inter, sans-serif">M25</text>
  <path d="M60 230 C 200 210, 300 200, 560 180" stroke="#2f73b8" stroke-width="5" fill="none" opacity=".6"/>
  <text x="520" y="170" fill="#7fb4e6" font-size="11" font-family="Inter, sans-serif">Thames</text>
  <circle cx="420" cy="195" r="7" fill="#fff"/><text x="432" y="199" fill="#fff" font-size="13" font-family="Inter, sans-serif">Central London</text>
  ${[
    ["Enfield", 400, 80, "LONDON1"],
    ["Hayes", 285, 222, "LONDON2"],
    ["Stockley Park", 195, 150, "LONDON5–8"],
    ["Slough", 90, 215, "LONDON3, 4, 9–11"],
  ].map(([n, x, y, b]) => `<g><circle cx="${x}" cy="${y}" r="16" fill="#e4002b" opacity=".25"/><circle cx="${x}" cy="${y}" r="7" fill="#e4002b"/><text x="${x}" y="${y - 22}" fill="#fff" font-size="13" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">${n}</text><text x="${x}" y="${y + 28}" fill="#aab6cc" font-size="11" text-anchor="middle" font-family="Inter, sans-serif">${b}</text></g>`).join("")}
  <text x="40" y="335" fill="#7f8db0" font-size="11" font-family="Inter, sans-serif">Schematic, not to scale</text>
</svg>`;

const pages = [
  {
    file: "index.html",
    title: "VIRTUS Data Centres | London Hyperscale & Colocation",
    description: "VIRTUS designs, builds and operates hyperscale and colocation data centres across London, with campuses in Stockley Park, Slough, Hayes and Enfield.",
    body: `
<section class="hero">
  <div class="grid-bg"></div>
  <div class="container">
    <p class="eyebrow">London's data centre platform</p>
    <h1>Capacity for what's next,<br>built in the heart of London.</h1>
    <p class="lead">From a single rack to a whole building, VIRTUS delivers resilient, efficient data centre space across four London campuses — engineered for cloud, enterprise and AI.</p>
    <div class="hero-actions">
      <a class="btn" href="data-centres.html">Explore our data centres</a>
      <a class="btn btn-ghost" href="contact.html">Book a site tour</a>
    </div>
  </div>
</section>
<div class="container">
  <div class="stats reveal">
    <div class="stat"><strong>11</strong><span>London data centres</span></div>
    <div class="stat"><strong>175MW+</strong><span>Live and in-build IT capacity</span></div>
    <div class="stat"><strong>4</strong><span>Campuses inside and around the M25</span></div>
    <div class="stat"><strong>100%</strong><span>Renewable electricity supply</span></div>
  </div>
</div>

<section>
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">What we do</p>
      <h2>Data centre space that scales with you</h2>
      <p>Whichever stage you're at, our team designs a deployment around your power, density and connectivity needs — then runs it 24/7.</p>
    </div>
    <div class="cards">
      <article class="card reveal">${icon(ICONS.server)}<h3>Colocation</h3><p>Secure racks, cages and private suites with flexible contracts and on-site support around the clock.</p><a class="more" href="services.html#colocation">Learn more →</a></article>
      <article class="card reveal">${icon(ICONS.bolt)}<h3>Hyperscale</h3><p>Dedicated halls and whole buildings delivered to your specification, ready for multi-megawatt cloud deployments.</p><a class="more" href="services.html#hyperscale">Learn more →</a></article>
      <article class="card reveal">${icon(ICONS.chip)}<h3>AI &amp; high density</h3><p>Liquid-cooling-ready infrastructure built for GPU clusters and high-performance compute.</p><a class="more" href="services.html#ai">Learn more →</a></article>
    </div>
  </div>
</section>

<section class="section-dark">
  <div class="container split">
    <div class="reveal">
      <p class="eyebrow">Our locations</p>
      <h2>Four campuses. One connected London platform.</h2>
      <p>Our sites sit in London's key data centre markets — west London's Heathrow corridor, the Slough Trading Estate and north London — each with diverse power and carrier-neutral connectivity.</p>
      <ul class="ticks">
        <li>Stockley Park — London's largest colocation campus</li>
        <li>Slough — inside one of Europe's densest connectivity hubs</li>
        <li>Hayes and Enfield — low-latency access to the City</li>
      </ul>
      <a class="btn" href="data-centres.html">View all locations</a>
    </div>
    <div class="map reveal">${londonMap}</div>
  </div>
</section>

<section class="section-alt">
  <div class="container split">
    <div class="visual reveal">${campusSvg}</div>
    <div class="reveal">
      <p class="eyebrow">Why VIRTUS</p>
      <h2>Engineered for uptime. Run by people who care.</h2>
      <ul class="ticks">
        <li>Concurrently maintainable power and cooling designs</li>
        <li>Carrier-neutral facilities with dozens of network providers</li>
        <li>Multi-layered physical security, staffed 24/7/365</li>
        <li>Remote hands and smart-hands support from on-site engineers</li>
        <li>Backed by ST Telemedia Global Data Centres' global platform</li>
      </ul>
      <a class="btn" href="about.html">About VIRTUS</a>
    </div>
  </div>
</section>

<section>
  <div class="container split">
    <div class="reveal">
      <p class="eyebrow">Sustainability</p>
      <h2>Lower-carbon infrastructure, by design</h2>
      <p>We power our sites with renewable electricity, design for low PUE and work with customers to cut the carbon footprint of their digital estate.</p>
      <a class="btn" href="sustainability.html">Our approach</a>
    </div>
    <div class="cards" style="grid-template-columns:1fr 1fr">
      <article class="card reveal">${icon(ICONS.leaf)}<h3>Renewable power</h3><p>Electricity backed by certified renewable sources.</p></article>
      <article class="card reveal">${icon(ICONS.shield)}<h3>Certified</h3><p>Operating to recognised ISO management standards.</p></article>
    </div>
  </div>
</section>
${ctaBlock("Ready to talk capacity?", "Tell us about your requirements and we'll arrange a tour of the right campus.")}
`,
  },
  {
    file: "data-centres.html",
    title: "Data Centres | VIRTUS London Campuses",
    description: "Explore VIRTUS data centres across Stockley Park, Slough, Hayes and Enfield in London.",
    body: `
${pageHero("Our data centres", "London locations", "Eleven facilities across four campuses, all within easy reach of central London, Heathrow and the M4/M25 fibre routes.")}
<section>
  <div class="container">
    <div class="split" style="margin-bottom:60px">
      <div class="map reveal">${londonMap}</div>
      <div class="reveal">
        <div id="stockley-park"><h3>Stockley Park</h3><p>Around 84MW across LONDON5–8 on a secure campus in Hillingdon — London's largest colocation campus.</p></div>
        <div id="slough"><h3>Slough</h3><p>Around 75MW across five buildings on the Slough Trading Estate, surrounded by dense carrier and cloud ecosystems.</p></div>
        <div id="hayes"><h3>Hayes</h3><p>LONDON2, a west London site well placed for Heathrow and the M4 corridor.</p></div>
        <div id="enfield"><h3>Enfield</h3><p>LONDON1, offering over 11MW in north London with direct routes to the City.</p></div>
      </div>
    </div>
    <div class="section-head">
      <h2>All facilities</h2>
      <p>Filter by campus. Per-building capacity is indicative; speak to us for current availability.</p>
    </div>
    <div class="filters" role="group" aria-label="Filter by campus">
      <button class="filter" data-region="All" aria-pressed="true">All</button>
      <button class="filter" data-region="Stockley Park" aria-pressed="false">Stockley Park</button>
      <button class="filter" data-region="Slough" aria-pressed="false">Slough</button>
      <button class="filter" data-region="Hayes" aria-pressed="false">Hayes</button>
      <button class="filter" data-region="Enfield" aria-pressed="false">Enfield</button>
    </div>
    <div class="campus-grid" id="campus-grid" aria-live="polite"></div>
  </div>
</section>
${ctaBlock("See a site for yourself", "We run guided tours of every campus — book one with our sales team.")}
`,
  },
  {
    file: "services.html",
    title: "Services | VIRTUS Data Centres",
    description: "Colocation, hyperscale and high-density AI data centre services from VIRTUS in London.",
    body: `
${pageHero("Services", "From one rack to a whole building", "Flexible data centre solutions that grow with your business, backed by expert engineers on site 24/7.")}
<section id="colocation">
  <div class="container split">
    <div class="reveal">
      <p class="eyebrow">Colocation</p>
      <h2>Space, power and support on your terms</h2>
      <p>Deploy in individual racks, secure cages or private suites. Choose the power density you need today and scale as you grow.</p>
      <ul class="ticks"><li>Single racks to private suites</li><li>Flexible power density per rack</li><li>Carrier-neutral cross-connects</li><li>24/7 remote hands</li></ul>
    </div>
    <div class="visual reveal">${campusSvg}</div>
  </div>
</section>
<section id="hyperscale" class="section-alt">
  <div class="container split">
    <div class="visual reveal">${campusSvg}</div>
    <div class="reveal">
      <p class="eyebrow">Hyperscale</p>
      <h2>Build-to-suit capacity at scale</h2>
      <p>Dedicated data halls and whole buildings, designed with you and delivered on programme for multi-megawatt cloud deployments.</p>
      <ul class="ticks"><li>Dedicated halls and buildings</li><li>Custom design and build</li><li>Clear expansion roadmap on each campus</li></ul>
    </div>
  </div>
</section>
<section id="ai">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">AI &amp; high density</p>
      <h2>Ready for the AI era</h2>
      <p>GPU clusters demand more power and new cooling. Our newest halls are built to support them.</p>
    </div>
    <div class="cards">
      <article class="card reveal">${icon(ICONS.chip)}<h3>High-density racks</h3><p>Power densities well beyond traditional enterprise loads.</p></article>
      <article class="card reveal">${icon(ICONS.bolt)}<h3>Liquid cooling ready</h3><p>Infrastructure prepared for direct-to-chip and rear-door cooling.</p></article>
      <article class="card reveal">${icon(ICONS.link)}<h3>Low-latency fabric</h3><p>Diverse fibre and on-ramps to major cloud providers.</p></article>
    </div>
  </div>
</section>
<section class="section-dark">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Connectivity &amp; support</p><h2>Everything around the rack</h2></div>
    <div class="cards">
      <article class="card reveal" style="background:#121c30;border-color:#22304d">${icon(ICONS.link)}<h3>Connectivity</h3><p>Carrier-neutral meet-me rooms, cloud on-ramps and campus-wide dark fibre.</p></article>
      <article class="card reveal" style="background:#121c30;border-color:#22304d">${icon(ICONS.tool)}<h3>Remote hands</h3><p>On-site engineers for installs, reboots, audits and cabling.</p></article>
      <article class="card reveal" style="background:#121c30;border-color:#22304d">${icon(ICONS.shield)}<h3>Security</h3><p>Perimeter fencing, CCTV, biometric access and 24/7 guarding.</p></article>
    </div>
  </div>
</section>
${ctaBlock("Let's design your deployment", "Share your power, space and timeline requirements and we'll come back with options.")}
`,
  },
  {
    file: "sustainability.html",
    title: "Sustainability | VIRTUS Data Centres",
    description: "How VIRTUS reduces the environmental impact of its London data centres.",
    body: `
${pageHero("Sustainability", "Responsible growth for a digital economy", "Data centres power modern life. We're committed to building and running them in a way that respects the planet and our communities.")}
<section>
  <div class="container">
    <div class="cards">
      <article class="card reveal">${icon(ICONS.leaf)}<h3>Renewable energy</h3><p>Our facilities are supplied with electricity from certified renewable sources.</p></article>
      <article class="card reveal">${icon(ICONS.bolt)}<h3>Efficient design</h3><p>Free cooling, efficient UPS systems and hot/cold aisle containment drive down PUE.</p></article>
      <article class="card reveal">${icon(ICONS.people)}<h3>Community</h3><p>We invest in local skills, apprenticeships and STEM outreach around our campuses.</p></article>
    </div>
  </div>
</section>
<section class="section-alt">
  <div class="container split">
    <div class="reveal">
      <p class="eyebrow">Standards</p>
      <h2>Managed to recognised standards</h2>
      <p>Our operations are run under internationally recognised management systems covering quality, environment, energy and information security.</p>
      <div class="certs"><span class="cert">ISO 9001</span><span class="cert">ISO 14001</span><span class="cert">ISO 27001</span><span class="cert">ISO 50001</span><span class="cert">ISO 45001</span></div>
    </div>
    <div class="visual reveal">${campusSvg}</div>
  </div>
</section>
${ctaBlock("Reduce your digital footprint", "Ask us how a move to VIRTUS can lower the carbon impact of your IT estate.")}
`,
  },
  {
    file: "about.html",
    title: "About | VIRTUS Data Centres",
    description: "VIRTUS is a London data centre provider and part of ST Telemedia Global Data Centres.",
    body: `
${pageHero("About us", "London's data centre specialists", "VIRTUS designs, builds and operates data centres for the world's leading cloud, enterprise and AI companies.")}
<section>
  <div class="container split">
    <div class="reveal">
      <h2>Our story</h2>
      <p>VIRTUS was founded to bring flexible, efficient data centre capacity to London. Since then it has grown into one of the capital's largest providers, operating eleven facilities across four campuses.</p>
      <p>In 2017 VIRTUS became a wholly owned part of ST Telemedia Global Data Centres (STT GDC), one of the world's fastest-growing data centre operators, giving customers access to an international platform with a London focus.</p>
    </div>
    <div class="stats" style="margin-top:0;grid-template-columns:1fr 1fr">
      <div class="stat"><strong>11</strong><span>Data centres</span></div>
      <div class="stat"><strong>4</strong><span>London campuses</span></div>
      <div class="stat"><strong>175MW+</strong><span>Capacity</span></div>
      <div class="stat"><strong>24/7</strong><span>On-site teams</span></div>
    </div>
  </div>
</section>
<section class="section-alt">
  <div class="container">
    <div class="section-head reveal"><h2>Our values</h2></div>
    <div class="cards">
      <article class="card reveal">${icon(ICONS.shield)}<h3>Reliable</h3><p>We keep critical infrastructure running, every hour of every day.</p></article>
      <article class="card reveal">${icon(ICONS.people)}<h3>Partnership</h3><p>We work alongside customers as an extension of their team.</p></article>
      <article class="card reveal">${icon(ICONS.leaf)}<h3>Responsible</h3><p>We grow in a way that's good for customers, people and planet.</p></article>
    </div>
  </div>
</section>
${ctaBlock("Join us", "We're always looking for talented people to help run London's data centres.")}
`,
  },
  {
    file: "contact.html",
    title: "Contact | VIRTUS Data Centres",
    description: "Contact the VIRTUS team about data centre capacity in London or book a site tour.",
    body: `
${pageHero("Contact", "Let's talk", "Tell us what you need and the right person will get back to you within one working day.")}
<section>
  <div class="container split" style="align-items:start">
    <form class="contact reveal" novalidate>
      <div class="form-row">
        <div class="field"><label for="name">Full name *</label><input id="name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="company">Company *</label><input id="company" name="company" autocomplete="organization" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="email">Work email *</label><input id="email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
      </div>
      <div class="field"><label for="interest">I'm interested in</label>
        <select id="interest" name="interest"><option>Colocation</option><option>Hyperscale</option><option>AI &amp; high density</option><option>A site tour</option><option>Something else</option></select>
      </div>
      <div class="field"><label for="message">Message *</label><textarea id="message" name="message" rows="5" required></textarea></div>
      <div><button class="btn" type="submit">Send enquiry</button></div>
      <p class="form-status" role="status"></p>
    </form>
    <div class="reveal">
      <h3>Sales</h3><p>Questions about capacity, pricing or a site tour.</p>
      <h3>Customer support</h3><p>Existing customers can reach the 24/7 service desk through the customer portal.</p>
      <h3>Campuses</h3><p>Stockley Park · Slough · Hayes · Enfield</p>
    </div>
  </div>
</section>
`,
  },
];

for (const p of pages) writeFileSync(join(root, p.file), page(p));
console.log(`Built ${pages.length} pages`);
