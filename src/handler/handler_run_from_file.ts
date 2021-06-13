import * as vscode from "vscode";
import { getSnippetForExt } from "../config";
import * as path from "path"
import { START_TEXT } from "../constant";
import { CqhRunner } from "../runner";

export async function run_from_file(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    let document = textEditor.document;

    let blocks: Array<[string, vscode.Range]> = [];
    const lines: string[] = document.getText().split(/\r?\n/g);
    let ext = path.extname(document.uri.fsPath)
    let snippet = getSnippetForExt(ext);
    const requestRanges: [number, number, string][] = []

    let error_message = ""
    if (snippet == null) {
        error_message = `snippet 为空 [${ext}]`
        vscode.window.showErrorMessage(error_message);
        throw new Error(error_message);
    }

    for (let line_index = 0; line_index < lines.length; line_index++) {
        let currentLine = lines[line_index];
        currentLine = currentLine.trim();
        let start_text = snippet.list[0] + START_TEXT;
        if (currentLine.startsWith(start_text)) {
            if (snippet.list[1] && !currentLine.endsWith(snippet.list[1])) {
                continue;
            }
            let title = currentLine.slice(start_text.length);
            if (snippet.list[1]) {
                title = title.slice(0, title.length - snippet.list[0].length);
            }

            requestRanges.push([line_index, line_index + 1, title]);
        }

    }


    for (let [blockStart, blockEnd, blockTitle] of requestRanges) {
        const range = new vscode.Range(blockStart, 0, blockEnd, 0);
        // const cmd: Command = {
        //     arguments: [document, range],
        //     title: 'CqhGoto Goto',
        //     command: consts.cmd_goto
        // };
        blocks.push([blockTitle, range]);
    }
    if (blocks.length == 0) {
        error_message = "列表为空"
        vscode.window.showErrorMessage(error_message);
        throw new Error(error_message)

    };

    let quickPickItem: vscode.QuickPickItem[] = [];
    let stringprefix = (value: string, count: number): string => {
        let prefix = "0".repeat(count);
        let tmp = prefix + value;
        return tmp.slice(tmp.length - count);
    }
    for (let i = 0; i < blocks.length; i++) {
        let prefix = stringprefix('' + i, 2);
        let [title, _] = blocks[i]
        quickPickItem.push({
            "label": `${prefix}.${title}`,
            "description": title

        })
    }

    let item = await vscode.window.showQuickPick(quickPickItem)

    if (!item) {
        return;
    }
    let { label, description } = item;
    for (let i = 0; i < blocks.length; i++) {
        let [title, range] = blocks[i];
        if (title == description) {
            let runner = new CqhRunner();
            await runner.goto(document, range)
        }// if(title==description)
    }

}