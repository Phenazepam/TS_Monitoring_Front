<template>
    <v-container class="DBBlock-container">
        <v-card>
            <div class="v-card-body">
                <v-row >
                    <v-col md="3">
                        <div class="avatar" :class="{'background-ok': DB_BLOCK.length === 0, 'background-bad': DB_BLOCK.length > 0 }">
                            <img 
                                class="avatar-img" 
                                src="@/assets/db-icon-ok.png" 
                                alt=""
                                v-if="DB_BLOCK.length === 0"
                            >
                            <img 
                                class="avatar-img" 
                                src="@/assets/db-icon-alarm.png" 
                                alt=""
                                v-if="DB_BLOCK.length > 0"
                            >
                        </div>
                    </v-col>
                    <v-col md="9" class="avatar-title">
                        <div>
                            Блокировки
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <div v-if="DB_BLOCK.length === 0" class="v-card-text">
                            Блокировок в БД не обнаружено.
                        </div>
                        <div v-if="DB_BLOCK.length > 0" class="v-card-text">
                            Блокировка на объекте:
                            <b
                                v-for="n in DB_BLOCK"
                                :key="n.Id"
                            >
                                {{n.ObjectName}}
                            </b> 
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-card>
    </v-container>
</template>
<script>

import {mapActions, mapGetters} from 'vuex'
export default {
    data () {
    return {
      isBlock: false,
      blockedObject: "",
    }
  },
  methods: {
      ...mapActions([
      'GET_DB_BLOCK'
    ]),
    isBlockExist(){
        console.log(this.BD_BLOCK);
        if (this.BD_BLOCK.length > 0) {
            this.isBlock = true
            this.DB_BLOCK.forEach(element => {
                this.blockedObject += element.ObjectName + ' '
            });
        }
    }
  },
  computed:{
      ...mapGetters([
      'DB_BLOCK',
      'CENTER_CONFIG_VALUE'
    ]),
    // isBlock: function(){
    //     console.log(this.DB_BLOCK);
    //     if (this.BD_BLOCK.length > 0) {
    //         return true
    //     }
    //     return false
    // }
  },
  mounted() {
    this.reloadInterval = setInterval(() => {
      this.GET_DB_BLOCK()
    //   this.isBlockExist()
    }, Number(this.CENTER_CONFIG_VALUE("DBBlockUpdateFreq")*1000));
  },
  beforeDestroy() {
      clearInterval(this.reloadInterval);
  },
}
</script>




<style scoped>
.DBBlock-container{
    margin: 0;
    display: flex;
    justify-content: flex-end;
}
.v-card{
    margin-top: 12px;
    margin-right: 15px;
    width: 210px;
    height: 185px;
}
.v-card-body{
    padding: 24px;
}
.avatar{
    width: 2.375rem;
    height: 2.375rem;
    cursor: pointer;
    border-radius: 3px;
    display: flex;
    align-items: center;
}
.avatar-img{
    margin: auto;
}
.avatar-title{
    display: flex;
    align-items: center;
    vertical-align: middle;
    margin: auto;
    font-weight: bold;
    color: #566a7f;
    font-family: sans-serif;
}
.v-card-text{
    color: #566a7f;
    font-family: sans-serif;
}
.background-ok{
    background-color: rgba(238, 251, 231, 0.9);
}
.background-bad{
    background-color: rgba(255, 231, 227, 0.9);
}
</style>