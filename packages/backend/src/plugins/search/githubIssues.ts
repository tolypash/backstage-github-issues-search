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
        const state = "open"; // set to "all" to fetch closed issues as well
        const per_page = 100
        const url = `https://api.github.com/repos/backstage/backstage/issues?state=${state}&per_page=${per_page}&page=`
        let page = 1;
        let end = false;

        let allEntities: IGithubIssue[] = []

        while (!end) {
            const res = await fetch(url + page)
            const entities = await res.json()

            if (entities.length < 100) {
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