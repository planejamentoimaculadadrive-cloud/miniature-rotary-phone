/**
 * SISTEMA DE GESTÃO ESCOLAR - BACKEND (SERVIDOR)
 * Este código processa o salvamento na planilha e a busca de dados da BNCC.
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();
const SH_PLANEJAMENTOS = SS.getSheetByName("PLANEJAMENTOS"); 
const SH_REFERENCIAS = SS.getSheetByName("REFERENCIAS");   
const SH_CONFIG = SS.getSheetByName("CONFIG");             

// Função para renderizar a página principal (index.html)
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Portal Docente - Planejamento')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Busca as listas de Escolas, Turmas e Referências BNCC da planilha
function getDadosIniciais() {
  const config = SH_CONFIG.getDataRange().getValues();
  const referencias = SH_REFERENCIAS.getDataRange().getValues();
  
  return {
    escolas: config.slice(1).map(r => r[0]).filter(Boolean),
    bimestres: config.slice(1).map(r => r[1]).filter(Boolean),
    turnos: config.slice(1).map(r => r[2]).filter(Boolean),
    turmas: config.slice(1).map(r => r[3]).filter(Boolean),
    referencias: referencias
  };
}

// Lista os nomes dos docentes para o campo de Login
function getNomesDocentes() {
  const dados = SH_CONFIG.getRange("E2:E" + SH_CONFIG.getLastRow()).getValues();
  return dados.flat().filter(Boolean).sort();
}

// Valida as credenciais do professor
function verificarLoginDocente(nome, senha) {
  const dados = SH_CONFIG.getRange("E2:F" + SH_CONFIG.getLastRow()).getValues();
  for (let i = 0; i < dados.length; i++) {
    if (dados[i][0] === nome && dados[i][1].toString() === senha.toString()) {
      return { status: "sucesso", nome: nome };
    }
  }
  return { status: "erro" };
}

// Salva um novo registro ou atualiza um existente
function salvarPlanejamento(d) {
  const linhaDados = [
    d.escola, d.docente, d.turno, d.turma, d.bimestre, 
    d.data, d.aulas, d.area, d.ano, d.pratica, 
    d.objeto, d.habilidade, d.tema, d.metodo
  ];

  if (d.linhaEdit) {
    SH_PLANEJAMENTOS.getRange(parseInt(d.linhaEdit), 1, 1, linhaDados.length).setValues([linhaDados]);
    return "Editado";
  } else {
    SH_PLANEJAMENTOS.appendRow(linhaDados);
    return "Salvo";
  }
}

// Recupera os planos apenas do professor que está logado
function getRelatorioDocente(nomeProfessor) {
  const dados = SH_PLANEJAMENTOS.getDataRange().getValues();
  const cabecalho = dados.shift();
  let resultados = [];

  dados.forEach((linha, index) => {
    if (linha[1] === nomeProfessor) {
      resultados.push({
        linha: index + 2, 
        colunas: linha
      });
    }
  });

  return resultados;
}

// Remove um registro da planilha
function excluirRegistro(linha) {
  SH_PLANEJAMENTOS.deleteRow(linha);
  return true;
}
