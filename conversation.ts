import { Message } from "./message";

export interface Conversation {
  name:string,
  messages:Message[],
}  

export interface GroupChatList {
  [id:string] : Conversation,
}

export enum UserMode {
  self="You",
  anonymous="Anonymous"
}