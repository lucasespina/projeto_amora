@echo off
title Simulador aMORA - Docker
color 0B

echo.
echo ============================================
echo      SIMULADOR aMORA - DOCKER
echo ============================================
echo.

REM Verificar se está na pasta correta
if not exist "docker\docker-compose.yml" (
    echo [ERRO] Execute este script na pasta raiz do projeto!
    echo Pasta atual: %CD%
    echo Esperado: simulador-amora\ ^(pasta raiz^)
    echo.
    pause
    exit /b 1
)

echo [OK] Pasta do projeto encontrada!

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker nao encontrado!
    echo Instale Docker Desktop de: https://docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo [OK] Docker encontrado!

REM Verificar se Docker Compose está disponível
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker Compose nao encontrado!
    echo Instale Docker Compose ou use Docker Desktop
    echo.
    pause
    exit /b 1
)

echo [OK] Docker Compose encontrado!

REM Verificar se Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker nao esta rodando!
    echo Inicie o Docker Desktop e tente novamente
    echo.
    pause
    exit /b 1
)

echo [OK] Docker esta rodando!

REM Ir para pasta docker
cd docker

echo.
echo Iniciando containers...
echo.
echo Servicos que serao iniciados:
echo    - simulador-amora-api ^(Backend^)
echo    - simulador-amora-frontend ^(Frontend^)
echo.
echo Isso pode demorar alguns minutos na primeira execucao...
echo.

REM Parar containers existentes se estiverem rodando
echo Parando containers existentes...
docker-compose down 2>nul

REM Remover imagens antigas para garantir build limpo
echo Limpando imagens antigas...
docker image prune -f 2>nul

REM Construir e iniciar containers
echo Construindo e iniciando containers...
echo.
echo ============================================
echo URLs de acesso apos inicializacao:
echo Frontend: http://localhost:3000
echo API: http://localhost:8000
echo Docs: http://localhost:8000/docs
echo ============================================
echo.
echo Pressione Ctrl+C para parar os containers
echo.

docker-compose up --build

REM Se chegou aqui, o usuário pressionou Ctrl+C
echo.
echo.
echo ============================================
echo      SIMULADOR PARADO
echo ============================================
echo.
echo Limpando containers...
docker-compose down

echo.
echo Containers parados com sucesso!
echo.
echo Para iniciar novamente, execute este script novamente
echo.
pause