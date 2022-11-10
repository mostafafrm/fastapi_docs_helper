const banner = document.querySelector(
  "div[data-md-component=announce] aside.md-banner"
);

/*
  Set the minHeight to the highest height
  the banner ever had, as the items change
*/
const handleStyleChange = () => {
  const height = banner.offsetHeight;
  const minHeight = parseInt(banner.style.minHeight) || 0;
  if (height > minHeight) banner.style.minHeight = `${height}px`;
};

/*
  Watch for style changes in items inside the banner
  see:
  https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe
*/
const announce_wrapper = banner
  .querySelector("div.md-banner__inner.md-grid.md-typeset")
  .querySelector("div.announce-wrapper");
const observer = new MutationObserver(handleStyleChange);
const config = { subtree: true, attributes: true, attributeFilter: ["style"] };
observer.observe(announce_wrapper, config);

/*
  Reset the banner minHeight
  every time window gets resized
*/
const handleWindowResize = () => {
  banner.style.minHeight = 0;
};
window.addEventListener("resize", handleWindowResize);
