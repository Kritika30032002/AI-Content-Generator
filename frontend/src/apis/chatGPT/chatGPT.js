import axios from 'axios';

// ----------Generate Content-----------------
export const generateContentAPI = async ({ prompt }) => {
  const response = await axios.get(
    'http://localhost:5000/api/openai/generate-content',
    {
      params: { prompt }, // Send prompt as a query parameter
      withCredentials: true, // Pass withCredentials option like this
    }
  );
  return response?.data;
};
