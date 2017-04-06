import angular from 'angular';
import photoSliderComponent from './PhotoSlider.component';
import flickrService from './Flickr.service';

export default angular.module('PhotoSlider', [])
  .component('photoSlider', photoSliderComponent)
  .service('flickrService', flickrService);