function getTitle(content = '') {
    const seperator = `title="`;
    if (content.indexOf(seperator) < 0) {
        return ``;
    }
    const [, trail] = content.split(seperator);
    const [title] = trail.split(`"`);
    return title;
}

module.exports = {
    getTitle,
};
