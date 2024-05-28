<template>
  <div id="app">
    <EditorTitle title="智能编辑器"/>
    <MyEditor/>
 <!--   <DIYEditor/>-->
  </div>
</template>

<script>
  import MyEditor from "@/components/MyEditor.vue";
  import EditorTitle from "@/components/EditorTitle.vue"
  //import DIYEditor from "@/components/DIYEditor.vue";
export default {
  name: 'App',
  components: {
    EditorTitle,
    MyEditor,
    //DIYEditor,
  }
}
</script>
<style>

</style>
