#!/usr/bin/env node

//var fs = require('fs');
//var path = requrie('path');
import * as fs from "fs"
import * as path from "path"
import * as yargs from "yargs"

console.log(yargs.argv)



var dataDir = "./data"
if(yargs.argv.dataDir) {
  dataDir = yargs.argv.dataDir
}
const albumJsonFile = path.join(dataDir, "albums.json")
var exportDir = "./export"
if(yargs.argv.exportDir) {
    exportDir = yargs.argv.exportDir
}

interface Album { 
    title: string
    id: string 
    photos: string[] 
    created: number
}

interface Photo {
    id: string 
    name: string 
}

interface Albums { albums: Album[] }

const getAlbumJson = (file: string): Albums => {
    const albumJsonData = fs.readFileSync(file, "utf8")
    if (albumJsonData) {
        const albums = JSON.parse(albumJsonData)
        return { albums: albums.albums.map((album: any) => ({ ...album, created: Number(album.created)})) }
    }
    throw new Error("Unable to get data for Album JSON")
}

const getPhotoJson = (photoId: string): Photo => {
    const photoJsonData = fs.readFileSync(path.join(dataDir, `photo_${photoId}.json`), "utf8")
    if (photoJsonData) {
        return JSON.parse(photoJsonData)        
    }
    throw new Error(`Unable to get JSON for Photo ID ${photoId}`)
}

const sortAlbumsByCreatedTimestamp = (albums: Albums): Albums => {
    return {
        albums: albums.albums.sort((a, b) => a.created - b.created)
    }
}
 
const getAlbumExportPath = (album: Album, albumIndex: number) => {
    const title = escapeForFilename(album.title)
    //return path.join(exportDir, `${albumIndex} - ${title}`)
    return path.join(exportDir, `${title}`)
}

const escapeForFilename = (filename: string): string => filename.trim().replace(/[\\/:"*?<>|]+/g, "-")

const getPhotoNameWithIndex = (filename: string, photoId: string, photoIndex: number): string => {    
    const name = escapeForFilename(getPhotoJson(photoId).name)
    const ext = path.parse(filename).ext
    //console.log(`${name} *** ${ext}`)
    if(name.toLowerCase().endsWith(ext.toLowerCase())) {
      return name;
    }
    console.log(`${name} *** ${ext}`)
    //return `${photoIndex} - ${name}${ext}`
    return `${name}${ext}`
}

console.log("Flickr Data Organizer - v2.0.0")
console.log("Reading albums...")

const albums = sortAlbumsByCreatedTimestamp(getAlbumJson(albumJsonFile))

console.log("Reading file list...")
const filenames = fs.readdirSync(dataDir).filter(f => { 
    const ext = path.parse(f).ext 
    return ext !== '.json' && ext !== '.zip'        
})

albums.albums.forEach((album, albumIndex) => {
    console.log(`Processing ${album.title}`)
    album.photos.forEach((photoId, photoIndex) => {
        const filename = filenames.find(filename => filename.includes(`_${photoId}_o.`) || filename.includes(`_${photoId}.`))
        if (!filename) {
            console.log(`Unable to get filename for Photo ID from ${photoId}`)
            return    
        }

        const albumExportPath = getAlbumExportPath(album, albumIndex)
        if (!fs.existsSync(albumExportPath)) {
            fs.mkdirSync(albumExportPath, { recursive: true });
        }
    
        const finalPhotoName = getPhotoNameWithIndex(filename, photoId, photoIndex)
        const fileExportPath = path.join(albumExportPath, finalPhotoName)
        try {
            fs.copyFileSync(path.join(dataDir, filename), fileExportPath);
        } catch (e) {
            console.error(`Unable to copy photo ${filename}`, e);
            return 
        }
    
        //console.log(`${filename} -> ${fileExportPath}`)    
    })
})

console.log("Done.")
