import { showLoader } from "./loader.js";
import { showModal } from "./modal.js";

//for get requests
export async function apiGet(url, headers = {}) {
    const loader = showLoader();
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers, // Spread the additional headers
        },
      });
      // Check if the response status is OK
      if (!response.ok) {
        loader.remove();
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json(); // Parse JSON response
      loader.remove();
      return data;
    } catch (error) {
        loader.remove();
      console.error('GET Request failed:', error);
      throw error; // Rethrow error for further handling
    }
  }


  export async function apiRequest(url, method, body = {}, headers = {}, title) {
    const loader = showLoader();
    try {
      const response = await fetch(url, {
        method: method, // Use dynamic method (POST, PUT, DELETE)
        headers: {
          ...headers, // Spread the additional headers
        },
        body: body && JSON.stringify(body), // Convert body to JSON
      });
  
      // Check if the response status is OK
      if (!response.ok) {
        loader.remove();
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json(); // Parse JSON response
      loader.remove();
      showModal({
        title: title,
        message: data.message,
        noConfirm: true
    })
      return data;
    } catch (error) {
        loader.remove();
      console.error(`${method} Request failed:`, error);
      showModal({
        title: title,
        message: 'Somethign went wrong. Try again later',
        noConfirm: true
    })
      throw error; // Rethrow error for further handling
    }
  }


