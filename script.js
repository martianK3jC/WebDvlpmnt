// ===== NAV ACTIVE STATE =====

const navLinks = document.querySelectorAll(".nav-link");

// Map each nav link to its target section ID
const sectionIds = ["home", "about-section", "skills-section", "projects-section", "contact-section"];

// --- 1. On CLICK: set active immediately ---
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// --- 2. On SCROLL: update active based on which section is in view ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          // Match both "#id" and "index.html#id" formats
          const linkTarget = href.includes("#") ? href.split("#")[1] : "";
          if (linkTarget === id) {
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    // Trigger when section crosses the top 30% of the viewport
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0,
  }
);

// Observe all relevant sections
sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

// ===== FETCH SECTIONS FROM SEPARATE HTML FILES =====

const pages = [
  { id: "about-section", file: "about.html" },
  { id: "skills-section", file: "skills.html" },
  { id: "projects-section", file: "projects.html" },
  { id: "contact-section", file: "contact.html" },
];

pages.forEach((page) => {
  fetch(page.file)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.text();
    })
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      // Grab everything inside the body, but skip the injected <nav>
      // (we don't want a second nav appearing inside each fetched section)
      const nav = doc.querySelector("nav");
      if (nav) nav.remove();
      const content = doc.body.innerHTML;
      const targetElement = document.getElementById(page.id);
      if (targetElement) {
        targetElement.innerHTML = content;
        // Re-observe the newly injected section for scroll tracking
        const injectedSection = targetElement.querySelector("section");
        if (injectedSection) observer.observe(injectedSection);
      }
    })
    .catch((error) => {
      console.error(`Error loading ${page.file} into ${page.id}:`, error);
      console.warn("Hint: Use Live Server in VS Code. Fetching won't work on file:// protocol.");
    });
});
