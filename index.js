document.addEventListener("DOMContentLoaded", () => {
  // --- 로딩 스크린 관리 ---
  const videoElement = document.querySelector(".video");
  const assetPromises = [
    new Promise((resolve) => window.addEventListener("load", resolve)),
    document.fonts.ready,
  ];

  if (videoElement) {
    assetPromises.push(
      new Promise((resolve) => {
        if (videoElement.readyState >= 4) {
          resolve();
        } else {
          videoElement.addEventListener("canplaythrough", resolve, {
            once: true,
          });
        }
      })
    );
  }

  Promise.all(assetPromises).then(() => {
    const loader = document.getElementById("loading-screen");
    loader.classList.add("fade-out");
    loader.addEventListener(
      "transitionend",
      () => {
        loader.style.display = "none";
      },
      { once: true }
    );
  });

  // --- 페이지 전환 관리 ---
  const navButtons = document.querySelectorAll("nav button");
  const closeButton = document.getElementById("close-page-button");
  const scrollTopBtn = document.getElementById("scroll-to-top-btn");
  const pages = document.querySelectorAll(".page");
  let activePage = null;
  let isTransitioning = false;

  const setPageVisibility = (pageId) => {
    if (isTransitioning) return;
    const targetPage = document.getElementById(pageId);
    if (activePage === targetPage) {
      closeActivePage();
      return;
    }
    isTransitioning = true;
    if (activePage) {
      activePage.classList.remove("active");
    }

    scrollTopBtn.classList.remove("visible");

    if (targetPage) {
      activePage = targetPage;
      activePage.classList.add("active");
      closeButton.classList.add("visible");
      activePage.scrollTop = 0;

      if (activePage.id === "view-page") {
        scrollTopBtn.classList.add("visible");
      }
    } else {
      activePage = null;
    }
    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  };

  const closeActivePage = () => {
    if (activePage && !isTransitioning) {
      isTransitioning = true;
      activePage.classList.remove("active");
      closeButton.classList.remove("visible");
      scrollTopBtn.classList.remove("visible");
      activePage = null;
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
  };

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setPageVisibility(button.dataset.page);
    });
  });

  closeButton.addEventListener("click", closeActivePage);

  // --- View 페이지 기능 ---
  // 1. 이미지 갤러리
  const galleries = document.querySelectorAll(".artwork-gallery");
  galleries.forEach((gallery) => {
    const mainImage = gallery.querySelector(".main-image-container img");
    const thumbnails = gallery.querySelectorAll(".thumbnail-container img");

    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        mainImage.src = thumb.src;
        thumbnails.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });
  });

  // 2. 전체화면 이미지 모달
  const modal = document.getElementById("fullscreen-modal");
  const modalImage = modal.querySelector("img");
  const closeModalBtn = modal.querySelector(".close-modal-btn");

  document.querySelectorAll(".main-image-container").forEach((container) => {
    container.addEventListener("click", () => {
      modalImage.src = container.querySelector("img").src;
      modal.classList.add("visible");
    });
  });

  const closeModal = () => modal.classList.remove("visible");
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // 3. 커스텀 오디오 플레이어
  document.querySelectorAll(".audio-player").forEach((player) => {
    const audio = player.querySelector("audio");
    const playPauseBtn = player.querySelector(".play-pause-btn");
    const playIcon = player.querySelector(".play-icon");
    const pauseIcon = player.querySelector(".pause-icon");
    const progressBar = player.querySelector(".progress-bar");
    const progressBarContainer = player.querySelector(
      ".progress-bar-container"
    );
    const timeDisplay = player.querySelector(".time-display");

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    playPauseBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    });

    audio.addEventListener("pause", () => {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    });

    audio.addEventListener("timeupdate", () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progress}%`;
      const remainingTime = audio.duration - audio.currentTime;
      timeDisplay.textContent = formatTime(remainingTime || 0);
    });

    audio.addEventListener("loadedmetadata", () => {
      timeDisplay.textContent = formatTime(audio.duration);
    });

    progressBarContainer.addEventListener("click", (e) => {
      const barWidth = progressBarContainer.clientWidth;
      const clickX = e.offsetX;
      audio.currentTime = (clickX / barWidth) * audio.duration;
    });
  });

  // 4. 작품 내비게이션 스크롤
  document
    .querySelectorAll("#artwork-nav-container button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.dataset.target;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });

  // 5. 맨 위로 가기 버튼
  scrollTopBtn.addEventListener("click", () => {
    if (activePage) {
      activePage.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // --- ESC 키로 페이지 및 모달 닫기 ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal.classList.contains("visible")) {
        closeModal();
      } else {
        closeActivePage();
      }
    }
  });
});
