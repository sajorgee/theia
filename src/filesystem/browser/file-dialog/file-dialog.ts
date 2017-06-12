/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from "inversify";
import { Message } from '@phosphor/messaging';
import { Disposable } from "../../../application/common";
import { AbstractDialog, DialogProps, setEnabled, createIconButton, Widget } from "../../../application/browser";
import { UriSelection } from '../../../filesystem/common';
import { LocationListRenderer } from '../../../filesystem/browser';
import { FileDialogModel } from './file-dialog-model';
import { FileDialogWidget } from './file-dialog-widget';

export const FileDialogFactory = Symbol('FileDialogFactory');
export interface FileDialogFactory {
    (props: FileDialogProps): FileDialog;
}

export const NAVIGATION_PANEL_CLASS = 'theia-NavigationPanel';
export const CONTROL_PANEL_CLASS = 'theia-ControlPanel';

@injectable()
export class FileDialogProps extends DialogProps {
}

@injectable()
export class FileDialog extends AbstractDialog<UriSelection | undefined> {

    protected readonly back: HTMLSpanElement;
    protected readonly forward: HTMLSpanElement;
    protected readonly locationListRenderer: LocationListRenderer;

    constructor(
        @inject(FileDialogProps) props: FileDialogProps,
        @inject(FileDialogWidget) readonly widget: FileDialogWidget
    ) {
        super(props);
        this.toDispose.push(widget);
        this.toDispose.push(this.model.onChanged(() =>
            this.update()
        ));

        const navigationPanel = document.createElement('div');
        navigationPanel.classList.add(NAVIGATION_PANEL_CLASS);
        this.contentNode.appendChild(navigationPanel);

        navigationPanel.appendChild(this.back = createIconButton('fa', 'fa-chevron-left'));
        navigationPanel.appendChild(this.forward = createIconButton('fa', 'fa-chevron-right'));

        this.locationListRenderer = new LocationListRenderer(this.model);
        navigationPanel.appendChild(this.locationListRenderer.host);
    }

    get model(): FileDialogModel {
        return this.widget.model;
    }

    protected onUpdateRequest(msg: Message): void {
        super.onUpdateRequest(msg);
        setEnabled(this.back, this.model.canNavigateBackward());
        setEnabled(this.forward, this.model.canNavigateForward());
        this.locationListRenderer.render();
    }

    protected onAfterAttach(msg: Message): void {
        Widget.attach(this.widget, this.contentNode);
        this.toDisposeOnDetach.push(Disposable.create(() =>
            Widget.detach(this.widget)
        ));

        const controlPanel = document.createElement('div');
        controlPanel.classList.add(CONTROL_PANEL_CLASS);
        this.contentNode.appendChild(controlPanel);

        controlPanel.appendChild(this.createCloseButton('Cancel'));
        controlPanel.appendChild(this.createAcceptButton('Open'));

        this.addEnterAction(this.back, () => this.model.navigateBackward(), 'click');
        this.addEnterAction(this.forward, () => this.model.navigateForward(), 'click');
        super.onAfterAttach(msg);
    }

    protected onActivateRequest(msg: Message): void {
        this.widget.activate();
    }

    get value(): UriSelection | undefined {
        return this.widget.model.selectedFileStatNode;
    }

}