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
    this.animation = 'next';
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
    this.images[this.currentPhotoIndex].isActive = true;
    this.images[this.currentPhotoIndex + 1].isNext = true;
  }

  get isActiveFirst() {
    if (this.images[0]){
      return this.images[0].isActive;
    } else {
      return false;
    }
  }

  get isActiveLast() {
    const indexLast = this.images.length - 1;
    if (this.images[indexLast]){
      return this.images[indexLast].isActive;
    } else {
      return false;
    }
  }

  get isAnimationNext() {
    return this.animation === 'next';
  }

  get isAnimationPrev() {
    return this.animation === 'prev';
  }

  showNext() {
    this.animation = 'next';
    if (this.images[this.currentPhotoIndex - 1]){
      this.images[this.currentPhotoIndex - 1].isPrev = false;
    }
    this.images[this.currentPhotoIndex].isActive = false;
    this.images[this.currentPhotoIndex].isPrev = true;
    this.currentPhotoIndex++;
    this.images[this.currentPhotoIndex].isActive = true;
    this.images[this.currentPhotoIndex].isNext = false;
    this.images[this.currentPhotoIndex + 1].isNext = true;
  }

  showPrev() {
    this.animation = 'prev';
    if (this.images[this.currentPhotoIndex + 1]){
      this.images[this.currentPhotoIndex + 1].isNext = false;
    }
    this.images[this.currentPhotoIndex].isActive = false;
    this.images[this.currentPhotoIndex].isNext = true;
    this.currentPhotoIndex--;
    this.images[this.currentPhotoIndex].isActive = true;
    this.images[this.currentPhotoIndex].isPrev = false;
    this.images[this.currentPhotoIndex - 1].isPrev = true;
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