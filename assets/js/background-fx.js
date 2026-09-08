(function () {
  if (typeof gsap === "undefined") return;

  /* Travelling light pulses along each workflow connector — two per
     link, offset so a trailing spark chases the lead one. This is the
     site's signature ambient visual, so — like the homepage logo
     intro — it always plays, independent of the visitor's
     reduced-motion preference. */
  var links = document.querySelectorAll(".bg-link");
  var pulses = document.querySelectorAll(".bg-pulse");
  var linkCount = links.length;

  pulses.forEach(function (pulse, i) {
    var path = links[i % linkCount];
    if (!path || typeof path.getTotalLength !== "function") return;

    var length = path.getTotalLength();
    var lap = Math.floor(i / linkCount);
    var duration = 3.2 + ((i % linkCount) % 4) * 0.45;
    var baseDelay = (i % linkCount) * 0.3;
    var delay = lap === 0 ? baseDelay : baseDelay + duration / 2;
    var proxy = { d: 0 };

    var tl = gsap.timeline({ repeat: -1, delay: delay });
    tl.set(pulse, { opacity: 0 })
      .to(pulse, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0)
      .to(
        proxy,
        {
          d: 1,
          duration: duration,
          ease: "none",
          onUpdate: function () {
            var pt = path.getPointAtLength(proxy.d * length);
            pulse.setAttribute("cx", pt.x);
            pulse.setAttribute("cy", pt.y);
          }
        },
        0
      )
      .to(pulse, { opacity: 0, duration: 0.3, ease: "power1.in" }, duration - 0.3);
  });

  /* Gentle pointer parallax across the background layers. */
  var layers = document.querySelectorAll(".bg-parallax");
  if (layers.length && window.matchMedia("(pointer: fine)").matches) {
    var setters = Array.prototype.map.call(layers, function (el) {
      var depth = parseFloat(el.getAttribute("data-depth")) || 1;
      return {
        x: gsap.quickTo(el, "x", { duration: 1, ease: "power2.out" }),
        y: gsap.quickTo(el, "y", { duration: 1, ease: "power2.out" }),
        depth: depth
      };
    });

    window.addEventListener("pointermove", function (e) {
      var nx = e.clientX / window.innerWidth - 0.5;
      var ny = e.clientY / window.innerHeight - 0.5;
      setters.forEach(function (s) {
        s.x(nx * 60 * s.depth);
        s.y(ny * 42 * s.depth);
      });
    });
  }
})();
