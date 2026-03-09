
export interface Message {
  sender_id: number;
  message: string;
  timestamp?: string;
}

export interface ChatHistoryResponse {
  type: "history";
  data: Message[];
}

export interface IncomingMessage extends Message {
  type?: "message";
}