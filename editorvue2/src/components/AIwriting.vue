<template>
  <div id="app">
     <a class="back-link1" href="/HomePage">&lt; &lt; 返回</a>
    <div class="SwiperBox" ref="SwiperBox" @mouseenter="MouseFun('移入')" @mouseleave="MouseFun('移出')">
      <!-- 图片 -->
      <div class="imgBox" :style="{left:`-${leftVal}px`,transition:`${ition}s`}">
        <img :src="item.imgUrl" v-for="(item, index) in imgList" :key="index" />
        <img :src="imgList[0].imgUrl" alt="">
      </div>
      <!-- 左箭头按钮 -->
      <div class="leftBtn" @click="throttle(PrevFun)">&larr;</div>
      <!-- 右箭头按钮 -->
      <div class="rightBtn" @click="throttle(NextFun)">&rarr;</div>
      <!-- 下方指示点容器 -->
      <div class="instBox">
        <div @click="instFun(index)" v-for="(item, index) in imgList.length" :key="index"
          :class="['inst', index === imgShow ? 'instActv' : '']">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgList: [
        { imgUrl: require('../assets/lunbo/1.jpg') },
          { imgUrl: require('../assets/lunbo/2.jpg') },
          { imgUrl: require('../assets/lunbo/3.jpg') },
          { imgUrl: require('../assets/lunbo/4.jpg') },
          { imgUrl: require('../assets/lunbo/5.jpg') },
          { imgUrl: require('../assets/lunbo/6.jpg') },
          { imgUrl: require('../assets/lunbo/7.jpg') },
          { imgUrl: require('../assets/lunbo/8.jpg') },
          { imgUrl: require('../assets/lunbo/9.jpg') },

      ],
      leftVal: 0,
      flag: true,
      start: null,
      imgWidth: 1000, // 更新图片宽度为 1000px
      ition: 0.6,
      imgShow: 0,
    };
  },
  mounted() {
    this.test();
  },
  methods: {
    MouseFun(type) {
      type === '移入' ? clearTimeout(this.start) : this.test();
    },
    test() {
      this.start = setInterval(() => {
        this.NextFun();
      }, 1500);
    },
    throttle(fun) {
      if (this.flag) {
        this.flag = false;
        fun();
        setTimeout(() => {
          this.flag = true;
        }, 650);
      }
    },
    PrevFun() {
      if (this.leftVal === 0) {
        this.ition = 0;
        this.imgShow = this.imgList.length - 1;
        this.leftVal = this.imgList.length * this.imgWidth;
        this.$nextTick(() => {
          setTimeout(() => {
            this.ition = 0.6;
            this.leftVal -= this.imgWidth;
          }, this.ition * 1000);
        });
      } else {
        this.ition = 0.6;
        this.leftVal -= this.imgWidth;
        this.imgShow--;
      }
    },
    NextFun() {
      if (this.leftVal === (this.imgList.length - 1) * this.imgWidth) {
        this.ition = 0.6;
        this.leftVal += this.imgWidth;
        this.imgShow = 0;
        this.$nextTick(() => {
          setTimeout(() => {
            this.ition = 0;
            this.leftVal = 0;
          }, this.ition * 1000);
        });
      } else {
        this.ition = 0.6;
        this.leftVal += this.imgWidth;
        this.imgShow++;
      }
    },
    instFun(index) {
      this.ition = 0.6;
      this.leftVal = index * this.imgWidth;
      this.imgShow = index;
    },
  },
};
</script>

<style scoped>
* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
}

.SwiperBox {
  position: relative;
  width: 1000px; /* 更新轮播图容器宽度 */
  height: 500px; /* 更新轮播图容器高度 */
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
}

.imgBox {
  position: absolute;
  top: 0px;
  left: 0px;
  min-width: 1000px; /* 更新图片容器宽度 */
  height: 500px; /* 更新图片容器高度 */
  display: flex;
  justify-content: flex-start;
}

.imgBox img {
  flex-shrink: 0;
  width: 1000px; /* 更新图片宽度 */
  height: 500px; /* 更新图片高度 */
}

.leftBtn,
.rightBtn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(109, 109, 109, 0.445);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  user-select: none;
}

.leftBtn {
  left: 10px;
}

.rightBtn {
  right: 10px;
}

.instBox {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  display: flex;
}

.inst {
  width: 10px;
  height: 10px;
  border: 1px solid #ccc;
  margin-right: 8px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.inst:last-child {
  margin-right: 0px;
}

.instActv {
  border: 1px solid #ff0000;
  background: #ff0000;
}

#app {
  width: 100%;
  padding: 120px;
  display: flex;
  justify-content: center;
}
</style>
