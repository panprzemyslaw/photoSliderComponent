import angular from 'angular';
import template from './PhotoSlider.component.template.html';

const NEXT = 'next';
const PREV = 'prev';

class PhotoSlider {

  static get $inject() {
    return ['flickrService', '$element'];
  }

  constructor(flickrService, $element) {
    this.flickr = flickrService;
    this.element = $element;
  }

  $onInit() {
    this.images = [];
    this.page = 1;
    this.currentPhotoIndex = 0;
    this.animation = NEXT;
    this.isLoadingContent = true;
    this.loadAndDisplayPhotos();
  }

  loadAndDisplayPhotos() {
    this.flickr.getPhotosByCategory(this.category, this.limit, this.page)
      .then(this.getImagesFromResponse.bind(this))
      .catch(this.handleError.bind(this))
      .finally(() => {this.isLoadingContent = false});
  }

  getImagesFromResponse(response) {
    this.photos = response.data.photos.photo;
    for (const photo of this.photos) {
      this.images.push({
        url: this.flickr.getImageURL(photo),
        title: `${photo.title}`,
        isActive: false
      });
    }
    this.images[this.currentPhotoIndex].isActive = true;
    this.images[this.currentPhotoIndex + 1].isNext = true;
    this.updateInfo();
  }

  getNextPhotoSet() {
    this.page++;
    this.loadAndDisplayPhotos();
  }

  get isActiveFirst() {
    const firstImage = this.images[0];
    if (firstImage){
      return firstImage.isActive;
    } else {
      return false;
    }
  }

  get isActiveLast() {
    const indexLast = this.images.length - 1;
    const lastImage = this.images[indexLast];
    if (lastImage){
      return lastImage.isActive;
    } else {
      return false;
    }
  }

  get isAnimationNext() {
    return this.animation === NEXT;
  }

  get isAnimationPrev() {
    return this.animation === PREV;
  }

  showNext() {
    this.animation = NEXT;
    const currentImage = this.images[this.currentPhotoIndex];
    const prevImage = this.images[this.currentPhotoIndex - 1];
    const nextImage = this.images[this.currentPhotoIndex + 1];
    const imageAfterNext = this.images[this.currentPhotoIndex + 2];
    if (prevImage){
      prevImage.isPrev = false;
    }
    currentImage.isActive = false;
    currentImage.isPrev = true;
    nextImage.isActive = true;
    nextImage.isNext = false;
    if (imageAfterNext) {
      imageAfterNext.isNext = true;
    }
    this.currentPhotoIndex++;
    if (this.currentPhotoIndex === this.images.length - 2){
      this.getNextPhotoSet();
    }
    this.updateInfo();
  }

  showPrev() {
    this.animation = PREV;
    const currentImage = this.images[this.currentPhotoIndex];
    const prevImage = this.images[this.currentPhotoIndex - 1];
    const nextImage = this.images[this.currentPhotoIndex + 1];
    const imageBeforePrev = this.images[this.currentPhotoIndex - 2];
    if (nextImage){
      nextImage.isNext = false;
    }
    currentImage.isActive = false;
    currentImage.isNext = true;
    prevImage.isActive = true;
    prevImage.isPrev = false;
    if (imageBeforePrev){
      imageBeforePrev.isPrev = true;
    }
    this.currentPhotoIndex--;
    this.updateInfo()
  }

  updateInfo() {
    const infoBox = angular.element(this.element[0].querySelectorAll('.photo-info'));
    infoBox.html(this.images[this.currentPhotoIndex].title);
  }

  handleError(error) {

  }

  $onChanges(changes) {


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