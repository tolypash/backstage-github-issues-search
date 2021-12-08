import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
import fetch from 'cross-fetch';

export interface IGithubIssue extends IndexableDocument {
    id: number
    title: string
    body: string // body
    user: IGithubUser
    state: "open" | "closed"
    html_url: string
}

interface IGithubUser {
    login: string // name
    avatar_url: string
}

export class DefaultGithubIssuesCollator implements DocumentCollator {
    public readonly type: string = 'github-issue';

    async execute() {
        const state = "all"; // "open" to get open issues, "closed" to get closed issues, "all" to get all issues
        const per_page = 100
        const url = `https://api.github.com/repos/backstage/backstage/issues?state=${state}&per_page=${per_page}&page=`
        let page = 1;
        let end = false;

        const max_page = 3 // max pages to fetch from

        let allEntities: IGithubIssue[] = []

        while (!end) {
            // max issues per_page is 100, so we must fetch one page after the other
            const res = await fetch(url + page)
            const entities = await res.json()

            if (entities.length < 100 || page >= max_page) {
                end = true
            }

            if (Array.isArray(entities)) {
                allEntities = [...allEntities, ...entities]
                page++
            } else {
                end = true

                if (entities.message && entities.message.includes("API rate limit exceeded")) {
                    console.error("GitHub API Limit Reached! :(")
                }
            }
        }

        const result = allEntities.map(
            (entity) => {
                return {
                    id: entity.id,
                    title: entity.title,
                    text: entity.body,
                    state: entity.state,
                    user: {
                        avatar_url: entity.user.avatar_url,
                        name: entity.user.login
                    },
                    // location: `/issues/${entity.id}`,
                    location: entity.html_url,
                    kind: 'Issue'
                }
            }
        )
        return result
    }
}