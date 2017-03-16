import angular from 'angular';
import template from './PhotoSlider.component.template.html';

class PhotoSlider {

    static get $inject() {
        return ['$element', '$document', '$timeout'];
    }

    constructor() {

    }

    $onInit() {

    }

    $onChanges(changes) {

    }

    // notify parent
    updateParent() {
        this.onUpdate({
            $event: {}
        });
    }



}

export default {
    bindings: {},
    controller: PhotoSlider,
    template
};