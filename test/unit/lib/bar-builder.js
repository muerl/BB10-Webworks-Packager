var srcPath = __dirname + "/../../../lib/",
    path = require("path"),
    wrench = require("wrench"),
    barBuilder = require(srcPath + "bar-builder"),
    fileMgr = require(srcPath + "file-manager"),
    nativePkgr = require(srcPath + "native-packager"),
    logger = require(srcPath + "logger"),
    testData = require("./test-data");

describe("BAR builder", function () {
    it("build() create BAR for specified session", function () {
        var callback = jasmine.createSpy(),
            session = testData.session,
            config = testData.config,
            target = session.targets[0];

        spyOn(wrench, "mkdirSyncRecursive");
        spyOn(fileMgr, "copyWWE");
        spyOn(fileMgr, "copyBarDependencies");
        spyOn(nativePkgr, "exec").andCallFake(function (session, target, config, callback) {
            callback(0);
        });

        barBuilder.build(session, testData.config, callback);

        expect(wrench.mkdirSyncRecursive).toHaveBeenCalledWith(session.outputDir + "/" + target);
        expect(fileMgr.copyWWE).toHaveBeenCalledWith(session, target);
        expect(fileMgr.copyBarDependencies).toHaveBeenCalledWith(session, target);
        expect(nativePkgr.exec).toHaveBeenCalledWith(session, target, config, jasmine.any(Function));
        expect(callback).toHaveBeenCalledWith(0);
    });
});
