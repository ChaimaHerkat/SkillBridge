import apiCall from './api'
import type { Message, Conversation } from '../types/message'

export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    return apiCall('/messages/conversations')
  },

  getConversationMessages: async (conversationId: string): Promise<Message[]> => {
    return apiCall(`/messages/conversations/${conversationId}`)
  },

  sendMessage: async (recipientId: string, content: string, attachments?: string[]): Promise<Message> => {
    return apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipientId, content, attachments }),
    })
  },

  markAsRead: async (messageId: string): Promise<void> => {
    await apiCall(`/messages/${messageId}/read`, { method: 'PUT' })
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    await apiCall(`/messages/${messageId}`, { method: 'DELETE' })
  },
}

export default messageService
