// Effects
window.addEventListener('DOMContentLoaded',async () => {
  try {
    await retrieveBooks();
  } catch (error) {
    console.error('Error retrieving books:', error);
  }

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

  setupGridListeners();
});

function setupGridListeners() {
  const gridItems = document.querySelectorAll('.grid-item');

  gridItems.forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

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

async function retrieveBooks() {
  const url = "http://localhost:3000/books";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const gridContainer = document.querySelector('.grid-container');

    data.forEach(book => {
      const bookElement = document.createElement('div');
      bookElement.classList.add('grid-item');

      bookElement.innerHTML = `
        <p class="grid-content">${book.title}</p>
      `;

      gridContainer.appendChild(bookElement);
    });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}