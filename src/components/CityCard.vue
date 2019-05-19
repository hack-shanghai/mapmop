<template>
  <div>
    <card :class="getSize()" :header_image="citySrc()" :tag_image="pollutionSrc()" :title="card.name" :description="card.description"/>
  </div>
</template>

<script>
export default {
  name: 'CityCard',
  props: {
    card: Object,
    small: Boolean
  },
  methods: {
    citySrc() {
      let name = `cities/${this.card.name.toLowerCase().replace(' ', '_')}.jpg`;
      return name;
    },
    pollutionSrc() {
      let name = `pollutions/${this.card.pollution.toLowerCase()}.png`;
      return name;
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
