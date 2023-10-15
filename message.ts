export class Message {
    sender: string;
    text: string;
    date: number;

    constructor(sender: string, text: string, date: number) {
        this.sender = sender;
        this.text = text;
        this.date = date;
    }
}  