import {Layout, Text} from '@ui-kitten/components'
import React from 'react'
import {StyleSheet} from 'react-native'
import {ScreenContainer} from '../../../components/ScreenContainer/ScreenContainer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 24,
    marginVertical: 16,
  },
})

export const HabitsHome = () => {
  return (
    <ScreenContainer>
      <Layout style={styles.container}>
        <Text category="h3" style={{marginBottom: 60, textAlign: 'center'}}>
          Habits
        </Text>
      </Layout>
    </ScreenContainer>
  )
}
