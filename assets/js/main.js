// Main.js - Arquivo principal da aplicação
class BestOfThePDF {
    constructor() {
        this.fileHandler = null;
        this.ui = null;
        this.converters = null;
        this.currentTool = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando BestOfThePDF...');
        
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize components
            this.initializeComponents();
            this.setupEventListeners();
            this.setupToolSelection();
            this.showWelcomeMessage();
            
            console.log('✅ BestOfThePDF inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.handleInitializationError(error);
        }
    }

    initializeComponents() {
        // Initialize UI Components
        this.ui = new UIComponents();
        window.UI = this.ui; // Global access
        
        // Initialize File Handler
        this.fileHandler = new FileHandler();
        window.FileHandler = this.fileHandler; // Global access
        
        // Initialize Converters
        this.converters = new Converters();
        window.Converters = this.converters; // Global access
        
        console.log('🔧 Componentes inicializados');
    }

    setupEventListeners() {
        // Tool card clicks
        document.addEventListener('click', (e) => {
            const toolCard = e.target.closest('.tool-card');
            if (toolCard) {
                const toolId = toolCard.getAttribute('data-tool');
                if (toolId) {
                    this.selectTool(toolCard, toolId);
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window events
        window.addEventListener('beforeunload', (e) => {
            this.handleBeforeUnload(e);
        });

        // Online/offline detection
        window.addEventListener('online', () => {
            this.ui.showNotification('🌐 Conexão restaurada', 'success');
        });

        window.addEventListener('offline', () => {
            this.ui.showNotification('📡 Sem conexão com a internet', 'warning');
        });

        console.log('👂 Event listeners configurados');
    }

    setupToolSelection() {
        // Add data-tool attributes to tool cards
        const toolMappings = {
            'PDF para Word': 'pdf-to-word',
            'Word para PDF': 'word-to-pdf',
            'PDF OCR': 'pdf-ocr',
            'OCR para PDF': 'ocr-to-pdf',
            'Desbloquear PDF': 'unlock-pdf',
            'Remover Marca D\'água': 'remove-watermark',
            'Comprimir PDF': 'compress-pdf',
            'PDF para Excel': 'pdf-to-excel',
            'Juntar PDF': 'merge-pdf',
            'Dividir PDF': 'split-pdf',
            'Girar PDF': 'rotate-pdf',
            'Abrir no Google Docs': 'google-docs'
        };

        document.querySelectorAll('.tool-card').forEach(card => {
            const titleElement = card.querySelector('.tool-title, h4');
            if (titleElement) {
                const title = titleElement.textContent.trim();
                const toolId = toolMappings[title];
                if (toolId) {
                    card.setAttribute('data-tool', toolId);
                }
            }
        });

        console.log('🔧 Ferramentas configuradas');
    }

    selectTool(toolElement, toolId) {
        this.currentTool = toolId;
        
        // Update UI
        this.ui.selectTool(toolElement, toolId);
        
        // Update file handler
        this.fileHandler.setCurrentTool(toolId);
        
        // Special handling for Google Docs
        if (toolId === 'google-docs') {
            this.openGoogleDocs();
            return;
        }
        
        // Update upload area message
        this.updateUploadAreaMessage(toolId);
        
        console.log(`🎯 Ferramenta selecionada: ${toolId}`);
    }

    updateUploadAreaMessage(toolId) {
        const uploadTitle = document.querySelector('.upload-title');
        const uploadSubtitle = document.querySelector('.upload-subtitle');
        
        if (uploadTitle && uploadSubtitle) {
            const messages = {
                'pdf-to-word': {
                    title: 'Arraste seus arquivos PDF aqui',
                    subtitle: 'ou clique para selecionar arquivos PDF'
                },
                'word-to-pdf': {
                    title: 'Arraste seus arquivos Word aqui',
                    subtitle: 'ou clique para selecionar arquivos DOC/DOCX'
                },
                'pdf-ocr': {
                    title: 'Arraste seus PDFs escaneados aqui',
                    subtitle: 'ou clique para selecionar PDFs para OCR'
                },
                'pdf-to-excel': {
                    title: 'Arraste seus PDFs com tabelas aqui',
                    subtitle: 'ou clique para selecionar PDFs para Excel'
                }
            };

            const message = messages[toolId] || {
                title: 'Arraste seus arquivos aqui',
                subtitle: 'ou clique para selecionar'
            };

            uploadTitle.textContent = message.title;
            uploadSubtitle.textContent = message.subtitle;
        }
    }

    openGoogleDocs() {
        this.ui.showNotification('🔄 Redirecionando para Google Docs...', 'info');
        setTimeout(() => {
            window.open('https://docs.google.com/document/?usp=docs_alc&authuser=0', '_blank');
        }, 1000);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + O - Open file
        if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
            e.preventDefault();
            if (this.fileHandler && this.fileHandler.fileInput) {
                this.fileHandler.fileInput.click();
            }
        }

        // Escape - Close modals
        if (e.key === 'Escape') {
            this.ui.hideAllModals();
        }

        // Ctrl/Cmd + R - Reset
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.reset();
        }
    }

    handleBeforeUnload(e) {
        // Warn user if there are ongoing operations
        if (this.hasOngoingOperations()) {
            e.preventDefault();
            e.returnValue = 'Há operações em andamento. Tem certeza que deseja sair?';
            return e.returnValue;
        }
    }

    hasOngoingOperations() {
        // Check if processing modal is visible
        const processingModal = document.getElementById('processingModal');
        return processingModal && processingModal.style.display === 'flex';
    }

    showWelcomeMessage() {
        // Show welcome notification
        setTimeout(() => {
            this.ui.showNotification('✅ BestOfThePDF carregado! Selecione uma ferramenta para começar.', 'success', 3000);
        }, 1000);
    }

    handleInitializationError(error) {
        console.error('Erro na inicialização:', error);
        
        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            text-align: center;
            font-family: Arial, sans-serif;
        `;
        errorMessage.innerHTML = `
            <h3>❌ Erro de Inicialização</h3>
            <p>Ocorreu um erro ao carregar a aplicação.</p>
            <p>Por favor, recarregue a página.</p>
            <button onclick="window.location.reload()" style="
                background: white;
                color: #ff4444;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">Recarregar</button>
        `;
        document.body.appendChild(errorMessage);
    }

    // Public methods
    reset() {
        this.currentTool = null;
        
        if (this.fileHandler) {
            this.fileHandler.reset();
        }
        
        if (this.ui) {
            this.ui.reset();
        }
        
        // Reset upload area message
        const uploadTitle = document.querySelector('.upload-title');
        const uploadSubtitle = document.querySelector('.upload-subtitle');
        
        if (uploadTitle && uploadSubtitle) {
            uploadTitle.textContent = 'Arraste seus arquivos aqui';
            uploadSubtitle.textContent = 'ou clique para selecionar';
        }
        
        this.ui.showNotification('🔄 Aplicação resetada', 'info');
        console.log('🔄 Aplicação resetada');
    }

    getCurrentTool() {
        return this.currentTool;
    }

    getVersion() {
        return '3.0.0';
    }

    getInfo() {
        return {
            name: 'BestOfThePDF',
            version: this.getVersion(),
            description: 'Ferramentas PDF Profissionais',
            author: 'BestOfThePDF Team',
            website: 'https://bestofthepdf.com',
            features: [
                'Conversão PDF para Word',
                'Conversão Word para PDF',
                'OCR de PDFs',
                'Conversão PDF para Excel',
                'Desbloqueio de PDFs',
                'Remoção de marca d\'água',
                'Compressão de PDFs',
                'União e divisão de PDFs',
                'Rotação de PDFs',
                'Integração com editores online'
            ]
        };
    }

    // Analytics and monitoring
    trackUsage(action, data = {}) {
        const event = {
            action: action,
            tool: this.currentTool,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            data: data
        };

        // Log to console (in production, send to analytics service)
        console.log('📊 Analytics:', event);

        // Store in local storage for debugging
        const analytics = Utils.getLocalStorage('analytics', []);
        analytics.push(event);
        
        // Keep only last 100 events
        if (analytics.length > 100) {
            analytics.splice(0, analytics.length - 100);
        }
        
        Utils.setLocalStorage('analytics', analytics);
    }

    // Performance monitoring
    measurePerformance(name, fn) {
        return Utils.measurePerformance(name, fn);
    }

    async measureAsyncPerformance(name, fn) {
        return Utils.measureAsyncPerformance(name, fn);
    }

    // Error reporting
    reportError(error, context = '') {
        Utils.handleError(error, context);
        
        // Show user-friendly error message
        if (this.ui) {
            this.ui.showNotification('❌ Ocorreu um erro. Tente novamente.', 'error');
        }
    }

    // Feature detection and compatibility
    checkCompatibility() {
        const requiredFeatures = [
            'localStorage',
            'fileAPI',
            'dragAndDrop',
            'clipboard'
        ];

        const compatibility = {};
        let allSupported = true;

        requiredFeatures.forEach(feature => {
            const supported = Utils.supportsFeature(feature);
            compatibility[feature] = supported;
            if (!supported) {
                allSupported = false;
            }
        });

        if (!allSupported) {
            console.warn('⚠️ Algumas funcionalidades podem não estar disponíveis:', compatibility);
            
            if (this.ui) {
                this.ui.showNotification('⚠️ Seu navegador pode não suportar todas as funcionalidades', 'warning');
            }
        }

        return compatibility;
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BestOfThePDF();
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('❌ Erro global:', e.error);
    if (window.app) {
        window.app.reportError(e.error, 'Global error handler');
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promise rejeitada:', e.reason);
    if (window.app) {
        window.app.reportError(e.reason, 'Unhandled promise rejection');
    }
});

// Export for global access
window.BestOfThePDF = BestOfThePDF;

