'use strict';
var card = function (rank, suit) {

	this.rank = function () {
		return rank;
	};

	this.suit = function () {
		return suit;
	};

	this.value = function () {
		if (rank === 'Ace') {
			return 1;
		}

		if (rank === 'Jack' || rank === 'Queen' || rank === 'King') {
			return 10;
		}

		return rank;
	};

};

card.prototype.toString = function () {
	return this.rank() + ' of ' + this.suit();
};

function deck() {
	this.reset();
}

deck.prototype.deal = function () {
	return this.cards.shift();
};

deck.prototype.remaining = function () {
	return this.cards.length;
};

deck.prototype.shuffle = function () {
	var a = this.cards, i, len = a.length, r, temp;

	for (i = len - 1; i > 0; i -= 1) {
		r = Math.floor(Math.random() * i);

		temp = a[i];
		a[i] = a[r];
		a[r] = temp;
	}

	return a;
};

deck.prototype.reset = function () {
	var ranks = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'],
		suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'],
		cards = [],
		i,
		j;

	for (i = 0; i < ranks.length; i += 1) {
		for (j = 0; j < suits.length; j += 1) {
			cards.push(new card(ranks[i], suits[j]));
		}
	}

	this.cards = cards;
};

var myDeck = new deck();
myDeck.shuffle();
var hand1 = [];
hand1.push(myDeck.deal());
hand1.push(myDeck.deal());
// Note, the output below will vary since the deck will be shuffled
console.log('Hand 1: ', hand1[0], hand1[1]); // Hand 1: 2 of Hearts 9 of Clubs
var hand2 = [];
hand2.push(myDeck.deal());
hand2.push(myDeck.deal());
console.log('Hand 2: ', hand2[0], hand2[1]); // Hand 2: Queen of Diamonds Jack of Clubs
console.log('The value of Hand 1 is: ', hand1[0].value() + hand1[1].value());
console.log('The value of Hand 2 is: ', hand2[0].value() + hand2[1].value());
console.log('There are ', myDeck.remaining(), ' cards remaining in the deck');
//48
myDeck.reset();
console.log('There are ', myDeck.remaining(), ' cards remaining in the deck');
