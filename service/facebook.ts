import api from '@/utils/axiosConfig';
import { URL_API } from '@env';

export const facebookService = {
  async getUserInfo() {
    // Lấy thông tin user Facebook (token đã tự động gắn trong axiosConfig)
    const res = await api.get(`${URL_API}/me?fields=id,name,email,picture`);
    return res.data;
  },

  /**
   * Lấy danh sách chiến dịch quảng cáo Facebook cá nhân (Graph API)
   * @param accessToken: token Facebook user
   * @returns danh sách campaign (nếu có quyền)
   *
   * Lưu ý: User phải có quyền quảng cáo, và cần lấy ad_account_id cá nhân trước.
   * Ví dụ: /me/adaccounts để lấy ad_account_id, sau đó /act_<ad_account_id>/campaigns
   */
  async getPersonalAdCampaigns(accessToken: string) {
    try {
      // Bước 1: Lấy danh sách ad account cá nhân
      const adAccountsRes = await api.get(
        `${URL_API}/me/adaccounts?access_token=${accessToken}&__cppo=1&debug=all&format=json&method=get&origin_graph_explorer=1&pretty=0&suppress_http_code=1&transport=cors`
      );
      const adAccounts = (adAccountsRes.data as any).data;
      if (!adAccounts || adAccounts.length === 0) {
        throw new Error('Không tìm thấy tài khoản quảng cáo cá nhân nào!');
      }
      const adAccountId = adAccounts[2].id; // Lấy ad_account_id đầu tiên
      // Bước 2: Lấy danh sách campaign của ad account này
      const campaignsRes = await api.get(
        `${URL_API}/${adAccountId}/campaigns?access_token=${accessToken}&fields=id,name,status,objective,effective_status,start_time,stop_time`
      );
      return campaignsRes.data;
    } catch (err: any) {
      // Log lỗi chi tiết để debug
      if (err && err.response && err.response.data) {
        console.error('Facebook API error:', err.response.data);
        throw new Error(
          err.response.data.error?.message || 'Lỗi Facebook API khi lấy campaign!'
        );
      } else {
        console.error('Facebook API error:', err);
        throw err;
      }
    }
  },
};
