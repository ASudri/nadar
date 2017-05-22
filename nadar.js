var express = require('express');
var app = express();
var express_sections = require('express-handlebars-sections');
// Установка механизма представления handlebars
var handlebars = require('express-handlebars')
  .create({
    defaultLayout: 'main',
    helpers: {
      section: function(name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      }
    }
  });

express_sections(handlebars);

var fortune = require('./lib/fortune.js');
var formidable = require('formidable');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);
app.set('env', 'dev');

app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weatherContext = getWeatherData();
  next();
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });

});

app.get('/tours/hood-river', function(req, res) {
  res.render('tours/hood-river');
});
app.get('/tours/oregon-coust', function(req, res) {
  res.render('tours/oregon-coust');
});
app.get('/tours/request-group-rate', function(req, res) {
  res.render('tours/request-group-rate');
});
app.get('/headers', function(req, res) {
  res.set('Content-Type', 'text/plain');
  var s = '';
  for (var name in req.headers)
    s += name + ': ' + req.headers[name] + '\n';
  res.send(s + '<br>' + s2);
});

app.get('/jq', function(req, res) {
  res.render('jquery-test');
});

app.get('/nursery-rhyme', function(req, res) {
  res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res) {
  res.json({
    animal: 'бельчонок',
    bodyPart: 'хвост',
    adjective: 'пушистый',
    noun: 'черт',
  });
});
app.get('/newsletter', function(req, res) {
  // мы изучим CSRF позже... сейчас мы лишь
  // заполняем фиктивное значение
  res.render('newsletter', {
    csrf: 'CSRF token goes here'
  });
});

app.get('/contest/vacation-photo', function(req, res) {
  var now = new Date();
  console.log(now.getFullYear());
  console.log(now.getMonth());
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) return res.redirect(303, '/error');
    console.log(req.url);
    console.log('received fields:');
    console.log(fields);
    console.log('received files:');
    console.log(files);
    res.redirect(303, '/thank-you');
  });
});

app.post('/process', function(req, res) {
  if (req.xhr || req.accepts('json,html') === 'json') {
    // если здесь есть ошибка, то мы должны отправить { error: 'описание ошибки' }
    res.send({
      success: true
    });
  } else {
    // если бы была ошибка, нам нужно было бы перенаправлять на страницу ошибки
    res.redirect(303, '/thank-you');
  }
});
// Обобщенный обработчик 404
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});
// Обобщенный оработчик ошибки 500
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
app.listen(app.get('port'), function() {
  console.log('Express запущен на http://localhost:' +
    app.get('port') + '; нажмите Ctrl+C для завершения.');
});

function getWeatherData() {
  return {
    locations: [{
        name: 'Портленд',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Сплошная облачность ',
        temp: '54.1 F (12.3 C)',
      },
      {
        name: 'Бенд',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Малооблачно',
        temp: '55.0 F (12.8 C)',
      },
      {
        name: 'Манзанита',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
        weather: 'Небольшой дождь',
        temp: '55.0 F (12.8 C)',
      },
    ],
  };
}
