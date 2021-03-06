import Component, { Snapshoot } from "../components/component";

class Record {
  component: Component;
  recordMap: Snapshoot[] = [];

  constructor(component: Component) {
    this.component = component;
    this.recordMap = [];
  }

  store(stepId: number) {
    this.recordMap[stepId] = this.component.snapshoot();
  }

  restore(stepId: number) {
    // 找到最近的一个节点解析更新
    while (!this.recordMap[stepId] && stepId >= 0) {
      stepId--;
    }
    if (stepId < 0) return;

    this.component.restore(this.recordMap[stepId]);
  }

  clear(stepId: number) {
    this.recordMap.splice(stepId);
  }
}

export default Record;
