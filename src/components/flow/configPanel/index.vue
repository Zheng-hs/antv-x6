<template>
  <div class="operation">
    <span class="toolbars">
      <div class="tool" title="撤销" @click="toUndo()">
        <i class="el-icon-refresh-left"></i>
      </div>
      <div class="tool" title="重做" @click="toRedo()">
        <i class="el-icon-refresh-right"></i>
      </div>
      <div class="tool" @click="mapZoom('+')" title="放大视图">
        <i class="el-icon-zoom-in"></i>
      </div>
      <div class="tool" @click="mapZoom('-')" title="缩小视图">
        <i class="el-icon-zoom-out"></i>
      </div>
      <div class="tool" @click="mapZoom()" title="重置视图">
        <i class="el-icon-full-screen"></i>
      </div>
      <div class="tool" @click="importJSON()" title="导入">
        <i class="el-icon-download"></i>
      </div>
      <div class="tool" @click="handleClick('toJSON')" title="导出">
        <i class="el-icon-upload2"></i>
      </div>
    </span>
    <!-- 右键操作栏 -->
    <div class="toolBar" :style="style" v-show="toolBarIsShow">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-success="handleSuccess"
        :limit="1"
        :file-list="filesList"
      >
        <div class="delete del" @click="initBack">导入背景</div>
      </el-upload>

      <div class="delete del" @click="handleClick('delete')">清除数据</div>
    </div>
    <!-- 节点/线邮件操作栏 -->
    <div class="toolBar" :style="nodeStyle" v-show="nodeIsShow">
      <div class="delete" @click="nodeClick('edit')">编辑</div>
      <div class="delete del" @click="nodeClick('delete')">删除</div>
    </div>
    <!-- 右侧 -->
    <div class="config" v-show="configIsShow">
      <config-node
        v-show="type == 'node'"
        @configClick="configClick"
        :id="id"
      />
      <config-edge
        v-show="type == 'edge'"
        @configClick="configClick"
        :id="id"
      />
    </div>
    <div class="config"  v-show="backShow">
      <background v-if="backShow" @configClick="configClick" :image="image"></background>
    </div>
    <el-dialog
      :visible.sync="dialogImport"
      title="导入"
      v-if="dialogImport"
      width="40%"
      append-to-body
    >
      <div style="text-align: center">
        <!-- 此处action需为有效的任意接口——当前为官网范例接口 -->
        <el-upload
          drag
          :limit="1"
          action="https://jsonplaceholder.typicode.com/posts/"
          ref="upload"
          accept=".json"
          :file-list="fileList"
          :before-upload="before"
          :on-success="onSuccess"
          :on-remove="onRemove"
          :on-exceed="handleExceed"
          :on-preview="handlePreview"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            上传json文件，且只能上传 1 个文件
          </div>
        </el-upload>
      </div>
      <span slot="footer">
        <el-button @click="dialogImport = false" size="mini">取 消</el-button>
        <el-button @click="importConfirm" size="mini" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogPreviewJSON"
      title="JSON文件预览"
      v-if="dialogPreviewJSON"
      width="40%"
      append-to-body
    >
      <sjson :json="jsonData"></sjson>
    </el-dialog>
  </div>
</template>

<script>
import FlowGraph from "../js/index";
import ConfigNode from "./configNode/index";
import ConfigEdge from "./configEdge/index";
import Background from "./configBackground/index";
import sjson from "/src/views/About";
import FileSaver from "file-saver";
export default {
  name: "Index",
  components: {
    ConfigNode,
    ConfigEdge,
    Background,
    sjson,
  },
  props: {
    editIsSHow: {
      typeof: Boolean,
    },
  },
  data() {
    return {
      toolBarIsShow: false, //右键数据操作栏
      style: {
        left: "0px",
        top: "0px",
      },
      nodeIsShow: false, //节点/线操作
      nodeStyle: {
        left: "0px",
        top: "0px",
      },
      nodeCell: "",
      configIsShow: false, //设置栏
      type: "",
      id: "",
      graph_zoom: 0, //地图缩放比例
      fileList: [],
      uploadData: [],
      dialogImport: false,
      jsonData: null,
      dialogPreviewJSON: false,
      filesList:[],
      backShow: false,
      image: ''
    };
  },
  mounted() {
    if (this.editIsSHow) {
      setTimeout(() => {
        this.boundEvent();
      }, 200);
    }
  },
  created() {},
  methods: {
    configClick() {
      this.configIsShow = false;
      this.backShow = false;
    },
    initBack() {},
    handleSuccess(response,file) {
      const { graph } = FlowGraph;
      this.image = URL.createObjectURL(file.raw)
      graph.drawBackground({image: URL.createObjectURL(file.raw)});
      this.toolBarIsShow = false
      },
    boundEvent() {
      const { graph } = FlowGraph;
      // 鼠标单击空白页
      graph.on("blank:click", () => {
        this.type = "";
        this.nodeCell = "";
        this.backShow = true;
        this.toolBarIsShow = false;
        this.nodeIsShow = false;
        this.configIsShow = false;
      });
      // 鼠标点击节点或者线
      graph.on("cell:click", ({ cell }) => {
        this.type = cell.isNode() ? 'node' : 'edge'
        this.id = cell.id
        this.configIsShow = true
        this.backShow = false;
        // this.type = "";
       this.nodeCell = cell;
        this.toolBarIsShow = false;
        this.nodeIsShow = false;
      });
      // 右键节点或者线
      // graph.on("cell:contextmenu", ({ e, cell }) => {
      //   this.nodeStyle.left = e.clientX + "px";
      //   this.nodeStyle.top = e.clientY + "px";
      //   this.nodeIsShow = true;
      //   this.toolBarIsShow = false;
      //   this.nodeCell = cell;
      // });
      // 右键空白区域弹出弹窗
      graph.on("blank:contextmenu", ({ e }) => {
        this.style.left = e.clientX + "px";
        this.style.top = e.clientY + "px";
        this.toolBarIsShow = true;
        this.nodeIsShow = false;
      });
      // #region 快捷键与事件
      // copy cut paste
      graph.bindKey(["meta+c", "ctrl+c"], () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.copy(cells);
        }
        return false;
      });
      graph.bindKey(["meta+x", "ctrl+x"], () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.cut(cells);
        }
        return false;
      });
      graph.bindKey("ctrl+v", () => {
        if (!graph.isClipboardEmpty()) {
          const cells = graph.paste({ offset: 32 });
          graph.cleanSelection();
          graph.select(cells);
        }
        return false;
      });

      //undo redo
      graph.bindKey(["meta+z", "ctrl+z"], () => {
        if (graph.history.canUndo()) {
          graph.undo();
        }
        return false;
      });
      graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
        if (graph.history.canRedo()) {
          graph.redo();
        }
        return false;
      });

      // select all
      graph.bindKey(["meta+a", "ctrl+a"], () => {
        const nodes = graph.getNodes();
        if (nodes) {
          graph.select(nodes);
        }
      });

      //delete
      graph.bindKey("backspace", () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.removeCells(cells);
        }
      });
    },
    //地图放大缩小
    mapZoom(type) {
      const { graph } = FlowGraph;
      if (type == "+") {
        graph.zoom(0.1);
        this.graph_zoom += 0.1;
      } else if (type == "-") {
        graph.zoom(-0.1);
        this.graph_zoom -= 0.1;
      } else {
        graph.zoom(
          this.graph_zoom <= 0 ? Math.abs(this.graph_zoom) : -this.graph_zoom
        );
        graph.centerContent(); //画布居中
        this.graph_zoom = 0;
      }
    },
    //撤销操作
    toUndo() {
      const { graph } = FlowGraph;
      graph.undo();
    },
    //重做
    toRedo() {
      const { graph } = FlowGraph;
      graph.redo();
      //   if (this.graph.isHistoryEnabled()) {
      //     this.graph.disableHistory()
      //   } else {
      //     this.graph.enableHistory()
      //   }
    },
    // 节点操作栏
    nodeClick(event) {
      switch (event) {
        case "edit":
          this.type = this.nodeCell.isNode() ? "node" : "edge";
          this.id = this.nodeCell.id;
          this.configIsShow = true;
          this.nodeIsShow = false;
          break;
        case "delete":
          this.nodeCell.remove(); //删除
          this.nodeIsShow = false;
          break;
        default:
          break;
      }
    },
    // 操作栏
    handleClick(event) {
      const { graph } = FlowGraph;
      switch (event) {
        case "delete":
          graph.clearCells();
          localStorage.removeItem("FlowData");
          this.toolBarIsShow = false;
          break;
        case "toJSON":
          localStorage.setItem("FlowData", JSON.stringify(graph.toJSON()));
          const data = JSON.stringify(graph.toJSON());
          const blob = new Blob([data], { type: "application/json" });
          FileSaver.saveAs(blob, "map.json");
          this.toolBarIsShow = false;
          // graph.fromJSON({cells:[graph.toJSON().cells[0],graph.toJSON().cells[1]]})
          break;
        default:
          break;
      }
    },
    // 导入json
    importJSON() {
      this.dialogImport = true;
    },
    // 上传文件超出文件数量限制/文件格式不符合要求时
    handleExceed(files, fileList) {
      this.$message.warning(`每次只能导入一个json文件！`);
    },

    // 文件上传成功
    onSuccess(res, file, fileList) {
      let reader = new FileReader();
      reader.readAsText(file.raw);
      reader.onload = (e) => {
        this.uploadData = [];
        this.uploadData = JSON.parse(e.target.result);
      };
    },
    before(file) {
      console.log(file);
    },
    // 移除文件
    onRemove(file) {
      this.fileList = [];
    },

    // 导入确认
    importConfirm() {
      this.$confirm("导入后原数据会被覆盖，确定导入吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const { graph } = FlowGraph;
        // 使用目标数据变量接收上传后的文件数据
        this.stockData = this.uploadData;

        this.dialogImport = false;
        graph.fromJSON(this.uploadData);
        this.$message({
          type: "success",
          message: "导入成功!",
        });
      });
    },
    handlePreview(file) {
      let reader = new FileReader();
      reader.readAsText(file.raw);
      reader.onload = (e) => {
        this.jsonData = JSON.parse(e.target.result);
        this.dialogPreviewJSON = true;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
#file {
  opacity: 0;
  position: absolute;
  width: 40px;
}
.toolBar {
  position: fixed;
  width: 100px;
  height: 60px;
  background-color: #ffffff;
  border-radius: 10px;

  .delete {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
  }
  .delete:hover {
    color: #5f95ff;
  }
  .del:hover {
    color: red;
  }
}
.config {
  position: fixed;
  top: 0px;
  right: 0px;
  width: 20%;
  height: 100%;
  background-color: #ffffff;
}
.toolbars {
  //   padding: 0 20px;
  box-sizing: border-box;
  height: 40px;
  background: white;
  box-shadow: 0 2px 6px #e1e1e1;
  position: fixed;
  right: 300px;
  z-index: 999;
  display: flex;
  align-items: center;
  .tool {
    cursor: pointer;
    width: 40px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: #f1f1f1;
    }
  }
}
</style>
