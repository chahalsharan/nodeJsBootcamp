
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var pokerGame;
app.post('/', function(req, res){
  
  if(req.param('playerName')){

    if(!pokerGame){
      console.log("Creating new Game");
      pokerGame = new Game();
    }

    pokerGame.addPlayer(req.param('playerName'));

    res.render('poker', { title: 'Poker', playerName: req.param('playerName'), pokerGame: pokerGame });
  }else{
    res.render('index', { title: 'Poker', error: 'Please enter valid name' });
  }
  
  

});

app.get('/users', user.list);

// var io = socketio.listen(server);

// io.set('transports', [
//   'flashsocket', 
//   'htmlfile', 
//   'xhr-polling', 
//   'jsonp-polling']);

// io.sockets.on('connection', function (socket) {
//   console.log('client connected');

//   socket.on('newPlayer', function(message) {
//     io.sockets.emit('message', message);
//   });

//   socket.on('mouseposition', function(mouse) {
//     mouse.id = socket.id;
//     socket.broadcast.emit('mouseposition', mouse);
//   });
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var Player = (function(){
  function Player(name){
    this._name = name;
  };

  Player.prototype.getName = function(){
    return this._name;
  };

  return Player;
})();

var Game = (function(){

  function Game(){
    this.players = [];
  };


  //Game.prototype.deck = new Deck();

  Game.prototype.addPlayer = function(plName){
    if(this.players.length < 5){
      console.log("Adding new player:  " + plName);

      if(this.players[0]){
        console.log("Old player name  " + this.players[0].getName());
      }
      if(this.players[1]){
        console.log("Old player name  " + this.players[1].getName());
      }

      this.players.push(new Player(plName));
    }    
  };

  Game.prototype.getPlayers = function(){
    return this.players;    
  };

  Game.prototype.getPlayersCount = function(){
    return this.players.length;    
  };

  Game.prototype.getPlayer = function(index){
    
    //console.log("PlayerIndex " + index);
    //console.log("Player " + players[index].getName());
    if(this.players[index]){
      return this.players[index];
    }
    return "";    
  };

  return Game;
})();

var Deck = (function() {
    // "private" variables 
    var cards = [];

    var currCardIndex = -1;

    var SUITE = {
      SPADE : "Spade",
      HEART : "Heart",
      CLUB : "Club",
      DIAMOND : "Diamond"
    };

    function getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // constructor
    function Deck(){
      
      for(var i=1; i<=13; i++){
        cards.push(new Card(SUITE.SPADE, i));
      }
      for(var i=1; i<=13; i++){
        cards.push(new Card(SUITE.CLUB, i));
      }
      for(var i=1; i<=13; i++){
        cards.push(new Card(SUITE.DIAMOND, i));
      }
      for(var i=1; i<=13; i++){
        cards.push(new Card(SUITE.HEART, i));
      }
    };

    

    // add the methods to the prototype so that all of the 
    // Foo instances can access the private static
    Deck.prototype.getNextCard = function() {
        currCardIndex ++;
        return cards[currCardIndex];
    };

    return Deck;
})();

var Card = (function() {
    // "private" variables 
    var _suite;
    var _value;

    // constructor
    function Card(suite, value){
      _suite = suite;
      _value = value;
    };

    // add the methods to the prototype so that all of the 
    // Foo instances can access the private static
    Card.prototype.getSuite = function() {
        return _suite;
    };
    Card.prototype.getValue = function() {
        return _value;
    };

    return Card;
})();
