class VideoMenu {
    constructor() {
        this.title = '插入视频';
        this.tag = 'button';
        this.iconSvg = '<svg viewBox="0 0 1024 1024"><path d="M981.184 160.096C837.568 139.456 678.848 128 512 128S186.432 139.456 42.816 160.096C15.296 267.808 0 386.848 0 512s15.264 244.16 42.816 351.904C186.464 884.544 345.152 896 512 896s325.568-11.456 469.184-32.096C1008.704 756.192 1024 637.152 1024 512s-15.264-244.16-42.816-351.904zM384 704V320l320 192-320 192z"></path></svg>';
    }

    isActive() { // 保持默认
        return false;
    }

    getValue() { // 保持默认
        return '';
    }

    isDisabled() { // 保持默认
        return false;
    }

    exec(editor) { // 菜单点击事件，这里将点击事件暴露出去
        if (this.isDisabled(editor)) {
            return;
        }
        editor.emit('VideoMenuClick');
    }
}

export default VideoMenu;
