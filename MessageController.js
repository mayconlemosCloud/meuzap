"use strict";

const venom = require('venom-bot');
const fs = require('fs');
var clientsArray = [];


async function opendata(req, res,sessionName) {


    clientsArray[sessionName] = await venom
    
    .create( sessionName,
     ( base64Qrimg, asciiQR, attempts) => {
        exportQR(req, res, base64Qrimg, sessionName + '.png', sessionName)
     }, 
     (statusSession, session) => {}, 
     { useChrome: false, browserArgs: ['--no-sandbox'] } )   

    .catch((erro) => {
      console.log(erro);
    });

    await start(req, res, clientsArray, sessionName);


    res.status(201).json({
        response: 'Sessão aberta com sucesso!',
    })

    req.io.emit('whatsapp-status', true)

  
}

function exportQR(req, res, qrCode, path, session) {
    qrCode = qrCode.replace('data:image/png;base64,', '');
    const imageBuffer = Buffer.from(qrCode, 'base64');
  
    

    fs.writeFileSync(path, imageBuffer);
    req.io.emit('qrCode',
        {
            data: 'data:image/png;base64,' + imageBuffer.toString('base64'),
            session: session
        }
    );
}

async function start(req, res, client, sessionName) {
    await client[sessionName].onStateChange((state) => {
        const conflits = [
            venom.SocketState.CONFLICT,
            venom.SocketState.UNPAIRED,
            venom.SocketState.UNLAUNCHED,
        ];
        if (conflits.includes(state)) {
            client[sessionName].useHere();
        }
    });

    await client[sessionName].onMessage((message) => {
        console.log(`[${sessionName}]: Mensagem Recebida: \nTelefone: ' ${message.from}, Mensagem: ${message.body}`)
       
    });
}





module.exports = {
    async abrirSessao(req, res) {
        const {sessionName} = req.body

        opendata(req, res, sessionName)
    },

 async enviar_msg(req, res) {   

        let phones = req.body.phone 
        const msg = req.body.texto 
        const session = req.body.session  

        for(var phone of phones){
            
                      
                sendMessage();
        }

        async function sendMessage() {
         
                await clientsArray[session].sendText("55" + phone + "@c.us", msg)
                
                .then((result) => {
                    console.log('Result: ', result); //return object success
                  })

               
                  .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                  });
        }
            
    
       




        
    }



    
   

    
}