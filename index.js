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
          // HAVE_ENOUGH_DATA
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
    // 애니메이션 종료 후 display: none 처리하여 상호작용이 가능하도록 함
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
  const pages = document.querySelectorAll(".page");
  let activePage = null;
  let isTransitioning = false;

  // 페이지를 보여주거나 숨기는 함수
  const setPageVisibility = (pageId) => {
    if (isTransitioning) return;

    const targetPage = document.getElementById(pageId);

    // 이미 활성화된 페이지를 다시 클릭하면 닫기
    if (activePage === targetPage) {
      closeActivePage();
      return;
    }

    isTransitioning = true;

    // 이전에 열려있던 페이지 닫기
    if (activePage) {
      activePage.classList.remove("active");
    }

    // 새 페이지 열기
    if (targetPage) {
      activePage = targetPage;
      activePage.classList.add("active");
      activePage.scrollTop = 0; // 스크롤 위치 초기화
      closeButton.classList.add("visible"); // 닫기 버튼 보이기
    } else {
      activePage = null;
      closeButton.classList.remove("visible"); // 닫기 버튼 숨기기
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 500); // CSS transition 시간과 일치
  };

  // 열려있는 페이지를 닫는 함수
  const closeActivePage = () => {
    if (activePage && !isTransitioning) {
      isTransitioning = true;
      activePage.classList.remove("active");
      closeButton.classList.remove("visible"); // 닫기 버튼 숨기기
      activePage = null;
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
  };

  // 닫기 버튼 이벤트 리스너
  closeButton.addEventListener("click", () => {
    closeActivePage();
  });

  // 네비게이션 버튼 이벤트 리스너
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const pageId = button.dataset.page;
      setPageVisibility(pageId);
    });
  });

  // ESC 키로 페이지 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeActivePage();
    }
  });
});
