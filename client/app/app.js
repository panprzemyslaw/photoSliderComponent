import angular from 'angular';
import uiRouter from 'angular-ui-router';
import PhotoSlider from './components/PhotoSlider/index';
import './app.scss';

angular.module('app', [
    uiRouter,
    PhotoSlider.name
  ])
  .config(($locationProvider) => {
    "ngInject";
    $locationProvider.html5Mode(true).hashPrefix('!');
  });
