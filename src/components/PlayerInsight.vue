<template>
  <div class="player-insight">
    <h1>{{ player.name }}</h1>
    <div class="columns">
      <div class="column" v-for="card in player.cards" :key="card.uuid">
        <city-card :card="card" small="true"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerInsight',
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
