/* Swaps the header "Login" link for a "Konto" dropdown (Dashboard /
   Abmelden) once a session exists. Leaves the default "Login" markup
   untouched for logged-out visitors. Depends on supabase-client.js. */
(async function () {
  var db = window.osta && window.osta.supabase;
  if (!db) return;

  var res = await db.auth.getSession();
  var session = res.data && res.data.session;
  if (!session) return;

  document.querySelectorAll(".nav-account").forEach(function (slot) {
    slot.innerHTML =
      '<button type="button" class="account-toggle">' +
      "Mein Konto " +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' +
      "</button>" +
      '<div class="account-menu-panel">' +
      '<a href="dashboard.html">Dashboard</a>' +
      '<button type="button" class="account-logout">Abmelden</button>' +
      "</div>";

    var toggle = slot.querySelector(".account-toggle");
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      slot.classList.toggle("is-open");
    });
    slot.querySelector(".account-logout").addEventListener("click", function () {
      window.osta.logout();
    });
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-account.is-open").forEach(function (m) {
      m.classList.remove("is-open");
    });
  });

  document.querySelectorAll(".mobile-nav-account").forEach(function (slot) {
    slot.innerHTML =
      '<a href="dashboard.html">Dashboard</a>' +
      '<a href="#" class="mobile-logout">Abmelden</a>';
    slot.querySelector(".mobile-logout").addEventListener("click", function (e) {
      e.preventDefault();
      window.osta.logout();
    });
  });
})();
