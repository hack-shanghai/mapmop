<template>
  <div :class="{'throwable': throwable}">
    <card class="card"
      :class="{'small': small, 'usable': usable, 'used': used}"
      :header_image="citySrc"
      :default_image="defaultCitySrc"
      :tag_image="pollutionSrc"
      :footer_image="buildingSrc"
      :title="card.name"
      :description="card.description"
      :color="getColor"
      :usable="usable"
      @click="$emit('click', card)"
    />
    <img class="throw-icon" src="delete.svg" @click="$emit('click', card)"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CityCard',
  props: {
    card: Object,
    small: Boolean,
    usable: Boolean,
    throwable: Boolean,
    used: Boolean
  },
  data() {
    return {
      defaultCitySrc: "cities/default.jpg"
    };
  },
  computed: {
    ...mapGetters({
      pollutions: 'config/getPollutions'
    }),
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.throwable {
  position: relative;
}

.card.usable {
  cursor: pointer;
  transform: scale(1.1);
}

.throwable:hover>.card {
  cursor: pointer;
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.throw-icon{
  cursor: pointer;
  position: absolute;
  margin-top: -185px;
  margin-left: 55px;
  width: 80px;
  display: none;
}

.throwable:hover>.throw-icon{
  display: block;
}

.throwable:hover>.throw-icon path {
    fill: red;
}

.card.used {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}
</style>
