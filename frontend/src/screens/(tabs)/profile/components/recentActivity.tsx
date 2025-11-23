import { Calendar } from "lucide-react-native";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

interface RecentActivityProps {
    id: number;
    activity: string;
    date: string;
    location: string;
}

const recentActivities: RecentActivityProps[] = [
    { id: 1, activity: "Caught a 20kg Salmon", date: "2024-06-10", location: "River Thames" },
    { id: 2, activity: "Participated in Fishing Competition", date: "2024-06-08", location: "Lake District" },
    { id: 3, activity: "Posted in Community", date: "2024-06-05", location: "Cornwall Coast" },
    { id: 4, activity: "Caught a 10kg Tuna", date: "2024-06-03", location: "Lake District" },
];

export default function RecentActivity() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recent Activity</Text>

            {recentActivities.length > 0 ? (
                recentActivities.slice(0, 3).map((item) => (
                    <View key={item.id} style={styles.activityRow}>
                        <View style={styles.iconWrapper}>
                            <Calendar size={20} color="#3B82F6" />
                        </View>

                        <View style={styles.textSection}>
                            <Text style={styles.activityText}>{item.activity}</Text>
                            <Text style={styles.subText}>
                                {item.location} • {item.date}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.noActivityText}>No recent activity to display.</Text>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom:8,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },

    activityRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 12,
        marginBottom: 12,
    },

    iconWrapper: {
        backgroundColor: "#E0F2FE",
        padding: 10,
        borderRadius: 8,
        marginRight: 12,
    },

    textSection: {
        flexShrink: 1,
    },

    activityText: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 2,
    },

    subText: {
        fontSize: 12,
        color: "#6B7280",
    },

    noActivityText: {
        fontSize: 14,
        color: "#6B7280",
    },
});