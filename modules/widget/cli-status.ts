interface CLIStatusOptions {
    width?: string,
    height?: string,
    backgroundColor?: string,
    fontSize?: string,
    maxLines?: number
}
export function cliStatus(containerQuerySelector: string, options: CLIStatusOptions = {}) {
    let container = document.querySelector(containerQuerySelector);

    if (!container) return null;

    return new CLIStatus(container, options)
}

class CLIStatus {
    container: Element;
    element: HTMLElement;
    options: CLIStatusOptions;
    lines: CLIStatusLine[];
    constructor(container: Element, options: CLIStatusOptions = {}) {
        this.element = document.createElement('div');
        this.element.classList.add('cli-status');

        this.element.style.width = options.width ?? '100%';
        this.element.style.height = options.height ?? '100%';

        this.element.style.backgroundColor = options.backgroundColor || 'inherit';
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'column';
        this.element.style.justifyContent = 'flex-end';


        container.appendChild(this.element);
        this.options = options;
        this.lines = [];
    }

    newLine(str: string) {
        let line = new CLIStatusLine(this.element, str, this.options);
        this.lines.unshift(line);
        while (this.options.maxLines && this.lines.length >= this.options.maxLines) {
            this.lines.pop().element.remove();
        }
        this.lines.forEach((line, idx) => {
            let opacity = (this.options.maxLines - idx) / this.options.maxLines
            line.setOpacity(opacity.toString())
        })
        return line;
    }
}

class CLIStatusLine {
    element: HTMLElement;
    string: string;
    constructor(container: HTMLElement, str: string = '', options: CLIStatusOptions = {}) {
        this.element = document.createElement('span');
        this.element.style.display = 'block';
        this.element.style.fontSize = options.fontSize || '12px';
        this.setString(str);

        container.appendChild(this.element)
    }
    append(str: string = '') {
        this.element.innerHTML = this.string = this.string + str
    }
    getString() {
        return this.string;
    }
    setString(str: string = '') {
        this.element.innerHTML = this.string = str;
    }
    setOpacity(opacity: string) {
        this.element.style.opacity = opacity
    }
}