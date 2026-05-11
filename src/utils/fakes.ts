export interface OptionItem {
    value: string | number;
    label: string;
}

export const genderOption: OptionItem[] = [
    {
        value: "",
        label: "请选择",
    },{
        value: 1,
        label: "男",
    },{
        value: 2,
        label: "女",
    },
];

export const jobOption: OptionItem[] =[
    {
        value: "1",
        label: "班主任",
    },{
        value: "2",
        label: "讲师",
    },{
        value: "3",
        label: "学工主管",
    },{
        value: "4",
        label: "教研主管",
    },{
        value: "5",
        label: "咨询师",
    },
]

export const subjectOption: OptionItem[] = [
    {
        value: 1,
        label: "java",
    },{
        value: 2,
        label: "前端",
    },{
        value: 3,
        label: "大数据",
    },{
        value: 4,
        label: "Python",
    },{
        value: 5,
        label: "Go",
    },{
        value: 6,
        label: "嵌入式",
    },
]

export const degreeOption: OptionItem[] = [
    {
        value: 1,
        label: "初中",
    },{
        value: 2,
        label: "高中",
    },{
        value: 3,
        label: "大专",
    },{
        value: 4,
        label: "本科",
    },{
        value: 5,
        label: "硕士",
    },{
        value: 6,
        label: "博士",
    },
]

export const collectOption: OptionItem[] = [
    {
        value: 1,
        label: "是",
    },{
        value: 0,
        label: "否",
    },
]
