const toastEl = document.getElementById('liveToast');
const toastBtn = document.getElementById('toastBtn');
const demoBtns = document.querySelectorAll('.demo-btn');
const demoActions = document.querySelectorAll('.demo-action');
const reactionStatus = document.getElementById('reactionStatus');
const reactionBar = document.getElementById('reactionBar');
const listAnnouncement = document.getElementById('listAnnouncement');
const listToggleBtn = document.getElementById('listToggleBtn');
const demoListGroup = document.getElementById('demoListGroup');

if (toastEl && toastBtn) {
  const toast = new bootstrap.Toast(toastEl);
  toastBtn.addEventListener('click', () => {
    toast.show();
    if (reactionStatus) reactionStatus.textContent = 'toast発火';
  });
}

demoBtns.forEach(button => {
  const originalText = button.textContent.trim();
  button.dataset.defaultText = originalText;

  button.addEventListener('click', () => {
    button.classList.toggle('is-fired');
    const fired = button.classList.contains('is-fired');
    button.textContent = fired ? (button.dataset.demoText || '押した！') : originalText;
    if (reactionStatus) reactionStatus.textContent = fired ? 'ボタン発火' : '待機中';
    button.setAttribute('aria-pressed', String(fired));
  });
});

demoActions.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.add('active');
    const toneMap = {
      danger: 'linear-gradient(90deg, #ef4444, #f87171)',
      info: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
      warning: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
    };

    const buttonTone = button.classList.contains('btn-danger')
      ? 'danger'
      : button.classList.contains('btn-info')
        ? 'info'
        : button.classList.contains('btn-warning')
          ? 'warning'
          : 'default';

    if (reactionStatus) reactionStatus.textContent = `${button.textContent} を選択`;
    if (reactionBar) {
      reactionBar.style.background = toneMap[buttonTone] || 'linear-gradient(90deg, #94a3b8, #cbd5e1)';
      reactionBar.classList.add('active');
      setTimeout(() => reactionBar.classList.remove('active'), 180);
    }

    setTimeout(() => button.classList.remove('active'), 220);
  });
});

const triggerListAnnouncement = (label) => {
  if (!listAnnouncement) return;

  listAnnouncement.textContent = `${label}！！`;
  listAnnouncement.classList.remove('show');
  void listAnnouncement.offsetWidth;
  listAnnouncement.classList.add('show');
};

if (demoListGroup) {
  demoListGroup.querySelectorAll('.list-group-item').forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const label = item.textContent.trim();
      triggerListAnnouncement(label);
      if (reactionStatus) reactionStatus.textContent = `${label} を選択`;
    });
  });
}

if (listToggleBtn && demoListGroup) {
  listToggleBtn.addEventListener('click', () => {
    const items = demoListGroup.querySelectorAll('.list-group-item');
    const active = items[0].classList.contains('active');
    items.forEach((item, index) => {
      item.classList.toggle('active', !active && index === 0);
      item.classList.toggle('list-group-item-primary', !active && index === 0);
    });

    const label = active ? '状態を戻す' : '状態を切り替え';
    listToggleBtn.textContent = label;
    if (reactionStatus) reactionStatus.textContent = active ? 'リスト再開' : 'リスト切替';
  });
}
