import Article from "../components/article";
import createEmptyArticle from "./create-empty-article";
import onClick from "../selection-operator/on-click";
import onKeyDown from "../selection-operator/on-keydown";

const mount = (idOrDom: string | HTMLElement, article?: Article) => {
  if (!article) article = createEmptyArticle();
  let root;
  if (typeof idOrDom === "string") {
    root = document.getElementById(idOrDom);
  } else {
    root = idOrDom;
  }
  let editorWrap = document.createElement("div");
  editorWrap.contentEditable = "true";
  editorWrap.classList.add("zebra-draft-root");
  editorWrap.appendChild(article.render());
  editorWrap.addEventListener("click", (event) => {
    onClick(event);
  });
  editorWrap.addEventListener("keydown", (event) => {
    onKeyDown(event);
  });
  if (!root) throw Error("请传入正确的节点或节点 id");
  root.innerHTML = "";
  root.appendChild(editorWrap);
  return root;
};

export default mount;