<template>
  <card :class="getSize()" :header_image="citySrc()" :tag_image="pollutionSrc()" :title="city.name" :description="pollution.description"/>
</template>

<script>
export default {
  name: 'PollutionCard',
  props: {
    city: Object,
    pollution: Object,
    small: Boolean
  },
	methods: {
    citySrc() {
			let name = `cities/${this.city.name.toLowerCase()}.jpg`;
			return name;
		},
    pollutionSrc() {
			let name = `pollution/${this.pollution.name.toLowerCase()}.png`;
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
