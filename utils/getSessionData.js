export function getSessionData(key) {
    // Retrieve data from sessionStorage
    const data = sessionStorage.getItem(key);

    // Check if the data is not null or undefined
    if (data) {
        try {
            // Try to parse the data as JSON
            const parsedData = JSON.parse(data);

            // If parsing is successful, return the parsed object
            return parsedData;
        } catch (error) {
            // If parsing fails, return the raw string data
            return data;
        }
    }

    // If data is not found, return null
    return null;
}
