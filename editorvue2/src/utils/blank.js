class blank {
    constructor(editor) {
        this.title = '                          ';
        this.tag = 'button';
        this.editor = editor;
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

    async exec(editor) {
        if (this.isDisabled(editor)) {
            return;
        }

    }
}

export default blank;
