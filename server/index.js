const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')
const { Expo } = require('expo-server-sdk');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});
const { Store } = require("./models/Store");

const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require("mongoose");
const { SocketAddress } = require("net");
const { User } = require("./models/User");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo({ accessToken: 'gR47dvs83M7osTZYes9Tjy16IsEhn9hNq3iD33Md' });

// Create the messages that you want to send to clients
let messages = [];
let somePushTokens = 'ExponentPushToken[NKJmVuFtIol0zCrvDS3z1z]'


app.use(cors())

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/owners', require('./routes/owners'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/payments', require('./routes/payments'));



//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder   
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}


//주문을 완료하면 유저와 사장님을 소켓으로 연결시켜줌
io.on("connection", (socket) => {
  
 //StoreId로 Room을 생성, 유저가 order success 시에 Join Room을 통해 상점과 소켓으로 연결됨  
  socket.on("Join Room", data => {  
    socket.join(data.storeId);
  })

  //주문정보를 StoreId로 보냄
  socket.on("Input Order", data => {
    //주문자를 orderId로 생성한 room에 입장시킴
    socket.join(data.orderId);

    // Store 컬렉션에 저장된 주문정보를 소켓으로 연결된 상점에 전송
    setTimeout(() => {
      Store.findOne({ _id: data.storeId, order: { $elemMatch: { orderId: data.orderId }}},{
        "_id": false,
        "order": {
            $elemMatch:{
              "orderId": data.orderId
            }
          }
        }).exec((err, order) => {
        if (err) console.log(err);
        return io.to(data.storeId).emit("Output Order", order);
        
      });
    }, 50);
  })

  //상점에서 주문 state 변경 시 orderId의 room(사장과 주문한 손님 둘만 있는 방)을 통해 주문 상태 변경 내역 전송
  socket.on("Input Order State", data => {
    let messages = []
    const message = (state) => {
      console.log(state);
      switch(state){
        case '조리중':
          return '주문하신 음식의 조리를 시작하였습니다.'
          break;
        case '주문취소':
          return '주문하신 음식의 주문이 취소되었습니다.'
          break;
        case '배달중':
          return '라이더가 음식을 픽업하였습니다.'
          break;
        case '배달완료':
          return '주문하신 음식의 배달이 완료되었습니다.'
          break;
      }
    }
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(data.token)) {
      console.error(`Push token ${data.token} is not a valid Expo push token`);
    } else {
      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: data.token,
        sound: 'default',
        body: message(data.state),
      })

      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
    }

    return io.to(data.orderId).emit("Output Order State", data);
  })

  socket.on("Join OrderId Room", data => {     
    socket.join(data.orderId);
  })
})



const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});