import { useAuthStore } from "@/store/auth";
import { fetchJson } from "@/utils/fetchJson";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as AuthSession from "expo-auth-session";
import * as facebook from "expo-auth-session/providers/facebook";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [user, setUser] = useState(null);
  // Sử dụng redirectUri với useProxy: true để đảm bảo Expo Go có redirect URI
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);

  const [request, response, promptAsync] = facebook.useAuthRequest({
    clientId: "600618219704755",
    redirectUri, // Đảm bảo truyền redirectUri này
    scopes: ["public_profile", "email"],
    responseType: AuthSession.ResponseType.Token,
  });
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  useEffect(() => {
    if (response && response?.type === "success" && response.authentication) {
      const { authentication } = response;
      (async () => {
        // Fetch user data from Facebook Graph API
        const userData = await fetchJson(
          `https://graph.facebook.com/me?access_token=${authentication.accessToken}&fields=id,name,email,picture`
        );
        setUser(userData);
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  fbButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
