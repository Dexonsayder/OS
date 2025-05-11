function scrollLeft(id) {
  document.getElementById('scrollable').scrollBy({
    left: -450, // ⬅ scroll left = negative
    behavior: 'smooth'
  });
}

function scrollRight(id) {
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

/*-------------------------------------------------------------------------This Section is on the functionality and effects of the website------------------------------------------------------*/

