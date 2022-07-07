<template>
    <div class="indigo lighten-5">
        <div class="d-flex justify-space=left">
        <v-card
            min-height="100vh"
            min-width="256px"
            style="margin-right: 30px"
        >
            <v-navigation-drawer 
                absolute
                permanent
                right
            >
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title class="text-h6">
                    Мониторинг Центр
                </v-list-item-title>
                <v-list-item-subtitle>
                    TERRASOFT
                </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list
                dense
                nav
            >
                <v-list-item
                v-for="item in items"
                :key="item.title"
                link
                :to="item.to"
                active-class=""
                >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-list>
            </v-navigation-drawer>
        </v-card>
        <router-view></router-view>
        </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        items: [
          { title: 'Дашборд', icon: 'mdi-view-dashboard', to: '/' },
          { title: 'Конфигурация', icon: 'mdi-cog', to: '/config' },
          { title: 'Описание', icon: 'mdi-help-box', to: '/about'},
        ],
        right: null,
      }
    },
  }
</script>