<script setup lang="ts">
</script>

<template>

  <v-dialog
    v-model="dialogExperience"
    max-width="400"
  >
    <v-card
        prepend-icon="mdi-account"
        title="Criar experiência profissional"
      >
        <v-card-text>
          <v-row dense>
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="experience.companyName"
                required
                :counter="10"
                label="Nome da empresa"
                density="compact"
                hide-details
                class="mb-1"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
            >
              <v-text-field
                v-model="experience.dateInitial"
                label="Data inicial"
                readonly
                @click="openDate(`dateInitial`)"
                density="compact"
                hide-details
                class="mb-1"
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
            >
              <v-text-field
                v-model="experience.dateEnd"
                label="Data final"
                readonly
                @click="openDate(`dateEnd`)"
                density="compact"
                hide-details
                class="mb-1"
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
            >
            <v-select
              v-model="experience.period"
              :items="periods"
              label="Périodo"
              hide-details
              density="compact"
              class="mb-1"
            />
            </v-col>

            <v-col
              cols="12"
            >
              <v-textarea
                label="Descrição"
                :model-value="experience.description"
                name="input-7-1"
                variant="filled"
                auto-grow
                hide-details
                density="compact"
                class="mb-1"
              ></v-textarea>
            </v-col>
          </v-row>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Fechar"
            color="error"
            variant="flat"
            @click="clearExperience"
          ></v-btn>

          <v-btn
            color="success"
            :text="`${editingExperienceIndex !== null ? 'Salvar' : 'Adicionar'}`"
            variant="flat"
            @click="addExperience"
          ></v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
</style>
