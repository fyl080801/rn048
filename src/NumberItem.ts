export default class NumberItem {
  constructor(public value) {}

  public combine(item: NumberItem) {
    this.value += item.value;
    item.reset();
  }

  public swap(item: NumberItem) {
    var val = this.value;
    this.value = item.value;
    item.value = val;
  }

  public isEmpty() {
    return this.value == 0;
  }

  public reset(val?: number) {
    this.value = val !== undefined ? val : 0;
  }

  public check(obj: NumberItem) {
    return this.value == obj.value && this.value != 0;
  }
}
