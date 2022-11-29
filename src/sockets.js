import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import $ from 'jquery'


import { serverAddress } from "./constants"
let stompClient;
let messages = [];
const socketFactory = () => {
    return new SockJS(serverAddress + '/ws');
}

const onMessageReceived = (payload) => {
    console.log("payload : " , payload);
    console.log(payload);
    var message = JSON.parse(payload.body);
    messages.push(message)
    let textArea = $('#main-chat');
    textArea.val(textArea.val() + "\n" + message.sender + " : " + message.content);
}

const onUserCreated =(payload) =>{
    console.log("@@@@@@@@@")
    JSON.parse(payload.body)
}

const onConnected = () => {
    stompClient.subscribe('/topic/mainChat', onMessageReceived);
    stompClient.subscribe('/test', onUserCreated);
}

const openConnection = () => {
    const socket = socketFactory();
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected);
}

const sendPlainMessage = (user, message) => {
    stompClient.send("/app/plain", [], JSON.stringify({
        sender: user + " ",
        content: " " + message,
        token: sessionStorage.getItem("token")
    }))
}

export { messages,openConnection, sendPlainMessage,stompClient }