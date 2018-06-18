/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { WebSocketConnectionProvider } from './messaging/ws-connection-provider';
import { WsMasterHttpClient } from './ws-master-http-client';

export interface MachineIdentifier {
    machineName: string,
    workspaceId: string
}
export interface MachineExec {
    identifier: MachineIdentifier,
    cmd: string[],
    tty: boolean,
    id?: number
}

export const ExecCreateClient = Symbol('ExecCreateClient');
export interface ExecCreateClient {
    create(exec: MachineExec): Promise<number>;
}

export interface ExecAttachClient {
    attach(): Promise<void>;
}

@injectable()
export class ExecAttachClientFactory {

    private apiEndpoint: string;

    @inject(WebSocketConnectionProvider)
    protected readonly connProvider: WebSocketConnectionProvider;

    @inject(WsMasterHttpClient)
    protected readonly wsMasterHttpClient: WsMasterHttpClient;

    constructor() {
        this.apiEndpoint = 'ws://172.17.0.1:32782/attach/';
        // const serverURL = this.wsMasterHttpClient.getServer('terminal-exec');
        // if (serverURL === undefined || serverURL) {
        //     throw new Error("terminal-exec server doesn't");
        // }
        // this.apiEndpoint = serverURL;
    }

    create(id: number): ExecAttachClient {
        return this.connProvider.createProxy<ExecAttachClient>(this.apiEndpoint + id);
    }
}
