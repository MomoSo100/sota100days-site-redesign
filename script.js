const thumbsContainer = document.getElementById("thumbs");
const selectedIcon = document.getElementById("selected-icon");
const selectedLabel = document.getElementById("selected-label");

// base path is set per-page via <body data-img-root="...">. If not present, default to images/home
const base = (document.body && document.body.dataset && document.body.dataset.imgRoot) ? document.body.dataset.imgRoot : 'images/home';

const buildRange = (folder, count) => Array.from({length: count}, (_,i)=> `${base}/${folder}/${i+1}.png`);

const categoryImages = {
  pc: buildRange('pc', 8),
  tablet_h: buildRange('tablet_h', 10),
  tablet_v: buildRange('tablet_v', 9),
  phone: buildRange('phone', 12)
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
  if (!thumbsContainer) return;
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
  const candidates = (categoryImages[category] && categoryImages[category].length) ? categoryImages[category] : getAllImageList();
  const pick = pickRandomImage(candidates);
  setBackgroundUrl(pick);
  if (thumbsContainer) createThumbs(getAllImageList());
});

// Hide or remove the old random button behavior — the page now auto-randomizes on load.
const randomBtn = document.getElementById("randomBtn");
if (randomBtn) {
  randomBtn.style.display = 'none';
}
