// VARIAVEIS DE ESCOPO
let allPeople = [];
let people = [];
let peopleView = null;
let countUsers = 0;
let countSumAges = 0;
let countAverageAges = 0;
let countMaleSex = 0;
let countFemaleSex = 0;

window.addEventListener('load', () => {
  // APONTA PARA OS IDs DAS PROPRIEDADES NO HTML
  // ONDE SERÃO INJETADOS OS VALORES
  countAllUsers = document.querySelector('#countAllUsers');
  peopleView = document.querySelector('#peopleViewDisplay');
  countMaleSex = document.querySelector('#countMaleSexDisplay');
  countFemaleSex = document.querySelector('#countFemaleSexDisplay');
  countSumAges = document.querySelector('#countSumOfAgesDisplay');
  countAverageAges = document.querySelector('#countAverageOfAgesDisplay');
  
  // CARREGA OS USUÁRIOS NO ARRAY
  fetchPeople();

// INPUT DO FRONT-END (HTML) QUE RECEBE OS VALORES QUE SÃO FILTRADOS
  searchInput.addEventListener('keyup', findPeople);
});

// FUNÇÃO QUE PEGA OS DADOS DA API, OS SEPARA E TRATA
async function fetchPeople() {
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await res.json();
  
  allPeople = json.results.map((users) => {
    const { name, picture, dob, gender } = users;
    
    return {
      name: name.first + ' ' + name.last,
      image: picture.thumbnail,
      age: dob.age,
      sex: gender,
    };
  });
  console.log(allPeople);
}

// FAZ A BUSCA PELOS USUARIOS BASEADO NO QUE FOI PASSADO NO INPUT
const findPeople = () => {
  let filter = searchInput.value.trim();

  if (filter === "" || filter === null) {
    clearData();
  } else{
    people = allPeople.filter((user) =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
    render();
  }
};

// FUNÇÃO QUE RENDERIZA OS DADOS NA TELA
function render() {
  people = people.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  let userHTML = '<div>';

  people.forEach((user) => {
    const { name, image, age } = user;

    const usersHTML = `
      <div class="peopleList">
          <img src="${image}" alt="${name}" class="image"/> ${name}, ${age} years old
      </div>
    `;
    userHTML += usersHTML;
  });

  userHTML += '</div>';
  peopleView.innerHTML = userHTML;
  loadStatistics();
}

function loadStatistics() {
  // USUÁRIOS QUE FORAM LISTADOS ATRAVÉS DO INPUT
  countUsers = people.length;
  countAllUsers.innerHTML = countUsers + " user(s) found.";

  // CALCULA A SOMA DAS IDADES 
  const sumAges = people.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);
  countSumAges.innerHTML = sumAges;

  // CALCULA E INJETA O VALOR DA QUANTIDADE DE USUARIOS DO SEXO MASCULINO
  const maleUsers = people.filter((user) => user.sex === 'male');
  countMaleSex.innerHTML = maleUsers.length;

  // CALCULA E INJETA O VALOR DA QUANTIDADE DE USUARIOS DO SEXO FEMININO
  const femaleUsers = people.filter((user) => user.sex === 'female');
  countFemaleSex.innerHTML = femaleUsers.length;

  // CALCULA A MÉDIA DAS IDADES
  const averageAges = () => {
    if (people === 0) {
      return 0;
    } else {
      const ab = sumAges / people.length;
      return ab.toFixed(2);
    }
  };
  countAverageAgesDisplay.innerHTML = averageAges();
}

// FUNÇÃO QUE LIMPA AS INFORMAÇÕES QUANDO OS VALORES
// SÃO RETIRADOS DO INPUT
function clearData() {
  peopleView.innerHTML = '';
  countAverageAgesDisplay.innerHTML = '';
  countFemaleSex.innerHTML = '';
  countMaleSex.innerHTML = '';
  countSumAges.innerHTML = '';
  countAllUsers.innerHTML = '';
}

// FORMATA OS NÚMEROS COM CASA DECIMAIS E NO FORMATO PT-BR
function formatNumber(number) {
  return numberFormat.format(number);
}