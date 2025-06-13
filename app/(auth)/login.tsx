import { facebookService } from "@/service/facebook";
import { useAuthStore } from "@/store/auth";
import { CLIENT_ID } from '@env';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as AuthSession from "expo-auth-session";
import * as facebook from "expo-auth-session/providers/facebook";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [user, setUser] = useState(null);
  // Sử dụng redirectUri với useProxy: true để đảm bảo Expo Go có redirect URI
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);

  const [request, response, promptAsync] = facebook.useAuthRequest({
    clientId: CLIENT_ID,
    redirectUri, // Đảm bảo truyền redirectUri này
    scopes: [
      "public_profile",
      "email",
      "pages_show_list", // Xem danh sách Fanpage
      "pages_read_engagement", // Đọc dữ liệu tương tác Fanpage (bài viết, bình luận, lượt thích)
      "ads_management", // Quản lý quảng cáo
      "ads_read", // Đọc dữ liệu quảng cáo
      "business_management", // Quản lý tài khoản Business Manager
    ],
    responseType: AuthSession.ResponseType.Token,
  });
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  useEffect(() => {
    if (response && response?.type === "success" && response.authentication) {
      const { authentication } = response;
      (async () => {
        try {
          // Import facebookService nếu chưa import
          const campaigns = await facebookService.getPersonalAdCampaigns(
            authentication.accessToken
          );
          console.log("Personal Ad Campaigns:", campaigns);
        } catch (err) {
          console.log("Lỗi lấy campaign quảng cáo cá nhân:", err);
        }
        // --- END ---
      })();
    }
  }, [response]);
  const handleFacebookLogin = async () => {
    // TODO: Implement Facebook login logic
    const result = await promptAsync();
    if (result.type === "success" && result.authentication?.accessToken) {
      await login(result.authentication.accessToken);
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fbButton}
        onPress={handleFacebookLogin}
        activeOpacity={0.8}
      >
        <MaterialIcons name="facebook" size={24} color="white" />
        <Text style={styles.fbButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    alignItems: "center",
  },
  fbButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1877F2",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: 300,
    justifyContent: "center",
    // Chỉ dùng boxShadow cho web, elevation cho mobile, KHÔNG dùng shadow* props
    ...(Platform.OS === 'web'
      ? { boxShadow: "0px 2px 2px rgba(0,0,0,0.2)" }
      : { elevation: 2 }),
  },
  fbButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
