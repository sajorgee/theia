/*
 * Copyright (C) 2018 Redhat, Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject, named } from "inversify";
import { wireTmGrammars } from 'monaco-editor-textmate';
import { Registry } from 'monaco-textmate';
import { ILogger, Disposable, DisposableCollection, ContributionProvider } from "@theia/core";
import { MonacoTextModelService } from "@theia/monaco/lib/browser/monaco-text-model-service";
import { TextmateRegistry } from "./textmate-registry";
import { LanguageGrammarDefinitionContribution } from ".";

@injectable()
export class MonacoTextmateService implements Disposable {

    protected readonly toDispose = new DisposableCollection();

    protected textmateRegistry: Registry;

    @inject(ContributionProvider) @named(LanguageGrammarDefinitionContribution)
    protected readonly grammarProviders: ContributionProvider<LanguageGrammarDefinitionContribution>;

    @inject(TextmateRegistry)
    protected readonly theiaRegistry: TextmateRegistry;

    @inject(MonacoTextModelService)
    protected readonly monacoModelService: MonacoTextModelService;

    @inject(ILogger)
    protected readonly logger: ILogger;

    init() {
        for (const grammarProvider of this.grammarProviders.getContributions()) {
            grammarProvider.registerTextmateLanguage(this.theiaRegistry);
        }

        this.textmateRegistry = new Registry({
            getGrammarDefinition: async (scopeName: string, dependentScope: string) => {
                if (this.theiaRegistry.hasProvider(scopeName)) {
                    const provider = this.theiaRegistry.getProvider(scopeName);
                    return await provider!.getGrammarDefinition(scopeName, dependentScope);
                }
                return {
                    format: 'json',
                    content: ''
                };
            }
        });

        this.toDispose.push(this.monacoModelService.onDidCreate(model => {
            setTimeout(() => {
                this.activateLanguage(model.languageId);
            }, 2000);
        }));
    }

    async activateLanguage(languageId: string) {
        const scopeName = this.theiaRegistry.getScope(languageId);
        if (!scopeName) {
            return;
        }
        const provider = this.theiaRegistry.getProvider(scopeName);
        if (!provider) {
            return;
        }

        try {
            // tslint:disable-next-line:no-any
            await wireTmGrammars(monaco as any, this.textmateRegistry, new Map([[languageId, scopeName]]));
        } catch (err) {
            this.logger.warn('No grammar for this language id', languageId);
        }
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}
