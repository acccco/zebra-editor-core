import Component from "../components/component";
import Block from "../components/block";
import Editor from "../editor/editor";
import ComponentType from "../const/component-type";
import nextTick from "./next-tick";
import StructureType from "../const/structure-type";

const recallQueue: [Block, string, HTMLElement, HTMLElement][] = [];

const handleRecallQueue = (editor: Editor) => {
  let containDocument = editor.mountedDocument;

  while (recallQueue.length) {
    const [component, afterComId, dom, parentDom] = recallQueue.pop()!;
    const parentComponent = component.parent;

    if (!parentComponent) continue;

    let isList = parentComponent.type === ComponentType.list;

    let afterDom = containDocument.getElementById(afterComId);
    if (isList) {
      afterDom = afterDom?.parentElement as HTMLElement;
    }
    if (afterDom) {
      parentDom.insertBefore(dom, afterDom);
    } else {
      recallQueue.push([component, afterComId, dom, parentDom]);
    }
  }
};

let inLoop = false;

// 更新组件
const updateComponent = (editor: Editor, component: Component) => {
  if (!editor.mountedDocument) return;

  update(editor, component);

  handleRecallQueue(editor);

  // 避免过度触发 editorChange 事件
  if (!inLoop) {
    inLoop = true;
    nextTick(() => {
      inLoop = false;
      document.dispatchEvent(new Event("editorChange"));
    });
  }
};

const update = (editor: Editor, component: Component) => {
  let containDocument = editor.mountedDocument;
  let oldDom = containDocument.getElementById(component.id);

  // 若结构组件的 DOM 元素已经存在则不需要更新
  if (component.structureType === StructureType.structure && oldDom) {
    return;
  }

  // 失效节点清除已存在的 DOM
  if (!component.parent) {
    // 列表组件有一层特殊的 li 标签
    if (oldDom?.parentElement?.tagName === "LI") {
      oldDom = oldDom?.parentElement;
    }
    if (oldDom) {
      oldDom.remove();
    }
    return;
  }

  let isList = component.parent.type === ComponentType.list;
  let newDom: HTMLElement = component.render(editor.contentBuilder);
  if (isList) {
    newDom = editor.contentBuilder.buildListItem(
      component.render(editor.contentBuilder),
      component.structureType,
    );
  }

  if (component instanceof Block) {
    if (oldDom) {
      if (component.active) {
        if (isList) {
          oldDom = oldDom.parentElement;
        }

        oldDom?.replaceWith(newDom);
      } else {
        // li 需要做特殊处理
        if (isList) {
          oldDom.parentElement?.remove();
        } else {
          oldDom?.remove();
        }
      }
    } else {
      // 没有对应元素
      // 组件失效，或是组件没有父节点时，不需更新
      if (!component.active || !component.parent) return;
      let parentComponent = component.parent;
      let parentDom = containDocument.getElementById(parentComponent.id);

      // table 组件外层有 figure 标签嵌套
      if (parentComponent.type === ComponentType.table) {
        parentDom = parentDom?.children[0] as HTMLElement;
      }

      // 未找到父组件对应的元素时，更新父组件
      if (!parentDom) {
        update(editor, parentComponent);
        return;
      }

      // 将该组件插入到合适的位置
      let index = parentComponent.findChildrenIndex(component);
      if (index === parentComponent.getSize() - 1) {
        parentDom.appendChild(newDom);
      } else {
        let afterComId = parentComponent.getChild(index + 1).id;
        let afterDom = containDocument.getElementById(afterComId);
        if (isList) {
          afterDom = afterDom?.parentElement as HTMLElement;
        }
        if (afterDom) {
          parentDom.insertBefore(newDom, afterDom);
        } else {
          recallQueue.push([component, afterComId, newDom, parentDom]);
        }
      }
    }
  } else {
    if (oldDom) {
      oldDom.replaceWith(newDom);
    } else if (component.parent) {
      update(editor, component.parent);
    }
  }
};

export default updateComponent;
