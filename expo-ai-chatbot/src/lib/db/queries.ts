// import { and, asc, desc, eq, gt, gte } from "drizzle-orm";
import postgres from "postgres";
// import { drizzle } from "drizzle-orm/postgres-js";
import { fetchApi } from "../api-client";

// export async function deleteChatById({ id }: { id: string }) {
//   try {
//     try {
//       await db.delete(vote).where(eq(vote.chatId, id));
//     } catch (error) {
//       console.log("No votes to delete or votes table not available");
//     }

//     await db.delete(message).where(eq(message.chatId, id));
//     return await db.delete(chat).where(eq(chat.id, id));
//   } catch (error) {
//     console.error("Failed to delete chat by id from database");
//     throw error;
//   }
// }

export async function getChatsByUserId({ token }: { token: string }) {
  const response = await fetchApi("/api/history", { token });
  const chats = await response.json();
  return chats;
}

export async function getChatById({
  chatId,
  token,
}: {
  chatId: string;
  token: string;
}) {
  const response = await fetchApi("/api/chat", { chatId, token });
  const chat = await response.json();
  return chat;
}

// export async function getChatById({ id }: { id: string }) {
//   try {
//     const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
//     return selectedChat;
//   } catch (error) {
//     console.error("Failed to get chat by id from database");
//     throw error;
//   }
// }

// export async function saveMessages({ messages }: { messages: Array<Message> }) {
//   try {
//     return await db.insert(message).values(messages);
//   } catch (error) {
//     console.error("Failed to save messages in database", error);
//     throw error;
//   }
// }

// export async function getMessagesByChatId({ id }: { id: string }) {
//   return fetchApi(`/api/chats/${encodeURIComponent(id)}/messages`);
// }

// export async function voteMessage({
//   chatId,
//   messageId,
//   type,
// }: {
//   chatId: string;
//   messageId: string;
//   type: "up" | "down";
// }) {
//   try {
//     const [existingVote] = await db
//       .select()
//       .from(vote)
//       .where(and(eq(vote.messageId, messageId)));

//     if (existingVote) {
//       return await db
//         .update(vote)
//         .set({ isUpvoted: type === "up" })
//         .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
//     }
//     return await db.insert(vote).values({
//       chatId,
//       messageId,
//       isUpvoted: type === "up",
//     });
//   } catch (error) {
//     console.log("Failed to vote message, skipping");
//     return null;
//   }
// }

// export async function getVotesByChatId({ id }: { id: string }) {
//   try {
//     const votes = await db.select().from(vote).where(eq(vote.chatId, id));
//     return votes;
//   } catch (error) {
//     console.log("Failed to get votes, returning empty array");
//     return [];
//   }
// }

// export async function getDocumentsById({ id }: { id: string }) {
//   try {
//     const documents = await db
//       .select()
//       .from(document)
//       .where(eq(document.id, id))
//       .orderBy(asc(document.createdAt));

//     return documents;
//   } catch (error) {
//     console.error("Failed to get document by id from database");
//     throw error;
//   }
// }

// export async function getDocumentById({ id }: { id: string }) {
//   try {
//     const [selectedDocument] = await db
//       .select()
//       .from(document)
//       .where(eq(document.id, id))
//       .orderBy(desc(document.createdAt));

//     return selectedDocument;
//   } catch (error) {
//     console.error("Failed to get document by id from database");
//     throw error;
//   }
// }

// export async function deleteDocumentsByIdAfterTimestamp({
//   id,
//   timestamp,
// }: {
//   id: string;
//   timestamp: Date;
// }) {
//   try {
//     await db
//       .delete(suggestion)
//       .where(
//         and(
//           eq(suggestion.documentId, id),
//           gt(suggestion.documentCreatedAt, timestamp),
//         ),
//       );

//     return await db
//       .delete(document)
//       .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
//   } catch (error) {
//     console.error(
//       "Failed to delete documents by id after timestamp from database",
//     );
//     throw error;
//   }
// }

// export async function saveSuggestions({
//   suggestions,
// }: {
//   suggestions: Array<Suggestion>;
// }) {
//   try {
//     return await db.insert(suggestion).values(suggestions);
//   } catch (error) {
//     console.error("Failed to save suggestions in database");
//     throw error;
//   }
// }

// export async function getSuggestionsByDocumentId({
//   documentId,
// }: {
//   documentId: string;
// }) {
//   try {
//     return await db
//       .select()
//       .from(suggestion)
//       .where(and(eq(suggestion.documentId, documentId)));
//   } catch (error) {
//     console.error(
//       "Failed to get suggestions by document version from database",
//     );
//     throw error;
//   }
// }

// export async function getMessageById({ id }: { id: string }) {
//   try {
//     return await db.select().from(message).where(eq(message.id, id));
//   } catch (error) {
//     console.error("Failed to get message by id from database");
//     throw error;
//   }
// }

// export async function deleteMessagesByChatIdAfterTimestamp({
//   chatId,
//   timestamp,
// }: {
//   chatId: string;
//   timestamp: Date;
// }) {
//   try {
//     return await db
//       .delete(message)
//       .where(
//         and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
//       );
//   } catch (error) {
//     console.error(
//       "Failed to delete messages by id after timestamp from database",
//     );
//     throw error;
//   }
// }

// export async function updateChatVisiblityById({
//   chatId,
//   visibility,
// }: {
//   chatId: string;
//   visibility: "private" | "public";
// }) {
//   try {
//     return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
//   } catch (error) {
//     console.error("Failed to update chat visibility in database");
//     throw error;
//   }
// }
