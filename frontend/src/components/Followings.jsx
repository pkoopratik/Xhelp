import { Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import SuggestedUser from './SuggestedUser';
import useShowToast from '../hooks/useShowToast';
import { useParams } from 'react-router-dom';

const Followings = () => {

  const [following, SetFollowing] = useState([]);
  const showToast = useShowToast();
  const { username } = useParams();

  useEffect(() => {
    const getFollowing = async () => {

      try {
        const res = await fetch(`/api/users/${username}/following`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error")
          return;
        }
        SetFollowing(data);
      } catch (error) {
        showToast("Error", error.message, "error")
      }
    }
    getFollowing();

  }, [showToast]);
  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Following
      </Text>

      <Flex direction={"column"} gap={4}>
        {following.map((user) => <SuggestedUser key={user._id} user={user} />)}
      </Flex>
    </>
  )
}

export default Followings