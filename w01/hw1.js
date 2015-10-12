/*jslint
    node: true,
    white: true
*/

// FG
// CS454

'use strict';

function isPalindrome(word) {

  function reverse(w) {
    var i = w.length - 1, r = [];
    // console.log(w, i, 'r$:' + r);

    for (i; i >= 0; i -= 1) {
      r.push(w[i]);
    }

    // console.log('r^:' + r);
    return r.join('');
  }

  word = word.trim();

  if (!word) { return false; }

  return word === reverse(word);

}

console.log(isPalindrome('aha'));

function replaceLetters(w) {
  w = w.trim();

  var len = w.length, i, l, r, n = []; //new Array(len);

  for (i = 0; i < len; i += 1) {
    l = w[i];
    r = w[i + 1];

    // console.log(l, r);

    if (l === r) {
      n[i] = '*';

      if (i + 1 < len) {
        n[i + 1] = '*';
      }
    } else if (!n[i]) {
      n[i] = l;
    }

    // console.log(n);

  }

  return n.join('');
}

console.log(replaceLetters('parallel'));
console.log(replaceLetters('muhaaa'));

function repeatingLetters(a) {

  var freqs = {}, l, max = { freq: 0 };

  a.forEach(function (c) {
    if (!freqs[c]) {
      freqs[c] = 1;
    } else {
      freqs[c] += 1;
    }
  });

  // console.log('freqs:', freqs);

  for (l in freqs) {
    // console.log('l:' + l, 'v:' + freqs[l], max);

    if (freqs.hasOwnProperty(l)) {
      if (freqs[l] > max.freq) {
        max = {chr: l, freq: freqs[l]};
      }
    }
  }

  return 'value: ' + max.chr + ', occurances: ' + max.freq;
}
// console.log(repeatingLetters(['z', 'y', 'x', 'x', 'w', 'z', 'y', 'u', 'y', 'y']));

function shuffleArray(a) {

  var i, len = a.length, r, temp;

  for (i = len - 1; i > 0; i -= 1) {
    r = Math.floor(Math.random() * i);

    temp = a[i];
    a[i] = a[r];
    a[r] = temp;
  }

  return a;

}

console.log(shuffleArray([1, 2, 3, 4, 5]));

function calculate(a, b, p) {

  var fns = {
    '-': function (a, b) {
      return a - b;
    },
    '+': function (a, b) {
      return a + b;
    },
    '/': function (a, b) {
      return a / b;
    },
    '*': function (a, b) {
      return a * b;
    }
  };

  if (fns[p]) {
    return fns[p](a, b);
  }

  return undefined;

}

console.log(calculate(2, 8, '-')); // 2 - 8 = -6
console.log(calculate(2, 8, '+')); // 2 + 8 = 10
console.log(calculate(2, 8, '*')); // 2 * 8 = 16
console.log(calculate(2, 8, '/')); // 2 / 8 = 0.25
// console.log(calculate(2, 8, 'x')); // undefined

function sumArray(a) {

  var i, len = a.length, sum = 0;

  function float(a) {
    a = parseFloat(a);

    return isNaN(a) ? 0 : a;
  }

  for (i = 0; i < len; i += 1) {
    sum += float(a[i]);
  }

  return sum;

  // alt - reduce
  // a.reduce(function (a, b) {
  //   return a + float(b);
  // }, 0);

}

console.log(sumArray([1, 2, 'a', 4, '7', 'b', 'c', 7])); // 21

function totalPaid(groceries, tax) {

  var total = 0, i, len = groceries.length, price;

  tax /= 100;

  for (i = 0; i < len; i += 1) {
    // console.log(groceries[i].price, groceries[i].price * tax);

    price = groceries[i].price + (groceries[i].price * tax);
    groceries[i].price = price.toFixed(2);
    total += price;
  }

  return {
    total: total.toFixed(2),
    groceries: groceries
  };

}


var groceries = [
  { name: 'Orange Juice', price: 2.00 },
  { name: 'Milk', price: 3.50 },
  { name: 'Cereal', price: 2.00 },
  { name: 'Sugar', price: 1.75 }
];

console.log(totalPaid(groceries, 9.5));
