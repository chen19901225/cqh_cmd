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
        // oldCmdList.unshift(cmdStr);
        if (oldCmdList.length > 0) {
            if (oldCmdList[0] != cmdStr) {
                oldCmdList.unshift(cmdStr)
                oldCmdList = oldCmdList.slice(0, 30);
            }
        } else {
            oldCmdList.unshift(cmdStr)
        }
        fs.writeJsonSync(Persist.historyPath(dir), oldCmdList);

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