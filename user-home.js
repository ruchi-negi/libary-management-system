document.addEventListener("DOMContentLoaded", () => {
    const userNameSpan = document.getElementById("user-name");
    const bookListContainer = document.querySelector(".book-list");

    // Assume user data is available in localStorage or from session
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        // Display user name
        userNameSpan.textContent = user.username;

        // Fetch and display books
        fetchBooks();
    } else {
        alert("Please log in to view your home page.");
        window.location.href = "/user-login.html"; // Redirect to login page if no user data
    }

    // Function to fetch books from the server
    async function fetchBooks() {
        try {
            const response = await fetch("/api/books"); // API endpoint to get books
            const books = await response.json();

            if (response.ok) {
                // Display books on the page
                books.forEach((book) => {
                    const bookDiv = document.createElement("div");
                    bookDiv.classList.add("book-item");
                    bookDiv.innerHTML = `
                        <h3>${book.title}</h3>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Genre:</strong> ${book.genre}</p>
                        <p><strong>Available Copies:</strong> ${book.availableCopies}</p>
                        <button class="borrow-button" data-book-id="${book.id}">Borrow</button>
                    `;
                    bookListContainer.appendChild(bookDiv);
                });

                // Add event listeners to borrow buttons
                const borrowButtons = document.querySelectorAll(".borrow-button");
                borrowButtons.forEach((button) => {
                    button.addEventListener("click", () => {
                        const bookId = button.getAttribute("data-book-id");
                        borrowBook(bookId);
                    });
                });
            } else {
                alert("Failed to load books.");
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            alert("An error occurred while loading books.");
        }
    }

    // Function to borrow a book
    async function borrowBook(bookId) {
        try {
            const response = await fetch(`/api/borrow/${bookId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id }), // Send user ID and book ID
            });

            const result = await response.json();
            if (response.ok) {
                alert("Book borrowed successfully!");
                // Optionally, update the UI or refresh the book list
            } else {
                alert(result.message || "Failed to borrow the book.");
            }
        } catch (error) {
            console.error("Error borrowing book:", error);
            alert("An error occurred while borrowing the book.");
        }
    }
});
