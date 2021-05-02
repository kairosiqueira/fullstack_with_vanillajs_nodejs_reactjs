  // INICIA VARIÁVEIS E ARRAYS QUE SERÃO USADAS NO PROGRAMA
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
  window.addEventListener('load', () => {
  
    //FUNÇÃO QUE ESTARTA O PROGRAMA
    tabCountries = document.querySelector('#tabCountries');
    tabFavorites = document.querySelector('#tabFavorites');
    countCountries = document.querySelector('#countCountries');
    countFavorites = document.querySelector('#countFavorites');
    totalPopulationList = document.querySelector('#totalPopulationList');
    totalPopulationFavorites = document.querySelector('#totalPopulationFavorites');
    numberFormat = Intl.NumberFormat('pt-BR');

    // CHAMA A FUNÇÃO QUE PEGA OS DADOS DA API COUNTRIES
    fetchCountries();

    // INPUT DO FRONT-END (HTML) QUE RECEBE OS VALORES QUE SÃO FILTRADOS
    searchInput.addEventListener('keyup', findCountries);
  });

  // FUNÇÃO QUE PEGA OS DADOS DA API, OS SEPARA E TRATA
  async function fetchCountries() {
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    const json = await res.json();
    
    // VARIAVEL QUE RECEBE OS DADOS DA API
    allCountries = json.map(country => {
      const { translations, population, flag, numericCode } = country;

      return {
        id: numericCode,
        name: translations.br,
        population: population,
        flag: flag,
        formattedPopulation: formatNumber(population)
      };
    });
  }

  // FAZ A BUSCA PELOS USUARIOS BASEADO NO QUE FOI PASSADO NO INPUT
  const findCountries = () => {
    let filter = searchInput.value.trim();

    if (filter === "" || filter === null) {
      clearData();
    } else {
      listCountries = allCountries.filter((c) =>
        c.name.toLowerCase().includes(filter.toLowerCase())
      );
      render();
    }
  };
  
  function renderCountryList() {
    listCountries = listCountries.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  
    let countriesHTML = "<div class='countries'>";

    listCountries.forEach((country, index) => {
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
        </div>`;
      favoritesHTML += favoriteCountryHTML;
    });
    tabFavorites.innerHTML = favoritesHTML;
  }

  function render() {
    renderCountryList();
    renderFavorites();
    renderSummary();
    handleCountryButtons();
  }

  // CALCULA E RENDERIZA OS DADOS 
  function renderSummary() {
    countCountries.textContent = listCountries.length;
    countFavorites.textContent = favoriteCountries.length;

    const populationList = listCountries.reduce((accumulator, current) => {
      return accumulator + current.population;
      },0);

    const populationFavorites = favoriteCountries.reduce((accumulator, current) => {
        return accumulator + current.population;
      },0);

    totalPopulationList.textContent = formatNumber(populationList);
    totalPopulationFavorites.textContent = formatNumber(populationFavorites);
  }

  // FUNÇÃO QUE MANIPULA OS BOTÕES DE ADICIONAR E DE REMOVER NAS LISTAS
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

  // FUNÇÃO QUE ADICIONA ITENS DA LISTA DE FAVORITOS
  function addToFavorites(id) {
    const countryToAdd = listCountries.find(button => button.id === id);
    favoriteCountries = [...favoriteCountries, countryToAdd];
    favoriteCountries.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    listCountries = listCountries.filter(button => button.id !== id);

    render();
  }

  // FUNÇÃO QUE REMOVE ITENS DA LISTA DE FAVORITOS
  function removeFromFavorites(id) {
    const countryToRemove = favoriteCountries.find(button => button.id === id);
    listCountries = [...listCountries, countryToRemove];
    listCountries.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    favoriteCountries = favoriteCountries.filter(button => button.id !== id);

    render();
  }

  // FUNÇÃO QUE FORMATA OS NUMEROS 
  function formatNumber(number) {
    return numberFormat.format(number);
  }

  // FUNÇÃO QUE LIMPA AS INFORMAÇÕES QUANDO OS VALORES
  // SÃO RETIRADOS DO INPUT
  function clearData() {
    tabCountries.innerHTML = '';
    tabFavorites.innerHTML = '';
    countCountries.textContent = '';
    countFavorites.textContent = '';
    totalPopulationList.textContent = '';
    totalPopulationFavorites.textContent = '';
  }