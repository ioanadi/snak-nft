<template>
  <div id="app">
    <div class="app-wrap">
      <SnakeGame />
      <div>
        <h3> Cookie  NFT Monster</h3>
        <img src="./assets/us.jpg" width="450">
        <h4>GID Hub- Gabbie, Ioana and Denis </h4>
      </div>
    </div>
  </div>
</template>

<script>
import SnakeGame from "./components/SnakeGame.vue";

export default {
  name: "App",
  components: {
    SnakeGame,
  },
};
</script>

<style>
@import "./assets/css/app.css";
</style>
