"""
Simulador de Compra de Imóvel aMORA - Backend API
================================================

Este módulo implementa a API REST para simulação de compra de imóvel
seguindo o modelo aMORA.

Autor: Simulador aMORA
Data: 2025
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Dict, Any
import uvicorn


# Configuração da aplicação FastAPI
app = FastAPI(
    title="Simulador aMORA API",
    description="API para simulação de compra de imóvel modelo aMORA",
    version="1.0.0"
)

# Configuração do CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulacaoRequest(BaseModel):
    """
    Modelo de dados para requisição de simulação.
    
    Attributes:
        valor_imovel (float): Valor total do imóvel
        percentual_entrada (float): Percentual de entrada (5-20%)
        anos_contrato (int): Duração do contrato em anos (1-5)
    """
    valor_imovel: float = Field(
        ..., 
        ge=1, 
        description="Valor do imóvel deve ser maior que zero"
    )
    percentual_entrada: float = Field(
        ..., 
        ge=5, 
        le=20, 
        description="Percentual de entrada deve estar entre 5 e 20"
    )
    anos_contrato: int = Field(
        ..., 
        ge=1, 
        le=5, 
        description="Anos de contrato deve estar entre 1 e 5"
    )

    @field_validator('valor_imovel')
    @classmethod
    def validar_valor_imovel(cls, v):
        """Valida se o valor do imóvel é positivo."""
        if v <= 0:
            raise ValueError('Valor do imóvel deve ser maior que zero')
        return v

    @field_validator('percentual_entrada')
    @classmethod
    def validar_percentual_entrada(cls, v):
        """Valida se o percentual de entrada está no range correto."""
        if not 5 <= v <= 20:
            raise ValueError('Percentual de entrada deve estar entre 5% e 20%')
        return v

    @field_validator('anos_contrato')
    @classmethod
    def validar_anos_contrato(cls, v):
        """Valida se os anos de contrato estão no range correto."""
        if not 1 <= v <= 5:
            raise ValueError('Anos de contrato deve estar entre 1 e 5')
        return v


class SimulacaoResponse(BaseModel):
    """
    Modelo de dados para resposta de simulação.
    
    Attributes:
        valor_entrada (float): Valor da entrada
        valor_financiado (float): Valor a ser financiado
        total_a_guardar (float): Total a ser guardado (15% do valor do imóvel)
        parcela_mensal (float): Valor mensal a guardar
    """
    valor_entrada: float
    valor_financiado: float
    total_a_guardar: float
    parcela_mensal: float


class CalculadoraSimulacao:
    """
    Classe responsável pelos cálculos da simulação imobiliária.
    
    Esta classe encapsula toda a lógica de negócio para calcular
    os valores relacionados à simulação de compra de imóvel.
    """
    
    @staticmethod
    def calcular_valor_entrada(valor_imovel: float, percentual_entrada: float) -> float:
        """
        Calcula o valor da entrada.
        
        Args:
            valor_imovel (float): Valor total do imóvel
            percentual_entrada (float): Percentual de entrada
            
        Returns:
            float: Valor da entrada
        """
        return valor_imovel * (percentual_entrada / 100)
    
    @staticmethod
    def calcular_valor_financiado(valor_imovel: float, valor_entrada: float) -> float:
        """
        Calcula o valor a ser financiado.
        
        Args:
            valor_imovel (float): Valor total do imóvel
            valor_entrada (float): Valor da entrada
            
        Returns:
            float: Valor a ser financiado
        """
        return valor_imovel - valor_entrada
    
    @staticmethod
    def calcular_total_a_guardar(valor_imovel: float) -> float:
        """
        Calcula o total a guardar (15% do valor do imóvel).
        
        Args:
            valor_imovel (float): Valor total do imóvel
            
        Returns:
            float: Total a guardar
        """
        return valor_imovel * 0.15
    
    @staticmethod
    def calcular_parcela_mensal(total_a_guardar: float, anos_contrato: int) -> float:
        """
        Calcula o valor mensal a guardar.
        
        Args:
            total_a_guardar (float): Total a guardar
            anos_contrato (int): Anos de contrato
            
        Returns:
            float: Valor mensal a guardar
        """
        meses_total = anos_contrato * 12
        return total_a_guardar / meses_total
    
    @classmethod
    def processar_simulacao(cls, dados: SimulacaoRequest) -> SimulacaoResponse:
        """
        Processa uma simulação completa.
        
        Args:
            dados (SimulacaoRequest): Dados da simulação
            
        Returns:
            SimulacaoResponse: Resultado da simulação
        """
        # Calcular valor da entrada
        valor_entrada = cls.calcular_valor_entrada(
            dados.valor_imovel, 
            dados.percentual_entrada
        )
        
        # Calcular valor financiado
        valor_financiado = cls.calcular_valor_financiado(
            dados.valor_imovel, 
            valor_entrada
        )
        
        # Calcular total a guardar
        total_a_guardar = cls.calcular_total_a_guardar(dados.valor_imovel)
        
        # Calcular parcela mensal
        parcela_mensal = cls.calcular_parcela_mensal(
            total_a_guardar, 
            dados.anos_contrato
        )
        
        return SimulacaoResponse(
            valor_entrada=round(valor_entrada, 2),
            valor_financiado=round(valor_financiado, 2),
            total_a_guardar=round(total_a_guardar, 2),
            parcela_mensal=round(parcela_mensal, 2)
        )


@app.get("/")
async def root():
    """Endpoint raiz da API."""
    return {
        "message": "Simulador aMORA API", 
        "version": "1.0.0",
        "documentation": "/docs"
    }


@app.get("/health")
async def health_check():
    """Endpoint para verificação de saúde da API."""
    return {"status": "healthy", "service": "simulador-amora"}


@app.post("/simulacao", response_model=SimulacaoResponse)
async def criar_simulacao(simulacao: SimulacaoRequest) -> SimulacaoResponse:
    """
    Endpoint para criar uma nova simulação de compra de imóvel.
    
    Args:
        simulacao (SimulacaoRequest): Dados da simulação
        
    Returns:
        SimulacaoResponse: Resultado da simulação
        
    Raises:
        HTTPException: Em caso de dados inválidos
    """
    try:
        # Processar a simulação usando a calculadora
        resultado = CalculadoraSimulacao.processar_simulacao(simulacao)
        return resultado
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


if __name__ == "__main__":
    # Executar o servidor de desenvolvimento
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )