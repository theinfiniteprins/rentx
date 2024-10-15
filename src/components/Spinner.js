import React from 'react';

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loader"></div>
    <style jsx>{`
      .loader {
        border: 16px solid #f3f3f3; /* Light gray */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 100px; /* Size of the spinner */
        height: 100px; /* Size of the spinner */
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Spinner;
