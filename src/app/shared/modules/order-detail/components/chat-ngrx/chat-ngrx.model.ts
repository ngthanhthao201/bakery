export class Chat {
  public avatar: string;
  public chatClass: string;
  public imagePath: string;
  public createdDate: string;
  public time: string;
  public messages: string[];
  public messageType: any;
  public name: string;

  constructor(avatar: string, chatClass:string, imagePath: string, createdDate: string,time: string, messages: string[], messageType: any, name: string) {
    this.avatar = avatar;
    this.chatClass = chatClass;
    this.imagePath = imagePath;
    this.createdDate = createdDate;
    this.time = time;
    this.messages = messages;
    this.messageType = messageType;
    this.name = name;
  }
}
