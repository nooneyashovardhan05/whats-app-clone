import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { GroupChatList, Conversation } from '../models';

@Injectable({
    providedIn: 'root',
})

export class ChatConversationService {
    private baseUrl: string = "https://chat-app-603fc-default-rtdb.firebaseio.com/chats";
    private groupChatListSubject = new BehaviorSubject<GroupChatList>({});

    constructor(private http: HttpClient, private datePipe: DatePipe) { }

    getGroupChatList(): Observable<GroupChatList> {
        return this.http.get<GroupChatList>(`${this.baseUrl}.json`);
    }

    getGroupChatById(id: string): Observable<Conversation> {
        return this.http.get<Conversation>(`${this.baseUrl}/${id}.json`)
    }

    addGroupChat(contact: Conversation): Observable<GroupChatList> {
        return this.http.post<Conversation>(`${this.baseUrl}.json`, contact).pipe(
            switchMap(() => {
                return this.getGroupChatList();
            })
        );
    }

    deleteGroupChat(id: string): Observable<GroupChatList> {
        return this.http.delete(`${this.baseUrl}/${id}.json`).pipe(
            switchMap(() => {
                return this.getGroupChatList();
            })
        );
    }

    editGroupChat(id: string, conversation: Conversation): Observable<GroupChatList> {
        return this.http.put(`${this.baseUrl}/${id}.json`, conversation).pipe(
            switchMap(() => {
                return this.getGroupChatList();
            })
        );
    }

    get groupChatListValue():BehaviorSubject<GroupChatList> {
        return this.groupChatListSubject;
    }

    set groupChatList(groupChatList: GroupChatList) {
        this.groupChatListSubject.next(groupChatList);
    }

    getCurrentTime(): number {
        return new Date().getTime();
    }

    formatDateTime(timestamp: number, dateFormat: string): string {
        if (this.datePipe.transform(this.getCurrentTime(),"shortDate") === this.datePipe.transform(timestamp, "shortDate")) {
            return this.datePipe.transform(timestamp, "h:mm a") as string;
        } 
        
        else {
            return this.datePipe.transform(timestamp, dateFormat) as string;
        }
    }
}
