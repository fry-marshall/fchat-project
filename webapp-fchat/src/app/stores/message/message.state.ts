import { Message } from "./message.interface";

export interface MessageState{
    allMessages: {conversation_id: string, messages: Message[]}[] | null  | undefined,
    currentConversationId: string | null;
    isLoading: boolean,
    error: string | null;
}


export const initialMessageState: MessageState = {
    allMessages: null,
    currentConversationId: null,
    isLoading: false,
    error: '',
}