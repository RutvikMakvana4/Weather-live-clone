const http = require("http");
const fs = require("fs");
const requests = require("requests");
const port = process.env.PORT || 8000;

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempval, orgval) => {
  let temperature = tempval.replace('{%tempval%}',orgval.main.temp);
  temperature = temperature.replace('{%tempmin%}',orgval.main.temp_min);
  temperature = temperature.replace('{%tempmax%}',orgval.main.temp_max);
  temperature = temperature.replace('{%location%}',orgval.name);
  temperature = temperature.replace('{%country%}',orgval.sys.country);
  temperature = temperature.replace('{%tempstatus%}',orgval.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=surat&units=metric&appid=24e7fd7a610d1429cf60f0592926b825")
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join(" ");
         
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(port, "0.0.0.0");
// server.listen(process.env.PORT || 8000, "127.0.0.1", () => {
//   console.log("Server is running.");
// });