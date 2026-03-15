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

   // ------------------------------------------------------------------
   // Fake AI Demo Logic
   // ------------------------------------------------------------------
   const promptSuggestions = document.querySelectorAll("#prompt-suggestions .chip");
   const promptInput = document.getElementById("ai-prompt-input");
   const generateBtn = document.getElementById("generate-btn");
   const responseWrapper = document.getElementById("response-wrapper");
   const loadingState = document.getElementById("loading-state");
   const responseContent = document.getElementById("response-content");

   const predefinedResponses = {
      "Write marketing copy for a SaaS product": "Boost your team's productivity with Nexus AI — the intelligent assistant designed to streamline workflows, automate tasks, and help you focus on what truly matters.",
      "Generate a product launch tweet": "🚀 Introducing Nexus AI — your new intelligent productivity assistant. Automate tasks, generate ideas, and move faster than ever. #NexusAI #Productivity #SaaS",
      "Explain React hooks simply": "React hooks are functions that let you 'hook into' React state and lifecycle features from functional components, without writing a class layout.",
      "default": "Nexus AI can handle that effortlessly. Our unified platform is designed to learn your workflow and provide actionable insights in real-time."
   };

   let isGenerating = false;

   // Handle Chip Clicks
   if (promptSuggestions.length > 0) {
      promptSuggestions.forEach(chip => {
         chip.addEventListener("click", () => {
            promptInput.value = chip.textContent.trim();
            promptInput.focus();
         });
      });
   }

   // Typewriter Effect Function
   function typeWriterEffect(text, element, speed = 20) {
      element.innerHTML = "";
      let i = 0;
      function type() {
         if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
         } else {
            isGenerating = false;
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i data-lucide="sparkles"></i><span>Generate</span>';
            if (window.lucide) window.lucide.createIcons();
         }
      }
      type();
   }

   // Handle AI Response Generation
   function simulateAIResponse() {
      const prompt = promptInput.value.trim();
      if (!prompt || isGenerating) return;

      isGenerating = true;
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<i data-lucide="loader-2" class="spinner"></i><span>Thinking...</span>';
      if (window.lucide) window.lucide.createIcons();
      
      // Show container & loading state
      responseWrapper.classList.remove("hidden");
      responseContent.innerHTML = "";
      loadingState.classList.remove("hidden");

      // Find response or use default
      let responseText = predefinedResponses["default"];
      const promptLower = prompt.toLowerCase();
      for (const key in predefinedResponses) {
         if (promptLower.includes(key.toLowerCase())) {
            responseText = predefinedResponses[key];
            break;
         }
      }

      // Simulate network delay
      setTimeout(() => {
         loadingState.classList.add("hidden");
         typeWriterEffect(responseText, responseContent);
      }, 1500);
   }

   if (generateBtn && promptInput) {
      generateBtn.addEventListener("click", simulateAIResponse);
      promptInput.addEventListener("keydown", (e) => {
         if (e.key === "Enter") {
            e.preventDefault();
            simulateAIResponse();
         }
      });
   }
});
