const stream = require('stream');
const os = require('os');
/*
class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
  }

  _flush(callback) {
  }
}
*/

/*
class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }
    
  _transform(chunk, encoding, callback) {
    // let arrayOfStrings1 = chunk.split('c');
    const arrayOfStrings = chunk.toString().split(os.EOL);
    for (let i = 0; i < arrayOfStrings.length; i++ ) {
      this.emit('data', arrayOfStrings[i]);
      //console.log(arrayOfStrings[i]);
      //console.log(i);
    }
    callback();
  }
}
*/
/*
class LineSplitStream extends stream.Transform{
  constructor(options) {
      super(options);
      this.stringBuffer = "";
    }
    
    _transform(chunk, encoding, callback){
      this.stringBuffer += chunk.toString();
      callback();
    }
    _flush(callback) {
      let arrayOfStrings = this.stringBuffer.split(os.EOL);
      for (let i = 0; i < arrayOfStrings.length; i++) {
        this.emit('data', arrayOfStrings[i]);
      }
      this.stringBuffer = "";
      callback();
    }

}
*/
class LineSplitStream extends stream.Transform{
  constructor(options) {
      super(options);
      this.stringBuffer = "";
    }
    
    _transform(chunk, encoding, callback){
      this.stringBuffer += chunk.toString();
      //console.log("this.stringBuffer =", this.stringBuffer);
      //console.log("this.stringBuffer.indexOf(os.EOL) =", this.stringBuffer.indexOf(os.EOL));
      while(this.stringBuffer.indexOf(os.EOL) > 0){
        //console.log("this.stringBuffer.indexOf(os.EOL) =", this.stringBuffer.indexOf(os.EOL));
        let str = this.stringBuffer.substring(0,this.stringBuffer.indexOf(os.EOL));
        this.emit('data', str);
        this.stringBuffer = this.stringBuffer.substring((this.stringBuffer.indexOf(os.EOL) + os.EOL.length));
        //console.log("zzzz");
      }
      /*
      if(this.stringBuffer.indexOf(os.EOL) > 0) {
        console.log("this.stringBuffer.indexOf(os.EOL) =", this.stringBuffer.indexOf(os.EOL));
        let str = this.stringBuffer.substring(0,this.stringBuffer.indexOf(os.EOL));
        this.emit('data', str);
        this.stringBuffer = "";
        console.log("zzzz");
      }
    */
      
      callback();
    }
    _flush(callback) {
      if(this.stringBuffer.length > 0) {
        this.emit('data', this.stringBuffer);
      }
      callback();
    }

}
module.exports = LineSplitStream;