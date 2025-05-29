const apiUrl = 'http://localhost:3000/books';

const booksList = document.getElementById('books-list');
const bookForm = document.getElementById('book-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const bookIdInput = document.getElementById('book-id');
const cancelEditBtn = document.getElementById('cancel-edit');

// Fetch and display all books
function fetchBooks() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(books => {
      booksList.innerHTML = '';
      books.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="book-info"><strong>${book.title}</strong> by ${book.author}</div>
          <div>
            <button class="edit-btn" data-id="${book.id}">Edit</button>
            <button class="delete-btn" data-id="${book.id}">Delete</button>
          </div>
        `;
        booksList.appendChild(li);
      });

    })
    .catch(err => alert('Error fetching books: ' + err));
}

// Add or update book on form submit
bookForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = bookIdInput.value;
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (!title || !author) {
    alert('Please enter both title and author.');
    return;
  }

  const bookData = { title, author };

  if (id) {
    // Update existing book
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update book');
        resetForm();
        fetchBooks();
      })
      .catch(err => alert(err));
  } else {
    // Add new book
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add book');
        resetForm();
        fetchBooks();
      })
      .catch(err => alert(err));
  }
});

// Handle edit and delete button clicks
booksList.addEventListener('click', e => {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.getAttribute('data-id');
    console.log('Editing book with id:', id);  // Debug log
    fetch(`${apiUrl}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Book not found');
        return res.json();
      })
      .then(book => {
        bookIdInput.value = book.id;
        titleInput.value = book.title;
        authorInput.value = book.author;
        cancelEditBtn.style.display = 'inline';
      })
      .catch(err => alert('Error fetching book: ' + err));
  }
});
booksList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    if (confirm('Are you sure you want to delete this book?')) {
      fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.status === 204) {
            fetchBooks();
          } else {
            throw new Error('Failed to delete book');
          }
        })
        .catch(err => alert(err));
    }
  }
});



// Cancel edit button resets the form
cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

// Reset form to add mode
function resetForm() {
  bookIdInput.value = '';
  titleInput.value = '';
  authorInput.value = '';
  cancelEditBtn.style.display = 'none';
}

// Initial load of books
fetchBooks();
