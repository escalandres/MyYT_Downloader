const path = require('path');
const express = require('express');
const appex = express();
const url = require('url')
const cors = require('cors');
const { checkVideoExists } = require('./modules/checkVideo');
const { downloader } = require('./modules/downloader');
const { guardarEnLog } = require('./modules/fntLog')

// require('dotenv').config();

// const port = process.env.PORT;
const port = 52345;
// let port = process.env.PORT;
// if(port == null || port == ""){
//   port = 3001;
// }

appex.use(cors()); // Habilitar CORS


// Seccion de Express

appex.use(express.urlencoded({ extended: true }));
appex.use(express.json());

appex.get('/test', (req,res)=>{
  console.log('test')
  res.status(200).send({ message: 'Solicitud GET recibida correctamente' });
})

appex.post('/search-video', async (req, res) => {
  console.log('search-video')
  // Obtener los datos recibidos en la solicitud POST
  const datos = req.body;
  
  // Hacer algo con los datos recibidos
  // console.log('Datos recibidos:', datos);
  // console.log('url:', datos.url);

  const result = await checkVideoExists(datos.url,'AIzaSyD8GZI-O1kl3RmaUaFiJOpHcnZ8tfn42xc')
  // console.log(result)
  if(result){
    res.status(200).send({ message: 'El video existe', code: 200, estatus: true });
  }
  else{
    res.status(404).send({message: 'El video no existe. Ingrese una url válida', code: 404, estatus: false})
  }
});

appex.post('/download-video', async (req, res) => {
  console.log('download-video')
  const datos = req.body;
  const result = await downloader(datos.url,datos.option)
  if(result){
    res.status(200).send({ message: 'Descarga completada', code: 200, estatus: true });
  }
  else{
    res.status(404).send({message: 'Ocurrió un error durante la descarga. Inténtelo más tarde', code: 500, estatus: false})
  }
});

appex.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
