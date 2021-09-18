import * as path from "path";
import * as fs from "fs-extra";

export class Persist {

    public constructor() {

    }

    public static historyPath(dir: string): string {
        return path.join(dir, ".vscode/cqh_cmd__history.json")

    }

    public static saveCmdStr(dir: string, cmdStr: string) {
        let oldCmdList = Persist.loadFromFile(Persist.historyPath(dir));
        let new_cmd_list: string[] = []
        for (let cmd_str of oldCmdList) {
            cmd_str = cmd_str.trim();
            if (new_cmd_list.indexOf(cmd_str) === -1) {
                new_cmd_list.push(cmd_str)
            }
        }
        cmdStr = cmdStr.trim();
        // oldCmdList.unshift(cmdStr);
        if (new_cmd_list.length > 0) {
            if (new_cmd_list.indexOf(cmdStr) == -1) {
                new_cmd_list.splice(new_cmd_list.indexOf(cmdStr))
            }
            new_cmd_list.unshift(cmdStr);
        } else {
            new_cmd_list.unshift(cmdStr)
        }
        fs.writeJsonSync(Persist.historyPath(dir), new_cmd_list);

    }
    public static loadFromFile(file_path: string): Array<string> {
        try {
            return fs.readJsonSync(file_path);
        } catch (error) {
            fs.ensureFileSync(file_path);
            return [];
        }


    }

}