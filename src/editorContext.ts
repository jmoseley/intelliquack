import * as vscode from "vscode";
import { encode, decode } from "gpt-3-encoder";

export type EditorContext = {
  context: string;
  selectedText: string;
  cursorPosition: vscode.Position;
};

export function extractContext(
  activeEditor: vscode.TextEditor,
  maxTokens: number = 4096
): EditorContext {
  // Extract the document content
  const document = activeEditor.document;
  const documentContent = document.getText();

  // Get the current cursor position and maybe selected text
  const selection = activeEditor.selection;
  const selectedText = document.getText(selection);

  // Limit the document content to the specified number of tokens, centered around the selection
  const documentContentTokens = encode(documentContent);
  const selectedTextTokens = encode(selectedText);
  const selectedTextTokensLength = selectedTextTokens.length;
  const documentContentTokensLength = documentContentTokens.length;
  const maxTokensBeforeSelection = Math.floor(
    (maxTokens - selectedTextTokensLength) / 2
  );
  const maxTokensAfterSelection = Math.ceil(
    (maxTokens - selectedTextTokensLength) / 2
  );
  const startToken = Math.max(
    0,
    selection.start.character - maxTokensBeforeSelection
  );
  const endToken = Math.min(
    documentContentTokensLength,
    selection.end.character + maxTokensAfterSelection
  );
  const contextTokens = documentContentTokens.slice(startToken, endToken);
  const context = decode(contextTokens);

  return { context, selectedText, cursorPosition: selection.start };
}
