import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Item from "./item";
import SideBar from "./sideBar";
import CreateArea from "./createArea";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("Today");
  const [showCreateArea, setShowCreateArea] = useState(false);
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:3000/api/user", {
        credentials: "include",
      });
      const user = await response.json();
      setUserId(user.id); 
    };

    const fetchNotes = async () => {
      const response = await fetch("http://localhost:3000/api/notes", {
        credentials: "include", 
      });
      const data = await response.json();
      setNotes(data);
    };

    fetchUser(); 
    fetchNotes(); 
  }, []);

  const toggleCreateArea = () => {
    setShowCreateArea(!showCreateArea);
  };

  const addNote = async (newNote) => {
    const response = await fetch("http://localhost:3000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newNote),
    });
    const addedNote = await response.json();
    setNotes((prevNotes) => [...prevNotes, addedNote]);
  };

  const deleteItems = async (id) => {
    const noteId = parseInt(id, 10);
    await fetch(`http://localhost:3000/api/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  return (
    <div className="app">
      <Header Title={title} toggleCreateArea={toggleCreateArea} />
      <div className="main-content">
        <SideBar setTitle={setTitle} />
        {showCreateArea ? (
          <CreateArea addNote={addNote} />
        ) : (
          <div className="items-container">
            {Array.isArray(notes) && notes.length > 0 ? (
              notes
                .filter((noteItem) => noteItem.type === title)
                .map((noteItem) => (
                  <Item
                    key={noteItem.id}
                    id={noteItem.id}
                    title={noteItem.title}
                    content={noteItem.content}
                    onDelete={deleteItems}
                  />
                ))
            ) : (
              <p>No notes available.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
