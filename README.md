# simple translator (st)
nodejs cli translator app, uses some packages. it's useful if you are read a lot of from pdf file, or lazy just like me. <br />
simple translator doesn't have any graphical user interface, if you want to translate some text, copy it, then press the right buttons (you can see there bottom in the readme.md) and it will send translated word via notify, be sure your notifications is active, especially in windows. <br />
it will translate to system's default language, you can change this in index.js via language variable.
<br />
<br />

installation: <br />
```
firstly you need nodejs, npm, then some packages inside simple-translator needs additional softwares, like iohook2. 
you can go to their npm page and inspect what you need to download if you have an error. 
```
<br />

from iohook2 npm page: <br />
<br />

```
Build Requirements

    Windows: VS2015
    MAC: Clang
    Linux: GCC

Linux

The following packages are required: git cmake pkg-config libx11-dev libxtst-dev libxt-dev libxinerama-dev libx11-xcb-dev libxkbcommon-dev libxkbcommon-x11-dev libxkbfile-dev
Windows

Please install cmake. Any required DLLs should be pre-installed.

Note: Windows support is WIP. Code compiles with no errors but then has a strange linker issue.
Mac

Macs cost money and (for personal reasons I won't get into, not to mention the right-to-repair stuff) Apple isn't getting any more of mine. But if you have one please do help out getting it to work! Shouldn't be too different from Linux, just different dependencies.
```

```
git clone https://github.com/xbatur/simple-translator.git 
cd simple-translator 
npm i 
node index.js 
```

usage: <br />
```
ctrl+c copy to clipboard 
then
ctrl+lalt+q for translating words. 
ctrl+lalt+e for translating sentences. (sentences are not going to written in file!)
```

translate file: <br />
```
st will write newly translated words to tr file in json format (it's in your directory), 
if there is no tr file, it will create.
```

<br />
<br />
merging: <br />

```
you can merge 2 tr(anslate) files. usage: ./node index.js --merge toFile fromFile -f
you can create new tr file in directory from 2 tr(anslate) files, usage: ./node index.js --merge toFile fromFile
```

<br />
<br />

