import React from "react";

interface SideBarProps {
  setTitle: (title: string) => void;
}

const SideBar: React.FC<SideBarProps> = (props) => {
  const detectTitle = (data: string) => {
    props.setTitle(data);
  };

  return (
    <div className="sidebar">
      <p>User_name</p>
      <hr />
      <p onClick={() => detectTitle("monthly")}>This Month</p>
      <p onClick={() => detectTitle("weekly")}>This Week</p>
      <p onClick={() => detectTitle("Today")}>Today</p>
    </div>
  );
}

export default SideBar;
