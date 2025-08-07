<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard'
  })

  const router = useRouter();
  const navigation = (link: string) => {
    router.push('/dashboard/candidato/123/meu-perfil/editar')
  }

  // Dados fictícios do candidato
  const candidato = {
    nome: 'Carlos Alberto Silva',
    dataNascimento: '15/03/1985',
    idade: 40,
    estadoCivil: 'Solteiro',
    endereco: 'Rua das Flores, 123, São Paulo - SP',
    email: 'carlos.silva@email.com',
    telefone: '(11) 98765-4321',
    sobre: `Profissional dedicado com mais de 10 anos de experiência na área de desenvolvimento de software, apaixonado por inovação e tecnologia.`,
    experiencias: [
      'Desenvolvedor Front-end na Tech Solutions (2018 - 2024)',
      'Analista de Sistemas na Inova Corp (2014 - 2018)',
    ],
    idiomas: [
      { nome: 'Inglês', nivel: 'Intermediário' },
      { nome: 'Espanhol', nivel: 'Básico' }
    ]
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="">Perfil do candidato</span>
        <span class="text-caption font-weight-regular">Confira e atualize seus dados pessoais</span>
      </div>
    </v-col>
  </v-row>
  
  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="mt-4">
      <div class="d-flex">
        <v-btn
          @click="navigation('editar')"
          color="deep-purple-accent-4"
          text="Editar perfil"
          variant="flat"
        />
      </div>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Dados pessoais</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Nome:</span>
                <span class="text-body-2 ml-2">{{ candidato.nome }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Data de nascimento:</span>
                <span class="text-body-2 ml-2">{{ candidato.dataNascimento }} ({{ candidato.idade }} anos)</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Estado civil:</span>
                <span class="text-body-2 ml-2">{{ candidato.estadoCivil }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Endereço:</span>
                <span class="text-body-2 ml-2">{{ candidato.endereco }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">E-mail:</span>
                <span class="text-body-2 ml-2">{{ candidato.email }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Telefone:</span>
                <span class="text-body-2 ml-2">{{ candidato.telefone }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Sobre mim</v-list-item-title>
                <span class="text-body-2">
                  {{ candidato.sobre }}
                </span>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Experiências profissionais</v-list-item-title>
                <div class="d-flex flex-column">
                  <span 
                    v-for="(exp, index) in candidato.experiencias" 
                    :key="index" 
                    class="text-body-2"
                  >
                    • {{ exp }}
                  </span>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Idiomas</v-list-item-title>
                <div class="d-flex flex-wrap">
                  <v-chip
                    v-for="(idioma, idx) in candidato.idiomas"
                    :key="idx"
                    class="mr-2 my-1 d-flex align-center"
                    label
                    color="accent"
                    variant="flat"
                  >
                    <span>{{ idioma.nome }}</span>
                    <span class="ml-1 text-caption">({{ idioma.nivel.toLowerCase() }})</span>
                  </v-chip>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
/* Seu estilo opcional aqui */
</style>
