import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;

const apiResponseHandler = async (endPoint, method = 'GET', data = null, customHeaders = {}) => {
    try {
        const baseURL = "http://localhost:8000/api";

        // Default headers (don't set Content-Type for FormData)
        const defaultHeaders = {
            ...(!(data instanceof FormData) && { 'Content-Type': 'application/json' }),
            ...customHeaders
        };

        // Get token from localStorage as fallback
        const token = localStorage.getItem('adminToken');
        if (token) {
            defaultHeaders.Authorization = `Bearer ${token}`;
        }

        const config = {
            url: baseURL + endPoint,
            method: method,
            headers: defaultHeaders,
            withCredentials: true, // Include cookies in requests
        };

        // Add data for non-GET requests
        if (data && method !== 'GET') {
            config.data = data;
        }

        const response = await axios(config);
        return response;
    } catch (error) {
        // Handle specific error cases
        if (error.response?.status === 401) {
            // Token expired or invalid - try to refresh
            if (endPoint !== '/auth/refresh' && endPoint !== '/auth/admin/login') {
                try {
                    const refreshResponse = await axios.post(
                        "http://localhost:8000/api/auth/refresh",
                        {},
                        { withCredentials: true }
                    );

                    if (refreshResponse.data.success) {
                        // Update token in localStorage
                        localStorage.setItem('adminToken', refreshResponse.data.data.token);

                        // Retry original request with new token
                        const retryHeaders = {
                            ...customHeaders,
                            'Authorization': `Bearer ${refreshResponse.data.data.token}`
                        };

                        const retryResponse = await axios({
                            url: "http://localhost:8000/api" + endPoint,
                            method: method,
                            data: data,
                            headers: retryHeaders,
                            withCredentials: true
                        });

                        return retryResponse;
                    }
                } catch (refreshError) {
                    // Refresh failed - redirect to login
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    if (window.location.pathname.includes('/admin')) {
                        window.location.href = '/admin';
                    }
                }
            }
        }

        return error.response || {
            data: {
                success: false,
                message: 'Network error occurred'
            }
        };
    }
};

export { apiResponseHandler }