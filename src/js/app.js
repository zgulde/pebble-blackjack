var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var baseURL = 'http://zgulde.me/cardsapi/decks';
var windowStack = [];

Object.defineProperty(Array.prototype, 'first', {
    get: function () {
        return this[0];
    }
});

Object.defineProperty(Array.prototype, 'rest', {
    get: function () {
        return this.slice(1, this.length);
    }
});

// keep track of all the windows we make before we show them
function show (uiCard) {
    windowStack.push(uiCard);
    uiCard.show();
}

// get rid of all the windows -> exit the application
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

function getValue (card) {
    if (2 <= card.value || card.value <= 10) {
        return parseInt(card.value);
    } else if (card.value == 'A') {
        return 11;
    } else {
        return 10;
    }
}

function getHandTotal (hand) {
    return hand.reduce(function(total, card){
        return total + getValue(card);
    }, 0);
}

function showHand (hand, hidden) {
    hidden = (typeof hidden !== 'undefined') ? hidden : false;

    var firstCardString = '';
    var firstCard       = hand.first;

    firstCardString += (hidden) ? '[???] ' : '[' + firstCard.string + '] ';

    return firstCardString + hand.rest.map(function(card){
        return '[' + card.string + ']';
    }).join(' ');
}

// dealer draws till he is at 17 with drawDealer(), check for win or loss, pass
// as a parameter to end game
function onStay() {
    var playerTotal = getHandTotal(playerHand);
    var dealerTotal = getHandTotal(dealerHand);
    var hasPlayerWon;

    while (getHandTotal(dealerHand) < 16) {
        dealerHand.push(draw().first);
        dealerTotal = getHandTotal(dealerHand);
    }

    hasPlayerWon = dealerTotal > 21 || playerTotal > dealerTotal;

    endGame(hasPlayerWon);
}

// add a card to the player's hand, if they haven't busted, show the main
// display again
function onHit () {
    playerHand.push(draw().first);

    if (getHandTotal(playerHand) > 21) {
        var hasPlayerWon = false;
        endGame(hasPlayerWon);
    } else {
        showMain();
    }
}

function endGame (hasPlayerWon) {
    var main = new UI.Card({
        scrollable: true,
        subtitle:   'You ' + (hasPlayerWon ? 'Win!' : 'Lose!'),

        body:       'Dealer: ' + getHandTotal(dealerHand) + '\n' +
                    showHand(dealerHand) + '\n' +
                    'Player: ' + getHandTotal(playerHand) + '\n' +
                    showHand(playerHand)
              
    });

    main.on('click', 'select', exit);
    main.on('click', 'up',     exit);
    main.on('click', 'down',   exit);

    show(main);
}

function showMenu () {
    var menu = new UI.Menu({
        sections: [{
            items: [
                {title: 'Hit' },
                {title: 'Stay'},
                {title: 'Exit'}
            ]
        }]
    });

    menu.on('select', function(event){
        switch(event.item.title){
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
        scrollable: true,
        body:      'Dealer: ' + '\n' + showHand(dealerHand, true) + '\n' +
                   'Player: ' + '\n' + showHand(playerHand)       + '\n'
    });

    main.on('click', 'select', showMenu);
    main.on('click', 'up',     showMenu);
    main.on('click', 'down',   showMenu);

    show(main);
}

// grab the id of the newly created deck
var deckid = request({method: 'post', data: {shuffle: true}}).id;
// all our reqests should now go to that deck id
baseURL += '/' + deckid;

var dealerHand = draw(2);
var playerHand = draw(2);

showMain();
