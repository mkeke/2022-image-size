const sizeOf = require('image-size');
const { exec } = require("child_process");
const fs = require('fs');
const os = require('os');
const log = console.log;

// script is only made for macOS (darwin) and linux
if(!["darwin", "linux"].includes(os.platform())) {
    log(`ERROR: platform ${os.platform()} not recognised.`);
    process.exit();
}

/*
    TODO check for existence of pbcopy (darwin) or xclip (linux)
    by using whereis
    darwin:
        $ whereis pbcopy
        /usr/bin/pbcopy
        (if not found: "")
    linux
        $ whereis xclip
        xclip: /usr/bin/xclip /usr/share/man/...
        (if not found: "pbcopy:" )
*/

/*
    param can be file or dir
    default is current dir
*/

let numItems = 0;
const filenames = collectFilenames(process.argv[2]);
const str = getData(filenames);
copyToBuffer(str);

async function copyToBuffer(str) {
    await new Promise( (resolve,reject) => {
        const cmd = {
            darwin: `echo '${str}' | pbcopy`,
            linux: `echo '${str}' | xclip -sel clip`,
        }[os.platform()];

        exec(cmd, (error, stdout, stderr) => {
            if(error) {
                reject(error);
            }
            if(stderr) {
                reject(stderr);
            }
            resolve();
        });
    });

    log(`found ${numItems} images.`);
    log(`Copied data to buffer.`);
}

function getData(filenames) {
    let str = "";
    for(const filename of filenames) {
        const dim = sizeOf(filename);
        let data = [];
        data.push(`background-image: url("${filename}");`);
        data.push(`width: ${dim.width}px;`);
        data.push(`height: ${dim.height}px;`);
        numItems++;

        str += data.join("\n") + "\n\n";
    }
    return str;
}

function collectFilenames(entry) {
    const filenames = [];

    if (entry === undefined || entry === "") {
        entry=".";
    }
    entry = entry.replace(/\/+$/, "");

    // only accept .jpg .gif .png
    let whitelist = /\.(jpg)|(gif)|(png)$/;

    // starting point
    let nodes = [entry];

    // loop until nodes is traversed    
    for(const [i, node] of nodes.entries()) {
        const stats = fs.statSync(node);
        if(stats.isDirectory()) {
            // add folder elements to nodes array
            fs.readdirSync(node).map( (n)=>{ nodes.push(node+"/"+n);});
        } else if(stats.isFile() && whitelist.test(node)) {
            filenames.push(node.replace(/^\.\//, ""));
        }
    }

    return filenames;
}
