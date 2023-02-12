<template>
  <div>
    <div class="score">Score: {{ score }}</div>
    <div
      id="snake-game"
      class="main"
      :style="'grid-template-columns: repeat(' + maxXY + ', auto);'"
    >
      <template class="item" v-for="rowItem in rows">
        <div
          class="item"
          v-bind:class="{
            'snake': cellItem.IsBody,
            'prize-snake': false,
             'prize': cellItem.IsPrize,
            'crashed': cellItem.IsBody && crashed,
          }"
          v-for="cellItem in rowItem"
          :key="cellItem.Index"
        ></div>
      </template>
    </div>
    <div class="actions">
      <button
        v-if="!crashed && paused"
        @click="changePause"
        type="button"
        class="btn btn-sm btn-primary"
      >
        Continue
      </button>
      <button
        v-if="!crashed && !paused"
        @click="changePause"
        type="button"
        class="btn btn-sm btn-secondary"
      >
        Pause
      </button>
      <button
        v-if="crashed"
        @click="resetGame"
        type="button"
        class="btn btn-sm btn-primary"
      >
        Restart
      </button>
    </div>
  </div>
</template>

<script>
import Hammer from "hammerjs";
import Cell from "./Cell.js";
import Body from "./Body.js";
export default {
  name: "SnakeGame",
  data() {
    return {
      rows: [],
      bodyParts: [],
      prize: null,
      crashed: false,
      maxXY: 20,
      speedVal: 2,
      speedMulti: 100.0,
      dirX: 0,
      dirY: 0,
      dirNext: "R",
      score: 0,
      paused: false,
    };
  },
  created() {
    this.init();
  },
  mounted() {
    window.addEventListener("keypress", (e) => {
      this.setDirectionNext(String.fromCharCode(e.keyCode));
    });
    window.addEventListener("keydown", (e) => {
      this.setDirectionNext(e.keyCode);
    });

    var myElement = document.getElementById("snake-game");

    var mc = new Hammer(myElement);
    mc.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

    mc.on("swipeleft swiperight swipeup swipedown", (e) => {
      this.setDirectionNext(e.type);
    });
  },
  methods: {
    init() {
      let i = 0;
      for (let y = 0; y < this.maxXY; y++) {
        this.rows.push([]);
        for (let x = 0; x < this.maxXY; x++) {
          this.rows[y].push(new Cell(x, y, i));
          i++;
        }
      }

      this.setDirectionValues();

      this.initSnake();

      this.setPrize();

      this.resetTimer();
    },
    changePause() {
      this.paused = !this.paused;
      this.resetTimer();
    },
    resetGame() {
      this.rows = [];
      this.bodyParts = [];
      this.prize = null;
      this.crashed = false;
      this.paused = false;
      this.score = 0;
      this.speedMulti = 100.0;

      this.init();
    },
    setDirectionNext(key) {
      switch (key) {
        case "w":
        case 38:
        case "swipeup":
          this.dirNext = "T";
          break;
        case "a":
        case 37:
        case "swipeleft":
          this.dirNext = "L";
          break;
        case "s":
        case 40:
        case "swipedown":
          this.dirNext = "D";
          break;
        case "d":
        case 39:
        case "swiperight":
          this.dirNext = "R";
          break;
      }
    },
    setDirectionValues() {
      if (this.dirNext) {
        switch (this.dirNext) {
          case "T":
            if (this.dirY === 0) {
              this.dirX = 0;
              this.dirY = -1;
            }
            break;
          case "R":
            if (this.dirX === 0) {
              this.dirX = 1;
              this.dirY = 0;
            }
            break;
          case "D":
            if (this.dirY === 0) {
              this.dirX = 0;
              this.dirY = 1;
            }
            break;
          case "L":
            if (this.dirX === 0) {
              this.dirX = -1;
              this.dirY = 0;
            }
            break;
        }
        this.dirNext = "";
      }
    },
    moveSnake() {
      this.setDirectionValues();

      let head = this.bodyParts[0];

      let y = head.Y;
      let x = head.X;

      if (this.dirX != 0) {
        x = x + this.dirX;
      }
      if (this.dirY != 0) {
        y = y + this.dirY;
      }

      if (x > this.maxXY - 1) {
        x = 0;
      } else if (x < 0) {
        x = this.maxXY - 1;
      }

      if (y > this.maxXY - 1) {
        y = 0;
      } else if (y < 0) {
        y = this.maxXY - 1;
      }

      if (this.moveHead(x, y)) {
        if (this.prize.IsBody) {
          //snake got the prize
          this.prize.IsPrize = false;
          this.prize.IsPreviousPrize = true;
          this.setPrize();

          this.speedMulti -= 2;

          this.score += 10;
        }
        let tail = this.bodyParts[this.bodyParts.length - 1];
        let tailCell = this.rows[tail.Y][tail.X];

        if (tailCell.IsPreviousPrize) {
          //tail is on the previous prize. it must be added to the body
          tailCell.IsPreviousPrize = false;
        } else {
          this.bodyParts.pop();
          tailCell.IsBody = false;
        }

        for (let item of this.bodyParts) {
          let cellItem = this.rows[item.Y][item.X];
          cellItem.IsBody = true;
          cellItem.IsHead = true;
        }

        this.resetTimer();
      } else {
        this.crashed = true;
      }
    },
    initSnake() {
      let x = this.randomInteger(3, this.maxXY - 1);
      let y = this.randomInteger(3, this.maxXY - 1);

      this.moveHead(x, y);
    },
    moveHead(x, y) {
      this.bodyParts.unshift(new Body(x, y));

      let cellItem = this.rows[y][x];
      if (cellItem.IsBody) {
        return false;
      } else {
        cellItem.IsBody = true;
        return true;
      }
    },
    setPrize() {
      while (!(this.prize && this.prize.IsPrize)) {
        let x = this.randomInteger(0, this.maxXY - 1);
        let y = this.randomInteger(0, this.maxXY - 1);

        this.prize = this.rows[y][x];

        if (this.prize.IsBody) {
          //prize is on the body. set a new one
          this.prize = null;
        } else {
          this.prize.IsPrize = true;
        }
      }
    },
    resetTimer() {
      if (!this.paused) {
        setTimeout(() => this.moveSnake(), this.speedVal * this.speedMulti);
      }
    },
    randomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  },
};
</script>
