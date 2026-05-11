import { ElMessage } from "element-plus";
import moment from "moment";
import type { Result } from "@/types/common";

interface AddOrEditParams {
    res: Result;
    type: string;
    func?: () => void;
}

export const addOrEditRes = (params: AddOrEditParams) => {    
    if (params.res.code === 1) {
        switch(params.type) {
            case "add":
                ElMessage.success("新建成功！");
                params.func?.();
                break;
            case "edit":
                ElMessage.success("修改成功！");
                params.func?.();
                break;
            case "delete":
                ElMessage.success("删除成功！");
                break;
            default:
                break;
        }
    } else {
        ElMessage.error(params.res.msg || "操作失败");
    }
}

export const formatTime = (time: string) => {
    return moment(time).format("YYYY-MM-DD HH:mm:ss")
}