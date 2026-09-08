(function () {
  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  /* Homepage entrance: logo animates in, then the hero content follows.
     Always plays — this is a short, one-time brand moment rather than
     continuous motion, so it intentionally runs regardless of the
     visitor's reduced-motion preference. */
  var heroH1 = document.querySelector(".hero h1");
  if (heroH1) {
    var introTl = gsap.timeline({ defaults: { ease: "power2.out" } });

    var logoIntro = document.querySelector(".logo-intro");
    if (logoIntro) {
      var introGlow = logoIntro.querySelector(".logo-intro-glow");
      var introIcon = logoIntro.querySelector(".logo-intro-icon");
      var introChars = logoIntro.querySelectorAll(".li-char");
      var introRule = logoIntro.querySelector(".logo-intro-rule");

      introTl
        .from(
          introGlow,
          { opacity: 0, scale: 0.3, duration: 0.7, ease: "power2.out" },
          0
        )
        .from(
          introIcon,
          {
            opacity: 0,
            scale: 2.4,
            rotateY: 130,
            rotateX: -32,
            rotateZ: -16,
            duration: 1,
            ease: "power3.out"
          },
          0
        )
        .from(
          introChars,
          {
            opacity: 0,
            rotateX: -100,
            y: 10,
            duration: 0.55,
            stagger: 0.032,
            ease: "back.out(2.2)",
            transformOrigin: "50% 100%"
          },
          "-=0.4"
        )
        .fromTo(
          introRule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "power2.out" },
          "-=0.15"
        )
        .to(introGlow, { opacity: 0, duration: 0.6, ease: "power1.in" }, "-=0.2");
    }

    var heroEls = [
      document.querySelector(".hero .eyebrow"),
      heroH1,
      document.querySelector(".hero-lede"),
      document.querySelector(".hero-actions")
    ].filter(Boolean);

    var heroVisual = document.querySelector(".hero-visual");

    introTl
      .from(heroEls, { opacity: 0, y: 18, duration: 0.55, stagger: 0.09 }, logoIntro ? "-=0.3" : 0)
      .from(heroVisual, { opacity: 0, y: 24, duration: 0.6 }, "-=0.35");
  }

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    /* Grouped content: reveal children with a short stagger as the group scrolls in */
    var groupSelectors = [".pillars", ".process-list", ".card-grid", ".benefit-blocks"];
    groupSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (group) {
        gsap.from(group.children, {
          opacity: 0,
          y: 22,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      });
    });

    /* Standalone blocks: a single quiet fade-up as each section arrives */
    var blockSelectors = [".section-head", ".cta-band", ".legal-content"];
    blockSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (block) {
        gsap.from(block, {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: block,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        });
      });
    });
  });
})();
