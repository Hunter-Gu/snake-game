import { Pos } from '../position/pos';

export class DoubleLinkedList {
  private _prev: DoubleLinkedList | null = null

  private _next: DoubleLinkedList | null = null

  private _data: Pos = new Pos()

  constructor(data: Pos, prev: DoubleLinkedList | null = null, next: DoubleLinkedList | null = null) {
    this._data = data;
    this._prev = prev;
    this._next = next;
  }

  set next(node: DoubleLinkedList | null) {
    this._next = node;
  }

  get prev(): DoubleLinkedList | null {
    return this._prev
  }

  set prev(node: DoubleLinkedList | null) {
    this._prev = node;
  }

  get data() {
    return this._data
  }

  set data(data: Pos) {
    this._data = data
  }
}
