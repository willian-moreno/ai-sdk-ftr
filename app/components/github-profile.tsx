import { octokit } from '@/app/lib/octokit'
import { GetResponseTypeFromEndpointMethod } from '@octokit/types'

type GitHubUser = GetResponseTypeFromEndpointMethod<typeof octokit.users.getByUsername>['data']

interface GithubProfileProps {
  user: GitHubUser
}

export function GithubProfile({ user }: GithubProfileProps) {
  return (
    <div className="bg-zinc-950 rounded-lg flex gap-3 p-6">
      <img
        src={user.avatar_url}
        alt={user.name ?? ''}
        className="size-10 rounded-full mt-0 mb-0"
      />

      <div className="flex flex-col gap-1">
        <span className="text-lg font-medium">{user.name || user.login}</span>
        <p className="text-sm text-zinc-400 leading-relaxed mt-0 mb-0">{user.bio}</p>
      </div>
    </div>
  )
}
