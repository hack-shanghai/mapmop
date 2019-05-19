<template>
  <div class="player-hand">
    <div class="columns">
      <div class="player-panel">
        <div class="player-header">
          <img :src="getPlayerImgSrc()" class="player-character">
          <div player-names>
            <h1>{{ player.name }}</h1>
            <h2>{{ player.character }}</h2>
          </div>
        </div>
        <img :src="getCityImgSrc()" class="city-image" ref="playerCityImage">
        <p class="city-name">{{ player.city.name }}</p>
        <div v-for="(pollution_data, pollution) in pollutions">
          <img class="pollution-stack" v-for="stacks in pollutionStack(pollution)" :src="pollutionImgSrc(pollution)" style="background-color: black;">
        </div>
        <div>
          <img class="building-stack" v-for="building in player.city.buildings" :src="getCityBuildingSrc()">
        </div>
      </div>
      <div class="column" v-for="card in player.cards" :key="card.uuid">
        <city-card :card="card"/>
      </div>
    </div>
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
.player-panel {
  width: 300px;
}

.player-header {
  display: flex;
  flex-direction: row;
}

.player-character {
  padding: 6px;
  width: 50%;
}

.player-names {
  width: 50%;
  padding: 6px;
  display:flex;
  flex-direction: column;
}

.city-image {
  border-radius: 25px;
  max-width: 100%;
}

.city-name {
  margin: 40px 0 0;
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  margin: 30px;
}

.pollution-stack {
  width: 50px;
}
</style>
