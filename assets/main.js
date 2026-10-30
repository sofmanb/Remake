(function () {
  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Campus grid with filters
  var grid = document.getElementById("campus-grid");
  if (grid && window.CAMPUSES) {
    var render = function (region) {
      grid.innerHTML = "";
      window.CAMPUSES
        .filter(function (c) { return region === "All" || c.region === region; })
        .forEach(function (c) {
          var el = document.createElement("article");
          el.className = "campus";
          el.dataset.region = c.region;
          el.innerHTML =
            '<div class="campus-top"><div class="tag">' + c.area + '</div><h3>' + c.name + '</h3></div>' +
            '<div class="campus-body"><p>' + c.notes + '</p><dl>' +
            '<dt>IT load</dt><dd>' + (c.mw ? "~" + c.mw + "MW" : "On request") + '</dd>' +
            '<dt>Status</dt><dd>Live</dd>' +
            '<dt>Campus</dt><dd>' + c.region + '</dd></dl></div>';
          grid.appendChild(el);
        });
    };
    var buttons = document.querySelectorAll(".filter");
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        render(b.dataset.region);
      });
    });
    render("All");
  }

  // Contact form (client-side only)
  var form = document.querySelector("form.contact");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (!form.checkValidity()) {
        status.textContent = "Please complete the required fields.";
        status.classList.add("error");
        form.reportValidity();
        return;
      }
      status.classList.remove("error");
      status.textContent = "Thanks — a member of the team will be in touch within one working day.";
      form.reset();
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
