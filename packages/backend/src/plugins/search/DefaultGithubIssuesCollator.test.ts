import { DefaultGithubIssuesCollator, IGithubIssue, IGithubIssueDocument } from "./DefaultGithubIssuesCollator";

const expectedIssuesResponse:IGithubIssue[] = [
    {
        id: 123,
        title: "Issue title",
        body: "Issue body",
        state: "open",
        user: {
            login: "username",
            avatar_url: "https://example.com/avatar.png",
        },
        html_url: "https://github.com/backstage/backstage/issues/123",
    }
]

jest.mock('cross-fetch', () => ({
    __esModule: true,
    default: async () => {
        return {
            json: async () => {
                return expectedIssuesResponse;
            }
        }
    }
}))

describe("DefaultGithubIssuesCollator", () => {
    let collator: DefaultGithubIssuesCollator;

    beforeEach(() => {
        collator = new DefaultGithubIssuesCollator()
    })


    it('executes the collator', async () => {
        const documents = await collator.execute()

        expect(documents).toHaveLength(expectedIssuesResponse.length)
    })

    it('maps a returned github issue to an expected document', async () => {
        const documents:IGithubIssueDocument[] = await collator.execute()
        expect(documents[0]).toMatchObject({
            id: expectedIssuesResponse[0].id,
            title: expectedIssuesResponse[0].title,
            text: expectedIssuesResponse[0].body,
            state: expectedIssuesResponse[0].state,
            user: {
                name: expectedIssuesResponse[0].user.login,
                avatar_url: expectedIssuesResponse[0].user.avatar_url
            },
            location: expectedIssuesResponse[0].html_url,
            kind: "Issue",
        })
    })
})