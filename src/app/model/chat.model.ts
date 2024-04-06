export interface ChatBoxI {
    employeeId: number;
    employeeName: string;
    lastMessage: string;
    isSeen: boolean
    newMessages: number;
    recieverId: number;
    recieverName: string;
    lastActive: string;
}

export interface MessageI{
    id: number;
    message: string;
    name: string;
    userType: string;
    senderId: number;
    isSeen: boolean;
    messageDate: string;
}