<!-- layouts/default.vue -->
<script setup lang="ts">
  import { useShow } from '@/stores/show';
  const show = useShow();
</script>
<template>
  <v-app>
    <v-layout class="">
      
      <LayoutNavigation />

      <v-main class="overflow-y-auto" style="height: 100vh;">
        <div class="pa-4">
          <v-container>
            <v-row no-gutters>
              <!--<v-col cols="12">
                <div class="d-flex flex-column">
                  <span>Olá, Nome do candidato!</span>
                  <span class="text-caption font-weight-bold">Seja bem vindo ao seu dashboard</span>
                </div>
              </v-col>-->
              <v-col cols="12" v-if="$vuetify.display.smAndDown">
                <v-app-bar flat absolute>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon="mdi-menu"
                    variant="text"
                    @click="show.setNavigation(!show.navigation)"
                  ></v-btn>
                </v-app-bar>
              </v-col>

              <v-col cols="12">
                <slot/>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-main>
    </v-layout>
    <!--<GlobalSnackbar />-->
    <GlobalOverlay />
  </v-app>
</template>
