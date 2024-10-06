import React from "react";

function Footer() {
  const year = new Date().getFullYear();

  return <div className="footer">Copyright © {year}</div>;
}

export default Footer;
