function setCategory(cat) {
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.filter === cat);
  });

  document.querySelectorAll("#posts-list li").forEach(li => {
    const values = (li.dataset.filters || "")
      .split("|")
      .map(v => v.trim().toLowerCase())
      .filter(Boolean);
    li.style.display = (cat === "all" || values.includes(cat.toLowerCase())) ? "block" : "none";
  });
}

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.filter || "all";
    const url = new URL(window.location.href);
    if (cat === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", cat.toLowerCase());
    window.history.pushState({}, "", url);
    setCategory(cat);
  });
});

function initFromUrl() {
  const raw = new URLSearchParams(window.location.search).get("category") || "all";
  if (raw === "all") return setCategory("all");

  const btn = Array.from(document.querySelectorAll(".cat-btn"))
    .find(b => (b.dataset.filter || "").toLowerCase() === raw.toLowerCase());
  setCategory(btn ? btn.dataset.filter : "all");
}

window.addEventListener("popstate", initFromUrl);
initFromUrl();
