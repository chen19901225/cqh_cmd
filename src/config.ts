import * as vscode from "vscode"
import { extname } from "path";
import { START_TEXT } from "./constant";
// import {}
export interface ICommand {
    name: string
    list: [string, string];
}

export interface IConfig extends vscode.WorkspaceConfiguration {
    byExt: ICommand[];
    tagExCludeList: Array<string>
}

export function getConfig(): IConfig {
    let config = vscode.workspace.getConfiguration("cqh-cmd") as IConfig;
    return config;
}

export function getSnippetForExt(ext: string): ICommand | null {
    if (!ext.startsWith(".")) { // 不是ext二十路径
        ext = extname(ext);
    }
    let config = vscode.workspace.getConfiguration("cqh-cmd") as IConfig;
    let snippet = null;
    for (let i = 0; i < config.byExt.length; i++) {
        let current_snippet = config.byExt[i];
        if (current_snippet.name === ext) {
            snippet = current_snippet;
            break;
        }
    }

    return snippet;
    //return null;
}



export function getMatchText(cmd: ICommand, text: string): [boolean, string] {
    let line_text = text.trim();
    let [start_text, end_text] = cmd.list;
    start_text = start_text + START_TEXT
    if (line_text.startsWith(start_text) && line_text.endsWith(end_text)) {
        let match_content = line_text.slice(start_text.length)
        if (end_text) {
            match_content = match_content.slice(0, match_content.length - end_text.length)
        }
        return [true, match_content]
    }
    return [false, ""]

}