import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "expo-router";

import MainPage from './(tabs)/MainPage';

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onGetStarted,
}) => {
  const featureAnim1 = useRef(new Animated.Value(0)).current;
  const featureAnim2 = useRef(new Animated.Value(0)).current;
  const featureAnim3 = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;

  // Navigation hook
  const navigation = useNavigation();

  useEffect(() => {
    Animated.stagger(300, [
      Animated.timing(featureAnim1, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(featureAnim2, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(featureAnim3, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [featureAnim1, featureAnim2, featureAnim3]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [buttonAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("./(tabs)/stethescope.png")} style={styles.logo} />
      </View>
      <Text style={styles.title}>Welcome to Doc On Call</Text>
      <Text style={styles.subtitle}>Your Pocket Health Assistant</Text>

      <View style={styles.featuresContainer}>
        <Animated.View
          style={[
            styles.featureItem,
            {
              opacity: featureAnim1,
              transform: [
                {
                  translateY: featureAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>
            Check your symptoms with text or a picture
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.featureItem,
            {
              opacity: featureAnim2,
              transform: [
                {
                  translateY: featureAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Find local doctors near you</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.featureItem,
            {
              opacity: featureAnim3,
              transform: [
                {
                  translateY: featureAnim3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Interact with our AI pharmacist</Text>
        </Animated.View>
      </View>

      <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate("MainPage")}
        >
          <Text style={styles.buttonText}>  Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
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
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#006064",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#00796b",
    marginBottom: 30,
    textAlign: "center",
  },
  featuresContainer: {
    alignSelf: "stretch",
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureBullet: {
    fontSize: 24,
    color: "#004d40",
    marginRight: 10,
  },
  featureText: {
    fontSize: 18,
    color: "#004d40",
  },
  getStartedButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00796b",
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 9,
  },
  voiceIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
});

export default OnboardingScreen;