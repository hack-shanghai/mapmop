<template>
  <div class="container">
    <div class="notification">
      <Map :cities="cities"/>
    </div>
  </div>
</template>

<script>
import Map from "../components/Map";
import cities from "../assets/cities";
export default {
  name: "board",
  components: {
    Map
  },
  data() {
    return {
      cities
    };
  },
  mounted() {}
};
</script>


