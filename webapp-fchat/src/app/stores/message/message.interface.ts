
export interface Message{
    id?: string;
    content?: string;
    date?: string;
    sender_id?: string;
    receiver_id?: string;
    conversation_id?: string
}

export interface Conversation{
    id?: string;
    user_id_1?: string;
    user_id_2?: string;
}