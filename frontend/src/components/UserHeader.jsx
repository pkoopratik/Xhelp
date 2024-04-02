import { VStack,Box, Flex,Text } from '@chakra-ui/layout';
import { Avatar } from '@chakra-ui/avatar';
import { Link } from 'react-router-dom';
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import {Menu, MenuButton, MenuItem, MenuList,useToast, Portal } from '@chakra-ui/react';




const UserHeader = () => {
    const toast = useToast();

    const copyUrl=()=>{
        const currentUrl=window.location.href;
        navigator.clipboard.writeText(currentUrl).then(()=>{
           // console.log("url copeied");
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
                <Text fontSize={"2xl"} fontWeight={"bold"}>mark anthony</Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>mark nathony</Text>
                    <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                        threds.net
                        </Text>
                </Flex>
            </Box>
            <Box>
                <Avatar
                name='mark atony'
                src='/zuck-avatar.png'
                size={{
                    base:"md",
                    md:"xl"

                }}/>
            </Box>

        </Flex>



        <Text> co foundar vlls Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, accusantium.</Text>
        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>

                <Text color={"gray.light"}> 3.3 folers</Text>
                <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"gray.light"}>instgram.com</Link>
            </Flex>
            <Flex>
                <Box className='icon-container'>
                    <BsInstagram size={24} cursor={"pointer"}/>
                </Box>
                <Box className='icon-container'>
                    <Menu>
                        <MenuButton>
                        <CgMoreO size={24} cursor={"pointer"}/>
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
                <Text fontWeight={"bold"}>Threads</Text>

            </Flex>
            <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} pb="3" cursor={"pointer"} color={"gray.light"}>
                <Text fontWeight={"bold"}>Replies</Text>

            </Flex>

        </Flex>
     </VStack>
  )

}

export default UserHeader;

