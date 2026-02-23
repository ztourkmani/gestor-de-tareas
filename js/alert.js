
const AlertSystem = {
    container: null,
    
    init() {
        this.container = document.getElementById('alert-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'alert-container';
            this.container.id = 'alert-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(title, message, type = 'info', duration = 5000) {
        if (!this.container) this.init();
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        alert.innerHTML = `
            <div class="alert-icon">
                <i class="fas ${icons[type] || icons.info}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">${title}</div>
                <div class="alert-message">${message}</div>
            </div>
            <div class="alert-close">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        // Close button
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => this.close(alert));
        
        // Auto close
        if (duration > 0) {
            setTimeout(() => this.close(alert), duration);
        }
        
        // Click on alert to close
        alert.addEventListener('click', (e) => {
            if (e.target === alert || e.target.classList.contains('alert-content')) {
                this.close(alert);
            }
        });
        
        this.container.appendChild(alert);
        
        // Limitar número de alertas
        if (this.container.children.length > 5) {
            this.close(this.container.children[0]);
        }
        
        return alert;
    },
    
    close(alert) {
        alert.classList.add('alert-exit');
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 300);
    },
    
    success(title, message, duration = 5000) {
        return this.show(title, message, 'success', duration);
    },
    
    error(title, message, duration = 5000) {
        return this.show(title, message, 'error', duration);
    },
    
    warning(title, message, duration = 5000) {
        return this.show(title, message, 'warning', duration);
    },
    
    info(title, message, duration = 5000) {
        return this.show(title, message, 'info', duration);
    },
    
    // Confirm dialog personalizado
    confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const {
                confirmText = 'Confirmar',
                cancelText = 'Cancelar',
                type = 'warning'
            } = options;
            
            // Crear dialog
            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            
            const icons = {
                warning: 'fa-exclamation-triangle',
                danger: 'fa-trash-alt',
                info: 'fa-question-circle'
            };
            
            dialog.innerHTML = `
                <div class="confirm-content">
                    <div class="confirm-header">
                        <i class="fas ${icons[type] || icons.warning}" style="color: ${type === 'danger' ? 'var(--danger)' : 'var(--warning)'}"></i>
                        <h3>${title}</h3>
                    </div>
                    <div class="confirm-body">
                        <p>${message}</p>
                    </div>
                    <div class="confirm-footer">
                        <button class="btn-secondary" id="confirm-cancel">${cancelText}</button>
                        <button class="${type === 'danger' ? 'btn-danger' : 'btn-primary'}" id="confirm-ok">${confirmText}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            // Manejadores
            const cancelBtn = dialog.querySelector('#confirm-cancel');
            const okBtn = dialog.querySelector('#confirm-ok');
            
            const cleanup = () => {
                dialog.remove();
            };
            
            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
            
            okBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });
            
          
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    document.removeEventListener('keydown', escHandler);
                    resolve(false);
                }
            };
            
            document.addEventListener('keydown', escHandler);
            
          
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    cleanup();
                    document.removeEventListener('keydown', escHandler);
                    resolve(false);
                }
            });
        });
    }
};


document.addEventListener('DOMContentLoaded', () => {
    AlertSystem.init();
});