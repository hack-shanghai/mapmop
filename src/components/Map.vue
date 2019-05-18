<template>
  <div>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      style="height: 400px"
    >
      <vl-view projection="EPSG:4326"></vl-view>

      <vl-feature v-for="(city, index) in cities" :key="index">
        <vl-geom-point :coordinates="[city.lat, city.lon]"></vl-geom-point>
        <!-- <vl-style-box>
          <vl-style-icon src="assets/dot.png" color="[113, 140, 0]"></vl-style-icon>
        </vl-style-box>-->
      </vl-feature>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
  </div>
</template>

<script>
export default {
  props: {
    cities: Array
  },
  data() {
    return {};
  }
};
</script>