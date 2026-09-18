const works = [
  {
    id: 'night-bloom',
    title: 'Night Bloom',
    type: 'short story',
    year: '2026',
    summary: '都会の夜、眠れない少女が見つけた小さな光の行き先を描く作品です。',
    cover: 'linear-gradient(135deg, #f7b8d3, #8ec7ff 52%, #d9fbff)',
    pages: [
      '真夜中、駅のホームに一人で立っていた。青い蛍光灯だけが、遠くの街を静かに照らしている。',
      '彼女はいつも、眠れない夜に同じ場所に来る。誰にも言わない、小さな約束を持っているから。',
      'その夜、ベンチの隅に置かれていた小さな花が、まるで目を覚ましたように光を放った。',
      '花の先に見えるのは、明日が来る前の、少しだけ透明な世界だった。'
    ]
  },
  {
    id: 'rainy-signal',
    title: 'Rainy Signal',
    type: 'comic',
    year: '2025',
    summary: '信号が一度だけ変わる朝、別れのような出会いが始まる物語。',
    cover: 'linear-gradient(135deg, #9ec5ff, #c7d9ff 45%, #dfe8ff)',
    pages: [
      '雨が降る駅で、彼はいつも傘を忘れる。だが、その日だけ、傘を持っていた。',
      '彼女は信号が青になる瞬間を待っていた。もう一度だけ、未来に触れたかったから。',
      '歩き出した瞬間、街の色が少しだけ変わった。たぶん、それは別れの色だった。',
      '二人は小さな交差点で、見えない言葉をひとつずつ受け取った。'
    ]
  },
  {
    id: 'paper-sky',
    title: 'Paper Sky',
    type: 'illustration',
    year: '2024',
    summary: '紙飛行機が描く、別の空を追いかける青春の一枚。',
    cover: 'linear-gradient(135deg, #8de4bd, #d2f6d1 45%, #f8f6cc)',
    pages: [
      '紙飛行機は、空を飛ぶたびに少しだけ大人になっていく。',
      '誰も見ていない場所で、風に触れながら、遠くに向かう小さな夢を描いていた。',
      'ひとつ飛ばしたあと、もうひとつ、別の夢が残る。',
      'そして夜が来ると、風の向きが少し変わって、また飛ばしたくなる。'
    ]
  },
  {
    id: 'echo-room',
    title: 'Echo Room',
    type: 'mini series',
    year: '2026',
    summary: '部屋の音が、思い出を育てる。あの頃の声を探す物語。',
    cover: 'linear-gradient(135deg, #ffcc99, #ffd9f2 45%, #f6f2ff)',
    pages: [
      '古い部屋には、いつも足音の余韻が残っている。',
      '誰もいないはずの部屋で、どこかで聞いた声が反響していた。',
      '鏡の向こうに見えるのは、まだ変わっていない自分の姿。',
      '思い出は少しずつ、今の自分へ帰ってきた。'
    ]
  },
  {
    id: 'moon-archive',
    title: 'Moon Archive',
    type: 'storyboard',
    year: '2025',
    summary: '月に残されたメモリーを拾う、静かな冒険の記録。',
    cover: 'linear-gradient(135deg, #b8a8ff, #e9d7ff 46%, #fcedff)',
    pages: [
      '月の裏側には、見えない日記が眠っていると信じていた。',
      '星の粒をひとつずつ集めると、昔の自分の声が少しだけ聞こえてくる。',
      'その声には、まだ言い切れない感情がきれいに閉じ込められていた。',
      '夜が終わるころ、月は静かに、忘れないように光っていた。'
    ]
  },
  {
    id: 'glow-tract',
    title: 'Glow Tract',
    type: 'visual essay',
    year: '2024',
    summary: '歩道を照らす小さな光が、日常の輪郭を変えていく作品。',
    cover: 'linear-gradient(135deg, #ffb57a, #ffd7a9 44%, #fff3cf)',
    pages: [
      'ずっと歩いていた道が、ある日だけ少し明るく見えた。',
      '電灯の下で、影の形がほんの少しだけ人間らしく見えた。',
      '足元に残る明かりは、その日の気分をきれいに包んでいた。',
      '帰り道の見えなかった景色が、少しだけ見えるようになった。'
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
    card.innerHTML = `
      <div class="card-frame">
        <div class="work-cover" style="--cover-gradient:${work.cover};">
          <div class="cover-graphic"></div>
        </div>
        <div class="meta">
          <span>${work.type}</span>
          <span>${work.year}</span>
        </div>
        <h2>${work.title}</h2>
        <p>${work.summary}</p>
        <span class="read-link">読んでみる →</span>
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

