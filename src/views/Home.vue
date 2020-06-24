<template>
  <div class="home">
    <button :disabled="!dead" @click="run">开始</button>

    <main>
      <div v-for='(i, line) in zone' :key='line'>
        <span class='item'
          :class='{
            snake: j === 1,
            dead: j === 1 && dead,
            food: food && food.x === idx && food.y === line,
          }'
          v-for='(j, idx) in zone[line]' :key='`${line}-${idx}`'
        ></span>
      </div>
    </main>

    <!-- <footer>
      <input type="number" placeholder="width" v-model="Sizes.x" />
      <input type="number" placeholder="height" v-model="Sizes.y" />
    </footer> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
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
  computed: {

  }
})
export default class Home extends Vue {

  private snake: Snake | null = null;

  // 随机方向
  private dirNext = Dirs[random(3)];;
  private dir = this.dirNext;

  public readonly Sizes = {
    x: 9,
    y: 9
  };

  // 地图
  public zone = Home.initZone(this.Sizes.x, this.Sizes.y);

  public food: Pos | null = null;

  // 游戏结束
  public dead = false;

  private static initZone(x: number, y: number) {
    const arr = []
    for (let i = 0; i < y; i++) {
      arr.push(new Array(x).fill(0))
    }
    return arr
  }

  private mounted() {
    this.dirController();
    this.run();
  }

  private run() {
    // 开始位置随机
    const startPos = randomPos(new Pos(this.Sizes.x - 1, this.Sizes.y - 1));
    this.dead = false;
    this.zone = Home.initZone(this.Sizes.x, this.Sizes.y);
    this.snake = new Snake(startPos);
    this.food = this.genFood()

    const timer = setInterval(() => {
      this.dir = this.dirNext!
      const nextPos = this.getNextByDir()
      this.snake!.go(
        nextPos,
        (pos, isHead) => {

          if (isHead && this.zone[pos.y][pos.x] === 1) {
            this.dead = true;
            clearInterval(timer);
            return
          }

          this.zone[pos.y][pos.x] = 1

          if (isHead && this.food &&
            pos.x === this.food.x &&
            pos.y === this.food.y
          ) {
            this.snake!.eat(this.food);
            this.zone[this.food.y][this.food.x] = 1
            this.food = this.genFood()
          }
          this.$forceUpdate()
        },
        pos => {
          this.zone[pos.y][pos.x] = 0
        }
      )
    }, 300)
  }

  private genFood() {
    let pos = randomPos(new Pos(this.Sizes.x - 1, this.Sizes.y - 1));
    while (this.zone[pos.y][pos.x] === 1) {
      pos = randomPos(new Pos(this.Sizes.x - 1, this.Sizes.y - 1));
      console.log(`Conflict food position, x: ${pos.x} y: ${pos.y}`);
    }

    return pos
  }

  // 根据方向，获取坐标
  private getNextByDir() {
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

    if (y > this.Sizes.y - 1) {
      pos.y = 0
    } else if (y < 0) {
      pos.y = this.Sizes.y - 1
    }

    return pos
  }

  private dirController() {
    document.addEventListener('keyup', (evt: KeyboardEventInit) => {
      let dir = this.dir

      switch(evt.code) {
        case 'ArrowLeft':
          dir = Dirs.Left;
          break
        case 'ArrowUp':
          dir = Dirs.Up;
          break
        case 'ArrowRight':
          dir = Dirs.Right;
          break
        case 'ArrowDown':
          dir = Dirs.Down;
          break
        default:
          console.log(`Unknow arrow key: ${evt.code}`)
      }

      if (
        (dir === Dirs.Right && this.dir === Dirs.Left) ||
        (dir === Dirs.Left && this.dir === Dirs.Right) ||
        (dir === Dirs.Up && this.dir === Dirs.Down) ||
        (dir === Dirs.Down && this.dir === Dirs.Up)
      ) {
        console.log(`Conflict direction! current direction: ${this.dir}, target direction: ${dir}`)
        return
      }

      this.dirNext = dir
    })
  }
}
</script>

<style lang="stylus" scoped>

button
  padding 5px 20px
  margin-bottom 20px
  background-color #fff
  border 1px solid #ccc
  border-radius 5px

$size = 30px

main > div
  display flex
  justify-content center
.item
  width $size
  height $size
  outline 1px solid #ccc
.snake
  background-color #236543
.food
  background-color red
.dead
  animation flash 1s infinite ease

@keyframes flash
  0
    opacity 1
  50%
    opacity 0

footer
  display flex
  justify-content center
  margin-top 20px

  input[type='number']
    width 50px
    margin: 0 10px

</style>
