
class AudioMenu {
    constructor() {
        this.title = '插入音频';
        this.tag = 'button';
        this.iconSvg = '<svg t="1717032966179" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2621" width="200" height="200"><path d="M111.8 596c-18.5 30.8-20.8 71.1-6.9 119.7 13.7 48.1 37.2 81.2 69.7 98.3 17.3 9.1 35 12.6 50.6 13.4-16.5-40.5-47.5-134.4-55.7-279.2-16.8 7.1-41.7 21.2-57.7 47.8zM854.8 548.4C846.3 683.9 814 785 798.2 827.3c15.9-0.7 34-4.2 51.5-13.5 32.3-17.2 55.7-50.2 69.4-98.2 13.9-48.7 11.6-88.9-6.9-119.7-15.9-26.3-40.6-40.4-57.4-47.5z" fill="#A0D3F8" p-id="2622"></path><path d="M939.4 579.1c-24.1-39.8-62.8-57.6-82.9-64.4 0.1-1.9 0.1-3.9 0.1-5.8 0-190-154.6-344.6-344.6-344.6S167.4 318.9 167.4 508.9c0 1.9 0 3.9 0.1 5.8-20.2 6.9-58.8 24.6-82.9 64.4-23.4 38.7-27 87.7-10.5 145.4 16.2 56.8 45 96.5 85.5 117.8 58.8 31 120.1 11.2 122.7 10.3 8.2-2.7 12.8-11.5 10.3-19.8l-6.5-21.8c-5.8-20.3-16.6-62-24.5-112.6-16.3-104.3-20.4-246.5 53-332.2 43.2-50.4 109.6-76 197.5-76s154.3 25.6 197.5 76c73.3 85.7 69.3 228 53 332.2-7.9 50.6-18.8 92.3-24.4 112.4l-6.6 22c-2.5 8.3 2.1 17 10.3 19.8 1.5 0.5 21.7 7 49.6 7 21.5 0 47.5-3.9 73.1-17.4 40.5-21.4 69.3-61 85.5-117.8 16.2-57.6 12.7-106.5-10.7-145.3zM174.6 814c-32.5-17.1-55.9-50.2-69.7-98.3-13.9-48.6-11.5-88.9 6.9-119.7 15.9-26.5 40.9-40.7 57.7-47.7 8.2 144.8 39.2 238.7 55.7 279.2-15.6-0.9-33.3-4.3-50.6-13.5z m600.1-16.5c6.3-24.7 13.5-57 19.3-94.1 17.4-110.9 21-263.1-60.3-358-49.5-57.9-124.1-87.2-221.8-87.2s-172.3 29.3-221.8 87.2c-81.2 95-77.6 247.1-60.2 358 6.9 44.1 15.9 81.5 22.2 105-16.6-43.2-46-137.8-51.8-280.8v-0.1-0.2l-0.4-5.4c-0.3-4.3-0.6-8.6-0.6-13 0-172.4 140.2-312.6 312.6-312.6s312.6 140.2 312.6 312.6c0 4.4-0.3 8.7-0.6 13l-0.4 5.4c0 0.8 0.2 1.5 0.3 2.2-5.5 121.4-32.1 217.5-49.1 268z m144.4-81.8c-13.7 48-37 81-69.4 98.2-17.6 9.3-35.7 12.7-51.5 13.5 15.9-42.4 48.2-143.5 56.6-278.9 16.8 7.1 41.5 21.2 57.3 47.6 18.5 30.7 20.9 71 7 119.6z" fill="#108EE9" p-id="2623"></path><path d="M368 605.5c-4.4 0-8 3.6-8 8v131.2c0 4.4 3.6 8 8 8s8-3.6 8-8V613.5c0-4.5-3.6-8-8-8zM320 653.5c-4.4 0-8 3.6-8 8v35.2c0 4.4 3.6 8 8 8s8-3.6 8-8v-35.2c0-4.5-3.6-8-8-8zM416 541.5c-4.4 0-8 3.6-8 8v259.2c0 4.4 3.6 8 8 8s8-3.6 8-8V549.5c0-4.5-3.6-8-8-8zM464 589.5c-4.4 0-8 3.6-8 8v163.2c0 4.4 3.6 8 8 8s8-3.6 8-8V597.5c0-4.5-3.6-8-8-8zM512 557.5c-4.4 0-8 3.6-8 8v227.2c0 4.4 3.6 8 8 8s8-3.6 8-8V565.5c0-4.5-3.6-8-8-8zM560 589.5c-4.4 0-8 3.6-8 8v163.2c0 4.4 3.6 8 8 8s8-3.6 8-8V597.5c0-4.5-3.6-8-8-8zM608 541.5c-4.4 0-8 3.6-8 8v259.2c0 4.4 3.6 8 8 8s8-3.6 8-8V549.5c0-4.5-3.6-8-8-8zM656 605.5c-4.4 0-8 3.6-8 8v131.2c0 4.4 3.6 8 8 8s8-3.6 8-8V613.5c0-4.5-3.6-8-8-8zM704 653.5c-4.4 0-8 3.6-8 8v35.2c0 4.4 3.6 8 8 8s8-3.6 8-8v-35.2c0-4.5-3.6-8-8-8z" fill="#108EE9" p-id="2624"></path></svg>';
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