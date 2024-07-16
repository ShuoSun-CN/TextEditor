/*格式刷*/
import { SlateEditor, SlateText,SlateElement,SlateTransforms } from '@wangeditor/editor'
class MyPainter {
  constructor() {
    this.title = '格式刷'
     this.iconSvg = `<svg t="1719108164253" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4292" width="200" height="200"><path d="M853.333333 656.410256h-682.666666a52.512821 52.512821 0 0 1-52.512821-52.51282v-157.538462a52.512821 52.512821 0 0 1 52.512821-52.51282h210.051282v-315.076923a52.512821 52.512821 0 0 1 52.51282-52.512821h157.538462a52.512821 52.512821 0 0 1 52.51282 52.512821v315.076923h210.051282a52.512821 52.512821 0 0 1 52.512821 52.51282v157.538462a52.512821 52.512821 0 0 1-52.512821 52.51282z m0-210.051282h-262.564102v-367.589743h-157.538462v367.589743h-262.564102v157.538462h682.666666v-157.538462z" fill="#484D55" p-id="4293"></path><path d="M170.666667 603.897436v-157.538462h262.564102v-367.589743h157.538462v367.589743h262.564102v157.538462h-682.666666z" fill="#F6F7F8" p-id="4294"></path><path d="M170.666667 656.410256h682.666666v367.589744h-682.666666z" fill="#F6F7F8" p-id="4295"></path><path d="M853.333333 1024h-682.666666a52.512821 52.512821 0 0 1-52.512821-52.512821v-315.076923a52.512821 52.512821 0 0 1 52.512821-52.51282h682.666666a52.512821 52.512821 0 0 1 52.512821 52.51282v315.076923a52.512821 52.512821 0 0 1-52.512821 52.512821z m0-367.589744h-682.666666v315.076923h105.025641V840.205128a26.25641 26.25641 0 0 1 52.51282 0v131.282051h157.538462V787.692308a26.25641 26.25641 0 0 1 52.51282 0v183.794871h157.538462V840.205128a26.25641 26.25641 0 0 1 52.51282 0v131.282051h105.025641v-315.076923z" fill="#484D55" p-id="4296"></path></svg>`;
    this.tag = 'button';
    this.savedMarks = null;
    this.domId = null;
    this.editor = null;
    this.parentStyle = null;
  }
  //添加或者移除鼠标事件
  addorRemove = (type) => {
    const dom = document.body;
    if (type === 'add') {
      dom.addEventListener('mousedown', this.changeMouseDown);
      dom.addEventListener('mouseup', this.changeMouseup);
    } else {
      //赋值完需要做的清理工作
      this.savedMarks = undefined;
      dom.removeEventListener('mousedown', this.changeMouseDown);
      dom.removeEventListener('mouseup', this.changeMouseup);
      document.querySelector('#w-e-textarea-1').style.cursor = "auto"
    }
  }

    //处理重复键名值不同的情况
  handlerRepeatandNotStyle=(styles) => {
    const addStyles=styles[0];
    const notVal=[];
    for (const style of styles) {
      for (const key in style) {
        const value=style[key];
          // eslint-disable-next-line no-prototype-builtins
        if(!addStyles.hasOwnProperty(key)){
            addStyles[key]=value;
        }else{
          if(addStyles[key]!==value){
            notVal.push(key);
          }
        }
      }
    }
    for (const key of notVal) {
      delete addStyles[key];
    }
    return addStyles;
  }

   // 获取当前选中范围的父级节点
  getSelectionParentEle = (type,func) => {
      if(this.editor){
        const parentEntry = SlateEditor.nodes(this.editor, {
          match: node => SlateElement.isElement(node),
        });
       let styles=[];
        for (const [node] of parentEntry) {
         styles.push(this.editor.toDOMNode(node).style);//将node对应的DOM对应的style对象加入到数组
        }
        styles = styles.map((item) => {//处理不为空的style
          const newItem = {};
          for (const key in item) {
            const val = item[key];
             if(val!==''){
               newItem[key] = val;
             }
          }
          return newItem;
        });
        type==='get'?func(type,this.handlerRepeatandNotStyle(styles)):func(type);
      }
  }

  //获取或者设置父级样式
  getorSetparentStyle = (type,style) => {
    if(type === 'get'){
      this.parentStyle=style;//这里是个样式对象 例如{textAlign:'center'}
    }else{
      SlateTransforms.setNodes(this.editor, {...this.parentStyle}, {
        mode: 'highest' // 针对最高层级的节点
      })
    }
  }

  //这里是将svg转换为Base64格式
  addmouseStyle = () => {
    const icon = ``// 这里是给鼠标手势添加图标
    // 将字符串编码为Base64格式
    const base64String = btoa(icon);
    // 生成数据URI
    const dataUri = `data:image/svg+xml;base64,${base64String}`;
    // 将数据URI应用于鼠标图标
    document.querySelector('#w-e-textarea-1').style.cursor = `url('${dataUri}'), auto`;
  }
  changeMouseDown = () => { }//鼠标落下

  changeMouseup = () => {//鼠标抬起
    if (this.editor) {
      const editor = this.editor;
      const selectTxt = editor.getSelectionText();//获取文本是否为null
      if (this.savedMarks && selectTxt) {
        //先改变父节点样式
        this.getSelectionParentEle('set', this.getorSetparentStyle);
        // 获取所有 text node
        const nodeEntries = SlateEditor.nodes(editor, {//nodeEntries返回的是一个迭代器对象
          match: (n) => SlateText.isText(n),//这里是筛选一个节点是否是 text
          universal: true,//当universal为 true 时，Editor.nodes会遍历整个文档，包括根节点和所有子节点，以匹配满足条件的节点。当universal为 false 时，Editor.nodes只会在当前节点的直接子节点中进行匹配。
        });
        // 先清除选中节点的样式
        for (const node of nodeEntries) {
          const n = node[0];//{text:xxxx}
          const keys = Object.keys(n);
          keys.forEach((key) => {
            if (key === 'text') {// 保留 text 属性
              return;
            }
            // 其他属性，全部清除
            SlateEditor.removeMark(editor, key);
          });
        }
        // 再赋值新样式
        for (const key in this.savedMarks) {
          if (Object.hasOwnProperty.call(this.savedMarks, key)) {
            const value = this.savedMarks[key];
            editor.addMark(key, value);
          }
        }
        this.addorRemove('remove');
      }
    }

  }

  getValue() {
    return 'MyPainter'; // 标识格式刷菜单
  }

  isActive() {
    return false;
  }

  isDisabled() {//是否禁用
    return false;
  }
  exec(editor) {//当菜单点击后触发
   this.editor = editor;
   this.domId = editor.id.split('-')[1] ? `w-e-textarea-${editor.id.split('-')[1]}` : undefined;
    if (this.isDisabled(editor)) return;
    if (editor.isEmpty() || editor.getHtml() == '<p><br></p>' || editor.getSelectionText() == '') return;//这里是对没有选中或者没内容做的处理
    this.savedMarks = SlateEditor.marks(editor);// 获取当前选中文本的样式
    this.getSelectionParentEle('get', this.getorSetparentStyle);//获取父节点样式并赋值
    this.addmouseStyle();//点击之后给鼠标添加样式
    this.addorRemove('add');//处理添加和移除事件函数
  }
}
export default MyPainter;