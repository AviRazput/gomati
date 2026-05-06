(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var navToggle = document.getElementById("nav-toggle");
  var navBackdrop = document.getElementById("nav-backdrop");

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (navBackdrop) {
      navBackdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
  }

  if (navToggle && navBackdrop) {
    navToggle.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      setNavOpen(!document.body.classList.contains("nav-open"));
    });
    navBackdrop.addEventListener("click", function () {
      setNavOpen(false);
    });
    document.querySelectorAll(".nav-shell .nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setNavOpen(false);
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && document.body.classList.contains("nav-open")) {
        setNavOpen(false);
      }
    });
  }

  var toast = document.getElementById("toast");
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () {
        toast.hidden = true;
      }, 400);
    }, 3200);
  }

  document.querySelectorAll(".btn-buy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var title = btn.getAttribute("data-title") || "Product";
      var price = btn.getAttribute("data-price") || "";
      showToast(title + " · ₹" + price + " — Swap this toast for your checkout or WhatsApp link.");
    });
  });

  function initProductCard(card) {
    var imgs = Array.prototype.slice.call(card.querySelectorAll(".product-img"));
    var dotsWrap = card.querySelector(".product-dots");
    if (imgs.length < 2 || !dotsWrap) return;

    imgs.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "product-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dot.setAttribute("aria-label", "Photo " + (i + 1));
      dot.addEventListener("click", function () {
        setActive(i);
      });
      dotsWrap.appendChild(dot);
    });

    function setActive(index) {
      imgs.forEach(function (img, i) {
        var on = i === index;
        img.classList.toggle("is-active", on);
        img.hidden = !on;
      });
      dotsWrap.querySelectorAll(".product-dot").forEach(function (d, i) {
        d.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }

    var startX = 0;
    var media = card.querySelector(".product-media");
    if (media) {
      media.addEventListener(
        "touchstart",
        function (e) {
          if (e.changedTouches[0]) startX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );
      media.addEventListener(
        "touchend",
        function (e) {
          if (!e.changedTouches[0]) return;
          var dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) < 40) return;
          var current = imgs.findIndex(function (img) {
            return !img.hidden;
          });
          if (current < 0) current = 0;
          if (dx < 0) setActive(Math.min(imgs.length - 1, current + 1));
          else setActive(Math.max(0, current - 1));
        },
        { passive: true }
      );
    }
  }

  document.querySelectorAll(".product-card").forEach(initProductCard);
})();
