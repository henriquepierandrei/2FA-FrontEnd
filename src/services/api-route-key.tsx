import axios from 'axios';

const apiWithKey = axios.create({
    baseURL: 'https://twofaspring-latest.onrender.com/api/v1',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
    }
});

// Add request interceptor to handle headers
apiWithKey.interceptors.request.use(
    (config) => {
        // Handle FormData content type
        if (config.data instanceof FormData) {
            // Let browser set content-type with boundary
            delete config.headers['Content-Type'];
        }

        // Set Authorization header if not present
        if (!config.headers['Authorization']) {
            config.headers['Authorization'] = 'ApiKey f89f17bc-0bbb-4e9c-bbe5-43f613fdba84';
        }

        // Log headers for debugging
        console.log('Request Headers:', config.headers);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
apiWithKey.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            headers: response.headers,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });
        return Promise.reject(error);
    }
);

export default apiWithKey;