
import { NavigationContainer } from "@react-navigation/native";
import  MyTabs  from './src/routes/MyTabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
   <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="Tabs" component={MyTabs}/>
    </Stack.Navigator>
   </NavigationContainer>
  );
}


