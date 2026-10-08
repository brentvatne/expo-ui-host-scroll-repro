import { Stack } from 'expo-router';

// No header background options: the defaults for a large-title screen.
export default function Layout() {
  return <Stack screenOptions={{ title: 'Large title', headerLargeTitle: true }} />;
}
