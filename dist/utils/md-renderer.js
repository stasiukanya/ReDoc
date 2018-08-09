'use strict';
import slugify from 'slugify';
import * as Remarkable from 'remarkable';
function HTMLescape(html) {
    return document.createElement('div')
        .appendChild(document.createTextNode(html))
        .parentNode
        .innerHTML;
}
var md = new Remarkable({
    html: true,
    linkify: true,
    breaks: false,
    typographer: false,
    highlight: function (str, lang) {
        if (lang === 'json')
            lang = 'js';
        var grammar = Prism.languages[lang];
        // fallback to click
        if (!grammar)
            return HTMLescape(str);
        return Prism.highlight(str, grammar);
    }
});
var MdRenderer = /** @class */ (function () {
    function MdRenderer(raw) {
        if (raw === void 0) { raw = false; }
        this.raw = raw;
        this.headings = {};
        this._origRules = {};
        this._preProcessors = [];
    }
    MdRenderer.prototype.addPreprocessor = function (p) {
        this._preProcessors.push(p);
    };
    MdRenderer.prototype.saveOrigRules = function () {
        this._origRules.open = md.renderer.rules.heading_open;
        this._origRules.close = md.renderer.rules.heading_close;
    };
    MdRenderer.prototype.restoreOrigRules = function () {
        md.renderer.rules.heading_open = this._origRules.open;
        md.renderer.rules.heading_close = this._origRules.close;
    };
    MdRenderer.prototype.saveHeading = function (title, parent) {
        if (parent === void 0) { parent = { id: null, children: this.headings }; }
        // if title contains some non-ASCII characters (e.g. chinese) slugify returns empty string
        var slug = slugify(title) || title;
        var id = slug;
        if (parent && parent.id)
            id = parent.id + "/" + id;
        parent.children = parent.children || {};
        parent.children[id] = {
            title: title,
            id: id,
            slug: slug
        };
        return parent.children[id];
    };
    MdRenderer.prototype.flattenHeadings = function (container) {
        var _this = this;
        if (!container)
            return [];
        var res = [];
        Object.keys(container).forEach(function (k) {
            var heading = container[k];
            res.push(heading);
            res.push.apply(res, _this.flattenHeadings(heading.children));
        });
        return res;
    };
    MdRenderer.prototype.attachHeadingsContent = function (rawText) {
        var buildRegexp = function (heading) { return new RegExp("<h\\d section=\"section/" + heading.id + "\">"); };
        var tmpEl = document.createElement('DIV');
        var html2Str = function (html) {
            tmpEl.innerHTML = html;
            return tmpEl.innerText;
        };
        var flatHeadings = this.flattenHeadings(this.headings);
        if (flatHeadings.length < 1)
            return;
        var prevHeading = flatHeadings[0];
        var prevPos = rawText.search(buildRegexp(prevHeading));
        for (var i = 1; i < flatHeadings.length; i++) {
            var heading = flatHeadings[i];
            var currentPos = rawText.substr(prevPos + 1).search(buildRegexp(heading)) + prevPos + 1;
            prevHeading.content = html2Str(rawText.substring(prevPos, currentPos));
            prevHeading = heading;
            prevPos = currentPos;
        }
        prevHeading.content = html2Str(rawText.substring(prevPos));
    };
    MdRenderer.prototype.headingOpenRule = function (tokens, idx) {
        if (tokens[idx].hLevel > 2) {
            return this._origRules.open(tokens, idx);
        }
        else {
            var content = tokens[idx + 1].content;
            if (tokens[idx].hLevel === 1) {
                this.currentTopHeading = this.saveHeading(content);
                var id = this.currentTopHeading.id;
                return "<h" + tokens[idx].hLevel + " section=\"section/" + id + "\">" +
                    ("<a class=\"share-link\" href=\"#section/" + id + "\"></a>") +
                    ("<a name=\"" + id.toLowerCase() + "\"></a>");
            }
            else if (tokens[idx].hLevel === 2) {
                var heading = this.saveHeading(content, this.currentTopHeading);
                var contentSlug = "" + heading.id;
                return "<h" + tokens[idx].hLevel + " section=\"section/" + heading.id + "\">" +
                    ("<a class=\"share-link\" href=\"#section/" + contentSlug + "\"></a>") +
                    ("<a name=\"" + heading.slug.toLowerCase() + "\"></a>");
            }
        }
    };
    MdRenderer.prototype.headingCloseRule = function (tokens, idx) {
        if (tokens[idx].hLevel > 2) {
            return this._origRules.close(tokens, idx);
        }
        else {
            return "</h" + tokens[idx].hLevel + ">\n";
        }
    };
    MdRenderer.prototype.renderMd = function (rawText) {
        if (!this.raw) {
            this.saveOrigRules();
            md.renderer.rules.heading_open = this.headingOpenRule.bind(this);
            md.renderer.rules.heading_close = this.headingCloseRule.bind(this);
        }
        var text = rawText;
        for (var i = 0; i < this._preProcessors.length; i++) {
            text = this._preProcessors[i](text);
        }
        var res = md.render(text);
        this.attachHeadingsContent(res);
        if (!this.raw) {
            this.restoreOrigRules();
        }
        return res;
    };
    return MdRenderer;
}());
export { MdRenderer };
//# sourceMappingURL=md-renderer.js.map