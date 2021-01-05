import React, {FC, useCallback, useMemo, useState} from 'react'
import {View, StyleSheet, LayoutChangeEvent} from 'react-native'
import Modal from 'react-native-modal'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 15,
  },
  close: {
    height: 24,
    width: 24,
    marginLeft: 15,
    marginBottom: 15,
  },
  content: {
    flex: 1,
  },
})

export type BottomModalProps = {
  closeModal: () => void
  isVisible: boolean
  swipeThresholdPercentage?: number
}

export const BottomModal: FC<BottomModalProps> = (props) => {
  const {closeModal, isVisible, children, swipeThresholdPercentage = 0.6} = props
  const [swipeThreshold, setSwipeThreshold] = useState(100)

  const {bottom: paddingBottom} = useSafeAreaInsets()

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (event.nativeEvent.layout.height > 100 / swipeThresholdPercentage) {
        setSwipeThreshold(event.nativeEvent.layout.height * swipeThresholdPercentage)
      }
    },
    [swipeThresholdPercentage],
  )

  const containerSafePaddingStyles = useMemo(() => {
    return StyleSheet.create({
      style: {paddingBottom},
    }).style
  }, [paddingBottom])

  return (
    <Modal
      style={styles.view}
      isVisible={isVisible}
      avoidKeyboard={true}
      onBackdropPress={closeModal}
      swipeDirection={['down']}
      swipeThreshold={swipeThreshold}
      onSwipeComplete={closeModal}
    >
      <View style={[styles.container, containerSafePaddingStyles]} onLayout={onLayout}>
        {children}
      </View>
    </Modal>
  )
}

export const useModalVisibility = ({
  initialVisibility = false,
}: {initialVisibility?: boolean} = {}) => {
  const [isVisible, setIsVisible] = useState(initialVisibility)
  const closeModal = useCallback(() => setIsVisible(false), [])
  const openModal = useCallback(() => setIsVisible(true), [])

  return {
    isVisible,
    closeModal,
    openModal,
  }
}
