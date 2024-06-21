<template>
  <div>
    <div class="editor-footer">
      <button @click="saveEditor" class="editor-button">保存</button>
      <button @click="exitEditor" class="editor-button">退出</button>
    </div>
    <div style="border: 1px solid #06164d;">
      <Toolbar
        style="border-bottom: 1px solid rgba(102,117,169,0.75)"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
      />
    </div>
    <span class="wordNumber">{{ TiLength }}/{{ maxChars }}</span>
    <div>
      <p v-if="warnShow" class="warnText">
        {{ changedMaxLen ? '编辑内容不能超过5000个字!' : '编辑内容不能超过1000个字!' }}
      </p>
    </div>

  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import registerMenu from "@/utils";

export default {
  name: 'TextEditor',
  components: { Editor, Toolbar },
  props: {
    contents: {
      type: String,
      default: '',
    },
    changeMaxLen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editor: null,
      html: this.contents || '<p>hello</p>',
      toolbarConfig: {
        insertKeys: {
          keys: [
            '|', 'myMenuOCR','myMenuImage', 'myVideoImage','myMenuVideoExtract', 'myMenuAudioExtract', '|',
            'myMenuFormatting', '|', 'myMenuPolishing', '|'
          ]
        },
        excludeKeys: ['group-image','group-video'],
      },
      editorConfig: {
        MENU_CONF: {
        },
        placeholder: '请输入内容...',
        readOnly: false,
        hoverbarKeys:{
          'text': {
            menuKeys: [ 'insertLink', 'MyPolishing' ],
          }
        },
      },
      mode: 'default',
      TiLength: 0,
      warnShow: false,
      changedMaxLen: this.changeMaxLen,
      maxChars: this.changeMaxLen ? 5000 : 1000,
    }
  },
  watch: {
    contents: {
      handler(newV) {
        if (this.editor) {
          this.editor.setHtml(newV);
        }
      },
      immediate: true,
    },
    changeMaxLen: {
      handler(newV) {
        this.changedMaxLen = newV;
        this.maxChars = newV ? 5000 : 1000;
      },
      immediate: true,
    },
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor);
      editor.setHtml(this.contents);
      editor.getConfig().MENU_CONF['color'] = {
        colors: ['#000', '#333', '#666'],
      };
      registerMenu(this.editor, this.toolbarConfig);
    },
    onChange(editor) {
      const text = editor.getText().replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
      this.TiLength = text.length;
      this.warnShow = this.changedMaxLen ? this.TiLength > 5000 : this.TiLength > 1000;
      console.log(editor.getHtml());
    },
    saveEditor() {
      const content = this.editor.getHtml();
      console.log('Saved content:', content);

      alert('内容已保存');
    },
    exitEditor() {
      // Implement the exit logic here
      if (confirm('确定要退出编辑器吗？未保存的内容将丢失。')) {
        this.$emit('exit');
      }
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.editor-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.editor-button {
  background-color: #06164d;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
}
.editor-button:hover {
  background-color: #0a2472;
}
</style>
