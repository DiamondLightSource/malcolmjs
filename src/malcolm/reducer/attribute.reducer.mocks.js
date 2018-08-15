class MockCircularBuffer extends Array {
  constructor(length) {
    super(length);
    this.forEach((val, index) => {
      this[index] = undefined;
    });
    this.counter = 0;
  }
  push(val) {
    this[this.counter] = val;
    this.counter = (this.counter + 1) % this.length;
  }
  pop() {
    if (this.counter !== 0) {
      const val = this[this.counter];
      this[this.counter] = undefined;
      this.counter = (this.counter - 1) % this.length;
      return val;
    }
    throw new Error('nothing to pop!');
  }
  toarray() {
    const copy = [...this];
    return copy.slice(0, this.counter);
  }
  size() {
    return this.counter;
  }
  get(index) {
    return this[index];
  }
}

export default MockCircularBuffer;
