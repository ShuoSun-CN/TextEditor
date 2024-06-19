
class AudioMenu {
    constructor() {
        this.title = '插入音频';
        this.tag = 'button';
        this.iconSvg = '<svg t="1637634971457" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7981" width="16" height="16"><path d="M983.792981 0H40.211115A40.5504 40.5504 0 0 0 0.002048 40.96v942.08c0 22.664533 17.954133 40.96 40.209067 40.96h943.581866a40.5504 40.5504 0 0 0 40.209067-40.96V40.96c0-22.664533-17.954133-40.96-40.209067-40.96z m-235.383466 207.530667v118.784H581.702315v326.8608c0 81.92-62.190933 148.548267-138.8544 148.548266-76.663467 0-138.8544-63.351467-138.8544-141.448533 0-78.097067 62.122667-141.448533 138.8544-141.448533 31.607467 0 60.074667-2.730667 83.3536 16.110933v-327.68l222.208 0.273067z" fill="#999999" p-id="7982"></path></svg>';
    }

    isActive() {
        return false;
    }

    getValue() {
        return '';
    }

    isDisabled() {
        return false;
    }

    exec(editor) {
        if (this.isDisabled(editor)) {
            return;
        }
        editor.emit('AudioMenuClick');
    }
}

export default AudioMenu;
