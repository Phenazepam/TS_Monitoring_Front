<template>
  <v-container style="padding: 0px; margin-right: 20px">
    <!-- <v-skeleton-loader
      v-if="showSkeleton"
      width="320"
      height="470"
      type="card-avatar, divider,article, divider,actions"
    ></v-skeleton-loader> -->
    <v-card
      v-if="!showSkeleton"
      :class="InAutomaticModeClass"
      class="mx-auto card-container"
      max-width="320"
      :disabled="this.loading"
    >
    <div class="loader" v-if="this.loading">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
      <v-img
        height="150"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        class="white--text align-end"
        :src="require(`@/assets/server${InUse ? '': '-faded'}.png`)"
        cover 
      >
      <v-card-title class="text-white">
        <v-row justify="space-between">
          <v-col md="10">
            {{stand_data.Name}}
          </v-col>
          <v-col md="2">
            <vConfigDialog
              :stand_id="stand_data.Guid"
            />
          </v-col>
        </v-row>
      </v-card-title>
      </v-img>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>
        <v-row>
          <v-col md="9">
            Статус:<b>{{ GetStatusText }}</b>
          </v-col>
          <v-col>
            <v-icon
              style="border-radius: 50%; width: 35px; height:35px"
              :class="GetStatusClass"
            >
              mdi-lightbulb-on-outline
            </v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>Режим:<b>{{ GetModeText }}</b></v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-simple-table style="background-color: transparent">
        <template v-slot:default>
          <tbody>
            <tr>
              <td>RAM</td>
              <td>{{ stand_data.RAM }} %</td>
            </tr>
            <tr>
              <td>CPU</td>
              <td>{{ stand_data.CPU }} %</td>
            </tr>
            <tr>
              <td>Время работы</td>
              <td>{{ stand_data.ProcessWorkTime }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-divider class="mx-4"></v-divider>

      <v-card-actions>
        <div class="d-flex justify-space=around">

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2"
                v-bind="attrs"
                v-on="on"
                color="indigo"
                :disabled="!InUse && !InColdStart"
                @click="switchAutomatic"
              >
                <v-icon color="white">mdi-cog-sync-outline</v-icon>
              </v-btn>
            </template>
            <span>Автоматический / ручной режим</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2"
                v-bind="attrs"
                v-on="on"
                color="rgba(5,101,255,.9)"
                :disabled="InAutomaticMode || InColdStart"
                v-on:click="startStopUsing"
              >
                <v-icon color="white">mdi-power</v-icon>
              </v-btn>
            </template>
            <span>Сбросить / вернуть нагрузку</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2"
                v-bind="attrs"
                v-on="on"
                color="rgba(4,145,191,.9)"
                :disabled="InAutomaticMode || InUse || InColdStart"
                @click="executeRestart"
              >
                <v-icon color="white">mdi-restart</v-icon>
              </v-btn>
            </template>
            <span>Выполнить перезагрузку</span>
          </v-tooltip>

          <v-menu offset-y >
            <template v-slot:activator="{ on, attrs }">
              <v-btn              
                class="ma-2"
                style="border-radius: 50%;"

                v-bind="attrs"
                v-on="on"
                icon
              >
                <v-icon>
                  mdi-chevron-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :href="stand_data.URL" target="_black">
                    Открыть ссылку на стенд
              </v-list-item>
            </v-list>
          </v-menu>   
        </div>
      </v-card-actions> 
    </v-card>

    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          icon
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
import {mapActions, mapGetters} from 'vuex'
import vConfigDialog from '../components/vConfigDialog.vue'
export default {
  name: 'v-as-card',
  props: {
    stand_data: {
      type: Object,
      default:() => ({})
    },
    showSkeleton: {
      type: Boolean,
      default: false
    },
  },
  components: {
    vConfigDialog
  },
  data: () => ({
    snackbar: false,
    snackbarText: "",
    loading: false,
    dialog: false,
  }),
  mounted() {
    this.GET_STANDS_FROM_API().then(this.CHANGE_LOADING_STATUS(false))
  },
  computed: {
    ...mapGetters([
      'ALL_STANDS',
      'CARD_LOADING'
    ]),
    InAutomaticModeClass: function() {
      return {
        'grey-background': this.stand_data.InAutomaticMode
      }
    },
    GetStatusText: function() {
      if(this.stand_data.InUse === 1) return "в работе"
      if(this.stand_data.InColdStart === 1) return "перезапуск"
      return "без нагрузки"
    },
    GetStatusClass: function() {
      if(this.stand_data.InUse === 1) return "inUse"
      if(this.stand_data.InColdStart === 1) return "inColdStart"
      return "notInUse"
    },
    GetModeText: function() {
      if(this.stand_data.InAutomaticMode === 1) return "автоматическое управление"
      return "ручное управление"
    },
    InAutomaticMode: function() {
      return this.stand_data.InAutomaticMode === 1 ? true : false 
    },
    InUse: function() {
      return this.stand_data.InUse === 1 ? true : false 
    },
    InColdStart: function() {
      return this.stand_data.InColdStart === 1 ? true : false 
    },
    ServerImage: function() {
      if (this.InUse) {
        return '@/assets/server.png'
      }
      return '@/assets/server-faded.png'
    }
  },
  methods: {
    ...mapActions([
      'GET_STANDS_FROM_API',
      'CHANGE_LOADING_STATUS'
    ]),

    async startStopUsing(){
      this.loading = true
        if (this.stand_data.InUse === 1) {
        axios
          .get(process.env.VUE_APP_DOMAIN + process.env.VUE_APP_STOP_USING_EP + this.stand_data.Guid)
          .then(response => {
           if(response.data){
             this.snackbarText = 'Нагрузка снята с сервера ' + this.stand_data.Name
             this.snackbar = true
           } 
           else {
             this.snackbarText = 'Ошибка. Не удалось снять нагрузку с сервера '+ this.stand_data.Name
             this.snackbar = true
           }
          }
          )
          .catch(() => {
            this.snackbarText = 'Ошибка. Не удалось снять нагрузку с сервера '+ this.stand_data.Name
            this.snackbar = true
          });
        }
        else{
          axios
            .get(process.env.VUE_APP_DOMAIN + process.env.VUE_APP_START_USING_EP + this.stand_data.Guid)
            .then(response => {
             if(response.data){
               this.snackbarText = 'Нагрузка возвращена на сервер ' + this.stand_data.Name
               this.snackbar = true
             } 
             else {
               this.snackbarText = 'Ошибка. Не удалось вернуть нагрузку на сервер '+ this.stand_data.Name
               this.snackbar = true
             }
            }
            )
            .catch(() => {
              this.snackbarText = 'Ошибка. Не удалось вернуть нагрузку на сервер '+ this.stand_data.Name
              this.snackbar = true
            })
            
        }
        await this.GET_STANDS_FROM_API()
        this.loading = false
    },
    async switchAutomatic(){
      this.loading = true
      
      if (this.stand_data.InAutomaticMode === 1) {
         axios
        .get(process.env.VUE_APP_DOMAIN + process.env.VUE_APP_SET_NOT_AUTOMATIC_EP + this.stand_data.Guid)
        .then(response => {
         if(response.data){
           this.snackbarText = 'Сервер ' + this.stand_data.Name + ' переведен в ручной режим'
           this.snackbar = true
         } 
         else {
           this.snackbarText = 'Ошибка. Не удалось перевести в ручной режим сервер '+ this.stand_data.Name
           this.snackbar = true
         }
        }
        )
        .catch(() => {
          this.snackbarText = 'Ошибка. Не удалось перевести в ручной режим сервер  '+ this.stand_data.Name
          this.snackbar = true
        });
      }
      else{
        axios
          .get(process.env.VUE_APP_DOMAIN + process.env.VUE_APP_SET_AUTOMATIC_EP + this.stand_data.Guid)
          .then(response => {
           if(response.data){
             this.snackbarText = 'Сервер ' + this.stand_data.Name + ' переведен в автоматический режим'
             this.snackbar = true
           } 
           else {
             this.snackbarText = 'Ошибка. Не удалось перевести в авто режим сервер '+ this.stand_data.Name
             this.snackbar = true
           }
          }
          )
          .catch(() => {
            this.snackbarText = 'Ошибка. Не удалось перевести в авто режим сервер '+ this.stand_data.Name
            this.snackbar = true
          });
      }
      await this.GET_STANDS_FROM_API()
      this.loading = false
    },
    async executeRestart(){
      this.loading = true
      axios
        .get(process.env.VUE_APP_DOMAIN + process.env.VUE_APP_EXECUTE_RESTART_EP + this.stand_data.Guid)
        .then(response => {
         if(response.data){
           this.snackbarText = 'Сервер ' + this.stand_data.Name + ' отправлен в перезагрузку'
           this.snackbar = true
         } 
         else {
           this.snackbarText = 'Ошибка. Не удалось отправить в перезагрузку сервер '+ this.stand_data.Name
           this.snackbar = true
         }
        }
        )
        .catch(() => {
          this.snackbarText = 'Ошибка. Не удалось отправить в перезагрузку сервер '+ this.stand_data.Name
          this.snackbar = true
        });
        await this.GET_STANDS_FROM_API()
        this.loading = false
    },
  },
}
</script>


<style scoped>
  .inUse{
    background-color: rgba(40, 219, 89, .9);
  }
  .inColdStart{
    background-color: rgba(6, 184, 236, .9);
  }
  .notInUse{
    background-color: rgba(242, 0, 6, .9);
  }
  .grey-background{
    /* background-color: rgba(221, 221, 221, .6) !important; */
    background-color: rgb(245, 245, 245) !important;
  }
  .card-container{
    position: relative;
  }

  .loader {
    position: absolute;
    left: 50%;
    top: 50%;
  }
</style>