import angular from 'angular';
import template from './PhotoSlider.component.template.html';

class PhotoSlider {

  static get $inject() {
    return ['flickrService'];
  }

  constructor(flickrService) {
    console.debug("constructor");
    this.flickr = flickrService;
  }

  $onInit() {
    console.debug('onInit ');
    this.images = [];
    this.page = 1;
    this.currentPhotoIndex = 0;
    this.flickr.getPhotosByCategory(this.category, this.limit, this.page)
      .then(this.getImagesFromResponse.bind(this))
      .catch(this.handleError.bind(this));
  }

  getImagesFromResponse(response) {
    console.debug(response);
    this.photos = response.data.photos.photo;
    console.debug('photos ', this.photos);
    for (const photo of this.photos) {
      this.images.push({
        url: this.flickr.getImageURL(photo),
        title: `${photo.title}`,
        isActive: false
      });
    }
    this.images[0].isFirst = true;
    this.images[this.currentPhotoIndex].isActive = true;
  }

  get isPrevBtnVisible() {
    return this.currentPhotoIndex === 0;
  }

  handleError(error) {
    console.debug('error ', error);
  }

  $onChanges(changes) {
    console.debug('onChanges ', changes);

  }

}

export default {
  bindings: {
    category: '@',
    limit: '<'
  },
  controller: PhotoSlider,
  template
};