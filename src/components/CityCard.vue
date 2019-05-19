<template>
  <div>
    <card :class="getSize()" :header_image="citySrc()" :default_image="defaultCitySrc" :tag_image="pollutionSrc()" :footer_image="buildingSrc()" :title="card.name" :description="card.description" :color="getColor()"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CityCard',
  props: {
    card: Object,
    small: Boolean
  },
  data() {
    return {
      defaultCitySrc: "cities/default.jpg"
    };
  },
  computed: {
    ...mapGetters({
      pollutions: 'config/getPollutions'
    })
  },
  methods: {
    citySrc() {
      let path = `cities/${this.card.name.toLowerCase().replace(' ', '_')}.jpg`;
      return path;
    },
    pollutionSrc() {
      let name = `pollutions/${this.card.pollution.toLowerCase()}.png`;
      return name;
    },
    buildingSrc() {
      let name = `buildings/research-${this.card.pollution.toLowerCase()}.jpg`;
      return name;
    },
    getColor() {
     return this.pollutions[this.card.pollution].color;
    },
    getSize() {
      return this.small ? "small" : "";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
