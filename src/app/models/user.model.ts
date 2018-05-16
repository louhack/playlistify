import { Image } from '../interfaces/spotifyImage.interface';

export class User {
    _id: string;
    display_name: string;
    id: string;
    images: Image[] = [];

    constructor(idMongo: string, new_name: string, new_id: string, new_images: Image[]) {
        this._id = idMongo;
        this.display_name = new_name;
        this.id = new_id;
        this.images = new_images;
    }
}

