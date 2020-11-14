<template>
  <div class="app-wrapper" id="app">
    <div class="title">Simon Says</div>
    <Game />
  </div>
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'App',
  components: {
    Game,
  },
}
</script>

<style>
#app {
  font-family: SF Pro Text, SF Pro Icons, Helvetica Neue, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.47059;
  letter-spacing: -0.022em;
  color: #333;
  text-align: center;
  margin-top: 40px;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 30px;
  font-weight: 600;
}
</style>
