import { Flex, useColorMode, Link, Button } from '@chakra-ui/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from 'react-icons/fi';
import useLogout from '../hooks/useLogout';
import authScreenAtom from '../atoms/authAtom';
import { BsFillChatQuoteFill } from 'react-icons/bs';
import { MdOutlineSettings } from 'react-icons/md';

function Header() {

  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return <Flex justifyContent={"space-between"} mt={6} mb={12}>
    {user && (
      <Link as={RouterLink} to="/">
        <AiFillHome size={24} />
      </Link>
    )}
    {!user && (
      <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen('login')}>
        Login
      </Link>
    )}

    <Link as={RouterLink} to="/trending" >
      <svg
        cursor={"pointer"}
        aria-label='Trending'
        color='currentColour'
        fill=''
        height='30'
        role='img'
        viewBox='0 0 30 24'
        width='30'
      >
        <title>Trending</title>
        <path
          d="M21 7a.78.78 0 0 0 0-.21.64.64 0 0 0-.05-.17 1.1 1.1 0 0 0-.09-.14.75.75 0 0 0-.14-.17l-.12-.07a.69.69 0 0 0-.19-.1h-.2A.7.7 0 0 0 20 6h-5a1 1 0 0 0 0 2h2.83l-4 4.71-4.32-2.57a1 1 0 0 0-1.28.22l-5 6a1 1 0 0 0 .13 1.41A1 1 0 0 0 4 18a1 1 0 0 0 .77-.36l4.45-5.34 4.27 2.56a1 1 0 0 0 1.27-.21L19 9.7V12a1 1 0 0 0 2 0V7z"
          fill="rgb(14, 217, 47)"
          stroke="rgb(14, 217, 47)"
          strokeLinejoin='round'
          strokeWidth='3'
        ></path>
      </svg>
    </Link>

    {user && (
      <Flex alignItems={"center"} gap={4}>
        <Link as={RouterLink} to={`/${user.username}`}>
          <RxAvatar size={24} />
        </Link>
        <Link as={RouterLink} to={`/chat`}>
          <BsFillChatQuoteFill size={20} />
        </Link>
        <Link as={RouterLink} to={`/settings`}>
          <MdOutlineSettings size={20} />
        </Link>
        <Button size={"xs"} onClick={logout}>
          <FiLogOut size={20} /></Button>
      </Flex>
    )}

    {!user && (
      <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen('signup')}>
        Sign up
      </Link>
    )}

  </Flex>
}

export default Header