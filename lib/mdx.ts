import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface BlogFrontmatter {
  title: string
  excerpt: string
  author: string
  authorRole?: string
  authorImage?: string
  date: string
  tags: string[]
  coverImage?: string
  featured?: boolean
}

export interface BlogPost {
  slug: string
  frontmatter: BlogFrontmatter
  content: string
  readingTime: string
}

export interface EventFrontmatter {
  title: string
  description: string
  date: string
  time: string
  location: string
  city: string
  isVirtual: boolean
  virtualLink?: string
  capacity?: number
  coverImage?: string
  tags: string[]
  featured?: boolean
}

export interface EventPost {
  slug: string
  frontmatter: EventFrontmatter
  content: string
}

function getMDXFiles(dir: string): string[] {
  const fullPath = path.join(CONTENT_DIR, dir)
  if (!fs.existsSync(fullPath)) {
    return []
  }
  return fs.readdirSync(fullPath).filter((file) => file.endsWith('.mdx'))
}

function readMDXFile<T>(dir: string, slug: string): { frontmatter: T; content: string } {
  const filePath = path.join(CONTENT_DIR, dir, `${slug}.mdx`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return { frontmatter: data as T, content }
}

// Blog functions
export function getAllBlogPosts(): BlogPost[] {
  const files = getMDXFiles('blog')
  return files
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const { frontmatter, content } = readMDXFile<BlogFrontmatter>('blog', slug)
      return {
        slug,
        frontmatter,
        content,
        readingTime: readingTime(content).text,
      }
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const { frontmatter, content } = readMDXFile<BlogFrontmatter>('blog', slug)
    return {
      slug,
      frontmatter,
      content,
      readingTime: readingTime(content).text,
    }
  } catch {
    return null
  }
}

export function getFeaturedBlogPosts(limit = 3): BlogPost[] {
  return getAllBlogPosts()
    .filter((post) => post.frontmatter.featured)
    .slice(0, limit)
}

// Event functions
export function getAllEvents(): EventPost[] {
  const files = getMDXFiles('events')
  return files
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const { frontmatter, content } = readMDXFile<EventFrontmatter>('events', slug)
      return { slug, frontmatter, content }
    })
    .sort((a, b) => new Date(a.frontmatter.date).getTime() - new Date(b.frontmatter.date).getTime())
}

export function getUpcomingEvents(limit?: number): EventPost[] {
  const now = new Date()
  const upcoming = getAllEvents().filter(
    (event) => new Date(event.frontmatter.date) >= now
  )
  return limit ? upcoming.slice(0, limit) : upcoming
}

export function getPastEvents(limit?: number): EventPost[] {
  const now = new Date()
  const past = getAllEvents()
    .filter((event) => new Date(event.frontmatter.date) < now)
    .reverse()
  return limit ? past.slice(0, limit) : past
}

export function getEvent(slug: string): EventPost | null {
  try {
    const { frontmatter, content } = readMDXFile<EventFrontmatter>('events', slug)
    return { slug, frontmatter, content }
  } catch {
    return null
  }
}
