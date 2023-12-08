import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description: 'Software I use, gadgets I love, and other things I recommend.',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="Stuff I use, love, and recommend."
      intro="If there is one thing I'm usually not short on, it's an opinion! Here are some things I use and love. Maybe you'll find something you like too!"
    >
      <div className="space-y-20">
        <ToolsSection title="Gear">
          <Tool title="13” MacBook Air, Intel, 16GB RAM (2020)">
            Before my current machine, I used the same MacBook Pro for 10 years. That thing got me through college, teaching, traveling around the world... it held up incredibly well. When I started as a software engineer, I needed an upgrade. My MacBook Air has been a small but mighty tool. I travel a lot, so having something powerful, yet light and portable has been amazing. 
          </Tool>
          <Tool title="12.9” iPad Pro (4th generation) + Apple Pencil (2nd generation)">
            I have two main uses for the iPad. First is as a second monitor. When I&apos;m on the road working, having an external monitor is absolutely essential, especially when I&apos;m used to three at home! Secondly, the iPad has quickly become an indispensible tool for modern musicians. Gone are the days of lugging around binders full of music that you have spent hours taping, copying, and rearranging. All that can be done on the iPad now, and with the addition of the Apple Pencil, jotting down queues and notes in your music is as easy as it was with a pencil.
          </Tool>
          <Tool title="Logitech MX Keys Mac Keyboard">
            I love the look and feel of a low profile keyboard, and there is none more beautiful than the Apple Keyboard, however, I just can&apos;t give up the numpad. On top of that, the MX Keys offers an array of other useful features, such as multi-devise support, smart illumination, and customizable keys.
          </Tool>
          <Tool title="Logitech MX Master 3S Mouse">
            The customizable inputs on this mouse have become absolutely indispensible for my workflow, and the mouse&apos;s semi-ergonomic design helps reduce wrist strain without a wildly unfamiliar feel or learning curve. I will say that I have had some trouble with losing my custom settings from time to time, but I have found Logitech&apos;s software to be well supported and issues have generally been taken care of in a timely manner.
          </Tool>
        </ToolsSection>
        {/* <ToolsSection title="Development tools">
          <Tool title="Sublime Text 4">
            I don’t care if it’s missing all of the fancy IDE features everyone
            else relies on, Sublime Text is still the best text editor ever
            made.
          </Tool>
          <Tool title="iTerm2">
            I’m honestly not even sure what features I get with this that aren’t
            just part of the macOS Terminal but it’s what I use.
          </Tool>
          <Tool title="TablePlus">
            Great software for working with databases. Has saved me from
            building about a thousand admin interfaces for my various projects
            over the years.
          </Tool>
        </ToolsSection> */}
        {/* <ToolsSection title="Design">
          <Tool title="Figma">
            We started using Figma as just a design tool but now it’s become our
            virtual whiteboard for the entire company. Never would have expected
            the collaboration features to be the real hook.
          </Tool>
        </ToolsSection> */}
        <ToolsSection title="Productivity">
          <Tool title="2Do">
            I have recommended this remarkable to-do app to just about everyone I know. I have used it for several years now, and it has become an integral part of my daily life. Astonishingly, the app was created by one individual developer, who has meticulously maintained it since he first published it. If you are a fan of powerful task management tools with a slim, unbloated user interface, you&apos;ll enjoy 2Do.
          </Tool>
          <Tool title="Obsidian">
            There are plenty of note taking apps out there, and not all of them are for everyone. Obsidian definitely has a learning curve to it, but as a developer, I find it to be the most comfortable tool for me in my workflow. Through the use of some incredible built-in and community plugins, I&apos;ve created a powerful workflow that helps me manage my day-to-day notes and workflows. 
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
