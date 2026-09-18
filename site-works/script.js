const works = [
  {
    id: 'bakubijo-engineer',
    title: '爆美女ちゃんとエンジニアくん',
    type: 'manga',
    year: '2026',
    cover: '../images/Creat/manga/0FF51AB6-77F6-436C-8F78-38AFD01A5DE2.PNG',
    fallback: 'linear-gradient(135deg, #f7b8d3, #8ec7ff 52%, #d9fbff)',
    pages: [
      '新しいプロジェクトが始まる日、爆美女ちゃんはいつものようにサングラスをかけて登場した。',
      '一方、エンジニアくんは、思い切りコーヒーをこぼしてしまうほどドキドキしていた。',
      '二人の間で、単なる仕事よりも大きいものが、少しずつ形を作っていく。',
      'そして、たった一行のコードが、世界を少しだけ明るく変えるのだった。'
    ]
  },
  {
    id: 'manga-02',
    title: 'Manga 02',
    type: 'manga',
    year: '2026',
    cover: '../images/Creat/manga/02.jpg',
    fallback: 'linear-gradient(135deg, #9ec5ff, #c7d9ff 45%, #dfe8ff)',
    pages: [
      '小さな気づきが、偶然の出会いを生んだ。',
      '遠くにある景色が、少しだけ近く見えてきた。',
      '次の一歩を踏み出すその時、思いがけない笑顔が待っている。'
    ]
  },
  {
    id: 'manga-03',
    title: 'Manga 03',
    type: 'manga',
    year: '2026',
    cover: '../images/Creat/manga/03.jpg',
    fallback: 'linear-gradient(135deg, #8de4bd, #d2f6d1 45%, #f8f6cc)',
    pages: [
      '空が変わる前に、心の色が少しだけ揺れた。',
      '静かな時間が、たくさんのことを教えてくれる。',
      'そして、終わりのように見えていた日も、また始まっていた。'
    ]
  },
  {
    id: 'manga-04',
    title: 'Manga 04',
    type: 'manga',
    year: '2026',
    cover: '../images/Creat/manga/04.jpg',
    fallback: 'linear-gradient(135deg, #ffcc99, #ffd9f2 45%, #f6f2ff)',
    pages: [
      '誰のためでもない、ただのひとときが、胸の奥を温かくした。',
      'そこで見つけた小さな笑顔が、次の日へ続いていく。',
      '何も言わなくていい。今日の気持ちだけ、ちゃんと残しておこう。'
    ]
  }
];

const pageName = document.body.dataset.page;

function renderWorksGrid() {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;

  works.forEach((work) => {
    const card = document.createElement('a');
    card.href = `read.html?id=${work.id}`;
    card.className = 'work-card';
    card.setAttribute('aria-label', `${work.title}を読む`);

    const imageStyle = `background-image: url('${work.cover}'), ${work.fallback};`;
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

  const header = document.createElement('div');
  header.className = 'reader-hero';
  header.innerHTML = `
    <div class="reader-cover" style="--cover-gradient:${work.cover};"></div>
    <div>
      <div class="reader-tag">${work.type}</div>
      <h2>${work.title}</h2>
      <p class="reader-summary">${work.summary}</p>
    </div>
  `;

  const panels = document.createElement('div');
  panels.className = 'reader-panels';
  work.pages.forEach((page, index) => {
    const panel = document.createElement('div');
    panel.className = 'reader-panel';
    panel.innerHTML = `
      <span class="panel-label">${index + 1}</span>
      <p>${page}</p>
    `;
    panels.appendChild(panel);
  });

  readerContent.appendChild(header);
  readerContent.appendChild(panels);
}

if (pageName === 'works-index') {
  renderWorksGrid();
}

if (pageName === 'work-reader') {
  renderReader();
}

