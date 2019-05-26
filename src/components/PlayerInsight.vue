<template>
  <div class="player-insight">
    <h1 class="player-focus" @click="playerFocus()"><div class="player-avatar-mask" :style="{'background-color': getPlayerColor}"></div>{{ player.name }}</h1>
    <div class="columns">
      <div class="column" v-for="card in player.cards" :key="card.uuid">
        <city-card :card="card" :small="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PlayerInsight',
  props: {
    player: Object
  },
  methods: {
    playerFocus() {
      this.$emit('player-focus', this.player);
    }
  },
  computed: {
      ...mapGetters({
        characters: 'config/getCharacters'
      }),
      getPlayerColor() {
        return this.characters[this.player.character].color;
      }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.player-avatar-mask {
  margin-right: 2px;
  display: inline-block;
  width: 20px;
  height: 20px;
  mask-image: url(/avatar.svg);
}

.player-focus {
  cursor: pointer;
}
</style>
