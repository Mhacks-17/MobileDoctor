import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

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
  const [apiResponse, setApiResponse] = useState<string | null>(null);

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
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access camera is required!");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      try {
        const uploadResult = await uploadImage(result.assets[0].uri);
        console.log("Upload result:", uploadResult);
        if (uploadResult && uploadResult.result) {
          setApiResponse(uploadResult.result);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        Alert.alert("Upload Failed", "There was an error uploading the image. Please try again.");
      }
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const formData = new FormData();
      const fileName = uri.split("/").pop() || "image.jpg";
      formData.append("file", blob, fileName);
  
      const axiosResponse = await axios.post("http://localhost:8000/upload-image/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Upload successful:", axiosResponse.data);
      return axiosResponse.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How Can We Assist You Today?</Text>
      <Text style={styles.tipText}>Choose an option to get started!</Text>

      {/* <Text style={styles.locationText}>
        {errorMsg
          ? errorMsg
          : location
          ? `Latitude: ${location.latitude}, Longitude: ${location.longitude}`
          : "Getting your location..."}
      </Text> */}

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {apiResponse && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>AI Analysis:</Text>
          <Text style={styles.responseText}>{apiResponse}</Text>
        </View>
      )}

      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={onAskQuestion}>
          <Text style={styles.optionText}>Ask a Question via Text</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={onUseVoice}>
          <Text style={styles.optionText}>Ask our AI Pharmacist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={handleAddPicture}>
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
  responseContainer: {
    backgroundColor: "#b2dfdb",
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    width: "90%",
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00695c",
    marginBottom: 10,
  },
  responseText: {
    fontSize: 16,
    color: "#004d40",
    lineHeight: 24,
  },
  optionContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  optionButton: {
    backgroundColor: "#00796b",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MainPage;