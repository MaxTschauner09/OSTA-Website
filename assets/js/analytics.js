/* Privacy-friendly visitor counting: no cookies, no IP storage, no
   third-party analytics service. Logs an anonymous page-view row
   (per-tab session id, cleared when the tab closes) and joins a
   Realtime presence channel so the admin dashboard can show a live
   "currently on the site" count. */
(function () {
  var db = window.osta && window.osta.supabase;
  if (!db) return;

  var sid = sessionStorage.getItem("osta_sid");
  if (!sid) {
    sid = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
    sessionStorage.setItem("osta_sid", sid);
  }

  db.from("page_views")
    .insert({ path: location.pathname, session_id: sid })
    .then(function () {});

  var channel = db.channel("osta-presence", {
    config: { presence: { key: sid } }
  });
  channel.subscribe(function (status) {
    if (status === "SUBSCRIBED") {
      channel.track({ online_at: new Date().toISOString() });
    }
  });
})();
