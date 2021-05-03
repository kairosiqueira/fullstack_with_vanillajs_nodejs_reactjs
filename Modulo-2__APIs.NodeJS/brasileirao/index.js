import { promises as fs } from "fs";

init();

const teams = [];

async function init() {
  try {
    const data = JSON.parse(
      //await fs.readFile(`${dir}${dirAno}${ano}.json`)
      await fs.readFile('./dados-campeonato-brasileiro/2003/2003.json')
      
    );

    // initialize teams array
    data[0].partidas.forEach((match) => {
      teams.push({ time: match.mandante, pontuacao: 0 });
      teams.push({ time: match.visitante, pontuacao: 0 });
    });

    // filling team scores in the teams array
    data.forEach((round) => {
      round.partidas.forEach((match) => {
        const homeTeam = teams.find((item) => item.time === match.mandante);
        const guestTeam = teams.find((item) => item.time === match.visitante);

        if (match.placar_mandante > match.placar_visitante) {
          homeTeam.pontuacao += 3;
        } else if (match.placar_visitante > match.placar_mandante) {
          guestTeam.pontuacao += 3;
        } else {
          homeTeam.pontuacao += 1;
          guestTeam.pontuacao += 1;
        }
      });
    });

    teams.sort((a, b) => b.pontuacao - a.pontuacao);
    await saveTeams();
    await theFirstFourTeams();
  } catch (error) {
    console.log(error);
  }
}

async function saveTeams() {
  await fs.writeFile("finalResult.json", JSON.stringify(teams, null, 2));
}

async function theFirstFourTeams() {
  await fs.writeFile(
    "libertadoresTeams.json",
    JSON.stringify(teams.slice(0, 4), null, 2)
  );
}
