var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var baseURL = 'http://zgulde.me/cardsapi/decks';
var windowStack = [];

Object.defineProperty(Array.prototype, 'first', {
    get: function(){
        return this[0];
    }
});

// keep track of all the windows we make before we show them
function show (uiCard) {
    windowStack.push(uiCard);
    uiCard.show();
}

function exit () {
    windowStack.forEach(function(window){
        window.hide();
    });
}

// makes a request to the base url with additional url parameters and data
// returns the response parsed as JSON
function request (options) {
    data        = (typeof options.data   !== 'undefined') ? options.data:   {};
    method      = (typeof options.method !== 'undefined') ? options.method: 'GET';
    urlAddition = (typeof options.url    !== 'undefined') ? options.url:    '';

    return JSON.parse(ajax({
        url: baseURL + urlAddition,
        method: method,
        data: data,
        async: false

    }).responseText);
}

// optionally takes a count, the number of cards to draw, and returns an array
// of the cards that were drawn (even if it is just one card)
function draw (count) {
    count = (typeof count !== 'undefined') ? count : 1;
    return request({url: '/draw', data: {count: count}}).cards;
}

function showHand (hand, hidden) {
    hidden = (typeof hidden !== 'undefined') ? hidden : false;

    var handString = '';
    var firstCard  = hand.shift();

    handString += (hidden) ? '[???] ' : '[' + firstCard.string + '] ';

    return handString + hand.map(function(card){
        return '[' + card.string + ']';
    }).join(' ');
}

function onStay() {
    while (dealerHand < 16) {
        dealerHand.push(draw().first)
    }
}

function onHit () {
    playerHand(draw().first);
    if (getHandTotal(playerHand) > 21) {
        endGame();
    } else {
        showMain();
    }
}

function endGame () {
    // display game over message and exit
}

function showMenu () {
    var menu = new UI.Menu({
        sections: [{
            items: [
                {title:  'Hit'},
                {title: 'Stay'},
                {title: 'Exit'}
            ]
        }]
    });

    menu.on('select', function(e){
        console.log(e.item.title);
        switch(e.item.title){
            case 'Hit':
                onHit();
                break;
            case 'Stay':
                onStay();
                break;
            case 'Exit':
                exit();
        }
    });

    show(menu);
}

function showMain () {
    var main = new UI.Card({
        body: 'Dealer: ' + showHand(dealerHand, true) + '\n' + 
              'Player: ' + showHand(playerHand)
    });

    main.on('click', 'select', showMenu);

    show(main);
}

// grab the id of the newly created deck
var deckid = request({method: 'post', data: {shuffle: true}}).id;
// all our reqests should now go to that deck id
baseURL += '/' + deckid;

var dealerHand = draw(2);
var playerHand = draw(2);

showMain();
