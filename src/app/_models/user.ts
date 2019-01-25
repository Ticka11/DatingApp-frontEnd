import { Photo } from "./photo";

export interface User {
    id: number;
    username: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: Date;
    photoUrl: string;
    city: string;
    country: string;
    //optional props need to come aftet required props
    //otherwise it will throw an error
    interests?: string;
    introduction?: string;
    lookingFor?:string;
    photos?: Photo[];
}