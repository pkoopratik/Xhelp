import { Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import SuggestedUser from './SuggestedUser';
import useShowToast from '../hooks/useShowToast';
import { useParams } from 'react-router-dom';

const Followers = () => {

  const [followers, SetFollowers] = useState([]);
  const showToast = useShowToast();
  const { username } = useParams();

  useEffect(() => {
    const getFollowers = async () => {

      try {
        const res = await fetch(`/api/users/${username}/followers`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        SetFollowers(data);

      } catch (error) {
        showToast("Error", error.message, "error");
      }
    }
    getFollowers();

  }, [showToast]);

  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Followers
      </Text>

      <Flex direction={"column"} gap={4}>
        {followers.map((user) => <SuggestedUser key={user._id} user={user} />)}
      </Flex>
    </>
  )
}

export default Followers