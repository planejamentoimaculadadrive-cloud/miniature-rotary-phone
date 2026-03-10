# 🍎 Portal Docente - Gestão de Planos de Aula (BNCC)

Este projeto é um sistema web completo desenvolvido para facilitar a rotina de professores na elaboração de planejamentos de aula. O sistema é integrado diretamente com o Google Planilhas, servindo como um banco de dados dinâmico.

## 🚀 Funcionalidades
- **Login Personalizado:** Acesso restrito via aba `CADASTRO_DOCENTE`.
- **Filtros Inteligentes:** Seleção de habilidades BNCC baseada na disciplina e série.
- **Gestão Completa (CRUD):** Criar, Ler, Editar e Excluir planos de aula.
- **Exportação em PDF:** Gera um documento formatado para impressão com o logotipo da escola correspondente.
- **Painel de Resultados:** Gráficos e contadores de aulas por docente/escola.

## 🛠️ Tecnologias Utilizadas
- **Linguagem:** JavaScript (Google Apps Script)
- **Frontend:** HTML5, CSS3 (Bootstrap-like design)
- **Backend:** Google Apps Script API
- **Banco de Dados:** Google Sheets

## 📂 Estrutura da Planilha
Para o funcionamento correto, a planilha deve conter as seguintes abas:
1. `CADASTRO_DOCENTE`: Controle de usuários e senhas.
2. `CADASTRO_ESCOLA`: Listas de escolas, turmas e períodos.
3. `CADASTRO_REFERENCIAS`: Base de dados das habilidades BNCC.
4. `PLANILHA_PRINCIPAL`: Onde todos os planejamentos são armazenados.

## 📝 Autor
Desenvolvido por **Erivaldo Silva**.
