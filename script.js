function scrollLeft() {
  console.log("yessmam");
  document.getElementById('scrollable').scrollBy({
    right: 450,
    behavior: 'smooth'
  });
}

function scrollRight() {
  console.log("yessir");
  document.getElementById('scrollable').scrollBy({
    left: 450, // ➡ scroll right = positive
    behavior: 'smooth'
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.grid-item');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      } else {
        entry.target.classList.remove('animate');
      }
    });
  }, {
    threshold: 0.1
  });

  items.forEach(item => {
    observer.observe(item);
  });
});

document.querySelectorAll('.grid-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    item.style.setProperty('--mouse-x', `${x}px`);
    item.style.setProperty('--mouse-y', `${y}px`);
  });
});

document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  document.body.style.setProperty('--mouse-x', `${x}px`);
  document.body.style.setProperty('--mouse-y', `${y}px`);

  document.body.classList.add('glow');
});

document.addEventListener('mouseleave', () => {
  document.body.classList.remove('glow');
});
/*-------------------------------------------------------------------------This Section is on the functionality and effects of the website------------------------------------------------------*/

