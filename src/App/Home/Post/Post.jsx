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
  const data = postData.data.crosspost_parent
    ? postData.data.crosspost_parent_list[0]
    : postData.data;

  const IsCrossPost = postData.data.crosspost_parent ? true : false;

  // useEffect(() => {
  //   if (postData.data.crosspost_parent) {
  //     console.log(data);
  //   }
  // }, []);

  const imgSrcSet =
    (data.post_hint === "image" || data.post_hint === "link") &&
    data.preview.images[0].resolutions.length > 0
      ? data.preview.images[0].resolutions
          .map((e) => {
            return `${e.url} ${e.width}w`;
          })
          .join(",")
      : `${data.thumbnail} ${data.thumbnail_width}w`;
  const bgImgUrl =
    (data.post_hint === "image" ||
      data.post_hint === "link" ||
      data.post_hint === "hosted:video") &&
    data.preview.images[0].resolutions.length > 0
      ? `url("${data.preview.images[0].resolutions[0].url}")`
      : `url("${data.thumbnail}")`;

  const galleryImgsSecSets =
    data.is_gallery &&
    Object.values(data.media_metadata).map((e) => {
      return e.p
        .map((e) => {
          return `${e.u} ${e.x}w`;
        })
        .join(",");
    });
  const galleryBgImgsUrls =
    data.is_gallery &&
    Object.values(data.media_metadata).map((e) => {
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
    data.score >= 1000 ? `${(data.score / 1000).toFixed(2)}k` : data.score;

  const comments_score =
    data.num_comments >= 1000
      ? `${(data.num_comments / 1000).toFixed(2)}k`
      : data.num_comments;

  const handelClick = (e) => {
    if (
      e.target.tagName !== "VIDEO" &&
      !e.nativeEvent.path.some(
        (e) => e.className == "arrow_buttons" || e.className == "volume"
      )
    ) {
      console.log(postData.data);
      // console.log(`https://www.troddit.com${data.permalink}`);
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
      fetch(`${data.url}/DASH_audio.mp4`).then((res) => {
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
      {IsCrossPost ? (
        <div className="crosspost_info">
          <div className="left">
            <div className="in_subreddit">
              <div className="text">
                <HiArrowPath /> crossposed in
              </div>
              <a href="#" className="subreddit">
                r/{postData.data.subreddit}
              </a>
            </div>
            <div className="by_author">
              <div className="text">by</div>
              <a href="#" className="author">
                u/{postData.data.author}
              </a>
            </div>
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
      ) : (
        ""
      )}
      <div className="meta_info">
        {/* {data.post_hint ? (
          <div className="hint">{data.post_hint}</div>
        ) : (
          ""
        )} */}
        <div className="left">
          <div className="in_subreddit">
            <div className="text">in</div>
            <a href="#" className="subreddit">
              r/{data.subreddit}
            </a>
          </div>
          <div className="by_author">
            <div className="text">by</div>
            <a href="#" className="author">
              u/{data.author}
            </a>
          </div>
        </div>
        <div className="right">
          <div className="time_passed">
            {/* <div className="icon">
              <HiOutlineClock />
            </div> */}
            <div className="text" title={Date(postData.data.created)}>
              {timeAgo(data.created)}
            </div>
          </div>
        </div>
      </div>

      {data.post_hint === "link" ? (
        <div className="link_block">
          <div className="image" style={{ backgroundImage: bgImgUrl }}>
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              title={data.url}
            >
              <img srcSet={imgSrcSet} alt="" />
            </a>
          </div>
          <div className="body">
            <div className="title">{data.title}</div>
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="link_text_wrapper"
              title={data.url}
            >
              <div className="link_icon">
                <FaExternalLinkAlt />
              </div>
              <div className="link_text">
                {/* {data.domain} */}
                {data.url}
              </div>
            </a>
          </div>
        </div>
      ) : (
        <div className="title">{data.title}</div>
      )}

      {data.post_hint === "image" ? (
        <div className="image" style={{ backgroundImage: bgImgUrl }}>
          <img srcSet={imgSrcSet} alt="" />
        </div>
      ) : (
        ""
      )}

      {data.post_hint === "hosted:video" || data.is_video ? (
        <div className="video" style={{ backgroundImage: bgImgUrl }}>
          <video ref={videoRef} controls>
            <source src={data.media.reddit_video.fallback_url} />
            <audio controls>
              <source src={`${data.url}/DASH_audio.mp4`} />
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

      {data.post_hint === "rich:video" ? (
        <div
          className="rich_video"
          dangerouslySetInnerHTML={{
            __html: data.media_embed.content,
          }}
        />
      ) : (
        ""
      )}

      {data.is_gallery ? (
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

      {data.selftext_html ? (
        <div
          className="self_text"
          dangerouslySetInnerHTML={{ __html: data.selftext_html }}
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
            <div className="text">{data.upvote_ratio * 100}%</div>
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
