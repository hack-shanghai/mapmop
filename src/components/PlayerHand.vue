<template>
  <div class="player-hand">


    <div class="player-status">
      <div class="player-summary">
        <img :src="getPlayerImgSrc" class="player-character">
        <div player-names>
          <h1><div class="player-avatar-mask" :style="{'background-color': getPlayerColor}"></div>{{ player.name }}</h1>
          <h2>{{ player.character }}</h2>
        </div>
      </div>

      <div class="city-summary">
        <div>
          <img :src="getCityImgSrc" class="city-image" ref="playerCityImage">
          <p class="city-name">{{ player.city.name }}</p>
        </div>
        <div class="city-stacks">
          <p>Pollutions:</p>
          <div class="pollution-stack">
            <div v-for="(pollution_data, pollution) in pollutions" :key="pollution">
              <img class="pollution-stack" v-for="stacks in pollutionStack(pollution)" :src="pollutionImgSrc(pollution)" style="background-color: black;" :key="stacks">
            </div>
          </div>
          <p>Buildings:</p>
          <div class="building-stack">
            <img class="building-stack" v-for="building in player.city.buildings" :src="getCityBuildingSrc(building)" :key="building">
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column" v-for="card in player.cards" :key="card.uuid">
        <city-card :card="card" :usable="cardUsable(card)" :throwable="cardThrowable(card)" :used="cardUsed(card)" @click="useOrThrow(card)"/>
      </div>
    </div>

    <deck style="width: 30%" :pendingCard="pendingCard" @click="throwCard"/>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PlayerHand',
  props: {
    player: Object,
    pendingCard: Object
  },
  data() {
    return {
      usedCards: [],
    };
  },
  computed: {
    ...mapGetters({
      pollutions: 'config/getPollutions',
      characters: 'config/getCharacters'
    }),
    getPlayerImgSrc() {
      return `characters/${this.player.character}.jpg`;
    },
    getCityImgSrc() {
      return `cities/${this.player.city.name.toLowerCase().replace(' ', '_')}.jpg`;
    },
    getPlayerColor() {
      return this.characters[this.player.character].color;
    }
  },
  mounted() {
    this.$refs.playerCityImage.onerror = this.handleImgError;
  },
  methods: {
    cardUsable(card) {
      if (this.usedCards.length == 0) {
        let locationMatch = card.city.uuid == this.player.city.uuid;
        let availableTypesCount = this.player.cards.filter((current) => {return card.uuid != current.uuid && card.city.pollution == current.city.pollution}).length > 3;
        return locationMatch && availableTypesCount;
      }
      else {
        let unUsed = this.usedCards.filter((current) => {return card.uuid == current.uuid}).length == 0;
        let comboMatch = this.usedCards.filter((current) => {return card.pollution == current.pollution}).length > 0;
        return unUsed && comboMatch;
      }
    },
    cardUsed(card) {
      let used = this.usedCards.filter((current) => {return card.uuid == current.uuid}).length > 0;
      return used;
    },
    cardThrowable() {
      return this.pendingCard !== null;
    },
    useOrThrow(card) {
      if(this.pendingCard) {
        this.throwCard(card);
      }
      else {
        this.useCard(card);
      }
    },
    useCard(card) {
      if (!this.cardUsable(card)) {
        return
      }
      this.usedCards.push(card);
      if (this.usedCards.length == 3) {
        this.$emit('building', this.usedCards);
      }
    },
    throwCard(card) {
      if(this.pendingCard) {
        this.$emit('throw', card);
      }
    },
    pollutionStack(type) {
      return [...Array(this.player.city.pollutions[type]).keys()];
    },
    pollutionImgSrc(type) {
      let name = `pollutions/${type.toLowerCase()}.png`;
      return name;
    },
    getCityBuildingSrc(type) {
      if (type  == 'research') {
        return `buildings/${this.player.city.pollution}-icon.jpg`;
      }
      else {
        console.log(`Unknown building ${type}`);
      }
      return ''
    },
    handleImgError() {
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

.player-avatar-mask {
  margin-right: 2px;
  display: inline-block;
  width: 20px;
  height: 20px;
  mask-image: url(/avatar.svg);
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
