import api from '@/utils/axiosConfig';

export const facebookService = {
  async getUserInfo() {
    // Lấy thông tin user Facebook (token đã tự động gắn trong axiosConfig)
    const res = await api.get('https://graph.facebook.com/me?fields=id,name,email,picture');
    return res.data;
  },
};
