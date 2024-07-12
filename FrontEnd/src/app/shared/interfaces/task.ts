export interface Task {
    id : number;
    title : string;
    description : string;
    userId : number;
    completedOn : Date | string;
    isCompleted : boolean;
    createdOn : Date | string;
    dueDate : Date | null;
}
