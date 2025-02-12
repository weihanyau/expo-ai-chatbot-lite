import { processChatResponse } from "../../ui-utils/src/process-chat-response";
import { processTextStream } from "../../ui-utils/src/process-text-stream";
import type { IdGenerator, JSONValue, Message, UseChatOptions } from "../../ui-utils/src/types";

// use function to allow for mocking in tests:
const getOriginalFetch = () => fetch;

export async function callChatApi({
	api,
	body,
	streamProtocol = "data",
	credentials,
	headers,
	abortController,
	restoreMessagesOnFailure,
	onResponse,
	onUpdate,
	onFinish,
	onToolCall,
	generateId,
	fetch = getOriginalFetch(),
}: {
	api: string;
	body: Record<string, any>;
	streamProtocol: "data" | "text" | undefined;
	credentials: RequestCredentials | undefined;
	headers: HeadersInit | undefined;
	abortController: (() => AbortController | null) | undefined;
	restoreMessagesOnFailure: () => void;
	onResponse: ((response: Response) => void | Promise<void>) | undefined;
	onUpdate: (newMessages: Message[], data: JSONValue[] | undefined) => void;
	onFinish: UseChatOptions["onFinish"];
	onToolCall: UseChatOptions["onToolCall"];
	generateId: IdGenerator;
	fetch: ReturnType<typeof getOriginalFetch> | undefined;
}) {
    console.log('>> before fetch')
	const response = await fetch(api, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		signal: abortController?.()?.signal,
		credentials,
	}).catch((err) => {
		restoreMessagesOnFailure();
		throw err;
	});
    console.log('>> after fetch response', response)

	if (onResponse) {
		try {
			await onResponse(response);
		} catch (err) {
			throw err;
		}
	}

	if (!response.ok) {
		restoreMessagesOnFailure();
		throw new Error(
			(await response.text()) ?? "Failed to fetch the chat response.",
		);
	}

	if (!response.body) {
		throw new Error("The response body is empty.");
	}

    console.log('>> before switch streamProtocol')
	switch (streamProtocol) {
		case "text": {
			const resultMessage = {
				id: generateId(),
				createdAt: new Date(),
				role: "assistant" as const,
				content: "",
			};

			await processTextStream({
				stream: response.body,
				onTextPart: (chunk) => {
					resultMessage.content += chunk;

					// note: creating a new message object is required for Solid.js streaming
					onUpdate([{ ...resultMessage }], []);
				},
			});

			// in text mode, we don't have usage information or finish reason:
			onFinish?.(resultMessage, {
				usage: {
					completionTokens: Number.NaN,
					promptTokens: Number.NaN,
					totalTokens: Number.NaN,
				},
				finishReason: "unknown",
			});
			return;
		}

		case "data": {
			await processChatResponse({
				stream: response.body,
				update: onUpdate,
				onToolCall,
				onFinish({ message, finishReason, usage }) {
					if (onFinish && message != null) {
						onFinish(message, { usage, finishReason });
					}
				},
				generateId,
			});
			return;
		}

		default: {
			const exhaustiveCheck: never = streamProtocol;
			throw new Error(`Unknown stream protocol: ${exhaustiveCheck}`);
		}
	}
}
