/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require("path"),
    wrench = require("wrench"),
    cmdline = require("./cmdline"),
    logger = require("./logger"),
    fileManager = require("./file-manager"),
    localize = require("./localize"),
    configParser = require("./config-parser"),
    packagerUtils = require("./packager-utils"),
    packagerValidator = require("./packager-validator"),
    barBuilder = require("./bar-builder"),
    session;

try {
    cmdline.parse(process.argv);
    session = require("./session").initialize(cmdline);
    
    //prepare files for webworks archiving
    logger.info(localize.translate("PROGRESS_FILE_POPULATING_SOURCE"));
    fileManager.prepareOutputFiles(session);

    //parse config.xml
    logger.info(localize.translate("PROGRESS_SESSION_CONFIGXML"));
    configParser.parse(path.join(session.sourceDir, "config.xml"), session, function (configObj) {
        //validate session Object
        packagerValidator.validateSession(session, configObj);
        
        // copy extensions
        fileManager.copyExtensions(configObj.accessList, session.conf.EXT, session.sourcePaths.EXT);
        
        //generate user.js and frameworkModules.js
        logger.info(localize.translate("PROGRESS_GEN_OUTPUT"));
        //Adding debuEnabled property to user.js. Framework will enable/disable WebInspector based on that variable.
        configObj.debugEnabled = session.debug;
        packagerUtils.writeFile(path.join(session.sourcePaths.LIB, "config"), "user.js", "module.exports = " + JSON.stringify(configObj) + ";");

        fileManager.generateFrameworkModulesJS(session);

        barBuilder.build(session, configObj, function (code) {
            fileManager.cleanSource(session);

            if (code === 0) {
                logger.info(localize.translate("PROGRESS_COMPLETE"));
            }
        });
    });
} catch (e) {
    try {
        fileManager.cleanSource(session);
    } catch (e) {}
    
    logger.error(e);
}