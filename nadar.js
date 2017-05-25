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
var credentials = require('./credentials.js');
var nodemailer = require('nodemailer');
var mailTransport = nodemailer.createTransport({
  logger: true,
  // debug: true,
  host: 'mail.jurfak.spb.ru',
  port: 25,
  secure: false,
  ignoreTLS: true,
  auth: {
    user: credentials.exch.user,
    pass: credentials.exch.password,
  }
});
// mailTransport.verify(function(error, success) {
//    if (error) {
//         console.log(error);
//    } else {
//         console.log('Server is ready to take our messages');
//    }
// });

mailTransport.sendMail({
  from: '"Nadar SIte Info" <info@nadar.ru>',
  to: 'suharev.a@jurfak.spb.ru',
  subject: 'Информационное сообщение',
  html: '<h1>Meadowlark Travel</h1>\n<p>Спасибо за заказ ' + 'поездки в Meadowlark Travel. ' + '<b>Мы ждем Вас с нетерпением!</b>',
}, function(err) {
  if (err) console.error('Невозможно отправить письмо: ' + error);
});

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

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}));
app.use(function(req, res, next) {
  // Если имеется экстренное сообщение,
  // переместим его в контекст, а затем удалим
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });

});

app.get('/tours/hood-river', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  res.render('tours/hood-river');
});
app.get('/tours/oregon-coust', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  res.render('tours/oregon-coust');
});
app.get('/tours/request-group-rate', function(req, res) {
  console.log(req.cookies.monster);
  console.log(req.signedCookies.signed_monster);
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  res.render('tours/request-group-rate');
});
app.get('/headers', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  res.set('Content-Type', 'text/plain');
  var s = '';
  for (var name in req.headers)
    s += name + ': ' + req.headers[name] + '\n';
  res.send(s + '<br>' + s2);
});

app.get('/jq', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  res.render('jquery-test');
});

app.get('/nursery-rhyme', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  res.json({
    animal: 'бельчонок',
    bodyPart: 'хвост',
    adjective: 'пушистый',
    noun: 'черт',
  });
});
app.get('/newsletter', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  // мы изучим CSRF позже... сейчас мы лишь
  // заполняем фиктивное значение
  res.render('newsletter', {
    csrf: 'CSRF token goes here'
  });
});

app.get('/contest/vacation-photo', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
  var now = new Date();
  console.log(now.getFullYear());
  console.log(now.getMonth());
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) {
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
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
  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', {
    signed: true
  });
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
var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
app.post('/newsletter', function(req, res) {
  var name = req.body.name || '',
    email = req.body.email || '';
  // Проверка вводимых данных
  console.log(name + " " + email);
  if (!email.match(VALID_EMAIL_REGEX)) {
    if (req.xhr)
      return res.json({
        error: 'Некорректный адрес электронной почты.'
      });
    req.session.flash = {
      type: 'danger',
      intro: 'Ошибка проверки!',
      message: 'Введенный вами адрес электронной почты некорректен.',
    };
    return res.redirect(303, '/newsletter/archive');
  }
  new NewsletterSignup({
    name: name,
    email: email
  }).save(function(err) {
    if (err) {
      if (req.xhr) return res.json({
        error: 'Ошибка базы данных.'
      });
      req.session.flash = {
        type: 'danger',
        intro: 'Ошибка базы данных!',
        message: 'Произошла ошибка базы данных. Пожалуйста, попробуйте позднее ',
      };
      return res.redirect(303, '/newsletter/archive');
    }
    if (req.xhr) return res.json({
      success: true
    });
    req.session.flash = {
      type: 'success',
      intro: 'Спасибо!',
      message: 'Вы были подписаны на информационный бюллетень.',
    };
    return res.redirect(303, '/newsletter/archive');
  });
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
