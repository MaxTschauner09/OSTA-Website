(function () {
  if (typeof supabase === "undefined") return;

  window.osta = window.osta || {};
  window.osta.supabase = supabase.createClient(
    "https://bbsbthxpieraopksymck.supabase.co",
    "sb_publishable_pfwbJXrEQ39XNQ-6cP69zg_y_YnvJbl"
  );
})();
