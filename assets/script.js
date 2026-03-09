document.addEventListener("DOMContentLoaded", () => {
   // Initialize Lucide Icons
   if (window.lucide) {
      window.lucide.createIcons();
   }

   // Sticky Navigation with Glassmorphism
   const nav = document.getElementById("main-nav");
   window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
         nav.classList.add("scrolled");
      } else {
         nav.classList.remove("scrolled");
      }
   });

   // Pricing Toggle Logic
   const pricingToggle = document.getElementById("pricing-toggle");
   const priceValues = document.querySelectorAll(".price-value");
   const pricePeriods = document.querySelectorAll(".price-period");

   const monthlyPrices = ["29", "79", "199"];
   const yearlyPrices = ["24", "64", "159"];

   if (pricingToggle) {
      pricingToggle.addEventListener("change", () => {
         const isYearly = pricingToggle.checked;

         priceValues.forEach((price, index) => {
            const targetPrice = isYearly
               ? yearlyPrices[index]
               : monthlyPrices[index];

            // Animate value change
            price.style.opacity = "0";
            price.style.transform = "translateY(-10px)";

            setTimeout(() => {
               price.textContent = targetPrice;
               price.style.opacity = "1";
               price.style.transform = "translateY(0)";
            }, 200);
         });

         pricePeriods.forEach((period) => {
            period.textContent = isYearly ? "/mo (billed yearly)" : "/mo";
         });
      });
   }

   // Mobile Menu Toggle
   const mobileMenuBtn = document.getElementById("mobile-menu-btn");
   const mobileMenu = document.getElementById("mobile-menu");

   if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
         mobileMenu.classList.toggle("hidden");

         // Toggle icon between menu and x
         const icon = mobileMenuBtn.querySelector("i");
         if (icon) {
            const isHidden = mobileMenu.classList.contains("hidden");
            icon.setAttribute("data-lucide", isHidden ? "menu" : "x");
            window.lucide.createIcons();
         }
      });
   }

   // Smooth Scroll for Anchor Links
   document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
         const href = this.getAttribute("href");
         if (href === "#") return;

         e.preventDefault();
         const target = document.querySelector(href);
         if (target) {
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
               mobileMenu.classList.add("hidden");
               const icon = mobileMenuBtn.querySelector("i");
               if (icon) {
                  icon.setAttribute("data-lucide", "menu");
                  window.lucide.createIcons();
               }
            }

            const navHeight = nav.offsetHeight;
            const targetPosition =
               target.getBoundingClientRect().top +
               window.pageYOffset -
               navHeight;

            window.scrollTo({
               top: targetPosition,
               behavior: "smooth",
            });
         }
      });
   });

   // Intersection Observer for Fade-In Animations (Optional but adds premium feel)
   const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
   };

   const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
         if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
         }
      });
   }, observerOptions);

   // Apply initial styles for fade-in elements
   const animateElements = document.querySelectorAll(
      ".feature-card, .step, .pricing-card, .testimonial-card",
   );
   animateElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      observer.observe(el);
   });

   // Theme toggle logic -------------------------------------------------
   const themeToggle = document.getElementById("theme-toggle");

   function updateThemeIcon(theme) {
      const icon = themeToggle && themeToggle.querySelector("i");
      if (!icon) return;
      icon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
      window.lucide && window.lucide.createIcons();
   }

   function applyTheme(theme) {
      document.body.classList.toggle("dark-mode", theme === "dark");
      updateThemeIcon(theme);
   }

   if (themeToggle) {
      themeToggle.addEventListener("click", () => {
         const isDark = document.body.classList.toggle("dark-mode");
         const chosen = isDark ? "dark" : "light";
         localStorage.setItem("theme", chosen);
         updateThemeIcon(chosen);
      });
   }

   // initialize based on stored preference or system setting
   (function () {
      const stored = localStorage.getItem("theme");
      if (stored) {
         applyTheme(stored);
      } else {
         const prefers = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
         applyTheme(prefers);
      }
   })();

   // Set current year in footer
   document.getElementById("year").textContent = new Date().getFullYear();
});
