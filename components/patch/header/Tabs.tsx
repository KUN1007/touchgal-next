import { Tab, Tabs } from '@nextui-org/tabs'
import { IntroductionTab } from '~/components/patch/introduction/IntroductionTab'
import { ResourceTab } from '~/components/patch/resource/ResourceTab'
import { CommentTab } from '~/components/patch/comment/CommentTab'
import type { PatchIntroduction } from '~/types/api/patch'

interface PatchHeaderProps {
  id: number
  intro: PatchIntroduction
}

export const PatchHeaderTabs = ({ id, intro }: PatchHeaderProps) => {
  return (
    <Tabs
      className="w-full my-6 overflow-hidden shadow-medium rounded-large"
      fullWidth={true}
      defaultSelectedKey="introduction"
      onSelectionChange={(value) => {
        if (value === 'resources') {
          window.scroll(0, 0)
        }
      }}
    >
      <Tab key="introduction" title="游戏信息" className="p-0">
        <IntroductionTab intro={intro} patchId={Number(id)} />
      </Tab>

      <Tab key="resources" title="资源链接" className="p-0">
        <ResourceTab id={id} />
      </Tab>

      <Tab key="comments" title="游戏评论" className="p-0">
        <CommentTab id={id} />
      </Tab>
    </Tabs>
  )
}
