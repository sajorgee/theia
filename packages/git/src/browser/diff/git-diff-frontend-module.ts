/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { interfaces } from "inversify";
import { GitDiffContribution } from './git-diff-contribution';
import { WidgetFactory, bindViewContribution } from "@theia/core/lib/browser";
import { GitDiffWidget, GIT_DIFF } from "./git-diff-widget";

import '../../../src/browser/style/diff.css';

export function bindGitDiffModule(bind: interfaces.Bind) {

    bind(GitDiffWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: GIT_DIFF,
        createWidget: () => ctx.container.get<GitDiffWidget>(GitDiffWidget)
    }));

    bindViewContribution(bind, GitDiffContribution);

}
