import Client from './client'

export default class BatchManager extends Client {
    constructor({
        apiKey,
        version,
        teamId,
        options
    } : {
        apiKey: string,
        version: string,
        teamId: string,
        options?: any
    }) {
        super({
            apiKey,
            version,
            teamId,
            options
        })
    }

    async CreateBatchJobs(jobs: any){
        if(!Array.isArray(jobs)) {
            throw new Error('jobs must be an array of jobs');
        }
        const payload = {
            team_id: this.teamId,
            jobs: jobs
        }
        const result = await this.MakeRequest('/batch/create', "POST", payload);
        return result;
    }

    async ListBatchJobs(count: number, offset?: number){
        let BaseString = `/batch/list/${this.teamId}?count=${count}`

        if(offset) {
            BaseString += `&last_index=${offset}`
        }

        const result = await this.MakeRequest(BaseString, "GET", null);
        return result;
    }

    async GetBatchJob(jobId: string){
        const result = await this.MakeRequest(`/batch/${jobId}?team=${this.teamId}`, "GET", null);
        return result;
    }
}
