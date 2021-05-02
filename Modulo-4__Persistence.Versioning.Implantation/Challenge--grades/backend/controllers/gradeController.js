import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const Grade = db.grade;

const create = async (req, res) => {
  
  try {
    const grade = req.body;
    const newGrade = new Grade(grade);

    await newGrade.save();

    res.send({ message: 'Grade inserido com sucesso', newGrade });
    logger.info(`POST /grade - ${JSON.stringify()}`);

  } catch (error) {

    res.status(500).send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);

  }
};

const findAll = async (req, res) => {
  const name = req.query.name;
  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};
  const grades = await Grade.find(condition);
  logger.info(`GET /grades`);
  res.send(grades);
  try {
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const grade = await Grade.findOne({ _id: id });
    logger.info(`GET /grade - ${id}`);
    res.send(grade);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }
  const id = req.params.id;
  try {
    const grade = req.body;
    let newGrade = await Grade.findOne({ _id: id });
    newGrade.name = grade.name;
    newGrade.subject = grade.subject;
    newGrade.type = grade.type;
    newGrade.value = grade.value;
    newGrade = new Grade(newGrade);
    await newGrade.save();
    res.send({ message: 'Grade alterado com sucesso', newGrade });
    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;
  try {
    const gradeDeleted = await Grade.findOneAndDelete({ _id: id });
    res.send({ message: 'Grade removida com sucesso', gradeDeleted });
    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (_, res) => {
  try {
    await Grade.deleteMany({});
    res.send({ message: 'Grades removidas com sucesso' });
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
