import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import * as Location from "expo-location";

const MainPage = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]); // State to hold nearby doctors
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Fetch nearby doctors when location is obtained
      if (loc.coords) {
        fetchNearbyDoctors(loc.coords.latitude, loc.coords.longitude);
      }
    })();
  }, []);

  const fetchNearbyDoctors = async (lat: number, lng: number) => {
    setLoading(true); // Set loading state to true
    try {
      const response = await fetch(
        `http://localhost:8000/api/nearby-doctors?lat=${lat}&lng=${lng}` // Replace with your IP
      );
      if (response.ok) {
        const data = await response.json();
        setDoctors(data); // Set the state with the results
      } else {
        const errorData = await response.json(); // Get more detailed error info
        setErrorMsg(`Failed to fetch nearby doctors: ${errorData.message}`);
      }
    } catch (error) {
      setErrorMsg("Error fetching nearby doctors: " + error.message);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Doctors</Text>
      {loading ? ( // Show loading indicator if fetching data
        <ActivityIndicator size="large" color="#00796b" />
      ) : errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        location && (
          <Text style={styles.locationText}>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
        )
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      {doctors.length > 0 ? (
  doctors.map((doctor) => (
    <View key={doctor.id || doctor.name} style={styles.doctorCard}> {/* Ensure this is unique */}
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorVicinity}>{doctor.vicinity}</Text>
      <Text style={styles.doctorDetails}>
        Specialization: {doctor.specialization || "N/A"}
      </Text>
      <Text style={styles.doctorDetails}>
        Phone: {doctor.phone || "N/A"}
      </Text>
    </View>
  ))
) : (
  <Text style={styles.noDoctorsText}>No nearby doctors found.</Text>
)}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006064",
    marginBottom: 20,
    textAlign: "center",
  },
  locationText: {
    fontSize: 16,
    color: "#00796b",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  doctorCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004d40",
  },
  doctorVicinity: {
    fontSize: 16,
    color: "#00796b",
    marginVertical: 5,
  },
  doctorDetails: {
    fontSize: 14,
    color: "#606060",
  },
  noDoctorsText: {
    fontSize: 16,
    color: "#00796b",
    textAlign: "center",
  },
});

export default MainPage;
