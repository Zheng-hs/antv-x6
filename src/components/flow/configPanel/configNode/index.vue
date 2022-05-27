<template>
  <a-card class="box" title="节点设置">
    <a-form :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="点位名称">
        <a-input v-model="pointName"></a-input>
      </a-form-item>
    </a-form>
    <div class="submit">
      <a-button type="danger" @click="reset">取消</a-button>
      <a-button type="primary" @click="primary">设置</a-button>
    </div>
  </a-card>
</template>

<script>
import FlowGraph from '../../js/index'
const heightNode = 34;
export default {
  name: 'Index1',
  props: {
    id: {
      type: String,
      default: null,
      require: true
    }
  },
  data() {
    return {
      curCel: '',
      curCelIndex: 0,
      globalNodeAttr: {
        attrsBackgroundColor: '',
        attrsFontSize: 0,
        attrTextList: [],
      },
      addNodeIsShow: true,
      cellNew1: {},
      cellNew2: [],
      pointName:''
    }
  },
  computed: {
    nodeIdCpt() {
      return {
        id: this.id
      }
    }
  },
  watch: {
    nodeIdCpt(nv) {
      this.curCel = this.nodeOpt(nv, this.globalNodeAttr)
    }
  },
  created() {
    this.curCel = this.nodeOpt(this.id, this.globalNodeAttr)
  },
  methods: {
    // 删除节点
    deleteNode(index) {
      this.globalNodeAttr.attrTextList.splice(index, 1);
    },
    // 设置
    primary() {
      // 添加节点了
      // this.curCel.setData({iddd: 1})
      this.curCel.attr('label/text', this.pointName)
      const { graph } = FlowGraph;
      const node = graph.updateCellId(this.curCel,this.pointName);
      console.log(node);
      // if (this.globalNodeAttr.attrTextList.length > this.cellNew1.index) {
      //   // 新增节点
      //   let index = this.cellNew1.index
      //   let listLength = this.globalNodeAttr.attrTextList.length - index
      //   for (let i = 0; i < listLength; i++) {
      //     let head = { x: 0, y: 34 * (index + i) }
      //     let text = {
      //       ref: `head${index + i + 1}`,
      //       textWrap: { text: '' },
      //       type: `text${index + i + 1}`
      //     }
      //     this.curCel.attr(`head${index + i + 1}`, head)
      //     this.curCel.attr(`text${index + i + 1}`, text)
      //   }
      //   this.curCel.markup = this.markupObtain(this.globalNodeAttr.attrTextList.length)
      //   // 新增连接桩
      //   this.curCel.ports.items = []
      //   this.portsItems(this.globalNodeAttr.attrTextList.length).map((ele) => {
      //     this.curCel.addPort(ele)
      //   })
      // }
      // // 修改背景色
      // this.curCel.attr("commonStyle/stroke", this.globalNodeAttr.attrsBackgroundColor);
      // this.curCel.attr("head1/stroke", this.globalNodeAttr.attrsBackgroundColor);
      // this.curCel.attr("head1/fill", this.globalNodeAttr.attrsBackgroundColor);
      // // 修改文字大小
      // this.curCel.attr("commonStyle1/fontSize", this.globalNodeAttr.attrsFontSize);
      // // 修改文字内容
      // this.globalNodeAttr.attrTextList.map((ele) => {
      //   this.curCel.attr(`${ele.type}/textWrap`, ele.textWrap)
      //   // this.curCel.attr("text/textWrap", "");
      // })
      // //  固定数目
      // this.curCel.attr('index', this.globalNodeAttr.attrTextList.length)
      // // 清除删除按钮
      // for (let i = 0; i < this.globalNodeAttr.attrTextList.length; i++) {
      //   if (this.globalNodeAttr.attrTextList[i].deleteNodeIsShow) {
      //     this.globalNodeAttr.attrTextList[i].deleteNodeIsShow = false
      //   }
      // }
      this.$emit('configClick')
    },
    // 处理
    nodeOpt(id) {
      let curCel = null
      if (id) {
        const { graph } = FlowGraph
        const cell = graph.getCellById(id)
        if (!cell || !cell.isNode()) {
          return
        }
        curCel = cell
        this.pointName = curCel.getAttrs().label.text
             
      }
      return curCel
    },
    // 重置
    reset() {
      this.$emit('configClick')
    },
    // 节点颜色点击
    colorClick1(item) {
      this.globalNodeAttr.attrsTitleColor = item
    },
    // 节点颜色点击
    colorClick2(item) {
      this.globalNodeAttr.attrsFonSizeColor = item
    },
    // 获取attrs
    attrsObtain(num) {
      const attrsObj = {
        // rect公共样式
        commonStyle: {
          refWidth: "100%",
          height: heightNode,
          stroke: "#5F95FF",
          fill: "rgba(95,149,255,0.05)",
        },
        // text公共样式
        commonStyle1: {
          fill: "#000000",
          fontSize: 12,
          textWrap: {
            width: -10, // 宽度减少 10px
            height: "50%", // 高度为参照元素高度的一半
            ellipsis: true, // 文本超出显示范围时，自动添加省略号
            breakWord: true, // 是否截断单词
          },
        },
      };
      for (let i = 1; i < num + 1; i++) {
        if (i == 1) {
          attrsObj[`head${i}`] = {
            x: 0,
            y: 0,
            stroke: "#5F95FF",
            fill: "rgb(95,149,255)",
          };
          attrsObj[`text${i}`] = {
            ref: `head${i}`,
            type: `text${i}`,
            fill: "#FFFFFF",
            textWrap: {
              text: "",
            },
          };
        } else {
          attrsObj[`head${i}`] = {
            x: 0,
            y: heightNode * (i - 1),
          };
          attrsObj[`text${i}`] = {
            ref: `head${i}`,
            type: `text${i}`,
            textWrap: {
              text: "",
            },
          };
        }
      }
      return attrsObj;
    },
    // 获取 markup
    markupObtain(num) {
      const headList = [];
      const textList = [];
      for (let i = 1; i < num + 1; i++) {
        headList.push({
          tagName: "rect",
          selector: `head${i}`,
          groupSelector: "commonStyle",
        });
        textList.push({
          tagName: "text",
          selector: `text${i}`,
          groupSelector: "commonStyle1",
        });
      }
      const markupList = headList.concat(textList);
      return markupList;
    },
    // 获取ports中的Items
    portsItems(num) {
      const leftList = [];
      const rightList = [];
      for (let i = 0; i < num; i++) {
        leftList.push({
          id: `left${i}`,
          group: "customPorts",
          args: { x: 0, y: heightNode / 2 + heightNode * i },
        });
        rightList.push({
          id: `right${i}`,
          group: "customPorts",
          args: { x: "100%", y: heightNode / 2 + heightNode * i },
        });
      }
      const portsItemsList = leftList.concat(rightList);
      portsItemsList.unshift(
        {
          id: "top",
          group: "customPorts",
          args: { x: "50%", y: 0 },
        },
        {
          id: "bottom",
          group: "customPorts",
          args: { x: "50%", y: num * heightNode },
        }
      );
      return portsItemsList;
    }
  }
}
</script>
<style lang="scss" >
.ant-form-item {
  margin-bottom: 10px;
}
.m-colorPicker .colorBtn {
  width: 160px !important;
  height: 32px !important;
  border-radius: 4px;
  border: 1px solid #000000;
}
.m-colorPicker .box.open {
  margin-left: -25px;
}
</style>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  .ant-form-item {
    margin-bottom: 15px;
  }
  .submit {
    display: flex;
    justify-content: space-around;
  }
  .colorPicker {
    width: 100%;
  }
}
</style>
