const toastEl = document.getElementById('liveToast');
const toastBtn = document.getElementById('toastBtn');
const demoBtns = document.querySelectorAll('.demo-btn');
const demoActions = document.querySelectorAll('.demo-action');
const reactionStatus = document.getElementById('reactionStatus');
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
    if (reactionStatus) reactionStatus.textContent = `${button.textContent} を選択`;
    setTimeout(() => button.classList.remove('active'), 220);
  });
});

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
