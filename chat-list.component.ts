import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';

import { GroupChatList } from 'src/app/models';
import { ChatConversationService } from 'src/app/services/chat-conversation.service';

@Component({
    selector: 'app-chat-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss'],
})

export class ChatListComponent {
    groupChatList: GroupChatList = {};
    groupChatListValue: GroupChatList = {};
    searchTerm: string = "";

    constructor(private chatConversationService: ChatConversationService, private router: Router) {}

    ngOnInit() {
        this.chatConversationService.getGroupChatList().subscribe({
            next: (groupChatList) => {
                this.groupChatListValue = groupChatList || {};
                this.chatConversationService.groupChatList=groupChatList || {};
            },

            error: (error:Error) => {
                console.log(error);
            }
        });

        this.chatConversationService.groupChatListValue.subscribe({
            next:(groupChatList) => {
                this.groupChatListValue = groupChatList;
                this.filterChatList();
            },

            error: (error:Error) => {
                console.log(error);
            }
        });
    }

    filterChatList() {
        if (this.groupChatList) {
            const groupChatList:GroupChatList={};

            Object.keys(this.groupChatListValue)
            .filter((key) => this.groupChatListValue[key].name.toLowerCase().includes(this.searchTerm.toLowerCase()))
            .sort((id1: string, id2: string) => {
                return (
                    this.groupChatListValue[id2].messages[this.groupChatListValue[id2].messages.length - 1].date - this.groupChatListValue[id1].messages[this.groupChatListValue[id1].messages.length - 1].date
                );
            })
            .forEach((id:string)=>{
                groupChatList[id]=this.groupChatListValue[id];
            });

            this.groupChatList=groupChatList;
        }
    }

    checkObjectEmpty(obj: GroupChatList): boolean {
        return Object.keys(obj).length === 0;
    }

    getObjectKeys(obj: GroupChatList): string[] {
        return Object.keys(obj);
    }

    getLastObjectKey(obj: GroupChatList): string {
        return Object.keys(obj)[Object.keys(obj).length - 1];
    }

    addGroupChat() {
        let groupName = window.prompt("Please enter group chat name");

        if (groupName?.trim()) {
            this.chatConversationService.addGroupChat({
                name: groupName,
                messages: [
                    {
                        sender: "",
                        text: "The group has been created",
                        date: this.chatConversationService.getCurrentTime(),
                    },
                ],
            })
            .subscribe(
                {
                    next:(groupChatList: GroupChatList) => {
                        this.chatConversationService.groupChatList=groupChatList;
                        this.router.navigate(["/chats", this.getLastObjectKey(groupChatList)]);
                    },

                    error: (error:Error) => {
                        console.log(error);
                    }
                }
            );
        }
    }

    formatDateTime(timestamp: number, dateFormat: string): string {
        return this.chatConversationService.formatDateTime(timestamp, dateFormat);
    }
}
