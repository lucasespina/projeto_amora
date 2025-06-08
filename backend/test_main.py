# Testes
"""
Testes para o Simulador aMORA Backend
====================================

Este módulo contém todos os testes unitários e de integração
para a API do simulador aMORA.

Autor: Simulador aMORA
Data: 2025
"""

import pytest
from fastapi.testclient import TestClient
from main import app, CalculadoraSimulacao, SimulacaoRequest


# Cliente de teste para a API
client = TestClient(app)


class TestCalculadoraSimulacao:
    """Testes para a classe CalculadoraSimulacao."""
    
    def test_calcular_valor_entrada(self):
        """Testa o cálculo do valor da entrada."""
        valor_imovel = 400000
        percentual_entrada = 5
        
        resultado = CalculadoraSimulacao.calcular_valor_entrada(
            valor_imovel, percentual_entrada
        )
        
        assert resultado == 20000
    
    def test_calcular_valor_financiado(self):
        """Testa o cálculo do valor financiado."""
        valor_imovel = 400000
        valor_entrada = 20000
        
        resultado = CalculadoraSimulacao.calcular_valor_financiado(
            valor_imovel, valor_entrada
        )
        
        assert resultado == 380000
    
    def test_calcular_total_a_guardar(self):
        """Testa o cálculo do total a guardar."""
        valor_imovel = 400000
        
        resultado = CalculadoraSimulacao.calcular_total_a_guardar(valor_imovel)
        
        assert resultado == 60000
    
    def test_calcular_parcela_mensal(self):
        """Testa o cálculo da parcela mensal."""
        total_a_guardar = 60000
        anos_contrato = 3
        
        resultado = CalculadoraSimulacao.calcular_parcela_mensal(
            total_a_guardar, anos_contrato
        )
        
        assert resultado == pytest.approx(1666.67, rel=1e-2)
    
    def test_processar_simulacao_completa(self):
        """Testa o processamento completo de uma simulação."""
        dados = SimulacaoRequest(
            valor_imovel=400000,
            percentual_entrada=5,
            anos_contrato=3
        )
        
        resultado = CalculadoraSimulacao.processar_simulacao(dados)
        
        assert resultado.valor_entrada == 20000
        assert resultado.valor_financiado == 380000
        assert resultado.total_a_guardar == 60000
        assert resultado.parcela_mensal == 1666.67


class TestAPI:
    """Testes para os endpoints da API."""
    
    def test_endpoint_root(self):
        """Testa o endpoint raiz."""
        response = client.get("/")
        assert response.status_code == 200
        assert "Simulador aMORA API" in response.json()["message"]
    
    def test_endpoint_health(self):
        """Testa o endpoint de health check."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_simulacao_valida(self):
        """Testa uma simulação com dados válidos."""
        dados = {
            "valor_imovel": 400000,
            "percentual_entrada": 5,
            "anos_contrato": 3
        }
        
        response = client.post("/simulacao", json=dados)
        
        assert response.status_code == 200
        resultado = response.json()
        
        assert resultado["valor_entrada"] == 20000
        assert resultado["valor_financiado"] == 380000
        assert resultado["total_a_guardar"] == 60000
        assert resultado["parcela_mensal"] == 1666.67
    
    def test_simulacao_valor_imovel_invalido(self):
        """Testa simulação com valor de imóvel inválido."""
        dados = {
            "valor_imovel": -100000,  # Valor negativo
            "percentual_entrada": 10,
            "anos_contrato": 2
        }
        
        response = client.post("/simulacao", json=dados)
        assert response.status_code == 422  # Validation error
    
    def test_simulacao_percentual_entrada_baixo(self):
        """Testa simulação com percentual de entrada muito baixo."""
        dados = {
            "valor_imovel": 400000,
            "percentual_entrada": 3,  # Abaixo do mínimo (5%)
            "anos_contrato": 3
        }
        
        response = client.post("/simulacao", json=dados)
        assert response.status_code == 422  # Validation error
    
    def test_simulacao_percentual_entrada_alto(self):
        """Testa simulação com percentual de entrada muito alto."""
        dados = {
            "valor_imovel": 400000,
            "percentual_entrada": 25,  # Acima do máximo (20%)
            "anos_contrato": 3
        }
        
        response = client.post("/simulacao", json=dados)
        assert response.status_code == 422  # Validation error
    
    def test_simulacao_anos_contrato_baixo(self):
        """Testa simulação com anos de contrato muito baixo."""
        dados = {
            "valor_imovel": 400000,
            "percentual_entrada": 10,
            "anos_contrato": 0  # Abaixo do mínimo (1 ano)
        }
        
        response = client.post("/simulacao", json=dados)
        assert response.status_code == 422  # Validation error
    
    def test_simulacao_anos_contrato_alto(self):
        """Testa simulação com anos de contrato muito alto."""
        dados = {
            "valor_imovel": 400000,
            "percentual_entrada": 10,
            "anos_contrato": 6  # Acima do máximo (5 anos)
        }
        
        response = client.post("/simulacao", json=dados)
        assert response.status_code == 422  # Validation error
    
    def test_simulacao_dados_ausentes(self):
        """Testa simulação com dados obrigatórios ausentes."""
        dados = {
            "valor_imovel": 400000
            # percentual_entrada e anos_contrato ausentes
        }
        
        response = client.post("/simulacao", json=dados)
        assert response.status_code == 422  # Validation error


class TestCenarios:
    """Testes de cenários específicos."""
    
    def test_cenario_exemplo_documentacao(self):
        """Testa o cenário exemplo da documentação."""
        dados = {
            "valor_imovel": 400000,
            "percentual_entrada": 5,
            "anos_contrato": 3
        }
        
        response = client.post("/simulacao", json=dados)
        resultado = response.json()
        
        # Valores esperados conforme exemplo da documentação
        assert resultado["valor_entrada"] == 20000
        assert resultado["valor_financiado"] == 380000
        assert resultado["total_a_guardar"] == 60000
        assert resultado["parcela_mensal"] == 1666.67
    
    def test_cenario_entrada_maxima(self):
        """Testa cenário com entrada máxima (20%)."""
        dados = {
            "valor_imovel": 500000,
            "percentual_entrada": 20,
            "anos_contrato": 5
        }
        
        response = client.post("/simulacao", json=dados)
        resultado = response.json()
        
        assert resultado["valor_entrada"] == 100000
        assert resultado["valor_financiado"] == 400000
        assert resultado["total_a_guardar"] == 75000
        assert resultado["parcela_mensal"] == 1250.0
    
    def test_cenario_contrato_curto(self):
        """Testa cenário com contrato de 1 ano."""
        dados = {
            "valor_imovel": 240000,
            "percentual_entrada": 10,
            "anos_contrato": 1
        }
        
        response = client.post("/simulacao", json=dados)
        resultado = response.json()
        
        assert resultado["valor_entrada"] == 24000
        assert resultado["valor_financiado"] == 216000
        assert resultado["total_a_guardar"] == 36000
        assert resultado["parcela_mensal"] == 3000.0