import React from "react";
import { View, Text, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import LocalConfig from "./LocalConfig";

export default function CartScreenLoading() {
  return (
    <SkeletonPlaceholder
      backgroundColor={LocalConfig.COLOR.BLACK}
      highlightColor={LocalConfig.COLOR.BLACK_LIGHT}>
      <SkeletonPlaceholder.Item
        width={'90%'}
        height={40}
        marginLeft={'5%'}
        marginTop={12}
        borderRadius={4}
      />
      <SkeletonPlaceholder.Item
        width={'90%'}
        height={40}
        marginLeft={'5%'}
        marginTop={10}
        borderRadius={4}
      />
      <SkeletonPlaceholder.Item
        width={'90%'}
        height={40}
        marginLeft={'5%'}
        marginTop={10}
        borderRadius={4}
      />
      <SkeletonPlaceholder.Item
        width={'90%'}
        height={40}
        marginLeft={'5%'}
        marginTop={10}
        borderRadius={4}
      />
      <SkeletonPlaceholder.Item
        width={'90%'}
        height={40}
        marginLeft={'5%'}
        marginTop={10}
        borderRadius={4}
      />
      <SkeletonPlaceholder.Item
        width={'90%'}
        height={150}
        marginLeft={'5%'}
        marginTop={12}
        borderRadius={4}
      />

      <SkeletonPlaceholder.Item
        width={'90%'}
        height={60}
        marginLeft={'5%'}
        marginTop={12}
        borderRadius={4}
      />
      <SkeletonPlaceholder.Item
        width={'90%'}
        height={90}
        marginLeft={'5%'}
        marginTop={12}
        borderRadius={4}
      />
      <SkeletonPlaceholder.Item
        width={'90%'}
        height={60}
        marginLeft={'5%'}
        marginTop={12}
        borderRadius={4}
      />
    </SkeletonPlaceholder>
  );
}
