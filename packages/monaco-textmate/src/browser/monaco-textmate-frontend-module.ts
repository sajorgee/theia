/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { interfaces, ContainerModule } from 'inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { bindContributionProvider } from '@theia/core';
import { MonacoTextmateFrontendApplicationContribution } from './monaco-textmate-frontend-contribution';
import { BuiltinTextmateThemeProvider } from './builtin-textmate-theme-provider';
import { BuiltinMonacoThemeProvider } from './builtin-monaco-theme-provider';
import { TextmateRegistry, TextmateRegistryImpl } from './textmate-registry';
import { LanguageGrammarDefinitionContribution, MonacoTextmateBuiltinGrammarContribution } from '.';
import { MonacoTextmateService } from './monaco-textmate-service';
import { ThemeService } from '@theia/core/lib/browser/theming';

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    bind(MonacoTextmateService).toSelf().inSingletonScope();
    bind(TextmateRegistry).to(TextmateRegistryImpl).inSingletonScope();

    bind(FrontendApplicationContribution).to(MonacoTextmateFrontendApplicationContribution).inSingletonScope();

    bindContributionProvider(bind, LanguageGrammarDefinitionContribution);
    bind(LanguageGrammarDefinitionContribution).to(MonacoTextmateBuiltinGrammarContribution).inSingletonScope();

    const themeService = ThemeService.get();
    BuiltinMonacoThemeProvider.compileMonacoThemes();
    themeService.register(...BuiltinTextmateThemeProvider.theiaTextmateThemes);
});
