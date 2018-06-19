/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { BuiltinThemeProvider } from '@theia/core/lib/browser/theming';

export class BuiltinTextmateThemeProvider {

    static readonly theiaTextmateThemes = [
        {
            id: 'dark',
            label: 'Dark+ (Textmate)',
            description: 'Textmate Theme',
            editorTheme: 'dark-plus',
            activate: () => {
                BuiltinThemeProvider.dark.use();
            },
            deactivate: () => {
                BuiltinThemeProvider.dark.unuse();
            },
        },
        {
            id: 'light',
            label: 'Light+ (Textmate)',
            description: 'Textmate Theme',
            editorTheme: 'light-plus',
            activate: () => {
                BuiltinThemeProvider.light.use();
            },
            deactivate: () => {
                BuiltinThemeProvider.light.unuse();
            },

        },
        {
            id: 'monokai',
            label: 'Monokai',
            description: 'Textmate Theme',
            editorTheme: 'monokai',
            activate: () => {
                BuiltinThemeProvider.dark.use();
            },
            deactivate: () => {
                BuiltinThemeProvider.dark.unuse();
            },
        }
    ];

}
