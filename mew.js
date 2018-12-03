const request = require("request"); // High-level http library 
const cheerio = require("cheerio"); // HTML parser

class Mew {
    constructor(url) {
        this.graph = new Map();
        this._initGraph(url);        
    }


    _fetchUrls(body) {
        /* Fetch urls in a given html source code */ 
        
        const parser = cheerio.load(body);
        const links = [];
        
        parser(parser("a")).each((_unused, link) => {
            links.push(parser(link).attr("href"));
        });

        return links;
    }


    _completeGraph(body) {
        /* Set in the "graph" a key 
         * (the title of the html doc)  
         * and a value 
         * (lists of urls in a html source code)*/

        const parser = cheerio.load(body);
        const pageTitle = parser("title").text();

        const links = this._fetchUrls(body);

        this.graph.set(pageTitle, links);
    }


    _initGraph(url) {
        /* Recursive function wich take 
         * the given url and iterate to his urls */

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
