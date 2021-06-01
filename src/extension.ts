// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CMD_LIST, cmd_run } from './constant';
import { run_from_history } from './handler/handler_run_from_history';
import { CqhCodeLenProvider } from './provider/cqh_run_provider';
import { CqhRunner } from './runner';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cqh-cmd test" is now active!');

	let docSelector = {
		language: '*',
		scheme: 'file',
	};



	let codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
		docSelector,
		new CqhCodeLenProvider()
	)

	context.subscriptions.push(codeLensProviderDisposable)
	let runner = new CqhRunner();
	let disposable = vscode.commands.registerCommand(cmd_run, async (document: vscode.TextDocument,
		range: vscode.Range) => {
		// vscode.window.oupu
		// vscode.window
		// let runner = new CqhRunner(document, range, vscode.window.createOutputChannel("cqh-html-go"));
		await runner.goto(document, range);

	})


	context.subscriptions.push(disposable);
	let listDisposable = vscode.commands.registerCommand(CMD_LIST, (document: vscode.TextDocument, range: vscode.Range)=> {
		run_from_history(document, range);
	})
	context.subscriptions.push(listDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
