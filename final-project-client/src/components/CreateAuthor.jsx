import React, { useState } from 'react';

const CreateAuthor = ({ onAuthorCreated }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5269/api/Author', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      setName('');
      if (onAuthorCreated) {
        onAuthorCreated();
      }
    } else {
      console.error('Error creating author');
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
      <button type="submit">Create Author</button>
    </form>
  );
};

export default CreateAuthor;
