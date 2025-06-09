import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function LoginScreen() {
  const handleFacebookLogin = () => {
    // TODO: Implement Facebook login logic
    console.log("Facebook login clicked");
  };

  return (
    <Center className="flex-1 bg-background-light text-center">
      <VStack className="w-full px-4" space="md">
        <Box className="w-full max-w-[400px]">
          <Button
            onPress={handleFacebookLogin}
            action="primary"
            variant="solid"
            size="lg"
            className=" w-full bg-[#1877F2]"
          >
            <MaterialIcons name="facebook" size={24} color="white" />
            <ButtonText className="ml-2 text-white">
              Continue with Facebook
            </ButtonText>
          </Button>
        </Box>
      </VStack>
    </Center>
  );
} 