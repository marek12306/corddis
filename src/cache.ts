export default class Cache extends Map {
  private max: number = 0;

  constructor(max: number = 0) {
    super()
    this.max = max
  }

  set(key: any, value: any) {
    if(this.max != 0) {
      if(this.size >= this.max && this.size != 0) this.delete([...this.keys()][0])
    }
    super.set(key, value);
    return this;
  }
}
