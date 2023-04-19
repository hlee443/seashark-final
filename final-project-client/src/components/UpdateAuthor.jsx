import React, { useState } from "react";

const UpdateAuthor = ({ author, onAuthorUpdated }) => {
  const { id } = author;
  const [name, setName] = useState(author.name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:5269/api/Author/${author.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: author.id, name }),
      }
    );

    if (response.ok) {
      if (onAuthorUpdated) {
        onAuthorUpdated();
      }
    } else {
      console.error("Error updating author");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Author Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Update Author</button>
    </form>
  );
};

export default UpdateAuthor;
