import { Pos } from './snake';

export function random(range: number) {
  return Math.round(Math.random() * range);
}

export function randomPos(pos: Pos) {
  const { x, y } = pos;

  return new Pos(random(x), random(y));
}
