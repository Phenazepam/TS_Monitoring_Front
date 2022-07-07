import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stands: [],
    all_graph_data: {}, 
    user_sessions: [],
    card_loading: true,
    db_block: [],
    count_users: 0,
    server_config: {},
    center_config: {},
  },
  getters: {
    ALL_STANDS(state){
      return state.stands
    },
    ALL_GRAPH_DATA_RAM(state){
      return state.all_graph_data.ram
    },
    ALL_GRAPH_DATA_CPU(state){
      return state.all_graph_data.cpu
    },
    USER_SESSIONS(state) {
      return state.user_sessions
    },
    CARD_LOADING(state) {
      return state.card_loading
    },
    DB_BLOCK(state) {
      return state.db_block
    },
    COUNT_USERS(state) {
      return state.count_users
    },
    SERVER_CONFIG(state) {
      return state.server_config
    },
    CENTER_CONFIG(state) {
      return state.center_config
    },
    // CENTER_CONFIG_VALUE(state, ItemName) {
    //   console.log(ItemName);
    //   let a = state.center_config.ConfigList.find(item => item.Name === name)
    //   return a.Value
    // },
    CENTER_CONFIG_VALUE: (state) => (name) => {
      let a = state.center_config.ConfigList.find(item => item.Name === name)
      return a.Value
    }
  },
  mutations: {
    SET_STANDS_TO_STATE: (state, stands) => {
      state.stands = stands
    },
    SET_ALL_GRAPH_DATA: (state, all_graph_data) => {
      state.all_graph_data = all_graph_data
    },
    SET_USER_SESSIONS: (state, user_sessions) => {
      state.user_sessions = user_sessions
    },
    SET_LOADING_STATUS: (state, status) => {
      state.card_loading = status
    },
    SET_DB_BLOCK: (state, db_block) => {
      state.db_block = db_block
    },
    SET_COUNT_USERS: (state, response) => {
      state.count_users = response
    },
    SET_SERVER_CONFIG: (state, response) => {
      state.server_config = response
    },
    SET_CENTER_CONFIG: (state, response) => {
      state.center_config = response
    }
  },
  actions: {
    GET_STANDS_FROM_API({commit}){
      return axios(/*'http://10.15.6.209:8081/api/appserver/getallservers'*/'http://localhost:62658/api/appserver/getallservers', {
        method: "GET"
      })
      .then((stands) => {
        commit('SET_STANDS_TO_STATE', stands.data)
        return stands.data
      })
    },

    GET_ALL_GRAPH_DATA({commit}, interval){
      return axios(/*'http://10.15.6.209:8081/api/graph/GetAllChartData'*/'http://localhost:62658/api/graph/GetAllChartData/' + interval, {
        method: "GET"
      })
      .then((all_graph_data) => {
        commit('SET_ALL_GRAPH_DATA', all_graph_data.data)
        return all_graph_data.data
      })
    },

    GET_USER_SESSIONS({commit}){
      return axios(/*'http://10.15.6.209:8081/api/UserSession/GetUserSessionsList'*/'http://localhost:62658/api/UserSession/GetUserSessionsList', {
        method: "GET"
      })
      .then((user_sessions) => {
        commit('SET_USER_SESSIONS', user_sessions.data)
        // console.log(user_sessions.data);
        return user_sessions.data
      })
    },

    CHANGE_LOADING_STATUS({commit}, status){
      commit('SET_LOADING_STATUS', status)
    },

    GET_DB_BLOCK({commit}){
      return axios(/*'http://10.15.6.209:8081/api/UserSession/GetUserSessionsList'*/'http://localhost:62658/api/AddInfo/GetDBBlock', {
        method: "GET"
      })
      .then((db_block) => {
        commit('SET_DB_BLOCK', db_block.data)
        // console.log( db_block.data);
        return db_block.data
      })
    },
    GET_COUNT_USERS({commit}){
      return axios(/*'http://10.15.6.209:8081/api/UserSession/GetUserSessionsList'*/'http://localhost:62658/api/UserSession/GetCountActiveUsers', {
        method: "GET"
      })
      .then((response) => {
        commit('SET_COUNT_USERS', response.data)
        // console.log( db_block.data);
        return response.data
      })
    },
    GET_SERVER_CONFIG({commit}, guid){
      return axios(/*'http://10.15.6.209:8081/api/UserSession/GetUserSessionsList'*/'http://localhost:62658/api/ServerConfiguration/GetConfig/' + guid, {
        method: "GET"
      })
      .then((response) => {
        commit('SET_SERVER_CONFIG', response.data)
        // console.log( db_block.data);
        return response.data
      })
    },
    GET_CENTER_CONFIG({commit}){
      return axios(/*'http://10.15.6.209:8081/api/UserSession/GetUserSessionsList'*/'http://localhost:62658/api/ServerConfiguration/GetCenterConfig/', {
        method: "GET"
      })
      .then((response) => {
        commit('SET_CENTER_CONFIG', response.data)
        // console.log( db_block.data);
        return response.data
      })
    },
  },
  modules: {
  }
})
