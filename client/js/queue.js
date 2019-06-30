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
    // Store data with the time it was added
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const storedData = { time: currentTime, data };
    this.data.push(storedData);
  }

  remove() {
    if (this.data.length <= 0) {
      throw new Error('Not enough elements');
    }
    return this.data.shift();
  }

  front() {
    if (this.data.length <= 0) {
      throw new Error('Not enough elements');
    }
    return this.data[this.size() - 1];
  }

  last() {
    if (this.data.length <= 0) {
      throw new Error('Not enough elements');
    }
    return this.data[0];
  }

  print() {
    console.log(this.data);
  }
}
