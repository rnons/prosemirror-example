import OrderedMap = require("orderedmap");

import { EditorState, Plugin, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser, NodeSpec } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";

import { initMenu } from "./menu";
import "./main.css";

const $editor = document.querySelector("#editor");
const $content = document.querySelector("#content");

if ($editor && $content) {
  const view = new EditorView($editor, {
    state: EditorState.create({
      doc: DOMParser.fromSchema(schema).parse($content),
      plugins: [keymap(baseKeymap)]
    }),
    dispatchTransaction(transaction: Transaction) {
      const newState = view.state.apply(transaction);
      view.updateState(newState);
      menu.dispatch(newState);
    }
  });
  const menu = initMenu(view);
}
