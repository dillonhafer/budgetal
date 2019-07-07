// Components
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HeaderText } from "@src/components/Text";
import React from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components/native";

const ProjectContainer = styled.View({
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  paddingLeft: 10,
});

const ProjectText = styled.Text({
  padding: 8,
  fontSize: 14,
  color: "#555",
});

const SubText = styled.Text({
  fontSize: 14,
  color: "#555",
});

const ListContainer = styled.View({
  padding: 10,
  backgroundColor: "#fff",
});

const LicenseTitle = styled.Text({
  fontSize: 20,
  color: "#444",
  fontWeight: 700,
  marginBottom: 10,
});

const LicenseContainer = styled.View({
  backgroundColor: "#ccc",
  borderRadius: 5,
  overflow: "hidden",
  padding: 10,
  marginBottom: 20,
});

const License = styled.Text({
  fontFamily: "Menlo",
  fontSize: 10,
});

const Number = styled.Text({
  fontFamily: "Menlo",
  fontSize: 10,
  marginBottom: 10,
  marginTop: 10,
});

const Container = styled(SafeAreaView)({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "#f9f9f9",
});

const HeaderContainer = styled.View({
  flexDirection: "row",
  borderColor: "#a7a7aa",
  borderBottomWidth: StyleSheet.hairlineWidth,
  justifyContent: "space-between",
  alignItems: "center",
  height: 44,
});

const Project = React.memo(({ children }: { children: string }) => {
  return (
    <ProjectContainer>
      <MaterialCommunityIcons name="circle" size={10} color="#aaa" />
      <ProjectText>{children}</ProjectText>
    </ProjectContainer>
  );
});

interface Props {
  visible: boolean;
  onClose(): void;
}

const LegalModal = ({ visible, onClose }: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={() => {}}
    >
      <Container>
        <HeaderContainer>
          <TouchableOpacity
            style={{ width: "20%", alignItems: "center" }}
            onPress={onClose}
          >
            <Text
              style={{
                padding: 8,
                paddingTop: 2,
                paddingLeft: 7,
                color: "#037aff",
                fontSize: 18,
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
          <View>
            <HeaderText style={{ fontWeight: "700", fontSize: 17 }}>
              LEGAL
            </HeaderText>
          </View>
          <View style={{ width: "20%" }} />
        </HeaderContainer>
        <ScrollView style={{ backgroundColor: "#fff", width: "100%" }}>
          <ListContainer>
            <SubText>Budgetal uses third party open source software</SubText>

            <LicenseTitle>The MIT License(MIT)</LicenseTitle>

            <SubText>
              The following open source libraries are subject to the terms and
              conditions of The MIT License (MIT), included below.
            </SubText>

            <Project>React, Copyright (c) 2013-present, Facebook, Inc.</Project>
            <Project>
              React Native, Copyright (c) 2015-present, Facebook, Inc.
            </Project>
            <Project>
              React Redux, Copyright (c) 2015-present Dan Abramov
            </Project>
            <Project>Redux, Copyright (c) 2015-present Dan Abramov</Project>
            <Project>
              React Native Keyboard Aware ScrollView, Copyright (c) 2015 APSL
            </Project>
            <Project>
              React Native Swipeout, Copyright (c) 2015 Dan Cormier
            </Project>
            <Project>
              React Native Modalbox, Copyright (c) 2016 Maxime Mezrahi
            </Project>
            <Project>
              React Native Dropdownalert, Copyright (c) 2016 - 2017
              testshallpass
            </Project>

            <Project>UA parser js, Copyright © 2012-2016 Faisal Salman</Project>

            <LicenseContainer>
              <License>
                The MIT License (MIT) http://opensource.org/licenses/MIT/
                Copyright (c) Permission is hereby granted, free of charge, to
                any person obtaining a copy of this software and associated
                documentation files (the "Software"), to deal in the Software
                without restriction, including without limitation the rights to
                use, copy, modify, merge, publish, distribute, sublicense,
                and/or sell copies of the Software, and to permit persons to
                whom the Software is furnished to do so, subject to the
                following conditions: The above copyright notice and this
                permission notice shall be included in all copies or substantial
                portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
                WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
                NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
                OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
              </License>
            </LicenseContainer>

            <LicenseTitle>BSD 3-clause license</LicenseTitle>
            <SubText>
              The following open source libraries are subject to the terms and
              conditions of The BSD 3-clause license, included below.
            </SubText>

            <Project>
              React Navigation, Copyright (c) 2016-present, React Navigation
              Contributors
            </Project>

            <Project>
              React Native Snap Carousel, Copyright (c) 2017, Archriss
            </Project>

            <LicenseContainer>
              <License>
                Redistribution and use in source and binary forms, with or
                without modification, are permitted provided that the following
                conditions are met:
              </License>

              <Number>
                1. Redistributions of source code must retain the above
                copyright notice, this list of conditions and the following
                disclaimer.
              </Number>
              <Number>
                2. Redistributions in binary form must reproduce the above
                copyright notice, this list of conditions and the following
                disclaimer in the documentation and/or other materials provided
                with the distribution.
              </Number>
              <Number>
                3. Neither the name of the copyright holder nor the names of its
                contributors may be used to endorse or promote products derived
                from this software without specific prior written permission.
              </Number>

              <License>
                THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
                CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
                INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
                MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
                DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
                CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
                SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
                LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
                USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
                AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
                LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
                IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
                THE POSSIBILITY OF SUCH DAMAGE.
              </License>
            </LicenseContainer>

            <LicenseContainer>
              <Number>
                PREAMBLE The goals of the Open Font License (OFL) are to
                stimulate worldwide development of collaborative font projects,
                to support the font creation efforts of academic and linguistic
                communities, and to provide a free and open framework in which
                fonts may be shared and improved in partnership with others.
              </Number>

              <Number>
                The OFL allows the licensed fonts to be used, studied, modified
                and redistributed freely as long as they are not sold by
                themselves. The fonts, including any derivative works, can be
                bundled, embedded, redistributed and/or sold with any software
                provided that any reserved names are not used by derivative
                works. The fonts and derivatives, however, cannot be released
                under any other type of license. The requirement for fonts to
                remain under this license does not apply to any document created
                using the fonts or their derivatives.
              </Number>

              <Number>
                DEFINITIONS "Font Software" refers to the set of files released
                by the Copyright Holder(s) under this license and clearly marked
                as such. This may include source files, build scripts and
                documentation.
              </Number>

              <Number>
                "Reserved Font Name" refers to any names specified as such after
                the copyright statement(s).
              </Number>

              <Number>
                "Original Version" refers to the collection of Font Software
                components as distributed by the Copyright Holder(s).
              </Number>

              <Number>
                "Modified Version" refers to any derivative made by adding to,
                deleting, or substituting -- in part or in whole -- any of the
                components of the Original Version, by changing formats or by
                porting the Font Software to a new environment.
              </Number>

              <Number>
                "Author" refers to any designer, engineer, programmer, technical
                writer or other person who contributed to the Font Software.
              </Number>

              <Number>
                PERMISSION & CONDITIONS Permission is hereby granted, free of
                charge, to any person obtaining a copy of the Font Software, to
                use, study, copy, merge, embed, modify, redistribute, and sell
                modified and unmodified copies of the Font Software, subject to
                the following conditions:
              </Number>

              <Number>
                1) Neither the Font Software nor any of its individual
                components, in Original or Modified Versions, may be sold by
                itself.
              </Number>
              <Number>
                2) Original or Modified Versions of the Font Software may be
                bundled, redistributed and/or sold with any software, provided
                that each copy contains the above copyright notice and this
                license. These can be included either as stand-alone text files,
                human-readable headers or in the appropriate machine-readable
                metadata fields within text or binary files as long as those
                fields can be easily viewed by the user.
              </Number>
              <Number>
                3) No Modified Version of the Font Software may use the Reserved
                Font Name(s) unless explicit written permission is granted by
                the corresponding Copyright Holder. This restriction only
                applies to the primary font name as presented to the users.
              </Number>

              <Number>
                4) The name(s) of the Copyright Holder(s) or the Author(s) of
                the Font Software shall not be used to promote, endorse or
                advertise any Modified Version, except to acknowledge the
                contribution(s) of the Copyright Holder(s) and the Author(s) or
                with their explicit written permission.
              </Number>

              <Number>
                5) The Font Software, modified or unmodified, in part or in
                whole, must be distributed entirely under this license, and must
                not be distributed under any other license. The requirement for
                fonts to remain under this license does not apply to any
                document created using the Font Software.
              </Number>

              <Number>
                TERMINATION This license becomes null and void if any of the
                above conditions are not met.
              </Number>

              <Number>
                DISCLAIMER THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT
                WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT,
                TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE COPYRIGHT
                HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR
                CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE
                FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.
              </Number>
            </LicenseContainer>
          </ListContainer>
        </ScrollView>
      </Container>
    </Modal>
  );
};

const shouldSkipUpdate = (prev: Props, next: Props) =>
  prev.visible === next.visible;

export default React.memo(LegalModal, shouldSkipUpdate);
