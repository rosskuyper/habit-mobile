import React from 'react'
import {StyleSheet, View} from 'react-native'
import {CheckBox, Text, Input} from '@ui-kitten/components'
import * as TaskTypes from '../../types/TaskTypes'
import {PushTaskPayload} from '../../hooks/useTaskState'

const styles = StyleSheet.create({
  container: {
    // marginBottom: 16,
    paddingBottom: 8,
  },

  newTask: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    borderColor: 'white',
    backgroundColor: 'white',
    flex: 1,
    // height: 20,
    padding: 0,
    margin: 0,
  },
})

export type TaskProps = {
  task: TaskTypes.Task
}

export const Task = ({task}: TaskProps) => {
  const [checked, setChecked] = React.useState(false)

  return (
    <View style={styles.container}>
      <CheckBox checked={checked} onChange={(nextChecked) => setChecked(nextChecked)}>
        {(textProps) => (
          <Text
            {...textProps}
            style={[textProps?.style, {textDecorationLine: checked ? 'line-through' : 'none'}]}
          >
            {task.text}
          </Text>
        )}
      </CheckBox>
    </View>
  )
}

export type NewTaskProps = {
  pushTask: (payload: PushTaskPayload) => void
  groupId: string
}

export const NewTask = ({pushTask, groupId}: NewTaskProps) => {
  const [taskText, setTaskText] = React.useState('')

  const onSubmitEditing = () => {
    pushTask({
      text: taskText,
      groupId,
    })
    setTaskText('')
  }

  return (
    <View style={[styles.container, styles.newTask]}>
      <CheckBox checked={false} disabled />

      <Input
        blurOnSubmit={false}
        autoFocus={false}
        placeholder="..."
        style={styles.input}
        value={taskText}
        onChangeText={setTaskText}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  )
}
