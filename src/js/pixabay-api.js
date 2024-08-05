import axios from 'axios';

const API_KEY = '29243392-4dbc80ece43085fc7952f4964';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages({ page = 1, per_page = 15, q = '' } = {}) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        page,
        per_page,
        q,
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
