// 组件相关
import ComponentFactory, { getDefaultComponentFactory } from "./factory";

// 内容生成器
import DomView from "./view/dom-view";
import HtmlView from "./view/html-view";

// 用户操作处理
import Operator from "./operator";

// 选区相关操作
import focusAt from "./selection/focus-at";
import getSelection from "./selection/get-selection";
import getSelectedIdList from "./selection/get-selected-id-list";
import insertBlock from "./selection/insert-block";
import insertInline from "./selection/insert-inline";
import modifyDecorate from "./selection/modify-decorate";
import modifySelectionDecorate from "./selection/modify-selection-decorate";
import modifyTable from "./selection/modify-table";
import modifyIndent from "./selection/modify-indent";
import exchange from "./selection/exchange";

// 操作内容
import updateComponent from "./util/update-component";

import nextTick from "./util/next-tick";
import Editor from "./editor";
import { AnyObject } from "./decorate";
import StructureType from "./const/structure-type";
import { Cursor } from "./selection/util";
import deleteSelection from "./operator/delete-selection";

export * from "./components";

export {
  Editor,
  ComponentFactory,
  getDefaultComponentFactory,
  DomView,
  HtmlView,
  Operator,
  AnyObject,
  StructureType,
  Cursor,
  focusAt,
  getSelection,
  deleteSelection,
  getSelectedIdList,
  insertBlock,
  insertInline,
  modifyDecorate,
  modifySelectionDecorate,
  modifyTable,
  modifyIndent,
  exchange,
  nextTick,
  updateComponent,
};
