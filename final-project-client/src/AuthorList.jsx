import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import AuthorCard from "./components/AuthorCard";
import CreateAuthor from "./components/CreateAuthor";
import UpdateAuthor from "./components/UpdateAuthor";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [hubConnection, setHubConnection] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    fetchAuthors();

    const createHubConnection = async () => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("/myHub")
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();
        console.log("SignalR connected.");

        // Listen to real-time updates
        connection.on("AuthorChanged", () => {
          fetchAuthors();
        });
        connection.on("BookChanged", () => {
          fetchAuthors();
        });

        setHubConnection(connection);
      } catch (error) {
        console.error("Error establishing SignalR connection:", error);
      }
    };

    createHubConnection();

    return () => {
      // Clean up the connection when the component unmounts
      hubConnection?.stop();
    };
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await fetch("http://localhost:5269/api/Author");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      console.log("Authors:", data);
      setAuthors(
        JSON.parse(data).map(({ Id, Name, Books }) => ({
          id: Id,
          name: Name,
          books: Books,
        }))
      );
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const handleUpdateButtonClick = (author) => {
    setSelectedAuthor(author);
  };

  const handleUpdateComplete = () => {
    setSelectedAuthor(null);
    fetchAuthors();
  };

  const handleDeleteAuthor = async (author) => {
    try {
      const response = await fetch(
        `http://localhost:5269/api/Author/${author.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  const handleCreateBook = async (authorId, bookData) => {
    try {
      console.log("BOOK DATA:", bookData);
      console.log("Sending book data:", JSON.stringify({ ...bookData, AuthorId: authorId }));
      
      const response = await fetch("http://localhost:5269/api/Book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({book: { ...bookData, AuthorId: authorId }}),
        body: JSON.stringify({Id:bookData.Id, Title:bookData.Title, AuthorId:authorId}),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchAuthors();
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const handleUpdateBook = async (book) => {
    try {
      const response = await fetch(`http://localhost:5269/api/Book/${book.Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchAuthors();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDeleteBook = async (book) => {
    try {
      const response = await fetch(`http://localhost:5269/api/Book/${book.Id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchAuthors();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="author-list">
      <h2>Create Author</h2>
      <CreateAuthor onAuthorCreated={fetchAuthors} />
      {authors.map((author) => (
        <div key={author.id}>
          <AuthorCard
            author={author}
            onUpdate={handleUpdateButtonClick}
            onDelete={handleDeleteAuthor}
            onCreateBook={(bookData) => handleCreateBook(author.id, bookData)}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
          />
          {selectedAuthor && selectedAuthor.id === author.id && (
            <>
              <h3>Update Author</h3>
              <UpdateAuthor
                author={author}
                onAuthorUpdated={handleUpdateComplete}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AuthorList;
