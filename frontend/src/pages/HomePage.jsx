import { Spinner, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    useEffect(() => {
        const getFeedPosts = async () => {

            setLoading(true);
            setPosts([]);

            try {
                const res = await fetch("/api/posts/feed");
                const data = await res.json();
                if (data.error) {
                    showToast("error", data.error, "error");
                    return;
                }
                setPosts(data)

            } catch (error) {
                showToast("error", error, "error");

            } finally {
                setLoading(false);
            }
        }
        getFeedPosts();
    }, [showToast, setPosts])

    return (
        <Flex gap="10" alignItems={"flex-start"}>
            <Box flex={70}>
                {!loading && posts.length === 0 &&
                    <h1>Follow someone to see the feed</h1>}

                {loading && (
                    <Flex justify={"center"}>
                        <Spinner size="xl" />

                    </Flex>
                )}
                {posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                ))}

            </Box>
            <Box flex={30}
                display={{
                    base: "none",
                    md: "block"
                }}>
                <SuggestedUsers />
            </Box>
        </Flex>
    );

};
export default HomePage;