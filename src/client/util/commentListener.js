const commentMouseEnter = (id) => {
  console.log(id)
  if (id) {
    const el = document.querySelectorAll(`[data-id~="${id}"]`);
    el.forEach(item => {
      item.classList.add('highlight');
    });
  }
};

const commentMouseLeave = (id) => {
  const el = document.querySelectorAll(`[data-id~="${id}"]`);
  el.forEach(item => {
    item.classList.remove('highlight');
  });
};

export { commentMouseEnter, commentMouseLeave };
