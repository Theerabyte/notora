import { Tabs } from "expo-router"
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Entypo from '@expo/vector-icons/Entypo'
import { View } from "react-native"

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: { backgroundColor: "#ede8d0" },
                tabBarActiveTintColor: "#8a7566",
                tabBarInactiveTintColor: "#8a7566",
            }}
        >
            <Tabs.Screen
                name="time/index"
                options={{
                    title: "Stundenplan",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            {focused && (
                                <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: 56,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: '#49362C',
                                    zIndex: -1,
                                }}
                                />
                            )} 
                            <Entypo size={28} name="calendar" style={{ marginBottom: -3 }} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="note/index"
                options={{
                    title: "Notizen",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            {focused && (
                                <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: 56,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: '#49362C',
                                    zIndex: -1,
                                }}
                                />
                            )}
                            <MaterialIcons size={28} style={{ marginBottom: -3 }} name="note-add" color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="grade/index"
                options={{
                    title: "Noten",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            {focused && (
                                <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: 56,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: '#49362C',
                                    zIndex: -1,
                                }}
                                />
                            )}
                            <MaterialIcons size={28} style={{ marginBottom: -3 }} name="leaderboard" color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    )
}