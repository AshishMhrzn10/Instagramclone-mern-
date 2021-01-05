import React from "react";

const CreatePost = () => {
	return (
		<div
			className="card input-filed"
			style={{
				margin: "30px auto",
				maxWidth: "500px",
				padding: "20px",
				textAlign: "center",
			}}
		>
			<input type="text" placeholder="title" />
			<input type="text" placeholder="body" />
			<div className="file-field input-field">
				<div className="btn">
					<span>Choose an image</span>
					<input type="file" />
				</div>
				<div className="file-path-wrapper">
					<input className="file-path validate" type="text" />
				</div>
			</div>
			<button className="btn waves-effect waves-light #64b5f6 blue darken-1">
				Post
			</button>
		</div>
	);
};

export default CreatePost;
