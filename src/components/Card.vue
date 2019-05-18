<template>
  <div class="card">
    <img class="header-img" :src="header_image"/>
    <img class="tag-img" :src="tag_image"/>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>


<script>
export default {
  name: 'Card',
  props: {
    header_image: String,
    tag_image: String,
    title: String,
    description: String,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small.card {
  width: 200px;
  height: 300px;
  border-radius: 12px;
}
.card {
  width: 400px;
  height: 600px;
  border-radius: 25px;
  box-shadow: 10px 5px 5px #777777;
  margin: 10px;
}
.header-img {
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  max-width: 100%;
}
.small .header-img {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  max-width: 100%;
}
.tag-img {
  position: absolute;
  width: 100px;
  top: 100px;
  left: 300px;
}
.small .tag-img {
  position: absolute;
  width: 50px;
  top: 50px;
  left: 150px;
}
h1 {
  margin: 40px 0 0;
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 30px;
}
.small h1 {
  margin: 20px 0 0;
  text-align: center;
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 20px;
}
p {
  padding: 10px;
  font-size: 1.3em;
}
.small p{
  padding: 6px;
  font-size: 0.9em;
}
</style>
