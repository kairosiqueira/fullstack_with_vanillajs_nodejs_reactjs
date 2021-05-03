import express from "express";
import { promises as fs } from "fs";

const router = express.Router();
const { readFile, writeFile } = fs;

// ROTA DE INSERÇÃO DE NOVOS REGISTROS NO ARQUIVO ACCOUNTS.JSON
router.post("/", async (req, res, next) => {
    try {
      let account = req.body;

      if (!account.name || account.balance == null)
        throw new Error("Name and Balance are required");
      
      const data = JSON.parse(await readFile(global.fileName));

      account = {
        id: data.nextId++,
        name: account.name,
        balance: account.balance,
      };

      // INSERE NO ARRAY (ACCOUNTS.JS) OS NOVOS VALORES 
      data.accounts.push(account);

      await writeFile(global.fileName, JSON.stringify(data, null, 2));
      res.send(account);

      logger.info(`POST /account - ${JSON.stringify(account)}`);

    } catch (err) {
      next(err);
    }
});

// ROTA QUE TRAZ TODOS OS REGISTROS PRESENTES DO ARQUIVO ACCOUNTS.JSON
router.get("/", async (req, res, next) => {
    try {
      const data = JSON.parse(await readFile(global.fileName));

      delete data.nextId;

      res.send(data);
      logger.info("GET /account ");

    } catch (err) {
      next(err);
    }
});

// ROTA QUE TRAZ OS REGISTROS FILTRADOS PELO ID
router.get("/:id", async (req, res, next) => {
    try {
      const data = JSON.parse(await readFile(global.fileName));
      const account = data.accounts.find((account) => account.id === parseInt(req.params.id));

      res.send(account);

      logger.info("GET /account/:id");
    } catch (err) {
      next(err);
    }
});

// ROTA QUE DELETA REGISTROS PELO ID 
router.delete("/:id", async (req, res, next) => {
    try {
      const data = JSON.parse(await readFile(global.fileName));
      data.accounts = data.accounts.filter((account) => account.id !== parseInt(req.params.id));

      await writeFile(global.fileName, JSON.stringify(data, null, 2));
      res.end();

      logger.info(`DELETE /account/:id - ${req.params.id}`);
    } catch (err) {
      next(err);
    }
});

// ROTA QUE MODIFICA UM REGISTRO 
router.put("/", async (req, res, next) => {
    try {
      const account = req.body;
      if (!account.id || !account.name || account.balance === null)
        throw new Error("Id, Name and Balance are required");

      const data = JSON.parse(await readFile(global.fileName));
      const index = data.accounts.findIndex((a) => a.id === account.id);

      if (index == -1)
        throw new Error("Not found");

      data.accounts[index].name = account.name;
      data.accounts[index].balance = account.balance;

      await writeFile(global.fileName, JSON.stringify(data, null, 2));

      res.send(account);
      logger.info(`PUT /account - ${JSON.stringify(account)}`);

    } catch (err) {
      next(err);
    }
});

// ROTA QUE MODIFICA SÓ O ATRIBULO "BALANCE"
router.patch("/updateBalance", async (req, res, next) => {
  try {
    const account = req.body; 

    if (!account.id || account.balance === null) 
      throw new Error("Id, and Balance are required");
    
    // LÊ O ARQUIVO ACCOUNTS.JS 
    const data = JSON.parse(await readFile(global.fileName));
    // PROCURA PELO ID
    const index = data.accounts.findIndex((id_) => id_.id === account.id);

    if (index == -1)
      throw new Error("Not found");

    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(data.accounts[index]);

    logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);

  } catch (err) {
    next(err);
  }
});

// ROTA QUE MODIFICA SÓ O ATRIBULO "NAME"
router.patch("/updateName", async (req, res, next) => {
  try {
    const account = req.body;
    // VALIDA SE O DADO ENVIADO POSSUI OS ATRIBUTOS id e name
    if (!account.id || account.name === null) 
      throw new Error("ID, and NAME are required");
    
    // LÊ O ARQUIVO ACCOUNTS.JSON
    const data = JSON.parse(await readFile(global.fileName));
    // PROCURA PELO ID INFORMADO
    const index = data.accounts.findIndex((indice) => indice.id === account.id);
    // CASO O ID NÃO SEJA ENCONTRADO, EMITE ERRO
    if (index == -1) 
      throw new Error("ID não encontrado!");
    
    // MODIFICA O ATRIBUNO NAME NO ARQUIVO ACCOUNT.JSON
    data.accounts[index].name = account.name;

    // ESCREVE NO ARQUIVO OS DADOS ATUALIZADOS
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(data.accounts[index]);
    
    // ESCREVE O EVENTO NO ARQUIVO DE LOG NO AQUIVO MY-BANK-API.LOG
    logger.info(`PATCH /account/updateName - ${JSON.stringify(account)}`);

  } catch (err) {
    next(err);
  }
});

// ROTA ADICIONAL QUE CENTRALIZA TODOS AS EXCEÇÕES QUE PODEM 
// OCORRER NOS MÉTODOS ACIMA
router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
