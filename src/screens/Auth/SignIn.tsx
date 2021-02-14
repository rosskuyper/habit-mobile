import {GoogleSigninButton} from '@react-native-community/google-signin'
import {AppleButton} from '@invertase/react-native-apple-authentication'
import {Layout, Text} from '@ui-kitten/components'
import React from 'react'
import {StyleSheet, Platform} from 'react-native'
import {ScreenContainer} from '../../components/ScreenContainer/ScreenContainer'
import {TopWeightedView} from '../../components/TopWeightedView/TopWeightedView'
import {useFirebaseAuth} from '../../hooks/useFirebaseAuth'
import {env} from '../../Constants'

const isIOS = Platform.OS === 'ios'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 24,
  },
})

export const SignIn = () => {
  const {inProgress, initGoogleSignIn, initAppleSignIn, error} = useFirebaseAuth()

  return (
    <ScreenContainer>
      <TopWeightedView>
        <Layout style={styles.container}>
          <Text category="h3" style={{textAlign: 'center', marginBottom: 48}}>
            Habit Channel
          </Text>

          <GoogleSigninButton
            style={{width: 192, height: 48, marginBottom: 16}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={initGoogleSignIn}
            disabled={inProgress}
          />

          {isIOS && (
            <AppleButton
              buttonStyle={AppleButton.Style.WHITE_OUTLINE}
              buttonType={AppleButton.Type.SIGN_IN}
              style={{
                width: 160,
                height: 45,
              }}
              onPress={initAppleSignIn}
            />
          )}

          {error && <Text>{error.message}</Text>}

          <Text style={{alignSelf: 'flex-end'}}>{env.COMMIT_HASH}</Text>
        </Layout>
      </TopWeightedView>
    </ScreenContainer>
  )
}
