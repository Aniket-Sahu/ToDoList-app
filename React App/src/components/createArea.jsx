import React, { useState } from "react";

function CreateArea({ addNote, userId }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [goal, setGoal] = useState("Today"); 
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const newNote = {
      type: goal,
      title,
      content,
      user_id: userId, 
    };

    addNote(newNote);

    setTitle("");
    setContent("");
    setGoal("today");
  };

  return (
    <div className="create-area">
      <h2>Create a New Note</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            name={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="goal">Goal:</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
}

export default CreateArea;
