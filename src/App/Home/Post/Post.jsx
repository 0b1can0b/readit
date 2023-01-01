import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  HiArrowPath,
  HiOutlineArrowUp,
  // HiOutlineHeart,
  HiOutlineChatBubbleLeft,
  // HiOutlineClock,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiSpeakerWave,
  HiSpeakerXMark,
} from "react-icons/hi2";
import { SlSocialReddit } from "react-icons/sl";
import { FaExternalLinkAlt } from "react-icons/fa";
import timeAgo from "/src/utilities/timeAgo.js";

const Post = ({ postData, IsActivePost }) => {
  const crosspostData = postData.data.crosspost_parent
    ? postData.data.crosspost_parent_list[0]
    : "";

  // useEffect(() => {
  //   if (postData.data.crosspost_parent) {
  //     console.log(data);
  //   }
  // }, []);

  const imgSrcSet =
    (postData.data.post_hint === "image" ||
      postData.data.post_hint === "link") &&
    postData.data.preview.images[0].resolutions.length > 0
      ? postData.data.preview.images[0].resolutions
          .map((e) => {
            return `${e.url} ${e.width}w`;
          })
          .join(",")
      : `${postData.data.thumbnail} ${postData.data.thumbnail_width}w`;
  const bgImgUrl =
    (postData.data.post_hint === "image" ||
      postData.data.post_hint === "link" ||
      postData.data.post_hint === "hosted:video") &&
    postData.data.preview.images[0].resolutions.length > 0
      ? `url("${postData.data.preview.images[0].resolutions[0].url}")`
      : `url("${postData.data.thumbnail}")`;

  const galleryImgsSecSets =
    postData.data.is_gallery &&
    Object.values(postData.data.media_metadata).map((e) => {
      return e.p
        .map((e) => {
          return `${e.u} ${e.x}w`;
        })
        .join(",");
    });
  const galleryBgImgsUrls =
    postData.data.is_gallery &&
    Object.values(postData.data.media_metadata).map((e) => {
      return `url("${e.p[0].u}")`;
    });

  const [galleryActiveItem, setGalleryActiveItem] = useState(0);
  const handelGalleryPrev = () => {
    setGalleryActiveItem((prev) => {
      if (prev > 0) {
        return prev - 1;
      } else {
        return galleryImgsSecSets.length - 1;
      }
    });
  };
  const handelGalleryNext = () => {
    setGalleryActiveItem((prev) => {
      if (prev < galleryImgsSecSets.length - 1) {
        return prev + 1;
      } else {
        return 0;
      }
    });
  };

  const score =
    postData.data.score >= 1000
      ? `${(postData.data.score / 1000).toFixed(2)}k`
      : postData.data.score;
  const comments_score =
    postData.data.num_comments >= 1000
      ? `${(postData.data.num_comments / 1000).toFixed(2)}k`
      : postData.data.num_comments;

  const handelClick = (e) => {
    if (
      e.target.tagName !== "VIDEO" &&
      !e.nativeEvent.path.some(
        (e) => e.className == "arrow_buttons" || e.className == "volume"
      )
    ) {
      console.log(postData.data.data);
      // window.open(`${window.location.origin}${postData.data.permalink}`);
      // console.log(`https://www.troddit.com${postData.data.permalink}`);
    }
  };

  const videoRef = useRef(null);
  const [IsVideoMute, setIsVideoMute] = useState(true);
  const [IsAudioExist, setIsAudioExist] = useState(null);

  useEffect(() => {
    // let videos = document.querySelectorAll(".video video");
    // videos.forEach((video) => {
    //   const audio = video.querySelector("audio");
    //   if (audio) {
    //     setIsAudioExist(true);
    //     video.onplay = () => audio.play();
    //     video.onpause = () => audio.pause();
    //     video.onseeking = () => (audio.currentTime = video.currentTime);
    //   }
    // });

    const video = videoRef.current;
    if (video) {
      fetch(`${postData.data.url}/DASH_audio.mp4`).then((res) => {
        if (res.status === 403) {
          setIsAudioExist(false);
        } else if (res.status === 200) {
          setIsAudioExist(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (IsAudioExist) {
        const audio = video.querySelector("audio");
        video.onplay = () => console.log("video plyed");
        video.onplay = () => audio.play();
        video.onpause = () => audio.pause();
        video.onseeking = () => (audio.currentTime = video.currentTime);
      }
    }
  }, [IsAudioExist]);

  useEffect(() => {
    // let videos = document.querySelectorAll(".video video");
    // videos.forEach((video) => {
    //   const audio = video.querySelector("audio");
    //   if (audio) {
    //     audio.muted = true;
    //   }
    // });

    const video = videoRef.current;
    if (video) {
      if (IsAudioExist) {
        const audio = video.querySelector("audio");
        if (IsVideoMute) {
          audio.muted = true;
        } else {
          audio.muted = false;
        }
      }
    }
  }, [IsVideoMute]);

  return (
    <div
      className={IsActivePost ? "post active" : "post"}
      onClick={handelClick}
    >
      <div className="meta_info">
        {/* {postData.data.post_hint ? (
          <div className="hint">{postData.data.post_hint}</div>
        ) : (
          ""
        )} */}
        <div className="left">
          <div className="in_subreddit">
            <div className="text">in</div>
            <a
              href={`${window.location.origin}/r/${postData.data.subreddit}`}
              className="subreddit"
              target="_blank"
              rel="noreferrer"
            >
              r/{postData.data.subreddit}
            </a>
          </div>
          <div className="by_author">
            <div className="text">by</div>
            <a href="#" className="author">
              u/{postData.data.author}
            </a>
          </div>
          {crosspostData ? (
            <div className="crossposted">
              <div className="text">
                <HiArrowPath />
              </div>
              <div className="crosspost_subreddit">
                r/{crosspostData.subreddit}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="right">
          <div className="time_passed">
            {/* <div className="icon">
              <HiOutlineClock />
            </div> */}
            <div className="text" title={Date(postData.data.created)}>
              {timeAgo(postData.data.created)}
            </div>
          </div>
        </div>
      </div>

      {postData.data.post_hint === "link" ? (
        <div className="link_block">
          <div className="image" style={{ backgroundImage: bgImgUrl }}>
            <a
              href={postData.data.url}
              target="_blank"
              rel="noreferrer"
              title={postData.data.url}
            >
              <img srcSet={imgSrcSet} alt="" />
            </a>
          </div>
          <div className="body">
            <div className="title">{postData.data.title}</div>
            <a
              href={postData.data.url}
              target="_blank"
              rel="noreferrer"
              className="link_text_wrapper"
              title={postData.data.url}
            >
              <div className="link_icon">
                <FaExternalLinkAlt />
              </div>
              <div className="link_text">
                {/* {postData.data.domain} */}
                {postData.data.url}
              </div>
            </a>
          </div>
        </div>
      ) : (
        <div className="title">{postData.data.title}</div>
      )}

      {postData.data.post_hint === "image" ? (
        <div className="image" style={{ backgroundImage: bgImgUrl }}>
          <img srcSet={imgSrcSet} alt="" />
        </div>
      ) : (
        ""
      )}

      {postData.data.post_hint === "hosted:video" || postData.data.is_video ? (
        <div className="video" style={{ backgroundImage: bgImgUrl }}>
          <video ref={videoRef} controls>
            <source src={postData.data.media.reddit_video.fallback_url} />
            <audio controls>
              <source src={`${postData.data.url}/DASH_audio.mp4`} />
            </audio>
          </video>
          <div
            className={IsAudioExist ? "volume" : "volume no_audio"}
            onClick={() => {
              if (IsAudioExist) setIsVideoMute((prev) => !prev);
            }}
          >
            {IsVideoMute ? <HiSpeakerXMark /> : <HiSpeakerWave />}
          </div>
        </div>
      ) : (
        ""
      )}

      {postData.data.post_hint === "rich:video" ? (
        <div
          className="rich_video"
          dangerouslySetInnerHTML={{
            __html: postData.data.media_embed.content,
          }}
        />
      ) : (
        ""
      )}

      {postData.data.is_gallery ? (
        <div className="gallery">
          <div className="arrow_buttons">
            <div className="prev" onClick={handelGalleryPrev}>
              <HiOutlineChevronLeft />
            </div>
            <div className="next" onClick={handelGalleryNext}>
              <HiOutlineChevronRight />
            </div>
          </div>
          <div className="pagination">
            {galleryActiveItem + 1}/{galleryImgsSecSets.length}
          </div>
          <div className="imgs">
            {galleryImgsSecSets.map((e, i) => {
              return (
                <div
                  key={i}
                  className={galleryActiveItem == i ? "slide active" : "slide"}
                  style={{ backgroundImage: galleryBgImgsUrls[i] }}
                >
                  <img srcSet={e} alt="" />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}

      {postData.data.selftext_html ? (
        <div
          className="self_text"
          dangerouslySetInnerHTML={{ __html: postData.data.selftext_html }}
        />
      ) : (
        ""
      )}

      <div className="numbers_info">
        <div className="left">
          <div className="score">
            <div className="icon">
              <HiOutlineArrowUp />
            </div>
            <div className="text">{score}</div>
          </div>
          <div className="comments">
            <div className="icon">
              <HiOutlineChatBubbleLeft />
            </div>
            <div className="text">{comments_score}</div>
          </div>
        </div>
        <div className="right">
          <div className="ratio">
            {/* <div className="icon">
              <HiOutlineHeart />
            </div> */}
            <div className="text">{postData.data.upvote_ratio * 100}%</div>
          </div>
          <a
            href={`https://reddit.com${postData.data.permalink}`}
            target="_blank"
            rel="noreferrer"
          >
            <SlSocialReddit size="1.25rem" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Post;
