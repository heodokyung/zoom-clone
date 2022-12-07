const msgList = document.querySelector('.message__box');
const msgForm = document.querySelector('.message form');


// Front-end Sccket 의미 => 서버로의 연결을 의미
const fontendSocket = new WebSocket(`ws://${window.location.host}`); //window.location.host => localhost:3000

// 서버와 연결 됨
fontendSocket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
})

// 서버로부터 전달받은 메시지
fontendSocket.addEventListener("message", (msg) => {
    const p = document.createElement('p');
    p.innerText = `New message: ${msg.data}`;
    msgList.append(p)
    // console.log("New message: ", msg.data);
});

// 서버와 연결이 끊김
fontendSocket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

// setTimeout(() => {
//     fontendSocket.send("hello Server!!");
// }, 10000);


String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
}

function makeMessage(type, payload) {
    const msg = {type, payload };
    return JSON.stringify(msg);
}

function handleSubmit(event) {
    event.preventDefault();
    const msgInput = document.querySelector('.message .i-message');
    const nickInput = document.querySelector('.message .i-nickname');
    const msgValue = msgInput.value.trim()
    const nickValue = nickInput.value.trim()
    if (msgValue.length > 0) {
        fontendSocket.send(makeMessage(nickValue, msgValue));
        msgInput.value = "";
        // nickInput.value = "";
        msgInput.focus();
    } else {
        alert("메시지를 작성해 주세요!")
    }
}

msgForm.addEventListener("submit", handleSubmit)