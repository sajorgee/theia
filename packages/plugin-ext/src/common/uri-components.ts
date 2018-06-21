
/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
export interface UriComponents {
    scheme: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;
    external?: string;
}

// some well known URI schemas
export namespace Schemes {
    export const File = 'file';
    export const Untitled = 'untitled';
}
