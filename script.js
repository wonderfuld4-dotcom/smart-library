
const books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", genre: "Programming", year: 2008, available: true },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1937, available: true },
  { id: 3, title: "1984", author: "George Orwell", genre: "Fiction", year: 1949, available: false },
  { id: 4, title: "Atomic Habits", author: "James Clear", genre: "Self Help", year: 2018, available: true }
];

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");

function showPage(pageId) {
  pages.forEach(page => {
    page.classList.toggle("hidden", page.id !== pageId);
  });

  navItems.forEach(item => {
    item.classList.toggle("active", item.dataset.page === pageId);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navItems.forEach(item => {
  item.addEventListener("click", () => showPage(item.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

function renderBooks() {
  const table = document.getElementById("booksTable");
  const recent = document.getElementById("recentBooks");
  const searchInput = document.getElementById("searchInput");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filteredBooks = books.filter(book =>
    `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(query)
  );

  table.innerHTML = filteredBooks.map(book => `
    <tr>
      <td><strong>📘 ${escapeHTML(book.title)}</strong></td>
      <td>${escapeHTML(book.author)}</td>
      <td>${escapeHTML(book.genre)}</td>
      <td>${book.year || "—"}</td>
      <td>
        <span class="status ${book.available ? "available" : "borrowed"}">
          ${book.available ? "Available" : "Borrowed"}
        </span>
      </td>
      <td>
        ${book.available
          ? `<button class="borrow-btn" data-action="borrow" data-id="${book.id}">Borrow</button>`
          : `<button class="return-btn" data-action="return" data-id="${book.id}">Return</button>`
        }
        <button class="delete-btn" data-action="delete" data-id="${book.id}">Delete</button>
      </td>
    </tr>
  `).join("");

  document.getElementById("bookCount").textContent =
    `${filteredBooks.length} book(s) shown`;

  recent.innerHTML = books.slice(-4).reverse().map((book, index) => `
    <article class="book-card">
      <div class="book-cover cover-${index % 4}">📖</div>
      <h3>${escapeHTML(book.title)}</h3>
      <p>by ${escapeHTML(book.author)}</p>
      <span class="status ${book.available ? "available" : "borrowed"}">
        ${book.available ? "Available" : "Borrowed"}
      </span>
    </article>
  `).join("");

  document.getElementById("totalCount").textContent = books.length;
  document.getElementById("availableCount").textContent =
    books.filter(book => book.available).length;
  document.getElementById("borrowedCount").textContent =
    books.filter(book => !book.available).length;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

document.getElementById("searchInput").addEventListener("input", renderBooks);

document.getElementById("booksTable").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  const bookIndex = books.findIndex(book => book.id === id);

  if (bookIndex === -1) return;

  if (action === "borrow") {
    books[bookIndex].available = false;
  } else if (action === "return") {
    books[bookIndex].available = true;
  } else if (action === "delete") {
    if (!confirm("Are you sure you want to delete this book?")) return;
    books.splice(bookIndex, 1);
  }

  renderBooks();
});

document.getElementById("bookForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);

  books.push({
    id: Date.now(),
    title: data.get("title").trim(),
    author: data.get("author").trim(),
    genre: data.get("genre"),
    year: Number(data.get("year")) || "",
    available: true
  });

  form.reset();
  renderBooks();
  showPage("books");
});

document.getElementById("currentYear").textContent = new Date().getFullYear();

renderBooks();
