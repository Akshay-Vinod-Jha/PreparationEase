import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "PreEase", headerShown: false }}
      />
      <Stack.Screen
        name="details"
        options={{ title: "About", headerShown: false }}
      />
    </Stack>
  );
}
