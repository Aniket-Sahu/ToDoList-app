import React from "react";

interface ItemProps {
  id: number;
  title: string;
  content: string;
  onDelete: (id: number) => void; 
}

const Item: React.FC<ItemProps> = (props) => {
  const deleteItem = () => {
    props.onDelete(props.id);
  };

  return (
    <div className="item">
      <h2>{props.title}</h2>
      <p>{props.content}</p>
      <button onClick={deleteItem}>Delete</button>
    </div>
  );
}

export default Item;
