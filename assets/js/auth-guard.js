/* Shared helpers for pages that require a logged-in customer or admin.
   Depends on assets/js/supabase-client.js having run first. */
window.osta = window.osta || {};

window.osta.requireAuth = async function (redirectTo) {
  redirectTo = redirectTo || "login.html";
  var db = window.osta.supabase;
  if (!db) return null;
  var res = await db.auth.getSession();
  var session = res.data && res.data.session;
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session;
};

window.osta.requireAdmin = async function () {
  var session = await window.osta.requireAuth("login.html");
  if (!session) return null;
  var db = window.osta.supabase;
  var res = await db
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();
  if (!res.data || res.data.role !== "admin") {
    window.location.href = "dashboard.html";
    return null;
  }
  return session;
};

window.osta.redirectIfLoggedIn = async function (target) {
  target = target || "dashboard.html";
  var db = window.osta.supabase;
  if (!db) return;
  var res = await db.auth.getSession();
  if (res.data && res.data.session) {
    window.location.href = target;
  }
};

// window.osta.logout lives in supabase-client.js, since it needs to be
// available on every page, not just the ones that load this file.
