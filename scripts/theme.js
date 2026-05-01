(function () {
  const themes = new Set(["ember", "ocean"]);
  const savedTheme = localStorage.getItem("doghouse-theme");
  const initialTheme = themes.has(savedTheme) ? savedTheme : "ember";
  const themeLink = document.querySelector("[data-theme-link]");
  const controls = document.querySelectorAll("[data-theme-select]");

  function applyTheme(theme) {
    if (!themes.has(theme)) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    localStorage.setItem("doghouse-theme", theme);

    if (themeLink) {
      themeLink.setAttribute("href", `/styles/${theme}.css`);
    }

    controls.forEach((control) => {
      control.value = theme;
    });
  }

  controls.forEach((control) => {
    control.addEventListener("change", (event) => {
      applyTheme(event.target.value);
    });
  });

  applyTheme(initialTheme);
})();
