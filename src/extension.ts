// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { buildPrompt } from "./prompt";
import { configure, createCompletion } from "./openai";
import { ConversationContent } from "./conversation";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "intelliquack" is now active!');

  getOpenAISecretKey();

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "intelliquack.rubberduck",
    async () => {
      const openAISecretKey = getOpenAISecretKey();
      if (!openAISecretKey) {
        return;
      }
      configure(openAISecretKey);

      const userRequest = await showInputBox("What are you struggling with?");
      if (userRequest === undefined) {
        return;
      }

      // Create a new editor window, and have the conversation with the user there
      const outputChannel = vscode.window.createOutputChannel("IntelliQuack");
      outputChannel.show();
      const conversationContent = new ConversationContent(outputChannel);
      conversationContent.appendUserResponse(userRequest);

      const prompt = buildPrompt(userRequest);

      while (true) {
        const result = await createCompletion(prompt);

        const response = result.data.choices[0].message?.content;
        if (!response) {
          continue;
        }
        conversationContent.appendResponse(response);

        const userResponse = await showInputBox();
        if (userResponse === undefined) {
          break;
        }
        conversationContent.appendUserResponse(userResponse);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function getOpenAISecretKey() {
  const configuration = vscode.workspace.getConfiguration();

  const openAISecretKey = configuration.get(
    "intelliquack.openAISecretKey"
  ) as string;

  if (!openAISecretKey) {
    showNeedsConfigurationMessage();
    return;
  }

  return openAISecretKey;
}

function showNeedsConfigurationMessage() {
  // TODO: Direct the user straight to the right spot in the settings view
  vscode.window.showErrorMessage(
    "IntelliQuack needs to be configured. Please open settings."
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

export async function showInputBox(placeholder?: string) {
  return await vscode.window.showInputBox({
    value: "",
    placeHolder: placeholder,
  });
}
