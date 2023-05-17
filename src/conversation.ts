import * as vscode from "vscode";

export class ConversationContent {
  private chatContent: string[] = [];
  constructor(private outputChannel: vscode.OutputChannel) {}

  public appendUserResponse(response: string) {
    this.chatContent.push(`User: ${response}`);
    this.outputChannel.replace(this.chatContent.join("\n\n"));
    this.outputChannel.appendLine(`\n\nIntelliQuack: ...`);
  }

  public appendResponse(response: string) {
    this.chatContent.push(`IntelliQuack: ${response}`);
    this.outputChannel.replace(this.chatContent.join("\n\n"));
    this.outputChannel.appendLine(`\n\nWaiting for user response...`);
  }
}
