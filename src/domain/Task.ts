import {CustomError} from "../shared/errors/CustomError";

export class Task {
    id: number | null;
    title: string;
    description: string;

    constructor(id: number | null, title: string, description: string) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    validate(): void {
        if (!this.title || !this.description) {
            //return Promise.reject({status: 400, message: 'Both title and description are required'})
            throw new CustomError('Both title and description are required', 400);
        }
    }
}
