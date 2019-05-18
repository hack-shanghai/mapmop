<template>
  <div>
    <div class="container-fluid">
      <div class="columns">
        <div class="column is-three-quarters">
          <div class="box">
            <Map :cities="cities"/>
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
    Map
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      players: 'players/getPlayers',
      cities: 'board/getCities',
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


