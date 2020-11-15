<template>
  <div class="game-wrapper" :class="{ opacity: state === 'game lost' }">
    <!-- -----------Game options------------ -->
    <form class="game-options form">
      <div class="form-group">
        <input
          type="radio"
          class="gameMode no-select"
          id="easy"
          value="easy"
          v-model="gameMode"
        />
        <label class="label" for="easy">Easy</label>
      </div>
      <div class="form-group">
        <input
          type="radio"
          class="gameMode no-select"
          id="normal"
          value="normal"
          v-model="gameMode"
        />
        <label class="label" for="normal">Normal</label>
      </div>
      <div class="form-group">
        <input
          type="radio"
          class="gameMode no-select"
          id="hard"
          value="hard"
          v-model="gameMode"
        />
        <label class="label" for="hard">Hard</label>
      </div>
    </form>
    <!-- -----------Main panel------------ -->
    <section class="main-panel">
      <div
        v-on:click="handleClick"
        class="main-panel_element yellow no-select"
        :class="{
          active: activePanel === '1',
          disabled: state === 'game lost',
        }"
        id="1"
      ></div>
      <div
        v-on:click="handleClick"
        class="main-panel_element red no-select"
        :class="{
          active: activePanel === '2',
          disabled: state === 'game lost',
        }"
        id="2"
      ></div>
      <div
        v-on:click="handleClick"
        class="main-panel_element green no-select"
        :class="{
          active: activePanel === '3',
          disabled: state === 'game lost',
        }"
        id="3"
      ></div>
      <div
        v-on:click="handleClick"
        class="main-panel_element blue no-select"
        :class="{
          active: activePanel === '4',
          disabled: state === 'game lost',
        }"
        id="4"
      ></div>
      <button
        v-on:click="startGame"
        :disabled="state !== 'normal'"
        class="main-panel_button no-select"
      >
        START
      </button>
    </section>
    <!-- -----------Side panel------------ -->
    <section class="side-panel">
      <div class="side-panel_element">
        <div class="round-info">Round: {{ round }}</div>
      </div>
      <hr />
      <div class="side-panel_element">
        <button
          v-on:click="reset"
          class="button no-select"
          :disabled="state === 'game lost'"
        >
          reset
        </button>
      </div>
    </section>
  </div>
  <!-- Lost Game Message -->
  <div class="lost-game-message" v-if="state === 'game lost'">
    <span class="lost-game-message_text"
      >Sorry, that was the wrong one... try again!</span
    >
    <button class="button no-select" v-on:click="state = 'normal'">OK</button>
  </div>
</template>

<script>
import sound from '../utils/sound.js'
import randomBetween from '../utils/randomBetween.js'

export default {
  data() {
    return {
      state: 'normal', // 'normal', 'in progress', 'waiting', 'game lost'
      gameMode: 'normal', // 'easy', 'normal', 'hard'
      activePanel: '', // id(string) of an active panel
      round: 0,
      clicks: 0, // number of clicks user has made
      clickOrder: [], // array of panel's id in this round
      timeoutIDs: [], //an array of timer-id's from showClickOrder function
    }
  },
  methods: {
    handleClick: async function (e) {
      if (this.state === 'normal' || this.state === 'waiting') {
        e.preventDefault()
        await this.activatePanel(e.target.id)
        if (this.state === 'waiting') {
          this.clicks += 1
          if (this.clickOrder[this.clicks - 1] !== e.target.id) {
            this.round = 0
            this.state = 'game lost'
          } else if (this.clicks === this.round) {
            this.state = 'in progress'
            setTimeout(() => this.startNewRound(), 1000)
          }
        }
      } else {
        e.preventDefault()
      }
    },
    startGame: async function (gameMode) {
      await this.reset()
      this.state = 'in progress' // disable panel for user input while panels are activating automatically
      this.startNewRound()
    },
    startNewRound: async function () {
      this.timeoutIDs = []
      this.clicks = 0
      this.round += 1
      this.clickOrder.push(String(randomBetween(1, 4)))
      await this.showClickOrder()
    },
    showClickOrder: async function () {
      for (let j = 0; j < this.clickOrder.length; j += 1) {
        const panel = this.clickOrder[j]
        this.timeoutIDs.push(
          setTimeout(() => this.activatePanel(panel), this.timeRange() * j)
        )
      }
      setTimeout(
        () => (this.state = 'waiting'),
        this.timeRange() * (this.clickOrder.length - 1)
      ) // turn on panel to wait for user input after the last panel is activated
    },
    activatePanel: async function (id) {
      this.activePanel = id
      sound(id)
      setTimeout(() => {
        this.activePanel = ''
      }, 250)
    },
    timeRange: function () {
      switch (this.gameMode) {
        case 'easy':
          return 1500
        case 'hard':
          return 400
        default:
          return 1000
      }
    },
    reset: async function () {
      this.state = 'normal'
      this.round = 0
      this.clicks = 0
      this.clickOrder = []
      this.timeoutIDs.map((id) => clearTimeout(id))
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:focus {
  outline: none !important;
}
.no-select {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

button,
button:focus,
button:active,
button:hover {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0;
  overflow: visible;
  text-transform: none;
  -webkit-appearance: none;
  cursor: pointer;
}

input[type='radio'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: inline-block;
  width: 10px;
  height: 10px;
  padding: 6px;
  outline: none;
  border: 2px solid #bbb;
  border-radius: 50%;
  background-color: #fff;
}
input[type='radio'],
label {
  cursor: pointer;
}

label {
  padding-top: 0;
  padding-left: 5px;
}

input[type='radio']:checked {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: inline-block;
  width: 10px;
  height: 10px;
  padding: 6px;
  outline: none;
  border: 2px solid rgb(149, 149, 149);
  border-radius: 50%;
  background-color: rgba(146, 146, 146, 0.664);
}

.game-wrapper {
  border-top: 1px solid #333;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}

.game-wrapper.opacity {
  opacity: 0.5;
}

.main-panel {
  width: 600px;
  height: 450px;
  position: relative;
}

.main-panel_element {
  position: absolute;
  width: 200px;
  height: 200px;
  opacity: 1;
  border: 4px solid #333;
  cursor: pointer;
}

.main-panel_element.disabled {
  cursor: auto;
}

.main-panel_button,
.main-panel_button:hover {
  padding: 0;
  width: 150px;
  height: 150px;
  position: absolute;
  top: 135px;
  left: 225px;
  background: linear-gradient(rgb(240, 240, 240), rgb(206, 206, 206));
  border-radius: 100%;
  border: none;
  border: 20px solid #333;
  font-weight: 600;
}

.main-panel_button:focus {
  background: linear-gradient(rgb(185, 185, 185), rgb(172, 172, 172));
}

.main-panel_button:disabled {
  background: rgb(195, 195, 195);
  cursor: auto;
}

.yellow {
  left: 94px;
  background: #7f8829;
  border-radius: 100% 0 0 0;
  border-right: 2px solid #333;
  border-bottom: 2px solid #333;
}
.yellow.active {
  background: yellow;
}
.red {
  right: 94px;
  background: #a72501;
  border-radius: 0 100% 0 0;
  border-bottom: 2px solid #333;
  border-left: 2px solid #333;
}
.red.active {
  background: red;
}
.green.active {
  background: rgba(0, 255, 0, 0.719);
}
.green {
  right: 94px;
  top: 206px;
  background: #299363;
  border-radius: 0 0 100% 0;
  border-top: 2px solid #333;
  border-left: 2px solid #333;
}
.blue.active {
  background: #00c3ff;
}
.blue {
  left: 94px;
  top: 206px;
  background: #16728d;
  border-radius: 0 0 0 100%;
  border-top: 2px solid #333;
  border-right: 2px solid #333;
}

.side-panel {
  margin: 15px auto;
  width: 300px;
  display: flex;
  flex-direction: row;
}

.side-panel_element {
  width: 110px;
  padding-top: 15px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.side-panel_element .round-info {
  padding-top: 5px;
}

hr {
  height: 40px;
}

.side-panel .button,
.button {
  padding-top: 3px;
  border: 1px solid grey;
  border-radius: 4px;
  height: 30px;
  font-size: 16px;
}

.game-options {
  margin: 20px auto;
  padding: 5px;
  padding-right: 10px;
  width: 300px;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 4px;
}

.lost-game-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  -webkit-box-shadow: 0px 0px 32px 0px rgba(163, 163, 163, 0.7);
  -moz-box-shadow: 0px 0px 32px 0px rgba(163, 163, 163, 0.7);
  box-shadow: 0px 0px 32px 0px rgba(163, 163, 163, 0.7);

  width: 500px;
  height: 100px;
  min-width: fit-content;
  background-color: #fff;
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  background-clip: padding-box;
  text-align: center;
  padding-top: 40px;
}

.lost-game-message_text {
  font-size: 18px;
  display: block;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .main-panel {
    width: 340px;
    height: 340px;
    position: relative;
  }

  .main-panel_element {
    position: absolute;
    width: 164px;
    height: 164px;
  }

  .yellow {
    left: 0;
  }
  .red {
    right: 0;
  }

  .green {
    right: 0;
    top: 170px;
  }
  .blue {
    left: 0;
    top: 170px;
  }

  .main-panel_button,
  .main-panel_button:hover {
    width: 120px;
    height: 120px;
    top: 110px;
    left: 110px;
    font-size: 15px;
  }
}
</style>
