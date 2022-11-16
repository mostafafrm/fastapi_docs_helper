/*
  All this script does is to prevent the top announcement banner
  from shrinking, so the reader doesn't gets annoyed
  by all the text down the page jumping up and down.

  The banner can grow as it wants, but we set the
  highest hight it ever had and set it to min-hight
  on that DOM-element inline css style.

  If the browser window ever gets resized, we reset the min-height
  to 0.
*/

// Get the banner. this might changed and brake the script
const banner = document.querySelector(
  "div[data-md-component=announce] aside.md-banner"
);

/*
  Set the minHeight to the highest height
  the banner ever had, as the items change
*/
const adjustBanner = () => {
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
const observer = new MutationObserver(adjustBanner);
const config = { subtree: true, attributes: true, attributeFilter: ["style"] };
observer.observe(announce_wrapper, config);

/*
  Reset the banner minHeight
  every time window gets resized
*/
const handleWindowResize = () => {
  banner.style.minHeight = 0;
  adjustBanner(); // Set the initial height after reset.
};
window.addEventListener("resize", handleWindowResize);
