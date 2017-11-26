import { Image } from '../interfaces/spotifyImage.interface';

export class User {
    display_name: string;
    id: string;
    images: Image[] = [];

    constructor(new_name: string, new_id: string, new_images: Image[]){
        this.display_name = new_name;
        this.id = new_id;
        this.images = new_images;
    }

}

