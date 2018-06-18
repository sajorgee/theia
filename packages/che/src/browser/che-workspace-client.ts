/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import WorkspaceClient, { IWorkspace, IRequestError, IRemoteAPI, IServer, IMachine, ICommand } from '@eclipse-che/workspace-client';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables/env-variables-protocol';

export type TerminalApiEndPointProvider = () => Promise<string>;

/** Facade for getting an info about the current Che workspace. */
@injectable()
export class Workspace {

    private api: IRemoteAPI;

    @inject(EnvVariablesServer)
    protected readonly envVariablesServer: EnvVariablesServer;

    /** Lists all commands from the workspace configuration. */
    public async getCommands(): Promise<ICommand[]> {
        const workspaceId = await this.getWorkspaceId();
        const restClient = await this.getRemoteApi();
        if (!workspaceId || !restClient) {
            return [];
        }

        const ws = await restClient.getById<IWorkspace>(workspaceId);
        const commands = ws.config.commands;
        return commands ? commands : [];
    }

    /** Lists all machines of the workspace runtime. */
    public async getMachines(): Promise<{ [attrName: string]: IMachine }> {
        const machineNames: { [attrName: string]: IMachine } = {};
        const workspaceId = await this.getWorkspaceId();
        const restClient = await this.getRemoteApi();
        if (!workspaceId || !restClient) {
            return machineNames;
        }
        return new Promise<{ [attrName: string]: IMachine }>((resolve, reject) => {
            restClient.getById<IWorkspace>(workspaceId)
                .then((workspace: IWorkspace) => {
                    resolve(workspace.runtime ? workspace.runtime.machines : {});
                })
                .catch((reason: IRequestError) => {
                    console.log(`Failed to get workspace by ID: ${workspaceId}. Status code: ${reason.status}`);
                    reject(reason.message);
                });
        });
    }

    /** Returns a server by its name from workspace runtime. */
    public async getServer(name: string): Promise<IServer | undefined> {
        const machines = await this.getMachines();
        // tslint:disable-next-line:forin
        for (const machineName in machines) {
            const servers = machines[machineName].servers;
            for (const serverName in servers) {
                if (serverName === name) {
                    return servers[serverName];
                }
            }
        }
        return undefined;
    }

    public async getWorkspaceId(): Promise<string | undefined> {
        const variable = await this.envVariablesServer.getValue('CHE_WORKSPACE_ID');
        if (variable && variable.value) {
            return variable.value;
        }
    }

    public async getWsMasterApiEndPoint(): Promise<string | undefined> {
        const variable = await this.envVariablesServer.getValue('CHE_API_EXTERNAL');
        if (variable && variable.value) {
            return variable.value;
        }
    }

    private async getRemoteApi(): Promise<IRemoteAPI> {
        if (!this.api) {
            const baseUrl = await this.getWsMasterApiEndPoint();
            this.api = WorkspaceClient.getRestApi({
                baseUrl: baseUrl
            });
        }
        return this.api;
    }
}
