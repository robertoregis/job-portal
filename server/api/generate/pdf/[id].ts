import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { defineEventHandler } from "h3";
import supabase from "@/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const feedbackId = getRouterParam(event, 'id');
  if (!feedbackId) throw new Error("ID do parecer é obrigatório");

  const getFormatDate = (date: string) => {
    if (!date) return ''
    const parts = date.split('-') // ["yyyy", "mm", "dd"]
    if (parts.length !== 3) return date

    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }

  // Busca o feedback com dados da candidatura, candidato e tabelas relacionadas
  const { data: feedback, error: feedbackError } = await supabase
    .from("feedbacks")
    .select(`
      *,
      candidatures!inner(
        candidate: candidates(
          *,
          experiences(*),
          educations(*),
          languages(*),
          soft_skills(*)
        ),
        job: jobs(title)
      )
    `)
    .eq("id", feedbackId)
    .single();

  if (feedbackError || !feedback) {
    event.node.res.statusCode = 404;
    return event.node.res.end("Feedback não encontrado");
  }

  const candidate = feedback.candidatures?.candidate;
  const jobTitle = feedback.candidatures?.job?.title || '';

  // Agora você já tem tudo em `candidate`:
  const experiences = candidate?.experiences || [];
  const educations = candidate?.educations || [];
  const languages = candidate?.languages || [];
  const soft_skills = candidate?.soft_skills || [];

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
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .font-s { font-size: 21px; }
            .font-a { font-size: 18px; }
            .font-b { font-size: 15px; }
            .font-c { font-size: 13px; }
            .font-d { font-size: 11.5px; }
            .font-e { font-size: 10px; }
            .section { margin-bottom: 10px; }
            .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px; }
            .candidate { display: flex; align-items: center; margin-bottom: 10px; }
            .candidate img { width: 52px; height: 52px; object-fit: cover; border-radius: 50%; margin-right: 20px; }
            ul { padding-left: 20px; margin: 0; }
            .feedback { padding: 3px; background: #e1e1e1; }
          </style>
        </head>
        <body>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h1 style="margin:0; font-size: 26px;">Relatório do Candidato</h1>
            <img src="https://uhwfvrjhlhvxyrrlaqna.supabase.co/storage/v1/object/public/jobportal/default/logo-simbolo.png" alt="Logo" style="width:60px;">
          </div>

          <div class="candidate">
            <img src="${candidate.image_url}" alt="Foto do candidato" />
            <h2 class="font-a" >${candidate.name}</h2>
          </div>

          <div class="section">
            <h3 class="font-b">Informações Pessoais</h3>
            
            <div style="display: flex; gap: 20px; margin-bottom: 2px;">
              <div class="font-c"><strong>Email:</strong> ${candidate.email || ''}</div>
              <div class="font-c"><strong>Telefone:</strong> ${candidate.phone || ''}</div>
            </div>
            
            <div style="display: flex; gap: 20px; margin-bottom: 2px;">
              <div class="font-c"><strong>CPF:</strong> ${candidate.cof || ''}</div>
              <div class="font-c"><strong>Estado cívil:</strong> ${candidate.marital_status || ''}</div>
            </div>
            
            <div style="display: flex; gap: 20px;">
              <div class="font-c"><strong>Endereço:</strong> ${candidate.city || ''} - ${candidate.state || ''}</div>
              <div class="font-c"><strong>Data de Nascimento:</strong> ${candidate.birth_date || ''}</div>
            </div>
          </div>

          <div class="section">
            <h3 class="font-b">Sobre</h3>
            <div class="font-c">${candidate.about || ''}</div>
            <h3 class="font-b">Pretensão salarial</h3>
            <div class="font-c">${candidate.salary_expectations || ''}</div>
          </div>

          <div class="section">
            <h3 class="font-b">Experiência Profissional</h3>
            <ul style="padding-left: 0;">
              ${(experiences || []).map((e: any) => `
                <li style="display: flex; flex-direction: column; margin-bottom: 6px;">
                  <span style="font-weight: 700; font-size: 13px;">${e.position}</span>
                  <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
                    <span style="font-size: 12px;">${e.company_name}</span>
                    ${(e.start_date || e.end_date)
                      ? `<span style="font-size: 10px; background-color: #333; color: #fff; padding: 2px 6px; border-radius: 12px;">
                          ${getFormatDate(e.start_date)} - ${getFormatDate(e.end_date)}
                        </span>`
                      : ''}
                  </div>
                </li>
              `).join("")}
            </ul>
          </div>

          <div class="section">
            <h3 class="font-b">Escolaridade</h3>
            <ul style="padding-left: 0;">
              ${(educations || []).map((e: any) => `
                <li style="display: flex; flex-direction: column; margin-bottom: 6px;">
                  <span class="font-c" style="font-weight: 700; margin-right: 5px;">${e.course}</span>
                  <span class="font-d">${e.level}</span>
                </li>
              `).join("")}
            </ul>
          </div>

          <div class="section">
            <h3 class="font-b">Soft Skills</h3>
            <ul class="font-c" style="padding-left: 0;">
              ${(soft_skills || []).map((s: any) => `
                <li style="display: flex; flex-direction: column; margin-bottom: 6px;">
                  <span class="font-c" style="font-weight: 700; margin-right: 5px;">${s.name}</span>
                  <span class="font-d">${s.level}</span>
                </li>
              `).join("")}
            </ul>
          </div>

          <div class="section">
            <h3 class="font-b">Idiomas</h3>
            <ul class="font-c" style="padding-left: 0; display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px;">
              ${(languages || []).map((l:any) => `
                <li style="display: flex; align-items: center; margin-bottom: 6px;">
                  <span class="font-c" style="font-weight: 700; margin-right: 3px;">${l.name}</span>
                  <span class="font-d">(${l.level?.toLowerCase()})</span>
                </li>
              `).join("")}
            </ul>
          </div>

          <div class="section">
            <h3 class="font-b">Áreas de Interesse</h3>
            <ul class="font-c" style="padding-left: 0; display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px;">
              ${(candidate.areas_of_interest || []).map((e:any) => `
                <li style="display: flex; margin-bottom: 6px;">${e}</li>
              `).join("")}
            </ul>
          </div>

          <div class="section">
            <h3 class="font-b">Tipos de vagas que procuro</h3>
            <ul class="font-c" style="padding-left: 0; display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px;">
              ${(candidate.job_types || []).map((e:any) => `
                <li style="display: flex; margin-bottom: 6px;">${e}</li>
              `).join("")}
            </ul>
          </div>

          <div class="section">
            <h3 class="font-b">Parecer</h3>
            <div class="font-c" style="padding: 2px; background: #fcf9f9ff;">
              ${feedback.content}
            </div>
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


