const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs')

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

app.get("/", function (req, res) {
  const adressaUrl = 'https://www.adressa.no/kultur/?service=jsonfeed';
  const smpUrl = 'https://www.smp.no/kultur/?service=jsonfeed';
  const rbnettUrl = 'https://www.rbnett.no/kultur/?service=jsonfeed';

  const p1 = getNewsArrayFromUrl(adressaUrl);
  const p2 = getNewsArrayFromUrl(smpUrl);
  const p3 = getNewsArrayFromUrl(rbnettUrl);

  Promise.all([p1, p2, p3]).then((data) => {
    res.render("index", {
      news_adressa: data[0].items,
      news_smp: data[1].items,
      news_rbnett: data[2].items,
      error: null
    });
  }).catch(err => {
    console.error('There was a problem', err);
    res.render('index', {
      news_adressa: null,
      news_smp: null,
      news_rbnett: null,
      error: "Error occurred !" + err
    });
  });

});

app.post('/newsItem', function (req, res) {

})

app.get('/btnSelectNewsSource', function(req,res) {
  
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})