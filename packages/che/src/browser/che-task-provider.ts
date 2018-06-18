/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { ICommand } from '@eclipse-che/workspace-client';
import { TaskProvider } from '@theia/task/lib/browser';
import { TaskConfiguration } from '@theia/task/lib/common';
import { Workspace } from './che-workspace-client';
import { CheTaskConfiguration, CHE_TASK_TYPE, PREVIEW_URL_ATTR_NAME } from '../common/task-protocol';

/** Reads the commands from the current Che workspace and provides it as Task Configurations. */
@injectable()
export class CheTaskProvider implements TaskProvider {

    @inject(Workspace)
    protected readonly cheWsClient: Workspace;

    async provideTasks(): Promise<TaskConfiguration[]> {
        const tasks: TaskConfiguration[] = [];

        const commands = await this.cheWsClient.getCommands();
        for (const command of commands) {
            const providedTask: CheTaskConfiguration = {
                type: CHE_TASK_TYPE,
                label: `${command.name}`,
                target: {
                    workspaceId: await this.cheWsClient.getWorkspaceId(),
                    machineName: 'e'
                },
                command: command.commandLine,
                previewUrl: this.getPreviewURL(command)
            };
            tasks.push(providedTask);
        }
        return tasks;
    }

    protected getPreviewURL(command: ICommand): string | undefined {
        if (!command.attributes) {
            return undefined;
        }
        for (const attr in command.attributes) {
            if (attr === PREVIEW_URL_ATTR_NAME) {
                console.log(attr);
                return command.attributes[attr];
            }
        }
        return undefined;
    }
}
