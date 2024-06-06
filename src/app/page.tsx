import Link from 'next/link'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { Photos } from '@/components/Photos'
import { Contact } from '@/components/Contact'
import { Resume } from '@/components/Resume'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import { CommitGrid } from '@/components/CommitGrid'

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

export default async function Home() {
  let articles = (await getAllArticles()).slice(0, 4)

  return (
    <>
      <Container className="mt-9">
        {/* <div className="max-w-2xl"> */}
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-x-20 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              Patrick Rush
            </h1>
            <div className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                Hello! I&apos;m a full-stack software engineer and cellist with
                a passion for crafting effective code and beautiful music. I
                bring creativity, intelligence, and a love for learning to
                everything I do.
              </p>
              <p>
                Join me on this journey where software engineering meets
                artistry, and let&apos;s create something beautiful together.
              </p>
              <p>
                {/* <span>
                  I am currently open to contract and full-time
                  employment.&nbsp;
                </span> */}
                <span>
                  Please don&apos;t hesitate to reach out if you would like to
                  connect!
                </span>
              </p>
            </div>
            {/* socials */}
            <div className="mt-6 flex gap-6">
              <SocialLink
                href={`${process.env.TWITTER_URL}`}
                aria-label="Follow on Twitter"
                icon={TwitterIcon}
              />
              <SocialLink
                href={`${process.env.INSTAGRAM_URL}`}
                aria-label="Follow on Instagram"
                icon={InstagramIcon}
              />
              <SocialLink
                href={`${process.env.GITHUB_URL}`}
                aria-label="Follow on GitHub"
                icon={GitHubIcon}
              />
              <SocialLink
                href={`${process.env.LINKEDIN_URL}`}
                aria-label="Follow on LinkedIn"
                icon={LinkedInIcon}
              />
            </div>
          </div>
          <Resume />
        </div>
      </Container>
      {/* <Photos /> */}
      <Container className="mt-24 md:mt-20">
        <CommitGrid />
      </Container>
      <Container className="mt-24 md:mt-20">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <div className="space-y-10">
              <Contact />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
