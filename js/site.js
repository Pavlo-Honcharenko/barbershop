/* Vanilla JS replacement for the React runtime — mirrors the original 5 behaviours:
   mobile menu, header-on-scroll, smooth-scroll nav, scroll-reveal, contact form. */
(function () {
  "use strict";

  /* 1. Mobile menu */
  var MENU_TRANSITION_MS = 250; /* must match .mobile-menu transition duration in main.css */
  var menuToggle = document.getElementById("mobile-menu-toggle");
  var menu = document.getElementById("mobile-menu");
  var menuCloseTimer = null;

  function openMenu() {
    clearTimeout(menuCloseTimer);
    menu.hidden = false;
    void menu.offsetWidth; /* force reflow so the opening transition runs */
    menu.classList.add("mobile-menu--open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
  }

  function closeMenu() {
    menu.classList.remove("mobile-menu--open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    clearTimeout(menuCloseTimer);
    menuCloseTimer = setTimeout(function () {
      menu.hidden = true;
    }, MENU_TRANSITION_MS);
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
      if (menu.classList.contains("mobile-menu--open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  /* 2. Header background on scroll */
  var header = document.querySelector("header");
  if (header) {
    var onHeaderScroll = function () {
      header.classList.toggle("header--scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  /* 3. Smooth-scroll navigation (nav links, all Book Now / CTA buttons) */
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-scroll]");
    if (!trigger) return;
    var target = document.querySelector(trigger.getAttribute("data-scroll"));
    if (!target) return;
    if (menu && menu.classList.contains("mobile-menu--open")) {
      closeMenu();
    }
    target.scrollIntoView({ behavior: "smooth" });
  });

  /* 4. Scroll-reveal (replaces Framer Motion whileInView, viewport:{once:true}) */
  var eagerTargets = document.querySelectorAll(".reveal--eager");
  eagerTargets.forEach(function (el) {
    requestAnimationFrame(function () { el.classList.add("is-visible"); });
  });

  var revealTargets = document.querySelectorAll(".reveal:not(.reveal--eager), .reveal-x:not(.reveal--eager)");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 5. Contact form */
  var form = document.querySelector("#contact form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      if (data.get("_gotcha")) return;

      var submitBtn = form.querySelector('button[type="submit"]');
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var message = String(data.get("message") || "").trim();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      fetch("/api/contact/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: {
            messages_attributes: [{ body: message || "New contact form submission" }],
            data: { __gd_contact_form_title: "Contact 519 Barbershop", Phone: phone }
          },
          user: { email: email, name: name }
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (result) {
          if (result && result.success) {
            form.reset();
            if (submitBtn) submitBtn.textContent = "Message sent";
          } else {
            throw new Error("Request failed");
          }
        })
        .catch(function () {
          if (submitBtn) submitBtn.textContent = "Something went wrong";
        })
        .finally(function () {
          if (submitBtn) {
            setTimeout(function () {
              submitBtn.disabled = false;
              submitBtn.textContent = "Send Message";
            }, 2500);
          }
        });
    });
  }

  /* 6. Hero backdrop height sync — no scroll listener, the parallax is position:fixed itself */
  const hero = document.querySelector(".hero");
  const heroBackdrop = document.querySelector(".hero-backdrop");

  if (hero && heroBackdrop) {
    /* Keeps the backdrop exactly as tall as the hero, so it never under- or overshoots it. */
    const syncBackdropHeight = function () {
      heroBackdrop.style.setProperty("--hero-backdrop-height", `${hero.offsetHeight}px`);
    };

    syncBackdropHeight();
    window.addEventListener("resize", syncBackdropHeight, { passive: true });
    window.addEventListener("orientationchange", syncBackdropHeight, { passive: true });

    if ("ResizeObserver" in window) {
      new ResizeObserver(syncBackdropHeight).observe(hero);
    }
  }
})();
