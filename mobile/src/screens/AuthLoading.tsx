import { colors } from "@shared/theme";
import { IsAuthenticated } from "@src/utils/authentication";
import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import styled from "styled-components/native";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { GetCurrentUser } from "./Drawer/__generated__/GetCurrentUser";

const CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      admin
      avatarUrl
      email
      firstName
      id
      lastName
    }
  }
`;

interface Props extends NavigationScreenConfigProps {
  updateCurrentUser(user: object): void;
}

const LoadingContainer = styled.View({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.primary,
});

const AuthLoadingScreen = ({ navigation }: Props) => {
  const { data, loading } = useQuery<GetCurrentUser>(CURRENT_USER);
  const user = data && data.currentUser ? data.currentUser : null;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      navigation.navigate("App");
    } else {
      navigation.navigate("SignIn");
    }
  }, [user, loading]);

  return (
    <LoadingContainer>
      <ActivityIndicator color="white" size="large" />
      <StatusBar barStyle="light-content" />
    </LoadingContainer>
  );
};

export default AuthLoadingScreen;
