# Análise de Vendas de Videogames (vgsales)

Trabalho em grupo da disciplina **Introdução à Ciência de Dados** — análise exploratória da base [`vgsales.csv`](./vgsales.csv) com **7 perguntas** respondidas por **7 gráficos** em um Jupyter Notebook.

## Sobre a base de dados

A base reúne **16.598 jogos** lançados entre **1980 e 2020**, com vendas globais e regionais (em milhões de unidades).

| Coluna | Descrição |
|---|---|
| `Rank` | Posição global do jogo em vendas |
| `Name` | Nome do jogo |
| `Platform` | Console / plataforma (Wii, PS2, X360, PC, …) |
| `Year` | Ano de lançamento |
| `Genre` | Gênero (Action, Sports, Shooter, RPG, …) |
| `Publisher` | Empresa publicadora |
| `NA_Sales` | Vendas na América do Norte (milhões) |
| `EU_Sales` | Vendas na Europa (milhões) |
| `JP_Sales` | Vendas no Japão (milhões) |
| `Other_Sales` | Vendas em outras regiões (milhões) |
| `Global_Sales` | Vendas globais totais (milhões) |

## As 7 perguntas investigadas

1. Quais são os **10 jogos mais vendidos globalmente** de todos os tempos?
2. Qual **gênero de jogo** gera mais vendas globais?
3. Como o mercado de jogos **evoluiu ao longo dos anos**?
4. Quais **plataformas (consoles)** dominaram historicamente o mercado?
5. Como as vendas se **distribuem entre as regiões** do mundo?
6. Quais **publishers** lideram em vendas globais?
7. Cada **região do mundo prefere um gênero diferente**?

Cada pergunta é apresentada no notebook em três blocos: **o que** investiga, **como** o gráfico foi construído e **o que** o gráfico mostra.

## Estrutura do repositório

```
.
├── vgsales_analise.ipynb   # Notebook principal — análise completa (abrir no Jupyter / VS Code)
├── vgsales.csv             # Base de dados original
├── _build_notebook.py      # Script Python que gera o notebook do zero
├── README.md
└── LICENSE
```

## Como abrir o notebook

### Opção 1 — Visualizar online (mais simples)
Basta abrir o arquivo [`vgsales_analise.ipynb`](./vgsales_analise.ipynb) direto no GitHub — todos os gráficos já estão renderizados.

Ou pelo nbviewer (renderização mais rica):
👉 https://nbviewer.org/github/Ucazin/analise-vgsales/blob/main/vgsales_analise.ipynb

### Opção 2 — Rodar localmente

Pré-requisitos: **Python 3.10+**.

```bash
# Clonar o repositório
git clone https://github.com/Ucazin/analise-vgsales.git
cd analise-vgsales

# Instalar dependências
pip install pandas matplotlib seaborn jupyter

# Abrir o notebook
jupyter notebook vgsales_analise.ipynb
```

### Opção 3 — Re-gerar o notebook do zero
O script `_build_notebook.py` reconstrói o `.ipynb` programaticamente:

```bash
pip install nbformat pandas matplotlib seaborn
python _build_notebook.py
jupyter nbconvert --to notebook --execute vgsales_analise.ipynb --output vgsales_analise.ipynb
```

## Tecnologias usadas

- **Python 3.13** — linguagem
- **pandas** — manipulação de dados
- **matplotlib** + **seaborn** — visualizações estáticas
- **Jupyter Notebook** — formato de entrega

## Limitações da base

- Cobre apenas **vendas físicas** — não inclui vendas digitais (Steam, PSN, eShop), que dominam o mercado a partir de meados dos anos 2010.
- Dados de **2017–2020 estão incompletos**.
- **Não inclui mobile** (iOS / Android), atualmente o maior segmento da indústria.

## Licença

Distribuído sob a licença **MIT** — veja o arquivo [LICENSE](./LICENSE) para o texto completo.
link do github Pages: https://ucazin.github.io/analise-vgsales/
---

Trabalho acadêmico para fins educacionais. Base de dados original: [Video Game Sales no Kaggle](https://www.kaggle.com/datasets/gregorut/videogamesales).
