package arklow

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

type ClientOptions struct {
	ApiKey  string
	TeamId  string
	Version string
	Options struct {
		NoThrownErrors bool
	}
}

type ClientResponse struct {
	Data   interface{}
	Errors []interface{}
}

type Client struct {
	ApiKey  string
	Version string
	TeamId  string
	Options struct {
		NoThrownErrors bool
	}
}

func NewClient(Options *ClientOptions) *Client {
	c := &Client{
		ApiKey:  Options.ApiKey,
		Version: Options.Version,
		TeamId:  Options.TeamId,
		Options: Options.Options,
	}
	c.preCheck()
	return c
}

func (c *Client) preCheck() {
	if c.ApiKey == "" {
		panic("apiKey is required.")
	}
	if c.Version == "" {
		panic("version is required.")
	}
	if c.TeamId == "" {
		panic("teamId is required.")
	}
}

func (c *Client) ChangeTeamId(teamId string) {
	c.TeamId = teamId
}

func (c *Client) ChangeVersion(version string) {
	c.Version = version
}

func (c *Client) ChangeApiKey(apiKey string) {
	c.ApiKey = apiKey
}

func (c *Client) MakeRequest(path string, method string, payload interface{}) (ClientResponse, error) {
	c.preCheck()
	url := fmt.Sprintf("https://api.arklow.io/%s/%s", c.Version, path)
	var body *bytes.Buffer
	if payload != nil {
		payloadBytes, _ := json.Marshal(payload)
		body = bytes.NewBuffer(payloadBytes)
	}
	request, err := http.NewRequest(strings.ToUpper(method), url, body)
	if err != nil {
		return ClientResponse{}, err
	}
	request.Header.Set("Content-Type", "application/json;charset=utf-8")
	request.Header.Set("x-arklow-api-key", c.ApiKey)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return ClientResponse{}, err
	}
	defer resp.Body.Close()
	respBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return ClientResponse{}, err
	}
	var result ClientResponse
	json.Unmarshal(respBytes, &result)
	if result.Errors != nil {
		var errorString string
		for i, err := range result.Errors {
			errorString += fmt.Sprintf("[%d] %v\n", i, err)
		}
		if errorString != "" && !c.Options.NoThrownErrors {
			return ClientResponse{}, fmt.Errorf(errorString)
		}
	}
	return result, nil
}

type BatchManager struct {
	Client
}

func NewBatchManager(Options *ClientOptions) *BatchManager {
	return &BatchManager{
		Client: *NewClient(Options),
	}
}

func (b *BatchManager) CreateBatchJobs(jobs []interface{}) (ClientResponse, error) {
	if len(jobs) == 0 {
		return ClientResponse{}, fmt.Errorf("jobs must be an array of jobs")
	}
	payload := map[string]interface{}{
		"team_id": b.TeamId,
		"jobs":    jobs,
	}
	return b.MakeRequest("/batch/create", "POST", payload)
}

func (b *BatchManager) ListBatchJobs(count int, offset int) (ClientResponse, error) {
	path := fmt.Sprintf("/batch/list/%s?count=%d&last_index=%d", b.TeamId, count, offset)
	return b.MakeRequest(path, "GET", nil)
}

func (b *BatchManager) GetBatchJob(jobId string) (ClientResponse, error) {
	path := fmt.Sprintf("/batch/%s?team=%s", jobId, b.TeamId)
	return b.MakeRequest(path, "GET", nil)
}
