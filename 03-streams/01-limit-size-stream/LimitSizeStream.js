const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.overallBytesToTransform = 0;
  }

  _transform(chunk, encoding, callback) {
    this.overallBytesToTransform += chunk.length;
    console.log("chunk.length =", chunk.length);
    console.log("this.limit =", this.limit);
    console.log("overallBytesToTransform =", this.overallBytesToTransform);
    console.log("chunk =", chunk);
    console.log("chunk.toString =", chunk.toString());
    
    if(this.overallBytesToTransform > this.limit){
      console.log("error");
      //callback(null, chunk);
      //throw new LimitExceededError();
      callback(new LimitExceededError(), null);
    }else{
      console.log("ok");
      callback(null, chunk);
    }

  }
}

module.exports = LimitSizeStream;
