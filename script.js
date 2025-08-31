// === Smooth Scroll + Fade ===
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links li a");
const navItems = document.querySelectorAll(".nav-links li");

// Smooth scroll + fade
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    target.scrollIntoView({ behavior: "smooth" });

    sections.forEach(sec => sec.classList.remove("active"));
    setTimeout(() => {
      target.classList.add("active");
      revealOnScroll(); // trigger fade immediately
    }, 300);
  });
});

// Activate first section
if (sections.length > 0) {
  sections[0].classList.add("active");
}

// === Theme Toggle ===
const themeToggle = document.getElementById("themeToggle");
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  if (document.body.classList.contains("dark")) {
    iconSun.style.display = "none";
    iconMoon.style.display = "block";
    themeToggle.setAttribute("title", "Light Mode");
  } else {
    iconSun.style.display = "block";
    iconMoon.style.display = "none";
    themeToggle.setAttribute("title", "Dark Mode");
  }
});

// === Scroll Spy + section fade activation ===
window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
      section.classList.add("active");
    }
  });

  navItems.forEach(li => {
    li.classList.remove("active");
    const link = li.querySelector("a");
    if (link.getAttribute("href").includes(current)) {
      li.classList.add("active");
    }
  });

  revealOnScroll(); // ensure fade triggers while scrolling
});

// Reveal elements when in viewport
const fadeElements = document.querySelectorAll(".fade-element");

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  const isMobile = window.innerWidth <= 768;

  fadeElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      if (isMobile) {
        el.classList.add("show-vertical");
      } else {
        el.classList.add("show");
      }
    } else {
      el.classList.remove("show", "show-vertical");
    }
  });
}

// Call on scroll and load
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Force Home section to animate on page load
window.addEventListener("load", () => {
  const homeText = document.querySelector(".home-text");
  const homeImage = document.querySelector(".home-image");
  if (window.innerWidth <= 768) {
    homeText.classList.add("show-vertical");
    homeImage.classList.add("show-vertical");
  } else {
    homeText.classList.add("show");
    homeImage.classList.add("show");
  }
});

// === Hamburger Menu ===
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-links");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("show");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");
      menuToggle.classList.remove("active");
    });
  });
}

// === Active Link Highlight for Social Links (.list) ===
const list = document.querySelectorAll('.list');
function activeLink() {
  list.forEach(item => item.classList.remove('active'));
  this.classList.add('active');
}
list.forEach(item => item.addEventListener('click', activeLink));

const skillCards = document.querySelectorAll(".skills-container .skill-card");

function revealSkills() {
  const trigger = window.innerHeight * 0.85;
  skillCards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < trigger) card.classList.add("show");
    else card.classList.remove("show");
  });
}

