const ejs = require("ejs");
const fs = require("fs");
const chokidar = require('chokidar');
const express = require('express');

const requireUncached = (module) => {
    delete require.cache[require.resolve(module)];
    return require(module);
};

const buildPages = () => {
    const configs = [requireUncached("./config.js")/* , requireUncached("./i18n/config-zh-CN.js") */];
    configs.forEach((config) =>
        config.builderConfig.map((item) => {
            let html = ejs.render(
                fs.readFileSync("./ejs/index.ejs", { encoding: "utf8" }),
                {
                    config: item,
                    i18n: config.i18n,
                    helper: {},
                },
                {
                    root: "./ejs/index.ejs",
                    filename: "./ejs/index.ejs",
                }
            );
            fs.writeFileSync(`./public/${item.fileName}`, html, { encoding: "utf8" });
        })
    );
};

const startWebServer = () => {
    express()
        .use(express.static('public'))
        .listen(3000);
    console.log("Listening on http://localhost:3000");
};

if (process.argv.length == 3 && process.argv[2] == "--dev") {
    startWebServer();
    chokidar.watch(['./config.js', './ejs/']).on('all', (event, path) => {
        console.log(event, path);
        buildPages();
        console.log("Rebuilt pages\n");
    });
} else if (process.argv.length == 3 && process.argv[2] == "--build") {
    buildPages();
} else if (process.argv.length == 2) {
    startWebServer();
} else {
    console.log("Usage: node app.js [--dev|--build]");
    process.exit(1);
}
