(function () {
  if (typeof supabase === "undefined") return;

  window.osta = window.osta || {};
  window.osta.supabase = supabase.createClient(
    "https://bbsbthxpieraopksymck.supabase.co",
    "sb_publishable_pfwbJXrEQ39XNQ-6cP69zg_y_YnvJbl"
  );

  // Available on every page (not just the ones that load auth-guard.js),
  // since the header account menu can trigger a logout from anywhere.
  window.osta.logout = async function () {
    await window.osta.supabase.auth.signOut();
    window.location.href = "index.html";
  };
})();
