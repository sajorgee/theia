/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { AxiosInstance, AxiosPromise, AxiosRequestConfig, default as axios } from 'axios';
import { injectable } from 'inversify';
// import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';

/**
 * Plain wrapper around {@link AxiosInstance} class that is configured to
 * have workspace API endpoint location as base URL. The value of API endpoint
 * location is fetched out of environment variable called 'CHE_API'. If there
 * is no such variable set the client tries to continue with default property
 * values, however no correct request addressing is guaranteed in this case.
 *
 */

export interface Workspace {
    runtime: Runtime;
}
export interface Runtime {
    machines: { [attrName: string]: Machine };
}
export interface Machine {
    servers: { [attrName: string]: Server };
}
export interface Server {
    url: string
}

@injectable()
export class WsMasterHttpClient {

    private readonly ISSUE = "Can't properly configure workspace master http client";
    private readonly REASON = "CHE_API environment property is undefined";

    private axiosInstance: AxiosInstance;

    // @inject(EnvVariablesServer)
    // protected readonly envVariablesServer: EnvVariablesServer;

    constructor() {
        // const cheApi = this.envVariablesServer.getValue('CHE_API');
        // cheApi.then(value => {
        //     if (value) {
        //         this.axiosInstance = axios.create({ baseURL: value.value });
        //     } else {
        //         throw new Error(`Issue: ${this.ISSUE}, Reason: ${this.REASON}`);
        //     }
        // });
        const cheApi = 'http://localhost:8080/api';
        if (cheApi) {
            this.axiosInstance = axios.create({ baseURL: cheApi });
        } else {
            throw new Error(`Issue: ${this.ISSUE}, Reason: ${this.REASON}`);
        }
    }

    async getServer(wsID: string): Promise<Server | undefined> {
        const ws = (await this.get<Workspace>(`/workspace/${wsID}`)).data;
        if (ws.runtime) {
            const machines = ws.runtime.machines;
            // tslint:disable-next-line:forin
            for (const machineName in machines) {
                const servers = machines[machineName].servers;
                // tslint:disable-next-line:forin
                for (const serverName in servers) {
                    if (serverName === name) {
                        return servers[serverName];
                    }
                }
            }
        } else {
            return undefined;
        }
    }

    /**
     * @see AxiosInstance.request
     */
    request<T>(config: AxiosRequestConfig): AxiosPromise<T> {
        return this.axiosInstance.request<T>(config);
    }

    /**
     * @see AxiosInstance.get
     */
    get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this.axiosInstance.get<T>(url, config);
    }

    /**
     * @see AxiosInstance.delete
     */
    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.axiosInstance.delete(url, config);
    }

    /**
     * @see AxiosInstance.head
     */
    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.axiosInstance.head(url, config);
    }

    /**
     * @see AxiosInstance.post
     */
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this.axiosInstance.post<T>(url, data, config);
    }

    /**
     * @see AxiosInstance.put
     */
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this.axiosInstance.put<T>(url, data, config);
    }

    /**
     * @see AxiosInstance.patch
     */
    patch<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this.axiosInstance.patch<T>(url, data, config);
    }

}
