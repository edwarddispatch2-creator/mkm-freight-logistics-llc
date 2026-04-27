// MKM Freight Logistics LLC — Main Script
// Vanilla JavaScript, no frameworks, no dependencies

(() => {
  // ---- Hamburger Menu ----
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navMobile = document.getElementById("nav-mobile");

  if (hamburgerBtn && navMobile) {
    hamburgerBtn.addEventListener("click", () => {
      const isOpen = navMobile.classList.contains("open");
      navMobile.classList.toggle("open");
      hamburgerBtn.classList.toggle("open");
      hamburgerBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });

    // Close mobile menu when a nav link is clicked
    for (const link of navMobile.querySelectorAll(".nav-link")) {
      link.addEventListener("click", () => {
        navMobile.classList.remove("open");
        hamburgerBtn.classList.remove("open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      });
    }
  }

  // ---- Smooth Scroll for Anchor Links ----
  for (const anchor of document.querySelectorAll('a[href^="#"]')) {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const header = document.getElementById("site-header");
        const headerHeight = header ? header.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    });
  }

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll(".faq-item");
  for (const item of faqItems) {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        // Close all other items
        for (const other of faqItems) {
          if (other !== item) {
            other.classList.remove("open");
            const q = other.querySelector(".faq-question");
            if (q) q.setAttribute("aria-expanded", "false");
          }
        }
        // Toggle current item
        item.classList.toggle("open", !isOpen);
        question.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    }
  }

  // ---- Scroll-to-Top Button ----
  const scrollTopBtn = document.getElementById("scroll-top-btn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }, { passive: true });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- Active Nav Link via IntersectionObserver ----
  const sections = document.querySelectorAll("section[id]");
  const desktopLinks = document.querySelectorAll(".nav-desktop .nav-link");
  const mobileNavLinks = document.querySelectorAll(".nav-mobile .nav-link");

  const setActiveLink = (id) => {
    const allLinks = [...desktopLinks, ...mobileNavLinks];
    for (const link of allLinks) {
      const href = link.getAttribute("href");
      if (href === `#${id}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    }
  };

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-60px 0px -60% 0px",
        threshold: 0,
      }
    );
    for (const section of sections) {
      sectionObserver.observe(section);
    }
  }

  // ---- Contact Form Submit ----
  const contactForm = document.getElementById("contact-form");
  const formFieldsDiv = document.getElementById("form-fields");
  const formSuccessDiv = document.getElementById("form-success");
  const formError = document.getElementById("form-error");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Clear previous errors
      if (formError) formError.textContent = "";

      // Validate required fields
      const requiredFields = contactForm.querySelectorAll("[required]");
      let firstInvalid = null;

      for (const field of requiredFields) {
        field.style.borderColor = "";
      }

      for (const field of requiredFields) {
        const value = field.value.trim();
        if (!value) {
          field.style.borderColor = "#e05a4a";
          if (!firstInvalid) firstInvalid = field;
        }
      }

      // Email format check
      const emailField = contactForm.querySelector('[type="email"]');
      const emailValue = emailField?.value.trim();
      if (emailValue) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailValue) && emailField) {
          emailField.style.borderColor = "#e05a4a";
          if (!firstInvalid) firstInvalid = emailField;
        }
      }

      if (firstInvalid) {
        if (formError) {
          formError.textContent = "Please fill in all required fields correctly.";
        }
        firstInvalid?.focus();
        return;
      }

      // Show success
      if (formFieldsDiv) formFieldsDiv.style.display = "none";
      if (formSuccessDiv) formSuccessDiv.classList.add("visible");
    });

    // Clear error styling on input
    for (const field of contactForm.querySelectorAll("input, select")) {
      field.addEventListener("input", () => {
        field.style.borderColor = "";
        if (formError) formError.textContent = "";
      });
    }
  }

  // ---- Footer Year ----
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
