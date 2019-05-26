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
        ref="vlView"
      ></vl-view>

      <!-- interactions -->
      <vl-interaction-select @select="selectMap">
        <template/>
      </vl-interaction-select>
      <!--// interactions -->

      <vl-feature v-for="(ctd, index) in cityToDisplay" :key="'city_' + index" :city="ctd.city">
        <vl-geom-point :coordinates="[ctd.city.lon, ctd.city.lat]"></vl-geom-point>

        <!-- City name overlay -->
        <vl-overlay :position="[ctd.city.lon, ctd.city.lat]" :offset="[-8, 8]">
          <template slot-scope="scope">
            <div class="city-name">
              {{ ctd.city.name }}
            </div>
          </template>
        </vl-overlay>

        <!-- Nuclear -->
        <vl-style-box>
          <vl-style-icon
            src="../assets/dot.png"
            :color="ctd.colorNuclear"
            :scale="ctd.scaleNuclear"
            :anchor="[20/ctd.scaleNuclear+10, 1.5]"
            anchorXUnits="pixels"
          ></vl-style-icon>
        </vl-style-box>
        <!-- Weather -->
        <vl-style-box>
          <vl-style-icon
            src="../assets/dot.png"
            :color="ctd.colorWeather"
            :scale="ctd.scaleWeather"
            :anchor="[20/ctd.scaleWeather+10, 0.5]"
            anchorXUnits="pixels"
          ></vl-style-icon>
        </vl-style-box>
        <!-- Waste -->
        <vl-style-box>
          <vl-style-icon
            src="../assets/dot.png"
            :color="ctd.colorWaste"
            :scale="ctd.scaleWaste"
            :anchor="[20/ctd.scaleWaste+10, -0.5]"
            anchorXUnits="pixels"
          ></vl-style-icon>
        </vl-style-box>
        <!-- City -->
        <vl-style-box>
          <vl-style-icon src="../assets/place-marker.png" :anchor="[0.5, 0.5]"></vl-style-icon>
        </vl-style-box>
        <!-- Players -->
        <vl-style-box
          v-for="(player, indexPlayer) in ctd.playersForCity"
          :key="'player_' + indexPlayer"
        >
          <vl-style-icon
            src="../assets/avatar.png"
            :color="player.colorPlayer"
            :anchor="[-10, 0.5 + indexPlayer ]"
            :scale="0.9"
            anchorXUnits="pixels"
          ></vl-style-icon>
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
      players: "players/getPlayers",
      player: "players/getCurrentPlayer"
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
        const playersForCity = this.players.filter(player => {
          // console.log("city.uuid: " + city.uuid);
          // console.log("player.city.uuid: " + player.city.uuid);
          if (city.uuid === player.city.uuid) {
            return true;
          } else {
            return false;
          }
        });

        const playersWithColor = playersForCity.map(player => {
          let colorPlayer = this.characters.ecologist.color;
          if (player.character === "journalist") {
            colorPlayer = this.characters.journalist.color;
          }
          if (player.character === "dictator") {
            colorPlayer = this.characters.dictator.color;
          }
          if (player.character === "politician") {
            colorPlayer = this.characters.politician.color;
          }
          if (player.character === "alien") {
            colorPlayer = this.characters.alien.color;
          }
          if (player.character === "nuclear_scientist") {
            colorPlayer = this.characters.nuclear_scientist.color;
          }
          if (player.character === "kaitera_saesman") {
            colorPlayer = this.characters.kaitera_saesman.color;
          }
          if (player.character === "dustman") {
            colorPlayer = this.characters.dustman.color;
          }
          return {
            colorPlayer: colorPlayer,
            player
          };
        });

        return {
          city: city,
          colorNuclear: this.pollutions.nuclear.color,
          colorWeather: this.pollutions.weather.color,
          colorWaste: this.pollutions.waste.color,
          scaleWaste:
            city.pollutions.waste && city.pollutions.waste !== 0
              ? 0.2 + city.pollutions.waste * 0.2
              : 0,
          scaleNuclear:
            city.pollutions.nuclear && city.pollutions.nuclear !== 0
              ? 0.2 + city.pollutions.nuclear * 0.2
              : 0,
          scaleWeather:
            city.pollutions.weather && city.pollutions.weather !== 0
              ? 0.2 + city.pollutions.weather * 0.2
              : 0,
          playersForCity: playersWithColor
        };
      });

      return cityDisplay;
    }
  },
  mounted() {
    this.centerPlayer(this.player);
  },
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
    },
    centerCity(city) {
      {
        this.$refs.vlView.animate({center: [city.lon, city.lat], zoom: 4})
      };
    },
    centerPlayer(player) {
      {
        this.$refs.vlView.animate({center: [player.city.lon, player.city.lat], zoom: 4})
      };
    }
  },
  watch: {
    "player.city": function (city) {
      this.centerCity(city);
    },
  }
};
</script>

<style scoped>
.city-name {
  padding: 2px 6px 2px 6px;;
  color: #ffffff;
  background-color: rgb(0, 0, 0, 0.5);
  border-radius: 25px;
}
</style>
