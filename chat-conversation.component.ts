import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { ChatConversationService } from 'src/app/services';
import { Conversation, UserMode } from 'src/app/models';

@Component({
    selector: 'app-chat-conversation',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat-conversation.component.html',
    styleUrls: ['./chat-conversation.component.scss'],
})

export class ChatConversationComponent {
    profileMode: string = "Anonymous";
    profileModeImage: string = "../../../assets/anonymous-user-icon.svg";
    anonymousUser: string = "../../../assets/anonymous-user-icon.svg";
    currentUser: string = "../../../assets/current-user-icon.svg";
    chatConversation!: Conversation;
    chatConversationId!: string;
    newMessage:string="";
    @ViewChild("conversationMessages") conversationMessages!:ElementRef;

    constructor(private router: Router, public chatConversationService: ChatConversationService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.pipe(
            switchMap((params) => {
                this.chatConversationId = params["id"];
                return this.chatConversationService.getGroupChatById(params["id"]);
            })
        ).subscribe({
            next: (groupChat) => {
                if (groupChat) {
                    this.chatConversation = groupChat;
                    setTimeout(() => {
                        this.conversationMessages.nativeElement.scrollTop=this.conversationMessages.nativeElement.scrollHeight;
                    }, 0);
                }

                else if (!this.chatConversation) {
                    this.router.navigate(["/chats/chat-not-found"])
                }
            },

            error: (error:Error) => {
                console.log(error);
            },
        })
    }

    hasRoute(route: string) {
        return this.router.url.includes(route);
    }

    toggleImage() {
        this.profileModeImage = this.profileModeImage === this.anonymousUser ? this.currentUser : this.anonymousUser;
        this.profileMode = this.profileMode === UserMode.anonymous ? UserMode.self : UserMode.anonymous;
    }

    sendMessage() {
        if (this.newMessage.trim() !== "") {
            this.chatConversation.messages.push({
                "sender": this.profileMode,
                "text": this.newMessage,
                date: this.chatConversationService.getCurrentTime(),
            });
            this.newMessage = "";

            
            this.chatConversationService.editGroupChat(this.chatConversationId, this.chatConversation).subscribe({
                next: (GroupChatList) => {
                    this.chatConversationService.groupChatList=GroupChatList;
                    this.conversationMessages.nativeElement.scrollTop=this.conversationMessages.nativeElement.scrollHeight;
                },

                error: (error:Error) => {
                    console.log(error);
                }
            })
        }
    }

    deleteGroupChat(id: string) {
        if (window.confirm("are you sure that you want to delete?")) {
            this.chatConversationService.deleteGroupChat(id).subscribe({
                next: (groupChatList) => {
                    if(groupChatList) {
                        this.chatConversationService.groupChatList=groupChatList;
                    }

                    else {
                        this.chatConversationService.groupChatList={};
                    }
                    
                    this.router.navigate(["/chats"]);
                },

                error: (error:Error) => {
                    console.log(error);
                }
            })
        }
    }

    formatDateTime(date:number, format:string) {
        return this.chatConversationService.formatDateTime(date, format);
    }
}
