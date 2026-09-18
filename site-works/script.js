const works = [
  {
    id: 'bakubijo-engineer',
    title: '爆美女ちゃんとエンジニアくん',
    type: 'manga',
    year: '2026',
    cover: '../images/Creat/manga/0FF51AB6-77F6-436C-8F78-38AFD01A5DE2.PNG',
    fallback: 'linear-gradient(135deg, #f7b8d3, #8ec7ff 52%, #d9fbff)',
    images: [
      '../images/Creat/manga/0FF51AB6-77F6-436C-8F78-38AFD01A5DE2.PNG'
    ]
  },
  {
    id: 'manga-02',
    title: 'Manga 02',
    type: 'manga',
    year: '2026',
    cover: '',
    fallback: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(12,12,18,0.06))',
    images: []
  },
  {
    id: 'manga-03',
    title: 'Manga 03',
    type: 'manga',
    year: '2026',
    cover: '',
    fallback: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(12,12,18,0.04))',
    images: []
  },
  {
    id: 'manga-04',
    title: 'Manga 04',
    type: 'manga',
    year: '2026',
    cover: '',
    fallback: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(12,12,18,0.06))',
    images: []
  }
];

const pageName = document.body.dataset.page;

function renderWorksGrid() {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;

  works.forEach((work, index) => {
    const card = document.createElement('a');
    card.href = `read.html?id=${work.id}`;
    card.className = 'work-card';
    card.setAttribute('aria-label', `${work.title}を読む`);

    const isFirst = index === 0;
    const imageStyle = work.cover
      ? `background-image: url('${work.cover}'), ${work.fallback};`
      : `background-image: ${work.fallback};`;

    card.innerHTML = `
      <div class="card-frame">
        <div class="work-cover">
          <div class="cover-graphic" style="${imageStyle}"></div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderReader() {
  const readerContent = document.getElementById('readerContent');
  if (!readerContent) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const work = works.find(item => item.id === id) || works[0];

  if (!work.cover || !work.images || work.images.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'reader-empty';
    emptyState.innerHTML = '<div class="reader-empty-panel"></div>';
    readerContent.appendChild(emptyState);
    return;
  }

  const hero = document.createElement('div');
  hero.className = 'reader-hero';
  hero.innerHTML = `
    <div class="reader-cover" style="background-image: url('${work.cover}'); background-size: cover; background-position: center;"></div>
  `;

  const panels = document.createElement('div');
  panels.className = 'reader-panels';
  const imageList = work.images && work.images.length ? work.images : [work.cover];
  imageList.forEach((image) => {
    const panel = document.createElement('div');
    panel.className = 'reader-panel';
    panel.innerHTML = `
      <img src="${image}" alt="${work.title}" class="reader-image" />
    `;
    panels.appendChild(panel);
  });

  readerContent.appendChild(hero);
  readerContent.appendChild(panels);
}

if (pageName === 'works-index') {
  renderWorksGrid();
}

if (pageName === 'work-reader') {
  renderReader();
}

