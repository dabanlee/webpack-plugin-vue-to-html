const fs = require('fs');
const path = require('path');
const template = require('./template');
const entryScript = require('./entryScript');
const renderer = require('vue-server-renderer').createRenderer();
const extend = require('just-extend-it');
const head = require('./head');
const { getTitle } = require('./helpers');
const globalName = `global`;

function VueToHTML(options = {}) {
    if (!(this instanceof VueToHTML)) return new VueToHTML(options);

    this.init(options);
}

VueToHTML.pagesDIR = VueToHTML.pagesDIR || `src/pages`;
VueToHTML.scriptType = `js`;

if (!fs.existsSync(path.resolve(__dirname, '../.entries'))) {
    fs.mkdirSync(path.resolve(__dirname, '../.entries'));
}

const pages = fs.readdirSync(path.resolve(VueToHTML.pagesDIR)).filter(page => page.indexOf(`.${VueToHTML.scriptType}`) < 0);

pages.map(page => fs.writeFileSync(path.resolve(__dirname, `../.entries/${page}.${VueToHTML.scriptType}`), entryScript(page)));

const entry = pages.reduce((prev, current) => {
    prev[current] = path.resolve(__dirname, `../.entries/${current}.${VueToHTML.scriptType}`);
    return prev;
}, {});

VueToHTML.entry = Object.assign(entry, {
    global: `./src/${globalName}.${VueToHTML.scriptType}`,
});

VueToHTML.getHost = function getHost() {
    const interfaces = require('os').networkInterfaces();
    return Object.keys(interfaces).map(interfaceKey => {
        return Object.keys(interfaces[interfaceKey]).map((key) => {
            const network = interfaces[interfaceKey][key];
            const isIPv4 = family => family === 'IPv4';
            const isLocal = address => /^(192|172)\./.test(address);
            if (isIPv4(network.family) && isLocal(network.address)) return network.address;
        });
    }).map(a => a.filter(a => a != undefined)).filter(a => a.length > 0).map(a => a[0])[0];
};

VueToHTML.prototype.init = function (options) {
    this.options = extend(true, {
        console: false,
        head,
    }, options);
};

VueToHTML.prototype.apply = function (compiler) {
    const options = this.options;
    compiler.hooks.afterEmit.tap('VueToHTML', () => {
        const distPATH = compiler.options.output.path;
        pages.map(page => {
            const title = getTitle(fs.readFileSync(path.resolve(VueToHTML.pagesDIR, `${page}/index.vue`), 'utf-8'));
            const appPATH = path.resolve(distPATH, `js/${page}`);
            const createApp = require(appPATH).default;

            renderer.renderToString(createApp()).then(content => {
                options.page = page;
                options.title = title;
                options.content = content;
                fs.writeFileSync(`${distPATH}/${page}.html`, template(options));
            }).catch(error => console.log('renderToString error', error));
        });
    });
};

module.exports = VueToHTML;
