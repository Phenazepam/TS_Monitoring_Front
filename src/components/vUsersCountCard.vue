<template>
  <v-container class="DBBlock-container">
    <v-card class="card">
      <div class="card-body">
        <v-row>
          <v-col md="3">
            <div class="avatar background-ok">
              <img class="avatar-img" src="@/assets/user-circle.png" alt="" />
            </div>
          </v-col>
          <v-col md="9" class="avatar-title">
            <div>
              Пользователей в системе: <b>{{ COUNT_USERS }}</b>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn class="card-text" @click="dialogOnSave = true">
              Очистить <br />
              дубли сессий
            </v-btn>
            <v-dialog v-model="dialogOnSave" max-width="400" persistent>
              <v-card v-if="!loading && !dataArrived">
                <v-card-title class="text-h5">
                  Очистить дубли сессий?
                </v-card-title>

                <v-card-text>
                  У пользователей будут закрыты все сессии кроме последней по
                  времени.
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="dialogOnSave = false"
                  >
                    Отмена
                  </v-btn>

                  <v-btn color="green darken-1" text @click="closeSessions">
                    Продолжить
                  </v-btn>
                </v-card-actions>
              </v-card>

              <v-card v-if="loading">
                <v-card-title> Выполняется очистка сессий </v-card-title>
                <v-card-text style="text-align: center">
                  <v-spacer></v-spacer>
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-card-text>
              </v-card>

              <v-card v-if="dataArrived">
                <v-card-title class="text-h5">
                  Очистка выполнена.
                </v-card-title>

                <v-card-text>
                  Закрыто сессий пользователей: {{closeCount}} 
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="dialogOnSave = dataArrived = false"
                  >
                    Закрыть
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>
<script>
import axios from 'axios';
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      dialogOnSave: false,
      loading: false,
      closeCount: -1,
      dataArrived: false
    };
  },
  methods: {
    ...mapActions(["GET_COUNT_USERS"]),
    async closeSessions() {
      this.loading = true;
      let response = await axios.get(process.env.VUE_APP_DOMAIN + process.env.VUE_APP_CLOSE_SESSIONS)
      this.closeCount = response.data
      this.loading = false
      this.dataArrived = true
    },
  },
  computed: {
    ...mapGetters(["COUNT_USERS", "CENTER_CONFIG_VALUE"]),
  },
  mounted() {
    this.reloadInterval = setInterval(() => {
      this.GET_COUNT_USERS(); 
    }, Number(this.CENTER_CONFIG_VALUE("UserCountUpdateFreq") * 1000));
  },
  beforeDestroy() {
    clearInterval(this.reloadInterval);
  },
};
</script>




<style scoped>
.DBBlock-container {
  margin: 0;
  display: flex;
  justify-content: flex-end;
}
.card {
  margin-top: 12px;
  margin-right: 15px;
  width: 210px;
  height: 185px;
}
.card-body {
  padding: 24px;
}
.avatar {
  width: 2.375rem;
  height: 2.375rem;
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  align-items: center;
}
.avatar-img {
  margin: auto;
}
.avatar-title {
  display: flex;
  align-items: center;
  vertical-align: middle;
  margin: auto;
  /* font-weight: bold; */
  color: #566a7f;
  font-family: sans-serif;
}
.card-text {
  color: #566a7f;
  font-family: sans-serif;
  word-wrap: break-word;
  max-width: 200px;
  margin-top: 15px;
}
.background-ok {
  background-color: rgba(224, 247, 252, 0.9);
}
.background-bad {
  background-color: rgba(255, 231, 227, 0.9);
}
</style>