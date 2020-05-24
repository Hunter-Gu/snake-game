export class Pos {
  x = -1

  y = -1

  constructor(x = -1, y = -1) {
    this.x = x;
    this.y = y;
  }
}

class DoubleLinkedList {
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
}

export class Snake {
  private _head: DoubleLinkedList

  private _tail: DoubleLinkedList

  get head() {
    return this._head
  }

  get tail() {
    return this._tail
  }

  constructor(startPos: Pos) {
    this._head = new DoubleLinkedList(startPos);
    this._tail = this._head;
  }

  eat(pos: Pos) {
    const newHead = new DoubleLinkedList(pos);
    newHead.next = this._head;
    this._head.prev = newHead;
    this._head = newHead;
  }

  go(pos: Pos) {
    this.eat(pos);
    if (this._tail.prev instanceof DoubleLinkedList) {
      this._tail = this._tail.prev;
      this._tail.next = null;
    }
  }

}
