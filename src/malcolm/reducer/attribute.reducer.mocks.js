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
    this.counter = (this.counter + 1) % 3;
  }
  toarray() {
    const copy = [...this];
    return copy.slice(0, this.counter);
  }
}

export default MockCircularBuffer;
