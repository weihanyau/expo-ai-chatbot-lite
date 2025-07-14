import Providers from "@/providers";
import structuredClone from "@ungap/structured-clone";
import { Stack } from "expo-router";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import(
      "react-native/Libraries/Utilities/PolyfillFunctions"
    );

    const { TextEncoderStream, TextDecoderStream } = await import(
      "@stardazed/streams-text-encoding"
    );

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export { };
export default function Layout() {
  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(app)/index"
          options={{
            headerTitle: "Expo AI Chatbot",
          }}
        />
      </Stack>
    </Providers>
  );
}
