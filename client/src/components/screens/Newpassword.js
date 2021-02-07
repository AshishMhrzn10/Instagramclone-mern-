import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";

const NewPassword = () => {
	const history = useHistory();
	const [password, setPassword] = useState("");
	const { token } = useParams();
	console.log(token);

	const PostData = () => {
		fetch("/new-password", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				password,
				token,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					M.toast({ html: data.error, classes: "#c62828 red darken-3" });
				} else {
					M.toast({
						html: data.message,
						classes: "#43a047 green darken-1",
					});
					history.push("/signin");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="mycard">
			<div className="card auth-card input-field">
				<h2>Instagram</h2>
				<input
					type="password"
					placeholder="Enter new password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					className="btn waves-effect waves-light #64b5f6 blue darken-1"
					onClick={() => PostData()}
				>
					Update password
				</button>
			</div>
		</div>
	);
};

export default NewPassword;
