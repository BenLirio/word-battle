import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>
        Found a bug or have a feature request?{" "}
        <a
          href="https://discord.gg/F69uzFtgpT"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord server
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;
