export const APIRoutes = {

    sendNotification:"https://fcm.googleapis.com/fcm/send",    
    register: "/registration",
    login: '/user/login',
    updateSystemToken: '/UpdateSystemToken',
    getChatBox: '/CommunityMessage/GetChatBox',
    sendMessage: (receiverId: number) => `/CommunityMessage/SendMessage/${receiverId}`,
    getMessageById: (id: number) => `/CommunityMessage/DisplayMessage/${id}`,


}