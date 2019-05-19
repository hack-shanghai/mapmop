<template>
  <div>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      style="height: 100%"
    >
      <vl-view
        projection="EPSG:4326"
        :zoom.sync="zoom"
        :center.sync="getCenter.center"
        :rotation.sync="rotation"
      ></vl-view>

      <!-- interactions -->
      <vl-interaction-select @select="selectMap"></vl-interaction-select>
      <!--// interactions -->

      <vl-feature v-for="(ctd, index) in cityToDisplay" :key="'city_' + index" :city="ctd.city">
        <vl-geom-point :coordinates="[ctd.city.lon, ctd.city.lat]"></vl-geom-point>
        <!-- Waste -->
        <vl-style-box>
          <vl-style-icon
            src="../assets/dot.png"
            :color="[22,44,66]"
            :anchor="[1.5, 0.5]"
            :scale="ctd.scaleWaste"
          ></vl-style-icon>
        </vl-style-box>
        <vl-style-box>
          <vl-style-icon src="../assets/place-marker.png"></vl-style-icon>
        </vl-style-box>
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
import { mapGetters } from "vuex";

export default {
  props: {
    cities: Array,
    connections: Array
  },
  computed: {
    ...mapGetters({
      pollutions: "config/getPollutions",
      characters: "config/getCharacters",
      players: "players/getPlayers"
    }),
    // get the center map
    getCenter() {
      return {
        center: this.cities[0]
          ? [this.cities[0].lon, this.cities[0].lat]
          : [0, 0]
      };
    },
    // calculte the coord from connections
    connectionsCordinates() {
      const connectionsCordinates = this.connections.map(connection => {
        const findCity1 = this.cities.find(
          city => city.uuid === connection.city1
        );
        const findCity2 = this.cities.find(
          city => city.uuid === connection.city2
        );
        return {
          coord1: [findCity1.lon, findCity1.lat],
          coord2: [findCity2.lon, findCity2.lat]
        };
      });
      return connectionsCordinates;
    },
    // calculate the things to display for each city
    cityToDisplay() {
      const cityDisplay = this.cities.map(city => {
        // const playersForCity = this.players.find(
        //   player => city.uuid === player.city
        // );
        // playersForCity.map(player => {
        //   let color = this.characters.ecolo.color;
        //   if (player.character === "journalist") {
        //     color = this.characters.journalist.color;
        //   }
        //   if (player.character === "dictator") {
        //     color = this.characters.dictator.color;
        //   }
        //   if (player.character === "politician") {
        //     color = this.characters.politician.color;
        //   }
        //   if (player.character === "alien") {
        //     color = this.characters.alien.color;
        //   }
        //   if (player.character === "nuclear_scientist") {
        //     color = this.characters.nuclear_scientist.color;
        //   }
        //   if (player.character === "kaitera_saesman") {
        //     color = this.characters.kaitera_saesman.color;
        //   }
        //   if (player.character === "dustman") {
        //     color = this.characters.dustman.color;
        //   }
        //   return {
        //     player,
        //     color
        //   };
        // });
        return {
          city: city,
          scaleWaste: 1 + city.pollutions.waste * 0.5,
          scaleNuclear: city.pollutions.nuclear * 0.5,
          scaleWeather: city.pollutions.weather * 0.5
          // players: playersForCity
        };
      });
      return cityDisplay;
    }
  },
  mounted() {},
  data() {
    return {
      zoom: 3,
      rotation: 0
    };
  },
  methods: {
    selectMap({ feature }) {
      const city = feature.vm[0].$attrs.city;
      if (city) {
        this.$emit("click", city);
      }
    }
  }
};
</script>
