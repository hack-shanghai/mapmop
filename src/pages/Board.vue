<template>
  <div class="container">
    <div class="notification">
      <Map :cities="cities"/>
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
    })
  },
  mounted() {

  },
};
</script>


