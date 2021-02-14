import React, {useMemo} from 'react'
import {StyleSheet, View} from 'react-native'
import {Spinner} from '@ui-kitten/components'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useTaskStateContext} from '../../hooks/useTaskState/useTaskStateContext'

export const TaskStateLoadingSpinner = () => {
  const {top} = useSafeAreaInsets()
  const {loading} = useTaskStateContext()

  const styles = useMemo(() => {
    return StyleSheet.create({
      spinner: {
        position: 'absolute',
        top: top + 8,
        right: 20,
      },
    })
  }, [top])

  return loading ? (
    <View style={styles.spinner}>
      <Spinner status="primary" size="small" />
    </View>
  ) : null
}
