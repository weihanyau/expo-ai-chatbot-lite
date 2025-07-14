import { ActivityIndicator, ScrollView, View } from "react-native";

// import Markdown from "react-native-markdown-display";
import { LottieLoader } from "@/components/lottie-loader";
import { CustomMarkdown } from "@/components/ui/markdown";
import { Text } from "@/components/ui/text";
import WeatherCard from "@/components/weather";
import { WelcomeMessage } from "@/components/welcome-message";
import { cn } from "@/lib/utils";
import { useKeyboard } from "@react-native-community/hooks";
import React, { forwardRef } from "react";

type ToolInvocation = {
  toolName: string;
  toolCallId: string;
  state: string;
  result?: any;
};

type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
  toolInvocations?: ToolInvocation[];
};

type ChatInterfaceProps = {
  messages: Message[];
  scrollViewRef: React.RefObject<ScrollView>;
  isLoading?: boolean;
};

export const ChatInterface = forwardRef<ScrollView, ChatInterfaceProps>(
  ({ messages, scrollViewRef, isLoading }, ref) => {
    const { keyboardShown, keyboardHeight } = useKeyboard();
    console.log(messages.find((m) => !!m.toolInvocations)?.toolInvocations);

    return (
      <View className="flex-1">
        <ScrollView ref={ref} className="flex-1 space-y-4 p-4">
          {!messages.length && <WelcomeMessage />}
          {messages.length > 0
            ? messages.map((m, index) => (
                <React.Fragment key={m.id}>
                  {m.toolInvocations?.map((t) => {
                    if (t.toolName === "getWeather") {
                      if (t.state !== "result") {
                        return (
                          <View
                            key={t.toolCallId}
                            className={cn(
                              "mt-4 max-w-[85%] rounded-2xl bg-muted/50 p-4",
                            )}
                          >
                            <ActivityIndicator size="small" color="white" />
                            <Text style={{color: "white"}}>Getting weather data...</Text>
                          </View>
                        );
                      }
                      if (t.state === "result") {
                        return (
                          <WeatherCard
                            key={t.toolCallId}
                            city={t.result.city || "Unknown"}
                            temperature={t.result.current.temperature_2m}
                            weatherCode={t.result.current.weathercode}
                            humidity={t.result.current.relative_humidity_2m}
                            wind={t.result.current.wind_speed_10m}
                          />
                        );
                      }
                    }
                    return null;
                  })}

                  <View
                    className={`flex-row px-4 ${m.role === "user" ? "ml-auto max-w-[85%]" : "max-w-[95%] pl-0"} rounded-3xl ${m.role === "user" ? "bg-muted/50" : ""} `}
                  >
                    {m.content.length > 0 && (
                      <>
                        <View
                          className={
                            m.role === "user"
                              ? ""
                              : "mr-2 mt-1 h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                          }
                        >
                          <Text className="text-base text-white">
                            {m.role === "user" ? "" : "🤖"}
                          </Text>
                        </View>
                        <CustomMarkdown content={m.content} />
                      </>
                    )}
                  </View>
                  {isLoading &&
                    messages[messages.length - 1].role === "user" &&
                    m === messages[messages.length - 1] && (
                      <View className="flex-row">
                        <View
                          className={
                            "mr-2 mt-1 h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                          }
                        >
                          <Text className="text-base">{"🤖"}</Text>
                        </View>
                        <View className="-ml-2 -mt-[1px]">
                          <LottieLoader width={40} height={40} />
                        </View>
                      </View>
                    )}
                </React.Fragment>
              ))
            : null}
        </ScrollView>
      </View>
    );
  },
);
