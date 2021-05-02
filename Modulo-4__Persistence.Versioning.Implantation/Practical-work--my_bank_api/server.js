import express from 'express';
import mongoose from 'mongoose';
import accountRouter from './src/routes/accounts.js';

const mongoAtlasUri = 
    'mongodb+srv://dbUser:upq72eKh3ydL@cluster0.maoxn.mongodb.net/my-bank?retryWrites=true&w=majority';

try {
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected"),
  );
} catch (e) {
  console.log("could not connect");
}

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));

const app = express();
app.use(express.json());
app.use(accountRouter);

app.listen('3000', () => {
  console.log('API Started!');
});


//////////////////////////
// CONEXAO QUE FUNCIONAVA 
//////////////////////////

// mongoose.connect(
//     'mongodb+srv://dbUser:upq72eKh3ydL@cluster0.maoxn.mongodb.net/my-bank?retryWrites=true&w=majority',
//     {useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false,
// }).then(() => {
//   console.log('Conectado ao MongoDB Atlas');
// }).catch((err) => {
//   console.log('Erro ao conectar ao MongoDB: ' + err);
// });

// const app = express();
// app.use(express.json());
// app.use(accountRouter);

// app.listen('3000', () => {
//   console.log('API Started!');
// });