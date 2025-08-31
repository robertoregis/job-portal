<script setup lang="ts">

  definePageMeta({
    layout: 'default' // ou outro nome, conforme os arquivos em layouts/
  })
  useHead({
    title: `Sobre - Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'Saiba mais sobre a Conect One RH e como estamos transformando o recrutamento, unindo empresas e candidatos em um só lugar.'
      }
    ]
  })
  //const content = ref('<p>Conteúdo inicial</p>')
  const loading = ref<boolean>(true)

  const downloadPDF = async () => {
    const body = {
      nome: "João da Silva",
      email: "joao@email.com",
      telefone: "99999-9999"
    };

    try {
      const res = await fetch(`/api/generate/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) return alert("Erro ao gerar PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.log(error);
    }
  };


  onMounted(() => {
    loading.value = false;
  })
</script>

<template>
  <div class="">
    <v-sheet width="100%" class="mt-4 mb-4">
      <v-container>
        <v-row v-if="!loading">
          <v-col cols="12">
            <v-btn text="Criar vaga" variant="flat" class="bg-gradient-primary" @click="downloadPDF()" />
          </v-col>
          <v-col cols="12">
            
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
  <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
  <!-- Cabeçalho com logo -->
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px;">
    <h1 style="margin: 0; font-size: 24px;">Relatório do Candidato</h1>
    <img src="https://nuxt.com/logo.svg" alt="Logo da empresa" style="width: 150px;" />
  </div>

  <!-- Seção do candidato: foto e nome -->
  <div style="display: flex; align-items: center; margin-bottom: 30px;">
    <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Foto do candidato" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin-right: 20px;" />
    <h2 style="margin: 0; font-size: 20px;">Carlos Eduardo Silva</h2>
  </div>

  <!-- Informações pessoais -->
  <div style="margin-bottom: 30px;">
    <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Informações Pessoais</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 20px;">
      <div><strong>Email:</strong> carlos.silva@gmail.com</div>
      <div><strong>Endereço:</strong> São Paulo - SP</div>
      <div><strong>Data de Nascimento:</strong> 15/03/1990</div>
      <div><strong>Telefone:</strong> (11) 91234-5678</div>
    </div>
  </div>

  <!-- Escolaridade -->
  <div style="margin-bottom: 30px;">
    <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Escolaridade</h3>
    <div>
      Bacharel em Administração de Empresas - Universidade de São Paulo (2012-2016)
    </div>
  </div>

  <!-- Experiência Profissional -->
  <div style="margin-bottom: 30px;">
    <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Experiência Profissional</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li>Analista de Marketing - Empresa X (2017-2019)</li>
      <li>Coordenador de Projetos - Empresa Y (2019-2022)</li>
      <li>Gerente de Produto - Empresa Z (2022-atual)</li>
    </ul>
  </div>

  <!-- Idiomas -->
  <div style="margin-bottom: 30px;">
    <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Idiomas</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li>Português (Nativo)</li>
      <li>Inglês (Avançado)</li>
      <li>Espanhol (Intermediário)</li>
    </ul>
  </div>

  <!-- Vagas de Interesse -->
  <div style="margin-bottom: 30px;">
    <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Vagas de Interesse</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li>Gerente de Produto</li>
      <li>Coordenador de Projetos</li>
    </ul>
  </div>

  <!-- Vagas Almejadas -->
  <div>
    <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Vagas Almejadas</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li>Gerente Sênior de Produto</li>
      <li>Diretor de Projetos</li>
    </ul>
  </div>
</div>

</template>

<style lang="scss" scoped>
</style>
