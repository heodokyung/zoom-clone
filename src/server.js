import express from "express";
import path from 'path';
import http from "http";
import WebSocket , { WebSocketServer } from "ws";

// path 설정
const __dirname = path.resolve();  // ReferenceError: __dirname is not defined in ES module scope

// express 서버 셋팅
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/ ")); // 다른 URL로 접속해도 Home URL로 이동

const server = http.createServer(app);
const wss = new WebSocketServer({ server });


const connectList = []

// Back-end Socket 의미 => 연결된 브라우저를 의미함
wss.on("connection", (backendSocket) => {
    // 접속된 브라우저를 배열로 넣어줌.
    connectList.push(backendSocket)

    backendSocket["nickname"] = "익명의 유저"
    console.log("Connected to Browser ✅");
    backendSocket.on("close", () => { console.log("Disconnected from the Browser ❌") });
    backendSocket.on("message", (msg) => {
        const message = JSON.parse(msg);
        if (message.type.length > 0) {
            backendSocket["nickname"] = `${message.type}의 유저`;
        }
        // const nick = convert.type;
        // const text = convert.payload;
        // const message = `닉네임: ${nick}, 메시지: ${text}`;
        connectList.forEach((socketList) => socketList.send(
            `${backendSocket.nickname}: ${message.payload}`
            // message.toString()
        ));
        // console.log(msg.toString()); // .toString을 하지 않으면 <Buffer 68 65 6c 6c 6f 20 66 72 6f 6d 20 74 68 65 20 62 72 6f 77 73 65 72 21> 와 같이 메시지가 받아짐.
        // backendSocket.send(msg.toString());
    });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);
server.listen(3000, handleListen);