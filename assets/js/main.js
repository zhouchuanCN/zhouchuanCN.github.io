(() => {
  const filters = [...document.querySelectorAll("[data-filter]")];
  const publications = [...document.querySelectorAll(".publication")];
  const count = document.querySelector("#publication-count");
  const viewAll = document.querySelector(".view-all-button");
  const toolbar = document.querySelector(".publication-toolbar");

  // All content is rendered into HTML. Filtering is a progressive enhancement.
  function filterPublications(filter) {
    let visible = 0;
    publications.forEach((publication) => {
      const matches =
        filter === "all" ||
        (filter === "selected" && publication.dataset.selected === "true") ||
        publication.dataset.topic.split(" ").includes(filter);
      publication.hidden = !matches;
      if (matches) visible += 1;
    });
    filters.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    count.textContent = `${visible} of ${publications.length} papers`;
    viewAll.hidden = filter === "all";
  }

  toolbar.hidden = false;
  filters.forEach((button) =>
    button.addEventListener("click", () => filterPublications(button.dataset.filter)),
  );
  viewAll.addEventListener("click", () => {
    filterPublications("all");
    const allButton = filters.find((button) => button.dataset.filter === "all");
    allButton.focus({ preventScroll: true });
    document.querySelector("#publications").scrollIntoView({ behavior: "auto" });
  });
  filterPublications("selected");

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  menuToggle.hidden = false;

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mobileNav.hidden = true;
  }

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    mobileNav.hidden = !open;
  });
  mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.matchMedia("(min-width: 621px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  const navigation = [...document.querySelectorAll(".desktop-nav a")];
  const sections = navigation.map((link) => document.querySelector(link.hash));
  let queued = false;

  function updateNavigation() {
    const threshold = Math.min(window.innerHeight * 0.3, 220);
    const current = sections.reduce(
      (active, section) => section.getBoundingClientRect().top <= threshold ? section : active,
      sections[0],
    );
    navigation.forEach((link) => {
      if (link.hash === `#${current.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    queued = false;
  }

  window.addEventListener("scroll", () => {
    if (!queued) {
      queued = true;
      window.requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });
  updateNavigation();
})();
