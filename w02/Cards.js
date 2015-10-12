/*jslint indent: 4, maxerr: 50, vars: true */

// FG - CS454

var card, deck;

(function () {

	'use strict';

	// uppercase constructors . . .
	function Card(rank, suit) {

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

	}

	Card.prototype.toString = function () {
		return this.rank() + ' of ' + this.suit();
	};

	var card1 = new Card('Ace', 'Spades'); // Creates the Ace of Spades Card
	var card2 = new Card('9', 'Hearts'); // Creates the 9 of Hearts Card

	console.log(card1.value()); // Prints 1
	console.log('Card1 is: ' + card1); // Ace of Spades
	console.log(card2.value()); // Prints 9
	console.log('Card2 is: ' + card2); // 9 of Hearts

	function Deck() {
		this.reset();
	}

	Deck.prototype.deal = function () {
		return this.cards.shift();
	};

	Deck.prototype.remaining = function () {
		return this.cards.length;
	};

	Deck.prototype.shuffle = function () {
		var a = this.cards, i, len = a.length, r, temp;

		for (i = len - 1; i > 0; i -= 1) {
			r = Math.floor(Math.random() * i);

			temp = a[i];
			a[i] = a[r];
			a[r] = temp;
		}

		return a;
	};

	Deck.prototype.reset = function () {
		var ranks = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'],
			suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'],
			cards = [],
			i,
			j;

		for (i = 0; i < ranks.length; i += 1) {
			for (j = 0; j < suits.length; j += 1) {
				cards.push(new Card(ranks[i], suits[j]));
			}
		}

		this.cards = cards;
	};

	var myDeck = new Deck();
	myDeck.shuffle();

	var hand1 = [];
	hand1.push(myDeck.deal());
	hand1.push(myDeck.deal());

	// Note, the output below will vary since the Deck will be shuffled
	console.log('Hand 1: ' + hand1[0] + ' ' + hand1[1]); // Hand 1: 2 of Hearts 9 of Clubs

	var hand2 = [];
	hand2.push(myDeck.deal());
	hand2.push(myDeck.deal());

	console.log('Hand 2: ' + hand2[0] + ' ' + hand2[1]); // Hand 2: Queen of Diamonds Jack of Clubs
	console.log('The value of Hand 1 is: ', hand1[0].value() + hand1[1].value());
	console.log('The value of Hand 2 is: ', hand2[0].value() + hand2[1].value());

	console.log('There are ', myDeck.remaining(), ' cards remaining in the Deck'); // 48
	myDeck.reset();
	console.log('There are ', myDeck.remaining(), ' cards remaining in the Deck'); // 52

	card = Card;
	deck = Deck;

}());
