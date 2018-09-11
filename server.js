const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
var moment = require('moment');
var path = require('path');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function getNewsArrayFromUrl(thisUrl) {
  return new Promise((resolve, reject) => {
    request(thisUrl, function (err, res, body) {
      if (err) {
        reject(err);
      } else if (res.statusCode !== 200) {
        reject(new Error('Failed with status code ' + res.statusCode));
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

const adressaUrl = 'https://www.adressa.no/kultur/?service=jsonfeed';
const smpUrl = 'https://www.smp.no/kultur/?service=jsonfeed';
const rbnettUrl = 'https://www.rbnett.no/kultur/?service=jsonfeed';

const p1 = getNewsArrayFromUrl(adressaUrl);
const p2 = getNewsArrayFromUrl(smpUrl);
const p3 = getNewsArrayFromUrl(rbnettUrl);


app.get("/", function (req, res) {
  Promise.all([p1, p2, p3]).then((data) => {
    res.render("index", {
      news: data[0].items.concat(data[1].items, data[2].items),
      filter_value: "",
      moment: moment,
      error: null
    });
  }).catch(err => {
    console.error('There was a problem', err);
    res.render('index', {
      news: null,
      filter_value: "",
      moment: moment,
      error: "Error occurred !" + err
    });
  });

});
app.post('/', function (req, res) {
  let news = req.body.news;
  //console.log("news " + news);
  Promise.all([p1, p2, p3]).then((data) => {
    res.render("index", {
      news: data[0].items.concat(data[1].items, data[2].items),
      filter_value: (news.toLowerCase() === 'all') ? "" : news.toLowerCase(),
      moment: moment,
      error: null
    });
  }).catch(err => {
    console.error('There was a problem', err);
    res.render('index', {
      news: null,
      filter_value: "",
      moment: moment,
      error: "Error occurred !" + err
    });
  });

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})