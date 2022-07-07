<template>
    <v-row>
        <v-col>
            <v-row justify="space-between" no-gutters>
                <v-col md="10">
                    <vASCardContainer/>
                </v-col>
                <v-col md="2">
                    <v-row>
                        <v-col>
                            <vDBBlockInfo/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <vUsersCountCard/>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row style="margin-top: 15px">
                <v-col md="8" sm="12" ref="LineContainer">
                    <vLineChartContainer
                        :LineContainerWidth="LineContainerWidth"
                    />
                </v-col>
                <v-col md="4" style="padding-left: 20px">
                    <vUserSessionCard/>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>


<script>
import vASCardContainer from '../components/vASCardContainer'
import vLineChartContainer from '../components/vLineChartContainer'
import vUserSessionCard from '../components/vUserSessionCard'
import vDBBlockInfo from '../components/vDBBlockInfo'
import vUsersCountCard from '../components/vUsersCountCard.vue'
import {mapActions, mapGetters} from 'vuex'
export default {
    name: 'DashboardView',
    components: {
      vASCardContainer,
      vLineChartContainer,
      vUserSessionCard,
      vDBBlockInfo,
      vUsersCountCard,
    },
    data(){
        return{
            LineContainerWidth: null,
            LineContainerHeight: null
        }    
    },
    computed: {
        ...mapGetters([
            'CENTER_CONFIG',
        ]),
    },
    async created() {
        await this.GET_CENTER_CONFIG()
    },
    async mounted() {
      this.LineContainerWidth = this.$refs.LineContainer.clientWidth;
      this.LineContainerHeight = this.$refs.LineContainer.clientHeight;

    },
    methods: {
    ...mapActions([
        'GET_CENTER_CONFIG',
    ]),
  },
}
</script>

<style scoped>
.col{
    padding: 0;
}
</style>