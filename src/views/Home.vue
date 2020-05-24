<template>
  <div class="home">
    <div class='container'>
      <div v-for='(i, line) in zone' :key='line'>
        <span class='item'
          :class='{
            snake: j === 1,
            food: food.x === idx && food.y === line
          }'
          v-for='(j, idx) in zone[line]' :key='`${line}-${idx}`'
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Snake } from '../utils/snake/snake';
import { randomPos, random } from '../utils/position/random-pos';
import { Dirs } from '../utils/snake/dirs'
import { Pos } from '@/utils/position/pos';

@Component({
  filters: {
    color(value: number) {
      return {
        snake: value === 1,
      };
    },
  },
})
export default class Home extends Vue {

  readonly Sizes = {
    x: 9,
    y: 9
  }

  food = randomPos(new Pos(this.Sizes.x - 1, this.Sizes.y - 1));

  snake: Snake | null = null

  // 随机方向
  dir = Dirs[random(3)]

  // 地图
  zone = (() => {
    const arr = []
    for (let i = 0; i <= this.Sizes.y; i++) {
      arr.push(new Array(this.Sizes.x).fill(0))
    }
    return arr
  })()

  mounted() {
    // 开始位置随机
    const startPos = randomPos(new Pos(this.Sizes.x - 1, this.Sizes.y - 1));
    this.snake = new Snake(startPos);

    setInterval(() => {
      const nextPos = this.getNextByDir()
      this.snake!.go(
        nextPos,
        (pos, isHead) => {
          this.zone[pos.y][pos.x] = 1

          if (isHead &&
            pos.x === this.food.x &&
            pos.y === this.food.y
          ) {
            this.snake!.eat(this.food);
            this.zone[this.food.y][this.food.x] = 1
            this.food = randomPos(new Pos(this.Sizes.x - 1, this.Sizes.y - 1));

          }
        },
        pos => {
          this.zone[pos.y][pos.x] = 0
        }
      )
      this.$forceUpdate()
    }, 500)

    this.$forceUpdate()
    this.dirController()
  }

  // 根据方向，获取坐标
  getNextByDir() {
    let { x, y } = this.snake!.head.data
    switch (this.dir) {
      case Dirs.Up:
        y -= 1
        break
      case Dirs.Right:
        x += 1
        break
      case Dirs.Down:
        y += 1
        break
      case Dirs.Left:
        x -= 1
        break
    }

    const adjustValue = this.checkBoundary(x, y);
    x = adjustValue.x;
    y = adjustValue.y;

    return new Pos(x, y)
  }

  // 越过边界后，穿过
  private checkBoundary(x: number, y: number) {
    const pos = { x, y }

    if (x > this.Sizes.x - 1) {
      pos.x = 0
    } else if (x < 0) {
      pos.x = this.Sizes.x - 1
    }

    if (y > this.Sizes.y) {
      pos.y = 0
    } else if (y < 0) {
      pos.y = this.Sizes.y
    }

    return pos
  }

  dirController() {
    document.addEventListener('keyup', (evt: KeyboardEventInit) => {
      switch(evt.code) {
        case 'ArrowLeft':
          this.dir = Dirs.Left;
          break
        case 'ArrowUp':
          this.dir = Dirs.Up;
          break
        case 'ArrowRight':
          this.dir = Dirs.Right;
          break
        case 'ArrowDown':
          this.dir = Dirs.Down;
          break
        default:
          console.log(`Unknow arrow key: ${evt.code}`)
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
$size = 30px
$count = 10

.container > div
  display flex
  width $count * $size
.item
  width $size
  height $size
  outline 1px solid #ccc
.snake
  background-color #236543
.food
  background-color red
</style>
