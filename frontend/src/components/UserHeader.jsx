import { VStack, Box, Flex, Text } from '@chakra-ui/layout';
import { Avatar } from '@chakra-ui/avatar';
import { Link as RouterLink } from 'react-router-dom';
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuItem, MenuList, useToast, Portal, Button } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link } from 'react-router-dom';
import useFollowUnfollow from '../hooks/useFollowUnfollow';
import useShowToast from '../hooks/useShowToast';

const UserHeader = ({ user }) => {
    const toast = useToast();
    //user logged in
    const currentUser = useRecoilValue(userAtom);
    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
    const followersUrl = `/${user.username}/followers`;
    const followingUrl = `/${user.username}/following`

    const copyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            toast({
                title: "Success.",
                status: "success",
                description: "Profile link copied.",
                duration: 3000,
                isClosable: true,
            });
        })
    }

    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
                        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                            Xhelp.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    {user.profilePic && (
                        <Avatar
                            name={user.name}
                            src={user.profilePic}
                            size={{
                                base: "md",
                                md: "xl",
                            }}
                        />
                    )}
                    {!user.profilePic && (
                        <Avatar
                            name={user.name}
                            src='https://bit.ly/broken-link'
                            size={{
                                base: "md",
                                md: "xl",
                            }}
                        />
                    )}

                </Box>

            </Flex>
            <Text>{user.bio}</Text>

            {currentUser?._id === user._id && (
                <Link as={RouterLink} to="/update">
                    <Button size={"sm"}>Update Profile</Button>
                </Link>
            )}
            {currentUser?._id !== user._id && (
                <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>{following ? "Unfollow" : "Follow"}</Button>
            )}

            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Link as={RouterLink} to={followersUrl}  >
                        <Text color={"gray.light"}> {user.followers.length} followers</Text>
                    </Link>
                    <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link as={RouterLink} to={followingUrl}  >
                        <Text color={"gray.light"}> {user.following.length} following</Text>
                    </Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    <Box className='icon-container'>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={""}>
                                    <MenuItem bg={"gray.dark"} onClick={copyUrl} >
                                        Copy link
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>

            </Flex>

            <Flex w={"full"}>
                <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Posts</Text>

                </Flex>
                <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} pb="3" cursor={"pointer"} color={"gray.light"}>
                    <Text fontWeight={"bold"}></Text>

                </Flex>

            </Flex>
        </VStack>
    )

}

export default UserHeader;

