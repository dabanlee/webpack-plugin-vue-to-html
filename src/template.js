module.exports = function template(options) {
    const head = options.head;
    const consoleString = options.console ? `<script src="https://h5.meitu.com/js/console.min.js"></script>` : '';
    const timestamp = Date.parse(new Date()) / 1000;

    const metaString = head.meta.map(meta => {
        const keys = Object.keys(meta);
        const string = keys.map(key => ` ${key}="${meta[key]}"`).join('');
        return `<meta${string}>`;
    }).join('\n\t');

    const linkString = head.link.map(link => {
        if (!link.trim()) return '';
        return `<link rel="stylesheet" href="${link}?${timestamp}">`;
    }).join('\n\t');

    const scriptString = head.script.map(script => {
        if (!script.trim()) return '';
        return `<script src="${script}?${timestamp}"></script>`;
    }).join('\n\t');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    ${metaString}
    <title>${options.title}</title>
    ${linkString}
    <link rel="stylesheet" href="./css/global.css?${timestamp}">
    <link rel="stylesheet" href="./css/${options.page}.css?${timestamp}">
</head>
<body data-page="${options.page}">
    <div id="app">
        ${options.content}
    </div>
    ${scriptString}
    <script src="./js/global.js?${timestamp}"></script>
    <script src="./js/${options.page}.js?${timestamp}"></script>
    ${consoleString}
</body>
</html>`;
};
