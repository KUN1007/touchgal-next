import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypePrism from 'rehype-prism-plus'
import remarkDirective from 'remark-directive'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Node } from 'unist'

export const markdownToHtml = async (markdown: string) => {
  const htmlVFile = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeStringify)
    .process(markdown)

  return String(htmlVFile)
}

const remarkKunVideo: Plugin<[], Node> = () => {
  return (tree) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'kun-video') return

        const data = node.data || (node.data = {})
        const attributes = node.attributes || {}

        data.hName = 'div'
        data.hProperties = {
          'data-video-player': '',
          'data-src': attributes.src,
          className: 'w-full my-4 overflow-hidden shadow-lg rounded-xl'
        }
      }
    })
  }
}

// Support video and custom external link
export const markdownToHtmlExtend = async (markdown: string) => {
  const htmlVFile = await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkKunVideo)
    .use(remarkRehype)
    .use(rehypeSanitize, {
      attributes: {
        div: ['data-video-player', 'data-src', 'className']
      }
    })
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeStringify)
    .process(markdown)

  return String(htmlVFile)
}
