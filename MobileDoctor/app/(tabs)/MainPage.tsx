import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

interface MainPageProps {
  onAskQuestion: () => void;
  onUseVoice: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onAskQuestion, onUseVoice }) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const handleAddPicture = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How Can We Assist You Today?</Text>
      <Text style={styles.tipText}>Choose an option to get started!</Text>

      {/* Display Location */}
      <Text style={styles.locationText}>
        {errorMsg
          ? errorMsg
          : location
          ? `Latitude: ${location.latitude}, Longitude: ${location.longitude}`
          : "Getting your location..."}
      </Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={onAskQuestion}>
          <Image
            source={require("./questions.png")}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Ask a Question via text</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={onUseVoice}>
          <Image source={require("./mic.png")} style={styles.optionIcon} />
          <Text style={styles.optionText}>Ask a Question via voice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleAddPicture}
        >
          <Image source={require("./pic.png")} style={styles.optionIcon} />
          <Text style={styles.optionText}>Take a Picture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006064",
    marginBottom: 30,
    textAlign: "center",
  },
  tipText: {
    fontSize: 16,
    color: "#004d40",
    marginBottom: 20,
    textAlign: "center",
  },
  locationText: {
    fontSize: 16,
    color: "#00796b",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
  optionContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00796b",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  optionIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
  },
});

export default MainPage;
