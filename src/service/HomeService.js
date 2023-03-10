export class HomeService {

    getHomeSmall() {
        return fetch('home-small.json').then(res => res.json())
                .then(d => d.data);
    }
}