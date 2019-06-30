/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
export default class Queue {
  /* Creating my own finite queue class to keep a window of data */
  constructor(length) {
    this._windowSize = length;
    this.data = [];

    if (length <= 0 || length === undefined) {
      throw new Error('Length of Queue needs to be greater than 0');
    }
  }

  size() {
    return this.data.length;
  }

  add(data) {
    if (this.data.length >= this._windowSize) {
      this.remove();
    }
    this.data.push(data);
  }

  remove() {
    return this.data.shift();
  }

  print() {
    console.log(this.data);
  }
}
