import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { defineEventHandler } from "h3";
import supabase from "@/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = getRouterParam(event, 'id')
  if (!id) throw new Error("ID do candidato é obrigatório");

  // Busca no Supabase
  const { data: candidate, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !candidate) {
    event.node.res.statusCode = 404;
    return event.node.res.end("Candidato não encontrado");
  }

  let browser;
  try {
    if (process.env.VERCEL) {
      browser = await puppeteer.launch({
        args: [...chromium.args],
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });
    } else {
      const puppeteerLocal = await import("puppeteer");
      browser = await puppeteerLocal.launch({ headless: true });
    }

    const page = await browser.newPage();

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .section { margin-bottom: 30px; }
            .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
            .candidate { display: flex; align-items: center; margin-bottom: 30px; }
            .candidate img { width: 68px; height: 68px; object-fit: cover; border-radius: 50%; margin-right: 20px; }
            ul { padding-left: 20px; margin: 0; }
          </style>
        </head>
        <body>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
            <h1 style="margin:0;">Relatório do Candidato</h1>
            <img src="https://nuxt.com/logo.svg" alt="Logo" style="width:100px;">
          </div>

          <div class="candidate">
            <img src="${candidate.image_url}" alt="Foto do candidato" />
            <h2>${candidate.name}</h2>
          </div>

          <div class="section">
            <h3>Informações Pessoais</h3>
            <div><strong>Email:</strong> ${candidate.email || ''}</div>
            <div><strong>Telefone:</strong> ${candidate.phone || ''}</div>
            <div><strong>Status:</strong> ${candidate.marital_status || ''}</div>
            <div><strong>Endereço:</strong> ${candidate.city || ''} - ${candidate.states || ''}</div>
            <div><strong>Data de Nascimento:</strong> ${candidate.birth_date || ''}</div>
          </div>

          <div class="section">
            <h3>Escolaridade</h3>
            <ul>
              ${(candidate.educations || []).map((e:any) => `<li>${e}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <h3>Experiência Profissional</h3>
            <ul>
              ${(candidate.experiences || []).map((e:any) => `<li>${e}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <h3>Idiomas</h3>
            <ul>
              ${(candidate.languages || []).map((e:any) => `<li>${e}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <h3>Áreas de Interesse</h3>
            <ul>
              ${(candidate.areas_of_interest || []).map((e:any) => `<li>${e}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <h3>Tipos de vagas que procuro</h3>
            <ul>
              ${(candidate.job_types || []).map((e:any) => `<li>${e}</li>`).join("")}
            </ul>
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });

    const res = event.node.res;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${candidate.name}-relatorio.pdf`);
    res.setHeader("Content-Length", pdf.length);
    res.end(pdf);

  } catch (err) {
    console.error(err);
    event.node.res.statusCode = 500;
    event.node.res.end("Erro ao gerar PDF");
  } finally {
    if (browser) await browser.close();
  }
});


