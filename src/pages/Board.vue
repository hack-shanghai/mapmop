<template>
  <div class="container">
    <div class="notification">
      <Map :cities="cities" :connections="connections"/>
    </div>
  </div>
</template>

<script>
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
  mounted() {}
};
</script>


