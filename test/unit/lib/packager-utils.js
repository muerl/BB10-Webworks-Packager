var testData = require("./test-data"),
    utils = require(testData.libPath + "/packager-utils"),
    fs = require("fs"),
    path = require("path"),
    asciiFile = path.resolve("test/data/ascii_text.txt"),
    utf8File = path.resolve("test/data/utf8_text.txt"),
    ucs2beFile = path.resolve("test/data/ucs2be_text.txt"),
    ucs2leFile = path.resolve("test/data/ucs2le_text.txt"),
    helloWorld = "Hello World";

describe("Encoded Buffer data to String", function () {
    it("Ascii text to String", function () {
        // Read text file encoded in ascii
        var fileData = fs.readFileSync(asciiFile);
        expect(utils.bufferToString(fileData)).toEqual(helloWorld);
    });

    it("Utf8 text to String", function () {
        // Read text file encoded in utf8
        var fileData = fs.readFileSync(utf8File);
        expect(utils.bufferToString(fileData)).toEqual(helloWorld);
    });

    it("Ucs2BE text to String", function () {
        // Read text file encoded in 2 byte Unicode big endian
        var fileData = fs.readFileSync(ucs2beFile);
        expect(utils.bufferToString(fileData)).toEqual(helloWorld);
    });

    it("Ucs2LE text to String", function () {
        // Read text file encoded in 2 byte Unicode little endian
        var fileData = fs.readFileSync(ucs2leFile);
        expect(utils.bufferToString(fileData)).toEqual(helloWorld);
    });
});