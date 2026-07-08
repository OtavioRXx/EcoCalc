# 🌿 EcoCalc — Calculadora de Pegada de Carbono

O **EcoCalc** é um projeto escolar desenvolvido para as disciplinas de **Programação Web II** e **Banco de Dados I**, do curso **Desenvolvimento de Sistemas**.

O objetivo do sistema é conscientizar os usuários sobre seu impacto ambiental por meio do cálculo da pegada de carbono, exibindo informações educativas, gráficos comparativos e um sistema de doações simuladas.

---

## 📌 Sobre o projeto

O EcoCalc permite que o usuário:

- Calcule sua pegada de carbono semanal;
- Compare seu resultado com médias nacionais e internacionais;
- Visualize gráficos interativos;
- Conheça as principais fontes de emissão de CO₂;
- Consulte os países que mais emitem gases do efeito estufa;
- Receba dicas personalizadas para reduzir sua pegada de carbono;
- Registre o histórico de cálculos no banco de dados;
- Realize doações simuladas para fins acadêmicos.

> **Observação:** A funcionalidade de doações é apenas demonstrativa e não realiza nenhuma transação financeira.

---

## 🚀 Funcionalidades

- ✏️ Calculadora de pegada de carbono
- 📊 Gráficos dinâmicos utilizando Chart.js
- 🌎 Ranking dos 10 países que mais emitem CO₂
- ⚡ Slider com informações sobre fontes de energia
- 💡 Dicas personalizadas conforme os hábitos do usuário
- 💾 Histórico de cálculos armazenado em MySQL
- 🎁 Página de doações simuladas
- 🎨 Interface responsiva

---

## 🧱 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Chart.js
- PHP
- MySQL
- XAMPP

---

## 🗄️ Banco de Dados

O projeto utiliza duas tabelas principais:

- **historico_calculos** → Armazena os resultados dos cálculos realizados.
- **pagamento** → Armazena as doações simuladas.

Os scripts SQL estão disponíveis na pasta **database**.

---

## 📁 Estrutura do projeto

```text
/EcoCalc
│
├── README.md
├── index.html
├── sobre.html
│
├── /src
│   ├── /frontend
│   │   ├── doacoes.html
│   │   ├── index.html
│   │   └── sobre.html
│   │
│   ├── /js
│   │   ├── pagamento.js
│   │   └── javascript.js
│   │
│   ├── /styles
│   │   └── style.css
│   │
│   ├── /backend
│   │   ├── conexao.php
│   │   ├── save.php
│   │   ├── salvar_pagamento.php
│   │   └── carregar_historico.php
│   │
│   └── /imagens
│       └── (imagens do projeto)
│
└── /database
    └── (scripts SQL - historico_calculos e pagamento)
```

---

## ▶️ Como executar

1. Clone este repositório.

```bash
git clone https://github.com/SEU-USUARIO/EcoCalc.git
```

2. Coloque a pasta do projeto dentro do diretório **htdocs** do XAMPP.

3. Inicie os serviços:

- Apache
- MySQL

4. Importe os scripts SQL da pasta **database** utilizando o phpMyAdmin.

5. Acesse pelo navegador:

```
http://localhost/EcoCalc/src/frontend/index.html
```

---

## 👥 Equipe

Projeto desenvolvido por:

- **Otávio Franco Rodrigues**
- **Saimon Eduardo Araujo Conceição**

Curso Técnico em **Desenvolvimento de Sistemas**.

---

## 📚 Finalidade

Este projeto foi desenvolvido exclusivamente para fins acadêmicos, visando aplicar conhecimentos de:

- Programação Web II
- Banco de Dados I
- Integração entre Front-end e Back-end
- Manipulação de Banco de Dados com PHP e MySQL
