/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject, named } from "inversify";
import { ContributionProvider } from "@theia/core";
import { ThemeProvider } from "@theia/core/lib/common/theming-protocol";
import { MonacoThemeProvider, MonacoTheme } from "../common/monaco-theme-protocol";
import { Deferred } from "@theia/core/lib/common/promise-util";

/**
 * This class hooks onto the Theia Theme service as a Theme provider, while it doesn't provide any theme.
 * Although when it is queried for more themes, it will trigger its refresh sequence to redefine the monaco themes.
 */
@injectable()
export class MonacoThemeService implements ThemeProvider {

    @inject(ContributionProvider) @named(MonacoThemeProvider)
    protected readonly monacoThemeProviderContributionProvider: ContributionProvider<MonacoThemeProvider>;

    protected readonly monacoThemeMap: Map<string, Deferred<MonacoTheme>> = new Map<string, Deferred<MonacoTheme>>();

    protected getDeferredTheme(name: string) {
        let deferred = this.monacoThemeMap.get(name);
        if (!deferred) {
            deferred = new Deferred<MonacoTheme>();
            this.monacoThemeMap.set(name, deferred);
        }
        return deferred;
    }

    protected async removeResolved() {
        const toDelete: string[] = [];

        for (const [name, deferred] of this.monacoThemeMap) {
            const resolved = await Promise.race([
                deferred.promise.then(() => true).catch(() => true),
                Promise.resolve(false),
            ]);

            if (resolved) {
                toDelete.push(name);
            }
        }

        for (const name of toDelete) {
            this.monacoThemeMap.delete(name);
        }
    }

    protected async invalidateAll() {
        const error = new Error('theme is invalidated');
        for (const deferred of this.monacoThemeMap.values()) {
            deferred.reject(error);
        }
        this.monacoThemeMap.clear();
    }

    protected async invalidateUnresolved() {
        const toDelete: string[] = [];

        const error = new Error('theme is invalidated');
        for (const [name, deferred] of this.monacoThemeMap.entries()) {
            const resolved = await Promise.race([
                deferred.promise.then(() => true).catch(() => true),
                Promise.resolve(false),
            ]);

            if (!resolved) {
                deferred.reject(error);
                toDelete.push(name);
            }
        }

        for (const name of toDelete) {
            this.monacoThemeMap.delete(name);
        }
    }

    /**
     * Fetches a promise from the theme registry, allow you to wait until the theme is actually defined for the monaco editor.
     *
     * @param name name of the theme to wait for.
     * @returns the name of the resolved theme.
     */
    async ready(name: string): Promise<string> {
        const theme = await this.getDeferredTheme(name).promise;
        return theme.name;
    }

    async gatherThemes() {
        await this.removeResolved();
        await Promise.all(
            this.monacoThemeProviderContributionProvider.getContributions()
                .map(provider => provider.gatherMonacoThemes()
                    .catch(error => {
                        console.error(error);
                    })
                    .then(themes => {
                        for (const monacoTheme of themes) {
                            try {
                                monaco.editor.defineTheme(monacoTheme.name, monacoTheme);
                                this.getDeferredTheme(monacoTheme.name).resolve(monacoTheme);
                            } catch (error) {
                                console.error(error);
                                this.getDeferredTheme(monacoTheme.name).reject(monacoTheme);
                            }
                        }
                    })
                )
        );
        await this.invalidateUnresolved();
        return [];
    }
}
