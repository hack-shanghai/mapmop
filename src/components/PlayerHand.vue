<template>
  <div class="player-hand">
    <h1>{{ player.name }}</h1>
    <div class="columns">
    	<div class="column" v-for="(card, index) in player.cards">
        <city-card :card="card" :key="card.uuid"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerHand',
  props: {
    player: Object
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
