<template>
<div 
  class="d-flex justify-space=left"   
>
  <v-carousel 
    class="d-flex justify-space=left"
    hide-delimiters
    height="inherit"
    :show-arrows="showArrows"
  >
    <v-carousel-item
      v-for="n in Math.ceil(ALL_STANDS.length/4)"
      :key="n"      
    >
    <div class="d-flex justify-space=left">
      <vASCard
          v-for="stand in ASCardArray((n-1)*4)"
          :key="stand.id"
          :stand_data="stand"
          :stand_id="stand.id"
          :showSkeleton="stand.showSkeleton"
        />
    </div>
    </v-carousel-item>
  </v-carousel>
</div>

</template>

<script>
  import vASCard from '../components/vASCard'
  import {mapActions, mapGetters} from 'vuex'

  export default {
    name: 'vASCardContainer',
    components: {
      vASCard,
    },
    data: ()=>({
      reloadInterval: null,
      attrs: {
        boilerplate: true,
        elevation: 3,
      },
      showArrows: false,
      // sliceStart: 0,

    }),
    methods: {
      ...mapActions([
        'GET_STANDS_FROM_API'
      ]),
       ASCardArray(sliceStart = 0){
        let arr = this.ALL_STANDS.slice(sliceStart, sliceStart + 4)
        let c = 0
        if (sliceStart > 0) {
          this.showArrows = true
        }
        while (arr.length < 4) {
          arr.push({Id: c++, showSkeleton: true})
        }
        return arr
      },
    },
    mounted() {
      //console.log(this.CENTER_CONFIG.ConfigList.find(item => item.Name === "ASCardUpdateFreq"));
      //let a = this.CENTER_CONFIG.ConfigList.find(item => item.Name === "ASCardUpdateFreq")
      //console.log(a.Value);
      console.log(Number(this.CENTER_CONFIG_VALUE("ASCardUpdateFreq")));

      this.reloadInterval = setInterval(() => {
        this.GET_STANDS_FROM_API()
      }, Number(this.CENTER_CONFIG_VALUE("ASCardUpdateFreq")*1000));
    },
    computed: {
      ...mapGetters([
        'ALL_STANDS',
        'CENTER_CONFIG',
        'CENTER_CONFIG_VALUE'
      ]),
      // ASCardArray : function(){
      //   let arr = this.ALL_STANDS.slice(this.sliceStart, 4)
      //   let c = 0
      //   while (arr.length < 4) {
      //     arr.push({Id: c++, showSkeleton: true})
      //   }
      //   return arr
      // },
    },
    beforeDestroy() {
      clearInterval(this.reloadInterval);
    }
  }
</script>

<style scoped>
.v-card-item{
  box-shadow: 0 0 18px rgba(0,0,0,0.5);
}
.v-card-container{
  margin-top: 2px; 
  width: calc(100vw - 256px);
}
</style>
