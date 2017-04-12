const commentMouseEnter = (e) => {
  const id = e.target.getAttribute('data-id');
  if (id) {
    const el = document.querySelector(`[data-id="${id}"]`);
    el.classList.add('highlight');
  }
};

const commentMouseLeave = (e) => {
  const id = e.target.getAttribute('data-id');
  if (id) {
    const el = document.querySelector(`[data-id="${id}"]`);
    el.classList.remove('highlight');
  }
};

export { commentMouseEnter, commentMouseLeave };
