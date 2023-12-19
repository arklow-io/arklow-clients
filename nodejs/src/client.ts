import fetch from 'node-fetch-native'
import Entities from './entities';

type IClientConfig = {
    team_id: string;
    api_key: string;
    version?: number
}

export type IClientResponse = {
    success: boolean;
    errors: IClientErrorContainer[] | null;
    data: any;
}

type IClientErrorContainer = {
    code: number;
    message: string;
    extdata?: any;
}

export default class NewClient {
    config: IClientConfig;
    api_url: string;
    constructor(ClientConfig: IClientConfig) {
        this.config = ClientConfig;
        this.api_url = process.env?.ARKLOW_API_URL ?? "https://api.arklow.io"
        this.init()
    }

    private init() {
        if(!this.config.version) {
            this.config.version = 1
        }
        if(this.config.team_id.length < 1) {
            throw new Error("Team ID is required")
        }
        if(this.config.api_key.length < 1) {
            throw new Error("API Key is required")
        }
    }

    async MakeRequest(path: string, method: string, body?: any) : Promise<IClientResponse>{
        var clientResponse: IClientResponse = {
            success: false,
            errors: null,
            data: null
        }

        var JSONResponsePayloadPresent = false
        const url = `${this.api_url}${path}`;
        const response = await fetch(url, {
            method: method,
            body: body ? JSON.stringify(body) : null,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "x-arklow-api-key": this.config.api_key
            }
        });

        var JSONResponsePayload = null
        
        try{
             const json = await response.json();
             JSONResponsePayloadPresent = true
             JSONResponsePayload = json
        }catch{}

        if (JSONResponsePayloadPresent) {
            if (JSONResponsePayload?.errors?.length > 0) {
                clientResponse = {
                    success: false,
                    errors: JSONResponsePayload.errors,
                    data: null
                }
            }else{
                if(!response.ok) {
                    clientResponse = {
                        success: false,
                        errors: [{
                            code: response.status,
                            message: response.statusText
                        }],
                        data: null
                    }
                }else{
                    clientResponse = {
                        success: true,
                        errors: null,
                        data: JSONResponsePayload.data
                    }
                }
            }
        }else{
            if(!response.ok) {
                clientResponse = {
                    success: false,
                    errors: [{
                        code: response.status,
                        message: response.statusText
                    }],
                    data: null
                }
            }else{
                clientResponse = {
                    success: true,
                    errors: null,
                    data: null
                }
            }
        }
        return clientResponse
    }   

    Entity(entityId: string): Entities {
        return new Entities(this, entityId);
    }


}