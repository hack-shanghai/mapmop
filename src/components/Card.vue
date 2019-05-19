<template>
  <div class="card" :style="{'background-color': color}" @click="$emit('click')">
    <img v-if="header_image" class="header-img" :src="header_image" ref="mainImage"/>
    <img v-if="tag_image" class="tag-img" :src="tag_image"/>
    <h1>{{ title }}</h1>
    <img v-if="footer_image" class="footer-img" :src="footer_image"/>
  </div>
</template>


<script>
export default {
  name: 'Card',
  props: {
    header_image: String,
    default_image: String,
    tag_image: String,
    footer_image:String,
    title: String,
    description: String,
    color: String,
  },
  mounted() {
    this.$refs.mainImage.onerror = this.handleImgError;
  },
  methods: {
    handleImgError() {
      let image = this.$refs.mainImage;
      if (image.src != this.default_image){
        image.src = this.default_image;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small.card {
  width: 100px;
  height: 160px;
  border-radius: 12px;
}
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 180px;
  height: 266px;
  border-radius: 25px;
  box-shadow: 10px 10px 5px #000000;
  margin: 6px;
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
  width: 40px;
  top: 46px;
  left: 136px;
}
.small .tag-img {
  position: absolute;
  width: 20px;
  top: 26px;
  left: 76px;
}
.footer-img {
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  max-width: 100%;
}
.small .footer-img {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  max-width: 100%;
}
h1 {
  margin: 40px 0 0;
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  margin: 30px;
  color: #ffffff
}
.small h1 {
  margin: 20px 0 0;
  text-align: center;
  font-size: 1em;
  font-weight: bold;
  margin: 0px;
}

.card.usable {
  cursor: pointer;
  transform: scale(1.1);
}

</style>
