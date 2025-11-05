# Galinheiro App

Este projeto é uma aplicação React chamada "galinheiro-app", que consome dados do Supabase e segue a Arquitetura Limpa. A aplicação é projetada para gerenciar uma tabela de Galinhas, permitindo listar, criar, atualizar e remover registros.

## Estrutura do Projeto

A estrutura do projeto é organizada da seguinte forma:

```
galinheiro-app
├── index.html          # Arquivo HTML principal
├── package.json        # Dependências e configurações do npm
├── vite.config.js      # Configuração do Vite
├── .gitignore          # Arquivos e pastas a serem ignorados pelo Git
├── .env.example        # Exemplo de variáveis de ambiente
├── README.md           # Documentação do projeto
├── public
│   └── robots.txt      # Instruções para motores de busca
└── src
    ├── main.jsx        # Ponto de entrada da aplicação
    ├── App.jsx         # Componente principal da aplicação
    ├── styles
    │   └── globals.css  # Estilos globais
    ├── presentation
    │   ├── components
    │   │   ├── GalinhasList.jsx  # Componente para exibir lista de galinhas
    │   │   └── GalinhaForm.jsx    # Componente para formulário de nova galinha
    │   ├── pages
    │   │   └── GalinhasPage.jsx   # Página que contém a lista e o formulário
    │   └── routes.jsx              # Definição das rotas da aplicação
    ├── application
    │   ├── use-cases
    │   │   ├── listarGalinhas.js   # Lógica para listar galinhas
    │   │   ├── criarGalinha.js      # Lógica para criar nova galinha
    │   │   ├── atualizarGalinha.js   # Lógica para atualizar galinha
    │   │   └── removerGalinha.js     # Lógica para remover galinha
    │   └── services
        │       ├── galinhaInjector.js    # Injeção de dependência para Galinhas
        │       ├── registroOvoInjector.js # Injeção de dependência para Registros de Ovos
        │       └── tratamentoInjector.js  # Injeção de dependência para Tratamentos
    ├── domain
    │   ├── entities
    │   │   └── Galinha.js            # Definição da entidade Galinha
    │   └── repositories
        │       ├── GalinhaRepository.js   # Interface do repositório para Galinha
        │       ├── RegistroOvoRepository.js # Interface do repositório para Registros de Ovos
        │       └── TratamentoRepository.js  # Interface do repositório para Tratamentos
    ├── infrastructure
    │   ├── supabase
    │   │   ├── client.js              # Inicialização do cliente Supabase
        │   │   ├── GalinhaRepositorySupabase.js # Implementação do repositório Galinha
        │   │   ├── RegistroOvoRepositorySupabase.js # Implementação do repositório Registros de Ovos
        │   │   └── TratamentoRepositorySupabase.js  # Implementação do repositório Tratamentos
    └── utils
        └── index.js                   # Funções utilitárias
```

## Instalação

Para instalar as dependências do projeto, execute:

```
npm install
```

## Configuração do Supabase

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Substitua `your_supabase_url` e `your_supabase_anon_key` pelos valores correspondentes da sua conta Supabase.

## Executando a Aplicação

Para iniciar a aplicação em modo de desenvolvimento, execute:

```
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Para isso, faça um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.