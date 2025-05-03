import { Conversation, Message } from "./message.interface";

export interface MessageState{
    allConversations: Conversation[] | null  | undefined,
    currentConversationId: string | null;
    currentConversation:  {conversation_id?: string, messages: Message[]} | null  | undefined
    isLoading: boolean,
    error: string | null;
}


export const initialMessageState: MessageState = {
    allConversations: null,
    currentConversationId: null,
    currentConversation: null,
    isLoading: false,
    error: '',
}