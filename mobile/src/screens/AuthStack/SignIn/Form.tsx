import { SignInRequest } from "@shared/api/sessions";
import { validEmail } from "@shared/helpers";
import { colors } from "@shared/theme";
import { FormCard } from "@src/components/Card";
import { Label } from "@src/components/Text";
import { focus, PrimarySquareButton } from "@src/forms";
import { error, notice } from "@src/notify";
import {
  SetAuthenticationToken,
  SetCurrentUser,
} from "@src/utils/authentication";
import Constants from "expo-constants";
import React, { useRef, useState } from "react";
import styled from "styled-components/native";

const deviceName = Constants.deviceName;

const ForgotPasswordButton = styled.TouchableOpacity({
  padding: 3,
});

const InputRow = styled.View({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const ForgotPasswordText = styled(Label)({
  fontSize: 10,
  color: colors.primary,
  fontWeight: 700,
  textAlign: "right",
});

const Input = styled.TextInput.attrs({
  underlineColorAndroid: "transparent",
  autoCapitalize: "none",
  enablesReturnKeyAutomatically: true,
})({
  flex: 1,
  marginBottom: 10,
  borderRadius: 3,
  height: 40,
  backgroundColor: "#eee",
  paddingLeft: 10,
});

const InputLabel = styled(Label)({
  color: "#aaa",
  fontWeight: "bold",
  fontSize: 11,
  padding: 5,
});

const Container = styled.View({
  width: "100%",
  maxWidth: 350,
  paddingTop: 10,
});

interface Props {
  forgotPassword(): void;
  afterSignIn(): void;
}

const Form = ({ forgotPassword, afterSignIn }: Props) => {
  const passwordField = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = email.length > 0 && validEmail(email) && password.length > 0;

  const submit = () => {
    if (valid) {
      setLoading(true);
      SignInRequest({ email, password, deviceName })
        .then(resp => {
          if (resp.ok) {
            SetAuthenticationToken(resp.token);
            SetCurrentUser(resp.user);
            notice("You are now signed in!");
            afterSignIn();
          } else {
            setLoading(false);
            error("Email/Password are invalid");
          }
        })
        .catch(() => {
          error("Email/Password are invalid");
          setLoading(false);
        });
    }
  };

  return (
    <Container>
      <FormCard>
        <InputLabel>EMAIL</InputLabel>
        <InputRow>
          <Input
            autoCorrect={false}
            inputAccessoryViewID={"email"}
            keyboardType="email-address"
            onChangeText={setEmail}
            onSubmitEditing={() => focus(passwordField)}
            returnKeyType="next"
          />
        </InputRow>
        <InputLabel>PASSWORD</InputLabel>
        <InputRow>
          <Input
            inputAccessoryViewID={"password"}
            onChangeText={setPassword}
            onSubmitEditing={submit}
            ref={passwordField}
            returnKeyType="done"
            secureTextEntry={true}
          />
        </InputRow>
        <ForgotPasswordButton onPress={forgotPassword}>
          <ForgotPasswordText>FORGOT PASSWORD</ForgotPasswordText>
        </ForgotPasswordButton>
      </FormCard>
      <PrimarySquareButton
        onPress={submit}
        loading={loading}
        disabled={!valid || loading}
        title="sign in"
      />
    </Container>
  );
};

export default Form;
