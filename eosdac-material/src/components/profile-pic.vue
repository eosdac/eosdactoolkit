<template>
  <div class="profile_pic_container bg-dark2" :style="{width: size, height: size }" >
    <!-- <transition name="fade"> -->
      <img v-if="showCustomImage" v-show="imageIsLoaded" :class="fitcontainer" v-on:load="onLoaded" v-bind:src="setImage" />
      <img v-if="!showCustomImage" class="profile_pic_fitwidth" src='https://eosdac.io/wp-content/uploads/elementor/thumbs/female1-nqk9ciy87u6os74yatkpw2xi7qbjzjq3r5sl9wy0mm.jpg'/>
    <!-- </transition> -->
    {{setImage}}
  </div>
</template>

<script>
export default {
  name: 'ProfilePic',

  props: {
    url: String,
    size:{
      default: '100px',
      type: String

    }
  },
  data () {
    return {
      fitcontainer:'profile_pic_fitwidth',
      imageIsLoaded: true,
      showCustomImage: false
      
    }
  },
  computed:{
    setImage(){
      
      if(this.$props.url !='' && this.$props.url!=undefined){
        this.imageIsLoaded = false;
        this.showCustomImage = true;
        return this.$props.url;
      }
      else{
        this.showCustomImage=false;
      }
    },

  },
  methods:{
     onLoaded(e) {
        let img = e.target;
        this.fitcontainer = img.width <= img.height ? 'profile_pic_fitwidth' : 'profile_pic_fitheight';
        console.log(img.width +' '+ img.height);
        this.imageIsLoaded = true;
        // this.visible = false;
        // this.loaded = true;
    },
  }
}
</script>

<style>
.profile_pic_container{
  border-radius:50%;
  overflow:hidden;
}
.profile_pic_fitheight{
  height:100%;
}
.profile_pic_fitwidth{
  width:100%;
}
</style>
