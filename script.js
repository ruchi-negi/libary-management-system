document.addEventListener("DOMContentLoaded", () => {
    const bookTableBody = document.getElementById("book-table-body");
    const addBookForm = document.getElementById("add-book-form");

    // Fetch and display books from the server
    const fetchBooks = async () => {
        const response = await fetch('/api/books');
        const books = await response.json();

        bookTableBody.innerHTML = ""; // Clear table
        books.forEach(book => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isAvailable ? "Available" : "Borrowed"}</td>
            `;
            bookTableBody.appendChild(row);
        });
    };

    // Add a new book
    addBookForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;

        await fetch('/api/books', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author })
        });

        addBookForm.reset();
        fetchBooks(); // Refresh book list
    });

    fetchBooks(); // Initial fetch
});
