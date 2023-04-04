var index = 0;
var hd = false;
var mobile = false;
var hasHD = false;
var playing = false;

window.onload = (e) => {
  if ("ontouchstart" in document.documentElement) {
    mobile = true;
  }
  setInterval(function () {
    const isCarouselHovered = document
      .getElementById("carousel-section")
      .matches(":hover");
    if (!isCarouselHovered) {
      index = (index + 1) % 3;
      carouselDot(index);
    }
  }, 7000);

  setInterval(function () {
    const videoPlaying = playing ? 0.11 : 0;
    addCounter(
      document.getElementById("toggle-darkmode").checked
        ? 0.003
        : 0.008 + videoPlaying,
      playing,
      false
    );
  }, 1000);
};

var player1, player2;

function onYouTubeIframeAPIReady() {
  player1 = new YT.Player("player-1", {
    host: "https://www.youtube-nocookie.com",
    videoId: "sdAPYnD5ptQ",
    width: "100%",
    rel: 0,
    playerVars: {
      origin: window.location.host,
    },
    events: { onStateChange: onPlayerStateChange },
  });

  player2 = new YT.Player("player-2", {
    host: "https://www.youtube-nocookie.com",
    videoId: "iL5_CEeCF8Q",
    width: "100%",
    rel: 0,
    playerVars: {
      origin: window.location.host,
    },
    events: { onStateChange: onPlayerStateChange },
  });
}

function onPlayerStateChange(event) {
  switch (event.data) {
    case 0:
    case 2:
      playing = false;
      console.log(event.data, event.target.playerInfo.currentTime);
      break;
    case 1:
      playing = true;
      console.log(1, event.target.playerInfo.currentTime);
      break;
  }
}

function addCounter(amount, displayPoints = true, fast = false) {
  const counter = document.getElementById("counter");
  if (displayPoints) addPoints(amount, fast, true);
  var currentAmount = parseFloat(counter.innerText);
  const newAmount = currentAmount + amount;
  var newAmountString = newAmount.toFixed(3);

  function run() {
    if (currentAmount < newAmount - 0.05) {
      currentAmount += 0.04;
      counter.innerText = currentAmount.toFixed(3);
    } else {
      clearInterval(timer);
    }
  }
  timer = setInterval(run, 50);
  counter.innerText = newAmountString;
}

function darkModeToggled() {
  const isDark = document.getElementById("toggle-darkmode").checked;
  addPoints(0.005, false, !isDark, "/s");
}

function addPoints(amount, fast = false, isBad = true, unit = "") {
  const points = document.getElementById("points");
  points.innerHTML = `${isBad ? "+ " : "- "} ${amount.toFixed(3)}${unit}`;
  points.style = `${
    isBad ? "color: var(--secondary)" : "color: var(--primary)"
  }; ${fast ? "transition: all 0.4s linear;" : "transition: all 2s linear;"}`;
  points.classList.add("active");
  setTimeout(() => {
    points.classList.add("animated");
    setTimeout(
      () => {
        points.classList.remove("active", "animated");
      },
      fast ? 750 : 2500
    );
  }, 250);
}

function maximizeInfo() {
  document.querySelector("body").classList.add("modal-open");
  document.getElementById("counter-container").classList.add("maximized");
}

function minimizeInfo() {
  document.querySelector("body").classList.remove("modal-open");
  document.getElementById("counter-container").classList.remove("maximized");
}

function minimizeInfoBg() {
  const isCounterHovered = document
    .getElementById("counter-box")
    .matches(":hover");
  if (!isCounterHovered) {
    document.querySelector("body").classList.remove("modal-open");
    document.getElementById("counter-container").classList.remove("maximized");
  }
}

function carouselDot(i) {
  index = i;
  const slides = Array.prototype.slice.call(
    document.getElementsByClassName("slide")
  );
  const prevActiveSlide = slides.filter((slide) =>
    slide.className.includes("active")
  )[0];
  const nextActiveSlide = slides[i];

  const dots = Array.prototype.slice.call(
    document.getElementsByClassName("dot")
  );
  const prevActiveDot = dots.filter((dot) =>
    dot.className.includes("active")
  )[0];
  const nextActiveDot = dots[i];
  if (prevActiveSlide && nextActiveSlide) {
    prevActiveDot.classList.remove("active");
    nextActiveDot.classList.add("active");
    transition(prevActiveSlide, nextActiveSlide);
  }
}

function modalSlide(id, offset) {
  const currentPageNode = document.querySelector(`#modal-${id} .current-page`);
  const currentPage = parseInt(currentPageNode.innerText) - 1;
  const totalPagesNode = document.querySelector(`#modal-${id} .total-pages`);
  const totalPages = parseInt(totalPagesNode.innerText);
  const nextPage = (currentPage + offset + totalPages) % totalPages;

  const slides = Array.prototype.slice.call(
    document.querySelectorAll(`#modal-${id} .modal-slide`)
  );

  const prevActiveSlide = slides[currentPage];
  const nextActiveSlide = slides[nextPage];

  prevActiveSlide.classList.remove("active");
  nextActiveSlide.classList.add("active");

  currentPageNode.innerText = (nextPage + 1).toString();
}

function transition(prevActiveSlide, nextActiveSlide) {
  const timing = mobile ? 200 : 800;
  prevActiveSlide.classList.add("transition", "out");
  setTimeout(() => {
    prevActiveSlide.classList.remove("active", "transition", "out");
    nextActiveSlide.classList.add("transition");
    setTimeout(() => {
      nextActiveSlide.classList.add("in", "transition");
      setTimeout(() => {
        nextActiveSlide.classList.remove("transition", "in");
        nextActiveSlide.classList.add("active");
      }, timing);
    }, 50);
  }, timing);
}

function closeModal(id) {
  document.getElementById(`modal-${id}`).classList.remove("active");
  document.querySelector("body").classList.remove("modal-open");
}

function closeModalBg(id) {
  const isModalHovered = document
    .getElementsByClassName("modal")
    [id - 1].matches(":hover");
  if (!isModalHovered) {
    document.getElementById(`modal-${id}`).classList.remove("active");
    document.querySelector("body").classList.remove("modal-open");
  }
}

function openModal(id) {
  document.getElementById(`modal-${id}`).classList.add("active");
  document.querySelector("body").classList.add("modal-open");
}

function toggleHD() {
  const button = document.getElementById("definition");
  const images = Array.prototype.slice.call(document.querySelectorAll("img"));
  if (!hd) {
    if (!hasHD) {
      addCounter(1.148);
      hasHD = true;
    }
    button.classList.add("active");

    for (const image of images) {
      if (image.src.match(".jpg")) {
        try {
          const imageName = image.src.split(".jpg");
          image.src = imageName.join("_hd.jpg");
        } catch (error) {
          console.log(error);
        }
      }
    }
  } else {
    button.classList.remove("active");

    for (const image of images) {
      if (image.src.match(".jpg") && image.src.match("_hd")) {
        const imageName = image.src.split("_hd.jpg");
        image.src = imageName.join(".jpg");
      }
    }
  }
  hd = !hd;
}

function carouselSlide(event) {
  const xClick = event.touches[0].pageX;
  this.addEventListener(
    "touchmove",
    function (event) {
      const xMove = event.touches[0].pageX;
      const sensitivityInPx = 5;

      if (Math.floor(xClick - xMove) > sensitivityInPx) {
        index = (index + 1) % 3;
        carouselDot(index);
      } else if (Math.floor(xClick - xMove) < -sensitivityInPx) {
        index = (index + 2) % 3;
        carouselDot(index);
      }
    },
    { once: true }
  );
}

function SmoothVerticalScrolling(e, time, where) {
  var eTop = e.getBoundingClientRect().top;
  console.log(eTop);
  var eAmt = eTop / 100;
  console.log(eAmt);
  var curTime = 0;
  while (curTime <= time) {
    window.setTimeout(SVS_B, curTime, eAmt, where);
    curTime += time / 100;
  }
}

function SVS_B(eAmt, where) {
  if (where == "center" || where == "") window.scrollBy(0, eAmt / 2);
  if (where == "top") window.scrollBy(0, eAmt);
}
