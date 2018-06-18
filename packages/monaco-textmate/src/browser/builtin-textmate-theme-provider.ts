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

}
