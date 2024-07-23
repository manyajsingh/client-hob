import React, { useState, useEffect } from "react";
import TweetBox from 'client/src/utils/TweetBox.js';
import Post from "./src/utils/Post";
import "./src/utils/Feed.css";
import FlipMove from "react-flip-move";
import { address } from './src/utils/config'; // Ensure this path is correct
import { ethers } from 'ethers';
import Blog from './src/utils/Blog.json';

function Feed({ personal }) {
  const [posts, setPosts] = useState([]);

  const getUpdatedTweets = (allTweets, address) => {
    let updatedTweets = [];
    // Here we set a personal flag around the tweets
    for (let i = 0; i < allTweets.length; i++) {
      let tweet = {
        id: allTweets[i].id,
        tweetText: allTweets[i].tweetText,
        isDeleted: allTweets[i].isDeleted,
        username: allTweets[i].username,
        personal: allTweets[i].username.toLowerCase() === address.toLowerCase(),
      };
      updatedTweets.push(tweet);
    }
    return updatedTweets;
  };

  const getAllTweets = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const Blog2 = new ethers.Contract(address, Blog.abi, signer);

        let allTweets = await Blog2.getAllTweets();
        setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTweets();
  }, []);

  const deleteTweet = (key) => async () => {
    console.log(key);

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const Blog2 = new ethers.Contract(address, Blog.abi, signer);

        await Blog2.deleteTweet(key, true);
        let allTweets = await Blog2.getAllTweets();
        setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>

      <TweetBox />

      <FlipMove>
        {posts.map((post) => (
          <Post
            key={post.id}
            displayName={post.username}
            text={post.tweetText}
            personal={post.personal}
            onClick={deleteTweet(post.id)}
          />
        ))}
      </FlipMove>
    </div>
  );
}

export default Feed;