export default class FlickService {

  static get $inject() {
    return ['$http'];
  }

  constructor($http) {
    console.debug("Flickr service");
    this.http = $http;
    this.key ='ef5fbb889d09e2e9a813526c99d111fb';
    this.url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.key}&format=json&nojsoncallback=1`;
  }

  getPhotosByCategory(category, limit, page) {
    this.url += `&text=${category}&per_page=${limit}&page=${page}`;
    return this.http.get(this.url);
  }

  getImageURL(photo) {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
  }

}