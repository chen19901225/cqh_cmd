
import * as vscode from "vscode";
import { Persist } from "../persist";


export function leftPad(ele: number, count: number): string {
    let prefix = '0'.repeat(count);
    let final_ele = prefix + ele
    return final_ele.slice(final_ele.length - count)
}

export function run_from_history(document: vscode.TextDocument, range: vscode.Range) {

    let workspaceRoot = "";
    if (vscode.workspace.workspaceFolders) {
        workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    let cmdList = Persist.loadFromFile(Persist.historyPath(workspaceRoot));
    let new_cmd_list:string[] = []
    for(let cmd_str of cmdList ){
        cmd_str = cmd_str.trim();
        if(new_cmd_list.indexOf(cmd_str) === -1) {
            new_cmd_list.push(cmd_str)
        }
    }
    let quickItemList: vscode.QuickPickItem[] = []
    let i = 1;
    for (let cmd of new_cmd_list) {
        quickItemList.push({
            "label": leftPad(i, 2) + ". " + cmd,
            "description": cmd
        })
        i++;
    }
    vscode.window.showQuickPick(quickItemList).then((item) => {
        if (item) {
            let current_var = item.description!;
            // let activeEditor = vscode.window.activeTextEditor!;
            Persist.saveCmdStr(workspaceRoot, current_var);
            let terminal = vscode.window.activeTerminal!;
            // let command = `pytest -v  -x ${relative_path}`;
            terminal.show();
            terminal.sendText(current_var);


            // activeEditor.insertSnippet(new vscode.SnippetString(current_var), cursor);
            // update_last_used_variable(current_var!);

        }
    })

}