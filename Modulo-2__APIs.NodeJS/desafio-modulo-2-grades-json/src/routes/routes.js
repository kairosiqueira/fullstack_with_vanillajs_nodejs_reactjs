import express from 'express';
import { promises as fs} from 'fs';

const router = express.Router();
const gradesJson = 'src/data/grades.json';

async function returnAllGrades() {
  try {
    const allGrades = JSON.parse(await fs.readFile('src/data/grades.json'));
    return allGrades;
  } catch (err) {
    return err;
  }
}

// RETORNA TODOS OS REGISTROS
// OK
router.get('/grades/getAll', async (_, res, next) => {
  try {
    let jData = await returnAllGrades();
    
      // GRAVA O LOG DA OPERAÇÃO
      logger.info(`GET /grades/index - Transaction Success!`);
      // SORT PELO ID DESC
      jData.grades.sort((a,b) => { a.id < b.id}).reverse();
      //ENVIA OS DADOS
      res.send(jData);

  } catch (e) {
    next (e) ;
  }
});

// RETORNA O REGISTRO PASSANDO O PARAMETRO PELA URL /grade/10
// OK
router.get('/grades/getById/:id', async (req, res, next) => {
  try {
    let jData = await returnAllGrades();
    const id = parseInt(req.params.id);

    let data = jData.grades.filter((grade) => grade.id === id);

    if (data.length > 0) {
      res.json({ grade: data });
    } else {
      res.json({ message: 'Grade Not found' });
    }

    logger.info(`GET /grades/getById/${id} - Successful transaction!`);

  } catch (e) {
    next(e)
  }
});

// CRIA UMA NOVA ENTRADA DE DADOS NA GRADE
// OK
router.post('/grades/create', async (req, res, next) => {
  const { student, subject, type, value } = req.body;
  try {
    let jData = await returnAllGrades();
    const date = new Date();

    if (!student || !subject || !type || !value) {
      throw new Error('Preencha os campos student, subject, type e value.');
    }

    let data = {
      id: jData.nextId++,
      student: student,
      subject: subject,
      value: value,
      type: type,
      timestamp: date,
    };

    jData.grades.push(data);
    fs.writeFile(gradesJson, JSON.stringify(jData));
    
    // SORT PELO ID DESC
    jData.grades.sort((a,b) => { a.id < b.id}).reverse();

    res.send(jData.grades);

    logger.info(`POST /grades/create - Transaction Success!`);

  } catch (e) {
    next(e)
  }
});

// EDITA OS DADOS DE UMA GRADE
// OK
router.put('/grades/edit/:id', async (req, res, next) => {
  const { student, subject, type, value } = req.body;

  try {
    let jData = await returnAllGrades();
    const id = parseInt(req.params.id);

    if (!student || !subject || !type || !value) {
      throw new Error('Preencha os campos student, subject, type e value.');
    }

    let index = jData.grades.findIndex((grade) => grade.id === id);

    if (index) {
        (jData.grades[index].student = student
        ? student
        : jData.grades[index].student),
        (jData.grades[index].subject = subject
          ? subject
          : jData.grades[index].subject),
        (jData.grades[index].type = type
          ? type
          : jData.grades[index].type),
        (jData.grades[index].value = value
          ? value
          : jData.grades[index].value),

        await fs.writeFile(gradesJson, JSON.stringify(jData));
      
        res.json({ message:'Edited Success'});
    }

    logger.info(`PUT /grades/edit/${id} - Successful transaction!`);

  } catch (e) {
    next(e)
  }
});

// DELETA UMA ENTRADA DE DADOS NA GRADE PELO ID
// OK
router.delete('/grades/delete/:id', async (req, res, next) => {
  try {
    let jData = await returnAllGrades();
    const id = parseInt(req.params.id);

    let data = jData.grades.filter((grade) => grade.id !== id);
    
    jData.grades = data;

    await fs.writeFile(gradesJson, JSON.stringify(jData));

    res.json({ message:'Data successfully deleted!'});

    logger.info(`DELETE /grades/delete/${id} - Successful transaction!`);

  } catch (e) {
    next(e)
  }
});

// RETORNA AS NOTAS SOMADAS DE UM ALUNO EM DETERMINADA MATÉRIA
// OK
router.get('/grades/sum/', async (req, res, next) => {
  try {
    let jData = await returnAllGrades();

    const student = req.body.student;
    const subject = req.body.subject;

    if (!student || !subject) 
      throw new Error ("Student and subject are required");

    jData.grades = jData.grades.filter(
      (grade) => grade.student === student && grade.subject === subject);

    const mappedData = jData.grades.map((grade) => grade.value);

    const finalData = mappedData.reduce((acc, cur) => acc + cur, 0);

    res.send(`A soma das notas deste aluno nesta disciplina é: ${finalData}`);

    logger.info(`GET /grades/sum/${student}/${subject}`);
    
  } catch (e) {
    next(e);
  }
});

// RETORNA A MEDIA 
router.get('/grades/average', async (req, res, next) => {
  const { type, subject } = req.body; 
  try {
    let jData = await returnAllGrades();

    let typeParam = jData.grades.filter((grade) => grade.type === type);
    let sum = 0;
    let count = 0;
    let subjectType = typeParam.filter((grade) => {
      if (grade.subject === subject) 
        count++;
        return (sum += grade.value);
    });

    logger.info(`GET /grades/average/${type}/${subject}`);
    
    res.json({
      subject: subjectType,
      result: `Média: ${subject} do tipo ${type}=  ${sum / count}`,
    });

  } catch (e) {
    next(e)
  }
});

// RETORNA A MELHOR GRADE
//OK
router.get('/grades/top3BestGrades', async (req, res, next) => {
  const { type, subject } = req.body;
  try {
    let jData = await returnAllGrades();

    let typeData = jData.grades.filter((grade) => grade.type === type);
    let subjectData = typeData.filter((grade) => grade.subject === subject);
      subjectData = subjectData.sort((a, b) => b.value - a.value);
    let initialID = 1;
    let result = [];

    subjectData.filter((grade) => {
      if (initialID < 4)
        result.push({ ...grade });
        initialID++;
    });

    res.json({ ok: true, result: result });

  } catch (e) {
    next(e)
  }
});

// TRATAMENTO DE ERROS
router.use((err, req, res, next) => {
  global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;