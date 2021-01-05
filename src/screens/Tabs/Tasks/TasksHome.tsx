import {useQuery} from '@apollo/client'
import {Button, Input, Text} from '@ui-kitten/components'
import React, {useState} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import {QUERY_ME} from '../../../api/queries'
import {BottomModal, useModalVisibility} from '../../../components/BottomModal/BottomModal'
import {ScreenContainer} from '../../../components/ScreenContainer/ScreenContainer'
import {TaskGroup} from '../../../components/TaskGroup/TaskGroup'
import {TaskStateLoadingSpinner} from '../../../components/TaskStateLoadingSpinner/TaskStateLoadingSpinner'
import {useTaskState} from '../../../hooks/useTaskState/useTaskState'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    flex: 1,
  },

  add: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
  const {sortedGroups, pushGroup} = useTaskState()
  const [newTaskGroupName, setNewTaskGroupName] = useState('')

  const {isVisible, closeModal, openModal} = useModalVisibility()

  useQuery(QUERY_ME)

  const saveTaskGroup = () => {
    if (newTaskGroupName.trim() === '') {
      return
    }

    pushGroup({
      name: newTaskGroupName,
    })
    closeModal()
    setNewTaskGroupName('')
  }

  return (
    <>
      <ScreenContainer>
        <ScrollView style={styles.container}>
          {sortedGroups.map((group) => (
            <TaskGroup group={group} key={group.id} />
          ))}
        </ScrollView>

        <TaskStateLoadingSpinner />

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
