
const highlightSelected = (arr) => {
  let translateAmount = 0;
  let qPos;
  let qTag;
  let commentPos;
  arr.forEach(id => {
    if (id) {
      const el = document.querySelectorAll(`[data-id~="${id}"]`);
      el.forEach(item => {
        if (item.nodeName === 'DIV' && !commentPos) {
          commentPos = item.offsetTop;
        }
        else if (item.nodeName === 'DIV') {
          commentPos = Math.min(commentPos, item.offsetTop);
        }

        if (item.nodeName === 'QUVL-TAG' && !qPos) {
          qTag = item;
          qPos = item.offsetTop;
        }
        else if (item.nodeName === 'QUVL-TAG') {
          qPos = Math.min(qPos, item.offsetTop);
          if (qTag.offsetTop !== qPos) qTag = item;
        }
        item.classList.add('highlight');
      });
    }
  });
  commentPos += 139;
  qPos = qTag.getBoundingClientRect().top + window.scrollY;
  translateAmount = qPos - commentPos;
  document.getElementById('comments').style.transform = `translateY(${translateAmount}px)`;
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
