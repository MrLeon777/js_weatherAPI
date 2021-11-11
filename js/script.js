let city = 'Нижний Новгород'
const urlAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f96779a4808d1bec2927bfe209f1d028&lang=ru&units=metric&cnt=6`;
const celsius = '˚'
const percent = ' %'
const mmMercury = ' мм рт ст'
const metersPerS = ' м/с'

const imgIdList = {
  '01': 'clearsky',
  '02': 'fewclouds',
  '03': 'scatteredclouds',
  '04': 'brokenclouds',
  '09': 'showerrain',
  '10': 'rain',
  '11': 'thunderstorm',
  '13': 'snow',
  '50': 'mist',
}

async function getData() {
  let response = await fetch(urlAPI);

  if (response.ok) {
    let jsonData = response.json();
    return jsonData;
  } else {
    alert('Error: ' + response.status);
  }
}

function renderMain(data) {
  const cityField = document.querySelector('.city');
  const descriptionField = document.querySelector('.description');
  const tempField = document.querySelector('.temp');

  cityField.innerHTML = data.city.name;
  descriptionField.innerHTML = data.list[0].weather[0].description;
  tempField.innerHTML = Math.floor(data.list[0].main.temp) + celsius;
}

function renderForecastGroup(data) {
  const forecast = document.querySelectorAll('.forecast');

  data.list.map((_, index) => {
    const timeField = forecast.item(index).querySelector('.time');
    const weatherIcon = forecast.item(index).querySelector('.weather_icon img');
    const forecastTempField = forecast.item(index).querySelector('.forecast_temp');

    if (index != 0) {
      timeField.innerHTML = formatTime(data.list[index].dt_txt);
    }

    if (imgIdList.hasOwnProperty(data.list[index].weather[0].icon.slice(0, -1))) {
      let weatherImg = imgIdList[data.list[index].weather[0].icon.slice(0, -1)]
      weatherIcon.src = `img/${weatherImg}.svg`
    }

    forecastTempField.innerHTML = Math.floor(data.list[index].main.temp) + celsius;
  })


}

function renderForecastInfo(data) {

  const feelsLikeField = document.querySelector('.feels_like p');
  const humidityField = document.querySelector('.humidity p ');
  const pressureField = document.querySelector('.pressure p');
  const windField = document.querySelector('.wind p');

  feelsLikeField.innerHTML = Math.floor(data.list[0].main.feels_like) + celsius;
  humidityField.innerHTML = data.list[0].main.humidity + percent;
  pressureField.innerHTML = data.list[0].main.pressure + mmMercury;
  windField.innerHTML = data.list[0].wind.speed + metersPerS;
}


function formatTime(date) {
  return date.split(' ').pop().slice(0, 2)
}

function render(data) {
  renderMain(data)
  renderForecastGroup(data)
  renderForecastInfo(data)
}

function start() {
  if (localStorage.getItem('weather')) {
    let data = JSON.parse(localStorage.getItem('weather'));
    render(data);
    changeTime(data);
    updateData(data);
  }  else {
    getData().then((data) => {
      render(data)
      changeTime(data)
      localStorage.setItem('weather', JSON.stringify(data))
    })
  }
}

function updateData(data) {
  if (data.list[1].dt > Math.floor(Date.now() / 1000)) {
    localStorage.clear();
    getData().then((data) => {
      render(data)
      changeTime(data)
      localStorage.setItem('weather', JSON.stringify(data))
    })
  }
}

function changeTime(data) {
  let backgroundApp = document.querySelector('.weather_app');
  let currentTime = Math.floor(Date.now() / 1000);
  if (data.city.sunrise < currentTime > data.city.sunset) {
    backgroundApp.classList.add('day');
  } else {
    backgroundApp.classList.add('night');
  }

}

start()



