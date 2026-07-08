const thumbsContainer = document.getElementById("thumbs");
const selectedIcon = document.getElementById("selected-icon");
const selectedLabel = document.getElementById("selected-label");

const categoryImages = {
  pc: [
    "images/pc/1.png",
    "images/pc/2.png",
    "images/pc/3.png",
    "images/pc/4.png",
    "images/pc/5.png",
    "images/pc/6.png",
    "images/pc/7.png",
    "images/pc/8.png"
  ],
  tablet_h: [
    "images/tablet_h/1.png",
    "images/tablet_h/2.png",
    "images/tablet_h/3.png",
    "images/tablet_h/4.png",
    "images/tablet_h/5.png",
    "images/tablet_h/6.png",
    "images/tablet_h/7.png",
    "images/tablet_h/8.png",
    "images/tablet_h/9.png",
    "images/tablet_h/10.png"
  ],
  tablet_v: [
    "images/tablet_v/1.png",
    "images/tablet_v/2.png",
    "images/tablet_v/3.png",
    "images/tablet_v/4.png",
    "images/tablet_v/5.png",
    "images/tablet_v/6.png",
    "images/tablet_v/7.png",
    "images/tablet_v/8.png",
    "images/tablet_v/9.png"
  ],
  phone: [
    "images/phone/1.png",
    "images/phone/2.png",
    "images/phone/3.png",
    "images/phone/4.png",
    "images/phone/5.png",
    "images/phone/6.png",
    "images/phone/7.png",
    "images/phone/8.png",
    "images/phone/9.png",
    "images/phone/10.png",
    "images/phone/11.png",
    "images/phone/12.png"
  ]
};

const viewToCategory = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (vw >= 1200) {
    return 'pc';
  }
  if (vw <= 640) {
    return 'phone';
  }
  return vw >= vh ? 'tablet_h' : 'tablet_v';
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
