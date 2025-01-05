import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import FONTS, {COLORS, SIZES} from '../../constants/theme';
import CommunityModal from './../../Components/Modal/CommunityModal';
import BackArrow from '../../assets/images/Profile/arrow-right.svg';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToast} from 'react-native-toast-notifications';
import routes from '../../Routes/routes';

interface WiFiNetwork {
  id: string;
  name: string;
  password: string;
  dateAdded: string;
}

const WiFiConnection: React.FC = () => {
  const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedNetworks, setSavedNetworks] = useState<WiFiNetwork[]>([]);
  const [toggle, setToggle] = useState(false);

  const toast = useToast();
  const navigation: any = useNavigation();

  const handleAddWiFi = () => {
    if (wifiName && wifiPassword) {
      // Add new network to the list
      const newNetwork: WiFiNetwork = {
        id: Date.now().toString(),
        name: wifiName,
        password: wifiPassword,
        dateAdded: new Date().toLocaleDateString(),
      };

      setSavedNetworks(prevNetworks => [newNetwork, ...prevNetworks]);

      // Reset form
      setToggle(true);
      setWifiName('');
      setWifiPassword('');
    }
  };

  const handleSaveWiFi = async () => {
    try {
      await AsyncStorage.setItem('wifi', JSON.stringify(savedNetworks));
      toast.show('Wifi networks added successful', {
        type: 'success',
        placement: 'top',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving data', error);
    } finally {
      setShowSuccessModal(true);
    }
  };

  const renderNetworkItem = ({item}: {item: WiFiNetwork}) => (
    <View style={styles.networkItem}>
      <View style={styles.networkInfo}>
        <Text style={styles.networkName}>
          {item.name} • {item.password}
        </Text>
        <Text style={styles.networkDate}>Added on {item.dateAdded}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() =>
          setSavedNetworks(networks =>
            networks.filter(network => network.id !== item.id),
          )
        }>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <BackArrow width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WiFi Connection</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>WiFi Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your WiFi name"
            value={wifiName}
            onChangeText={setWifiName}
            placeholderTextColor={COLORS.textColor}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>WiFi Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            value={wifiPassword}
            onChangeText={setWifiPassword}
            placeholderTextColor={COLORS.textColor}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!wifiName || !wifiPassword) && styles.buttonDisabled,
          ]}
          onPress={handleAddWiFi}
          disabled={!wifiName || !wifiPassword}>
          <Text style={styles.buttonText}>Add WiFi</Text>
        </TouchableOpacity>
      </View>

      {/* Saved Networks Section */}
      {savedNetworks.length > 0 && (
        <View style={styles.savedNetworksContainer}>
          <Text style={styles.savedNetworksTitle}>Saved Networks</Text>
          <FlatList
            data={savedNetworks}
            renderItem={renderNetworkItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.networksList}
          />
        </View>
      )}
      <View style={styles.Addbtncontainer}>
        {toggle && (
          <TouchableOpacity
            style={[styles.button]}
            onPress={handleSaveWiFi}
            disabled={!toggle}>
            <Text style={styles.buttonText}>Save WiFi</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Success Modal */}
      <CommunityModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="WiFi Networks Added"
        description={`Successfully added to all networks`}
        buttonText="Done"
        onButtonPress={() => navigation.navigate(routes.SETUPBUSINESS)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  Addbtncontainer: {
    margin: SIZES.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgGray,
    paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
    marginTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
  },
  headerTitle: {
    marginLeft: SIZES.medium,
    fontSize: SIZES.large,
    fontFamily: FONTS.RADIO_CANADA_SEMIBOLD,
    color: COLORS.textTitle,
    textAlign: 'center',
    width: '80%',
  },
  form: {
    padding: SIZES.medium,
  },
  inputContainer: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: SIZES.font,
    fontFamily: FONTS.RADIO_CANADA_REGULAR,
    color: COLORS.textTitle,
    marginBottom: SIZES.base,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SIZES.medium,
    fontFamily: FONTS.RADIO_CANADA_REGULAR,
    color: COLORS.textTitle,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 55,
    padding: SIZES.medium,
    alignItems: 'center',
    marginTop: SIZES.extraLarge,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontFamily: FONTS.RADIO_CANADA_SEMIBOLD,
  },
  savedNetworksContainer: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
  },
  savedNetworksTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.RADIO_CANADA_SEMIBOLD,
    color: COLORS.textTitle,
    marginBottom: SIZES.medium,
  },
  networksList: {
    paddingBottom: SIZES.medium,
  },
  networkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SIZES.medium,
    marginBottom: SIZES.base,
  },
  networkInfo: {
    flex: 1,
  },
  networkName: {
    fontSize: SIZES.font,
    fontFamily: FONTS.RADIO_CANADA_SEMIBOLD,
    color: COLORS.textTitle,
    marginBottom: 4,
  },
  networkDate: {
    fontSize: SIZES.small,
    fontFamily: FONTS.RADIO_CANADA_REGULAR,
    color: COLORS.textColor,
  },
  removeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontFamily: FONTS.RADIO_CANADA_REGULAR,
  },
});

export default WiFiConnection;
