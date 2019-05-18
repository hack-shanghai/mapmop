<template>
  <div>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      style="height: 100%"
    >
      <vl-view projection="EPSG:4326" :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <vl-feature v-for="(city, index) in cities" :key="'city_' + index">
        <vl-geom-point :coordinates="[city.lon, city.lat]"></vl-geom-point>
        <!-- <vl-style-box>
          <vl-style-icon src="assets/dot.png" color="[113, 140, 0]"></vl-style-icon>
        </vl-style-box>-->
      </vl-feature>

      <vl-feature v-for="(coord, index) in connectionsCordinates" :key="'transition_' + index">
          <vl-geom-line-string :coordinates="[coord.coord1,coord.coord2]"></vl-geom-line-string>
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
    cities: Array,
    connections: Array,
  },
  data() {

    const connectionsCordinates = this.connections.map(connection => {
      const findCity1 = this.cities.find(city=>city.name === connection.city1);
       const findCity2 = this.cities.find(city=>city.name === connection.city2);
      return {
        coord1: [findCity1.lon,findCity1.lat],
        coord2: [findCity2.lon,findCity2.lat]
      }
    })

    return {
        zoom: 2.5,
        center: [this.cities[0].lon,this.cities[0].lat],
        rotation: 0,
        connectionsCordinates
    };
  }
};
</script>
