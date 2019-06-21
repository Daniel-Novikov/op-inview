import { af } from '@gladeye/af';
import opViewProgress from 'op-view-progress';

class OpInview {

    entered = false;
    enterDirection = null;
    exitDirection = null;
    
    // Default config values
    config = {
        start: 0.2, // start progress to trigger onEnter / onExit
        end: 0.8, // end progress to trigger onEnter / onExit
        classEnter: 'is-inview-enter', // Default class to be applied on enter
        classExit: 'is-inview-exit', // Default class to be applied on exit
        deactivate: false, // if true, allowes exit and re-eneter
        // onEnterCallback: () => {}, // function to call on Enter. Recieves object with 'value` and 'direction' props
        // onExitCallback: () => {}, // function to call on Exit. Recieves object with 'value` and 'direction' props
    };

    constructor(config) {
        this.config = { ...this.config, ...config };

        this.progress = new opViewProgress(this.config.el);
        this.af = af();

        this.af.addRead(this.read);
        this.af.addWrite(this.write);
    }

    destory() {
        this.af.removeRead(this.read);
        this.af.removeWrite(this.write);
    }

    read = () => {
        this.progress.tick();
    };
    
    get direction() {
        const { value } = this.progress;
        const { start, end } = this.config;
        return value < (start + end) * 0.5 ? 'top' : 'bottom';
    }

    write = () => {
        const { value } = this.progress;
        const { start, end } = this.config;

        if (value >= start && value <= end) {
            this.onEnter();
        } else {
            this.onExit();
        }
    }
    
    onEnter = () => {
        if (this.entered) return;
        this.entered = true;

        const { classEnter, classExit, onEnterCallback } = this.config;
        const { direction } = this;
        
        this.enterDirection = direction;

        if (classExit) {
            this.removeClass(classExit, this.exitDirection);
        }

        if (classEnter) {
            this.addClass(classEnter, this.enterDirection);
        }
        
        // If doesnt need to exit, destroy
        if (!this.config.deactivate) {
            this.destory();
        }

        if (onEnterCallback) {
            const { value } = this.progress;
            onEnterCallback({ value, direction });
        }
    }

    onExit = () => {
        // Don't exit if not allowed
        if (!this.config.deactivate) return;

        if (!this.entered) return;
        this.entered = false;

        const { classEnter, classExit, onExitCallback } = this.config;
        const { direction } = this;

        this.exitDirection = direction;

        if (classEnter) {
            this.removeClass(classEnter, this.enterDirection);
        }

        if (classExit) {
            this.addClass(classExit, this.exitDirection);
        }

        if (onExitCallback) {
            const { value } = this.progress;
            onExitCallback({ value, direction });
        }
    }

    addClass = (className, direction) => {
        const { el } = this.config;

        this.af.onNextWrite(() => {
            el.classList.add(className);
            el.classList.add(`${className}-${direction}`);
        });
    }

    removeClass = (className, direction) => {
        const { el } = this.config;

        this.af.onNextWrite(() => {
            el.classList.remove(className);
            el.classList.remove(`${className}-${direction}`);
        });
    }
}


// Enable inline quick add
// op-inview='{"start": 0, "end": 1}'
// Include JSON object inside
function inline() {
    const nodes = [].slice.call(document.querySelectorAll('[op-inview]'));
    let inviews = [];

    if (nodes.length > 0) {
        inviews = nodes.map(inviewNode => new OpInview({ el: inviewNode, ...JSON.parse(inviewNode.getAttribute('op-inview')) }));
    }

    return inviews;
}

function create(config = {}) {
    return new OpInview(config); 
}

export default { 
    create,
    inline,
};
