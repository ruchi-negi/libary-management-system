const Transaction = require('./models/Transaction');
const Book = require('./models/Book');

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Fetch all transactions for a user
app.get("/api/transactions", authenticateUser, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id }).populate('bookId');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Mark a transaction as returned
app.put("/api/transactions/return/:transactionId", authenticateUser, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        if (transaction.returnDate) return res.status(400).json({ message: "Book already returned" });

        transaction.returnDate = Date.now();
        await transaction.save();

        // Increment available copies of the book
        const book = await Book.findById(transaction.bookId);
        book.availableCopies += 1;
        await book.save();

        res.json({ message: "Book returned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
