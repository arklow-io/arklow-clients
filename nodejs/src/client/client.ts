import fetch from 'node-fetch';

export interface ClientResponse {
    data: any
    errors: null | any[]
}

export default class Client {
    apiKey: string;
    version: string;
    teamId: any;
    options: any;
    constructor({
        apiKey,
        version,
        teamId,
        options
    } : {
        apiKey: string,
        version: string
        teamId: string,
        options?: any
    }) {
        this.apiKey = apiKey;
        this.version = version;
        this.teamId = teamId;
        this.options = options;
        this.PreCheck()
    }

    private PreCheck() {
        if (!this.apiKey || this.apiKey === '' || this.apiKey?.length < 1) {
            throw new Error('apiKey is required.');
        }
        if (!this.version || this.version === '' || this.version?.length < 1) {
            throw new Error('version is required.');
        }
        if (!this.teamId || this.teamId === '' || this.teamId?.length < 1) {
            throw new Error('teamId is required.');
        }
    }

    Options = {
        ChangeTeamId: (teamId: string) => {
            this.teamId = teamId;
        },
        ChangeVersion: (version: string) => {
            this.version = version;
        },
        ChangeApiKey: (apiKey: string) => {
            this.apiKey = apiKey;
        }
    }

    async MakeRequest(path: string, method: ("POST" | "PATCH" | "GET" | "DELETE"), payload: any) : Promise<ClientResponse>{
        this.PreCheck();
        const url = `https://api.arklow.io/${this.version}/${path}`;
        const response = await fetch(url, {
            method: method,
            body: payload ? JSON.stringify(payload) : null,
            headers: {
                "Content-Type": payload ? "application/json;charset=utf-8" : "",
                "x-arklow-api-key": this.apiKey
            }
        });
        const result: any = await response.json();
        let errorString = '';
        if(Array.isArray(result?.errors) === true){
            if(this.options?.noThrownErrors === true) {
                return result
            }
            for (const [i, err] of result.errors.entries()) {
                errorString += `[${i}] ${err.message}\n`
            }
            if (errorString !== '') {
                throw new Error(errorString);  
            }else{
                throw new Error('Server returned an error, that was not provided in a standard format.');
            }
        }else if(result?.errors !== null && result?.errors === undefined){
            throw new Error("Request Failed, please let us know!")
        }else if(result?.errors !== null && result?.errors !== undefined){
            throw new Error('Server returned an error, that was not provided in a standard format.');
        }else{
            return result;
        }
    }
}