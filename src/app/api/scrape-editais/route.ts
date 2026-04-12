import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const TERMOS = [
  'processo seletivo simplificado dentista 2026',
  'PSS odontologia edital 2026',
  'processo seletivo simplificado cirurgião dentista 2026',
  'contratação temporária dentista prefeitura 2026',
  'edital PSS saúde bucal 2026',
  'processo seletivo simplificado odontólogo 2026',
  'seleção pública simplificada cirurgião-dentista 2026',
  'edital dentista ESF PSF 2026',
  'processo seletivo temporário odontologia 2026',
  'PSS dentista prefeitura municipal 2026',
]

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const todosResultados: unknown[] = []

  for (const termo of TERMOS) {
    try {
      const url =
        'https://www.googleapis.com/customsearch/v1?key=' +
        process.env.GOOGLE_SEARCH_API_KEY +
        '&cx=' +
        process.env.GOOGLE_SEARCH_CX +
        '&q=' +
        encodeURIComponent(termo) +
        '&num=10&dateRestrict=m1'
      const resp = await fetch(url)
      const data = await resp.json()
      if (!data.items || data.items.length === 0) continue

      const texto = data.items
        .map(
          (item: { title: string; link: string; snippet: string; displayLink: string }, i: number) =>
            '[' +
            (i + 1) +
            '] Título: ' +
            item.title +
            '\nLink: ' +
            item.link +
            '\nResumo: ' +
            item.snippet +
            '\nFonte: ' +
            item.displayLink,
        )
        .join('\n---\n')

      const result = await model.generateContent(
        'Analise estes resultados de busca sobre processos seletivos simplificados (PSS) para odontologia no Brasil. Para CADA resultado que seja realmente um PSS de odontologia (ignore concursos efetivos e notícias), extraia dados estruturados. Responda APENAS com JSON array. Campos: titulo_edital, cargo, regiao (Norte/Nordeste/Centro-Oeste/Sudeste/Sul/Distrito Federal), estado, sigla_estado, municipio, habitantes_municipio (null), orgao, esfera (Municipal/Estadual/Federal), numero_vagas (1 se não informado), cadastro_reserva (false), salario (null), carga_horaria (null), requisitos (null), cro_obrigatorio (true), taxa_inscricao (0), data_inicio_inscricao (null), data_fim_inscricao (null), data_inicio_processo (null), data_fim_processo (null), status (Aberto/Em breve/Encerrado), etapas ([]), observacoes, link_edital, link_publicacao, link_orgao, fonte, hash_unico (usar URL como id). Retorne [] se nenhum for PSS.\n\nResultados:\n' +
          texto,
      )

      const resposta = result.response.text().replace(/```json|```/g, '').trim()
      try {
        const editais = JSON.parse(resposta)
        if (Array.isArray(editais)) todosResultados.push(...editais)
      } catch (e) {
        console.error('Parse error:', e)
      }

      await new Promise((r) => setTimeout(r, 500))
    } catch (e) {
      console.error('Erro:', termo, e)
    }
  }

  if (todosResultados.length > 0) {
    await supabase.from('editais_pss').upsert(todosResultados, { onConflict: 'hash_unico', ignoreDuplicates: true })
  }

  return NextResponse.json({ success: true, total: todosResultados.length, editais: todosResultados })
}
