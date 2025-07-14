import { customModel } from "@/lib/ai";
import { systemPrompt } from "@/lib/ai/prompts";
import { generateUUID } from "@/lib/utils";
import {
    convertToCoreMessages,
    createDataStreamResponse,
    streamText,
    tool,
} from "ai";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    console.log(">> Request received");
    const { messages, modelId = "gemini-2.5-flash" } = await request.json();
    console.log(">> Messages:", messages);

    // const model = models.find((m) => m.id === modelId) || models[0];
    // console.log(">> Using model:", model);
    const coreMessages = convertToCoreMessages(messages);
    const userMessageId = generateUUID();

    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData({
          type: "user-message-id",
          content: userMessageId,
        });

        const result = streamText({
          model: customModel(),
          system: systemPrompt,
          messages: coreMessages,
          maxSteps: 5,
          tools: {
            getWeather: tool({
              description: "Get the weather in a location",
              parameters: z.object({
            location: z
              .string()
              .describe("The location to get the weather for"),
              }),
              execute: async ({ location }) => ({
            city: location,
            current: {
              temperature_2m: 72 + Math.floor(Math.random() * 21) - 10,
              weathercode: Math.floor(Math.random() * 100),
              relative_humidity_2m: 40 + Math.floor(Math.random() * 40),
              wind_speed_10m: Math.floor(Math.random() * 20),
            }
              }),
            }),
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function GET() {
  return new Response("Ready", { status: 200 });
}
