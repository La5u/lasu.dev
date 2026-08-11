// Shared project links. Keep extension-store URLs here so every page stays in sync.
const projectLinks = {
  uncensored: {
    website: "/uncensored/",
    chrome: "https://chromewebstore.google.com/detail/uncensored-youtube/mbclkeohmlkedanbdcinenopclibbjko",
    edge: "https://microsoftedge.microsoft.com/addons/detail/eocphjoapoiogaodaljjpbocmekfhlcj",
    firefox: "https://addons.mozilla.org/en-US/firefox/addon/uncensored/",
    github: "https://github.com/la5u/uncensored"
  }
};

document.querySelectorAll("[data-project-link]").forEach((link) => {
  const [project, kind] = link.dataset.projectLink.split(":");
  const url = projectLinks[project]?.[kind];
  if (url) link.href = url;
});
