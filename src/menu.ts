import { app, h } from "hyperapp";
import {
  setBlockType,
  toggleMark,
  wrapIn
} from "prosemirror-commands";
import { DOMSerializer } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

type Item = {
  text: string;
  command: Function;
};

type State = {
  editorView: EditorView;
  editorState: EditorState;
};

type Actions = {
  dispatch: (editorState: EditorState) => (state: State) => State;
};

const heading = (level: number) => ({
  text: `h${level}`,
  command: setBlockType(schema.nodes.heading, { level })
});

const domSerializer = DOMSerializer.fromSchema(schema);
const toHtml = (editorState: EditorState) => {
  const fragment = domSerializer.serializeFragment(editorState.doc.content);
  const div = document.createElement("div");
  div.appendChild(fragment);
  return div.innerHTML;
};

const items: Array<Item> = [
  {
    text: "B",
    command: toggleMark(schema.marks.strong)
  },
  {
    text: "i",
    command: toggleMark(schema.marks.em)
  },
  {
    text: "p",
    command: setBlockType(schema.nodes.paragraph)
  },
  heading(1),
  heading(2),
  heading(3),
  {
    text: ">",
    command: wrapIn(schema.nodes.blockquote)
  },
  {
    text: "toHtml",
    command: (editorState: EditorState, dispatch: any) => {
      if (dispatch) {
        console.log(toHtml(editorState));
      }
      return true;
    }
  }
];

const viewItem = (editorView: EditorView, item: Item) => {
  const active = item.command(editorView.state, null, editorView);
  return h(
    "li",
    {
      hidden: !active,
      className: "MenuItem",
      onclick() {
        editorView.focus();
        item.command(editorView.state, editorView.dispatch, editorView);
      }
    },
    item.text
  );
};

const mkState = (editorView: EditorView) => ({
  editorView,
  editorState: editorView.state
});

const actions: Actions = {
  dispatch: (editorState: EditorState) => (state: State) => ({
    ...state,
    editorState
  })
};

const view = (state: State, actions: Actions) =>
  h(
    "ul",
    { className: "Menu" },
    items.map(item => viewItem(state.editorView, item))
  );

export function initMenu(editorView: EditorView) {
  return app(
    mkState(editorView),
    actions,
    view,
    document.getElementById("menu")
  );
}
