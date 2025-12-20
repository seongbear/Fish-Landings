import React from "react";
import { View, Text } from "react-native";

export const NoData = () => (
  <View style={{height: 150, justifyContent:'center', alignItems:'center'}}>
    <Text style={{color:'#94A3B8'}}>No data available for selection</Text>
  </View>
);

