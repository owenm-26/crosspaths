import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { LOCATION_TASK } from "../tasks/location-task";
import { Platform, Alert } from "react-native";

export default function RootLayout() {

  useEffect(() => {
    (async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== "granted") {
        Alert.alert("Permission required", "Allow foreground location");
        return;
      }

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== "granted") {
        Alert.alert("Permission required", "Allow background location");
        return;
      }

      if (Platform.OS === "web") return;

      const tasks = await TaskManager.getRegisteredTasksAsync();
      const isStarted = tasks.some(t => t.taskName === LOCATION_TASK);

      if (!isStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
          accuracy: Location.Accuracy.Lowest,
          timeInterval: 15 * 60 * 1000, // 15 min
          deferredUpdatesInterval: 15 * 60 * 1000,
          pausesUpdatesAutomatically: false,
          showsBackgroundLocationIndicator: false,
        });
      }
    })();
  }, []);

  return <Stack />;
}


// import { Stack } from "expo-router";
// import { useEffect, useState } from "react";
// import * as Location from "expo-location";
// import * as TaskManager from "expo-task-manager";
// import { LOCATION_TASK } from "../tasks/location-task";
// import { Platform, Alert } from "react-native";

// interface Coordinates{
//   latitude: number
//   longitude: number
// }


// export default function RootLayout() {
//   const [locationServicesEnabled, setLocationServicesEnabled] = useState(false)
//   const [coordinates, setCoordinates] = useState<Coordinates>();
//   useEffect(()=>{
//    checkIfLocationEnabled();
//    getCurrentLocation();
//   },[])

//   useEffect( ()=>{

  
//   },[coordinates])
//   const checkIfLocationEnabled= async ()=>{
//     let enabled = await Location.hasServicesEnabledAsync();       
//     if(!enabled){                     //if not enable 
//       Alert.alert('Location not enabled', 'Please enable your Location', [
//         {
//           text: 'Cancel',
//           onPress: () => console.log('Cancel Pressed'),
//           style: 'cancel',
//         },
//         {text: 'OK', onPress: () => console.log('OK Pressed')},
//       ]);
//     }else{
//       setLocationServicesEnabled(enabled)         //store true into state
//     }
//   }
//   const getCurrentLocation= async ()=>{
//        let {status} = await Location.requestForegroundPermissionsAsync();  //used for the pop up box where we give permission to use location 
//       console.log(`Foreground Permission Status: ${status}`);
//        if(status !== 'granted'){
//         Alert.alert('Permission denied', 'Allow the app to use the location services', [
//           {
//             text: 'Cancel',
//             onPress: () => console.log('Cancel Pressed'),
//             style: 'cancel',
//           },
//           {text: 'OK', onPress: () => console.log('OK Pressed')},
//         ]);
//        }

//          //get current position lat and long
//        const {coords} = await Location.getCurrentPositionAsync();  
       
//        if(coords){
//         const {latitude,longitude} =coords;
//         console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
//         setCoordinates(coords)
//            }
//   }

//   // useEffect(() => {
//   //   (async () => {
//   //     // Request foreground permission
//   //     const { status } = await Location.requestForegroundPermissionsAsync();
//   //     if (status !== "granted") return;

//   //     // Request background permission
//   //     const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
//   //     if (bgStatus !== "granted") return;

//   //     if (Platform.OS == "web") {console.log("Location Doesn't Work on Web"); return;}
//   //     // Check if the background task is already registered
//   //     const tasks = await TaskManager.getRegisteredTasksAsync();
//   //     const isTaskStarted = tasks.some(task => task.taskName === LOCATION_TASK);

//   //     if (!isTaskStarted) {
//   //       await Location.startLocationUpdatesAsync(LOCATION_TASK, {
//   //         accuracy: Location.Accuracy.Lowest,
//   //         timeInterval: 15 * 60 * 1000, // 15 minutes
//   //         deferredUpdatesInterval: 15 * 60 * 1000,
//   //         showsBackgroundLocationIndicator: false,
//   //       });
//   //     }
//   //   })();
//   // }, []);
//   return <Stack />;
// }
