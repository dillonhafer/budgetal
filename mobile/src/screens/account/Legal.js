import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, Text, StatusBar, View } from 'react-native';

// Helpers
import { BlurViewInsetProps } from '@src/utils/navigation-helpers';

// Components
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Device from '@src/utils/Device';
const isTablet = Device.isTablet();

const Project = ({ children }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
      }}
    >
      <MaterialCommunityIcons name="circle" size={10} color="#aaa" />
      <Text style={styles.project}>{children}</Text>
    </View>
  );
};

class LegalScreen extends PureComponent {
  static navigationOptions = {
    title: 'Legal',
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={{ width: '100%' }} {...BlurViewInsetProps}>
          <View style={styles.listContainer}>
            <Text style={styles.subText}>
              Budgetal uses third party open source software
            </Text>

            <Text style={styles.licenseTitle}>The MIT License(MIT)</Text>

            <Text style={styles.subText}>
              The following open source libraries are subject to the terms and
              conditions of The MIT License (MIT), included below.
            </Text>

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

            <View style={styles.licenseContainer}>
              <Text style={styles.license}>
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
              </Text>
            </View>

            <Text style={styles.licenseTitle}>BSD 3-clause license</Text>
            <Text style={styles.subText}>
              The following open source libraries are subject to the terms and
              conditions of The BSD 3-clause license, included below.
            </Text>

            <Project>
              React Navigation, Copyright (c) 2016-present, React Navigation
              Contributors
            </Project>

            <View style={styles.licenseContainer}>
              <Text style={styles.license}>
                Redistribution and use in source and binary forms, with or
                without modification, are permitted provided that the following
                conditions are met:
              </Text>

              <Text style={[styles.license, styles.number]}>
                1. Redistributions of source code must retain the above
                copyright notice, this list of conditions and the following
                disclaimer.
              </Text>
              <Text style={[styles.license, styles.number]}>
                2. Redistributions in binary form must reproduce the above
                copyright notice, this list of conditions and the following
                disclaimer in the documentation and/or other materials provided
                with the distribution.
              </Text>
              <Text style={[styles.license, styles.number]}>
                3. Neither the name of the copyright holder nor the names of its
                contributors may be used to endorse or promote products derived
                from this software without specific prior written permission.
              </Text>

              <Text style={styles.license}>
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
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: isTablet ? 'transparent' : '#fff',
  },
  listContainer: {
    padding: 10,
    margin: isTablet ? 20 : 0,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
  },
  licenseContainer: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    padding: 10,
    marginBottom: 20,
  },
  license: {
    fontFamily: 'Menlo',
    fontSize: 10,
  },
  number: {
    marginBottom: 10,
    marginTop: 10,
  },
  licenseTitle: {
    fontSize: 20,
    color: '#444',
    fontWeight: '700',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#555',
  },
  project: {
    padding: 8,
    fontSize: 14,
    color: '#555',
  },
});

export default LegalScreen;
