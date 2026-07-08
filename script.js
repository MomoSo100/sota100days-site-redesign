const thumbsContainer = document.getElementById("thumbs");
const selectedIcon = document.getElementById("selected-icon");
const selectedLabel = document.getElementById("selected-label");

const categoryImages = {
  pc: [
    // 横長PC用画像をここに追加
  ],
  tablet_h: [
    "images/tablet_h/5I5A8126_2.jpg",
    "images/tablet_h/IMG_4490.JPG",
    "images/tablet_h/IMG_4491.JPG",
    "images/tablet_h/IMG_4494.JPG",
    "images/tablet_h/IMG_4495.JPG",
    "images/tablet_h/IMG_4496.JPG"
  ],
  tablet_v: [
    "images/tablet_v/5I5A7953.jpg",
    "images/tablet_v/5I5A8052.jpg",
    "images/tablet_v/5I5A8086.jpg",
    "images/tablet_v/5I5A8096.jpg",
    "images/tablet_v/5I5A8115.jpg",
    "images/tablet_v/5I5A8126.jpg",
    "images/tablet_v/5I5A8126_3.jpg",
    "images/tablet_v/IMG_2051.jpg",
    "images/tablet_v/IMG_3557.jpg",
    "images/tablet_v/IMG_4489.JPG",
    "images/tablet_v/IMG_7581 2.JPG",
    "images/tablet_v/IMG_8906.PNG",
    "images/tablet_v/souta1.jpg"
  ],
  phone: [
    // スマホ用画像をここに追加
  ]
};

const viewToCategory = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const ratio = vw / Math.max(vh, 1);

  if (ratio >= 1.5) {
    return 'pc';
  }
  if (ratio >= 1.2) {
    return 'tablet_h';
  }
  if (ratio >= 0.75) {
    return 'tablet_v';
  }
  return 'phone';
};

// Preload images and read their natural sizes to determine aspect ratios.
function preloadImages(list) {
  const promises = list.map(src => new Promise(resolve => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve({ src, width: img.naturalWidth, height: img.naturalHeight, ratio: img.naturalWidth / img.naturalHeight });
    img.onerror = () => resolve({ src, width: 0, height: 0, ratio: 1 });
  }));
  return Promise.all(promises);
}

function getCurrentCategory() {
  return viewToCategory();
}

function pickRandomImage(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function setBackgroundUrl(url) {
  document.body.style.backgroundImage = `url('${url}')`;
  if (selectedIcon) selectedIcon.src = url;
  if (selectedLabel) selectedLabel.textContent = url.replace(/^images\//, "");
  // update active thumb
  document.querySelectorAll(".thumb").forEach(thumb => thumb.classList.remove('active'));
  const activeThumb = Array.from(document.querySelectorAll('.thumb img')).find(img => img.src && img.src.includes(url));
  if (activeThumb && activeThumb.parentElement) activeThumb.parentElement.classList.add('active');
}

function createThumbs(list) {
  thumbsContainer.innerHTML = '';
  list.forEach((src, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "thumb";
    thumb.addEventListener("click", () => setBackgroundUrl(src));

    const img = document.createElement("img");
    img.src = src;
    img.alt = `背景候補 ${index + 1}`;

    thumb.appendChild(img);
    thumbsContainer.appendChild(thumb);
  });
}

function getAllImageList() {
  return [...categoryImages.pc, ...categoryImages.tablet_h, ...categoryImages.tablet_v, ...categoryImages.phone];
}

preloadImages(getAllImageList()).then(items => {
  const category = getCurrentCategory();
  const candidates = categoryImages[category].length ? categoryImages[category] : getAllImageList();
  const pick = pickRandomImage(candidates);
  setBackgroundUrl(pick);
  createThumbs(getAllImageList());
});

// Hide or remove the old random button behavior — the page now auto-randomizes on load.
const randomBtn = document.getElementById("randomBtn");
if (randomBtn) {
  randomBtn.style.display = 'none';
}
