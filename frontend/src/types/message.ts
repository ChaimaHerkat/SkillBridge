export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: string[];
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}
