import { Octokit } from 'octokit';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    
    const GITHUB_PAT = process.env.GITHUB_PAT || ''
    const refDate = getPastDate(12)
    const octokit = new Octokit({
        auth: GITHUB_PAT
    })

    try {

        // Ongoing issue documented below prevents appropriate typing of a pagination call
        // Types have been defined in file, but future changes needed once a resolution is found
        // https://github.com/octokit/octokit.js/issues/2439
        //@ts-ignore
        const repos: MinimalRepository[] = await octokit.paginate('GET /users/{username}/repos', {
            username: 'patrick-rush',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
            per_page: 100,
            since: refDate,
            type: 'all',
        })

        const fetchCommits = async (repoName: string) => {
            const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
                owner: 'patrick-rush',
                repo: repoName,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                per_page: 100,
                committer: 'patrick-rush',
                since: refDate,
            })

            return response.data || []
        }

        const fetchAllCommits = async () => {
            const commitsPromises = repos.map(async repo => {
                const commits = await fetchCommits(repo.name)
                return commits.map(commit => ({
                    date: commit.commit?.author?.date,
                    source: 'GitHub'
                }))
            })

            const commitsArrays = await Promise.all(commitsPromises)
            return commitsArrays.flat()
        }

        const commits = await fetchAllCommits()
    
        return res.status(200).json({
            message: "Success",
            body: commits
        })
    } catch (err) {
        console.log("Error reaching GitHub:", err)
        return res.status(500).json({ message: err })
    }
}

const getPastDate = (subtrahend: number): string => {
    let date = new Date()
    date.setMonth(date.getMonth() - subtrahend)
    return date.toISOString()
}

/**
 * Minimal Repository
 */
interface MinimalRepository {
  id: number
  node_id: string
  name: string
  full_name: string
  owner: SimpleUser
  private: boolean
  html_url: string
  description: string | null
  fork: boolean
  url: string
  archive_url: string
  assignees_url: string
  blobs_url: string
  branches_url: string
  collaborators_url: string
  comments_url: string
  commits_url: string
  compare_url: string
  contents_url: string
  contributors_url: string
  deployments_url: string
  downloads_url: string
  events_url: string
  forks_url: string
  git_commits_url: string
  git_refs_url: string
  git_tags_url: string
  git_url?: string
  issue_comment_url: string
  issue_events_url: string
  issues_url: string
  keys_url: string
  labels_url: string
  languages_url: string
  merges_url: string
  milestones_url: string
  notifications_url: string
  pulls_url: string
  releases_url: string
  ssh_url?: string
  stargazers_url: string
  statuses_url: string
  subscribers_url: string
  subscription_url: string
  tags_url: string
  teams_url: string
  trees_url: string
  clone_url?: string
  mirror_url?: string | null
  hooks_url: string
  svn_url?: string
  homepage?: string | null
  language?: string | null
  forks_count?: number
  stargazers_count?: number
  watchers_count?: number
  /**
   * The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
   */
  size?: number
  default_branch?: string
  open_issues_count?: number
  is_template?: boolean
  topics?: string[]
  has_issues?: boolean
  has_projects?: boolean
  has_wiki?: boolean
  has_pages?: boolean
  has_downloads?: boolean
  has_discussions?: boolean
  archived?: boolean
  disabled?: boolean
  visibility?: string
  pushed_at?: string | null
  created_at?: string | null
  updated_at?: string | null
  permissions?: {
    admin?: boolean
    maintain?: boolean
    push?: boolean
    triage?: boolean
    pull?: boolean
    [k: string]: unknown
  }
  role_name?: string
  temp_clone_token?: string
  delete_branch_on_merge?: boolean
  subscribers_count?: number
  network_count?: number
  code_of_conduct?: CodeOfConduct
  license?: {
    key?: string
    name?: string
    spdx_id?: string
    url?: string
    node_id?: string
    [k: string]: unknown
  } | null
  forks?: number
  open_issues?: number
  watchers?: number
  allow_forking?: boolean
  web_commit_signoff_required?: boolean
  security_and_analysis?: {
    advanced_security?: {
      status?: "enabled" | "disabled"
      [k: string]: unknown
    }
    /**
     * Enable or disable Dependabot security updates for the repository.
     */
    dependabot_security_updates?: {
      /**
       * The enablement status of Dependabot security updates for the repository.
       */
      status?: "enabled" | "disabled"
      [k: string]: unknown
    }
    secret_scanning?: {
      status?: "enabled" | "disabled"
      [k: string]: unknown
    }
    secret_scanning_push_protection?: {
      status?: "enabled" | "disabled"
      [k: string]: unknown
    }
    [k: string]: unknown
  } | null
  [k: string]: unknown
}
/**
 * A GitHub user.
 */
interface SimpleUser {
  name?: string | null
  email?: string | null
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string | null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  starred_at?: string
  [k: string]: unknown
}
/**
 * Code Of Conduct
 */
interface CodeOfConduct {
  key: string
  name: string
  url: string
  body?: string
  html_url: string | null
  [k: string]: unknown
}
