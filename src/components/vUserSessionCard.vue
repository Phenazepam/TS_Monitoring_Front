<template>
  <div 
    class="text-center" 
    style="box-shadow: 0 0 2px rgba(0,0,0,0.5);" 
  >
    <v-data-table
      :height="LineContainerHeight"
      :headers="headers"
      :items="USER_SESSIONS"
      :items-per-page="8"
      class="elevation-1"
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageText: '',
        pageText: '',
      }"
    >
    </v-data-table>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  data () {
    return {
      reloadInterval: null,
      headers: [
        {
          text: 'ФИО пользователя',
          align: 'start',
          sortable: false,
          value: 'UserName',
        },
        {
          text: 'Количество сессий', 
          value: 'SessionCount'
        }

      ]
    }
  },
  props:{
    LineContainerHeight: {
        type: Number,
        default: 440
    },
  },
  methods: {
    ...mapActions([
      'GET_USER_SESSIONS'
    ])
  },
  computed:{
    ...mapGetters([
      'USER_SESSIONS',
      'CENTER_CONFIG_VALUE'
    ])
  },
  mounted() {
    this.reloadInterval = setInterval(() => {
      this.GET_USER_SESSIONS()
    }, Number(this.CENTER_CONFIG_VALUE("UserSessionUpdateFreq")*1000));
  },
  beforeDestroy() {
      clearInterval(this.reloadInterval);
  }
  
}
</script>