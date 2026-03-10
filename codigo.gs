function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
    .setTitle("Portal Docente")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// BUSCA PROFESSORES NA ABA CADASTRO_DOCENTE
function getNomesDocentes() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName("CADASTRO_DOCENTE");
    return aba.getRange("A2:A" + aba.getLastRow()).getValues().flat().filter(String);
  } catch (e) { return ["Erro ao carregar"]; }
}

// VERIFICA LOGIN NA ABA CADASTRO_DOCENTE
function verificarLoginDocente(nome, senha) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheetByName("CADASTRO_DOCENTE");
  var dados = aba.getDataRange().getValues();
  for (var i = 1; i < dados.length; i++) {
    if (dados[i][0].toString().trim() == nome.trim() && dados[i][1].toString().trim() == senha.trim()) {
      return { status: "sucesso", nome: nome };
    }
  }
  return { status: "erro" };
}

// BUSCA LISTAS NAS ABAS CADASTRO_ESCOLA E CADASTRO_REFERENCIAS
function getDadosIniciais() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var abaEscola = ss.getSheetByName("CADASTRO_ESCOLA");
  var abaRef = ss.getSheetByName("CADASTRO_REFERENCIAS");
  
  var dadosEscola = abaEscola.getDataRange().getValues();
  var dadosRef = abaRef.getDataRange().getValues();
  
  return {
    escolas: [...new Set(dadosEscola.slice(1).map(r => r[0]))].filter(String),
    bimestres: [...new Set(dadosEscola.slice(1).map(r => r[1]))].filter(String),
    turnos: [...new Set(dadosEscola.slice(1).map(r => r[2]))].filter(String),
    turmas: [...new Set(dadosEscola.slice(1).map(r => r[3]))].filter(String),
    referencias: dadosRef
  };
}

// SALVA OU EDITA NA PLANILHA_PRINCIPAL
function salvarPlanejamento(obj) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName("PLANILHA_PRINCIPAL");
    var dadosSalvar = [obj.escola, obj.docente, obj.turno, obj.turma, obj.bimestre, obj.data, obj.aulas, obj.area, obj.ano, obj.pratica, obj.objeto, obj.habilidade, obj.tema, obj.metodo];
    
    if (obj.linhaEdit && obj.linhaEdit !== "") {
      aba.getRange(parseInt(obj.linhaEdit), 1, 1, 14).setValues([dadosSalvar]);
      return "Editado";
    } else {
      aba.appendRow(dadosSalvar);
      return "Sucesso";
    }
  } catch (e) { return "Erro: " + e.toString(); }
}

// GERA RELATÓRIO DA PLANILHA_PRINCIPAL
function getRelatorioDocente(nomeProfessor) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName("PLANILHA_PRINCIPAL");
    var dados = aba.getDataRange().getValues();
    var resultados = [];
    if (dados.length < 2) return [];
    
    for (var i = 1; i < dados.length; i++) {
      if (dados[i][1] && dados[i][1].toString().trim().toUpperCase() === nomeProfessor.trim().toUpperCase()) {
        var linhaF = dados[i].map(function(c) {
          if (c instanceof Date) return Utilities.formatDate(c, "GMT-3", "yyyy-MM-dd");
          return c === null ? "" : c.toString();
        });
        resultados.push({ linha: i + 1, colunas: linhaF });
      }
    }
    return resultados;
  } catch (e) { return { erro: e.toString() }; }
}

// EXCLUI LINHA DA PLANILHA_PRINCIPAL
function excluirRegistro(linha) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.getSheetByName("PLANILHA_PRINCIPAL").deleteRow(linha);
    return "Sucesso";
  } catch (e) { return e.toString(); }
}
