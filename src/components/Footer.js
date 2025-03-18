import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Blockchain ID Card System</p>
      </div>
    </footer>
  );
}

export default Footer; 