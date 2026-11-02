import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { mdxComponents } from "./mdx";

/**
 * Article body renderer.
 * Markdown is compiled on the server at request/build time — the browser
 * receives plain HTML, never a markdown parser.
 */
export async function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
                properties: {
                  className: ["heading-anchor"],
                  "aria-label": "Link to this section",
                },
              },
            ],
          ],
        },
      }}
    />
  );
}
