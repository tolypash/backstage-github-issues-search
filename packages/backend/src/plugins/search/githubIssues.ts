import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
import fetch from 'cross-fetch';

export interface GithubIssue extends IndexableDocument {
    id: number
    title: string
    body: string // body
    user: IGithubUser
    state: "open" | "closed" | "all"
    html_url: string
}

interface IGithubUser {
    avatar_url: string
}

export class DefaultGithubIssuesCollator implements DocumentCollator {
    public readonly type: string = 'github-issue';

    async execute() {
        const url = `https://api.github.com/repos/backstage/backstage/issues`
        const res = await fetch(url)
        const entities: GithubIssue[] = await res.json()

        const result = entities.map(
            (entity) => {
                return {
                    id: entity.id,
                    title: entity.title,
                    text: entity.body,
                    state: entity.state,
                    user: {
                      avatar_url: entity.user.avatar_url  
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