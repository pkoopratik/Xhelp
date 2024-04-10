import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error")
          return;
        }
        setUser(data);
        console.log(data);

      } catch (error) {
        showToast("Error", error, "error");
        console.log(error);
      }
    };
    getUser();
  }, [username, showToast]);

  if (!user)
    return null;

  return (
    <>
      <UserHeader user={user} />
      <UserPost likes={34} replies={443} postImg="/post1.png" postTitle="title 1" />
      <UserPost likes={134} replies={343} postImg="/post2.png" postTitle="title 2" />
      <UserPost likes={334} replies={43} postTitle=" blank posttitle 2" />


    </>
  )
}

export default UserPage;