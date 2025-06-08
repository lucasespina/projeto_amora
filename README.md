# 🏠 Simulador aMORA - Compra de Imóvel

Uma aplicação Full-Stack completa para simulação de compra de imóveis seguindo o modelo aMORA, desenvolvida com **FastAPI** no backend e **HTML/CSS/JavaScript** no frontend.

![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=flat-square&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ed?style=flat-square&logo=docker&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Modelo de Negócio aMORA](#-modelo-de-negócio-amora)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução](#-instalação-e-execução)
- [Uso da API](#-uso-da-api)
- [Frontend](#-frontend)
- [Testes](#-testes)
- [Docker](#-docker)
- [Contribuição](#-contribuição)

## 🎯 Sobre o Projeto

O **Simulador aMORA** é uma aplicação web completa que permite simular a compra de imóveis seguindo uma metodologia específica de planejamento financeiro. O sistema calcula automaticamente valores de entrada, financiamento e reservas necessárias para a aquisição do imóvel.

### Características Principais

- ✅ **API REST** robusta com FastAPI
- ✅ **Interface responsiva** para desktop e mobile
- ✅ **Validação completa** de dados
- ✅ **Documentação automática** da API
- ✅ **Testes automatizados** com alta cobertura
- ✅ **Containerização** com Docker
- ✅ **Arquitetura modular** e bem documentada

## 🏦 Modelo de Negócio aMORA

O modelo aMORA utiliza as seguintes fórmulas para os cálculos:

### Fórmulas de Cálculo

| Cálculo | Fórmula | Descrição |
|---------|---------|-----------|
| **Valor da Entrada** | `valor_imovel × (percentual_entrada ÷ 100)` | Valor inicial a ser pago |
| **Valor Financiado** | `valor_imovel - valor_entrada` | Valor a ser financiado |
| **Total a Guardar** | `valor_imovel × 0.15` | 15% do valor do imóvel |
| **Parcela Mensal** | `total_a_guardar ÷ (anos_contrato × 12)` | Valor mensal a reservar |

### Exemplo Prático

```
📊 Simulação Exemplo:
   Valor do Imóvel: R$ 400.000,00
   Entrada (10%): R$ 40.000,00
   Duração: 3 anos

📈 Resultados:
   💰 Valor da Entrada: R$ 40.000,00
   🏦 Valor Financiado: R$ 360.000,00
   💾 Total a Guardar: R$ 60.000,00
   📅 Parcela Mensal: R$ 1.666,67
```

## ✨ Funcionalidades

### Backend (API)
- 🔌 **API REST** completa com endpoints documentados
- ✅ **Validação rigorosa** usando Pydantic
- 📊 **Cálculos precisos** do modelo aMORA
- 🛡️ **Tratamento de erros** robusto
- 📋 **Logs estruturados** para monitoramento
- 🔍 **Health check** para verificação de status
- 🌐 **CORS configurado** para integração frontend

### Frontend
- 📱 **Design responsivo** (mobile-first)
- ⚡ **Validação em tempo real**
- 🎨 **Interface moderna** e intuitiva
- 💰 **Formatação monetária** brasileira
- 🔄 **Feedback visual** para interações
- ♿ **Acessibilidade** (WCAG compliant)
- ⌨️ **Atalhos de teclado** para melhor UX

### DevOps
- 🐳 **Docker** e **Docker Compose** configurados
- 🧪 **Testes automatizados** com pytest
- 📏 **Linting** e formatação automática
- 📦 **Build otimizado** para produção

## 🛠 Tecnologias

### Backend
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Python** | 3.11+ | Linguagem principal |
| **FastAPI** | 0.104+ | Framework web moderno |
| **Pydantic** | 2.5+ | Validação de dados |
| **Uvicorn** | 0.24+ | Servidor ASGI |

### Frontend
| Tecnologia | Propósito |
|------------|-----------|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilização moderna (Grid, Flexbox) |
| **JavaScript ES6+** | Lógica de interação |
| **Fetch API** | Comunicação com backend |

### DevOps & Ferramentas
| Ferramenta | Propósito |
|------------|-----------|
| **Docker** | Containerização |
| **pytest** | Framework de testes |
| **black** | Formatação de código |
| **Nginx** | Servidor web (produção) |

## 📁 Estrutura do Projeto

```
simulador-amora/
├── 📁 backend/                 # API Backend
│   ├── 🐍 main.py             # Aplicação principal FastAPI
│   ├── 📄 requirements.txt    # Dependências Python
│   ├── 🧪 test_main.py       # Testes automatizados
│   ├── 📁 __pycache__/       # Cache Python (auto-gerado)
│   └── 📁 .pytest_cache/     # Cache pytest (auto-gerado)
├── 📁 docker/                 # Configurações Docker
│   ├── 🐳 Dockerfile         # Imagem da aplicação
│   └── 🐙 docker-compose.yml # Orquestração de serviços
├── 📁 frontend/               # Interface do Usuário
│   ├── 📁 script/            # JavaScript
│   │   └── 📜 script.js      # Lógica da aplicação
│   ├── 📁 style/             # Estilos CSS
│   │   └── 🎨 style.css      # Estilos principais
│   ├── 🌐 index.html         # Página principal
│   └── ⚙️ nginx.conf         # Configuração Nginx
├── 📁 logs/                   # Logs da aplicação
└── 📚 README.md              # Esta documentação
```

### Descrição Detalhada dos Arquivos

#### 🏗️ Backend (`/backend/`)

**`main.py`** - Aplicação principal da API
- Configuração da aplicação FastAPI
- Modelos Pydantic (`SimulacaoRequest`, `SimulacaoResponse`)
- Classe `CalculadoraSimulacao` com lógica de negócio
- Endpoints REST (`/`, `/health`, `/simulacao`)
- Tratamento de erros e validação
- Configuração de CORS para integração frontend

**`requirements.txt`** - Dependências Python
```txt
fastapi==0.104.1        # Framework web
uvicorn[standard]==0.24.0  # Servidor ASGI
pydantic==2.5.0         # Validação de dados
pytest==7.4.3           # Framework de testes
```

**`test_main.py`** - Suite completa de testes
- Testes unitários da `CalculadoraSimulacao`
- Testes de integração dos endpoints
- Testes de validação com dados inválidos
- Cenários específicos (valor 2000, limites, etc.)

#### 🎨 Frontend (`/frontend/`)

**`index.html`** - Interface principal
- Estrutura HTML5 semântica
- Meta tags para SEO e responsividade
- Atributos ARIA para acessibilidade
- Formulário de simulação interativo
- Área de resultados dinâmica

**`style/style.css`** - Estilos da aplicação
- Variáveis CSS para customização
- Design responsivo (mobile-first)
- Animações e transições suaves
- Temas claro/escuro automático
- Componentes modulares

**`script/script.js`** - Lógica da aplicação
- Classes organizadas por responsabilidade:
  - `FormValidator` - Validação de formulário
  - `ApiService` - Comunicação com backend
  - `UIManager` - Gerenciamento da interface
  - `SimulatorApp` - Aplicação principal
- Sistema de logging estruturado
- Tratamento robusto de erros
- Recursos de acessibilidade

**`nginx.conf`** - Configuração do servidor web
- Servidor web para produção
- Configurações de cache otimizadas
- Headers de segurança
- Compressão gzip
- Rotas para arquivos estáticos

#### 🐳 Docker (`/docker/`)

**`Dockerfile`** - Imagem da aplicação
- Baseado em Python 3.11-slim
- Instalação de dependências otimizada
- Usuário não-root para segurança
- Health check integrado
- Configurações de produção

**`docker-compose.yml`** - Orquestração
- Serviço API (backend)
- Serviço Frontend (nginx ou python)
- Rede personalizada
- Volumes para logs
- Health checks automáticos

## 🚀 Instalação e Execução

### Pré-requisitos

- **Python 3.11+** instalado
- **Docker** e **Docker Compose** (opcional)
- **Git** para clonar o repositório

### 🔥 Execução Rápida com Docker

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/simulador-amora.git
cd simulador-amora

# 2. Executar com Docker Compose
cd docker
docker-compose up --build

# 3. Acessar aplicação
# Frontend: http://localhost:3000
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### 💻 Execução Local (Desenvolvimento)

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/simulador-amora.git
cd simulador-amora

# 2. Backend - Terminal 1
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
python main.py

# 3. Frontend - Terminal 2
cd frontend
python -m http.server 3000

# 4. Acessar: http://localhost:3000
```

## 📡 Uso da API

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Informações da API |
| `GET` | `/health` | Status de saúde |
| `POST` | `/simulacao` | Criar simulação |
| `GET` | `/docs` | Documentação interativa |

### Endpoint Principal: POST `/simulacao`

#### Requisição
```json
{
  "valor_imovel": 400000,
  "percentual_entrada": 10,
  "anos_contrato": 3
}
```

#### Validações
- **valor_imovel**: Número > 0
- **percentual_entrada**: Entre 5 e 20
- **anos_contrato**: Entre 1 e 5

#### Resposta de Sucesso (200)
```json
{
  "valor_entrada": 40000.0,
  "valor_financiado": 360000.0,
  "total_a_guardar": 60000.0,
  "parcela_mensal": 1666.67
}
```

#### Exemplo com cURL
```bash
curl -X POST "http://localhost:8000/simulacao" \
     -H "Content-Type: application/json" \
     -d '{
       "valor_imovel": 500000,
       "percentual_entrada": 15,
       "anos_contrato": 4
     }'
```

#### Exemplo com Python
```python
import requests

response = requests.post(
    "http://localhost:8000/simulacao",
    json={
        "valor_imovel": 300000,
        "percentual_entrada": 8,
        "anos_contrato": 2
    }
)

resultado = response.json()
print(f"Parcela mensal: R$ {resultado['parcela_mensal']}")
```

### Documentação Interativa

Acesse `http://localhost:8000/docs` para uma interface interativa onde você pode:
- ✅ Testar todos os endpoints
- ✅ Ver exemplos de requisição/resposta
- ✅ Entender a estrutura dos dados
- ✅ Fazer simulações em tempo real

## 🎨 Frontend

### Características da Interface

- **📱 Responsivo**: Funciona perfeitamente em dispositivos móveis
- **🎯 Intuitivo**: Interface clara e fácil de usar
- **⚡ Rápido**: Validação em tempo real
- **🌟 Moderno**: Design contemporâneo com animações suaves
- **♿ Acessível**: Compatível com leitores de tela

### Funcionalidades Interativas

- **Validação em Tempo Real**: Feedback imediato sobre erros
- **Formatação Automática**: Valores monetários em Real brasileiro
- **Atalhos de Teclado**: 
  - `Ctrl+Enter` para simular
  - `Esc` para limpar formulário
- **Animações**: Transições suaves entre estados
- **Toast Notifications**: Feedback visual para ações

### Estrutura do JavaScript

```javascript
// Classes principais organizadas por responsabilidade
class FormValidator {
    // Validação de formulário e campos
}

class ApiService {
    // Comunicação com backend
}

class UIManager {
    // Gerenciamento da interface
}

class SimulatorApp {
    // Aplicação principal
}
```

## 🧪 Testes

### Executar Testes

```bash
# Testes básicos
cd backend
pytest test_main.py -v

# Testes com cobertura
pytest test_main.py --cov=main --cov-report=html

# Testes específicos
pytest test_main.py::TestCalculadoraSimulacao::test_calcular_valor_entrada
```

### Cobertura de Testes

Os testes cobrem:

- ✅ **Cálculos matemáticos** (100% cobertura)
- ✅ **Validação de entrada** (todos os cenários)
- ✅ **Endpoints da API** (success/error paths)
- ✅ **Casos extremos** (valores limites)
- ✅ **Integração** (frontend + backend)

### Cenários Testados

```python
# Exemplos de cenários testados
def test_simulacao_valor_2000():
    """Testa o caso específico reportado"""
    
def test_cenario_entrada_maxima():
    """Testa entrada de 20%"""
    
def test_simulacao_dados_invalidos():
    """Testa validação de dados incorretos"""
```

## 🐳 Docker

### Estrutura Docker

```yaml
# Serviços configurados
services:
  api:          # Backend FastAPI
  frontend:     # Frontend (Nginx ou Python)
```

### Comandos Docker

```bash
# Build e execução
docker-compose up --build

# Execução em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Limpar volumes
docker-compose down -v
```

### Health Checks

```bash
# Verificar saúde dos containers
docker-compose ps

# Logs de health check
docker inspect simulador-amora-api | grep Health
```

---
