# financial-manager 💰

## Visão Geral do Projeto 📊

Bem-vindo ao **financial-manager**! Este projeto nasceu com o objetivo de simplificar o controle financeiro pessoal, permitindo que você acompanhe seus gastos, gerencie seus saldos e tenha uma visão clara da sua saúde financeira mês a mês.

Atualmente, este repositório contém a **API** do `financial-manager`, desenvolvida utilizando o framework **Next.js**. Esta API é responsável por gerenciar os dados financeiros e fornecer os endpoints necessários para a futura interface do usuário.

Em breve, integraremos um **Frontend robusto construído em React** para oferecer uma experiência completa e intuitiva aos usuários finais.

## Funcionalidades (API) ✨

A API do `financial-manager` foi projetada para ser flexível e escalável, oferecendo as seguintes funcionalidades:

- 👤 **Gestão Completa de Usuários:** Permite o cadastro, visualização e atualização das informações do seu perfil de usuário.
- 🔒 **Autenticação e Autorização Seguras:** Gerencia o processo de login e garante que o acesso aos dados financeiros seja restrito apenas ao usuário autenticado, utilizando tokens (JWT).
- 💵 **Controle de Salário:** Funcionalidades dedicadas para registrar e gerenciar suas entradas de salário.
- 🏦 **Gestão de Contas Bancárias:** Permite cadastrar e administrar as diferentes contas bancárias que você utiliza.
- 💸 **Registro de Ganhos Extras:** Facilita a inclusão de outras fontes de renda além do salário principal.
- 💳 **Gerenciamento Detalhado de Despesas:**
  - **Despesas no Débito:** Registro e controle específico dos gastos realizados com cartão de débito ou em dinheiro.
  - **Despesas no Crédito:** Registro e controle detalhado dos gastos no cartão de crédito, permitindo acompanhar faturas e parcelamentos.
- 📄 **Extratos Bancários e Lançamentos Mensais:** Oferece a capacidade de registrar, visualizar e gerenciar todos os tipos de lançamentos financeiros (receitas, despesas, débitos, créditos) agrupados por mês e ano, funcionando como um extrato financeiro pessoal.
- 📅 **Estrutura de Calendário:** Funcionalidades para criar e organizar a estrutura de meses e anos dentro da aplicação, base para a organização dos dados financeiros.
- ❤️‍🩹 **Verificação de Saúde da API:** Endpoint para verificar o status operacional da API.

## Tecnologias Utilizadas 🛠️

- **Backend:** Next.js (API Routes)
- **Linguagem:** JavaScript com Node.js
- **Banco de Dados:** PostgreSQL
- **ORM/Query Builder:** Prisma
- **Testes Automatizados:** Jest

## Pré-requisitos ✅

Antes de rodar o projeto localmente, certifique-se de ter instalado:

- Node.js
- npm

## Instalação ⚙️

Siga os passos abaixo para configurar e rodar a API localmente:

1.  Clone o repositório:

    git clone [https://github.com/Enric0Mz/financial-manager.git](https://github.com/Enric0Mz/financial-manager.git)

2.  Navegue até o diretório do projeto:
    ```bash
    cd financial-manager
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  **Configure as variáveis de ambiente.** Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.development` (se você tiver um) e preencha com suas configurações. **É crucial configurar corretamente estas variáveis para que a aplicação se conecte ao banco de dados e funcione adequadamente.**

    Aqui estão as variáveis de ambiente necessárias:

    ```dotenv
    # Configurações do Banco de Dados PostgreSQL
    POSTGRES_USER=app_user         # Usuário do banco de dados
    POSTGRES_DB=app              # Nome do banco de dados
    POSTGRES_PASSWORD=app_password # Senha do usuário do banco de dados
    POSTGRES_PORT=5432         # Porta do banco de dados (geralmente 5432 para PostgreSQL)
    POSTGRES_HOST=localhost        # Host do banco de dados (geralmente localhost se rodando localmente ou o nome do serviço/IP)

    # URL de Conexão Completa do Banco de Dados (gerada a partir das variáveis acima)
    # Esta variável é frequentemente usada por ORMs como Prisma ou TypeORM
    DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB

    # URL Base da API
    # Usada para construir URLs completas ou para configurações internas
    BASE_API_URL=http://localhost:3000/api/v1

    # Segredos para Geração e Verificação de Tokens JWT
    # **IMPORTANTE:** Use segredos fortes e únicos em produção. Estes são exemplos.
    ACCESS_TOKEN_SECRET=98732dba6e50b80aaa0b457b58ea58dddf33b6fb830f095c4061f99e11732b78539b5b109f2cd8d7723510bb8b123cc10bd86552dbba3e4f249bd4a81e9f97ca # Segredo para tokens de acesso
    REFRESH_TOKEN_SECRET=6d6602f56666e2a79d41cea573ad8d42dfd19c4018c7e0606f16ce4f7c8216cee0cf8f9386cfa20b6d3cadbc91ebdf53c9a402e34e85cf63c67056c166de384e # Segredo para tokens de refresh
    ```

5.  Configure o banco de dados (rodar migrations, etc.):
    _(Forneça os comandos específicos para configurar seu banco de dados, por exemplo: `npx prisma migrate dev` ou comandos SQL)_

6.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

A API estará rodando em `http://localhost:3000` (ou a porta configurada no seu Next.js).

## Uso da API (Endpoints) 🌐

Esta seção lista alguns dos endpoints mais importantes da API do `financial-manager` para dar uma ideia de como interagir com o sistema. Para a documentação completa e detalhada de todos os endpoints, incluindo parâmetros, modelos de requisição/resposta e códigos de status, por favor, consulte a documentação interativa gerada pelo Swagger (se disponível em um ambiente online) ou rode a API localmente e acesse `http://localhost:3000/api-docs` (ou a rota que você configurou para o Swagger UI).

**Endpoints Principais:**

- 🔑 **Usuários e Autenticação:**

  - `POST /api/v1/user` - **Criar um novo usuário.**
  - `GET /api/v1/user` - Obter os dados do usuário autenticado.
  - `PUT /api/v1/user` - Atualizar os dados do usuário autenticado.
  - `POST /api/v1/auth` - **Autenticar um usuário (login).**
  - `POST /api/v1/auth/refresh` - Renovar o token de acesso utilizando o token de refresh.
  - `DELETE /api/v1/auth` - Fazer logout e invalidar tokens.

- 💵 **Salário:**

  - `POST /api/v1/salary` - Registrar o salário.
  - `PUT /api/v1/salary/{salaryId}` - Atualizar um registro de salário existente.
  - `GET /api/v1/salary` - Obter o último salário registrado.

- 🏦 **Contas Bancárias:**

  - `POST /api/v1/bank` - Cadastrar uma nova conta bancária.
  - `GET /api/v1/bank` - Listar todas as contas bancárias cadastradas.
  - `PUT /api/v1/bank/{bankId}` - Atualizar dados de uma conta bancária.
  - `DELETE /api/v1/bank/{bankId}` - Remover uma conta bancária.

- 📄 **Lançamentos Financeiros (Extrato/Movimentações):**

  - `POST /api/v1/bank-statement` - **Criar um novo lançamento financeiro**
  - `GET /api/v1/bank-statement/fetch/{year}/{monthNumber}` - **Listar os lançamentos financeiros para um mês e ano específicos.**
  - `GET /api/v1/bank-statement/{yearNumber}` - Obter o extrato financeiro geral para um determinado ano.
  - `DELETE /api/v1/bank-statement/{bankStatementId}` - Remover um lançamento financeiro.

- 💸 **Rendas Extras:**

  - `POST /api/v1/extra-income/{bankStatementId}` - Adicionar uma renda extra associada a um lançamento/extrato.
  - `GET /api/v1/extra-income/{bankStatementId}` - Listar rendas extras associadas a um lançamento/extrato.
  - `PATCH /api/v1/extra-income/{extraIncomeId}` - Atualizar uma renda extra.
  - `DELETE /api/v1/extra-income/{extraIncomeId}` - Remover uma renda extra.

- 💳 **Despesas (Crédito e Débito):**
  - `POST /api/v1/expense/credit/{bankStatementId}` - **Registrar uma despesa no crédito.**
  - `GET /api/v1/expense/credit/{expenseId}` - Obter detalhes de uma despesa no crédito.
  - `PATCH /api/v1/expense/credit/{expenseId}` - Atualizar uma despesa no crédito.
  - `DELETE /api/v1/expense/credit/{expenseId}` - Remover uma despesa no crédito.
  - `POST /api/v1/expense/debit/{bankStatementId}` - **Registrar uma despesa no débito.**
  - `GET /api/v1/expense/debit/{expenseId}` - Obter detalhes de uma despesa no débito.
  - `PATCH /api/v1/expense/debit/{expenseId}` - Atualizar uma despesa no débito. _(Corrigido: Typo em "DEBIT")_
  - `DELETE /api/v1/expense/debit/{expenseId}` - Remover uma despesa no débito.

## Melhorias Futuras 💡

O projeto `financial-manager` está em desenvolvimento contínuo e há diversas ideias para expandir suas funcionalidades e melhorar a experiência do usuário. Algumas das melhorias planejadas incluem:

- 🏷️ **Sistema de Classificação de Gastos Avançado:** Implementar um sistema mais robusto para categorizar despesas, permitindo subcategorias e tags personalizadas para uma análise financeira ainda mais granular.
- 🔁 **Gerenciamento de Compras Recorrentes e Parceladas:** Adicionar funcionalidades específicas para lidar com despesas que se repetem automaticamente (assinaturas, aluguéis) e compras parceladas no cartão de crédito, facilitando o acompanhamento dessas obrigações ao longo do tempo.
- 🔍 **Filtro e Análise de Meses com Maiores Gastos:** Desenvolver ferramentas de visualização e filtro para identificar rapidamente os meses com os maiores volumes de despesas, ajudando o usuário a entender seus padrões de consumo e identificar áreas para otimização.

- 🔒 **Criptografia de Dados Sensíveis:** Implementar medidas de segurança adicionais, como a criptografia de dados sensíveis armazenados, para garantir a privacidade e proteção das informações financeiras dos usuários.

- 💻 **Frontend em React:** Concluir a implementação da interface do usuário em React para oferecer uma experiência completa e amigável para gerenciar as finanças.
- 📈 **Relatórios e Gráficos:** Gerar relatórios visuais (gráficos de barras, pizza, etc.) para apresentar um resumo da situação financeira, distribuição de gastos por categoria, evolução do saldo, entre outros insights.
- 🔔 **Notificações e Alertas:** Implementar um sistema de notificações para alertar sobre vencimento de contas, atingimento de limites de gastos em categorias, etc.

## Frontend 🖥️

Como mencionado, um frontend em React será desenvolvido e integrado a esta API futuramente.

## Como Contribuir 👋

Se você tiver interesse em contribuir com o projeto, siga os passos abaixo:

1.  Faça um fork deste repositório.
2.  Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`).
3.  Faça suas alterações e commite-as (`npm run commit 'feat: Adiciona nova funcionalidade X'`).
4.  Envie para o seu fork (`git push origin feature/nome-da-feature`).
5.  Abra um Pull Request explicando suas mudanças.

Por favor, certifique-se de que seu código siga os padrões do projeto e que os testes estejam passando.

## Contato 📧

Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para abrir uma issue neste repositório ou entrar em contato através do meu perfil do GitHub ou email.

---

## Autor ✍️

- **Enrico Marquez**
- **enricovmarquezz@gmail.com**

## Licença 📄

Este projeto é licenciado sob os termos da Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
