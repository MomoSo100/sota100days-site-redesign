const fortunes = [
  '大吉：今日はいいことが起こるかも',
  '吉：少しだけ運がいい日',
  '中吉：いい感じで進みます',
  '小吉：小さな幸運がありそう',
  '凶：あまり深く考えないでおくと吉'
];

const messages = [
  '今日も最高だ！',
  'ちょっとだけおしゃれにやる',
  'やる気はもう十分だ',
  '進むぞ、気にしない',
  'たまには気楽にいこう'
];

const colors = [
  '#ff8bd8', '#ffd166', '#7ec8ff', '#7ef0c6', '#ff9f6e', '#b0a8ff'
];

const fortuneBtn = document.getElementById('fortune-btn');
const fortuneResult = document.getElementById('fortune-result');
const colorBtn = document.getElementById('color-btn');
const colorSwatch = document.getElementById('color-swatch');
const messageBtn = document.getElementById('message-btn');
const messageResult = document.getElementById('message-result');

const bgAnimation = document.querySelector('.bg-animation');

if (bgAnimation) {
  const orbCount = 12;
  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement('span');
    orb.className = 'bg-orb';
    const size = 90 + Math.random() * 180;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const color = colors[Math.floor(Math.random() * colors.length)];
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
    orb.style.left = `${left}%`;
    orb.style.top = `${top}%`;
    orb.style.background = color;
    orb.style.opacity = (0.2 + Math.random() * 0.45).toFixed(2);
    orb.style.animationDelay = `${(i * 1.3).toFixed(2)}s`;
    orb.style.animationDuration = `${(14 + Math.random() * 12).toFixed(2)}s`;
    bgAnimation.appendChild(orb);
  }
}

fortuneBtn.addEventListener('click', () => {
  const index = Math.floor(Math.random() * fortunes.length);
  fortuneResult.textContent = fortunes[index];
});

colorBtn.addEventListener('click', () => {
  const color = colors[Math.floor(Math.random() * colors.length)];
  colorSwatch.style.background = `linear-gradient(135deg, ${color}, #ffffff)`;
  document.documentElement.style.setProperty('--accent', color);
});

messageBtn.addEventListener('click', () => {
  const index = Math.floor(Math.random() * messages.length);
  messageResult.textContent = messages[index];
});
