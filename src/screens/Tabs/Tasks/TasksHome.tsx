import {Button, Input, Text} from '@ui-kitten/components'
import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {BottomModal, useModalVisibility} from '../../../components/BottomModal/BottomModal'
import {TaskGroup} from '../../../components/TaskGroup/TaskGroup'
import {ScreenContainer} from '../../../components/ScreenContainer/ScreenContainer'
import {useTaskState} from '../../../hooks/useTaskState'
import * as TaskTypes from '../../../types/TaskTypes'

const styles = StyleSheet.create({
  add: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },

  input: {
    marginBottom: 12, // ui-kitten bug adds 4px margin to inputs
  },

  addTitle: {
    marginBottom: 24,
  },

  buttons: {
    flexDirection: 'row',
  },

  contentContainerStyle: {
    flexDirection: 'column',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
})

export const TasksHome = () => {
  const {sortedGroups, pushGroup, pushTask} = useTaskState()
  const [newTaskGroupName, setNewTaskGroupName] = useState('')

  const {isVisible, closeModal, openModal} = useModalVisibility()

  const saveTaskGroup = () => {
    if (newTaskGroupName.trim() === '') {
      return
    }

    pushGroup({
      title: newTaskGroupName,
    })
    closeModal()
    setNewTaskGroupName('')
  }

  useEffect(() => {
    pushGroup({title: 'Today'})
    pushGroup({title: 'This week'})
  }, [pushGroup])

  return (
    <>
      <ScreenContainer>
        {sortedGroups.map((group: TaskTypes.TaskGroup) => (
          <TaskGroup group={group} key={group.id} pushTask={pushTask} />
        ))}

        <Button style={styles.add} onPress={openModal}>
          Add Group
        </Button>

        <BottomModal isVisible={isVisible} closeModal={closeModal}>
          <View style={styles.contentContainerStyle}>
            <Text category="h5" style={styles.addTitle}>
              Create new Task Group
            </Text>

            <Input
              autoFocus={false}
              placeholder="Task Group name"
              style={styles.input}
              onSubmitEditing={saveTaskGroup}
              value={newTaskGroupName}
              onChangeText={(text) => setNewTaskGroupName(text)}
            />

            <View style={styles.buttons}>
              <Button style={{flex: 3, marginRight: 16}} onPress={saveTaskGroup}>
                Save Group
              </Button>
              <Button style={{flex: 2}} onPress={closeModal} appearance="outline" status="basic">
                Cancel
              </Button>
            </View>
          </View>
        </BottomModal>
      </ScreenContainer>
    </>
  )
}
