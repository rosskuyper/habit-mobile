import React from 'react'
import {StyleSheet, View} from 'react-native'
import {CheckBox, Text, Input} from '@ui-kitten/components'
import {Task as TaskType} from '../../hooks/useTaskState/reducer'
import {useTaskState} from '../../hooks/useTaskState/useTaskState'

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
  task: TaskType
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
  taskGroupId: string
}

export const NewTask = ({taskGroupId}: NewTaskProps) => {
  const [taskText, setTaskText] = React.useState('')
  const {pushTask} = useTaskState()

  const onSubmitEditing = () => {
    pushTask({
      text: taskText,
      taskGroupId,
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
