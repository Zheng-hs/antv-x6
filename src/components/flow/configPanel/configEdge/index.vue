<template>
  <a-card class="box" title="线条设置">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <!-- <a-form-item label="线条颜色">
        <colorPicker
          class="colorPicker"
          @change="colorClick"
          v-model="globalNodeAttr.attrsLineColor"
        />
      </a-form-item>
      <a-form-item label="线条宽度">
        <a-input-number
          style="width: 100%;"
          id="inputNumber"
          v-model="globalNodeAttr.attrsFontSize"
          :min="1"
          :max="100"
          @change="onChange"
        />
      </a-form-item> -->
      <a-form-item label="线条样式">
        <a-select
          :value="globalNodeAttr.lineSelection"
          @change="handleChange"
          style="width: 100%"
        >
          <a-select-option value="normal">直线</a-select-option>
          <a-select-option value="smooth">曲线</a-select-option>
          <a-select-option value="rounded">圆弧线</a-select-option>
          <a-select-option value="jumpover">跳线</a-select-option>
        </a-select>
      </a-form-item>
      <div class="row1" v-if="globalNodeAttr.lineSelection === 'smooth' || globalNodeAttr.lineSelection === 'rounded'">
        <span>路径点1:</span>
      <a-row>
        <a-col>
          <a-form-item label="x1">
            <a-input-number v-model="x1" @change="setVertices"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="y1">
            <a-input-number v-model="y1" @change="setVertices"></a-input-number>
          </a-form-item>
        </a-col>
      </a-row>
      </div>
       <!-- <div class="row1" v-if="globalNodeAttr.lineSelection === 'smooth' || globalNodeAttr.lineSelection === 'rounded'">
        <span>路径点2:</span>
      <a-row>
        <a-col>
          <a-form-item label="x2">
            <a-input-number v-model="x2" @change="setVertices"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="y2">
            <a-input-number v-model="y2" @change="setVertices"></a-input-number>
          </a-form-item>
        </a-col>
      </a-row>
      </div> -->
      <a-form-item label="速度">
        <a-input v-model="speed"></a-input>
      </a-form-item>
      <a-form-item label="车角度">
        <a-input v-model="ThetaAgv"></a-input>
      </a-form-item>
      <a-form-item label="路权">
        <a-input v-model="routingCost"></a-input>
      </a-form-item>
      <a-form-item label="障碍物区间">
        <a-input v-model="RadarOff"></a-input>
      </a-form-item>
      <a-form-item label="标签内容">
        <a-input v-model="globalNodeAttr.lineText"></a-input>
      </a-form-item>
      <a-form-item label="标签位置">
        <a-input-number
          style="width: 100%"
          v-model="globalNodeAttr.lineTextStyle"
          :min="0"
          :max="1"
          :step="0.1"
          @change="handleChangeStyle"
        />
      </a-form-item>
      <a-form-item label="标签旋转">
        <a-input-number
          style="width: 100%"
          v-model="globalNodeAttr.lineTextStyleRotate"
          :min="0"
          :max="360"
          @change="handleChangeRotate"
        />
      </a-form-item>
    </a-form>
    <div class="submit">
      <a-button type="danger" @click="reset">取消</a-button>
      <a-button type="primary" @click="primary">设置</a-button>
    </div>
  </a-card>
</template>

<script>
import FlowGraph from "../../js/index";
export default {
  name: "Index",
  props: {
    id: {
      type: String,
      default: null,
      require: true,
    },
  },
  data() {
    return {
      curEdge: "",
      globalNodeAttr: {
        attrsLineColor: "",
        attrsFontSize: 0,
        lineSelection: "rounded",
        lineText: "",
        lineTextStyle: "0.5",
        lineTextStyleRotate: "0",
      },
      speed: null, //速度
      ThetaAgv: null, //车角度
      routingCost: null, //路权
      RadarOff: null, //障碍物区间
      x1: null,
      y1: null,
      x2: null,
      y2: null
    };
  },
  computed: {
    nodeIdCpt() {
      return {
        id: this.id,
      };
    },
  },
  watch: {
    nodeIdCpt(nv) {
      this.curEdge = this.nodeOpt(nv, this.globalNodeAttr);
    },
  },
  created() {
    this.curEdge = this.nodeOpt(this.id, this.globalNodeAttr);
  },
  methods: {
    // 设置
    primary() {
      // 修改背景色
      this.curEdge.attr("line/stroke", this.globalNodeAttr.attrsLineColor); //线条颜色
      this.curEdge.attr("line/strokeWidth", this.globalNodeAttr.attrsFontSize); //线条宽度
      this.curEdge.setConnector(this.globalNodeAttr.lineSelection); //线条样式
      // 标签设置
      this.curEdge.setLabels([
        {
          attrs: {
            label: {
              text: this.globalNodeAttr.lineText,
            },
          },
          position: {
            distance: this.globalNodeAttr.lineTextStyle,
            angle: this.globalNodeAttr.lineTextStyleRotate,
          },
        },
      ]);
      this.curEdge.setData({
        speed: this.speed,
        ThetaAgv: this.ThetaAgv,
        routingCost: this.routingCost,
        RadarOff: this.RadarOff,
      });
      
      this.$emit("configClick");
    },
    setVertices() {
      this.curEdge.setVertices([{ x: this.x1, y: this.y1 }]);
    },
    // 处理
    nodeOpt(id) {
      let curEdge = null;
      if (id) {
        const { graph } = FlowGraph;
        const edge = graph.getCellById(id);
        if (!edge || !edge.isEdge()) {
          return;
        }
        curEdge = edge;
        const pointList = curEdge.getVertices()
        if(pointList.length !== 0) {

          this.x1 = pointList[0].x
          this.y1 = pointList[0].y
        } 
        // else if(pointList>1) {
        //   this.x2 = pointList[1].x
        //   this.y2 = pointList[1].y
        // }
        let cellNew1 = {};
        cellNew1 = JSON.parse(JSON.stringify(edge.attrs));
        this.globalNodeAttr.attrsLineColor = cellNew1.line.stroke; //线条颜色
        this.globalNodeAttr.attrsFontSize = cellNew1.line.strokeWidth; //线条宽度
        let connectorNew = {};
        if (edge.connector == undefined) {
          this.globalNodeAttr.lineSelection = "normal"; //线条样式
        } else {
          connectorNew = JSON.parse(JSON.stringify(edge.connector));
          this.globalNodeAttr.lineSelection = connectorNew.name; //线条样式
        }
        let labelsNew = [];
        labelsNew = JSON.parse(JSON.stringify(edge.labels));
        if (edge.labels.length == 0) {
          this.globalNodeAttr.lineText = ""; //线条内容
          this.globalNodeAttr.lineTextStyle = "0.5"; //标签样式
          this.globalNodeAttr.lineTextStyleRotate = "0"; //标签旋转
        } else {
          this.globalNodeAttr.lineText = labelsNew[0].attrs.label.text; //线条内容
          this.globalNodeAttr.lineTextStyle = labelsNew[0].position.distance; //标签样式
          this.globalNodeAttr.lineTextStyleRotate = labelsNew[0].position.angle; //标签旋转
        }
        this.speed = curEdge.getData().speed;
        this.ThetaAgv = curEdge.getData().ThetaAgv;
        this.routingCost = curEdge.getData().routingCost;
        this.RadarOff = curEdge.getData().RadarOff;
      }
      return curEdge;
    },
    // 线条样式选择
    handleChange(value) {
      this.globalNodeAttr.lineSelection = value;
      this.curEdge.setConnector(value)
    },
    // 标签样式
    handleChangeStyle(value) {
      this.globalNodeAttr.lineTextStyle = value;
    },
    // 标签旋转
    handleChangeRotate(value) {
      this.globalNodeAttr.lineTextStyleRotate = value;
    },
    // 数字加减
    onChange(value) {
      this.globalNodeAttr.attrsFontSize = value;
    },
    // 线条颜色点击
    colorClick(item) {
      this.globalNodeAttr.attrsLineColor = item;
    },
    // 重置
    reset() {
      this.$emit("configClick");
    },
  },
};
</script>

<style lang="scss">
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
  .row1 {
  display: flex;
  span {
    width: 31%;
    text-align: right;
    margin-top: 10px;
  }
}
}
</style>
