/* ===== NAV ACTIVE STATE ===== */

// Kuhaon nato tanan nav links sa page
const navLinks = document.querySelectorAll(".nav-link");

// Lista sa tanan sections nga i-observe nato
const sectionIds = [
  "home",
  "about-section",
  "skills-section",
  "projects-section",
  "contact-section",
];

// Kung mu-click ka sa nav, tanggalon ang active sa uban
// tapos ibutang sa gi-click nga link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// Kini ang IntersectionObserver — naga-bantay kung unsang section
// ang currently visible sa screen
// Automatically mag-highlight ang nav link kung ang section na-enter sa view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Kung ang section visible na sa screen
      if (entry.isIntersecting) {
        const id = entry.target.id; // kuhaon ang id sa visible section

        navLinks.forEach((link) => {
          // Tan-awon kung ang href sa nav link nag-match sa section id
          const href = link.getAttribute("href");
          const linkTarget = href.includes("#") ? href.split("#")[1] : "";

          if (linkTarget === id) {
            // Tanggalon ang active sa tanan, tapos ibutang sa nag-match
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    // Mag-trigger ang observer kung ang section
    // naa na sa middle area sa screen (dili pa puro top or bottom)
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0,
  },
);

// I-observe nato tanan sections nga listed sa sectionIds
sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el); // kung naa ang element, bantayan nato siya
});

/* ===== FETCH SECTIONS FROM SEPARATE HTML FILES ===== */

// Lista sa tanan HTML files nga i-load nato inside sa index.html
// Para dili na nato tanan i-type sa usa ka file, separate sila
const pages = [
  { id: "about-section", file: "about.html" },
  { id: "skills-section", file: "skills.html" },
  { id: "projects-section", file: "projects.html" },
  { id: "contact-section", file: "contact.html" },
];

pages.forEach((page) => {
  // Fetch — para ma-load ang sulod sa separate HTML file
  fetch(page.file)
    .then((res) => {
      // Kung dili successful ang pag-load, throw error
      if (!res.ok) throw new Error("Network response was not ok");
      return res.text(); // i-convert ang response to text/html
    })
    .then((html) => {
      // I-parse ang fetched HTML para ma-manipulate nato siya
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Tanggalon ang nav sa fetched file para dili mag-duplicate ang navbar
      const nav = doc.querySelector("nav");
      if (nav) nav.remove();

      // Tanggalon sad ang footer para dili mag-duplicate
      const footer = doc.querySelector("footer");
      if (footer) footer.remove();

      // Kuhaon ang sulod sa body sa fetched file
      const content = doc.body.innerHTML;

      // Ibutang ang content sa target section sa index.html
      const targetElement = document.getElementById(page.id);
      if (targetElement) {
        targetElement.innerHTML = content;

        // I-observe sad ang bag-ong na-inject nga section
        // para ma-track sa IntersectionObserver
        const injectedSection = targetElement.querySelector("section");
        if (injectedSection) observer.observe(injectedSection);
      }
    })
    .catch((error) => {
      // Kung nay error sa pag-fetch, ipakita sa console
      console.error(`Error loading ${page.file} into ${page.id}:`, error);
      // Reminder nga kinahanglan Live Server, dili file:// protocol
      console.warn(
        "Hint: Use Live Server in VS Code. Fetching won't work on file:// protocol.",
      );
    });
});
