/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { interfaces, ContainerModule } from 'inversify';
import { ILoggerServer } from '@theia/core/lib/common/logger-protocol';
import { BunyanLoggerServer } from './bunyan-logger-server';

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    rebind(ILoggerServer).to(BunyanLoggerServer).inSingletonScope();
});
