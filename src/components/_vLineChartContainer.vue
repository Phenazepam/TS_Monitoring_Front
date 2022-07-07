<template>
  <div class="d-flex justify-space=between">
    <div style="margin-right:12px; background-color: white; box-shadow: 0 0 18px rgba(0,0,0,0.5); width: calc(100vw - 256px);">
      <!-- <div style="margin-bottom: -5px">
        <v-btn
          class="ma-2"
          :outlined="ramCpuSwitch"
          @click="ramCpuSwitch = !ramCpuSwitch"
          color="primary"
        >
          RAM
        </v-btn>
        <v-btn
          class="ma-2"
          :outlined="!ramCpuSwitch"
          color="primary"
          @click="ramCpuSwitch = !ramCpuSwitch"
        >
          CPU
        </v-btn>

      </div> -->
      <!-- <v-span>Использование RAM</v-span> -->
      <div class="d-flex justify-space=between">
        <vLineChart
            style="width: calc((100vw - 256px)/2)"
            :width="1200"
            :height="450"
            :chartData="ALL_GRAPH_DATA_RAM"

            v-if="!ramCpuSwitch && dataArrived"
        />
        <vLineChart
            style="width: calc((100vw - 256px)/2)"
            :width="1200"
            :height="450"
            :chartData="ALL_GRAPH_DATA_RAM"

            v-if="!ramCpuSwitch && dataArrived"
        />
      </div>
    </div>
  </div>
  
</template>


<script>
  import {mapActions, mapGetters} from 'vuex'
  import vLineChart from '../components/vLineChart'
  export default {
    name: 'vLineChartContainer',
    components: {
       vLineChart,
    },
    data: ()=>({
      reloadInterval: null,
      dataArrived: false,
      ramCpuSwitch: false,
    }),
    methods: {
      ...mapActions([
        'GET_ALL_GRAPH_DATA'
      ])
    },
    async created() {
      await this.GET_ALL_GRAPH_DATA()
      this.dataArrived = true
    },
    mounted() {
      this.reloadInterval = setInterval( async() => {
       await this.GET_ALL_GRAPH_DATA()
      }, 10000);
    },
    computed: {
      ...mapGetters([
        'ALL_GRAPH_DATA_RAM',
        'ALL_GRAPH_DATA_CPU',
      ]),
    },
    beforeDestroy() {
      clearInterval(this.reloadInterval);
    }
  }
</script>
