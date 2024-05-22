import {
	Flex, Box, Text, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent,
	ModalFooter, ModalOverlay, ModalHeader, FormControl, Input, Button
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";

const Actions = ({ post }) => {

	const { isOpen, onOpen, onClose } = useDisclosure();
	const showToast = useShowToast();
	const user = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [isLiking, setIsLiking] = useState(false);
	const [reply, setReply] = useState("");
	const [liked, setLiked] = useState(post.likes.includes(user?._id));
	const [isReplying, setIsReplying] = useState(false);

	const handleLikeAndUnlike = async () => {

		if (!user) return showToast("Error", "You must be logged in to like the post", "error");
		if (isLiking)
			return;
		setIsLiking(true);
		try {
			const res = await fetch("/api/posts/like/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) return showToast("Error", data.error, "error");

			if (!liked) {

				const updatedPosts = posts.map((p) => {
					if (p._id === post._id) {
						return {
							...p, likes: [...p.likes, user._id]
						}
					}
					return p;
				})
				setPosts(updatedPosts);

			} else {
				const updatedPosts = posts.map((p) => {
					if (p._id === post._id) {
						return {
							...p, likes: p.likes.filter((id) => id !== user._id)
						}
					}
					return p;
				})
				setPosts(updatedPosts);
			}
			setLiked(!liked)
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsLiking(false);
		}

	}
	const handleReply = async () => {
		if (!user) return showToast("Error", "You must be logged in to like the post", "error");

		if (isReplying) return;
		setIsReplying(true);
		try {
			const res = await fetch("/api/posts/reply/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: reply })
			});
			const data = await res.json();
			if (data.error)
				return showToast("Error", data.error, "error");
			const updatedPosts = posts.map((p) => {
				if (p._id === post._id) {
					return { ...p, replies: [...p.replies, data] };
				}
				return p;
			});
			setPosts(updatedPosts);
			showToast("Success", "Reply posted successfully", "success")
			onClose();
			setReply("");

		} catch (error) {
			showToast("Error", error.message, "error");

		} finally {
			setIsReplying(false);
		}

	}
	return (
		<Flex flexDirection="column">
			<Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
				<svg
					aria-label='Upvote'
					color={liked ? "rgb(14, 217, 47)" : ""}
					fill={liked ? "rgb(14, 217, 47)" : "transparent"}
					height='21'
					role='img'
					viewBox='0 0 24 22'
					width='20'
					onClick={handleLikeAndUnlike}
				>
					<path stroke='currentColor'
						strokeWidth='5'
						d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
				</svg>

				<svg
					aria-label='Comment'
					color=''
					fill=''
					height='20'
					role='img'
					viewBox='0 0 24 24'
					width='20'
					onClick={onOpen}
				>
					<title>Comment</title>
					<path
						d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
						fill='none'
						stroke='currentColor'
						strokeLinejoin='round'
						strokeWidth='2'
					></path>
				</svg>

				<ShareSVG />
			</Flex>
			<Flex gap={2} alignItems={"center"}>
				<Text color={"gray.light"} fontSize={"sm"}>{post.likes.length + (liked ? 1 : 0)} upvotes</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
				<Text color={"gray.light"} fontSize={"sm"}>{post.replies.length} repies</Text>
			</Flex>

			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Input placeholder='Reply goes here'
								value={reply}
								onChange={(e) => setReply(e.target.value)} />
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' size={"sm"} mr={3}
							onClick={handleReply} isLoading={isReplying}>
							Reply
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>

	)
}

export default Actions;

const ShareSVG = () => {
	return (
		<svg
			aria-label='Share'
			color=''
			fill='rgb(243, 245, 247)'
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
		>
			<title>Share</title>
			<line
				fill='none'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
				x1='22'
				x2='9.218'
				y1='3'
				y2='10.083'
			></line>
			<polygon
				fill='none'
				points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
			></polygon>
		</svg>
	);
};