import BluetoothSerial from 'react-native-bluetooth-serial';
import {Text, TouchableOpacity} from 'react-native';
import {externalStyles} from './styles';
import {useModals} from '../../../context/ModalsContext';
import {useConnections} from '../../../../connections/context/ContectionsContext';
import {pairAndConnect} from '../utils/pairAndConnect';

const DeviceCard = ({data}) => {
  const {state, setValue} = useConnections();
  const {pairedDevices} = state;
  const {
    setShowSuccessModal,
    setShowLoadingModal,
    setShowAvailableDevicesModal,
  } = useModals();
  const {name, address, id} = data || {};

  const styles = externalStyles();

  const handlePress = async () => {
    setShowLoadingModal(true);

    const connected = pairedDevices.find(device => device.id === id)
      ? await BluetoothSerial.connect(id)
      : await pairAndConnect(id);

    setShowLoadingModal(false);

    if (connected) {
      setShowSuccessModal(true, {
        title: 'Successfully Connected',
        messages: [`Connected to ${name} device`],
      });

      setValue('isConnected', true);
      setShowAvailableDevicesModal(false);

      BluetoothSerial.write('Connected');

      const timeout = setTimeout(() => {
        setShowSuccessModal(false);
        clearTimeout(timeout);
      }, 1000);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={handlePress}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.address}>{address}</Text>
    </TouchableOpacity>
  );
};

export default DeviceCard;