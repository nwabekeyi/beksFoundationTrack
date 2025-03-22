export function showLoader(text) {
    // Create a loader container
    const loaderContainer = document.createElement('div');
    loaderContainer.style.height = '100%';
    loaderContainer.style.zIndex = '100000';
    loaderContainer.style.display = 'flex'; // Use flexbox for centering
    loaderContainer.style.flexDirection = 'column'; // Stack the loader and text vertically
    loaderContainer.style.alignItems = 'center'; // Center horizontally
    loaderContainer.style.justifyContent = 'center'; // Center vertically
    loaderContainer.style.textAlign = 'center'; // Center the text
    loaderContainer.style.position = 'absolute';
    loaderContainer.style.top = '0';
    loaderContainer.style.left = '0';
    loaderContainer.style.width = '100%';
    loaderContainer.style.padding = '0 10px';

    // Check if text starts with "welcome" (case-insensitive)
    if (text && text.toLowerCase().startsWith('welcome')) {
        loaderContainer.style.backgroundColor = '#000000'; // Solid black background
    } else {
        loaderContainer.style.backgroundColor = 'rgba(51, 51, 51, 0.8)'; // Semi-transparent dark background
        loaderContainer.style.backdropFilter = 'blur(10px)'; // Blur the background
    }

    // Create the loader element
    const loader = document.createElement('div');
    loader.classList.add('loader');
  
    // Create a text element for the loader message
    const loaderText = document.createElement('div');
    loaderText.textContent = text || ''; // Use the passed text or default to empty
    loaderText.style.color = 'white'; // Set text color to white for contrast
    loaderText.style.marginTop = '20px'; // Space between loader and text
    loaderText.style.fontSize = '18px'; // Adjust font size

    // Add loader styles
    const style = document.createElement('style');
    style.innerHTML = `
      .loader {
          width: 85px;
          height: 25px;
          --g1: conic-gradient(from 90deg at left 3px top 3px, #0000 90deg, #fff 0);
          --g2: conic-gradient(from -90deg at bottom 3px right 3px, #0000 90deg, #fff 0);
          background: var(--g1), var(--g1), var(--g1), var(--g2), var(--g2), var(--g2);
          background-position: left, center, right;
          background-repeat: no-repeat;
          animation: l8 1s infinite;
      }
  
      @keyframes l8 {
          0% { background-size: 25px 100%, 25px 100%, 25px 100%; }
          20% { background-size: 25px 50%, 25px 100%, 25px 100%; }
          40% { background-size: 25px 50%, 25px 50%, 25px 100%; }
          60% { background-size: 25px 100%, 25px 50%, 25px 50%; }
          80% { background-size: 25px 100%, 25px 100%, 25px 50%; }
          100% { background-size: 25px 100%, 25px 100%, 25px 100%; }
      }
    `;
  
    // Append the style to the document head
    document.head.appendChild(style);
  
    // Append the loader and text to the container
    loaderContainer.appendChild(loader);
    loaderContainer.appendChild(loaderText); // Append the text below the loader
  
    // Append the container to the body
    document.body.appendChild(loaderContainer);
  
    return loaderContainer;
}

// Example usage:
// const loaderElement = showLoader("Welcome, please wait...");  // Will trigger solid black background

// To remove the loader when done:
// loaderElement.remove();
