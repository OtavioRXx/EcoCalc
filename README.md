# EcoCalc
EcoCalc é um projeto escolar do curso de Desenvolvimento de Sistemas, criado para as matérias de Programação Web II e Banco de Dados I. Ele calcula a pegada de carbono do usuário, exibe dados ambientais e inclui uma área para doações simuladas voltadas à compensação de CO₂.

🌿 EcoCalc — Calculadora de Pegada de Carbono

Projeto escolar desenvolvido para as disciplinas Programação Web II e Banco de Dados I, do curso Desenvolvimento de Sistemas.

📌 Sobre o projeto

O EcoCalc é uma ferramenta simples e visual que permite ao usuário calcular sua pegada de carbono semanal, compará-la com médias mundiais e receber dicas personalizadas para reduzir suas emissões.
O sistema também apresenta dados sobre fontes de energia, principais países emissores e gráficos dinâmicos.
Como parte adicional do projeto, foi criada uma página de doações simuladas, permitindo que o usuário contribua simbolicamente para ações de compensação ambiental (sem destino real, pois trata-se de um projeto acadêmico).

🚀 Funcionalidades
- ✏️ Calculadora de pegada de carbono
- 📊 Gráficos automáticos (Chart.js)
- 🌎 Ranking dos 10 países que mais emitem CO₂
- ⚡ Cards informativos sobre fontes de energia
- 💡 Dicas personalizadas conforme o resultado
- 💾 Registro de histórico no banco de dados (MySQL)
- 🎁 Página de doação simulada com armazenamento no banco
- 🎨 Layout responsivo e estilizado
🧱 Tecnologias utilizadas
- HTML5
- CSS3
- JavaScript (manipulação do DOM + cálculos)
- Chart.js (gráficos)
- PHP (backend, gravação e leitura)
- MySQL (banco de dados)
- XAMPP (ambiente de desenvolvimento)

🗄️ Banco de Dados

O projeto utiliza duas tabelas:
- historico_calculos – registra os cálculos da calculadora
- pagamento – armazena as doações simuladas
Scripts SQL estão incluídos no repositório.

📁 Estrutura do projeto
/EcoCalc
│ index.html
│ sobre.html
│ doacoes.html
│ style.css
│ javascript.js
│ pagamento.js
│ save.php
│ carregar_historico.php
│ salvar_pagamento.php
│ conexao.php
└─ /imagens

👥 Equipe

Projeto desenvolvido pelos alunos Otávio Franco Rodrigues e Saimon Eduardo Araujo Conceição do 2º Desenvolvimento de Sistemas, com foco em aplicar conhecimentos de PW II e BD I.
