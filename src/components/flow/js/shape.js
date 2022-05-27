// 节点样式设置
import {
  Graph
} from "@antv/x6";
const widthNode = 200;
const heightNode = 34;
// 连接桩样式
export const basicsNode = Graph.registerNode(
  'basicsNode', {
    inherit: 'circle',
    width: 45,
    height: 45,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
      },
      text: {
        fontSize: 12,
        fill: '#262626',
      },
      label: {
        text: '',
        refX: 0.5,
        refY: -4,
        textAnchor: 'middle',
        textVerticalAnchor: 'bottom',
      }
    },
    data: {
      iddd: 0
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
      },
      items: [{
          group: 'top',
        },
        {
          group: 'right',
        },
        {
          group: 'bottom',
        },
        {
          group: 'left',
        },
      ],
    }
  },
  true,
)
// 获取attrs
function attrsObtain(num) {
  const attrsObj = {
    index: num,
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
}
// 获取 markup
function markupObtain(num) {
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
}
// 获取ports中的Items
function portsItems(num) {
  const leftList = [];
  const rightList = [];
  for (let i = 0; i < num; i++) {
    leftList.push({
      id: `left${i}`,
      group: "customPorts",
      args: {
        x: 0,
        y: heightNode / 2 + heightNode * i
      },
    });
    rightList.push({
      id: `right${i}`,
      group: "customPorts",
      args: {
        x: "100%",
        y: heightNode / 2 + heightNode * i
      },
    });
  }
  const portsItemsList = leftList.concat(rightList);
  portsItemsList.unshift({
    id: "top",
    group: "customPorts",
    args: {
      x: "50%",
      y: 0
    },
  }, {
    id: "bottom",
    group: "customPorts",
    args: {
      x: "50%",
      y: num * heightNode
    },
  });
  return portsItemsList;
}