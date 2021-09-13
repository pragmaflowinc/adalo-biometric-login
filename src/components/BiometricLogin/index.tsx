import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Platform } from 'react-native'
import { BiometricLoginProps } from './generated'
import Keychain from 'react-native-keychain'
import { Button } from '@protonapp/react-native-material-ui';

const BiometricLogin = ({  
	styles: { title: titleStyles },
  title = "",
  icon,
  backgroundColor,
	...props}: BiometricLoginProps) => {
	const [disabled, setDisabled] = useState(false)
	const [enrollmentCompleted, setEnrollmentCompleted] = useState(false)
	const { username, password, validCredentials, onCredentialRetriveSuccess, onCredentialRetriveFailed, onEnrollmentSuccess, onEnrollmentFailure } = props

	useEffect(() => {                     
		if (validCredentials === 'true' && password && username && !disabled && !enrollmentCompleted) {
			Keychain.setGenericPassword(username, password, {
				accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY, 
				accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED, 
				authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS })
			.then(result => {
				if (onEnrollmentSuccess) {
					onEnrollmentSuccess()
					setEnrollmentCompleted(true)
				}
			}).catch(error => {
				if (onEnrollmentFailure) {
					onEnrollmentFailure()
					setEnrollmentCompleted(true)
				}
			})
		} else {
			if (disabled) {
				if (onEnrollmentFailure) {
					onEnrollmentFailure()
				}
			}
		}
	}, [enrollmentCompleted, username, password, validCredentials, disabled])

	useEffect(() => {
		if (Platform.OS !== 'web') {
			Keychain.getSupportedBiometryType()
			.then(biometryType => {
				if (!!biometryType) setDisabled(false)
				else setDisabled(true)
			})
		}
  }, [])

	return(
		<View style={styles.wrapper}>
			<Button icon={icon}
      text={title} 
      style={{
        container: {
          backgroundColor: backgroundColor,
					alignSelf: 'stretch'
        },
        text: {
          color: titleStyles.color,
          fontFamily: titleStyles.fontFamily,
          fontSize: titleStyles.fontSize,
          fontWeight: titleStyles.fontWeight
        }
      }} 
			disabled={disabled} 
			onPress={() => {
				Keychain.getGenericPassword({
	  			accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
				}).then(credentials => {
					if (credentials) {
						const { username, password } = credentials
						if (onCredentialRetriveSuccess) {
							onCredentialRetriveSuccess(username, password)
						}
					}
				}).catch(error => {
					if (onCredentialRetriveFailed) {
						if (error.message) {
							onCredentialRetriveFailed(error.message)
						}
					}
				})
			}} />
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'stretch'
	}
})

export default BiometricLogin
