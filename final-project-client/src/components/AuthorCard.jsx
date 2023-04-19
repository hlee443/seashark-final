// AuthorCard.jsx
import React from "react";
import BookCard from "./BookCard";

const AuthorCard = ({
  author,
  onUpdate,
  onDelete,
  onCreateBook,
  onUpdateBook,
  onDeleteBook,
}) => {
  return (
    <div className="author-card">
      <h3>{author.name}</h3>
      <button onClick={() => onUpdate(author)}>Update Author</button>
      <button onClick={() => onDelete(author)}>Delete Author</button>
      <h4>Books</h4>
      {author.books.map((book) => (
        <BookCard
          key={book.Id}
          book={book}
          authorId={author.id}
          authorName={author.name}
          onUpdateBook={onUpdateBook}
          onDeleteBook={onDeleteBook}
        />
      ))}
      <BookCard
        authorName={author.name}
        onCreateBook={(book) => onCreateBook(book)}
        isCreating={true}
      />
    </div>
  );
};

export default AuthorCard;
