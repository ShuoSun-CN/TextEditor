import AudioMenu from "@/utils/AudioMenu";
import MyOCRModalMenu from "@/utils/MyOCR";
import MyPolishing from "@/utils/MyPolishing";
import MyFormatting from "@/utils/MyFormatting";
import { Boot } from "@wangeditor/editor";
import MyVideoExtractModalMenu from "@/utils/MyVideoExtract";

const MenusList = [
    {
        key: 'AudioMenu',
        class: AudioMenu,
        index: 21 // 菜单要在工具栏显示的位置
    },
    {
        key: 'MyOCR',
        class: MyOCRModalMenu,
        index: 22 // 菜单要在工具栏显示的位置
    },
    {
        key: 'MyPolishing',
        class: MyPolishing,
        index: 23 // 菜单要在工具栏显示的位置
    },
    {
        key:'MyFormatting',
        class:MyFormatting,
        index:24
    },
    {
        key:'MyVideoExtractModelMenu',
        class:MyVideoExtractModalMenu,
        index:25
    },

];

const registerMenu = function (editor, toolbarConfig) {
    const allRegisterMenu = editor.getAllMenuKeys(); // 获取所有已注册的菜单
    let keys = [];
    for (let item of MenusList) {
        if (allRegisterMenu.indexOf(item.key) < 0) { // 如果未注册，则注册
            const menuObj = {
                key: item.key,
                factory() {
                    return new item.class();
                }
            };
            Boot.registerMenu(menuObj);
        }
        keys.push(item.key);
    }
    toolbarConfig.insertKeys = {
        index: MenusList[0].index,
        keys: keys
    };
};

export default registerMenu;
