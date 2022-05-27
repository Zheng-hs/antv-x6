import {
  Graph,
  Addon,
  FunctionExt,
  Shape
} from "@antv/x6";
import "./shape";
export default class FlowGraph {
  // editIsSHow//是否只读,false只读,true操作
  static init(width, height, editIsSHow) {
    this.graph = new Graph({
      container: document.getElementById("flowContainer"),
      // width: 1200,
      // height: 900,
      // panning: true, //支持平移拖拽
      resizing: true,
      keyboard: true,
      clipboard: true,
      background: false,
      // 背景
      grid: {
        size: 10,
        visible: true,
        type: "mesh",
        args: [{
            color: "#cccccc",
            thickness: 1,
          },
          {
            color: "#5F95FF",
            thickness: 1,
            factor: 4,
          },
        ],
      },
      history: {
        enabled: true, //历史记录
        // ignoreChange: true, //ignoreChange 是否忽略属性变化
      },
      // 节点是否移动
      interacting: {
        nodeMovable: editIsSHow,
      },
      // 滚动画布
      scroller: {
        enabled: true,
        pannable: true,
      },
      // 小地图
      //  minimap: {
      //    enabled: true,
      //    container: document.getElementById("flowContainer"),
      //  },
      // ctrl+滚轮缩放
      mousewheel: {
        enabled: true,
        modifiers: ["ctrl", "meta"],
        minScale: 0.5,
        maxScale: 2,
      },
      // 点选/框选。
      selecting: {
        enabled: editIsSHow,
        multiple: true,
        rubberband: editIsSHow, //框选
        movable: true,
        showNodeSelectionBox: true,
      },
      // 连接线
      connecting: {
        anchor: "center",
        connectionPoint: "anchor",
        allowPort: true, //是否允许边链接到链接桩
        allowEdge: true, //是否允许边链接到另一个边
        allowNode: false, //是否允许边链接到节点（非节点上的链接桩)
        allowBlank: false, //是否允许连接到画布空白位置的点
        highlight: true,
        snap: true, //自动吸附
        createEdge() {
          return new Shape.Edge({
            shape: "edge",
            attrs: {
              line: {
                stroke: "#5F95FF",
                strokeWidth: 1, //线条宽度
                targetMarker: {
                  //箭头
                  name: "classic",
                  size: 8,
                },
              },
            },
            data: {
              speed: null, //速度
              ThetaAgv: null, //车角度
              routingCost: null, //路权
              RadarOff: null //障碍物区间
            },
            vertices: [],
            router: {
              name: "manhattan",
            },
            zIndex: 0,
          });
        },
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          if (sourceView === targetView) {
            return false;
          }
          if (!sourceMagnet) {
            return false;
          }
          if (!targetMagnet) {
            return false;
          }
          return true;
        },
      },
      // 连接桩可连接样式设置
      highlighting: {
        magnetAvailable: {
          name: "stroke",
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: "rgba(223,234,255)",
            },
          },
        },
      },
      // 对齐线
      snapline: {
        enabled: true,
        resizing: true,
      },
      // 是否允许调整大小
      resizing: {
        enabled: editIsSHow,
      },
    });
    // this.graph.centerContent(); //画布居中
    if (editIsSHow) {
      this.initStencil(); // 左侧选择标题拖拽
      this.initShape(); //左侧选择节点导入
      this.initEvent(); //初始事件
    }
    return this.graph;
  }
  // 左侧选择标题拖拽
  static initStencil() {
    this.stencil = new Addon.Stencil({
      title: "节点选择",
      stencilGraphWidth: 240,
      collapsable: false,
      target: this.graph,
      groups: [{
        name: "node0",
        title: "基础节点",
        graphHeight: 100,
        layoutOptions: {
          columns: 1,
          marginX: 50,
        },
      }],
    });
    const stencilContainer = document.querySelector("#flowStencil");
    stencilContainer.appendChild(this.stencil.container);
  }
  // 左侧选择节点导入
  static initShape() {
    const {
      graph
    } = this;
    const a1 = graph.createNode({
      shape: "basicsNode",
    });
    // const b1 = graph.createNode({
    //   shape: "twoStageNode",
    // });
    this.stencil.load([a1], "node0");
    // this.stencil.load([b1], "node1");
  }
  // 节点操作
  static initEvent() {
    const {
      graph
    } = this;
    const container = document.getElementById("flowContainer");
    // 鼠标进入节点
    graph.on(
      "node:mouseenter",
      FunctionExt.debounce(() => {
        const ports = container.querySelectorAll(".x6-port-body");
        this.showPorts(ports, true);
      }),
      500
    );
    // 鼠标离开节点
    graph.on("node:mouseleave", ({
      cell,
      view
    }) => {
      const ports = container.querySelectorAll(".x6-port-body");
      this.showPorts(ports, false);
    });
    graph.bindKey("backspace", () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.removeCells(cells);
      }
    });
  }
  // 连接桩隐藏处理
  static showPorts(ports, show) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? "visible" : "hidden";
    }
  }
  // 载入数据
  static initGraphShape(item) {
    this.graph.fromJSON(item);
  }
  // 销毁
  static destroy() {
    this.graph.dispose();
  }
}