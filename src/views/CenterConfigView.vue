<template>
  <v-container>
    <v-card class="card-container" :disabled="this.loading">
      <div class="loader" v-if="this.loading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <v-card-title>
        <span class="text-h5"
          >Конфигурация <b>{{ CENTER_CONFIG.ServerName }}</b></span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-data-table
            :headers="headers"
            :items="CENTER_CONFIG.ConfigList"
            hide-default-footer
            :items-per-page="-1"
            class="elevation-1"
          >
            <template v-slot:[`item.Value`]="props">
              <v-edit-dialog
                :return-value.sync="props.item.Value"
                large
                persistent
                @save="
                  save(CENTER_CONFIG.ConfigList.indexOf(props.item), props.item)
                "
                cancel-text="Отмена"
                save-text="Сохранить"
              >
                <div>{{ props.item.Value }}</div>
                <template v-slot:input>
                  <div class="mt-4 text-h6">
                    Новое значение {{ props.item.Name }}
                  </div>
                  <v-text-field
                    v-model="props.item.Value"
                    label="Edit"
                    single-line
                    autofocus
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialogOnSave = true">
          Сохранить
        </v-btn>
        <v-dialog v-model="dialogOnSave" max-width="400">
          <v-card>
            <v-card-title class="text-h5">
              Сохранить конфигурацию?
            </v-card-title>

            <v-card-text>
              Конфигурация {{CENTER_CONFIG.ServerName}} будет сохранена и перечитана.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" text @click="dialogOnSave = false">
                Отмена
              </v-btn>

              <v-btn color="green darken-1" text @click="saveFullConfig">
                Продолжить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import axios from 'axios';
import {mapActions, mapGetters} from 'vuex'
export default {
    data: () => ({
        dialogEdit: false,
        dialogDelete: false,
        dialogOnSave: false,
        headers: [
            {
            text: 'Параметр',
            align: 'start',
            sortable: false,
            value: 'Name',
            },
            {
            text: 'Значение', 
            value: 'Value'
            },
            {
                text: 'Описание',
                value: 'Description'
            },
        ],
        loading: false,
    }),
    props: {
        stand_id: {
            type: String,
            default: ""
        }
    },
    computed: {
        ...mapGetters([
            'CENTER_CONFIG',
        ]),
    },
    async mounted() {
      this.loading = true
      await this.GET_CENTER_CONFIG()
      this.loading = false
    },
    methods: {
         ...mapActions([
            'GET_CENTER_CONFIG',
        ]),
        async getConfig() {
            // this.loading = true
            // await this.GET_CENTER_CONFIG(this.stand_id)
            // this.loading = false
        },
        save(index, item) {
            this.CENTER_CONFIG.ConfigList[index] = item
        },
        saveFullConfig(){
            this.dialogOnSave = false
            this.loading = true
            axios.post(process.env.VUE_APP_DOMAIN + process.env.VUE_APP_SAVE_CONFIG, this.CENTER_CONFIG).then(response => {
                if (response.status == 200) {
                    this.loading = false
                    this.dialog = false 
                }
            })
        },
    },
    
    
}
</script>
<style scoped>
.card-container{
    position: relative;
}
.loader {
    position: absolute;
    left: 50%;
    top: 50%;
}
</style>