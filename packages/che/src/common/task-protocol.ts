/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TaskConfiguration, TaskInfo } from '@theia/task/lib/common';

export const CHE_TASK_TYPE = 'che';
export const PREVIEW_URL_ATTR_NAME = 'previewUrl';

export interface CheTaskConfiguration extends TaskConfiguration {
    readonly type: 'che',
    readonly command: string,
    readonly target?: Target,
    readonly previewUrl?: string
}

export interface Target {
    workspaceId?: string,
    machineName?: string
}

export interface CheTaskInfo extends TaskInfo {
    readonly execId: number;
}
