import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {Ionicons} from '@expo/vector-icons'
import React, {ComponentProps} from 'react'
import {StyleSheet} from 'react-native'
import {HabitsHome} from '../screens/Tabs/Habits/HabitsHome'
import {HabitsStackList, TasksStackList} from './Params'
import {TasksHome} from '../screens/Tabs/Tasks/TasksHome'

const styles = StyleSheet.create({
  tabBarLabel: {
    paddingBottom: 4,
  },
})

/***********************************************************************************************************************
 * Utils
 **********************************************************************************************************************/
// Tab Nav Icons
type IoniconType = typeof Ionicons // breaking this up over two lines helps vscode syntax highlighting
type IconProps = ComponentProps<IoniconType>
function TabBarIcon(props: IconProps) {
  return <Ionicons size={30} {...props} />
}

/***********************************************************************************************************************
 * Each Tab has its own Stack / History etc
 **********************************************************************************************************************/
const StackNav_Habits = createStackNavigator<HabitsStackList>()
const HabitsStack = () => (
  <StackNav_Habits.Navigator>
    <StackNav_Habits.Screen
      name="HabitsHome"
      component={HabitsHome}
      options={{headerShown: false}}
    />
  </StackNav_Habits.Navigator>
)

const StackNav_Tasks = createStackNavigator<TasksStackList>()
const TasksStack = () => (
  <StackNav_Tasks.Navigator>
    <StackNav_Tasks.Screen name="TasksHome" component={TasksHome} options={{headerShown: false}} />
  </StackNav_Tasks.Navigator>
)

/***********************************************************************************************************************
 * The overall wrapping Tab Navigator
 **********************************************************************************************************************/
const TabNav = createBottomTabNavigator()

export const PrivateNavigation = () => {
  return (
    <TabNav.Navigator tabBarOptions={{labelStyle: styles.tabBarLabel}}>
      <TabNav.Screen
        name="Tasks"
        component={TasksStack}
        options={{
          tabBarIcon: ({color}) => <TabBarIcon name="ios-list" color={color} />,
        }}
      />
      <TabNav.Screen
        name="Habits"
        component={HabitsStack}
        options={{
          tabBarIcon: ({color}) => <TabBarIcon name="ios-analytics" color={color} />,
        }}
      />
    </TabNav.Navigator>
  )
}
