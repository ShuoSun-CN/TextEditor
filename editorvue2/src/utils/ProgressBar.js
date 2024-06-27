class ProgressBar {
    constructor() {
        this.progressBar = null;
    }

    showProgressBar() {
        if (!this.progressBar) {
            this.progressBar = document.createElement('div');
            this.progressBar.id = 'progressBar';
            this.progressBar.style.width = '0%';
            this.progressBar.style.height = '6px';
            this.progressBar.style.backgroundColor = '#6991c7';
            this.progressBar.style.position = 'fixed';
            this.progressBar.style.top = '0';
            this.progressBar.style.left = '0';
            this.progressBar.style.zIndex = '1000';
            document.body.appendChild(this.progressBar);
        }
    }

    updateProgressBar(percent) {
        if (this.progressBar) {
            this.progressBar.style.width = `${percent}%`;
        }
    }

    hideProgressBar() {
        if (this.progressBar) {
            this.progressBar.remove();
            this.progressBar = null;
        }
    }
}

export default ProgressBar;
