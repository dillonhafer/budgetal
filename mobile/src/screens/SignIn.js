import React, { Component } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

// API
import { SignInRequest } from 'api/sessions';
import { SetAuthenticationToken, SetCurrentUser } from 'utils/authentication';

// Helpers
import { error, notice } from 'notify';
import { navigateHome } from 'navigators';

// Components
import { PrimarySquareButton } from 'forms';
import colors from 'utils/colors';
import { validEmail } from 'utils/helpers';

import { FormCard, SplitBackground } from 'components/Card';

import { StoreReview } from 'expo';
import OnePassword from 'react-native-onepassword';
import onepasswordImage from 'images/onepassword.png';
import { Label } from 'components/Text';
const PASSWORD_DOMAIN = 'budgetal.com';

class SignInScreen extends Component {
  inputs = [];

  state = {
    email: '',
    password: '',
    loading: false,
    onepassword: false,
  };

  componentDidMount() {
    OnePassword.isSupported()
      .then(() => {
        this.setState({ onepassword: true });
      })
      .catch(() => {
        this.setState({ onepassword: false });
      });
  }

  validateFields = () => {
    const { email, password } = this.state;
    return email.length > 0 && validEmail(email) && password.length > 0;
  };

  signIn = async () => {
    const { email, password } = this.state;
    const resp = await SignInRequest({ email, password });
    if (resp && resp.ok) {
      SetAuthenticationToken(resp.token);
      this.props.updateCurrentUser(resp.user);
      SetCurrentUser(resp.user);
      navigateHome(this.props.navigation.dispatch);
      notice('You are now signed in!');
      setTimeout(StoreReview.requestReview, 2000);
    } else {
      this.setState({ loading: false });
    }
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.signIn();
      } else {
        error('Email/Password are invalid');
      }
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  focusEmail = () => {
    this.inputs['email'].focus();
  };

  focusPassword = () => {
    this.inputs['password'].focus();
  };

  navForgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
  };

  handleValueFromPasswordExtension = (field, value) => {
    this.setState({ [field]: value });
    this.inputs[field].setNativeProps({
      text: value,
    });
  };

  handleOnePassword = () => {
    OnePassword.findLogin(`https://${PASSWORD_DOMAIN}`)
      .then(credentials => {
        this.handleValueFromPasswordExtension('email', credentials.username);
        this.handleValueFromPasswordExtension('password', credentials.password);
      })
      .catch(() => {
        error('Could not get password from 1password');
      });
  };

  getEmailFromManager = email => {
    this.handleValueFromPasswordExtension('email', email);
  };

  getPasswordFromManager = password => {
    this.handleValueFromPasswordExtension('password', password);
  };

  render() {
    const { loading, onepassword } = this.state;
    const valid = this.validateFields();
    return (
      <SplitBackground top={colors.primary} bottom={'#fff'}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: 350 }}>
            <FormCard>
              <View style={{ marginTop: 10 }}>
                <Label style={styles.label}>EMAIL</Label>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    keyboardType="email-address"
                    style={styles.input}
                    autoCapitalize={'none'}
                    inputAccessoryViewID={'email'}
                    underlineColorAndroid={'transparent'}
                    autoCorrect={false}
                    ref={input => {
                      this.inputs['email'] = input;
                    }}
                    onSubmitEditing={this.focusPassword}
                    returnKeyType="next"
                    enablesReturnKeyAutomatically={true}
                    onChangeText={email => this.setState({ email })}
                  />
                  {onepassword && (
                    <TouchableOpacity onPress={this.handleOnePassword}>
                      <Image
                        source={onepasswordImage}
                        style={{
                          tintColor: colors.primary,
                          width: 33,
                          height: 33,
                          paddingHorizontal: 5,
                          marginLeft: 5,
                          marginBottom: 10,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <Label style={styles.label}>PASSWORD</Label>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    style={styles.input}
                    enablesReturnKeyAutomatically={true}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    inputAccessoryViewID={'password'}
                    underlineColorAndroid={'transparent'}
                    ref={input => {
                      this.inputs['password'] = input;
                    }}
                    returnKeyType="done"
                    onSubmitEditing={this.handleOnPress}
                    onChangeText={password => this.setState({ password })}
                  />
                </View>
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={this.navForgotPassword}
                >
                  <Label style={styles.forgotPasswordText}>
                    FORGOT PASSWORD
                  </Label>
                </TouchableOpacity>
              </View>
            </FormCard>
            <PrimarySquareButton
              onPress={this.handleOnPress}
              loading={!valid || loading}
              title="sign in"
            />
          </View>
        </View>
      </SplitBackground>
    );
  }
}

const styles = StyleSheet.create({
  forgotPasswordButton: {
    padding: 3,
  },
  forgotPasswordText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'right',
  },
  input: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 3,
    height: 40,
    backgroundColor: '#eee',
    paddingLeft: 10,
  },
  label: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 11,
    padding: 5,
  },
});

export default connect(
  null,
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(SignInScreen);
