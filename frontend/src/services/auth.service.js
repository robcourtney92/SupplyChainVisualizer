import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/auth/';

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'login', {
        username,
        password
      }, { withCredentials: true })
      .then(response => {
        // Store non-sensitive user info for UI purposes (token is in httpOnly cookie)
        if (response.data) {
          const userData = {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            roles: response.data.roles
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }
        return response.data;
      });
  }

  logout() {
    return axios.post(API_URL + 'logout', {}, { withCredentials: true }).then(() => {
      localStorage.removeItem('user');
    }).catch(() => {
      localStorage.removeItem('user');
    });
  }

  register(username, password) {
    return axios.post(API_URL + 'register', {
      username,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

const authService = new AuthService();
export default authService;
