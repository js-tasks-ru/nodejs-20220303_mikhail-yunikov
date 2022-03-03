function sum(a, b) {
  /* ваш код */
  // return (a + b);
  
  if ((typeof(a) === 'number') && (typeof(b) === 'number')){
      return (a + b);
  }
  else {
    //throw "TypeError";
    throw new TypeError();
  }
}

module.exports = sum;
