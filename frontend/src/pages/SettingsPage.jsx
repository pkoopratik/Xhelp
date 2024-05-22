import { Box, Button, Divider, Flex, Text, useColorMode } from '@chakra-ui/react';
import { Switch, FormControl, FormLabel } from '@chakra-ui/react';
import React, { useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import useLogout from '../hooks/useLogout';

const SettingsPage = () => {
    const showToast = useShowToast();
    const logout = useLogout();
    const { colorMode, toggleColorMode } = useColorMode();
    const [isChecked, setIsChecked] = useState(colorMode == "dark" ? true : false);

    const handleChange = () => {
        setIsChecked(!isChecked);
        toggleColorMode();
    };

    const freezeAccount = async () => {
        if (!window.confirm("Are you sure you want to freeze your account?")) return;

        try {
            const res = await fetch("/api/users/freeze", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.error) {
                return showToast("Error", data.error, "error");
            }
            if (data.success) {
                await logout();
                showToast("Success", "Your account has been frozen", "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }

    }
    return (
        <>
            <Flex justifyContent={"space-between"} >
                <Box>
                    <Text my={1} fontWeight={"bold"}>
                        Dark mode
                    </Text>
                </Box>

                <Box>
                    <FormControl>
                        <FormLabel htmlFor="toggle-switch" mb="0">
                            {colorMode == "dark" ? 'On' : 'Off'}
                        </FormLabel>
                        <Switch id="toggle-switch" isChecked={colorMode == "dark" ? true : false} onChange={handleChange} onClick={toggleColorMode} />
                    </FormControl>
                </Box>
            </Flex>
            <Divider my={4} />

            <Text my={1} fontWeight={"bold"}>
                Freeze Your Account
            </Text>
            <Text my={3}>
                You can unFreeze your account anytime by logging in.
            </Text>
            <Button size={"sm"} colorScheme='red' onClick={freezeAccount}>
                Freeze
            </Button>
        </>
    )
}

export default SettingsPage;