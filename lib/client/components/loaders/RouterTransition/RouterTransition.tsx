// components/RouterTransition.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  startNavigationProgress,
  resetNavigationProgress,
  setNavigationProgress,
  NavigationProgress,
} from '@mantine/nprogress'

export function RouterTransition() {
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
      resetNavigationProgress()
      startNavigationProgress()
    }
    
    const handleComplete = () => { setNavigationProgress(100);  }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router.events])
  return <NavigationProgress />
}

export default RouterTransition