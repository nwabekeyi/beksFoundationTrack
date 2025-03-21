import { showLoader } from "./loader.js";
import { showModal } from "./modal.js";

// For GET requests
export async function apiGet(url, headers = {}, title = '') {
    const loader = showLoader('Pleasw wait...');
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers, // Headers fully controlled by argument
      });
      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          loader.remove();
          showModal({
            title: title || 'Unauthorized',
            message: errorData.message || 'You are not authorized to perform this action',
            noConfirm: true
          });
          throw new Error(`Error: ${response.status} - ${errorData.message || 'Unauthorized'}`);
        }
        loader.remove();
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      loader.remove();
      return data;
    } catch (error) {
      loader.remove();
      console.error('GET Request failed:', error);
      throw error;
    }
}

// For POST, PUT, DELETE, etc. requests
export async function apiRequest(url, method, body = null, headers = {}, title) {
    const loader = showLoader();
    try {
      const response = await fetch(url, {
        method: method,
        headers: headers, // Headers fully controlled by argument
        body: body instanceof FormData ? body : body && JSON.stringify(body), // Handle FormData or JSON
      });
      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          loader.remove();
          showModal({
            title: title || 'Unauthorized',
            message: errorData.message || 'You are not authorized to perform this action',
            noConfirm: true
          });
          throw new Error(`Error: ${response.status} - ${errorData.message || 'Unauthorized'}`);
        }
        loader.remove();
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      loader.remove();
      showModal({
        title: title,
        message: data.message,
        noConfirm: true
      });
      return data;
    } catch (error) {
      loader.remove();
      console.error(`${method} Request failed:`, error);
      // Only show generic error modal if not already handled (e.g., not 401)
      if (!error.message.includes('401')) {
        showModal({
          title: title || 'Error',
          message: 'Something went wrong. Try again later',
          noConfirm: true
        });
      }
      throw error;
    }
}