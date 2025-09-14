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

  // Switch book images if book exists
  document.querySelectorAll(".book-pages .page").forEach(page => {
    const lightImg = page.querySelector(".light");
    const darkImg = page.querySelector(".dark");
    if (lightImg && darkImg) {
      if (document.body.classList.contains("light")) {
        lightImg.style.display = "block";
        darkImg.style.display = "none";
      } else {
        lightImg.style.display = "none";
        darkImg.style.display = "block";
      }
    }
  });

  // Also toggle book cover images
  const coverLight = document.querySelector(".book-front .light");
  const coverDark = document.querySelector(".book-front .dark");
  if (coverLight && coverDark) {
    if (document.body.classList.contains("light")) {
      coverLight.style.display = "block";
      coverDark.style.display = "none";
    } else {
      coverLight.style.display = "none";
      coverDark.style.display = "block";
    }
  }
  setAboutVideoSource();
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
  rootMargin: "-50% 0px -50% 0px",
  threshold: 0
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute("id");
    navLinks.forEach(link => link.classList.remove("active"));
    if (entry.isIntersecting) {
      const activeLink = document.querySelector(
        `.nav-links li a[href="#${id}"]`
      ).parentElement;
      activeLink.classList.add("active");
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));
window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => link.classList.remove("active"));
  if (current) {
    const activeLink = document.querySelector(`.nav-links li a[href="#${current}"]`).parentElement;
    activeLink.classList.add("active");
  }
});


// === Smooth Scroll on Click ===
navLinks.forEach(link => {
  const anchor = link.querySelector("a");
  anchor.addEventListener("click", e => {
    e.preventDefault();
    const targetId = anchor.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    const navHeight = document.querySelector(".navbar").offsetHeight; // fixed navbar height
    const offset = targetSection.offsetTop - navHeight - 25; // extra gap

    window.scrollTo({
      top: offset,
      behavior: "smooth"
    });

    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});


// === Toolkit Central Button ===
const toolkitBtn = document.getElementById("toolkitToggle");
const toolkitContainer = document.querySelector(".toolkit-container");
const toolkitIcons = document.querySelectorAll(".toolkit-icons button");
const toolkitPages = document.querySelectorAll(".toolkit-page");

toolkitBtn.addEventListener("click", () => {
  toolkitContainer.classList.toggle("active");
  toolkitBtn.classList.toggle("active");

  // 🔹 If toolkit closes, close all chapter pages too
  if (!toolkitContainer.classList.contains("active")) {
    toolkitPages.forEach(page =>
      page.classList.remove("active", "fullscreen")
    );

    // 🔹 Also remove active state from all icons
    toolkitIcons.forEach(icon =>
      icon.classList.remove("active")
    );
  }
});


// === Toolkit Button Hover Effect ===
toolkitBtn.addEventListener("mousemove", e => {
  const rect = toolkitBtn.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  toolkitBtn.style.setProperty("--x", `${x}%`);
  toolkitBtn.style.setProperty("--y", `${y}%`);
});

toolkitBtn.addEventListener("click", () => {
  const text = toolkitBtn.querySelector(".view-more");
  if (toolkitBtn.classList.contains("active")) {
    text.textContent = "Click icons to explore";
  } else {
    text.textContent = "Click to View more";
  }
});

// === Toolkit Icon Click → Open Chapter (robust transition) ===
let isAnimating = false;

toolkitIcons.forEach(icon => {
  icon.addEventListener("click", async () => {
    if (isAnimating) return;                // prevent re-entry during animation
    isAnimating = true;

    const targetId = icon.getAttribute("data-page");
    const targetPage = document.getElementById(targetId);
    if (!targetPage) { isAnimating = false; return; }

    // if clicked page already active, bail
    if (targetPage.classList.contains("active")) {
      isAnimating = false;
      return;
    }

    const currentPage = document.querySelector(".toolkit-page.active");

    // helper: wait for transitionend (with timeout fallback)
    const waitTransition = (el, timeout = 800) => new Promise(resolve => {
      if (!el) return resolve();
      let done = false;
      const onEnd = (e) => {
        if (e.target !== el) return;
        if (done) return;
        done = true;
        el.removeEventListener("transitionend", onEnd);
        clearTimeout(timer);
        resolve();
      };
      el.addEventListener("transitionend", onEnd);
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        el.removeEventListener("transitionend", onEnd);
        resolve();
      }, timeout);
    });

    // hide currently open page (if any)
    if (currentPage) {
      // remove active -> triggers CSS transform to "hidden" state
      currentPage.classList.remove("active");

      // force reflow so the browser applies the change and the transition runs
      void currentPage.offsetWidth;

      // add fade-out class (your CSS handles transform & rotation)
      currentPage.classList.add("fade-out");

      // wait for its transition to finish (or fallback)
      await waitTransition(currentPage);

      // hide after animation
      currentPage.style.display = "none";
      currentPage.classList.remove("fade-out");
    }

    // show target page
    // make sure it's rendered first
    targetPage.style.display = "block";

    // ensure it starts from baseline (no stale classes)
    targetPage.classList.remove("fade-out");

    // force reflow again
    void targetPage.offsetWidth;

    // add active to trigger CSS transition into visible state
    targetPage.classList.add("active");

    // wait for show transition to complete (optional)
    await waitTransition(targetPage);

    // update icon states
    toolkitIcons.forEach(btn => btn.classList.remove("active"));
    icon.classList.add("active");
    // scroll page so icon & indicator are visible
scrollPageToIcon(icon);

    isAnimating = false;
  });
});
// === Scroll page so icon & page are visible ===
function scrollPageToIcon(icon, marginBottom = 200) {
  if (!icon) return;

  // Slight delay to ensure page is rendered
  setTimeout(() => {
    const rect = icon.getBoundingClientRect();
    const scrollY = window.scrollY + rect.top - 190; // px from top
    const maxScroll = document.body.scrollHeight - window.innerHeight + marginBottom;

    window.scrollTo({
      top: Math.min(scrollY, maxScroll),
      behavior: "smooth"
    });
  }, 5);
}


document.addEventListener("DOMContentLoaded", () => {
  const toolkitBtn = document.querySelector(".toolkit-btn");

  toolkitBtn.addEventListener("click", () => {
    const rect = toolkitBtn.getBoundingClientRect();
    const offset = window.scrollY + rect.top; // button’s position on the page
    const centerY = window.innerHeight / 2 - rect.height / 2; // center of screen

    window.scrollTo({
      top: offset - centerY,
      behavior: "smooth"
    });
  });
});


// === Close Button on Chapter Pages ===
document.querySelectorAll(".close-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.closest(".toolkit-page");
    page.classList.remove("active", "fullscreen");
  });
});
function showPage(pageId) {
  const pages = document.querySelectorAll('.toolkit-page');

  pages.forEach(page => {
    if (page.classList.contains('active')) {
      // fade out current
      page.classList.remove('active');
      // wait for transition to finish before hiding
      page.addEventListener('transitionend', function handler() {
        page.style.display = 'none';
        page.removeEventListener('transitionend', handler);
      });
    }
  });

  // show new page
  const newPage = document.getElementById(pageId);
  newPage.style.display = 'block'; // make it render first
  requestAnimationFrame(() => {   // next frame: trigger transition
    newPage.classList.add('active');
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const hireButtons = document.querySelectorAll(".explore-btn");

  hireButtons.forEach(btn => {
    const modalId = btn.dataset.modal;
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const closeBtn = modal.querySelector(".modal-close");
    const track = modal.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const prevBtn = modal.querySelector(".carousel-btn.prev");
    const nextBtn = modal.querySelector(".carousel-btn.next");
    const infoBtn = modal.querySelector(".info-btn");
    const explanation = modal.querySelector(".explanation-card");

    let currentIndex = 0;
    const totalSlides = slides.length;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      setupCarousel();
      updateExplanation();
    });

    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });

    function setupCarousel() {
      slides.forEach(slide => {
        slide.style.position = "absolute";
        slide.style.top = "0";
        slide.style.left = "50%";
        slide.style.transform = "translateX(-50%) scale(0.8)";
        slide.style.transition = "transform 0.5s ease, opacity 0.5s ease";
        slide.style.opacity = "0.5";
        slide.style.zIndex = "1";
      });
      updateCarousel();
    }

    function updateCarousel() {
      slides.forEach((slide, index) => {
        if (index === currentIndex) {
          slide.style.transform = "translateX(-50%) scale(1)";
          slide.style.opacity = "1";
          slide.style.zIndex = "3";
        } else if (index === (currentIndex - 1 + totalSlides) % totalSlides) {
          slide.style.transform = "translateX(-120%) scale(0.8)";
          slide.style.opacity = "0.6";
          slide.style.zIndex = "2";
        } else if (index === (currentIndex + 1) % totalSlides) {
          slide.style.transform = "translateX(20%) scale(0.8)";
          slide.style.opacity = "0.6";
          slide.style.zIndex = "2";
        } else {
          slide.style.transform = "translateX(-50%) scale(0.6)";
          slide.style.opacity = "0.3";
          slide.style.zIndex = "0";
        }
      });
      updateExplanation();
    }

    prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
    updateExplanation("left");  // ⬅️ swipe left
  });

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
    updateExplanation("right"); // ➡️ swipe right
  });

  infoBtn?.addEventListener("click", () => {
  explanation.classList.toggle("active");
  });
      
    function updateExplanation(direction = "right") {
    const activeSlide = slides[currentIndex];
    const text = (activeSlide.dataset.explanation || "").replace(/\\n/g, "<br>");

    // always clear out previous content first
    explanation.innerHTML = "";

    // create fresh content
    const newContent = document.createElement("div");
    newContent.className = `content enter-${direction}`;
    newContent.innerHTML = text;
    explanation.appendChild(newContent);

    // trigger animation
    requestAnimationFrame(() => {
      newContent.classList.add("active");
    });
  }
  });

  // Explore buttons open URL
  document.querySelectorAll(".live-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const url = btn.dataset.url;
      if (url) window.open(url, "_blank");
    });
  });
});


const box = document.querySelector('.explanation-card');
const slide = document.querySelector('.carousel-slide');

const raw = slide.dataset.explanation || '';
// turn the literal "\n" into actual newlines
const withNewlines = raw.replace(/\\n/g, '\n').trim();

box.textContent = withNewlines; // keep it safe; CSS will render the breaks



document.addEventListener("DOMContentLoaded", () => {
  const aboutVideo = document.getElementById("aboutVideo");

  function setAboutVideoSource() {
    const isDark = document.body.classList.contains("dark");
    const newSrc = isDark ? "about-dark.mp4" : "about-light.mp4";
    const newPoster = isDark ? "about-dark.png" : "about-light.png";

    // Set poster first so blank never shows
    aboutVideo.setAttribute("poster", newPoster);

    if (aboutVideo.getAttribute("src") !== newSrc) {
      aboutVideo.src = newSrc;
      aboutVideo.load();

      aboutVideo.addEventListener("loadeddata", () => {
        aboutVideo.currentTime = 0;
        aboutVideo.play().catch(err => {
          console.log("Autoplay blocked:", err);
        });
      }, { once: true });
    }
  }

  // Run once on load
  setAboutVideoSource();

  // Theme toggle → update video + poster
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTimeout(setAboutVideoSource, 70);
    });
  }

  // IntersectionObserver: play/pause based on visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutVideo.play().catch(() => {});
      } else {
        aboutVideo.pause();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(aboutVideo);
});

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const status = document.getElementById("status");

  emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
    .then(() => {
      status.textContent = "Message sent successfully!";
      status.className = "show success"; // 👈 green
      this.reset();
    }, (err) => {
      status.textContent = "Failed to send. Try again.";
      status.className = "show error"; // 👈 red
      console.error(err);
    });
});

(function(){
    emailjs.init("7v5aIkjkb7FKJc4qR"); // public key / user id
  })();

  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("status");

  form.addEventListener("submit", function(e) {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  // Add spinner + text
  submitBtn.innerHTML = `<span class="spinner"></span> Sending...`;

  emailjs.sendForm("service_lmyko7r", "template_nfr3omg", this)
    .then(function() {
      statusEl.textContent = "Message sent! Thanks — I'll reply soon.";
      statusEl.className = "show success";
      form.reset();
    }, function(error) {
      console.error("EmailJS error:", error);
      statusEl.textContent = "Failed to send. Please try again.";
      statusEl.className = "show error";
    })
    .finally(function() {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message"; // Reset button text
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".footer");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        footer.classList.add("visible");
      }
    });
  });
  observer.observe(footer);
});

