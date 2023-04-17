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

const SubPost = ({ postData, IsActivePost }) => {
  const crosspostData = postData.crosspost_parent
    ? postData.crosspost_parent_list[0]
    : "";

  // useEffect(() => {
  //   if (postData.crosspost_parent) {
  //     console.log(data);
  //   }
  // }, []);

  const imgSrcSet =
    (postData.post_hint === "image" || postData.post_hint === "link") &&
    postData.preview.images[0].resolutions.length > 0
      ? postData.preview.images[0].resolutions
          .map((e) => {
            return `${e.url} ${e.width}w`;
          })
          .join(",")
      : `${postData.thumbnail} ${postData.thumbnail_width}w`;
  const bgImgUrl =
    (postData.post_hint === "image" ||
      postData.post_hint === "link" ||
      postData.post_hint === "hosted:video") &&
    postData.preview.images[0].resolutions.length > 0
      ? `url("${postData.preview.images[0].resolutions[0].url}")`
      : `url("${postData.thumbnail}")`;

  const galleryImgsSecSets =
    postData.is_gallery &&
    postData.media_metadata &&
    Object.values(postData.media_metadata).map((e) => {
      return e.p
        .map((e) => {
          return `${e.u} ${e.x}w`;
        })
        .join(",");
    });
  const galleryBgImgsUrls =
    postData.is_gallery &&
    postData.media_metadata &&
    Object.values(postData.media_metadata).map((e) => {
      return `url("${e.p[0].u}")`;
    });

  const galleryCaptions =
    postData.is_gallery &&
    postData.media_metadata &&
    postData.gallery_data.items.map((e) => (e.caption ? e.caption : null));

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

  // const score =
  //   postData.score >= 1000
  //     ? `${Math.floor(postData.score / 1000)}k`
  //     : postData.score;
  // const comments_score =
  //   postData.num_comments >= 1000
  //     ? `${Math.floor(postData.num_comments / 1000)}k`
  //     : postData.num_comments;
  const score = postData.score;
  const comments_score = postData.num_comments;

  const handelClick = (e) => {
    if (e.target.tagName === "VIDEO") return;
    if (e.target.tagName === "A") return;
    if (e.target.closest("a")) return;
    if (e.target.className == "arrow_buttons") return;
    if (e.target.closest(".arrow_buttons")) return;
    if (e.target.className == "volume") return;
    if (e.target.closest(".volume")) return;

    if (window.location.href.includes("/comments/")) return;

    window.open(`${window.location.origin}${postData.permalink}`, "_blank");
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
      fetch(`${postData.url}/DASH_audio.mp4`).then((res) => {
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

  const [flairImgs, setFlairImgs] = useState([]);
  const [flairText, setFlairText] = useState("");
  useEffect(() => {
    if (!postData.author_flair_richtext) return;
    if (postData.author_flair_richtext.length === 0) return;
    const arr = postData.author_flair_richtext;

    arr.forEach((e) => {
      if (e.u) setFlairImgs((prev) => [...prev, e.u]);
    });
    setFlairText(arr[arr.length - 1].t);
  }, []);

  return (
    <div
      className={IsActivePost ? "post active" : "post"}
      onClick={handelClick}
    >
      <div className="meta_info">
        {/* {postData.post_hint ? (
          <div className="hint">{postData.post_hint}</div>
        ) : (
          ""
        )} */}
        <div className="left">
          <div className="in_subreddit">
            <div className="text">in</div>
            <a
              href={`${window.location.origin}/r/${postData.subreddit}`}
              className="subreddit"
              target="_blank"
              rel="noreferrer"
            >
              r/{postData.subreddit}
            </a>
          </div>

          <div className="by_author">
            <div className="text">by</div>
            <a href="#" className="author">
              u/{postData.author}
            </a>
            {flairText ? (
              <div className="flair">
                {flairImgs.length > 0 ? (
                  <div className="flair-imgs">
                    {flairImgs.map((e) => {
                      return <img src={e} alt={e} key={e} />;
                    })}
                  </div>
                ) : (
                  ""
                )}
                <div className="flair-text">{flairText}</div>
              </div>
            ) : (
              ""
            )}
          </div>

          {crosspostData ? (
            <a
              className="crossposted"
              href={`${window.location.origin}${crosspostData.permalink}`}
              target="_blank"
            >
              <div className="icon">
                <HiArrowPath />
                {/* <div className="text">crossposted from</div> */}
              </div>
              <div className="crosspost_subreddit">
                r/{crosspostData.subreddit}
              </div>
            </a>
          ) : (
            ""
          )}
        </div>
        <div className="right">
          <div className="time_passed">
            {/* <div className="icon">
              <HiOutlineClock />
            </div> */}
            <div className="text" title={new Date(postData.created)}>
              {timeAgo(postData.created)}
              {postData.edited ? `(${timeAgo(postData.edited)})` : ""}
            </div>
          </div>
        </div>
      </div>

      {postData.post_hint === "link" ? (
        <div className="link_block">
          <div className="image" style={{ backgroundImage: bgImgUrl }}>
            <a
              href={postData.url}
              target="_blank"
              rel="noreferrer"
              title={postData.url}
            >
              <img srcSet={imgSrcSet} alt="" />
            </a>
          </div>
          <div className="body">
            <div className="title">{postData.title}</div>
            <a
              href={postData.url}
              target="_blank"
              rel="noreferrer"
              className="link_text_wrapper"
              title={postData.url}
            >
              <div className="link_icon">
                <FaExternalLinkAlt />
              </div>
              <div className="link_text">
                {/* {postData.domain} */}
                {postData.url}
              </div>
            </a>
          </div>
        </div>
      ) : (
        <div className="title">{postData.title}</div>
      )}

      {postData.post_hint === "image" ? (
        <div className="image" style={{ backgroundImage: bgImgUrl }}>
          <img srcSet={imgSrcSet} alt="" />
        </div>
      ) : (
        ""
      )}

      {postData.post_hint === "hosted:video" || postData.is_video ? (
        <div className="video" style={{ backgroundImage: bgImgUrl }}>
          <video ref={videoRef} controls>
            <source src={postData.media.reddit_video.fallback_url} />
            <audio controls muted>
              <source src={`${postData.url}/DASH_audio.mp4`} />
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

      {postData.post_hint === "rich:video" ? (
        <div
          className="rich_video"
          dangerouslySetInnerHTML={{
            __html: postData.media_embed.content,
          }}
        />
      ) : (
        ""
      )}

      {postData.is_gallery && postData.media_metadata ? (
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
                  {galleryCaptions[i] ? (
                    <div className="caption">{galleryCaptions[i]}</div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}

      {postData.selftext_html ? (
        <div
          className="self_text"
          dangerouslySetInnerHTML={{ __html: postData.selftext_html }}
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
            <div className="text">{postData.upvote_ratio * 100}%</div>
          </div>
          <a
            href={`https://www.reddit.com${postData.permalink}`}
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

export default SubPost;
