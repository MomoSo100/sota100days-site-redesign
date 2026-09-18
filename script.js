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

  // Use Bootstrap-like breakpoints: >=992px -> pc, <=767px -> phone, else tablets
  if (vw >= 992) {
    return 'pc';
  }
  if (vw <= 767) {
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

// Attempt homepage-specific curated list first; if successful, use it and
// skip the general selection to avoid overwrites. Otherwise fall back to the
// general category-based logic.
const runGeneralLogic = () => {
  // General logic for other pages or fallback when HomePage images are unavailable.
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
      const categoryCandidates = useFrom.filter(src => src.includes(`/${category}/`));
      if (categoryCandidates.length) {
        pickAndSet(categoryCandidates);
        return;
      }
      pickAndSet(useFrom);
      return;
    }

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
};

if (base && base.includes('HomePage')) {
  // Duplicate entries to increase selection probability for preferred images
  const homeList = [
    `${base}/9496.JPG`,
    `${base}/9496.JPG`,
    `${base}/12.png`,
    `${base}/12.png`,
    `${base}/6.png`,
    `${base}/6.png`
  ];
  preloadImages(homeList).then(items => {
    const good = items.filter(it => it.width > 0).map(it => it.src);
    if (good.length) {
      // pick one immediately, then rotate every 6s
      setBackgroundUrl(pickRandomImage(good));
      setInterval(() => setBackgroundUrl(pickRandomImage(good)), 6000);
      if (thumbsContainer) createThumbs(good);
      return;
    }
    // none of the curated home images were available — run the general logic
    runGeneralLogic();
  }).catch(() => { runGeneralLogic(); });
} else {
  runGeneralLogic();
}

// If this page points at the Information images folder, prefer any files
// that have `_pro` or `_prio` markers (e.g. `9495_pro.JPG`, `1_prio.png`),
// and use the same candidate list regardless of viewport (mobile/PC).
if (base && base.toLowerCase().includes('information')) {
  const markers = ['_pro', '_prio'];
  const prioCandidates = [];
  // try multiple extensions for numbered files and large JPGs
  for (const marker of markers) {
    for (let i = 1; i <= 12; i++) {
      prioCandidates.push(`${base}/${i}${marker}.png`);
      prioCandidates.push(`${base}/${i}${marker}.jpg`);
      prioCandidates.push(`${base}/${i}${marker}.JPG`);
    }
    prioCandidates.push(`${base}/9495${marker}.JPG`, `${base}/9495${marker}.jpg`);
    prioCandidates.push(`${base}/9497${marker}.JPG`, `${base}/9497${marker}.jpg`);
  }

  // prepare lower-priority fallbacks without markers
  const fallback = [];
  for (let i = 1; i <= 12; i++) {
    fallback.push(`${base}/${i}.png`);
    fallback.push(`${base}/${i}.jpg`);
    fallback.push(`${base}/${i}.JPG`);
  }
  fallback.push(`${base}/9495.JPG`, `${base}/9495.jpg`, `${base}/9497.JPG`, `${base}/9497.jpg`);

  // Try marked candidates first
  preloadImages(prioCandidates).then(items => {
    console.log('[prio] candidates:', prioCandidates);
    console.log('[prio] preload results:', items.map(i=>({src:i.src,width:i.width,ok:i.width>0})));
    // mobile-friendly debug panel: create or update an on-page overlay to show results
    try {
      let panel = document.getElementById('prio-debug');
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'prio-debug';
        panel.style.position = 'fixed';
        panel.style.right = '8px';
        panel.style.bottom = '8px';
        panel.style.zIndex = 9999;
        panel.style.maxWidth = '48vw';
        panel.style.maxHeight = '40vh';
        panel.style.overflow = 'auto';
        panel.style.background = 'rgba(0,0,0,0.7)';
        panel.style.color = '#fff';
        panel.style.fontSize = '12px';
        panel.style.padding = '8px';
        panel.style.borderRadius = '6px';
        panel.style.backdropFilter = 'blur(4px)';
        document.body.appendChild(panel);
      }
      panel.innerHTML = '<strong>prio candidates</strong><br/>' + prioCandidates.map(p=>p.replace(/^.*\//,'')).join(', ') + '<br/><br/>' +
        '<strong>results</strong><br/>' + items.map(i=>`${i.src.replace(/^.*\//,'')} → ${i.width>0 ? 'OK' : 'ERR'}`).join('<br/>') +
        '<br/><br/><small>Remove debug by deleting #prio-debug or reverting script.js</small>';
    } catch(e) { console.warn('prio debug panel failed', e); }

    const good = items.filter(it => it.width > 0).map(it => it.src);
    if (good.length) {
      // weight priority images heavily so they show up on both mobile and desktop
      const weighted = good.flatMap(src => [src, src, src, src]);
      setBackgroundUrl(pickRandomImage(weighted));
      setInterval(() => setBackgroundUrl(pickRandomImage(weighted)), 6000);
      if (thumbsContainer) createThumbs(weighted);
      return;
    }

    // no marked images found — try fallback unmarked files
    preloadImages(fallback).then(fitems => {
      console.log('[prio] fallback results:', fitems.map(i=>({src:i.src,width:i.width,ok:i.width>0})));
      const good2 = fitems.filter(it => it.width > 0).map(it => it.src);
      if (good2.length) {
        const weighted2 = good2.flatMap(src => [src, src]);
        setBackgroundUrl(pickRandomImage(weighted2));
        setInterval(() => setBackgroundUrl(pickRandomImage(weighted2)), 6000);
        if (thumbsContainer) createThumbs(weighted2);
        return;
      }
      // nothing available — leave to general logic or CSS
    }).catch(()=>{});
  }).catch(() => {});
}

// Hide or remove the old random button behavior — the page now auto-randomizes on load.
const randomBtn = document.getElementById("randomBtn");
if (randomBtn) {
  randomBtn.style.display = 'none';
}
