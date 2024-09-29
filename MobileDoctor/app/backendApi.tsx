import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Replace with your actual API URL

// Function to upload an image
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/upload-image/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Return the response data from the API
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

// You can add more API functions here as needed
