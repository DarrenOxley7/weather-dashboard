var APIKey = "dcf6b470c96bccc5eb9926e9b77a3b90" ;
var searchBtn = $(".search-button");
var inputSearchBox = $(".weather-search");
var cityList = $(".list-group");
var todaySection = $("#today");
var forecastSection = $("#forecast");

var long;
var lat;
var tempArray = [];

//Gets list of cities from local storage
function getStoredCityList() {
    var cityHistoryArray = localStorage.getItem("city")
    if (cityHistoryArray) {
        tempArray = cityHistoryArray.split(",")
    }
}


//displays list of cities
function createCityList() {
    var li
    var ul = $("<ul>")
    cityList.empty()
    if (tempArray.length) {
        for (city of tempArray) {
            li = $('<li>').text(city)
            li.addClass("list-group-item")
            ul.append(li)
        }
        cityList.append(ul)
    }
}


//Handles the Search button click event
searchBtn.click(function(event) {
    event.preventDefault()
    getCityWeatherData(inputSearchBox.val().toLowerCase())
}
)

cityList.delegate("li", "click", function(event) {
    var cityName = $(this)[0].innerText
    getCityWeatherData(cityName)
}
)

//Takes city name and passes longitude and latitude to get weather conditions
function getCityWeatherData(cityName) {

    $.get(`https://api.openweathermap.org/data/2.5/weather?appid=${APIKey}&units=metric&q=${cityName}`)
        .then(function(data) {
           
            if (data) {
                if (!tempArray.length) {
                    tempArray.push(cityName)
                }
                else {
                    if (!tempArray.includes(cityName)) {
                        tempArray.push(cityName)
                    }
                }
                localStorage.setItem("city", tempArray)
                createCityList()
                inputSearchBox.val("")
                long = data.coord.lon
                lat = data.coord.lat
               createForecastSection(data)
               forecastSection.empty()
               get5DaysForecastData()
            }
            else {
                alert("Please enter valid city name")
                inputSearchBox.val("")
            }
        }
        )
}

//Calls function to create landing page
landingPage()

//Function to create landing page
function landingPage() {
    getStoredCityList()
    createCityList()
    if (!tempArray.length) {
        var h4 = $("<h4>")
        h4.text("Please enter the name of a city to search")
        todaySection.append(h4)
    }
    else {
        getCityWeatherData(tempArray[0])
    }

}
//Gets 5 days data from API server
function get5DaysForecastData() {
    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=${APIKey}`)
        .then(function (data) {
            console.log(data, data.list[0], data.list[4], data.list[7])
          var j = 0;
            for (var i = 0; i < 40; i++) {
                    forecast5day(data.list[i])
                    j++
                    }            
                }
            )
    }

//Creates today's forecast and 5 day forecast sections
function createForecastSection(data) {
    var todayDate = $("<h4>")
    var forcastImg = $("<img>")
    var TempPar= $("<p>")
    var humidityPar = $("<p>")
    var windPar = $("<p>")

    var date = moment().format('DD/MM/YYYY HH:mm')
    forcastImg.attr('src', `https://openweathermap.org/img/w/${data.weather[0].icon}.png`)
    todayDate.text(`(${date})`)
    var tempCelsius = Math.ceil(data.main.temp)
    var windSpeed = (data.wind.speed).toFixed(1)
    TempPar.text(`Temparature: ${tempCelsius}\xB0C`)
    windPar.text(`Wind Speed: ${windSpeed} mph`)
    humidityPar.text(`Humidity: ${data.main.humidity}%`)

    todaySection.empty()

        var h4 = $("<h4>")
        h4.addClass("locationName")
        h4.text(data.name)
        todaySection.append(h4)
        todayDate.addClass("todayDate")

    todaySection.append(todayDate)
    todaySection.append(forcastImg) 
    todaySection.append(TempPar)
    todaySection.append(windPar)
    todaySection.append(humidityPar)
}

function forecast5day(data)
{
    var div = $("<div>")
    div.addClass("forecast-5-day")
    var todayDate = $("<h6>")
    var forcastImg = $("<img>")
    var TempPar = $("<p>")
    var humidityPar = $("<p>")
    var windPar = $("<p>")

    var date = moment(data.dt_txt).format('DD/MM/YYYY HH:mm')
    forcastImg.attr('src', `https://openweathermap.org/img/w/${data.weather[0].icon}.png`)
    todayDate.text(`${date}`)
    var tempCelsius = Math.ceil(data.main.temp)
    var windSpeed = (data.wind.speed).toFixed(1)
    TempPar.text(`Temparature: ${tempCelsius}\xB0C`)
    windPar.text(`Wind Speed: ${windSpeed} mph`)
    humidityPar.text(`Humidity: ${data.main.humidity}%`)

    div.append(todayDate)
    div.append(forcastImg)    
    div.append(TempPar)
    div.append(windPar)
    div.append(humidityPar)
    
    forecastSection.append(div)
}