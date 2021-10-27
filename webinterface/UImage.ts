class UniversalImage extends HTMLImageElement {

    connectedCallback() {
        let self = this;

        fetch(self.src).then(async function (response) {
            const img = await response.blob();
            self.srcset = URL.createObjectURL(img);
        });
    }

    disconnectedCallback() {
        
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                break;
            case 'using':
                break;
            case 'with':
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with']; }
}

export {UniversalImage}