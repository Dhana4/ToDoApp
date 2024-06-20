export interface Task {
    id : number;
    title : string;
    description : string;
    userId : number;
    completedOn : Date | string;
    status : boolean;
    createdOn : Date | string;
}
