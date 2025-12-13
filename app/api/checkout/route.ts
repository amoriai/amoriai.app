const res = await fetch("/api/checkout", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    plan: planId,
    lang: locale,
    // ...
  }),
});

const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

if (!res.ok || !json.url) {
  throw new Error(json?.error || "Erreur serveur lors du paiement.");
}

window.location.href = json.url;
