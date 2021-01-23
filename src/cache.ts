export default class Cache extends Map {
  private max: number = -1;

  constructor(max: number = -1) {
    super()
    this.max = max
  }

  set(key: any, value: any) {
    if(this.max != -1) {
      if(this.size >= this.max && this.size != 0) this.delete([...this.keys()][0])
    }
    this.set(key, value);
    return this;
  }
}
