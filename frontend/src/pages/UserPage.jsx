import  UserHeader  from "../components/UserHeader"
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
        <UserHeader/>
        <UserPost likes={34} replies={443} postImg="/post1.png" postTitle="title 1"/>
        <UserPost likes={134} replies={343} postImg="/post2.png" postTitle="title 2"/>
        <UserPost likes={334} replies={43}  postTitle=" blank posttitle 2"/>


    </>
  )
}

export default UserPage;