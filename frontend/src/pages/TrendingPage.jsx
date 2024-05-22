import { Spinner, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const TrendingPage = () => {

    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                const res = await fetch("/api/posts/trending");
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
            <Box>
                {loading && (
                    <Flex justify={"center"}>
                        <Spinner size="xl" />
                    </Flex>
                )}
                {posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                ))}
            </Box>
        </Flex>
    );
};
export default TrendingPage;