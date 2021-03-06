  // INICIA VARIÁVEIS E ARRAYS QUE SERÃO USADAS NO PROGRAMA
  // STARTS VARIABLES AND ARRAYS TO BE USED IN THE PROGRAM
  let tabCountries = null;
  let tabFavorites = null;
  let allCountries = [];
  let favoriteCountries = [];
  let countCountries = 0;
  let countFavorites = 0;
  let totalPopulationList = 0;
  let totalPopulationFavorites = 0;
  let numberFormat = null;

  // MÉTODO QUE ESPERA TODA A PÁGINA CARREGAR
  // METHOD THAT WAITS ALL THE PAGE TO LOAD
  window.addEventListener('load', start);
  
  // FUNÇÃO QUE ESTARTA O PROGRAMA
  // FUNCTION THAT START THE PROGRAM
  function start() {
    tabCountries = document.querySelector('#tabCountries');
    tabFavorites = document.querySelector('#tabFavorites');
    countCountries = document.querySelector('#countCountries');
    countFavorites = document.querySelector('#countFavorites');
    totalPopulationList = document.querySelector('#totalPopulationList');
    totalPopulationFavorites = document.querySelector('#totalPopulationFavorites');
    numberFormat = Intl.NumberFormat('pt-BR');
    
    // CHAMA A FUNÇÃO QUE PEGA OS DADOS DA API COUNTRIES
    // CALLS THE FUNCTION THAT TAKES DATA FROM THE COUNTRIES API
    fetchCountries();
  }

  // FUNÇÃO QUE PEGA OS DADOS DA API, OS SEPARA E TRATA
  // FUNCTION THAT TAKES DATA FROM THE API, SEPARATES AND TREATS THEM
  async function fetchCountries() {
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    const json = await res.json();
    
    // VARIAVEL QUE RECEBE OS DADOS DA API
    // VARIABLE THAT RECEIVES API DATA
    allCountries = json.map(country => {
      const { name, population, flag, numericCode } = country;

      return {
        id: numericCode,
        name,
        population,
        flag,
        formattedPopulation: formatNumber(population)
      };
    });
    // CHAMA A FUNÇÃO RENDER()
    // CALL THE RENDER() FUNCTION
    render();
  }

  function render() {
    renderCountryList();
    renderFavorites();
    renderSummary();
    handleCountryButtons();
  }

  // FUNÇÃO QUE RENDERIZA A LISTA DE PAÍSES
  // FUNCTION THAT RENDERIZES THE LIST OF COUNTRIES
  function renderCountryList(){
    let countriesHTML = "<div class='countries'>";

    allCountries.forEach((country, index) => {
      const { name, flag, id, formattedPopulation } = country;

      const countryHTML = `
        <div class='country'>
          <div>
            <a title="Adicionar" id="${id}" class="waves-effect waves-light btn">+</a>
          </div>
          <div>
            <img src="${flag}" alt="${name}" />
          </div>
          <div>
            <ul>
              <li>${name}<li>
              <li>${formattedPopulation}<li>
            </ul>
          </div>
        </div>`;
      countriesHTML += countryHTML;
    });
    tabCountries.innerHTML = countriesHTML;
  }

  function renderFavorites() {
    let favoritesHTML = "<div class='favoriteCountries'>";

    favoriteCountries.forEach(country => {
      const { name, flag, id, formattedPopulation } = country;

      const favoriteCountryHTML = `
        <div class='country'>
          <div>
            <a title="Remover" id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
          </div>
          <div>
            <img src="${flag}" alt="${name}" />
          </div>
          <div>
            <ul>
              <li>${name}<li>
              <li>${formattedPopulation}<li>
            </ul>
          </div>
        </div>
      `;
      favoritesHTML += favoriteCountryHTML;
    });
    tabFavorites.innerHTML = favoritesHTML;
  }

  function renderSummary() {
    countCountries.textContent = allCountries.length;
    countFavorites.textContent = favoriteCountries.length;

    const populationList = allCountries.reduce((accumulator, current) => {
      return accumulator + current.population;
      },0);

    const populationFavorites = favoriteCountries.reduce((accumulator, current) => {
        return accumulator + current.population;
      },0);

    totalPopulationList.textContent = formatNumber(populationList);
    totalPopulationFavorites.textContent = formatNumber(populationFavorites);
  }

  function handleCountryButtons() {
    const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
    const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

    countryButtons.forEach(button => {
      button.addEventListener('click', () => addToFavorites(button.id));
    });

    favoriteButtons.forEach(button => {
      button.addEventListener('click', () => removeFromFavorites(button.id));
    });
  }

  function addToFavorites(id) {
    const countryToAdd = allCountries.find(button => button.id === id);
    favoriteCountries = [...favoriteCountries, countryToAdd];
    favoriteCountries.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    allCountries = allCountries.filter(button => button.id !== id);

    render();
  }

  function removeFromFavorites(id) {
    const countryToRemove = favoriteCountries.find(button => button.id === id);
    allCountries = [...allCountries, countryToRemove];
    allCountries.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    favoriteCountries = favoriteCountries.filter(button => button.id !== id);

    render();
  }

  function formatNumber(number) {
    return numberFormat.format(number);
  }
