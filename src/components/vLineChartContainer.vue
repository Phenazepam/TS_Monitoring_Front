<template>
  <div class="d-flex justify-space=between">
    <div style="margin-right:12px; background-color: white; box-shadow: 0 0 2px rgba(0,0,0,0.5);">
      <div style="margin-bottom: -5px">
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

      </div>
      <!-- <v-span>Использование RAM</v-span> -->
      <vLineChart
        :chartData="ALL_GRAPH_DATA_RAM"
        :width="LineContainerWidth"
        :height="LineContainerHeight"
        v-if="!ramCpuSwitch && dataArrived"
      />
      <vLineChart
        :width="LineContainerWidth"
        :height="LineContainerHeight"
        :chartData="ALL_GRAPH_DATA_CPU"
        v-if="ramCpuSwitch && dataArrived"
      />
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
    props: {
      LineContainerWidth: {
        type: Number,
        default: 1100
      },
      LineContainerHeight: {
        type: Number,
        default: 450
      },
    },
    methods: {
      ...mapActions([
        'GET_ALL_GRAPH_DATA'
      ])
    },
    async created() {
      await this.GET_ALL_GRAPH_DATA(this.CENTER_CONFIG_VALUE("ChartTimeDisplay"))
      this.dataArrived = true
    },
    mounted() {
      this.reloadInterval = setInterval( async() => {
       await this.GET_ALL_GRAPH_DATA(this.CENTER_CONFIG_VALUE("ChartTimeDisplay"))
      }, Number(this.CENTER_CONFIG_VALUE("ChartUpdateFreq")*1000));
    },
    computed: {
      ...mapGetters([
        'ALL_GRAPH_DATA_RAM',
        'ALL_GRAPH_DATA_CPU',
        'CENTER_CONFIG_VALUE'
      ]),
    },
    beforeDestroy() {
      clearInterval(this.reloadInterval);
    }
  }
</script>
