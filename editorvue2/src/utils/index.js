//功能注册
import AudioMenu from "@/utils/AudioMenu";
import ImageMenu from "@/utils/ImageMenu";
import VideoMenu from "@/utils/VideoMenu";
import MyOCR from "@/utils/MyOCR";
import MyPolishing from "@/utils/MyPolishing";
import MyFormatting from "@/utils/MyFormatting";
import { Boot } from "@wangeditor/editor";
import MyVideoExtract from "@/utils/MyVideoExtract";
import MyAudioExtract from "@/utils/MyAudioExtract";
import MyPainter from "@/utils/MyPainter";
import MindMap from "@/utils/MindMap";
import MindTable from "@/utils/MindTable";
import ObjectionDetect from "@/utils/ObjectionDetect";
import dataVisual from "@/utils/dataVisualization";
const MenusList = [

    {
        key:'ImageMenu',
        class:ImageMenu,
    },
    {
        key:'VideoMenu',
        class:VideoMenu,

    },
    {
        key: 'AudioMenu',
        class: AudioMenu,

    },
    {
        key: 'MyOCR',
        class: MyOCR,
    },
    {
        key:'MyVideoExtract',
        class:MyVideoExtract,
    },
    {
        key:'MyAudioExtract',
        class:MyAudioExtract,
    },
    {
        key: 'MyPolishing',
        class: MyPolishing,
    },
    {
        key:'MyFormatting',
        class:MyFormatting,
    },
    {
        key:'MyPainter',
        class:MyPainter,
    },
    {
        key:'MindMap',
        class:MindMap,
    },
    {
        key:'MindTable',
        class:MindTable,
    },
    {
        key:'objectionDetect',
        class:ObjectionDetect,
    },
    {
        key:'datavision',
        class:dataVisual,
    }
];

const registerMenu = function (editor) {
    const allRegisterMenu = editor.getAllMenuKeys(); // 获取所有已注册的菜单
    let keys = [];
    for (let item of MenusList) {
        if (allRegisterMenu.indexOf(item.key) < 0) { // 如果未注册，则注册
            const menuObj = {
                key: item.key,
                factory() {
                    return new item.class(editor);
                }
            };
            Boot.registerMenu(menuObj);
        }
        keys.push(item.key);
    }
/*   toolbarConfig.insertKeys = {
        //index: MenusList[0].index,
        keys: keys
    };*/
};
export default registerMenu;
