const thumbsContainer = document.getElementById("thumbs");
const selectedIcon = document.getElementById("selected-icon");
const selectedLabel = document.getElementById("selected-label");

const base = (document.body && document.body.dataset && document.body.dataset.imgRoot)
  ? document.body.dataset.imgRoot
  : '../images/Information';

const categoryImages = {
  pc: [
    `${base}/1.png`, `${base}/2.png`, `${base}/4.png`, `${base}/5_pro.png`, `${base}/8.png`, `${base}/9.png`, `${base}/9495_pro.JPG`, `${base}/9497_pro.JPG`
  ],
  tablet_h: [
    `${base}/1.png`, `${base}/2.png`, `${base}/4.png`, `${base}/5_pro.png`, `${base}/8.png`, `${base}/9.png`, `${base}/9495_pro.JPG`, `${base}/9497_pro.JPG`
  ],
  tablet_v: [
    `${base}/1.png`, `${base}/2.png`, `${base}/4.png`, `${base}/5_pro.png`, `${base}/8.png`, `${base}/9.png`, `${base}/9495_pro.JPG`, `${base}/9497_pro.JPG`
  ],
  phone: [
    `${base}/1.png`, `${base}/2.png`, `${base}/4.png`, `${base}/5_pro.png`, `${base}/8.png`, `${base}/9.png`, `${base}/9495_pro.JPG`, `${base}/9497_pro.JPG`
  ]
};

const viewToCategory = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (vw >= 1200) return 'pc';
  if (vw <= 640) return 'phone';
  return vw >= vh ? 'tablet_h' : 'tablet_v';
};

function preloadImages(list) {
  return Promise.all(list.map(src => new Promise(resolve => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve({ src, width: img.naturalWidth, height: img.naturalHeight, ratio: img.naturalWidth / img.naturalHeight });
    img.onerror = () => resolve({ src, width: 0, height: 0, ratio: 1 });
  })));
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
  if (selectedLabel) selectedLabel.textContent = url.replace(/^\.\.\/images\//, '');

  document.querySelectorAll('.thumb').forEach(thumb => thumb.classList.remove('active'));
  const activeThumb = Array.from(document.querySelectorAll('.thumb img')).find(img => img.src && img.src.includes(url));
  if (activeThumb && activeThumb.parentElement) activeThumb.parentElement.classList.add('active');
}

function createThumbs(list) {
  return;
}

function getAllImageList() {
  return [...categoryImages.pc, ...categoryImages.tablet_h, ...categoryImages.tablet_v, ...categoryImages.phone];
}

const runGeneralLogic = () => {
  preloadImages(getAllImageList()).then(items => {
    const loaded = items.filter(it => it.width > 0).map(it => it.src);
    const category = getCurrentCategory();
    const pickAndSet = (list) => {
      if (!list || !list.length) return;
      const pick = pickRandomImage(list);
      setBackgroundUrl(pick);
      if (thumbsContainer) createThumbs(list);
    };

    if (loaded.length) {
      const categoryCandidates = loaded.filter(src => src.includes(`/${category}/`));
      if (categoryCandidates.length) {
        pickAndSet(categoryCandidates);
        return;
      }
      pickAndSet(loaded);
      return;
    }

    const fallback = [
      `${base}/1.png`, `${base}/2.png`, `${base}/4.png`, `${base}/5_pro.png`, `${base}/8.png`, `${base}/9.png`,
      `${base}/9495_pro.JPG`, `${base}/9497_pro.JPG`
    ];
    preloadImages(fallback).then(fitems => {
      const good = fitems.filter(it => it.width > 0).map(it => it.src);
      if (good.length) pickAndSet(good);
    });
  });
};

if (base && base.toLowerCase().includes('information')) {
  const markers = ['_pro', '_prio'];
  const prioCandidates = [];

  for (const marker of markers) {
    for (let i = 1; i <= 12; i++) {
      prioCandidates.push(`${base}/${i}${marker}.png`);
      prioCandidates.push(`${base}/${i}${marker}.jpg`);
      prioCandidates.push(`${base}/${i}${marker}.JPG`);
    }
    prioCandidates.push(`${base}/9495${marker}.JPG`, `${base}/9495${marker}.jpg`);
    prioCandidates.push(`${base}/9497${marker}.JPG`, `${base}/9497${marker}.jpg`);
  }

  const fallback = [
    `${base}/1.png`, `${base}/2.png`, `${base}/4.png`, `${base}/5_pro.png`, `${base}/8.png`, `${base}/9.png`,
    `${base}/9495_pro.JPG`, `${base}/9497_pro.JPG`, `${base}/1.jpg`, `${base}/2.jpg`, `${base}/4.jpg`, `${base}/8.jpg`, `${base}/9.jpg`
  ];

  preloadImages(prioCandidates).then(items => {
    const good = items.filter(it => it.width > 0).map(it => it.src);
    if (good.length) {
      const weighted = good.flatMap(src => [src, src, src]);
      setBackgroundUrl(pickRandomImage(weighted));
      setInterval(() => setBackgroundUrl(pickRandomImage(weighted)), 6000);
      if (thumbsContainer) createThumbs(weighted);
      return;
    }

    preloadImages(fallback).then(fitems => {
      const good2 = fitems.filter(it => it.width > 0).map(it => it.src);
      if (good2.length) {
        const weighted2 = good2.flatMap(src => [src, src]);
        setBackgroundUrl(pickRandomImage(weighted2));
        setInterval(() => setBackgroundUrl(pickRandomImage(weighted2)), 6000);
        if (thumbsContainer) createThumbs(weighted2);
        return;
      }
      runGeneralLogic();
    });
  }).catch(() => runGeneralLogic());
} else {
  runGeneralLogic();
}

const randomBtn = document.getElementById('randomBtn');
if (randomBtn) randomBtn.style.display = 'none';
