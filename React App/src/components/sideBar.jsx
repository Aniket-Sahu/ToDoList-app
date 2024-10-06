import React from "react";

function SideBar(props) {
  const detectTitle = (data) => {
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
