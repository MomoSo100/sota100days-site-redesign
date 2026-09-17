const thumbsContainer = document.getElementById("thumbs");
const selectedIcon = document.getElementById("selected-icon");
const selectedLabel = document.getElementById("selected-label");

// base path is set per-page via <body data-img-root="...">. If not present, default to images/HomePage
const base = (document.body && document.body.dataset && document.body.dataset.imgRoot) ? document.body.dataset.imgRoot : 'images/HomePage';

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
  // thumbnails disabled — no-op
  return;
}

function getAllImageList() {
  return [...categoryImages.pc, ...categoryImages.tablet_h, ...categoryImages.tablet_v, ...categoryImages.phone];
}

// Try preload of the structured category images first. If none load, try a simple
// fallback list of images at the base folder (1.png..12.png).
preloadImages(getAllImageList()).then(items => {
  const loaded = items.filter(it => it.width > 0).map(it => it.src);
  const category = getCurrentCategory();

  const useFrom = (loaded.length > 0) ? loaded : null;

  const pickAndSet = (list) => {
    if (!list || !list.length) return;
    const pick = pickRandomImage(list);
    setBackgroundUrl(pick);
    if (thumbsContainer) createThumbs(list);
  };

  if (useFrom) {
    // Prefer images from the successful structured preload that match the current category.
    const categoryCandidates = useFrom.filter(src => src.includes(`/${category}/`));
    if (categoryCandidates.length) {
      pickAndSet(categoryCandidates);
      return;
    }
    pickAndSet(useFrom);
    return;
  }

  // Fallback: try base/1.png .. base/12.png
  const fallback = Array.from({length: 12}, (_,i) => `${base}/${i+1}.png`);
  preloadImages(fallback).then(fitems => {
    const good = fitems.filter(it => it.width > 0).map(it => it.src);
    if (good.length) {
      pickAndSet(good);
      return;
    }
    // As a last resort, don't change the existing CSS background.
  });
});

// Hide or remove the old random button behavior — the page now auto-randomizes on load.
const randomBtn = document.getElementById("randomBtn");
if (randomBtn) {
  randomBtn.style.display = 'none';
}
