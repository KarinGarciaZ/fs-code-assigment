const R = require('ramda');

const { pipe, reject, isNil, map, when, is, filter } = R;

// Given this object...
const myObj = {
  a: 'foo',
  b: 'bar',
  c: null,
  d: undefined,
  e: 0,
  f: {
    a: 'fuz',
    b: null,
    c: {
      a: 'biz',
      b: 'buz',
      c: [
        {
          a: 'foo',
          b: 'bar',
          c: null,
          d: undefined,
          e: 0,
          f: false
        },
        {
          a: 'foo',
          b: 'bar',
          c: null,
          d: undefined,
          e: 0
        },
        {
          a: 'foo',
          b: 'bar',
          c: null,
          d: undefined,
          e: 0
        }
      ]
    }
  }
};

/*...refactor this function to omit all `null` and `undefined` values from
  every object reference in the `myObj` tree. Please note that `myObj` should not be
  mutated.*/

/* 
  NOTE: You'll find the best solution at the end.
  I added the implementation inside IIFEs to avoid reference issues between the different solutions.
*/

// First solution using recursion without external libraries
(() => {
  const cleanse = a => {
    if (a === null || a === undefined) return true;

    if(typeof a === 'object') {
      let aCopy;
      if (Array.isArray(a)) {
        aCopy = [...a];
        aCopy.forEach((item, index) => {
          const result = cleanse(item);
          if (result === true) aCopy.splice(index, 1);
          else if (typeof result === 'object') aCopy[index] = result;
        });
      } else {
        aCopy = {...a};
        Object.keys(aCopy).forEach((k) => {
          const result = cleanse(aCopy[k]);
          if (result === true) delete aCopy[k];
          else if (typeof result === 'object') aCopy[k] = result;
        });
      }

      return aCopy;
    }

    return false;
  };

  console.log(cleanse(myObj));
})();

// This was my first approach to Ramda since I've never used it before. Here I tried to follow my recursion implemented since the first time.
(() => {
  const needsFilter = n => !isNil(n);
  const loopStructure = n => (typeof n === 'object')? cleanse(n): n;

  const cleanse = a => {
    const filtered = filter(needsFilter, a);
    return map(loopStructure, filtered);
  };

  console.log(cleanse(myObj));
})();


// I continued reading the documentation and found there are aleady logics done. I added pipe, when and is.
// Here I did the function in one line, but still needed the filter fuction.
(() => {
  const needsFilter = n => !isNil(n);

  const cleanse = a => pipe(filter(needsFilter), map(when(is(Object), cleanse)))(a);

  console.log(cleanse(myObj));
})();


// Here I finally did it in one line replicing the filter for reject.
(() => {
  const cleanse = a => pipe(reject(isNil), map(when(is(Object), cleanse)))(a);

  console.log(cleanse(myObj));
})();
