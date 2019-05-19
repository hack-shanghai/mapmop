<template>
  <div class="player-hand">


    <div class="player-status">
      <div class="player-summary">
        <img :src="getPlayerImgSrc()" class="player-character">
        <div player-names>
          <h1>{{ player.name }}</h1>
          <h2>{{ player.character }}</h2>
        </div>
      </div>

      <div class="city-summary">
        <div>
          <img :src="getCityImgSrc()" class="city-image" ref="playerCityImage">
          <p class="city-name">{{ player.city.name }}</p>
        </div>
        <div class="city-stacks">
          <p>Pollutions:</p>
          <div class="pollution-stack">
            <div v-for="(pollution_data, pollution) in pollutions">
              <img class="pollution-stack" v-for="stacks in pollutionStack(pollution)" :src="pollutionImgSrc(pollution)" style="background-color: black;">
            </div>
          </div>
          <p>Buildings:</p>
          <div class="building-stack">
            <img class="building-stack" v-for="building in player.city.buildings" :src="getCityBuildingSrc()">
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column" v-for="card in player.cards" :key="card.uuid">
        <city-card :card="card"/>
      </div>
    </div>

    <deck style="width: 30%"/>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PlayerHand',
  props: {
    player: Object
  },
  computed: {
    ...mapGetters({
      pollutions: 'config/getPollutions'
    }),
  },
  mounted() {
    this.$refs.playerCityImage.onerror = this.handleImgError;
    console.log(this.pollutions);
  },
  methods: {
    getPlayerImgSrc() {
      return `characters/${this.player.character}.jpg`;
    },
    getCityImgSrc() {
      return `cities/${this.player.city.name.toLowerCase().replace(' ', '_')}.jpg`;
    },
    getCityBuildingSrc() {
      return `buildings/${this.player.city.pollution}-icon.jpg`;
    },
    pollutionStack(type) {
      return [...Array(this.player.city.pollutions[type]).keys()];
    },
    pollutionImgSrc(type) {
      let name = `pollutions/${type.toLowerCase()}.png`;
      return name;
    },
    handleImgError(evt) {
      let image = this.$refs.playerCityImage;
      if (image.src != "cities/default.jpg"){
        image.src = "cities/default.jpg";
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.player-hand {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.player-status {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.player-summary {
  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.city-summary {
  border: 6px;
  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.city-stacks {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.pollution-stack {
  height: 60px;
}

.building-stack{
  height: 20px;
}

.player-character {
  width: 100px;
  height: 100px;
  padding: 6px;
  border-radius: 30px;
}

.player-names {
  width: 50%;
  padding: 6px;
  display:flex;
  flex-direction: column;
}

.city-image {
  max-width: 300px;
}

.city-name {
  width: 300px;
  position: absolute;
  margin-top: -100px;
  text-align: center;
  font-size: 1.8em;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 2px black;
  background-color: rgb(0,0,0,0.5)
}

.pollution-stack {
  width: 50px;
}

h1 {
  font-size: 1.3em;
  font-weight: bold;
}

h2 {
  font-size: 1.1em;
  font-weight: bold;
}
</style>
