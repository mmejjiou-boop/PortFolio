// ===== Nom géant : chaque lettre s'épaissit quand la souris s'approche =====
(function () {
  var name = document.querySelector(".big-name");
  if (!name) return;
  name.querySelectorAll(".line").forEach(function (line) {
    var txt = line.textContent;
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");
    txt.split("").forEach(function (c) {
      var s = document.createElement("span");
      s.className = "ch";
      s.textContent = c === " " ? " " : c;
      line.appendChild(s);
    });
  });
  var letters = name.querySelectorAll(".ch");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { letters.forEach(function (l) { l.style.fontVariationSettings = '"wght" 700'; }); return; }

  // Petite vague à l'arrivée
  letters.forEach(function (l, i) {
    setTimeout(function () { l.style.fontVariationSettings = '"wght" 800'; }, 40 * i);
    setTimeout(function () { l.style.fontVariationSettings = '"wght" 300'; }, 40 * i + 350);
  });

  var raf = null;
  window.addEventListener("pointermove", function (e) {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      letters.forEach(function (l) {
        var r = l.getBoundingClientRect();
        var d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        var w = Math.round(800 - Math.min(d, 320) / 320 * 500);
        l.style.fontVariationSettings = '"wght" ' + w;
      });
    });
  });
  document.addEventListener("pointerleave", function () {
    letters.forEach(function (l) { l.style.fontVariationSettings = '"wght" 300'; });
  });
})();

// ===== Filtres de la page Projets =====
(function () {
  var bar = document.querySelector(".filters");
  if (!bar) return;
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-cat]"));
  var count = document.querySelector(".count");
  function apply(cat) {
    var n = 0;
    cards.forEach(function (c) {
      var show = cat === "all" || c.getAttribute("data-cat").split(" ").indexOf(cat) !== -1;
      c.hidden = !show;
      if (show) n++;
    });
    if (count) count.textContent = n + (n > 1 ? " projets" : " projet");
    bar.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.filter === cat ? "true" : "false");
    });
  }
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) apply(b.dataset.filter);
  });
  apply("all");
})();

// ===== Copier au clic =====
document.querySelectorAll("[data-copy]").forEach(function (el) {
  el.addEventListener("click", function () {
    var hint = el.querySelector("[data-hint]");
    var old = hint ? hint.textContent : "";
    function say(t) {
      if (!hint) return;
      hint.textContent = t;
      setTimeout(function () { hint.textContent = old; }, 1800);
    }
    try {
      navigator.clipboard.writeText(el.dataset.copy).then(function () { say("✓ Copié !"); }, function () { say(el.dataset.copy); });
    } catch (e) { say(el.dataset.copy); }
  });
});

// ===== Formulaire de contact : prépare l'e-mail =====
(function () {
  var form = document.querySelector("form.contact");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var subject = (d.get("sujet") || "Contact") + " – " + d.get("nom");
    var body = d.get("message") + "\n\n" + d.get("nom") + (d.get("entreprise") ? " – " + d.get("entreprise") : "") + "\n" + d.get("email");
    var note = form.querySelector(".form-note");
    note.className = "form-note ok";
    note.innerHTML = "Votre messagerie va s'ouvrir avec le message prêt. Rien ne s'ouvre ? Écrivez à <strong>mmejjiou@gmail.com</strong>.";
    window.location.href = "mailto:mmejjiou@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();

// ===== Barre de debug façon Symfony =====
(function () {
  var route = document.body.dataset.route || "app_home";
  var path = document.body.dataset.path || "/";
  var bar = document.createElement("div");
  bar.className = "sf-bar";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Barre de debug");
  bar.innerHTML =
    '<span class="sf-logo">sf</span>' +
    '<span class="ok">200</span>' +
    '<span><span class="muted">@</span><b>' + route + '</b></span>' +
    '<span class="time"><span class="muted">⏱</span><b>…</b> ms</span>' +
    '<span><span class="muted">PHP</span><b>8.3</b></span>' +
    '<button type="button" aria-expanded="false" aria-controls="sf-panel"><span class="muted">👤</span><b>Profil du dev</b></button>' +
    '<span><span class="muted">Symfony</span><b>7.4</b></span>';
  document.body.appendChild(bar);

  var panel = document.createElement("div");
  panel.className = "sf-panel";
  panel.id = "sf-panel";
  panel.hidden = true;
  panel.innerHTML =
    "<h4>Profiler · " + path + "</h4>" +
    "<dl>" +
    "<dt>Dev</dt><dd>Mohamed Amine Mejjiou</dd>" +
    "<dt>Statut</dt><dd>Ouvert à une alternance 2026-2027</dd>" +
    "<dt>Rythme</dt><dd>1 sem. école / 3 sem. entreprise</dd>" +
    "<dt>Zone</dt><dd>Orléans + 20 km</dd>" +
    "<dt>École</dt><dd>Coda · DWWM niveau 5</dd>" +
    "<dt>Erreurs</dt><dd>0 (pour l'instant 😄)</dd>" +
    "</dl>";
  document.body.appendChild(panel);

  var btn = bar.querySelector("button");
  btn.addEventListener("click", function () {
    panel.hidden = !panel.hidden;
    btn.setAttribute("aria-expanded", String(!panel.hidden));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); }
  });

  window.addEventListener("load", function () {
    var ms = Math.round(performance.now());
    bar.querySelector(".time b").textContent = ms;
  });
})();