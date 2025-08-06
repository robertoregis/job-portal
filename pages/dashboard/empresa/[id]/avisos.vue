<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })
  const items = [
    { id: 1, date: '12h30 12/09/2025', headline: 'Brunch this weekend?', subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`, title: 'Ali Connors' },
    { id: 2, date: '2 hr', headline: 'Summer BBQ', subtitle: `Wish I could come, but I'm out of town this weekend.`, title: 'me, Scrott, Jennifer' },
    { id: 3, date: '2 hr', headline: 'Summer BBQ', subtitle: `Wish I could come, but I'm out of town this weekend.`, title: 'me, Scrott, Jennifer' },
    { id: 4, date: '2 hr', headline: 'Summer BBQ', subtitle: `Wish I could come, but I'm out of town this weekend.`, title: 'me, Scrott, Jennifer' },
    { id: 5, date: '2 hr', headline: 'Summer BBQ', subtitle: `Wish I could come, but I'm out of town this weekend.`, title: 'me, Scrott, Jennifer' },
    { id: 6, date: '2 hr', headline: 'Summer BBQ', subtitle: `Wish I could come, but I'm out of town this weekend.`, title: 'me, Scrott, Jennifer' },
  ]

  const selected = shallowRef([2])
</script>

<template>
  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-secondary">Avisos</v-list-subheader>
            <template
              v-for="(item, index) in items"
              :key="item.id"
            >
              <v-list-item class="py-3">
                <v-list-item-title class="text-caption font-weight-bold">
                  {{ item.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-body-2">
                  {{ item.subtitle }}
                </v-list-item-subtitle>

                <template v-slot:append="{ isSelected }">
                  <v-list-item-action class="flex-column align-end">
                    <small class="mb-4 opacity-60">{{ item.date }}</small>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider v-if="index < items.length - 1"></v-divider>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>

</style>