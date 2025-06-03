// UI Components Module - CORRIGIDO para exibir modal de download completo
class UIComponents {
    constructor() {
        this.modals = {};
        this.notifications = [];
        this.init();
    }

    init() {
        this.createModals();
        this.setupEventListeners();
        console.log('🎨 UI Components inicializados');
    }

    createModals() {
        this.createProcessingModal();
        this.createDownloadModal();
        this.createNotificationContainer();
    }

    createProcessingModal() {
        const modal = document.createElement('div');
        modal.id = 'processingModal';
        modal.className = 'modal processing-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🔄 Processando Arquivo</h3>
                </div>
                <div class="modal-body">
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="progress-text" id="progressText">Iniciando...</div>
                        <div class="progress-percentage" id="progressPercentage">0%</div>
                    </div>
                    <div class="processing-animation">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modals.processing = modal;
    }

    createDownloadModal() {
        const modal = document.createElement('div');
        modal.id = 'downloadModal';
        modal.className = 'modal download-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>✅ Arquivo Convertido com Sucesso!</h3>
                    <button class="modal-close" onclick="UI.hideDownloadModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="download-info" id="downloadInfo">
                        <!-- Informações do arquivo serão inseridas aqui -->
                    </div>
                    
                    <div class="download-actions">
                        <button class="btn btn-primary btn-download" id="downloadBtn">
                            📥 Baixar Arquivo
                        </button>
                    </div>
                    
                    <div class="online-editors">
                        <h4>🌐 Ou abra online para editar:</h4>
                        <div class="editor-buttons">
                            <button class="btn btn-editor google-docs" id="googleDocsBtn">
                                📝 Google Docs
                            </button>
                            <button class="btn btn-editor office-online" id="officeOnlineBtn">
                                📄 Office Online
                            </button>
                            <button class="btn btn-editor onlyoffice" id="onlyOfficeBtn">
                                📋 OnlyOffice
                            </button>
                            <button class="btn btn-editor adobe" id="adobeBtn">
                                🔴 Adobe Acrobat
                            </button>
                            <button class="btn btn-editor zoho" id="zohoBtn">
                                📊 Zoho Writer
                            </button>
                            <button class="btn btn-editor notion" id="notionBtn">
                                📓 Notion
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modals.download = modal;
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
        this.notificationContainer = container;
    }

    setupEventListeners() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    // PROCESSING MODAL
    showProcessingModal() {
        if (this.modals.processing) {
            this.modals.processing.style.display = 'flex';
            this.updateProgress(0, 'Iniciando processamento...');
        }
    }

    hideProcessingModal() {
        if (this.modals.processing) {
            this.modals.processing.style.display = 'none';
        }
    }

    updateProgress(percentage, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressPercentage = document.getElementById('progressPercentage');

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = text;
        }
        if (progressPercentage) {
            progressPercentage.textContent = `${percentage}%`;
        }
    }

    // DOWNLOAD MODAL - CORRIGIDO
    showDownloadModal(fileData) {
        console.log('🎯 Exibindo modal de download:', fileData);
        
        if (!this.modals.download) {
            console.error('❌ Modal de download não encontrado');
            return;
        }

        // Update download info
        const downloadInfo = document.getElementById('downloadInfo');
        if (downloadInfo && fileData) {
            downloadInfo.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">📄</div>
                    <div class="file-details">
                        <h4>${fileData.fileName}</h4>
                        <p><strong>Arquivo Original:</strong> ${fileData.originalFile.name}</p>
                        <p><strong>Tamanho:</strong> ${this.formatFileSize(fileData.size)}</p>
                        <p><strong>Tipo:</strong> ${fileData.mimeType}</p>
                        <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    </div>
                </div>
            `;
        }

        // Setup download button
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            // Remove existing listeners
            const newDownloadBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);
            
            // Add new listener
            newDownloadBtn.addEventListener('click', () => {
                console.log('🔽 Botão de download clicado');
                this.downloadFile(fileData);
            });
        }

        // Setup editor buttons
        this.setupEditorButtons(fileData);

        // Show modal
        this.modals.download.style.display = 'flex';
        
        console.log('✅ Modal de download exibido com sucesso');
    }

    setupEditorButtons(fileData) {
        const editorButtons = {
            'googleDocsBtn': () => this.openInGoogleDocs(fileData),
            'officeOnlineBtn': () => this.openInOfficeOnline(fileData),
            'onlyOfficeBtn': () => this.openInOnlyOffice(fileData),
            'adobeBtn': () => this.openInAdobe(fileData),
            'zohoBtn': () => this.openInZoho(fileData),
            'notionBtn': () => this.openInNotion(fileData)
        };

        Object.entries(editorButtons).forEach(([buttonId, handler]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                // Remove existing listeners
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Add new listener
                newButton.addEventListener('click', handler);
            }
        });
    }

    hideDownloadModal() {
        if (this.modals.download) {
            this.modals.download.style.display = 'none';
        }
    }

    // DOWNLOAD FUNCTION - CORRIGIDA
    downloadFile(fileData) {
        try {
            console.log('🔽 Iniciando download do arquivo:', fileData.fileName);
            
            if (!fileData || !fileData.content) {
                throw new Error('Dados do arquivo inválidos');
            }

            // Create blob with correct content
            const blob = new Blob([fileData.content], { 
                type: fileData.mimeType 
            });
            
            console.log('📦 Blob criado:', {
                size: blob.size,
                type: blob.type
            });
            
            // Create download URL
            const url = URL.createObjectURL(blob);
            
            // Create temporary download link
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = fileData.fileName;
            downloadLink.style.display = 'none';
            
            // Add to DOM, click, and remove
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Clean up URL
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
            
            // Show success notification
            this.showNotification(`✅ Download iniciado: ${fileData.fileName}`, 'success');
            
            console.log('✅ Download realizado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro no download:', error);
            this.showNotification('❌ Erro ao fazer download do arquivo', 'error');
        }
    }

    // EDITOR INTEGRATIONS
    openInGoogleDocs(fileData) {
        this.showNotification('🔄 Redirecionando para Google Docs...', 'info');
        setTimeout(() => {
            window.open('https://docs.google.com/document/?usp=docs_alc&authuser=0', '_blank');
        }, 1000);
    }

    openInOfficeOnline(fileData) {
        this.showNotification('🔄 Redirecionando para Office Online...', 'info');
        setTimeout(() => {
            window.open('https://office.live.com/start/Word.aspx', '_blank');
        }, 1000);
    }

    openInOnlyOffice(fileData) {
        this.showNotification('🔄 Redirecionando para OnlyOffice...', 'info');
        setTimeout(() => {
            window.open('https://personal.onlyoffice.com/', '_blank');
        }, 1000);
    }

    openInAdobe(fileData) {
        this.showNotification('🔄 Redirecionando para Adobe Acrobat...', 'info');
        setTimeout(() => {
            window.open('https://acrobat.adobe.com/us/en/', '_blank');
        }, 1000);
    }

    openInZoho(fileData) {
        this.showNotification('🔄 Redirecionando para Zoho Writer...', 'info');
        setTimeout(() => {
            window.open('https://writer.zoho.com/', '_blank');
        }, 1000);
    }

    openInNotion(fileData) {
        this.showNotification('🔄 Redirecionando para Notion...', 'info');
        setTimeout(() => {
            window.open('https://www.notion.so/', '_blank');
        }, 1000);
    }

    // NOTIFICATIONS
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        this.notificationContainer.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);

        // Add to notifications array
        this.notifications.push(notification);

        console.log(`📢 Notificação [${type}]: ${message}`);
    }

    // UTILITY METHODS
    hideAllModals() {
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Tool selection visual feedback
    selectTool(toolElement, toolId) {
        // Remove previous selections
        document.querySelectorAll('.tool-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Add selection to current tool
        if (toolElement) {
            toolElement.classList.add('selected');
        }

        // Show notification
        const toolNames = {
            'pdf-to-word': 'PDF para Word',
            'word-to-pdf': 'Word para PDF',
            'pdf-ocr': 'PDF OCR',
            'ocr-to-pdf': 'OCR para PDF',
            'unlock-pdf': 'Desbloquear PDF',
            'remove-watermark': 'Remover Marca D\'água',
            'compress-pdf': 'Comprimir PDF',
            'merge-pdf': 'Juntar PDF',
            'split-pdf': 'Dividir PDF',
            'rotate-pdf': 'Girar PDF',
            'edit-pdf': 'Editar PDF',
            'pdf-to-excel': 'PDF para Excel',
            'excel-to-pdf': 'Excel para PDF',
            'pdf-to-powerpoint': 'PDF para PowerPoint',
            'google-docs': 'Abrir no Google Docs'
        };

        const toolName = toolNames[toolId] || toolId;
        this.showNotification(`🔧 Ferramenta selecionada: ${toolName}`, 'success');

        console.log(`🔧 Ferramenta selecionada: ${toolId}`);
    }

    // Reset UI state
    reset() {
        this.hideAllModals();
        
        // Clear notifications
        if (this.notificationContainer) {
            this.notificationContainer.innerHTML = '';
        }
        this.notifications = [];

        // Reset tool selections
        document.querySelectorAll('.tool-card').forEach(card => {
            card.classList.remove('selected');
        });

        console.log('🔄 UI resetada');
    }
}

// Export for global use
window.UIComponents = UIComponents;

