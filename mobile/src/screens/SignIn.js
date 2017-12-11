import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  StatusBar,
  View,
  KeyboardAvoidingView,
} from 'react-native';

// API
import { SignInRequest } from 'api/sessions';
import { SetAuthenticationToken, SetCurrentUser } from 'utils/authentication';

// Helpers
import { error, notice } from 'notify';
import { navigateHome } from 'navigators';

// Components
import { PrimaryButton, FieldContainer } from 'forms';

class SignInScreen extends Component {
  inputs = [];

  state = {
    email: '',
    password: '',
    loading: false,
  };

  validateFields = () => {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 0;
  };

  signIn = async () => {
    const { email, password } = this.state;
    const resp = await SignInRequest({ email, password });
    if (resp && resp.ok) {
      SetAuthenticationToken(resp.token);
      SetCurrentUser(resp.user);
      navigateHome(this.props.navigation.dispatch);
      notice('You are now signed in!');
    }
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        this.signIn();
      } else {
        error('Email/Password are invalid');
      }
    } catch (err) {
      // console.log(err)
    } finally {
      this.setState({ loading: false });
    }
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  render() {
    const { email, password, loading } = this.state;
    return (
      <KeyboardAvoidingView
        behvaior="padding"
        keyboardVerticalOffset={60}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" />
        <Text style={{ fontSize: 16, margin: 10, color: '#999' }}>
          Welcome back!
        </Text>
        <FieldContainer>
          <TextInput
            keyboardType="email-address"
            style={{ height: 50 }}
            placeholder="Email"
            autoCapitalize={'none'}
            autoCorrect={false}
            ref={input => {
              this.inputs['email'] = input;
            }}
            onSubmitEditing={_ => {
              this.focusNextField('password');
            }}
            returnKeyType="next"
            enablesReturnKeyAutomatically={true}
            onChangeText={email => this.setState({ email })}
          />
        </FieldContainer>
        <FieldContainer>
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            secureTextEntry={true}
            ref={input => {
              this.inputs['password'] = input;
            }}
            placeholder="Password"
            returnKeyType="done"
            onSubmitEditing={this.handleOnPress}
            onChangeText={password => this.setState({ password })}
          />
        </FieldContainer>
        <PrimaryButton
          title="Sign In"
          onPress={this.handleOnPress}
          loading={loading}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default SignInScreen;
