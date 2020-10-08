import DataStream from "./DataStream";

export class KeyValuePair<K, V> {
  public key: K;
  public value: V;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class Dictionary<K, V> extends DataStream<KeyValuePair<K, V>> {
  constructor(...items: KeyValuePair<K, V>[]) {
    super(...items);
  }

  add(item: KeyValuePair<K, V>): void {
    this.content.push(item);
  }

  addPair(key: K, value: V) {
    this.add(new KeyValuePair<K, V>(key, value));
  }

  get(idx: number): KeyValuePair<K, V> {
    return this.content[idx];
  }

  getByKey(key: K): V {
    for (let item of this.content) {
      if (item.key === key) return item.value;
    }
    return null;
  }

  remove(item: number | KeyValuePair<K, V>): void {
    if (item instanceof KeyValuePair) {
      delete this.content.find(elem => elem === item)[0];
    } else {
      delete this.content[item];
    }
  }

  removeByKey(key: K): void {
    delete this.content.find(pair => pair.key === key)[0];
  }
}