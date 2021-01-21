import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const UserProfile = () => {
	const [userProfile, setProfile] = useState(null);
	const { state, dispatch } = useContext(UserContext);
	const { userid } = useParams();

	useEffect(() => {
		fetch(`/user/${userid}`, {
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				setProfile(result);
			});
	}, []);

	return (
		<>
			{userProfile ? (
				<div style={{ maxWidth: "550px", margin: "0px auto" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-around",
							margin: "18px 0px",
							borderBottom: "1px solid grey",
						}}
					>
						<div>
							<img
								style={{
									width: "160px",
									height: "160px",
									borderRadius: "80px",
								}}
								src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8dXNlciUyMGljb258ZW58MHwyfDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
								alt=""
							/>
						</div>
						<div>
							<h4>{userProfile.user.name}</h4>
							<h5>{userProfile.user.email}</h5>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "108%",
								}}
							>
								<h6>{userProfile.posts.length} posts</h6>
								<h6>40 followers</h6>
								<h6>40 following</h6>
							</div>
						</div>
					</div>

					<div className="gallery">
						{userProfile.posts.map((item) => {
							return (
								<img
									key={item._id}
									className="item"
									src={item.photo}
									alt={item.title}
								/>
							);
						})}
					</div>
				</div>
			) : (
				<h2>loading...</h2>
			)}
		</>
	);
};

export default UserProfile;
