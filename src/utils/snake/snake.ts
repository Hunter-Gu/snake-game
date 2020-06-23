import { Pos } from '../position/pos';
import { DoubleLinkedList } from './link-list';

/**
 * @description 贪吃蛇的基类。
 *    双向链表，head 和 tail 指针分别存储头、尾位置
 */
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
    this._tail = new DoubleLinkedList(startPos);

    this._head.next = this._tail;
    this._tail.prev = this._head;
  }

  eat(pos: Pos) {
    console.log('eat:', pos)
    const newTail = new DoubleLinkedList(pos, this.tail);
    this._tail.next = newTail;
    this._tail = newTail;
  }

  go(pos: Pos, setter: (pos: Pos, isHead?: boolean) => void, deleter: (pos: Pos) => void) {
    let prev = this.tail

    deleter(prev.data)

    if (prev.prev === this.head) {
      prev.data.x = pos.x
      prev.data.y = pos.y
      setter(prev.data, true)
      return
    }

    while (prev.prev) {
      prev.data.x = prev.prev?.data!.x
      prev.data.y = prev.prev?.data!.y
      setter(prev.data)
      prev = prev.prev!
    }

    prev.data.x = pos.x
    prev.data.y = pos.y
    setter(pos, true)
  }
}
