console.log('Oi');

let globalUser = [];
let globalCountries = [];
let globalUsersCountries = [];

async function start() {
  //Normal
  // await fetchUsers();
  // await fetchCountries();

  //Promise Sequencial
  console.time('Promise');
  await promiseCountries();
  await promiseUsers();
  console.timeEnd('Promise');

  //Promise Paralela
  // const p1 = promiseUsers();
  // const p2 = promiseCountries();
  // await Promise.all([p1, p2]);

  hidespinners();
  mergeUsersAndCountries();
  render();
}

function promiseUsers() {
  return new Promise(async (resolve, reject) => {
    const users = await fetchUsers();

    setTimeout(() => {
      console.log('promiseUsers Resolvida!');
      resolve(users);
    }, 2000);
  });
}

function promiseCountries() {
  return new Promise(async (resolve, reject) => {
    const countries = await fetchCountries();

    setTimeout(() => {
      console.log('promiseCountries Resolvida!');
      resolve(countries);
    }, 2000);
  });
}

async function fetchUsers() {
  const resources = await fetch('http://localhost:3002/users');
  const dataJson = await resources.json();
  globalUser = dataJson
    .map((user) => {
      return {
        nameUser: user.name,
        pictureUser: user.picture,
        loginUser: user.login,
        natUser: user.nat,
      };
    })
    .sort((a, b) => {
      return a.natUser.localeCompare(b.natUser);
    });
  // console.log(globalUser);
}

async function fetchCountries() {
  const resources2 = await fetch('http://localhost:3001/countries');
  const dataJson2 = await resources2.json();
  globalCountries = dataJson2.map((country) => {
    return {
      idCountry: country.alpha2Code,
      nameCountry: country.translations.pt,
      flagCountry: country.flag,
    };
  });
  // console.log(globalCountries);
}

function hidespinners() {
  const spinner = document.querySelector('#spinner');
  spinner.classList.add('invisible');
}
function mergeUsersAndCountries() {
  globalUsersCountries = [];
  globalUser.forEach((user) => {
    const country = globalCountries.find(
      (country) => country.idCountry === user.natUser
    );

    globalUsersCountries.push({ ...user, ...country });
  });
  console.log(globalUsersCountries);
}
function render() {
  const divUsers = document.querySelector('#user');
  divUsers.innerHTML = `
    <div class='row'>
      ${globalUsersCountries
        .map(({ pictureUser, flagCountry, nameUser, nameCountry }) => {
          return `
                <div class='col-sm-3'>
                  <div class='d-flex flex-row bordered'>
                    <img class='avatar' src='${pictureUser.medium}' alt='${nameUser.first}' />
                    <div class='d-flex flex-column'>
                      <span>${nameUser.first}</span>
                      <img class='flag' src='${flagCountry}' alt='${nameCountry}' />
                    </div>
                  </div>
                </div>
              `;
        })
        .join('')}
    </div>
  `;
}

start();
