/* Vanilla JS replacement for the React runtime — mirrors the original 5 behaviours:
   mobile menu, header-on-scroll, smooth-scroll nav, scroll-reveal, contact form. */
(function () {
  "use strict";

  /* 1. Mobile menu */
  var menuToggle = document.getElementById("mobile-menu-toggle");
  var menu = document.getElementById("mobile-menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
      var willOpen = menu.hidden;
      menu.hidden = !willOpen;
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.setAttribute("aria-label", willOpen ? "Close menu" : "Open menu");
    });
  }

  /* 2. Header background on scroll */
  var header = document.querySelector("header");
  if (header) {
    var onHeaderScroll = function () {
      var scrolled = window.scrollY > 20;
      header.classList.toggle("bg-white", !scrolled);
      header.classList.toggle("bg-white/95", scrolled);
      header.classList.toggle("backdrop-blur-sm", scrolled);
      header.classList.toggle("shadow-sm", scrolled);
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
    if (menu && !menu.hidden) {
      menu.hidden = true;
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      }
    }
    target.scrollIntoView({ behavior: "smooth" });
  });

  /* 4. Scroll-reveal (replaces Framer Motion whileInView, viewport:{once:true}) */
  var revealTargets = document.querySelectorAll(".reveal, .reveal-x");
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
})();
