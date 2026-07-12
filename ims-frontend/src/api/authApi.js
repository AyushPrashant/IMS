import api from './axios';

export const authApi = {
  login: (data) => api.post('/api/login', data),
  loginWithOtp: (data) => api.post('/api/loginWithOtp', data),
  sendOtp: (godownheadNo) => api.post('/api/sendOtp', { godownheadNo }),
  verifyOtp: (godownheadNo, otp) => api.post('/api/verifyotp', { godownheadNo, otp }),
  resetPassword: (data) => api.patch('/api/resetpassword', data),
  logout: () => api.post('/api/logout'),
  register: (data) => api.post('/api/register', data),
};
