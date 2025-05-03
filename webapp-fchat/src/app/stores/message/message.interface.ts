export interface Message {
  id?: string;
  content?: string;
  sender?: {
    id: string;
  };
  receiver?: {
    id: string;
  };
  is_read?: boolean;
  date?: string;
}

export interface Conversation {
  conversation_id?: string;
  user1?: {
    id: string;
  };
  user2?: {
    id: string;
  };
  messages: Message[];
}

export interface Notification {
  id: string;
  date: string;
  sender_id: string;
  content: string;
  conversation_id: string;
}
