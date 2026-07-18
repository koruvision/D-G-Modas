(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && typeof window.ScrollTrigger !== "undefined") {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  /* Navbar */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  const onScrollNav = () => {
    if (!navbar) return;
    navbar.classList.toggle("is-solid", window.scrollY > 24);
  };

  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  if (navToggle && navMenu && navbar) {
    navToggle.addEventListener("click", () => {
      const open = navbar.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ——— GSAP: Hero entrance + Ken Burns ——— */
  const hero = document.getElementById("topo");
  const heroBanner = document.querySelector(".hero__banner");
  const heroMedia = document.querySelector('[data-parallax="bg"]');
  const heroEnters = document.querySelectorAll(".hero-enter");

  if (hasGsap && !reduceMotion) {
    const tl = window.gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      heroEnters,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.12 },
      0.15
    );
    if (heroBanner) {
      window.gsap.fromTo(
        heroBanner,
        { scale: 1.12 },
        { scale: 1.03, duration: 8, ease: "sine.inOut" }
      );
      window.gsap.to(heroBanner, {
        scale: 1.08,
        duration: 14,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 8,
      });
    }
  } else {
    heroEnters.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  /* Parallax sutil no banner do hero */
  if (hero && heroMedia && !reduceMotion) {
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let running = false;

    const render = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      heroMedia.style.transform = `translate3d(${cx * 10}px, ${cy * 8}px, 0)`;
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        requestAnimationFrame(render);
      } else {
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      requestAnimationFrame(render);
    };

    hero.addEventListener(
      "mousemove",
      (e) => {
        const rect = hero.getBoundingClientRect();
        tx = (e.clientX - rect.left) / rect.width - 0.5;
        ty = (e.clientY - rect.top) / rect.height - 0.5;
        kick();
      },
      { passive: true }
    );

    hero.addEventListener(
      "mouseleave",
      () => {
        tx = 0;
        ty = 0;
        kick();
      },
      { passive: true }
    );
  }

  /* ——— GSAP Scroll reveals ——— */
  const revealEls = document.querySelectorAll(".reveal-lux, .section-head");
  if (hasGsap && !reduceMotion) {
    revealEls.forEach((el) => {
      if (!el.classList.contains("reveal-lux") && el.classList.contains("section-head")) {
        el.classList.add("reveal-lux");
      }
      window.gsap.fromTo(
        el,
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => {
      if (!el.classList.contains("reveal-lux") && el.classList.contains("section-head")) {
        el.classList.add("reveal-lux");
      }
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Features stagger */
  if (hasGsap && !reduceMotion) {
    const features = document.querySelectorAll(".feature");
    if (features.length) {
      window.gsap.fromTo(
        features,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features__grid",
            start: "top 80%",
          },
        }
      );
    }
  }

  /* Brilho dourado que segue o mouse */
  const glowEl = document.getElementById("goldGlow");
  const sparkCanvas = document.getElementById("goldSparkles");

  if (glowEl && sparkCanvas && sparkCanvas.getContext && !reduceMotion) {
    const ctx = sparkCanvas.getContext("2d");
    const sparks = [];
    let w = 0;
    let h = 0;
    let lastSpawn = 0;
    let rafId = 0;
    let active = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      sparkCanvas.width = w * dpr;
      sparkCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x, y) => {
      const now = performance.now();
      if (now - lastSpawn < 40) return;
      if (sparks.length >= 28) return;
      lastSpawn = now;

      const n = 1 + (Math.random() > 0.55 ? 1 : 0);
      for (let i = 0; i < n; i += 1) {
        sparks.push({
          x: x + (Math.random() - 0.5) * 28,
          y: y + (Math.random() - 0.5) * 20,
          size: 1.2 + Math.random() * 2.4,
          life: 1,
          born: now,
          vy: -(0.35 + Math.random() * 0.7),
          vx: (Math.random() - 0.5) * 0.45,
          glow: 6 + Math.random() * 10,
        });
      }
    };

    const tick = (now) => {
      ctx.clearRect(0, 0, w, h);

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const p = sparks[i];
        p.life = Math.max(0, 1 - (now - p.born) / 900);
        p.x += p.vx;
        p.y += p.vy;
        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = p.life * 0.85;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 220, 140, ${alpha})`;
        ctx.shadowColor = `rgba(201, 167, 106, ${0.5 + p.life * 0.4})`;
        ctx.shadowBlur = p.glow * p.life;
        ctx.arc(p.x, p.y, p.size * (0.65 + p.life * 0.35), 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 248, 220, ${alpha * 0.9})`;
        ctx.shadowBlur = 2;
        ctx.arc(p.x, p.y, p.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    rafId = requestAnimationFrame(tick);

    document.addEventListener(
      "mousemove",
      (e) => {
        glowEl.style.setProperty("--gx", `${e.clientX}px`);
        glowEl.style.setProperty("--gy", `${e.clientY}px`);
        if (!active) {
          active = true;
          glowEl.classList.add("is-on");
        }
        spawn(e.clientX, e.clientY);
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseleave",
      () => {
        active = false;
        glowEl.classList.remove("is-on");
      },
      { passive: true }
    );

    window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
  }

  /* Zoom suave na foto Sobre */
  const aboutCrest = document.querySelector(".about__crest");
  if (aboutCrest && "IntersectionObserver" in window && !reduceMotion) {
    const watchObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          aboutCrest.classList.toggle("is-watching", entry.isIntersecting);
        });
      },
      { threshold: 0.45 }
    );
    watchObs.observe(aboutCrest);

    if (hasGsap) {
      const aboutImg = aboutCrest.querySelector("img");
      if (aboutImg) {
        window.gsap.to(aboutImg, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: aboutCrest,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }
  }

  /* Flutuação infinita nos cards (GSAP loops) */
  const floatCards = Array.from(document.querySelectorAll("[data-float]"));
  if (floatCards.length && !reduceMotion) {
    if (hasGsap) {
      floatCards.forEach((card, i) => {
        const amp = 6 + (parseFloat(card.getAttribute("data-float") || "0.2") * 18);
        window.gsap.to(card, {
          y: amp,
          duration: 2.4 + (i % 5) * 0.35,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: (i % 7) * 0.12,
        });
      });
    } else {
      let ticking = false;
      const updateFloat = () => {
        const vh = window.innerHeight;
        floatCards.forEach((card) => {
          const speed = parseFloat(card.getAttribute("data-float") || "0.2");
          const rect = card.getBoundingClientRect();
          const progress = (vh * 0.55 - rect.top) / (vh + rect.height);
          const y = Math.max(-10, Math.min(10, progress * speed * 40));
          card.style.transform = `translate3d(0, ${y}px, 0)`;
        });
        ticking = false;
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateFloat);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      updateFloat();
    }
  }

  /* Hover animations (GSAP) */
  if (hasGsap && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".look-card, .realm-card, .gallery__item, .vitrine__item").forEach((card) => {
      const media = card.querySelector("img");
      card.addEventListener("mouseenter", () => {
        if (media) {
          window.gsap.to(media, { scale: 1.06, duration: 0.55, ease: "power2.out" });
        }
        window.gsap.to(card, { y: -4, duration: 0.35, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        if (media) {
          window.gsap.to(media, { scale: 1, duration: 0.55, ease: "power2.out" });
        }
        window.gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
      });
    });

    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        window.gsap.to(btn, { scale: 1.035, duration: 0.25, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        window.gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });
  }

  /* Carrosséis das categorias */
  const initRealmCarousel = (root) => {
    const slides = Array.from(root.querySelectorAll(".realm-carousel__slides img"));
    if (!slides.length) return;

    const prevBtn = root.querySelector("[data-realm-prev]");
    const nextBtn = root.querySelector("[data-realm-next]");
    const dotsWrap = root.querySelector("[data-realm-dots]");
    let index = Math.max(0, slides.findIndex((img) => img.classList.contains("is-active")));
    let timer = 0;
    const INTERVAL = 3800;

    const show = (next) => {
      const prev = index;
      index = ((next % slides.length) + slides.length) % slides.length;
      slides.forEach((img, i) => img.classList.toggle("is-active", i === index));
      if (hasGsap && !reduceMotion && slides[prev] && slides[index] && prev !== index) {
        window.gsap.fromTo(
          slides[index],
          { autoAlpha: 0, scale: 1.04 },
          { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power2.out" }
        );
      }
      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach((dot, i) => {
          dot.classList.toggle("is-active", i === index);
        });
      }
    };

    const renderDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Ir para foto ${i + 1}`);
        if (i === index) dot.classList.add("is-active");
        dot.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          show(i);
          startAuto();
        });
        dotsWrap.appendChild(dot);
      });
    };

    const startAuto = () => {
      clearInterval(timer);
      timer = window.setInterval(() => show(index + 1), INTERVAL);
    };

    prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      show(index - 1);
      startAuto();
    });
    nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      show(index + 1);
      startAuto();
    });

    renderDots();
    show(index);
    startAuto();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearInterval(timer);
      else startAuto();
    });
  };

  document.querySelectorAll("[data-realm-carousel]").forEach((root, i) => {
    window.setTimeout(() => initRealmCarousel(root), i * 900);
  });

  /* Carousel depoimentos */
  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const track = carousel.querySelector("[data-carousel-track]");
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    const cards = track ? Array.from(track.children) : [];

    if (track && cards.length) {
      let index = 0;

      const getPerView = () => {
        if (window.innerWidth >= 900) return 3;
        if (window.innerWidth >= 700) return 2;
        return 1;
      };

      const maxIndex = () => Math.max(0, cards.length - getPerView());

      const renderDots = () => {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = "";
        const total = maxIndex() + 1;
        for (let i = 0; i < total; i += 1) {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", `Ir para slide ${i + 1}`);
          if (i === index) dot.classList.add("is-active");
          dot.addEventListener("click", () => goTo(i));
          dotsWrap.appendChild(dot);
        }
      };

      const goTo = (next) => {
        index = Math.max(0, Math.min(next, maxIndex()));
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        track.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
        renderDots();
      };

      prevBtn?.addEventListener("click", () => goTo(index - 1));
      nextBtn?.addEventListener("click", () => goTo(index + 1));

      let autoplay = setInterval(() => goTo(index >= maxIndex() ? 0 : index + 1), 6000);
      carousel.addEventListener("mouseenter", () => clearInterval(autoplay));
      carousel.addEventListener("mouseleave", () => {
        autoplay = setInterval(() => goTo(index >= maxIndex() ? 0 : index + 1), 6000);
      });

      window.addEventListener("resize", () => {
        index = Math.min(index, maxIndex());
        goTo(index);
      });

      renderDots();
    }
  }

  /* WhatsApp float subtle pulse */
  const wa = document.querySelector(".whatsapp-float");
  if (wa && hasGsap && !reduceMotion) {
    window.gsap.to(wa, {
      scale: 1.06,
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }
})();
