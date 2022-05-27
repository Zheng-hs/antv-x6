<template>
  <a-card class="box" title="背景设置">
    <a-form :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="背景大小">
        <a-select
          :value="BackgroundOptions.size"
          @change="handleChange"
          style="width: 100%"
        >
          <a-select-option value="100% 100%">100% 100%</a-select-option>
          <a-select-option value="auto auto">auto auto</a-select-option>
          <a-select-option value="contain">contain</a-select-option>
          <a-select-option value="cover">cover</a-select-option>
        </a-select>
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
  name: "Index2",
  props: {
    image: {
      type: String,
      default: null,
      require: true
    }
  },
  data() {
    return {
      curEdge: "",
      BackgroundOptions: {
        size: "auto auto",
        repeat: "",
        opacity: 1,
      },
    };
  },
  methods: {
    // 设置
    primary() {
      // 修改背景色
      const { graph } = FlowGraph;
      graph.drawBackground({ size: this.BackgroundOptions.size, image: this.image });
      this.$emit("configClick");
    },
    // 线条样式选择
    handleChange(value) {
      this.BackgroundOptions.size = value;
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
}
</style>