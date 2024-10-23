import React, { useState } from "react";

interface CreateAreaProps {
  addNote: (newNote: { type: string; title: string; content: string; user_id: number | null; }) => Promise<void>;
  userId: number | null; 
}

const CreateArea: React.FC<CreateAreaProps> = ({ addNote, userId }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [goal, setGoal] = useState<string>("Today");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newNote = {
      type: goal,
      title,
      content,
      user_id: userId,
    };

    addNote(newNote);

    // Reset the form fields
    setTitle("");
    setContent("");
    setGoal("Today");
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
            name="content" 
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
};

export default CreateArea;
