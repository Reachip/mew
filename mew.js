const request = require("request");
const cheerio = require("cheerio");

class Mew {

    constructor (url) {

        this.graph = new Map();
        this._initGraph(url);

    }

    _fetchUrls (body) {

        const parser = cheerio.load(body);

        const links = [];

        parser(parser("a")).each((unused, link) => {

            links.push(parser(link).attr("href"));

        });

        return links;

    }

    _completeGraph (body) {

        const parser = cheerio.load(body);
        const pageTitle = parser("title").text();

        const links = this._fetchUrls(body);

        this.graph.set(pageTitle, links);

    }

    _initGraph (url) {

        request(url, (_error, _response, body) => {

            this._completeGraph(body);
            this.graph.forEach((item) => {

                try {

                    this._initGraph(item);

                } catch (err) {
                    // TODO
                } finally {

                    this.graph.forEach((item) => {

                        console.log(item);

                    });

                }

            });

        });

    }

}

module.exports = Mew;