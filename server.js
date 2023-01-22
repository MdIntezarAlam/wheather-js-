import http from 'http'
import fs from 'fs'
import requests from 'requests'
const port = 8000

const readFile = fs.readFileSync("index.html", "utf-8")

const replaceVal = (tempData, origData) => {

    let tempretures = tempData.replace("{%tempVal%}", origData.main.temp);
    tempretures = tempretures.replace("{%tempmin}", origData.main.temp_min);
    tempretures = tempretures.replace(" {%tempmax%}", origData.main.temp_max);
    tempretures = tempretures.replace("{%location%}", origData.name);
    tempretures = tempretures.replace("{%country%}", origData.sys.country);
    tempretures = tempretures.replace("%tempstatus%}", origData.weather[0].mail);

    return tempretures

}

const server = http.createServer((req, res) => {

    requests('https://api.openweathermap.org/data/2.5/weather?q=Warangal&appid=e6a7e99c63d46f3edea44d4b72377547')
        .on('data', (chunk) => {

            const obJdata = JSON.parse(chunk)
            const arrayData = [obJdata]

            const realtimeData = arrayData.map(val => replaceVal(readFile, val)).join("")

            res.write(realtimeData)
            // console.log(realtimeData)
        })
        .on('end', (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end()
        });

})
server.listen(port, () => {
    console.log(`server on ${port}`)
})