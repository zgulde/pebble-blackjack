var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var baseURL = 'http://zgulde.me/cardsapi/decks';

// makes a request to the base url with additional url parameters and data
// returns the response parsed as JSON
function request (options) {
    urlAddition = (typeof options.url    !== 'undefined') ? options.url : '';
    data        = (typeof options.data   !== 'undefined') ? options.data : {};
    method      = (typeof options.method !== 'undefined') ? options.method : 'GET';

    return JSON.parse(ajax({
        url: baseURL + urlAddition,
        method: method,
        data: data,
        async: false

    }).responseText);
}

function draw (count) {
    count = (typeof count !== 'undefined') ? count : 1;
    return request({data: {count: count}}).cards;
}



// grab the id of the newly created deck
var deckid = request({method: 'post', data: {shuffle: true}}).id;
// all our reqests should now go to that deck id
baseURL += '/' + deckid;

var dealerHand = draw(2);
var playerHand = draw(2);

var main = new UI.Card({
  subtitle: dealerHand.map(function(card){ return card.string; }),
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();
