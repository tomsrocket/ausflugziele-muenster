"use strict";

const sharp = require('sharp');
const fs = require('fs');

const thumbnailWidth = 350;
const bigWidth = 800;
const jpgQuality = 65;

(async () => {
    try {
        const testFolder = '../static/images/posts';

        const files = fs.readdirSync(testFolder + "/");

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileStat = fs.statSync(testFolder + "/" + file);
            const imgBigTime = fileStat.mtime;
            const thumbName = testFolder + "-small/" + file.replace(".png", ".jpg");

            // only create thumbnail if thumb dont exist OR if big image file is newer than thumb
            if (fs.existsSync(thumbName)) {
                const thumbStat = fs.statSync(thumbName);
                if (thumbStat.mtime > imgBigTime) {
                    console.log("SKIP! Thumbnail exists or same image as big one:", file)
                    continue;
                }
            }
            console.log("# resizing to " + thumbnailWidth, file);
            await convert(testFolder + "/" + file, thumbName, { width: thumbnailWidth, height: 250 });
            console.log("  resizing to " + bigWidth, file);
            await convert(testFolder + "/" + file, testFolder + "-mid/" + file.replace(".png", ".jpg"), { width: bigWidth} );
        }

    } catch (err) {
      console.error("Error reading file:", err);
    }

    console.log();
    console.log("DONE");

})();


function convert(inputFile, outputFile, resizeOptions) {
    return new Promise(function(resolve, reject) {
        sharp(inputFile)
        .resize(resizeOptions)
        .jpeg({
            quality: jpgQuality,
            chromaSubsampling: '4:4:4'
        })
        .toFile(outputFile)
            .then(function(newFileInfo) {
                resolve(newFileInfo);
            })
            .catch(function(err) {
                console.log("== Error during resize!");
                reject(err);
            });
        });
}
