<template>
  <div>
    <div class="container">
      <div class="level">
        <div class="level-item">
          <p class="title">Map Mop</p>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Actions left</p>
            <p class="title">{{ game.action_left }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="columns">
        <div class="column is-three-quarters">
          <div class="box">
            <mapmop :cities="cities" :connections="connections"/>
          </div>
        </div>
        <div class="column">
          <div v-for="(player, index) in players" :key="player.uuid">
            <div v-if="player.uuid != currentPlayer.uuid">
            {{ player }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      {{ currentPlayer }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Map from "../components/Map";

export default {
  name: "board",
  components: {
    'mapmop': Map,
  },
  data() {
    return {
      game: {
        action_left: 3,
      },
    };
  },
  computed: {
    ...mapGetters({
      players: 'players/getPlayers',
      cities: 'board/getCities',
      connections: 'board/getTransitions',
      init: 'board/isInitialized',
      currentPlayer: 'players/getCurrentPlayer'
    })
  },
  beforeMount() {
    if(!this.init) {
      this.$router.replace('/');
      return;
    }
  },
  mounted() {

  },
};
</script>


