/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { Container } from "inversify";
import { stubRemoteMasterProcessFactory } from "@theia/core/lib/node";
import { bindServerProcess } from "@theia/core/lib/node/backend-application-module";
import { bindLogger } from "@theia/core/lib/node/logger-backend-module";
import { bindFileSystem, bindFileSystemWatcherServer } from "@theia/filesystem/lib/node/filesystem-backend-module";
import { ApplicationProjectArgs } from "../application-project-cli";
import { bindNodeExtensionServer } from '../extension-backend-module';

export const extensionNodeTestContainer = (args: ApplicationProjectArgs) => {
    const container = new Container();
    const bind = container.bind.bind(container);
    bindLogger(bind);
    bindServerProcess(bind, stubRemoteMasterProcessFactory);
    bindFileSystem(bind);
    bindFileSystemWatcherServer(bind);
    bindNodeExtensionServer(bind, args);
    return container;
};
export default extensionNodeTestContainer;
