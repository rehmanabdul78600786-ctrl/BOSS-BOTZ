try {
    const response = await axios.get(url);
    // use response.data
} catch (e) {
    console.error('Axios error:', e);

    if (e.response) {
        // Error response from server
        console.log('Status code:', e.response.status);
        reply(`⚠️ Server responded with status code ${e.response.status}`);
    } else if (e.request) {
        // Request was made but no response
        console.log('No response received:', e.request);
        reply('⚠️ No response from server. Please try again later.');
    } else {
        // Something happened setting up the request
        console.log('Request error:', e.message);
        reply(`⚠️ Request error: ${e.message}`);
    }
}
