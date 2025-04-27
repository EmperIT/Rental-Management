// API Client service để quản lý tất cả các request API

class ApiClient {
  constructor() {
    // Trong môi trường Docker, frontend được phục vụ từ cùng domain với backend,
    // nên các request sẽ được gửi đến các endpoint tương đối
    this.baseUrl = '';

    // Token lưu trữ trong localStorage
    this.accessToken = localStorage.getItem('accessToken');
  }

  // Các phương thức HTTP cơ bản
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Phương thức chính để thực hiện request
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Thêm token xác thực nếu có
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      // Kiểm tra nếu response là JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        // Nếu response không thành công, throw error
        if (!response.ok) {
          throw new Error(data.message || 'Có lỗi xảy ra');
        }
        
        return data;
      } else {
        // Nếu response không phải JSON
        if (!response.ok) {
          throw new Error('Có lỗi xảy ra');
        }
        
        return await response.text();
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Phương thức đăng nhập
  async login(username, password) {
    try {
      const data = await this.post('/auth/login', { username, password });
      
      // Lưu token vào localStorage
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('userRole', data.role);
        
        // Cập nhật token trong instance hiện tại
        this.accessToken = data.accessToken;
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Phương thức đăng xuất
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
    this.accessToken = null;
  }

  // Phương thức refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const data = await this.post('/auth/refresh', { refreshToken });
      
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        this.accessToken = data.accessToken;
      }
      
      return data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

// Export một instance duy nhất của ApiClient
export default new ApiClient();