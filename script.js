// List of images available in the `images/` folder.
// Add or remove entries as you add photos to the folder.
const images = [
  "images/5I5A7953.jpg",
  "images/5I5A8052.jpg",
  "images/5I5A8086.jpg",
  "images/5I5A8096.jpg",
  "images/5I5A8115.jpg",
  "images/5I5A8126.jpg",
  "images/5I5A8126_2.jpg",
  "images/5I5A8126_3.jpg",
  "images/IMG_2051.jpg",
  "images/IMG_3557.jpg",
  "images/IMG_4489.JPG",
  "images/IMG_4490.JPG",
  "images/IMG_4491.JPG",
  "images/IMG_4494.JPG",
  "images/IMG_4495.JPG",
  "images/IMG_4496.JPG",
  "images/IMG_7581 2.JPG",
  "images/IMG_8906.PNG",
  "images/souta1.jpg"
];

const thumbsContainer = document.getElementById("thumbs");
const selectedIcon = document.getElementById("selected-icon");
const selectedLabel = document.getElementById("selected-label");

// Target aspect ratios to classify images into groups.
const targets = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '3:4': 3 / 4,
  '9:16': 9 / 16
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

function classifyByRatio(items) {
  const groups = { '16:9': [], '4:3': [], '3:4': [], '9:16': [] };
  items.forEach(item => {
    const r = item.ratio || 1;
    // Find closest target ratio
    let bestKey = '16:9';
    let bestDiff = Infinity;
    for (const key in targets) {
      const diff = Math.abs(r - targets[key]);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestKey = key;
      }
    }
    groups[bestKey].push(item.src);
  });
  return groups;
}

function pickGroupForViewport() {
  const vr = window.innerWidth / Math.max(1, window.innerHeight);
  // find nearest target
  let bestKey = '16:9';
  let bestDiff = Infinity;
  for (const key in targets) {
    const diff = Math.abs(vr - targets[key]);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestKey = key;
    }
  }
  return bestKey;
}

function setBackgroundUrl(url) {
  document.body.style.backgroundImage = `url('${url}')`;
  if (selectedIcon) selectedIcon.src = url;
  if (selectedLabel) selectedLabel.textContent = url.replace(/^images\\//, "");
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

// On each page load, preload images, classify them, then pick a random image
// from the group that best matches the current viewport aspect ratio.
preloadImages(images).then(items => {
  const groups = classifyByRatio(items);
  const groupKey = pickGroupForViewport();
  const candidates = groups[groupKey].length ? groups[groupKey] : items.map(i => i.src);
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  setBackgroundUrl(pick);
  // build thumbnails (use full list for thumbs)
  createThumbs(items.map(i => i.src));
});

// Hide or remove the old random button behavior — the page now auto-randomizes on load.
const randomBtn = document.getElementById("randomBtn");
if (randomBtn) {
  randomBtn.style.display = 'none';
}
