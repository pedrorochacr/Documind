# Documind

Documind é uma plataforma **full-stack de gerenciamento de documentos** projetada para simplificar o armazenamento, organização e acesso a arquivos em nuvem.

Diferente de soluções genéricas, o Documind foca em uma interface minimalista e na categorização inteligente por grupos, permitindo que usuários e pequenas equipes centralizem seus ativos digitais com segurança por meio de uma arquitetura robusta baseada em **Node.js** e **React**.

> A agilidade do Google Drive com o controle de uma solução personalizada.

---

## Tecnologias Utilizadas

### Frontend
- React
- Vite
- JavaScript / TypeScript
- CSS / Tailwind (caso utilize)

### Backend
- Node.js
- Express

### Banco de Dados
- (Adicionar aqui: MongoDB, PostgreSQL, etc.)

### Outras Ferramentas
- ESLint
- Git/GitHub

---

## Funcionalidades

- Autenticação de usuários (Login e Cadastro)
- Upload de documentos
- Organização por grupos/categorias
- Busca e filtragem de arquivos
- Visualização de metadados
- Download de arquivos
- Exclusão de documentos
- Dashboard com estatísticas de armazenamento

---

## Estrutura das Telas

## 1. Tela de Autenticação (Login/Cadastro)

Interface limpa e intuitiva para entrada de usuários.

### Recursos:
- Login
- Cadastro
- Validação de campos
- Feedback de erro em tempo real

---

## 2. Dashboard Principal (Home)

Visão geral da plataforma com acesso rápido às principais funcionalidades.

### Exibe:
- Arquivos recentes
- Estatísticas de armazenamento
- Grupos de documentos
- Atalhos rápidos

---

## 3. Explorador de Arquivos

Tela principal para gerenciamento dos documentos.

### Funcionalidades:
- Visualização de arquivos e pastas
- Upload via drag-and-drop
- Barra de busca
- Filtros por tipo:
  - PDF
  - Imagens
  - Documentos
  - Outros formatos

---

## 4. Gerenciador de Grupos

Área dedicada à organização lógica dos arquivos.

### Permite:
- Criar grupos
- Editar grupos
- Excluir grupos
- Categorizar documentos

---

## 5. Visualizador / Detalhes do Documento

Exibição detalhada de informações do arquivo através de drawer lateral ou modal.

### Informações:
- Nome
- Tipo
- Tamanho
- Data de upload

### Ações:
- Download
- Exclusão

---

## Instalação

### Clone o repositório

```bash
git clone <url-do-repositorio>
```

### Acesse a pasta

```bash
cd Documind
```
```bash
cd frontend
```

### Instale as dependências

```bash
npm install
```

### Execute o projeto

```bash
npm run dev
```

O projeto estará disponível em:

```bash
http://localhost:5173
```

---

## Estrutura do Projeto

```bash
Documind/
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── context/
│   └── assets/
├── public/
└── package.json
```

---

## Objetivo do Projeto

O Documind foi desenvolvido com o objetivo de oferecer uma solução prática para gerenciamento de documentos digitais, priorizando:

- Simplicidade
- Organização
- Performance
- Escalabilidade
- Segurança

---

## Melhorias Futuras

- Compartilhamento de arquivos
- Controle de permissões
- Versionamento de documentos
- Notificações em tempo real
- Integração com armazenamento externo
- Preview de arquivos no navegador

---