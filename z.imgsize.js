const sizeOf = require('image-size');
const { exec } = require("child_process");
const fs = require('fs');
const os = require('os');
const log = console.log;

// configure the output here
const outputTemplate = `
url("<filename>");
width: <width>px;
height: <height>px;
`;

/*
    param can be file or dir
    default is current dir
*/

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



let numItems = 0;
const filenames = collectFilenames(process.argv[2]);
const str = getData(filenames);
if(os.platform() === "linux") {
    log("copying to buffer. exit with ctrl-c");
}
copyToBuffer(str);


/*
    copyToBuffer(str)
    copy the enclosed string to the paste buffer

    TODO BUGFIX: exec hangs on linux. The data is stored in pastebuffer
    but the process hangs. Temporary fix is to tell the user to press ctrl-c
*/
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


/*
    getData(filenames)
    get dimension data for each file in the filenames array
    each file uses the outputTemplate string
    a combined string with all the filename data is returned
*/
function getData(filenames) {
    let str = "";
    for(const filename of filenames) {
        const dim = sizeOf(filename);
        str += outputTemplate
            .replace("<filename>", filename)
            .replace("<width>", dim.width)
            .replace("<height>", dim.height);
        numItems++;
    }
    return str;
}


/*
    collectFilenames(entry)
    returns array of filenames matching whitelist from entry path
    and recursively into sub folders
    example return value
    ['images/logo.png', 'images/button.png', 'images/background.jpg']
*/
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
