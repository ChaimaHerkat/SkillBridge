import apiCall from "./api";
import type { Message } from "../types/message";

export interface ConversationUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Conversation {
  user: ConversationUser;
  last_message?: Message;
  unread_count: number;
}

interface BackendMessage {
  id: number;
  sender: number;
  recipient: number;
  content: string;
  read: boolean;
  created_at: string;
}

interface BackendConversation {
  user: ConversationUser;
  last_message?: BackendMessage;
  unread_count: number;
}

/**
 * Convert backend message format
 * to frontend Message format.
 */
const mapMessage = (
  message: BackendMessage
): Message => ({
  id: message.id,
  senderId: message.sender,
  receiverId: message.recipient,
  content: message.content,
  createdAt: message.created_at,
  read: message.read,
});

export const messageService = {
  /**
   * Get all conversations of the current user.
   */
  getConversations: async (): Promise<Conversation[]> => {
    const data = await apiCall<BackendConversation[]>(
      "/messages/conversations/"
    );

    return data.map((conversation) => ({
      user: conversation.user,

      last_message: conversation.last_message
        ? mapMessage(conversation.last_message)
        : undefined,

      unread_count: conversation.unread_count,
    }));
  },

  /**
   * Search users to start a new conversation.
   */


  searchUsers: async (
  query: string
): Promise<ConversationUser[]> => {
  console.log("🔎 Searching user:", query);

  const data = await apiCall<ConversationUser[]>(
    `/messages/users/search/?q=${encodeURIComponent(query)}`
  );

  console.log("👥 Search result:", data);

  return data;
},




  /**
   * Get messages between current user
   * and another user.
   */
  getConversation: async (
    otherUserId: string
  ): Promise<Message[]> => {
    const data = await apiCall<BackendMessage[]>(
      `/messages/?user=${otherUserId}`
    );

    return data.map(mapMessage);
  },


  /**
   * Mark all messages from one user as read.
   */
  markConversationAsRead: async (
    userId: string
  ): Promise<void> => {
    await apiCall(
      `/messages/conversations/${userId}/read/`,
      {
        method: "POST",
      }
    );
  },


  /**
   * Send a message.
   */
  sendMessage: async (
    recipientId: string,
    content: string,
    attachments?: string[]
  ): Promise<Message> => {
    const data = await apiCall<BackendMessage>(
      "/messages/",
      {
        method: "POST",

        body: JSON.stringify({
          recipient: recipientId,
          content,
          attachments,
        }),
      }
    );

    return mapMessage(data);
  },

  /**
   * Get all messages involving current user.
   */
  getMyMessages: async (): Promise<Message[]> => {
    const data = await apiCall<BackendMessage[]>(
      "/messages/"
    );

    return data.map(mapMessage);
  },

  /**
   * Mark a message as read.
   */
  markAsRead: async (
    messageId: string
  ): Promise<void> => {
    await apiCall(
      `/messages/${messageId}/read/`,
      {
        method: "PUT",
      }
    );
  },

  /**
   * Delete a message.
   */
  deleteMessage: async (
    messageId: string
  ): Promise<void> => {
    await apiCall(
      `/messages/${messageId}/`,
      {
        method: "DELETE",
      }
    );
  },
};

export default messageService;

