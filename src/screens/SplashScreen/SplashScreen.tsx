import {Layout, Spinner} from '@ui-kitten/components'
import React, {useState} from 'react'
import useTimeout from 'usetimeout-react-hook'

type SplashScreenProps = {
  delay?: number
}

export const SplashScreen = ({delay = 400}: SplashScreenProps) => {
  const [showSpinner, setShowSpinner] = useState(true)

  useTimeout(() => setShowSpinner(true), delay, [])

  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* Delayed spinner */}
      {showSpinner && <Spinner />}
    </Layout>
  )
}
