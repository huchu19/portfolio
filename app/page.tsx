import Masthead from '@/components/home/Masthead'
import DeskScene from '@/components/home/desk/DeskScene'
import FragmentStrip from '@/components/home/FragmentStrip'
import Invitation from '@/components/home/Invitation'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { getAllPosts, getAllFragments, toFeedItem } from '@/lib/posts'
import { getShipping } from '@/lib/github'

/**
 * The descent. The ghazal keeps its screen (Masthead); everything below it
 * is the desk — now literally: a scene, not a list. See DESK-SCENE.md.
 */
export default async function HomePage() {
  const posts = getAllPosts()
  const fragments = getAllFragments().map(toFeedItem)
  const shipping = await getShipping()

  return (
    <div className="descent">
      <ScrollProgress />

      <Masthead />

      <DeskScene posts={posts} shipping={shipping} />

      <FragmentStrip items={fragments} />

      <Invitation />
    </div>
  )
}
