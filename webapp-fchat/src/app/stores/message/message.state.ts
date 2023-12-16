import { Message } from "./message.interface";

export interface MessageState{
    allMessages: {conversation_id?: string, messages: Message[]}[] | null  | undefined,
    currentConversationId: string | null;
    currentConversation:  {conversation_id?: string, messages: Message[]} | null  | undefined
    isLoading: boolean,
    error: string | null;
}


export const initialMessageState: MessageState = {
    allMessages: null,
    currentConversationId: null,
    currentConversation: null,
    isLoading: false,
    error: '',
}