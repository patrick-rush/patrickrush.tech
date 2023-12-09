import { type Metadata } from 'next'
import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import ordinal from 'ordinal'

function MusicSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

function Appearance({
  title,
  description,
  artist,
  cta,
  href,
}: {
  title: string
  description: string
  artist: string
  cta: string
  href: string
}) {
  return (
    <Card as="article">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Eyebrow decorate>{artist}</Card.Eyebrow>
      <Card.Description>{description}</Card.Description>
      <Card.Cta>{cta}</Card.Cta>
    </Card>
  )
}

export const metadata: Metadata = {
  title: 'Music',
  description: 'Music has taken me all over the world. Here are some of the projects I have contributed to.',
}

export default function Music() {

  const calculateSeason = (firstYear: number) => {
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()
    let duration = year - firstYear
    if (month >= 9) duration++
    return duration
  }

  return (
    <SimpleLayout
      title="Music has taken me around the world."
      intro={`I've had the opportunity to contribute to some beautiful music during my career. In addition to playing with the Jackson Symphony for more than ${new Date().getFullYear() - 2015} years, I have recorded with artists in both Nashville, TN and Richmond, VA since as early as 2008.`}
    >
      <div className="space-y-20">
        <MusicSection title="Recording">
          <Appearance
            href="https://davidmahler.bandcamp.com/album/sea-of-glass"
            title="Sea of Glass"
            description="David Mahler is a remarkably talented hammered dulcimer player. After we met in 2012, he and I went on to contribute to many of the same projects, and eventually David invited me to join him on this album. If you aren't familiar hammered dulcimer, it's sound is intoxicating beautiful, and watching David play is quite the experience. I recommend checking out some of his videos on YouTube."
            artist="David Mahler"
            cta="Listen on Bandcamp"
          />
          <Appearance
            href="https://etherealyear.bandcamp.com/album/become"
            title="Become"
            description="This project was recorded over the course of about a year and was the brainchild of Keith Perez, a talented writer and producer based out of Nashville, TN. If you like experimental ambient music, you'll definitely enjoy this EP."
            artist="Ethereal Year"
            cta="Listen on Bandcamp"
          />
          <Appearance
            href="https://timbre.bandcamp.com/album/sun-moon"
            title="Sun & Moon"
            description="I toured and performed with Timbre from 2011 until 2015. I was lucky enough to travel across the United States and Europe with Timbre, and to record one album with her. Sun & Moon was an ambitious project that required the talents of many to pull off. Be sure to listen to my favorite track on the album, Night Girl: Nycteris Sees the Sun."
            artist="Timbre"
            cta="Listen Bandcamp"
          />
          <Appearance
            href="https://soundcloud.com/hamilofficial/sets/weights"
            title="Weights"
            description="I toured and performed with Timbre from 2011 until 2015. I was lucky enough to travel across the United States and Europe with Timbre, and to record one album with her. Sun & Moon was an ambitious project that required the talents of many to pull off. Be sure to listen to my favorite track on the album, Night Girl: Nycteris Sees the Sun."
            artist="Hamil"
            cta="Listen on SoundCloud"
          />
          <Appearance
            href="https://open.spotify.com/track/47igrnqElHYK6DblFgzAsZ?si=6b0379379e5244d7"
            title="Go"
            description="Natalie, aka Nath, was just a kid in middle school when we first met through her brother, whom I played music with through college. Nath has grown into a talented folk singer/songwriter, and I was so honored to get to play on her track, Go in 2020."
            artist="Nath"
            cta="Listen on Spotify"
          />
          <Appearance
            href="https://open.spotify.com/track/5EroIPs6qX2nxLHYRSvn7o?si=e175387049824cd5"
            title="The Tarmac"
            description="I've so enjoyed working with Jonathan, a Richmond, VA-based singer/songwriter over the years. His unique voice and captivating lyrics draw you in as soon as you hear them. I got to lay down some cello on several tracks for his album, The Tarmac, and this is one of my favorites. It also happens to feature the aforementioned Nath!"
            artist="Jonathan Facka"
            cta="Listen on Spotify"
          />
        </MusicSection>
        <MusicSection title="Performance">
          <Appearance
            href="https://www.thejacksonsymphony.org/"
            title="The Jackson Symphony"
            description={`The Jackson Symphony was founded in 1961, and is currently in it's ${ordinal(calculateSeason(1961))} season. I began playing with The Jackson Symphony in 2015. Over my time there, I have become quite fond of the city of Jackson, and am so proud of what The Jackson Symphony contributes to life and culture there. The orchestra has grown in size and scope since I joined and has seen record turnouts each year over. It's influence is felt throughout West Tennessee, and I'm proud to be a part of the work that it is doing.`}
            artist="Section Cellist"
            cta="Visit The Jackson Symphony's website"
          />
          <Appearance
            href="https://www.celebritycruises.com/cruise-ships/celebrity-solstice?icid=xplrsh_wrnssn_sls_hm_other_155"
            title="Celebrity Solstice"
            description="From September 2016 until March 2017, I lived and worked on the beautiful Celebrity Solstice alongside my dear friend Rebecca Hannigan of Annapolis Bows & Violins in the Chroma String Duo, where we performed on stage, in lounges, and everywhere in between. We traveled from Washington to Alaska, Hawaii, the South Pacific islands, Australia, New Zealand, Singapore, and many many more places. I had such an amazing time living at sea, and I hope to be able to spend more time exploring the world aboard a ship again someday. There is nothing quite like it."
            artist="Chroma String Duo"
            cta="Visit Celebrity's website"
          />
        </MusicSection>
      </div>
    </SimpleLayout>
  )
}
