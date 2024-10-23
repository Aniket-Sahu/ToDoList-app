import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Item from "./item";
import SideBar from "./sideBar";
import CreateArea from "./createArea";

interface Note {
  id: number;
  title: string;
  content: string;
  type: string;
}

interface User {
  id?: number;
  username: string;
  password?: string;
}

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("Today");
  const [showCreateArea, setShowCreateArea] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:3000/api/user", {
        credentials: "include",
      });
      const user: User = await response.json();
      if (user.id) {
        setUserId(user.id);
      }
    };

    const fetchNotes = async () => {
      const response = await fetch("http://localhost:3000/api/notes", {
        credentials: "include",
      });
      const data: Note[] = await response.json();
      setNotes(data);
    };

    fetchUser();
    fetchNotes();
  }, []);

  const toggleCreateArea = () => {
    setShowCreateArea(!showCreateArea);
  };

  const addNote = async (newNote: Omit<Note, "id">) => {
    const response = await fetch("http://localhost:3000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newNote),
    });
    const addedNote: Note = await response.json();
    setNotes((prevNotes) => [...prevNotes, addedNote]);
  };

  const deleteItems = async (id: number) => {
    await fetch(`http://localhost:3000/api/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <div className="app">
      <Header Title={title} toggleCreateArea={toggleCreateArea} />
      <div className="main-content">
        <SideBar setTitle={setTitle} />
        {showCreateArea ? (
          <CreateArea addNote={addNote} userId={userId} />
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
};

export default App;
