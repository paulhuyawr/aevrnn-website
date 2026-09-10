document.addEventListener("DOMContentLoaded", () => {

  const intro = document.getElementById("intro");
  const progress = document.getElementById("progress");
  const navbar = document.getElementById("navbar");
  const particles = document.getElementById("particles");

  /* INTRO */

  setTimeout(() => {
    if (intro) intro.classList.add("hide");
  }, 2200);


  /* YEAR */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* PARTICLES */

  if (particles) {

    const particleCount =
      window.innerWidth < 700 ? 28 : 55;

    for (let i = 0; i < particleCount; i++) {

      const particle =
        document.createElement("span");

      particle.className = "particle";

      particle.style.left =
        Math.random() * 100 + "%";

      particle.style.animationDuration =
        (8 + Math.random() * 15) + "s";

      particle.style.animationDelay =
        (-Math.random() * 15) + "s";

      const size =
        Math.random() > .8 ? 3 : 2;

      particle.style.width = size + "px";
      particle.style.height = size + "px";

      particles.appendChild(particle);
    }

  }


  /* MOUSE GLOW */

  const finePointer =
    window.matchMedia("(pointer:fine)").matches;

  if (finePointer) {

    window.addEventListener("mousemove", (e) => {

      document.documentElement.style.setProperty(
        "--mx",
        e.clientX + "px"
      );

      document.documentElement.style.setProperty(
        "--my",
        e.clientY + "px"
      );

    });

  }


  /* SCROLL */

  function updateScroll() {

    const scrollTop = window.scrollY;

    const pageHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percent =
      pageHeight > 0
        ? (scrollTop / pageHeight) * 100
        : 0;

    if (progress) {
      progress.style.width = percent + "%";
    }

    if (navbar) {

      if (scrollTop > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

    }

  }

  window.addEventListener(
    "scroll",
    updateScroll,
    { passive: true }
  );

  updateScroll();


  /* SCROLL REVEAL */

  const revealElements =
    document.querySelectorAll(".reveal");

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("show");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

  revealElements.forEach((element) => {
    observer.observe(element);
  });


  /* CARD LIGHT */

  if (finePointer) {

    document
      .querySelectorAll(
        ".project-card, .service-card"
      )
      .forEach((card) => {

        card.addEventListener(
          "mousemove",
          (e) => {

            const rect =
              card.getBoundingClientRect();

            const x =
              e.clientX - rect.left;

            const y =
              e.clientY - rect.top;

            card.style.setProperty(
              "--card-x",
              x + "px"
            );

            card.style.setProperty(
              "--card-y",
              y + "px"
            );

          }
        );

      });

  }


  /* 3D TILT */

  if (
    finePointer &&
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    document
      .querySelectorAll(".tilt")
      .forEach((card) => {

        card.addEventListener(
          "mousemove",
          (e) => {

            const rect =
              card.getBoundingClientRect();

            const x =
              (e.clientX - rect.left) /
              rect.width;

            const y =
              (e.clientY - rect.top) /
              rect.height;

            const rotateY =
              (x - 0.5) * 7;

            const rotateX =
              (0.5 - y) * 7;

            card.style.transform =
              `perspective(900px)
               rotateX(${rotateX}deg)
               rotateY(${rotateY}deg)
               translateY(-7px)`;

          }
        );

        card.addEventListener(
          "mouseleave",
          () => {

            card.style.transform =
              "perspective(900px) rotateX(0) rotateY(0) translateY(0)";

          }
        );

      });

  }


  /* MAGNETIC BUTTONS */

  if (finePointer) {

    document
      .querySelectorAll(".magnetic")
      .forEach((button) => {

        button.addEventListener(
          "mousemove",
          (e) => {

            const rect =
              button.getBoundingClientRect();

            const x =
              e.clientX -
              (rect.left + rect.width / 2);

            const y =
              e.clientY -
              (rect.top + rect.height / 2);

            button.style.transform =
              `translate(${x * 0.12}px, ${y * 0.12}px)`;

          }
        );

        button.addEventListener(
          "mouseleave",
          () => {

            button.style.transform = "";

          }
        );

      });

  }


  /* ACTIVE NAV */

  const sections =
    document.querySelectorAll(
      "main section[id]"
    );

  const navLinks =
    document.querySelectorAll(
      ".nav-links a"
    );

  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.remove("active");
          });

          const active =
            document.querySelector(
              `.nav-links a[href="#${entry.target.id}"]`
            );

          if (active) {
            active.classList.add("active");
          }

        });

      },
      {
        threshold: 0.35
      }
    );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });


  /* SMOOTH ANCHOR */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener(
        "click",
        (e) => {

          const target =
            document.querySelector(
              link.getAttribute("href")
            );

          if (!target) return;

          e.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* ================================= */
  /* YOUTUBE EDITING PROJECTS */
  /* ================================= */

  /*
     IMPORTANT:
     YouTube Data API needs an API key.

     Add your API key below when you create one.
     Do NOT publish a private/server-side key here.

     For now the section shows a clean fallback
     button if no key is configured.
  */

  const CHANNEL_HANDLE = "@aevrnnvfx";

  const youtubeContainer =
    document.getElementById("youtubeProjects");

  function loadYouTubeProjects() {
    if (!youtubeContainer) return;

    youtubeContainer.innerHTML = `
      <div class="youtube-shorts-card reveal">
        <div class="youtube-shorts-visual">
          <div class="youtube-shorts-play">▶</div>
          <div class="youtube-shorts-glow"></div>
        </div>

        <div class="youtube-shorts-content">
          <span class="creator-type">EDITING / VISUALS</span>
          <h3>Latest AEVRNNVFX Edits</h3>
          <p>
            Gaming edits, Shorts, visual projects and motion work.
            Check out the latest uploads on my YouTube channel.
          </p>

          <a
            href="https://www.youtube.com/@aevrnnvfx/shorts"
            target="_blank"
            rel="noopener"
            class="btn btn-secondary"
          >
            VIEW LATEST SHORTS ↗
          </a>
        </div>
      </div>
    `;
  }

  loadYouTubeProjects();

});


/* ===== AEVRNN_SAFE_WEBSITE_NAV ===== */
(function () {

  const website =
    document.querySelector("#website");

  const links =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  /* Smooth scrolling */
  links.forEach(function (link) {

    link.addEventListener("click", function (e) {

      const id =
        link.getAttribute("href");

      if (!id || id === "#") return;

      const target =
        document.querySelector(id);

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });

  /* Website reveal */
  if (website) {

    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {

              website.classList.add(
                "web-visible"
              );

              observer.unobserve(
                website
              );

            }

          });

        },
        {
          threshold: 0.15
        }
      );

    observer.observe(website);
  }

  /* Active navbar section */
  const sections =
    document.querySelectorAll(
      "section[id]"
    );

  const nav =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  if (sections.length) {

    const sectionObserver =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (!entry.isIntersecting) return;

            const id =
              entry.target.id;

            nav.forEach(function (link) {

              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + id
              );

            });

          });

        },
        {
          rootMargin: "-35% 0px -55% 0px"
        }
      );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });

  }

})();

/* ===== WEBSITE NAV ACTIVE FIX ===== */
(function () {

  const websiteLink =
    document.querySelector('a[href="#website"]');

  const websiteSection =
    document.querySelector("#website");

  if (!websiteLink || !websiteSection) return;

  function setWebsiteActive() {
    document
      .querySelectorAll('a[href^="#"]')
      .forEach(function (link) {
        link.classList.remove("active");
      });

    websiteLink.classList.add("active");
  }

  websiteLink.addEventListener("click", function () {
    setWebsiteActive();
  });

  const observer =
    new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {
            setWebsiteActive();
          }

        });

      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0
      }
    );

  observer.observe(websiteSection);

})();

/* CLICKABLE PROJECT CARDS - 2 SECOND DELAY */
document.querySelectorAll(".project-card").forEach((card) => {
  const link = card.querySelector(".project-link");

  if (link) {
    card.style.cursor = "pointer";

    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;

      card.classList.add("opening");

      setTimeout(() => {
        window.open(link.href, "_blank", "noopener");
        card.classList.remove("opening");
      }, 2000);
    });
  }
});


/* =====================================================
   AEVRNN CONTACT MODAL
   ===================================================== */

(() => {
  const modal = document.getElementById("contactModal");
  const openBtn = document.getElementById("openContactForm");
  const closeBtn = document.getElementById("closeContactForm");
  const backdrop = document.getElementById("contactBackdrop");
  const form = document.getElementById("contactForm");

  if (!modal || !openBtn || !closeBtn || !form) return;

  const openModal = () => {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("contact-modal-open");

    setTimeout(() => {
      document.getElementById("contactName")?.focus();
    }, 350);
  };

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("contact-modal-open");
  };

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.getElementById("contactFormStatus");
    const button = form.querySelector(".contact-submit");
    const buttonText = button.querySelector("span");

    button.disabled = true;
    buttonText.textContent = "SENDING...";
    status.textContent = "";

    try {
      const response = await fetch("https://formspree.io/f/xljezbyj", {
        method: "POST",
        body: new FormData(form),
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        buttonText.textContent = "MESSAGE SENT ✓";
        status.textContent = "Thanks! I'll get back to you soon.";
        form.reset();

        setTimeout(() => {
          closeModal();
          buttonText.textContent = "SEND MESSAGE";
          status.textContent = "";
          button.disabled = false;
        }, 2200);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      button.disabled = false;
      buttonText.textContent = "SEND MESSAGE";
      status.textContent = "Something went wrong. Please try again.";
    }
  });
})();


/* =====================================================
   ZENTRAMC SERVER IP COPY
   ===================================================== */

(() => {
  const card = document.getElementById("serverIpCard");
  const button = document.getElementById("copyServerIp");

  if (!card || !button) return;

  const originalText = "COPY IP";

  button.addEventListener("click", async () => {
    const ip = "zentramc.loca.lol";
    const text = button.querySelector("span");

    try {
      await navigator.clipboard.writeText(ip);

      button.classList.add("copied");
      card.classList.add("show-copied");
      text.textContent = "COPIED ✓";

      setTimeout(() => {
        button.classList.remove("copied");
        card.classList.remove("show-copied");
        text.textContent = originalText;
      }, 2200);

    } catch (error) {
      text.textContent = "COPY FAILED";

      setTimeout(() => {
        text.textContent = originalText;
      }, 1800);
    }
  });
})();

