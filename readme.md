# z.imgsize

Collects width + height of all images in specified folder
(including subfolders) and writes data to keyboard paste buffer.

A quick way of finding image dimensions when implementing css for a web page.

## Installation

`$ npm install`

Create `z.imgsize` in your `~/bin` folder:
```
#!/bin/bash
node ~/path/to/2022-image-size/z.imgsize.js "$*"
```

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
background-image: url("images/logo-1.png");
width: 142px;
height: 38px;

background-image: url("images/logo-2.png");
width: 140px;
height: 36px;

background-image: url("images/person.png");
width: 162px;
height: 150px;

background-image: url("images/txt-correct.png");
width: 84px;
height: 30px;

background-image: url("images/txt-end.png");
width: 530px;
height: 38px;

background-image: url("images/txt-title.png");
width: 626px;
height: 44px;

background-image: url("images/txt-wrong.png");
width: 84px;
height: 30px;
```

## Requirements

macOS requires `pbcopy`

linux requires `xclip`

