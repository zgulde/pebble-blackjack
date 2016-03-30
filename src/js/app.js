var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var baseURL = 'http://zgulde.me/cardsapi/decks';
var windowStack = [];

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

// grab the id of the newly created deck
var deckid = request({method: 'post', data: {shuffle: true}}).id;
// all our reqests should now go to that deck id
baseURL += '/' + deckid;

var dealerHand = draw(2);
var playerHand = draw(2);

var main = new UI.Card({
    body: 'Dealer: ' + showHand(dealerHand, true) + '\n' + 
          'Player: ' + showHand(playerHand)
});

show(main);

main.on('click', 'select', function(e){
    exit();
});
