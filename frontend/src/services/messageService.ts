import apiCall from './api'
import type { Message } from '../types/message'

export const messageService = {
  // Get messages between current user and another user
  getConversation: async (otherUserId: string): Promise<Message[]> => {
    return apiCall(`/messages?user=${otherUserId}`)
  },

  // Send a message to recipient (recipient is user id)
  sendMessage: async (recipientId: string, content: string, attachments?: string[]): Promise<Message> => {
    return apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipient: recipientId, content, attachments }),
    })
  },

  // Get all messages involving current user
  getMyMessages: async (): Promise<Message[]> => {
    return apiCall('/messages')
  },

  // Legacy / future endpoints (not implemented on backend yet)
  markAsRead: async (messageId: string): Promise<void> => {
    await apiCall(`/messages/${messageId}/read`, { method: 'PUT' })
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    await apiCall(`/messages/${messageId}`, { method: 'DELETE' })
  },
}

export default messageService
