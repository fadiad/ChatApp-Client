import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import $ from 'jquery'


import { serverAddress } from "./constants"
let stompClient;
let messages = [];
const socketFactory = () => {
    return new SockJS(serverAddress + '/ws');
}

async function getMessageHistory() {
    fetch("http://localhost:8080/user/history?chatId=0", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
        }
    }).then((res => {
        let data = res.json();
        data.then(function (result) {
            // let msg = result.message;
            console.log("***********");
            console.log(result);
            console.log("***********");
            console.log(result.length);
            for (let i = 0; i < result.length; i++) {
                let textArea = $('#main-chat');
                textArea.val(textArea.val() + "\n" + result[i]["sender"] + " : " + result[i]["content"]);
                messages.push(result[i]);
            }

        });


    }))
}

getMessageHistory();


const onMessageReceived = (payload) => {
    console.log("payload : ", payload);
    console.log(payload);
    var message = JSON.parse(payload.body);
    messages.push(message)
    let textArea = $('#main-chat');
    textArea.val(textArea.val() + "\n" + message.sender + " : " + message.content);
}

const onUserCreated = (payload) => {
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
        token: sessionStorage.getItem("token"),
        chatId: "0"
    }))
}

export { messages, openConnection, sendPlainMessage, stompClient }