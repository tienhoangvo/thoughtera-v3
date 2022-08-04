import { Button, Center, Container, LoadingOverlay } from '@mantine/core'
import type { GetStaticProps, NextPage } from 'next'
import { ArrowDown } from 'phosphor-react'
import { SWRConfig } from 'swr'
import StoryList from '../lib/client/components/stories/StoryList/StoryList'
import StoryListItemAuthor from '../lib/client/components/stories/StoryListItemAuthor'
import useStories from '../lib/client/hooks/useData/useStories'
import { ListStoryType } from '../lib/client/services/stories'
import { listStoriesByPage } from '../lib/server/services/mongodb/queries'

const Home = () => {
  const { stories, nextPage, status } = useStories({})

  const handleLoadMoreClick = () => {
    nextPage()
  }

  if (status === 'loading') return <LoadingOverlay visible={true} />

  return (
    <Container size="md">
      <StoryList
        stories={stories}
        renderListItem={(story) => <StoryListItemAuthor story={story} />}
      />
      <Center>
        <Button
          onClick={handleLoadMoreClick}
          mt="lg"
          leftIcon={<ArrowDown />}
          color="teal"
        >
          Load more
        </Button>
      </Center>
    </Container>
  )
}

const HomePage: NextPage = (props: { fallback?: ListStoryType }) => {
  return (
    <SWRConfig value={{ fallback: props.fallback }}>
      <Home />
    </SWRConfig>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const stories = await listStoriesByPage({
    page: 1,
    filter: { published: true },
  })

  return {
    props: {
      fallback: {
        '/api/stories?page=1': JSON.parse(JSON.stringify(stories)),
      },
    },
    revalidate: 60,
  }
}

export default HomePage
