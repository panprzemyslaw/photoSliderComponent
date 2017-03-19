import photoSliderModule from './';

const FLICKR_RESPONSE = {
  data: {
    photos: {
      photo: [
        {
          id: 'test id',
          title: 'test title',
          farm: 'test farm',
          server: 'test server',
          secret: 'test secret'
        },
        {
          id: 'test id 2',
          title: 'test title 2',
          farm: 'test farm 2',
          server: 'test server 2',
          secret: 'test secret 2'
        },
        {
          id: 'test id 3',
          title: 'test title 3',
          farm: 'test farm 3',
          server: 'test server 3',
          secret: 'test secret 3'
        },
        {
          id: 'test id 4',
          title: 'test title 4',
          farm: 'test farm 4',
          server: 'test server 4',
          secret: 'test secret 4'
        }
      ]
    }
  }
};

describe('PhotoSlider component', function() {

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(photoSliderModule.name);

    angular.mock.inject(function($injector) {
      this.flickrService = $injector.get('flickrService');
      this.$componentController = $injector.get('$componentController');
      this.$rootScope = $injector.get('$rootScope');
      this.$timeout = $injector.get('$timeout');
      this.$compile = $injector.get('$compile');
      this.$q = $injector.get('$q');
      this.outerScope = this.$rootScope.$new();
      this.template = `
      <photo-slider
        category="flower"
        limit="15"
      >
      </photo-slider>
      `;

      this.createController = (bindings) => {
        this.element = this.getCompiledElement();
        const deps = {$element: this.element, $timeout: this.$timeout};
        const ctrl = this.$componentController('photoSlider', deps, bindings);
        ctrl.$onInit();
        return ctrl;
      };

      this.getCompiledElement = () => {
        const elem = angular.element(this.template);
        const compiledElem = this.$compile(elem)(this.outerScope);
        this.outerScope.$digest();
        return compiledElem;
      };

    });
  });

  describe('given photoSlider', function() {
    describe('when "category" is changed', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ category: 'cats' });
        this.changes = { category: {} };

        this.changes.category.currentValue = 'flower';
        this.ctrl.$onChanges(this.changes);
      });

      it('should update "category" attribute', function() {
        expect(this.ctrl.category).toEqual(this.changes.category.currentValue);
      });

    });

    describe('when "limit" is changed', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ limit: 15 });
        this.changes = { limit: {} };

        this.changes.limit.currentValue = 90;
        this.ctrl.$onChanges(this.changes);
      });

      it('should update "limit" attribute', function() {
        expect(this.ctrl.limit).toEqual(this.changes.limit.currentValue);
      });

  });

  describe('when component is initialized', function() {

    beforeEach(function() {
      this.ctrl = this.createController({ limit: 15, category: 'flower' });
      spyOn(this.ctrl, 'loadAndDisplayPhotos');
      this.ctrl.$onInit();
    });

    it('should call "loadAndDisplayPhotos" method', function() {
      expect(this.ctrl.loadAndDisplayPhotos).toHaveBeenCalled();
    });

    it('should set "page" attribute with 1', function() {
      expect(this.ctrl.page).toEqual(1);
    });

    it('should set "currentPhotoIndex" attribute with 0', function() {
      expect(this.ctrl.currentPhotoIndex).toEqual(0);
    });

  });

  describe('when servers responds with data ', function() {

    beforeEach(function() {
      this.ctrl = this.createController({ limit: 15, category: 'flower' });
      spyOn(this.ctrl.flickr, 'getPhotosByCategory').and.callFake(() => {
        return this.$q.resolve({data:{}});
      });
      spyOn(this.ctrl, 'getImagesFromResponse');
      this.ctrl.$onInit();
      this.$timeout.flush();
    });

    it('should call "getImagesFromResponse" method with data respone', function() {
      expect(this.ctrl.getImagesFromResponse).toHaveBeenCalledWith({data: {}});
    });

    it('should hide preloader', function() {
      expect(this.ctrl.isLoadingContent).toBeFalsy();
    });

  });

    describe('when servers responds with error ', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ limit: 15, category: 'flower' });
        spyOn(this.ctrl.flickr, 'getPhotosByCategory').and.callFake(() => {
          return this.$q.reject('error');
        });
        spyOn(this.ctrl, 'handleError');
        this.ctrl.$onInit();
        this.$timeout.flush();
      });

      it('should call "handleError" method', function() {
        expect(this.ctrl.handleError).toHaveBeenCalled();
      });

    });

    describe('when "getImagesFromResponse" is provided with server data ', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ limit: 15, category: 'flower' });
        spyOn(this.ctrl, 'updateInfo');
        this.ctrl.$onInit();
        this.ctrl.getImagesFromResponse(FLICKR_RESPONSE);
      });

      it('should populate the images', function() {
        expect(this.ctrl.images.length).toEqual(FLICKR_RESPONSE.data.photos.photo.length);
        expect(this.ctrl.images[0].title).toEqual(FLICKR_RESPONSE.data.photos.photo[0].title);
        expect(this.ctrl.images[1].title).toEqual(FLICKR_RESPONSE.data.photos.photo[1].title);
        expect(this.ctrl.images[2].title).toEqual(FLICKR_RESPONSE.data.photos.photo[2].title);
        expect(this.ctrl.images[3].title).toEqual(FLICKR_RESPONSE.data.photos.photo[3].title);
      });

      it('should call "updateInfo" method', function() {
        expect(this.ctrl.updateInfo).toHaveBeenCalled();
      });

    });

    describe('when "getNextPhotoSet" is called', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ limit: 15, category: 'flower' });
        spyOn(this.ctrl, 'loadAndDisplayPhotos');
        this.ctrl.$onInit();
        this.ctrl.getNextPhotoSet();
      });

      it('should increase "page" attribute', function() {
        expect(this.ctrl.page).toEqual(2);
      });

      it('should call "loadAndDisplayPhotos" method', function() {
        expect(this.ctrl.loadAndDisplayPhotos).toHaveBeenCalled();
      });

    });

    describe('when "showNext" method is called ', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ limit: 15, category: 'flower' });
        spyOn(this.ctrl, 'updateInfo');
        spyOn(this.ctrl, 'hideThumbs');
        this.ctrl.$onInit();
        this.ctrl.currentPhotoIndex = 1;
        this.prevImageIndex = 0;
        this.currImageIndex = 1;
        this.nextImageIndex = 2;
        this.ctrl.getImagesFromResponse(FLICKR_RESPONSE);
        this.ctrl.showNext();
      });

      it('should increase "currentPhotoIndex" attribute', function() {
        expect(this.ctrl.currentPhotoIndex).toEqual(2);
      });

      it('should update "animation" attribute with "next" value', function() {
        expect(this.ctrl.animation).toEqual('next');
      });

      it('should call "updateInfo" method', function() {
        expect(this.ctrl.updateInfo).toHaveBeenCalled();
      });

      it('should call "hideThumbs" method', function() {
        expect(this.ctrl.hideThumbs).toHaveBeenCalled();
      });

      it('should set the next image as "active"', function() {
        expect(this.ctrl.images[this.nextImageIndex].isActive).toBeTruthy();
      });

      it('should set the image after next "isNext" attribute as "true"', function() {
        expect(this.ctrl.images[this.nextImageIndex + 1].isNext).toBeTruthy();
      });

      it('should set the current image as "prev"', function() {
        expect(this.ctrl.images[this.currImageIndex].isPrev).toBeTruthy();
      });

      it('should set the previous image "isPrev" attribute with false', function() {
        expect(this.ctrl.images[this.prevImageIndex].isPrev).toBeFalsy();
      });

    });

    describe('when "showNext" method is called and we are approaching the end of slides ', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ limit: 15, category: 'flower' });
        spyOn(this.ctrl, 'getNextPhotoSet');
        this.ctrl.$onInit();
        this.ctrl.currentPhotoIndex = 1;
        this.ctrl.getImagesFromResponse(FLICKR_RESPONSE);
        this.ctrl.showNext();
      });

      it('should call "getNextPhotoSet" method', function() {
        expect(this.ctrl.getNextPhotoSet).toHaveBeenCalled();
      });

    });

    describe('when "showPrev" method is called ', function() {

      beforeEach(function() {
        this.ctrl = this.createController({ limit: 15, category: 'flower' });
        spyOn(this.ctrl, 'updateInfo');
        spyOn(this.ctrl, 'hideThumbs');
        this.ctrl.$onInit();
        this.ctrl.currentPhotoIndex = 1;
        this.prevImageIndex = 0;
        this.currImageIndex = 1;
        this.nextImageIndex = 2;
        this.ctrl.getImagesFromResponse(FLICKR_RESPONSE);
        this.ctrl.showPrev();
      });

      it('should decrease "currentPhotoIndex" attribute', function() {
        expect(this.ctrl.currentPhotoIndex).toEqual(0);
      });

      it('should update "animation" attribute with "prev" value', function() {
        expect(this.ctrl.animation).toEqual('prev');
      });

      it('should call "updateInfo" method', function() {
        expect(this.ctrl.updateInfo).toHaveBeenCalled();
      });

      it('should call "hideThumbs" method', function() {
        expect(this.ctrl.hideThumbs).toHaveBeenCalled();
      });

      it('should set the previous image as "active"', function() {
        expect(this.ctrl.images[this.prevImageIndex].isActive).toBeTruthy();
      });

      it('should set the current image as "next"', function() {
        expect(this.ctrl.images[this.currImageIndex].isNext).toBeTruthy();
      });

      it('should set the next image "isNext" attribute with false', function() {
        expect(this.ctrl.images[this.nextImageIndex].isNext).toBeFalsy();
      });

    });

  });
});