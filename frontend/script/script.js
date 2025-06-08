/**
 * Simulador aMORA - JavaScript
 * ============================
 * 
 * Script principal para gerenciar a interação do usuário com o simulador,
 * incluindo validação de formulário, chamadas à API e exibição de resultados.
 * 
 * Autor: Simulador aMORA
 * Data: 2025
 */

'use strict';

/* ==========================
   CONFIGURAÇÕES GLOBAIS
   ========================== */

const CONFIG = {
    API: {
        BASE_URL: 'http://localhost:8000',
        ENDPOINTS: {
            SIMULACAO: '/simulacao',
            HEALTH: '/health',
            TESTE: '/teste'
        },
        TIMEOUT: 10000 // 10 segundos
    },
    
    VALIDATION: {
        VALOR_IMOVEL: {
            MIN: 0.01,
            MAX: 999999999,
            STEP: 0.01
        },
        PERCENTUAL_ENTRADA: {
            MIN: 5,
            MAX: 20,
            STEP: 0.1
        },
        ANOS_CONTRATO: {
            MIN: 1,
            MAX: 5,
            STEP: 1
        }
    },
    
    UI: {
        LOADING_DELAY: 500, // ms
        ANIMATION_DURATION: 300, // ms
        ERROR_DISPLAY_TIME: 5000 // ms
    }
};

/* ==========================
   ELEMENTOS DO DOM
   ========================== */

const elements = {
    // Formulário
    form: document.getElementById('simulatorForm'),
    submitBtn: document.getElementById('submitBtn'),
    errorState: document.getElementById('errorState'),
    
    // Resultados
    resultsPlaceholder: document.getElementById('resultsPlaceholder'),
    resultsContent: document.getElementById('resultsContent'),
    
    // Campos de entrada
    valorImovel: document.getElementById('valorImovel'),
    percentualEntrada: document.getElementById('percentualEntrada'),
    anosContrato: document.getElementById('anosContrato'),
    
    // Campos de resultado
    resultValorEntrada: document.getElementById('resultValorEntrada'),
    resultValorFinanciado: document.getElementById('resultValorFinanciado'),
    resultTotalGuardar: document.getElementById('resultTotalGuardar'),
    resultParcelaMensal: document.getElementById('resultParcelaMensal'),
    
    // Mensagens de erro
    errorValorImovel: document.getElementById('errorValorImovel'),
    errorPercentualEntrada: document.getElementById('errorPercentualEntrada'),
    errorAnosContrato: document.getElementById('errorAnosContrato')
};

/* ==========================
   CLASSE: LOGGER
   ========================== */

class Logger {
    /**
     * Sistema de logging com diferentes níveis
     */
    
    static log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        switch (level.toLowerCase()) {
            case 'error':
                console.error(logMessage, data);
                break;
            case 'warn':
                console.warn(logMessage, data);
                break;
            case 'info':
                console.info(logMessage, data);
                break;
            case 'debug':
                console.debug(logMessage, data);
                break;
            default:
                console.log(logMessage, data);
        }
    }
    
    static info(message, data) { this.log('info', message, data); }
    static error(message, data) { this.log('error', message, data); }
    static warn(message, data) { this.log('warn', message, data); }
    static debug(message, data) { this.log('debug', message, data); }
}

/* ==========================
   CLASSE: VALIDADOR DE FORMULÁRIO
   ========================== */

class FormValidator {
    /**
     * Classe responsável pela validação dos dados do formulário
     */
    
    /**
     * Valida todos os campos do formulário
     * @param {FormData} formData - Dados do formulário
     * @returns {Object} Objeto com status de validação e erros
     */
    static validateForm(formData) {
        const errors = {};
        let isValid = true;
        
        Logger.debug('Iniciando validação do formulário');

        // Validar valor do imóvel
        const valorImovel = this.validateValorImovel(formData.get('valorImovel'));
        if (!valorImovel.isValid) {
            errors.valorImovel = valorImovel.error;
            isValid = false;
        }

        // Validar percentual de entrada
        const percentualEntrada = this.validatePercentualEntrada(formData.get('percentualEntrada'));
        if (!percentualEntrada.isValid) {
            errors.percentualEntrada = percentualEntrada.error;
            isValid = false;
        }

        // Validar anos de contrato
        const anosContrato = this.validateAnosContrato(formData.get('anosContrato'));
        if (!anosContrato.isValid) {
            errors.anosContrato = anosContrato.error;
            isValid = false;
        }
        
        Logger.debug('Validação concluída', { isValid, errors });
        return { isValid, errors };
    }
    
    /**
     * Valida o valor do imóvel
     * @param {string} value - Valor a ser validado
     * @returns {Object} Resultado da validação
     */
    static validateValorImovel(value) {
        const numValue = parseFloat(value);
        
        if (isNaN(numValue) || numValue <= 0) {
            return {
                isValid: false,
                error: 'Valor do imóvel deve ser maior que zero'
            };
        }
        
        if (numValue < CONFIG.VALIDATION.VALOR_IMOVEL.MIN) {
            return {
                isValid: false,
                error: `Valor mínimo: R$ ${CONFIG.VALIDATION.VALOR_IMOVEL.MIN.toFixed(2)}`
            };
        }
        
        if (numValue > CONFIG.VALIDATION.VALOR_IMOVEL.MAX) {
            return {
                isValid: false,
                error: 'Valor do imóvel muito alto'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Valida o percentual de entrada
     * @param {string} value - Valor a ser validado
     * @returns {Object} Resultado da validação
     */
    static validatePercentualEntrada(value) {
        const numValue = parseFloat(value);
        
        if (isNaN(numValue)) {
            return {
                isValid: false,
                error: 'Percentual de entrada é obrigatório'
            };
        }
        
        if (numValue < CONFIG.VALIDATION.PERCENTUAL_ENTRADA.MIN) {
            return {
                isValid: false,
                error: `Percentual mínimo: ${CONFIG.VALIDATION.PERCENTUAL_ENTRADA.MIN}%`
            };
        }
        
        if (numValue > CONFIG.VALIDATION.PERCENTUAL_ENTRADA.MAX) {
            return {
                isValid: false,
                error: `Percentual máximo: ${CONFIG.VALIDATION.PERCENTUAL_ENTRADA.MAX}%`
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Valida os anos de contrato
     * @param {string} value - Valor a ser validado
     * @returns {Object} Resultado da validação
     */
    static validateAnosContrato(value) {
        const numValue = parseInt(value);
        
        if (isNaN(numValue)) {
            return {
                isValid: false,
                error: 'Duração do contrato é obrigatória'
            };
        }
        
        if (numValue < CONFIG.VALIDATION.ANOS_CONTRATO.MIN) {
            return {
                isValid: false,
                error: `Mínimo: ${CONFIG.VALIDATION.ANOS_CONTRATO.MIN} ano`
            };
        }
        
        if (numValue > CONFIG.VALIDATION.ANOS_CONTRATO.MAX) {
            return {
                isValid: false,
                error: `Máximo: ${CONFIG.VALIDATION.ANOS_CONTRATO.MAX} anos`
            };
        }
        
        return { isValid: true };
    }

    /**
     * Exibe erros de validação na interface
     * @param {Object} errors - Objeto com os erros de validação
     */
    static displayErrors(errors) {
        Logger.debug('Exibindo erros de validação', errors);
        
        // Limpar erros anteriores
        this.clearErrors();

        // Exibir novos erros
        Object.keys(errors).forEach(field => {
            const errorElement = elements[`error${this.capitalizeFirst(field)}`];
            const inputElement = elements[field];
            
            if (errorElement && inputElement) {
                errorElement.textContent = errors[field];
                errorElement.style.display = 'block';
                inputElement.classList.add('error');
                
                // Adicionar animação de shake
                inputElement.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    inputElement.style.animation = '';
                }, 500);
            }
        });
    }

    /**
     * Limpa todos os erros de validação
     */
    static clearErrors() {
        const fields = ['valorImovel', 'percentualEntrada', 'anosContrato'];
        
        fields.forEach(field => {
            const errorElement = elements[`error${this.capitalizeFirst(field)}`];
            const inputElement = elements[field];
            
            if (errorElement && inputElement) {
                errorElement.style.display = 'none';
                inputElement.classList.remove('error');
            }
        });
    }
    
    /**
     * Capitaliza a primeira letra de uma string
     * @param {string} str - String a ser capitalizada
     * @returns {string} String capitalizada
     */
    static capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

/* ==========================
   CLASSE: SERVIÇO DE API
   ========================== */

class ApiService {
    /**
     * Classe responsável por todas as comunicações com a API
     */
    
    /**
     * Envia dados de simulação para a API
     * @param {Object} simulationData - Dados da simulação
     * @returns {Promise<Object>} Resultado da simulação
     */
    static async sendSimulation(simulationData) {
        Logger.info('Enviando simulação para API', simulationData);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);
            
            const response = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.SIMULACAO}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(simulationData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || `Erro HTTP ${response.status}`;
                Logger.error('Erro na resposta da API', { status: response.status, errorData });
                throw new Error(errorMessage);
            }

            const result = await response.json();
            Logger.info('Simulação processada com sucesso', result);
            return result;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                const timeoutError = 'Tempo limite esgotado. Verifique sua conexão.';
                Logger.error('Timeout na requisição');
                throw new Error(timeoutError);
            }
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                const connectionError = 'Erro de conexão. Verifique se a API está rodando em http://localhost:8000';
                Logger.error('Erro de conexão com a API');
                throw new Error(connectionError);
            }
            
            Logger.error('Erro geral na API', error);
            throw error;
        }
    }
    
    /**
     * Verifica se a API está funcionando
     * @returns {Promise<boolean>} Status da API
     */
    static async checkHealth() {
        try {
            const response = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.HEALTH}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const isHealthy = response.ok;
            Logger.info(`API Health Check: ${isHealthy ? 'OK' : 'ERRO'}`);
            return isHealthy;
            
        } catch (error) {
            Logger.error('Erro no health check da API', error);
            return false;
        }
    }
}

/* ==========================
   CLASSE: GERENCIADOR DE UI
   ========================== */

class UIManager {
    /**
     * Classe responsável por gerenciar a interface do usuário
     */
    
    /**
     * Formata um valor monetário para exibição
     * @param {number} value - Valor a ser formatado
     * @returns {string} Valor formatado
     */
    static formatCurrency(value) {
        try {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        } catch (error) {
            Logger.error('Erro ao formatar moeda', { value, error });
            return `R$ ${value.toFixed(2).replace('.', ',')}`;
        }
    }

    /**
     * Formata um número para exibição
     * @param {number} value - Valor a ser formatado
     * @returns {string} Valor formatado
     */
    static formatNumber(value) {
        try {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(value);
        } catch (error) {
            Logger.error('Erro ao formatar número', { value, error });
            return value.toString();
        }
    }

    /**
     * Exibe os resultados da simulação
     * @param {Object} results - Resultados da simulação
     */
    static displayResults(results) {
        Logger.info('Exibindo resultados da simulação', results);
        
        try {
            // Atualizar valores na interface
            elements.resultValorEntrada.textContent = this.formatCurrency(results.valor_entrada);
            elements.resultValorFinanciado.textContent = this.formatCurrency(results.valor_financiado);
            elements.resultTotalGuardar.textContent = this.formatCurrency(results.total_a_guardar);
            elements.resultParcelaMensal.textContent = this.formatCurrency(results.parcela_mensal);

            // Animar transição
            this.animateResultsTransition();
            
            // Adicionar efeito de destaque no valor principal
            this.highlightMainResult();
            
        } catch (error) {
            Logger.error('Erro ao exibir resultados', error);
            this.displayError('Erro ao exibir os resultados da simulação');
        }
    }
    
    /**
     * Anima a transição dos resultados
     */
    static animateResultsTransition() {
        // Esconder placeholder
        elements.resultsPlaceholder.style.display = 'none';
        
        // Mostrar resultados com animação
        elements.resultsContent.classList.add('show');
        
        // Animar cada item individualmente
        const resultItems = elements.resultsContent.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    /**
     * Destaca o resultado principal
     */
    static highlightMainResult() {
        const mainResult = elements.resultParcelaMensal;
        
        // Adicionar efeito de pulse
        mainResult.style.animation = 'pulse 1s ease-in-out 3';
        
        setTimeout(() => {
            mainResult.style.animation = '';
        }, 3000);
    }

    /**
     * Exibe um erro na interface
     * @param {string} message - Mensagem de erro
     */
    static displayError(message) {
        Logger.error('Exibindo erro na UI', message);
        
        elements.errorState.textContent = message;
        elements.errorState.style.display = 'block';
        
        // Auto-ocultar erro após tempo definido
        setTimeout(() => {
            this.clearError();
        }, CONFIG.UI.ERROR_DISPLAY_TIME);
        
        // Adicionar animação de shake
        elements.errorState.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            elements.errorState.style.animation = '';
        }, 500);
    }

    /**
     * Limpa erros da interface
     */
    static clearError() {
        elements.errorState.style.display = 'none';
    }

    /**
     * Define o estado de loading do botão
     * @param {boolean} loading - Se está em loading
     */
    static setLoadingState(loading) {
        if (loading) {
            elements.submitBtn.classList.add('loading');
            elements.submitBtn.disabled = true;
            elements.submitBtn.setAttribute('aria-busy', 'true');
            
            // Desabilitar campos do formulário
            this.setFormDisabled(true);
            
        } else {
            elements.submitBtn.classList.remove('loading');
            elements.submitBtn.disabled = false;
            elements.submitBtn.setAttribute('aria-busy', 'false');
            
            // Reabilitar campos do formulário
            this.setFormDisabled(false);
        }
    }
    
    /**
     * Habilita ou desabilita os campos do formulário
     * @param {boolean} disabled - Se deve desabilitar
     */
    static setFormDisabled(disabled) {
        const inputs = [
            elements.valorImovel,
            elements.percentualEntrada,
            elements.anosContrato
        ];
        
        inputs.forEach(input => {
            input.disabled = disabled;
            if (disabled) {
                input.style.opacity = '0.6';
            } else {
                input.style.opacity = '1';
            }
        });
    }
    
    /**
     * Mostra toast de notificação
     * @param {string} message - Mensagem
     * @param {string} type - Tipo (success, error, info)
     */
    static showToast(message, type = 'info') {
        // Criar elemento de toast se não existir
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(toast);
        }
        
        // Definir estilo baseado no tipo
        const styles = {
            success: 'background: #27ae60;',
            error: 'background: #e74c3c;',
            info: 'background: #3498db;',
            warning: 'background: #f39c12;'
        };
        
        toast.style.cssText += styles[type] || styles.info;
        toast.textContent = message;
        
        // Mostrar toast
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Ocultar toast após 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
        }, 3000);
    }
}

/* ==========================
   CLASSE: APLICAÇÃO PRINCIPAL
   ========================== */

class SimulatorApp {
    /**
     * Classe principal que gerencia toda a aplicação
     */
    
    /**
     * Inicializa a aplicação
     */
    static async init() {
        Logger.info('🏠 Inicializando Simulador aMORA...');
        
        try {
            // Verificar se todos os elementos necessários existem
            this.validateDOMElements();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Verificar status da API
            await this.checkApiStatus();
            
            // Configurar validação em tempo real
            this.setupRealTimeValidation();
            
            // Aplicar configurações de acessibilidade
            this.setupAccessibility();
            
            Logger.info('✅ Simulador aMORA inicializado com sucesso!');
            UIManager.showToast('Simulador carregado com sucesso!', 'success');
            
        } catch (error) {
            Logger.error('❌ Erro ao inicializar aplicação', error);
            UIManager.displayError('Erro ao carregar o simulador. Recarregue a página.');
        }
    }
    
    /**
     * Valida se todos os elementos DOM necessários existem
     */
    static validateDOMElements() {
        const requiredElements = [
            'form', 'submitBtn', 'valorImovel', 'percentualEntrada', 
            'anosContrato', 'resultsContent', 'resultsPlaceholder'
        ];
        
        const missingElements = requiredElements.filter(elementKey => !elements[elementKey]);
        
        if (missingElements.length > 0) {
            throw new Error(`Elementos DOM ausentes: ${missingElements.join(', ')}`);
        }
        
        Logger.debug('✅ Todos os elementos DOM encontrados');
    }
    
    /**
     * Verifica o status da API
     */
    static async checkApiStatus() {
        Logger.info('Verificando status da API...');
        
        try {
            const isHealthy = await ApiService.checkHealth();
            
            if (isHealthy) {
                Logger.info('✅ API está funcionando');
                UIManager.showToast('Conexão com API estabelecida', 'success');
            } else {
                Logger.warn('⚠️ API não está respondendo adequadamente');
                UIManager.showToast('API pode estar indisponível', 'warning');
            }
        } catch (error) {
            Logger.warn('⚠️ Não foi possível verificar status da API', error);
            UIManager.showToast('Não foi possível conectar com a API', 'warning');
        }
    }

    /**
     * Configura os event listeners
     */
    static setupEventListeners() {
        Logger.debug('Configurando event listeners...');
        
        // Listener para o formulário
        elements.form.addEventListener('submit', this.handleFormSubmit.bind(this));

        // Listeners para validação em tempo real
        elements.valorImovel.addEventListener('input', this.handleInputChange.bind(this));
        elements.percentualEntrada.addEventListener('input', this.handleInputChange.bind(this));
        elements.anosContrato.addEventListener('input', this.handleInputChange.bind(this));
        
        // Listeners para melhor UX
        elements.valorImovel.addEventListener('blur', this.handleInputBlur.bind(this));
        elements.percentualEntrada.addEventListener('blur', this.handleInputBlur.bind(this));
        elements.anosContrato.addEventListener('blur', this.handleInputBlur.bind(this));
        
        // Listener para teclas de atalho
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Listener para mudanças de conexão
        window.addEventListener('online', () => {
            UIManager.showToast('Conexão restaurada', 'success');
            this.checkApiStatus();
        });
        
        window.addEventListener('offline', () => {
            UIManager.showToast('Conexão perdida', 'error');
        });
        
        Logger.debug('✅ Event listeners configurados');
    }
    
    /**
     * Configura validação em tempo real
     */
    static setupRealTimeValidation() {
        const inputs = [elements.valorImovel, elements.percentualEntrada, elements.anosContrato];
        
        inputs.forEach(input => {
            input.addEventListener('input', (event) => {
                // Remover caracteres inválidos
                this.sanitizeInput(event.target);
                
                // Validação suave (sem exibir erros imediatamente)
                this.softValidation(event.target);
            });
        });
    }
    
    /**
     * Sanitiza entrada do usuário
     * @param {HTMLElement} input - Campo de entrada
     */
    static sanitizeInput(input) {
        let value = input.value;
        
        // Remover caracteres não numéricos (exceto ponto e vírgula)
        if (input.type === 'number') {
            value = value.replace(/[^0-9.,]/g, '');
            
            // Substituir vírgula por ponto
            value = value.replace(',', '.');
            
            input.value = value;
        }
    }
    
    /**
     * Validação suave (feedback visual sutil)
     * @param {HTMLElement} input - Campo de entrada
     */
    static softValidation(input) {
        const value = parseFloat(input.value);
        
        // Remover classes anteriores
        input.classList.remove('valid', 'invalid');
        
        if (input.value && !isNaN(value)) {
            let isValid = false;
            
            switch (input.name) {
                case 'valorImovel':
                    isValid = value > 0;
                    break;
                case 'percentualEntrada':
                    isValid = value >= 5 && value <= 20;
                    break;
                case 'anosContrato':
                    isValid = value >= 1 && value <= 5;
                    break;
            }
            
            input.classList.add(isValid ? 'valid' : 'invalid');
        }
    }
    
    /**
     * Configura recursos de acessibilidade
     */
    static setupAccessibility() {
        Logger.debug('Configurando acessibilidade...');
        
        // Adicionar atributos ARIA
        elements.form.setAttribute('aria-label', 'Formulário de simulação de imóvel');
        elements.submitBtn.setAttribute('aria-describedby', 'Calcular simulação de compra de imóvel');
        
        // Configurar região live para resultados
        elements.resultsContent.setAttribute('aria-live', 'polite');
        elements.errorState.setAttribute('aria-live', 'assertive');
        
        // Adicionar hints de teclado
        elements.submitBtn.title = 'Pressione Enter para simular (Ctrl+Enter)';
        
        Logger.debug('✅ Acessibilidade configurada');
    }

    /**
     * Manipula o envio do formulário
     * @param {Event} event - Evento de submit
     */
    static async handleFormSubmit(event) {
        event.preventDefault();
        
        Logger.info('📊 Processando nova simulação...');
        
        // Limpar erros anteriores
        UIManager.clearError();
        FormValidator.clearErrors();

        // Obter dados do formulário
        const formData = new FormData(elements.form);
        
        // Validar dados
        const validation = FormValidator.validateForm(formData);
        if (!validation.isValid) {
            FormValidator.displayErrors(validation.errors);
            UIManager.showToast('Corrija os erros no formulário', 'error');
            return;
        }

        // Preparar dados para envio
        const simulationData = {
            valor_imovel: parseFloat(formData.get('valorImovel')),
            percentual_entrada: parseFloat(formData.get('percentualEntrada')),
            anos_contrato: parseInt(formData.get('anosContrato'))
        };

        try {
            // Definir estado de loading
            UIManager.setLoadingState(true);
            
            // Adicionar delay mínimo para melhor UX
            await new Promise(resolve => setTimeout(resolve, CONFIG.UI.LOADING_DELAY));

            // Enviar simulação
            const results = await ApiService.sendSimulation(simulationData);

            // Exibir resultados
            UIManager.displayResults(results);
            UIManager.showToast('Simulação calculada com sucesso!', 'success');
            
            // Log dos resultados
            Logger.info('✅ Simulação processada', {
                entrada: simulationData,
                resultado: results
            });

        } catch (error) {
            Logger.error('❌ Erro na simulação', error);
            UIManager.displayError(error.message);
            UIManager.showToast('Erro ao processar simulação', 'error');
        } finally {
            // Remover estado de loading
            UIManager.setLoadingState(false);
        }
    }

    /**
     * Manipula mudanças nos campos de entrada
     * @param {Event} event - Evento de input
     */
    static handleInputChange(event) {
        const field = event.target;
        
        // Remover erro do campo quando o usuário começar a digitar
        const errorElement = elements[`error${FormValidator.capitalizeFirst(field.name)}`];
        if (errorElement && errorElement.style.display !== 'none') {
            errorElement.style.display = 'none';
            field.classList.remove('error');
        }
    }
    
    /**
     * Manipula quando o campo perde o foco
     * @param {Event} event - Evento de blur
     */
    static handleInputBlur(event) {
        const input = event.target;
        
        // Formatar valor se necessário
        if (input.name === 'valorImovel' && input.value) {
            const value = parseFloat(input.value);
            if (!isNaN(value)) {
                input.value = value.toFixed(2);
            }
        }
    }
    
    /**
     * Manipula teclas de atalho
     * @param {Event} event - Evento de keydown
     */
    static handleKeydown(event) {
        // Ctrl+Enter para submeter formulário
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            elements.submitBtn.click();
        }
        
        // Escape para limpar formulário
        if (event.key === 'Escape') {
            this.clearForm();
        }
    }
    
    /**
     * Limpa o formulário
     */
    static clearForm() {
        elements.form.reset();
        FormValidator.clearErrors();
        UIManager.clearError();
        
        // Ocultar resultados
        elements.resultsContent.classList.remove('show');
        elements.resultsPlaceholder.style.display = 'flex';
        
        UIManager.showToast('Formulário limpo', 'info');
        Logger.info('Formulário limpo pelo usuário');
    }
}

/* ==========================
   UTILITÁRIOS
   ========================== */

/**
 * Adiciona estilos CSS para validação visual
 */
function addValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.valid {
            border-color: var(--success-color) !important;
            box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2) !important;
        }
        
        .form-group input.invalid {
            border-color: var(--warning-color) !important;
            box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.2) !important;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

/* ==========================
   INICIALIZAÇÃO
   ========================== */

// Aguardar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Adicionar estilos de validação
        addValidationStyles();
        
        // Inicializar aplicação
        await SimulatorApp.init();
        
    } catch (error) {
        Logger.error('Erro crítico na inicialização', error);
        
        // Fallback para erro crítico
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #e74c3c;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 9999;
        `;
        errorMessage.innerHTML = `
            <h3>❌ Erro ao carregar o simulador</h3>
            <p>Recarregue a página ou verifique o console para mais detalhes.</p>
        `;
        document.body.appendChild(errorMessage);
    }
});

// Exportar classes para uso global (se necessário)
window.SimulatorApp = SimulatorApp;
window.UIManager = UIManager;
window.FormValidator = FormValidator;
window.ApiService = ApiService;