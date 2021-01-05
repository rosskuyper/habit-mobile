import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text} from '@ui-kitten/components'
import {NewTask, Task} from '../Task/Task'
import {values} from 'ramda'
import {TaskGroup as TaskGroupType} from '../../hooks/useTaskState/reducer'

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 12,
  },
})

export type TaskGroupProps = {
  group: TaskGroupType
}

export const TaskGroup = ({group}: TaskGroupProps) => {
  return (
    <View style={styles.container}>
      <Text category="h6" style={styles.title}>
        {group.name}
      </Text>

      {values(group.tasks).map((task) => (
        <Task task={task} key={task.id} />
      ))}

      <NewTask key={`${group.id}-new-task`} taskGroupId={group.id} />
    </View>
  )
}
