<template>
  <div class="card">
    <img :src="header_image"/>
  </div>
</template>


<script>
export default {
  name: 'Deck',
  props: {
    header_image: Object,
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  max-width: 180px;
  height: 270px;
  border-radius: 25px;
  box-shadow: 10px 5px 5px #777777;
  margin: 6px;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.3) 10px,
    rgba(0, 0, 0, 0.5) 10px,
    rgba(0, 0, 0, 0.5) 20px
  ),
  url(/planet.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
