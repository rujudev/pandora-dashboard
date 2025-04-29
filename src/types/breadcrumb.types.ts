export type CrumbData = {
    label: string;
    isLast: boolean;
    path: string;
};

export type CrumbHandle = {
    crumb: (data: CrumbData) => { label: string };
};