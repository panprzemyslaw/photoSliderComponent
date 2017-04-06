import photoSliderModule from './';

describe('Flickr service', function() {

  beforeEach(function () {
    angular.mock.inject.strictDi(true);
    angular.mock.module(photoSliderModule.name);

    angular.mock.inject(function ($injector) {
      this.flickrService = $injector.get('flickrService');
      this.$httpBackend = $injector.get('$httpBackend');
      this.$timeout = $injector.get('$timeout');
    });
  });

  describe('when "getPhotosByCategory" is called', function () {

    beforeEach(function () {
      this.key ='ef5fbb889d09e2e9a813526c99d111fb';
      this.apiURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
      this.url = `${this.apiURL}&api_key=${this.key}&format=json&nojsoncallback=1`;
      this.category = 'flower';
      this.limit = 15;
      this.page = 1;
      this.$httpBackend.expectGET(`${this.apiURL}&api_key=${this.key}&format=json&nojsoncallback=1&text=${this.category}&per_page=${this.limit}&page=${this.page}`).respond(200);
      this.flickrService.getPhotosByCategory(this.category, this.limit, this.page);
      this.$httpBackend.flush();
    });

    it('should call the appropriate API URL', function () {
      this.$httpBackend.verifyNoOutstandingExpectation();
    });

  });

  describe('when "getImageURL" is called', function () {

    beforeEach(function () {
      this.photo = {
        id: 'test id',
        title: 'test title',
        farm: 'test farm',
        server: 'test server',
        secret: 'test secret'
      };
      this.expectedURL = `https://farm${this.photo.farm}.staticflickr.com/${this.photo.server}/${this.photo.id}_${this.photo.secret}_q.jpg`;
      this.returnedURL = this.flickrService.getImageURL(this.photo);
    });

    it('should return appropriate image URL', function () {
      expect(this.expectedURL).toEqual(this.returnedURL);
    });

  });

});