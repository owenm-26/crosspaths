import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../(screens)/HomeScreen';
import FriendMakingScreen from '../(screens)/FriendMakingScreen';
import InboxScreen from '../(screens)/InboxScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="FriendMaking" component={FriendMakingScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
    </Tab.Navigator>
  );
}
