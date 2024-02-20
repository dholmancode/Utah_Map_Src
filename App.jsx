// App.jsx

import React from 'react';
import InteractiveMap from './InteractiveMap';
import './Styles/mapStyles.css';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import './Styles/infoStyles.css';

function App() {
  return (
    <>
      <header>
        National Conservation Areas | Utah
        {/* Header Content */}
      </header>
      <main>
        <InteractiveMap />
      </main>
      <footer>
         <a href="https://dannyholmanmedia.com" target="_blank" rel="noopener noreferrer">
         <img src="https://dannyholmanmedia.com/wp-content/uploads/2024/02/DGH-Blob.png" alt="Danny Holman Media Icon" />
        <br />
          dannyholmanmedia.com
        
        </a>      
        </footer>
    </>
  );
}

export default App;
