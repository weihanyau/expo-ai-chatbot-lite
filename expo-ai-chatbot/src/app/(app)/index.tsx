import { ChatInterface } from "@/components/chat-interface";
import { SuggestedActions } from "@/components/suggested-actions";
import { ChatInput } from "@/components/ui/chat-input";
import { useStore } from "@/lib/globalStore";
import { generateUUID } from "@/lib/utils";
import { Message } from "ai/react";
import { useChat } from "ai/react/dist/index";
import { Stack } from "expo-router";
import { fetch } from "expo/fetch";
import { MessageCirclePlusIcon } from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import { Pressable, ScrollView, type TextInput } from "react-native";
import type { ScrollView as GHScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type WeatherResult = {
  city: string;
  temperature: number;
  weatherCode: string;
  humidity: number;
  wind: number;
};

const HomePage = () => {
  const {
    clearImageUris,
    setBottomChatHeightHandler,
    setFocusKeyboard,
    chatId,
    setChatId,
  } = useStore();
  const inputRef = useRef<TextInput>(null);

  // Initialize chatId if not set
  useEffect(() => {
    if (!chatId) {
      setChatId({ id: generateUUID(), from: "newChat" });
    }
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    append,
  } = useChat({
    initialMessages: [],
    key: chatId?.id,
    id: chatId?.id,
    api: `${process.env.EXPO_PUBLIC_API_URL}/api/chat-open`,
    body: {
      id: chatId?.id,
      modelId: "gemini-2.5-flash",
    },
    onFinish: () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    },
    fetch: (url: string, options: RequestInit) => {
      return fetch(url, {
        ...options,
        signal: options.signal,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error("Fetch error:", error);
        throw error;
      });
    },
    onError(error) {
      console.log(">> error is", error.message);
    },
  });

  const handleNewChat = useCallback(() => {
    // Reset messages first
    setMessages([]);
    clearImageUris();

    // Small delay to ensure state updates have propagated
    setTimeout(() => {
      const newChatId = generateUUID();
      setChatId({ id: newChatId, from: "newChat" });
      inputRef.current?.focus();
      setBottomChatHeightHandler(false);
    }, 100);
  }, [clearImageUris, setBottomChatHeightHandler, setMessages, setChatId]);

  const handleTextChange = (text: string) => {
    handleInputChange({
      target: { value: text },
    } as any);
  };

  const { bottom } = useSafeAreaInsets();
  const scrollViewRef = useRef<GHScrollView>(null);

  // Reset messages when chatId changes
  useEffect(() => {
    if (chatId) {
      setMessages([] as Message[]);
    }
  }, [chatId, setMessages]);

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      className="flex-1 bg-white dark:bg-black"
      style={{ paddingBottom: bottom }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "hey",

          headerRight: () => (
            <Pressable disabled={!messages.length} onPress={handleNewChat}>
              <MessageCirclePlusIcon
                size={20}
                color={!messages.length ? "#eee" : "black"}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="container relative mx-auto flex-1 bg-white dark:bg-black"
        ref={scrollViewRef}
      >
        <ChatInterface
          messages={messages}
          scrollViewRef={scrollViewRef}
          isLoading={isLoading}
        />
      </ScrollView>

      {messages.length === 0 && (
        <SuggestedActions hasInput={input.length > 0} append={append} />
      )}

      <ChatInput
        ref={inputRef}
        scrollViewRef={scrollViewRef}
        input={input}
        onChangeText={handleTextChange}
        focusOnMount={false}
        onSubmit={() => {
          setBottomChatHeightHandler(true);
          handleSubmit(undefined);
          clearImageUris();
        }}
      />
    </Animated.View>
  );
};

export default HomePage;
