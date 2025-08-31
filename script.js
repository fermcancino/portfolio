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

// === Hamburger Menu ===
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links li");

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

// === Sections & Active Underline ===
const sections = document.querySelectorAll("section");

const observerOptions = {
  root: null,
  rootMargin: "-50% 0px -50% 0px", // trigger near center of viewport
  threshold: 0
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute("id");
    navLinks.forEach(link => link.classList.remove("active"));
    if (entry.isIntersecting) {
      const activeLink = document.querySelector(`.nav-links li a[href="#${id}"]`).parentElement;
      activeLink.classList.add("active");
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// === Smooth Scroll on Click ===
navLinks.forEach(link => {
  const anchor = link.querySelector("a");
  anchor.addEventListener("click", e => {
    e.preventDefault();
    const targetId = anchor.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    targetSection.scrollIntoView({ behavior: "smooth" });

    // Immediately set active link
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

const toolkitToggle = document.getElementById("toolkitToggle");
const toolkitContainer = document.querySelector(".toolkit-container");

toolkitToggle.addEventListener("click", (e) => {
  e.preventDefault();
  toolkitContainer.classList.toggle("active");
  toolkitToggle.classList.toggle("active");
});

const btn = document.querySelector(".toolkit-btn");

btn.addEventListener("mousemove", e => {
  const rect = btn.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  btn.style.setProperty("--x", `${x}%`);
  btn.style.setProperty("--y", `${y}%`);
});
const icons = document.querySelectorAll(".toolkit-icons a");
const pages = document.querySelectorAll(".toolkit-page");

icons.forEach(icon => {
  icon.addEventListener("click", e => {
    e.preventDefault();
    const targetId = icon.getAttribute("data-page");

    // Remove active class from all pages
    pages.forEach(p => p.classList.remove("active"));

    // Activate the clicked page
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    // Scroll smoothly to the pages container
    document.querySelector(".toolkit-pages").scrollIntoView({
      behavior: "smooth"
    });
  });
});
