const highlightSelected = (id) => {
  if (id) {
    const el = document.querySelectorAll(`[data-id~="${id}"]`);
    el.forEach(item => {
      item.classList.add('highlight');
    });
  }
};

const dehighlightSelected = (id) => {
  const el = document.querySelectorAll(`[data-id~="${id}"]`);
  el.forEach(item => {
    item.classList.remove('highlight');
  });
};

const clearHighlighted = () => {
  const el = document.querySelectorAll('[data-id]');
  el.forEach(item => {
    item.classList.remove('highlight');
  });
};


export { highlightSelected, dehighlightSelected, clearHighlighted };
