<template>
  <div class="container">
    <div class="notification">
      <Map :cities="cities" :connections="connections"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Map from "../components/Map";
import cities from "../assets/cities";
import connections from "../assets/connections";

export default {
  name: "board",
  components: {
    Map
  },
  data() {
    return {
      cities,
      connections
    };
  },
  computed: {
    ...mapGetters({
      players: 'players/getPlayers',
      cities: 'board/getCities',
    })
  },
  mounted() {

  },
};
</script>


