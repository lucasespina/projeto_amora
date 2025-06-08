# Simulador aMORA - Dockerfile FUNCIONANDO
# ========================================

FROM python:3.12-slim-bookworm

# Diretório de trabalho
WORKDIR /app

# Instalar curl para health check
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt da pasta backend
COPY backend/requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação da pasta backend
COPY backend/main.py .

# Expor porta
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Executar aplicação
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]