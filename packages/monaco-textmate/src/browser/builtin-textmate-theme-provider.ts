/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { inject, injectable } from "inversify";
import { ThemeProvider } from "@theia/core";
import { BuiltinThemeProvider } from '@theia/core/lib/browser/theming';
import { MonacoThemeService } from "@theia/monaco/lib/browser/monaco-theme-service";

@injectable()
export class BuiltinTextmateThemeProvider implements ThemeProvider {

    @inject(MonacoThemeService)
    protected readonly monacoThemeService: MonacoThemeService;

    static readonly theiaTextmateThemes = [
        {
            id: 'dark-plus',
            label: 'Dark+ (Textmate)',
            description: 'it is dark',
            editorTheme: 'dark-plus',
            activate: () => {
                BuiltinThemeProvider.dark.use();
            },
            deactivate: () => {
                BuiltinThemeProvider.dark.unuse();
            },
        },
        {
            id: 'monokai',
            label: 'Monokai (Textmate)',
            description: 'it is not so dark',
            editorTheme: 'monokai',
            activate: () => {
                BuiltinThemeProvider.dark.use();
            },
            deactivate: () => {
                BuiltinThemeProvider.dark.unuse();
            },
        }
    ];

    async gatherThemes() {
        return Promise.all(
            BuiltinTextmateThemeProvider.theiaTextmateThemes
                .map(async theme => ({
                    ...theme,
                    editorTheme: await this.monacoThemeService.ready(theme.editorTheme),
                }))
        );
    }

}
