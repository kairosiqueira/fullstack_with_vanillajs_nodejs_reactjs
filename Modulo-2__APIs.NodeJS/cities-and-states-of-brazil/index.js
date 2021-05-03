import { promises as fs } from 'fs';

const CitiesByStatesJsonOutput = "./CitiesByStatesJsonOutput/";

printFunctionResults();

async function returnAllStates() {
  try {
    const allStates = JSON.parse(await fs.readFile('jsonFilesInput/Estados.json'));
    return allStates;
  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

async function returnAllCities() {
  try {
    const allCities = JSON.parse(await fs.readFile('jsonFilesInput/Cidades.json'));
    return allCities;
  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

// CRIA OS ARQUIVOS DE CADA ESTADO (SEPARADO) COM SUAS RESPECTIVAS CIDADES
// RETORNA DADOS QUE OUTRAS FUNÇÕES UTILIZAM 
async function getAllDataOfStatesAndCities() {
  try {
    const allStates = await returnAllStates();
    const allCities = await returnAllCities();

    allStates.forEach((state) => {
      let allCitiesOfState = { Cities: [] };
      
      allCities.map(({ Nome: name, Estado: stateId }) => {
        if (stateId === state.ID)
          allCitiesOfState.Cities.push(name);
      });

      fs.writeFile(`${CitiesByStatesJsonOutput}${state.Sigla}.json`, 
        JSON.stringify(allCitiesOfState, null, 2));
      });
  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

// CALCULA A QUANTIDADE DE CIDADES DO ESTADO INFORMADO NO PARAMETRO
async function getQuantityCitiesInStateByParameter(stateParam) {
  try {
    let numberOfCities = 0;

    const data = JSON.parse(
      await fs.readFile(`${CitiesByStatesJsonOutput}${stateParam}.json`)
    );

    numberOfCities = data.Cities.length;

    console.log('QUANTIDADE DE CIDADES DO ESTADO INFORMADO NO PARAMETRO----->');
    console.log(`The state of ${stateParam} has ${numberOfCities} cities.`);
    console.log('');

  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

// CALCULA A QUANTIDADE DE CIDADES POR ESTADO
async function getNumberOfCitiesByState() {
  try {
    let allStatesAccounts = [];
    let allCities = [];
    let city = [];

    const allStates = await returnAllStates();
    
    // RETORNA AS SIGLAS DE TODOS OS ESTADOS
    allStatesAccounts = allStates.map((state) => state.Sigla);

    for (let state of allStatesAccounts) {
      city = JSON.parse(
        await fs.readFile(`${CitiesByStatesJsonOutput}${state}.json`)
      );
      allCities.push({ uf: state, cities: city.Cities.length });
    }

    //console.log('QUANTIDADE DE CIDADES POR ESTADO --------------------------->')
    //console.log(allCities);
    //console.log('');

    return allCities;

  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

// CALCULA OS 5 ESTADOS COM MAIS CIDADES
async function getTopFiveStatesWithMoreCities() {
  try {
    let allCities = await getNumberOfCitiesByState();
    let fiveCities = [];

    allCities.sort((a, b) => b.cities - a.cities);

    fiveCities = allCities.slice(0, 5);

    console.log('OS CINCO ESTADOS COM MAIS CIDADES -------------------------->')
    console.log(fiveCities);
    console.log('');

  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

 // CALCULA OS 5 ESTADOS COM MENOS CIDADES
 async function getTopFiveStatesWithMinusCities() {
  try {
    let allCities = await getNumberOfCitiesByState();
    let fiveCities = [];

    allCities.sort((a, b) => a.cities - b.cities);

    fiveCities = allCities.slice(0, 5);

    console.log('OS CINCO ESTADOS COM MENOS CIDADES ------------------------->')
    console.log(fiveCities);
    console.log('');
    
  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

// RETORNA A CIDADE COM O MAIOR NOME DE CADA ESTADO
async function getCityWithBiggestNameOfEachState() {
  try {
    let allStatesAccounts = [];
    let allCities = [];
    let city = [];

    const allStates = await returnAllStates();

    allStatesAccounts = allStates.map((state) => state.Sigla);

    for (let state of allStatesAccounts) {
      city = JSON.parse(
        await fs.readFile(`${CitiesByStatesJsonOutput}${state}.json`)
    );

      city.Cities.sort();
      city.Cities.sort((a, b) => { return b.length - a.length; });
      allCities.push({ uf: state, cities: city.Cities[0] });
    }

    console.log('CIDADES COM O MAIOR NOME DE CADA ESTADO--------------------->')    
    console.log(allCities);
    console.log('');

  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

// SELECIONA A CIDADE COM O MENOR NOME DE CADA ESTADO
async function getCityWithSmallerNameOfEachState() {
  try {
    let allStatesAccounts = [];
    let allCities = [];
    let data = [];

    const allStates = await returnAllStates();
    
    allStatesAccounts = allStates.map((state) => state.Sigla);

    for (let state of allStatesAccounts) {
      data = JSON.parse(
        await fs.readFile(`${CitiesByStatesJsonOutput}${state}.json`)
    );

      data.Cities.sort();
      data.Cities.sort((a, b) => {return a.length - b.length;});
      allCities.push({ uf: state, cities: data.Cities[0] });
    }

    console.log('CIDADES COM O MENOR NOME DE CADA ESTADO--------------------->')
    console.log(allCities);
    console.log('');

  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

// IMPRIME A CIDADE COM O MAIOR NOME ENTRE TODOS OS ESTADOS
async function getCityWithLargestNameOfAllStates() {
  try {
    let allStatesAccounts = [];
    let allCities = [];
    let data = [];
    let biggestName = [];

    const allStates = await returnAllStates();

    allStatesAccounts = allStates.map((state) => state.Sigla);

    for (let state of allStatesAccounts)
    {
      data = JSON.parse(
        await fs.readFile(`${CitiesByStatesJsonOutput}${state}.json`)
      );

      data.Cities.sort();
      data.Cities.sort((a, b) => { return b.length - a.length;});
      allCities.push({ uf: state, cities: data.Cities[0] });
    }

    allCities.sort((a, b) => {
      return a.cities > b.cities ? 1 : b.cities > a.cities ? -1 : 0;
    });
    allCities.sort((a, b) => { return b.cities.length - a.cities.length; });

    biggestName.push(allCities[0]);

    console.log('CIDADE COM O MAIOR NOME ENTRE TODOS OS ESTADOS-------------->')
    console.log(biggestName);
    console.log('');

  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

 // IMPRIME A CIDADE COM O MENOR NOME ENTRE TODOS OS ESTADOS
 async function getCityWithSmallerNameOfAllStates() {
  try {
    let allStatesAccounts = [];
    let allCities = [];
    let data = [];
    let smallestName = [];

    const allStates = await returnAllStates();

    allStatesAccounts = allStates.map((state) => state.Sigla);

    for (let state of allStatesAccounts)
    {
      data = JSON.parse(
        await fs.readFile(`${CitiesByStatesJsonOutput}${state}.json`)
      );

      data.Cities.sort();
      data.Cities.sort((a, b) => { return a.length - b.length; });

      allCities.push({ uf: state, cities: data.Cities[0] });
    }

    allCities.sort((a, b) => {
      return a.cities > b.cities ? 1 : b.cities > a.cities ? -1 : 0;
    });

    allCities.sort((a, b) => { return a.cities.length - b.cities.length; });

    smallestName.push(allCities[0]);

    console.log('CIDADE COM O MENOR NOME ENTRE TODOS OS ESTADOS-------------->')
    console.log(smallestName);
    
  } catch (err) {
    console.log('ERRO: ' + err);
  }
}

async function printFunctionResults() {
  await getAllDataOfStatesAndCities();
  await getQuantityCitiesInStateByParameter('GO');
  await getNumberOfCitiesByState();
  await getTopFiveStatesWithMoreCities();
  await getTopFiveStatesWithMinusCities();
  await getCityWithBiggestNameOfEachState();
  await getCityWithSmallerNameOfEachState();
  await getCityWithLargestNameOfAllStates();
  await getCityWithSmallerNameOfAllStates();
}
