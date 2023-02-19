import { memo, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import Button from "/src/App/Components/Button/Button";

import SubPost from "./SubPost";
import { FaLayerGroup } from "react-icons/fa";

// const htmlDecode = (content) => {
//   let e = document.createElement("div");
//   e.innerHTML = content;
//   return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
// };

const getRelativeFormattedTime = (time) => {
  time = Math.floor(new Date() / 1000 - time);
  if (time / 60 > 1) {
    if (time / (60 * 60) > 1) {
      if (time / (60 * 60 * 24) > 1) {
        if (time / (60 * 60 * 24 * 30.437) > 1) {
          if (time / (60 * 60 * 24 * 30.437 * 12) > 1) {
            return `${Math.floor(time / (60 * 60 * 24 * 30.437 * 12)).toFixed(
              0
            )} yr ago`;
          }
          return `${Math.floor(time / (60 * 60 * 24 * 30.437))}M`;
        }
        return `${Math.floor(time / (60 * 60 * 24))}d`;
      }
      return `${Math.floor(time / (60 * 60))}h`;
    }
    return `${Math.floor(time / 60)}m`;
  }
  return `${time}s`;
};

const Comments = () => {
  const params = useParams();

  const [data, setData] = useState([]);
  const [postData, setPostData] = useState();
  useEffect(() => {
    fetch(
      params.commentId
        ? `https://www.reddit.com/r/${params.sub}/comments/${params.id}/${params.rest}/${params.commentId}.json?raw_json=1&context=1`
        : `https://www.reddit.com/r/${params.sub}/comments/${params.id}/${params.rest}.json?raw_json=1`
    )
      .then((res) => res.json())
      .then((json) => {
        setData(json[1].data.children);
        setPostData(json[0].data.children[0].data);
      });

    return () => {
      setData([]);
      setPostData();
    };
  }, []);

  useEffect(() => {
    if (!params.commentId) return;
    if (data.length === 0) return;
    document.querySelectorAll(".comment-body")[0]?.scrollIntoView();
  }, [data]);

  useEffect(() => {
    document.body.onkeydown = (key) => {
      if (key.ctrlKey || key.altKey) return;
      if (!["f", "r", "F", "R"].some((e) => e === key.key)) return;

      key.preventDefault();
      let items;
      if (key.key === "f" || key.key === "r") {
        items = document.querySelectorAll(
          ".comment-body:not(.collapse .comment-body:not(.comments > .comment > .comment-body)), .comments-page > .post"
        );
      }
      if (key.key === "F" || key.key === "R") {
        items = document.querySelectorAll(
          ".comments > .comment > .comment-body, .comments-page > .post"
        );
      }
      if (items.length === 0) return;
      let itemTopOffsets = [];
      items.forEach((item) =>
        itemTopOffsets.push({
          item: item,
          top: item.getBoundingClientRect().top,
        })
      );
      let filteredItemsObj;
      if (key.key === "f" || key.key === "F") {
        filteredItemsObj = itemTopOffsets.filter((obj) => obj.top > 10);
      }
      if (key.key === "r" || key.key === "R") {
        filteredItemsObj = itemTopOffsets.filter((obj) => obj.top < -10);
      }
      if (!filteredItemsObj.at(0)) return;
      if (!filteredItemsObj.at(0).item) return;
      if (key.key === "f" || key.key === "F") {
        filteredItemsObj.at(0).item.scrollIntoView();
      }
      if (key.key === "r" || key.key === "R") {
        filteredItemsObj.at(-1).item.scrollIntoView();
      }
    };
  }, []);

  const Comment = memo(({ commentData }) => {
    if (!commentData) return;

    const [state, setState] = useState(false);
    useEffect(() => {
      const int = setInterval(() => setState((prev) => !prev), 5000);
      return () => clearInterval(int);
    }, []);

    const [flairImgs, setFlairImgs] = useState([]);
    const [flairText, setFlairText] = useState("");
    useEffect(() => {
      if (!commentData.data.author_flair_richtext) return;
      if (commentData.data.author_flair_richtext.length === 0) return;
      const arr = commentData.data.author_flair_richtext;

      arr.forEach((e) => {
        if (e.u) setFlairImgs((prev) => [...prev, e.u]);
      });
      setFlairText(arr[arr.length - 1].t);
    }, []);

    const [collapse, setCollapse] = useState(false);
    const handelClick = (e) => {
      if (collapse) setCollapse(false);
      if (!e.altKey) return;
      if (collapse) setCollapse(false);
      if (!collapse) setCollapse(true);
    };

    let time = 0;
    const handelMouseDown = (e) => {
      if (!e.ctrlKey) return;
      time = new Date() * 1;
    };
    const handelMouseUp = (e) => {
      if (!e.ctrlKey) return;
      if (new Date() * 1 - time > 100) return;
      window.open(
        `https://www.troddit.com${commentData.data.permalink}`,
        "_blank"
      );
    };

    const [iconImgUrl, setIconImgUrl] = useState("");
    useEffect(() => {
      if (commentData.data.author === "[deleted]") return;
      fetch(
        `https://www.reddit.com/user/${commentData.data.author}/about.json?raw_json=1`
      )
        .then((e) => e.json())
        .then((e) => {
          if (!e.data.subreddit) return;
          setIconImgUrl(e.data.subreddit.icon_img);
        });
      return () => setIconImgUrl("");
    }, []);

    const handelParentClick = (e) => {
      e.target.closest(".replies").previousSibling.scrollIntoView();
    };
    const handelParentMouseEnter = (e) => {
      const rect = e.target.getBoundingClientRect();
      const parentEle = e.target
        .closest(".replies")
        .previousSibling.cloneNode(true);
      const parentTooltip =
        e.target.querySelector(".parent-tooltip") ||
        e.target.closest(".parent").querySelector(".parent-tooltip");
      const parentElementRect = e.target
        .closest(".replies")
        .previousSibling.getBoundingClientRect();
      if (rect.top > parentElementRect.height + 24) {
        parentTooltip.classList.add("top");
      } else {
        parentTooltip.classList.add("bottom");
      }
      parentTooltip.append(parentEle);
    };
    const handelParentMouseLeave = (e) => {
      const parentTooltip =
        e.target.querySelector(".parent-tooltip") ||
        e.target.closest(".parent").querySelector(".parent-tooltip");
      parentTooltip.innerHTML = "";
      parentTooltip.classList.remove("top");
      parentTooltip.classList.remove("bottom");
    };

    const [moreReplies, setMoreReplies] = useState([]);
    const fetchMoreReplies = (e) => {
      e.forEach((e) => {
        fetch(
          `https://www.reddit.com/r/${params.sub}/comments/${params.id}/${params.rest}/${e}.json?raw_json=1`
        )
          .then((e) => e.json())
          .then((e) => {
            setMoreReplies((prev) => [...prev, e[1].data.children[0]]);
          });
      });
    };

    const handelContext = (e) => {
      let arr = [];

      const comment = e.target.closest(
        ".comment-body:not(.context-comments > .comment-body)"
      );
      if (!comment) return;

      arr.push(comment);

      const loopFun = (e) => {
        if (!e) {
          const popup = document.querySelector(".context-comments");
          arr.reverse().forEach((e) => {
            popup.append(e.cloneNode(true));
          });
          document.querySelector(".context-popup").classList.add("active");
          document.body.style.overflow = "hidden";

          const closePopupFunction = () => {
            document.body.style.overflow = "";
            popup.innerHTML = "";
            document.querySelector(".context-popup").classList.remove("active");
          };
          document.querySelector(".context-popup .close-popup").onclick = () =>
            closePopupFunction();
          document.onclick = (e) => {
            if (!e.target.classList.contains("context-popup")) return;
            closePopupFunction();
          };
        }
        if (!e) return;
        arr.push(e.previousSibling);
        loopFun(e.previousSibling.closest(".replies"));
      };
      loopFun(comment.closest(".replies"));
    };

    return (
      <div className={collapse ? "comment collapse" : "comment"}>
        <div
          className={
            commentData.data.id === params.commentId
              ? "comment-body highlight"
              : "comment-body"
          }
          onClick={handelClick}
          onMouseDown={handelMouseDown}
          onMouseUp={handelMouseUp}
        >
          <div className="comment-header">
            <div className="user">
              <div className="user-img">
                <img
                  src={iconImgUrl ? iconImgUrl : "/src/avatar_default_1.png"}
                  alt={iconImgUrl ? iconImgUrl : "/src/avatar_default_1.png"}
                />
              </div>
              <div className="user-name">{commentData.data.author}</div>
              {commentData.data.is_submitter ? (
                <div className="op">OP</div>
              ) : (
                ""
              )}
            </div>

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

            {commentData.data.parent_id.split("_").at(0) === "t1" ? (
              <div
                className="parent"
                onClick={handelParentClick}
                onMouseEnter={handelParentMouseEnter}
                onMouseLeave={handelParentMouseLeave}
              >
                <div className="parent-text">
                  {">>"} {commentData.data.parent_id.split("_")[1]}
                </div>
                <div className="parent-tooltip"></div>
              </div>
            ) : (
              ""
            )}

            {commentData.data.parent_id.split("_").at(0) === "t1" ? (
              <div className="context-button" onClick={handelContext}>
                {">>"} context
              </div>
            ) : (
              ""
            )}

            <div className="score">{commentData.data.score}</div>

            <a
              className="created"
              href={`${commentData.data.id}`}
              target="_blank"
            >
              {getRelativeFormattedTime(commentData.data.created)}
              {commentData.data.edited
                ? ` (${getRelativeFormattedTime(commentData.data.edited)})`
                : ""}
            </a>
          </div>

          <div
            className="comment-text"
            dangerouslySetInnerHTML={{
              __html: commentData.data.body_html,
            }}
          />
        </div>

        {commentData.data.replies ? (
          <div className="replies">
            {commentData.data.replies.data.children.map((e, i) => {
              if (e.kind === "more") {
                if (moreReplies.length > 0) return;
                return (
                  <div
                    key={i}
                    className="more-replies-button"
                    onClick={() => fetchMoreReplies(e.data.children)}
                  >
                    {e.data.children.length} more{" "}
                    {e.data.children.length === 1 ? "reply" : "replies"}
                  </div>
                );
              }
              return <Comment key={i} commentData={e} />;
            })}
            {moreReplies.length > 0
              ? moreReplies.map((e, i) => {
                  return <Comment key={i} commentData={e} />;
                })
              : ""}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  });

  return (
    <div className="comments-page">
      {postData ? <SubPost postData={postData} /> : ""}

      {data.length === 0 ? (
        ""
      ) : (
        <div className="comments">
          {data.map((e, i) => {
            return <Comment key={i} commentData={e} />;
          })}
        </div>
      )}

      {data.length === 0 ? (
        "Loading..."
      ) : (
        <div className="context-popup">
          <div className="context-popup-inner">
            <div className="close-popup">
              <IoClose />
            </div>
            <div className="context-comments"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
