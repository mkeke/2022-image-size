# z.imgsize

Collects width + height of all images in specified folder
(including subfolders) and writes data to keyboard paste buffer / clipboard.

A quick way of finding image dimensions when implementing css for a web page.

## Installation

`$ npm install`

copy `bin/z.imgsize` to your `~/bin` folder and adjust the path:

```
#!/bin/bash
node ~/path/to/2022-image-size/z.imgsize.js "$*"
```

add executable bit to file

`chmod +x z.imgsize`


## Usage
```
$ z.imgsize <filename>
$ z.imgsize <folder>
$ z.imgsize
```

Default is to use current folder.


## Output

The following data will be written to the paste buffer

```
url("images/logo-1.png");
width: 142px;
height: 38px;

url("images/logo-2.png");
width: 140px;
height: 36px;

url("images/person.png");
width: 162px;
height: 150px;

url("images/txt-correct.png");
width: 84px;
height: 30px;

url("images/txt-end.png");
width: 530px;
height: 38px;

url("images/txt-title.png");
width: 626px;
height: 44px;

url("images/txt-wrong.png");
width: 84px;
height: 30px;
```

The output can be configured in the variable `outputTemplate`.

```javaScript
// configure the output here
const outputTemplate = `
url("<filename>");
width: <width>px;
height: <height>px;
`;
```


## Requirements

macOS requires `pbcopy`

linux requires `xclip`


## Bugs

child_process exec hangs on linux after copying the text into the clipboard.
A temporary fix is to press ctrl-c to exit manually.
