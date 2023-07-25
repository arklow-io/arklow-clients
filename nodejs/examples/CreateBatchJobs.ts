import BatchManager from "../dist/client/batch";

const Main = async () => {
    const NewClient = new BatchManager({
        apiKey: process.env.USE_API_KEY ?? "",
        version: "v1",
        teamId: process.env?.USE_TEAM_ID ?? "",
        options: {
            noThrownErrors: true
        }
    })

    const BatchJobRequest = await NewClient.CreateBatchJobs([
        {
            "mode": "new_dataset_variant",
            "config": {
                "connection": {
                    "resource_id": "rJSJwg2joHEcWAuj5jM28V",
                    "use_collection": "test_db",
                    "use_table": "test_table",
                    "query": "SELECT * FROM test_table"
                },
                "settings": {
                    "use_bloom": true
                },
                "mapping": [
                    {
                        "ds_from": "text_data",
                        "ds_to": "data",
                        "type": "textual"
                    }
                ],
                "variant": {
                    "filters_applied": [
                        {
                            "name": "pii",
                            "options": [
                                {
                                    "fo_id": "remove_phone_numbers",
                                    "fo_value": true
                                },
                                {
                                    "fo_id": "remove_street_addresses",
                                    "fo_value": true
                                }
                            ]
                        }
                    ],
                    "filter_mode": {
                        "mode": "replace",
                        "replacements": {
                            "pii.remove_phone_numbers": "remove"
                        }
                    },
                    "output_format": "jsonl",
                    "display_name": "Test"
                },
                "variant_type": "textual"
            }
        }
    ])

    // If BatchJobRequest.errors is null, then the request was successful
    if(BatchJobRequest.errors === null){
        // Jobs Ids will be returned in the same index order as the jobs you provided.
        let JobIds: string[] = BatchJobRequest.data.jobs ?? []
        //
        //  Your Logic.
        //
    }else{
        // If not, BatchJobRequest.errors will be an array of objects in the format:
        /*
            Example:
            {
                "message": "body must have required property 'team_id'",
                "code": "INTERNAL_SERVER_ERROR"
            }
        */
        console.log(BatchJobRequest.errors)
    }
}

Main()