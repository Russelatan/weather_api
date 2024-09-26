import { Controller } from "@hotwired/stimulus"
import { intervals } from "../application.js"

export default class extends Controller {
  static targets = ["city_select" , "display_weather", "main", "search_value"]
  
  connect() {
    
  }

  fetchWeatherData() {


    if (intervals.length > 0) {
        clearInterval(intervals[0]);
        intervals.length = 0; // Clear the array after clearing the interval
    }
    const select = this.city_selectTarget;
    const city = `${select.value}`; // Replace with dynamic city selection if needed
    const apiKey = "d5d82f79b8705e52dfb3d15bd83e391a"; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    console.log(select.value)

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.displayWeather(data);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  }

  fetchWeatherData2() {

    document.querySelector("#search_div").classList.add("hidden");

    if (intervals.length > 0) {
        clearInterval(intervals[0]);
        intervals.length = 0; // Clear the array after clearing the interval
    }
    const search = this.search_valueTarget;
    const city = `${search.value}`; // Replace with dynamic city selection if needed
    const apiKey = "d5d82f79b8705e52dfb3d15bd83e391a"; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    console.log(select.value)

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.displayWeather(data);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  }

  displayWeather(data) {
    // Process and display the weather data
    const display = this.display_weatherTarget;
    const select = this.mainTarget;
    const video = document.querySelector(".vid");
    
    display.style.opacity = '0';
    select.style.opacity = '0';
    

    
    setTimeout(() => {
        display.style.display = 'flex';
        
        setTimeout(() => {
            display.style.opacity = '1';
            select.style.opacity = '1';
            video.style.opacity = "0";
        }, 500);
    }, 500);

    
    
    display.innerHTML = ""; 
    setTimeout(() => {
        select.innerHTML = `<div class="time">
                          
                        </div>
                        <div>
                          <h1>
                          ${data.name}
                          </h1>
                        </div>
                        <select id="select" data-weather-target="city_select" data-action="change->weather#fetchWeatherData">
                            <option value="" selected></option>
                            <option value="tacloban">Tacloban</option>
                            <option value="kananga">Kananga</option>
                            <option value="ormoc">Ormoc</option>
                            <option value="baybay">Baybay</option>
                            <option value="albuera">Albuera</option>
                        </select>`;
    
    
    }, 800);
    this.parsedata(display,data);
    this.changeTime(display,data);
    console.log(data)
    
  }

  

  changeTime(display, data) {
    let now;
    let options;
    let formatter;
    let formattedTime;
    let hr_min_sec;
    let hr, min, sec;
    let check;
    let format24Hour = true;
    let bg = document.body;

    

    

    let loop = setInterval(() => {
        now = new Date();
        options = {
            timeZone: 'Asia/Manila', // Change to your desired time zone
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Use 12-hour format
        };
        formatter = new Intl.DateTimeFormat('en-US', options);
        formattedTime = formatter.format(now);
        hr_min_sec = formattedTime.split(":");
        [hr, min, sec] = hr_min_sec;
        if (hr > 12){
          hr -= 12;
          check = "PM";
          format24Hour = false;
        }
        else{
          check = "AM";
        }

        // Clear previous content before updating
        document.querySelector('.time').innerHTML = `
            <h1>
                ${hr}:${min}:${sec} ${check}
            </h1>
        `;

        if (!format24Hour){
            hr += 12;
        }
        
        

        // Background image logic
        if (hr >= 5 && hr <= 9) {
            if (data.weather[0].main === "Clear") {
                bg.classList.contains("morning") ? null : (document.body.className = "", bg.classList.add("morning"));
            } 
            else if (data.weather[0].main === "Clouds") {
                bg.classList.contains("cloudy") ? null : (document.body.className = "", bg.classList.add("cloudy_morning"));
            } 
            else {
                bg.classList.contains("rainy") ? null : (document.body.className = "", bg.classList.add("rainy"));
            }
        } else if (hr >= 10 && hr <= 15) {
            if (data.weather[0].main === "Clear") {
                bg.classList.contains("noon") ? null : (document.body.className = "", bg.classList.add("noon"));
            } 
            else if (data.weather[0].main === "Clouds") {
                bg.classList.contains("cloudy") ? null : (document.body.className = "", bg.classList.add("cloudy_morning"));
            } 
            else {
                bg.classList.contains("rainy") ? null : (document.body.className = "", bg.classList.add("rainy"));
            }
        } else if (hr >= 16 && hr <= 17) {
            if (data.weather[0].main === "Clear") {
                bg.classList.contains("afternoon") ? console.log("none") : (document.body.className = "", bg.classList.add("afternoon"));
            } 
            else if (data.weather[0].main === "Clouds") {
                bg.classList.contains("cloudy_afternoon") ? null : (document.body.className = "", bg.classList.add("cloudy_afternoon"));
            } 
            else {
                bg.classList.contains("rainy") ? null : (document.body.className = "", bg.classList.add("rainy"));
            }
        } else if (hr >= 18 && hr <= 23) {
            bg.classList.contains("night") ? null : (document.body.className = "", bg.classList.add("night"));
        } else {
            bg.classList.contains("midnight") ? null : (document.body.className = "", bg.classList.add("midnight"));
        }
    }, 1000);

    intervals.push(loop);
    console.log(intervals);
    
  }

  parsedata(display, data) {
    const array = [
        ["/assets/temperature_icon.png", `${Math.ceil(data.main.temp)}\u00B0C`],
        ["/assets/humidity_icon.png", `${data.main.humidity}%`],
        ["/assets/weather_icon.png", data.weather[0].description],
        ["/assets/wind_icon.png", `${Math.round(data.wind.speed * 3600 / 1000)} KPH`],
        ["/assets/gust_icon.png", `${Math.round(data.wind.gust * 3600 / 1000)} KPH`],
        ["/assets/pressure_icon.png", `${Math.round(data.main.pressure / 1000)} Hg`]
    ];

    for (let i = 0; i < array.length; i++) {
        setTimeout(() => {
            const create_div = document.createElement("div");
            create_div.classList.add("flip-container");

            create_div.innerHTML = `
                <div class="flipper">
                    <div class="front">
                        <img src="${array[i][0]}">
                    </div>
                    <div class="back">
                        ${array[i][1]}
                    </div>
                </div>
            `;
            display.appendChild(create_div);

            // Add event listeners for hover effect
            create_div.addEventListener("mouseenter", () => {
                create_div.querySelector('.flipper').style.transform = 'rotateY(180deg)';
            });

            create_div.addEventListener("mouseleave", () => {
                create_div.querySelector('.flipper').style.transform = 'rotateY(0deg)';
            });

            setTimeout(() => {
                create_div.style.opacity = 1;
            }, 800 * (i + 1));
        }, 100);
    }
  }
}
