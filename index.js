
const express = require('express')
const cors = require('cors');
const app = express()
const routes = require('./routes/routes.js');
const path = require('path')
var bodyParser = require('body-parser')
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000

app.use(cors());


//SocketIo
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', sock => {
  console.log(`ID: ${sock.id} entrou`)

  sock.on('event', data => {
      console.log(data)
  });

  sock.on('disconnect', () => {
      console.log(`ID: ${sock.id} saiu`)
  });
});


// parse application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());



//rota para teste
app.get('/test', function (req, res) {
  res.send('Hello World')
});


//rota para pagina principal

app.use(express.static(__dirname + '/public'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname,'index.html'));
});


//solicitando as rotas, para execução das funções
app.use('/',routes);


//Escutando Porta Aleatória e IP Publico, para deploy 
server.listen(PORT, "0.0.0.0")
console.log(`O servidor está rodando na porta  ${PORT} `)