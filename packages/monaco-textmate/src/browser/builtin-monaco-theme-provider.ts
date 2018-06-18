/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { MonacoTheme } from '@theia/monaco/lib/common/monaco-theme-protocol';

export class BuiltinMonacoThemeProvider {

    static readonly rawThemes: { [file: string]: object } = {
        './dark_default.json': require('../../data/monaco-themes/vscode/dark_defaults.json'),
        './dark_vs.json': require('../../data/monaco-themes/vscode/dark_vs.json'),
        './dark_plus.json': require('../../data/monaco-themes/vscode/dark_plus.json'),
        './monokai-color-theme.json': require('../../data/monaco-themes/vscode/monokai-color-theme.json'),
    };

    static readonly nameMap: { [name: string]: string } = {
        'dark-plus': 'dark_plus',
        'monokai': 'monokai-color-theme',
    };

    static compileMonacoThemes() {
        [
            'dark-plus', 'monokai',
        ].forEach(name => {
            const rawName = this.nameMap[name] || name;
            const theme = this.convertVscodeToMonaco(
                this.rawThemes[`./${rawName}.json`],
                {
                    name,
                    base: 'vs-dark',
                    inherit: true,
                    rules: [],
                    colors: {},
                }
            );

            monaco.editor.defineTheme(theme.name, theme);
        });
    }

    // tslint:disable-next-line:no-any
    static convertVscodeToMonaco(vscodeTheme: any, monacoTheme: MonacoTheme): MonacoTheme {

        // Recursion in order to follow the theme dependencies that vscode has...
        if (typeof vscodeTheme.include !== 'undefined') {
            const subTheme = this.rawThemes[vscodeTheme.include];
            if (subTheme) {
                this.convertVscodeToMonaco(subTheme, monacoTheme);
            }
        }

        Object.assign(monacoTheme.colors, vscodeTheme.colors);

        if (typeof vscodeTheme.tokenColors !== 'undefined') {
            for (const tokenColor of vscodeTheme.tokenColors) {

                if (typeof tokenColor.scope === 'undefined') {
                    tokenColor.scope = [''];
                } else if (typeof tokenColor.scope === 'string') {
                    // tokenColor.scope = tokenColor.scope.split(',').map((scope: string) => scope.trim()); // ?
                    tokenColor.scope = [tokenColor.scope];
                }

                for (const scope of tokenColor.scope) {

                    // Converting numbers into a format that monaco understands
                    const settings = Object.keys(tokenColor.settings).reduce((previous: { [key: string]: string }, current) => {
                        let value: string = tokenColor.settings[current];
                        if (typeof value === typeof '') {
                            value = value.replace(/^\#/, '').slice(0, 6);
                        }
                        previous[current] = value;
                        return previous;
                    }, {});

                    monacoTheme.rules.push({
                        ...settings, token: scope
                    });
                }
            }
        }

        return monacoTheme;
    }

}
