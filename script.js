// Effects
window.addEventListener('DOMContentLoaded',async () => {
  try {
    await retrieveBooks();
    await retrieveRecents();
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

function setupHyperlink(element, url, id) {
  element.addEventListener('click', async () => {
    try {
      window.open(url, '_blank');

      const markResponse = await fetch(`http://localhost:3000/books/${id}`);

      if (!markResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const markData = await markResponse.json();
      console.log('Book marked as recent:', markData);

      await retrieveRecents();
    } catch (error) {
      console.error('Error marking book as recent:', error);
    }
  });
}

async function retrieveBooks() {
  const url = "http://127.0.0.1:3000/books";

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
        <img src="${book.image_url}" alt="${book.title}" class="grid-item-cover"/>
        <p class="grid-content">${book.title}</p>
      `;

      setupHyperlink(bookElement, book.url, book.id);

      gridContainer.appendChild(bookElement);
    });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

async function retrieveRecents() {
  const url = "http://localhost:3000/recents";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const recentsContainer = document.querySelector('.recents-container');

    recentsContainer.innerHTML = ''; // Clear previous recents

    data.forEach(recent => {
      const recentElement = document.createElement('div');
      recentElement.classList.add('item');
      recentElement.classList.add('item-content');

      recentElement.innerHTML = `
        <img src="${recent.image_url}" alt="${recent.title}" class="recents-item-cover"/>
        <p class="item-title">${recent.title}</p>
      `;;

      setupHyperlink(recentElement, recent.url, recent.id);

      recentsContainer.appendChild(recentElement);
    });
  } catch (error) {
    console.error('Error fetching recents:', error);
  }
}