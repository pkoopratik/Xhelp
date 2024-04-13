import { Spinner, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
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
    }, [showToast])
    
    return (
        <>
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

        </>
    );

};
export default HomePage;