import { Box, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import PostPage from "./pages/PostPage"
import UserPage from "./pages/UserPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import CreatePost from "./components/CreatePost"
import ChatPage from "./pages/ChatPage"
import SettingsPage from "./pages/SettingsPage"
import Followers from "./components/Followers"
import Followings from "./components/Followings"
import TrendingPage from "./pages/TrendingPage"

function App() {
  const user = useRecoilValue(userAtom);
  console.log(user);
  const { pathname } = useLocation();
  return (
    <Box position={"relative"} w="full">

      <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
        <Header />
        <Routes>

          <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
          <Route path="/:username" element={user ?
            (
              <>
                <UserPage />
                <CreatePost />
              </>
            )
            : (<UserPage />)} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
          <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
          <Route path="/:username/followers" element={<Followers />} />
          <Route path="/:username/following" element={<Followings />} />
          <Route path="/trending" element={<TrendingPage />} />

        </Routes>

      </Container>
    </Box>
  )
}

export default App
