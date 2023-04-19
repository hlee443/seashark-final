import React, { useState } from "react";

const BookCard = ({
  book,
  authorId,
  onUpdateBook,
  onDeleteBook,
  isCreating,
  onCreateBook,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(book ? book.Title : "");

  const handleCreateBook = async () => {
    if (onCreateBook) {
      onCreateBook({Title: title});
      setTitle("");
    } else {
      console.error("Error creating book");
    }
  };

  const handleUpdateBook = async () => {
    if (onUpdateBook) {
      onUpdateBook({ ...book, Title: title });
      setIsEditing(false);
    } else {
      console.error("Error updating book");
    }
  };

  const handleDeleteBook = async () => {
    if (onDeleteBook) {
      onDeleteBook(book);
    } else {
      console.error("Error deleting book");
    }
  };

  if (isCreating) {
    return (
      <div className="book-card">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter book title"
        />
        <button onClick={handleCreateBook}>Create Book</button>
      </div>
    );
  }

  return (
    <div className="book-card">
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleUpdateBook}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{book.Title}</h3>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDeleteBook}>Delete</button>
        </>
      )}
    </div>
  );
};

export default BookCard;
