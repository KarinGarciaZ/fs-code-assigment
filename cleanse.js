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

// ...refactor this function to omit all `null` and `undefined` values from
// every object reference in the `myObj` tree. Please note that `myObj` should not be
// mutated.

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



// Algorithm explained. Please note I used recursion to solve this challenge.
// I wanted to use recursion since the function gets executed just once per property, array or object.
// So, the time complexity is O(n) (I have 2 forEach inside but it's to read the whole object just once in a linear way).
const cleanseExplained = a => {
  // return true if I want to clear this current value
  if (a === null || a === undefined) return true;

  if(typeof a === 'object') {
    let aCopy;
    if (Array.isArray(a)) {
      aCopy = [...a];
      aCopy.forEach((item, index) => {
        const result = cleanse(item); // send every single item in the array into this function
        if (result === true) aCopy.splice(index, 1);// remove null and undefined values from the array
        else if (typeof result === 'object') aCopy[index] = result; //assing new values updated (in case of an object)
      });
    } else {
      aCopy = {...a};
      Object.keys(aCopy).forEach((k) => {
        const result = cleanse(aCopy[k]);
        if (result === true) delete aCopy[k];// delete the property if null or undefined
        else if (typeof result === 'object') aCopy[k] = result; //assing new values updated (in case of an object)
      });
    }

    return aCopy;//return value updated
  }

  return false; // return false in case of no update needed.
};
