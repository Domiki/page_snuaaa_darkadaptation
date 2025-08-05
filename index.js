// loading sceen
Promise.all([
  new Promise((resolve) => window.addEventListener("load", resolve)),
  document.fonts.ready,
  new Promise((resolve) => {
    const video = document.querySelector("video");

    if (video.readyState >= 4) {
      resolve();
    } else {
      video.addEventListener("canplaythrough", resolve, { once: true });
    }
  }),
]).then(() => {
  const loader = document.getElementById("loading-screen");
  loader.classList.add("fade-out");

  setTimeout(() => {
    loader.style.display = "none";
  }, 1000);
});

// scroll
const page = document.getElementById("introduction-page");
const sections = page.querySelectorAll(":scope > div");
let currentIndex = 0;
let isAnimating = false;

function moveTo(index) {
  if (index < 0 || index >= sections.length || isAnimating) return;
  isAnimating = true;
  page.style.transform = `translateY(-${index * 100}vh)`;
  setTimeout(() => (isAnimating = false), 500);
  currentIndex = index;
}

window.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) moveTo(currentIndex + 1);
  else moveTo(currentIndex - 1);
});

// buttons
const introductionButton = document.getElementById("introduction-button");
const artistsButton = document.getElementById("artists-button");
const viewButton = document.getElementById("view-button");
const introductionPage = document.getElementById("introduction-page");
const artistsPage = document.getElementById("artists-page");
const viewPage = document.getElementById("view-page");

transitioning = false;
mode = 0;

function enablePage(page) {
  page.style.display = "block";
  page.style.zIndex = 1;
  setTimeout(() => {
    page.classList.add("active");
  }, 0);
}

function disablePage(page) {
  page.classList.remove("active");
  page.style.zIndex = 0;
  page.style.transform = "translateY(0vh)";
  setTimeout(() => {
    page.style.display = "none";
  }, 500);
}

function setPage(newMode) {
  if (newMode == mode) return;
  if (transitioning) return;

  transitioning = true;
  mode = newMode;
  if (mode == 0) {
    disablePage(introductionPage);
    disablePage(artistsPage);
    disablePage(viewPage);
  } else if (mode == 1) {
    enablePage(introductionPage);
    disablePage(artistsPage);
    disablePage(viewPage);
  } else if (mode == 2) {
    disablePage(introductionPage);
    enablePage(artistsPage);
    disablePage(viewPage);
  } else if (mode == 3) {
    disablePage(introductionPage);
    disablePage(artistsPage);
    enablePage(viewPage);
  }
  setTimeout(() => {
    transitioning = false;
  }, 500);
}

introductionButton.addEventListener("click", () => {
  setPage(1);
});

artistsButton.addEventListener("click", () => {
  setPage(2);
});

viewButton.addEventListener("click", () => {
  setPage(3);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setPage(0);
  }
});
