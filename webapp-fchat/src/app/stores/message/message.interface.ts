
export interface Message{
    id?: string;
    content?: string;
    date?: string;
    sender_id?: string;
    receiver_id?: string;
    conversation_id?: string;
    is_read?: boolean
}

export interface Conversation{
    conversation_id?: string
    messages: Message[]
}