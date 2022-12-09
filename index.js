import io from 'iohook2';
import notifier from 'node-notifier';
import translate from 'google-translate-api-x';
import clipboard from 'clipboardy';
import fs from 'fs'
import { exit } from 'process';

const env = process.env;
let language = env.LANG
language = language.substring(0,2)
//You can change language if you don't want to translate system default language. Use ISO 639-1 codes for this.
//Example: language = "en"

let keycodes = []
io.start();

let items = new Map()
let firstFileItems  = new Map()
let secondFileItems = new Map()

getFromFile()
argHandle()

function mergeFiles(argts){
    
    let firstFileContent = fs.readFileSync(argts[3],"utf8")
    let secondFileContent = fs.readFileSync(argts[4],"utf8")
    let ffJson = JSON.parse(firstFileContent)
    let sfJson = JSON.parse(secondFileContent)
    let firstFileItems = new Map(Object.entries(ffJson))
    let secondFileItems = new Map(Object.entries(sfJson))
    secondFileItems.forEach((value,key) => {
        firstFileItems.set(key,value)
    });
    const json = JSON.stringify(Object.fromEntries(firstFileItems))
    if(argts[5] != "-f"){
        fs.writeFileSync("merged_tr",json,"utf8")
        console.log("INFO: Files merged. merged_tr created.");
        exit()

    }
    else{
        fs.writeFileSync("tr",json,"utf8")
        console.log("INFO: Files merged. tr file overwritten.");
        exit()
    }
    
}

function argHandle(){
    const args = process.argv
    if(args.includes("--merge")){
        mergeFiles(args)
    }
    if(args.includes("--help")){
        console.log("Usage: ")
        console.log("--merge file1 file2 (-f): Merges file2's contents into file1's and creates new merge_tr file. If you don't want to create new file and instead replace file1 with file2, use -f")
        console.log("--help: This info.")
        exit()
    }
}

async function writeFile(){
    const json = JSON.stringify(Object.fromEntries(items))
    fs.writeFile("tr",json,(err,data) => {
        if(!err){
            console.log("INFO: Written to the file!")
        }
        else{
            console.log(err)
        }
    })
}

async function getFromFile(){
    fs.readFile("tr","utf8",(err,data) => {
        if(!err && data.length > 0){
            const objj = JSON.parse(data)
            items = new Map(Object.entries(objj))
        }
        else{
            console.log("INFO: Empty translate file.")
        }
    })
}

function notify(message){
    notifier.notify({
        title: "Simple Translator",
        message: message,
        sound: false,
        timeout:8,
        icon: process.cwd()+"/notification.png",
        wait:true,
    });
}

async function transWord(message){
    try{
        let translated = await translate(message, { to: language});
        notify(message + " = " + translated.text)
        if(message != translated.text){
            items.set(message,translated.text)
            writeFile()
        }
        else{
            console.log("INFO: Couldn't translated.")
        }
    }
    catch{
        let translated = await translate(message, { to: language , client: 'gtx'});
        notify(message + " = " + translated.text)
        if(message != translated.text){
            items.set(message,translated.text)
            writeFile()
        }
        else{
            console.log("INFO: Couldn't translated.")
        }
    }
}

async function trans(message){
    try{
        let translated = await translate(message, { to: language});
        notify(translated.text)
        console.log(translated.text)
    }catch{
        let translated = await translate(message, { to: language , client: 'gtx'});
        notify(translated.text)
        console.log(translated.text)
    }
}


io.on('keydown', e => {
    if(e.key == "leftCtrl" || e.key == "leftAlt"){
        keycodes.push(e.key)
    }
});
io.on('keyup', e => {
    if(keycodes.includes("leftCtrl") && keycodes.includes("leftAlt") && e.key == "q"){
        let q = clipboard.readSync()
        let firstOccurance = q.search(/[^a-zA-Z\d\s]/)
        q = q.replace(q.charAt(firstOccurance),"")
        while(firstOccurance == 0){
            q = q.substring(1,q.length)
            firstOccurance = q.search(/[^a-zA-Z\d\s:]/)
        }
        if(firstOccurance != -1){
            q = q.substring(0,firstOccurance)
        }
        q = q.trim()
        q = q.toLowerCase()
        if(q.length > 1 && q.match(" ") == null){
            if(items.has(q)){
                notify(q + " : " + items.get(q))
                console.log("INFO: Already in translate file")
            }
            else{
                transWord(q)
            }
        }
    }
    if(keycodes.includes("leftCtrl") && keycodes.includes("leftAlt") && e.key == "e"){
        let q = clipboard.readSync()
        q = q.replaceAll('\n'," ")
        q = q.trim()
        trans(q)
    }
    setTimeout(() => keycodes = [],500)
});
