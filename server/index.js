const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

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
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

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
app.use('/api/store', require('./routes/store'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/chat', require('./routes/chat'));


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
  console.log('connected');
  //룸에 입장
  socket.on("Join Room", storeId => {      
    //주문번호를 가지고와서 room name = orderId                 
    socket.join(storeId);
    console.log('storeId에 연결됨.');
    
  socket.on("Order Complete", data => {
    socket.join(data.storeId);
    console.log("주문에 성공하고" + data.storeId + "에 들어감");
  })

})

socket.on("Input Order", data => {
  
  console.log('Input order');
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
      return io.to(data.storeId).emit("Output Order", order)
    });
  }, 50);
  
  })
})

const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});