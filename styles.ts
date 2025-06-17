import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 56,
    backgroundColor: "#64259A",
    position: "absolute",
    bottom: 35,
    left: 24,
    right: 24,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
