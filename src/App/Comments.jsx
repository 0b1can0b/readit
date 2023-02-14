import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";

import Button from "/src/App/Components/Button/Button";

import SubPost from "./SubPost";

const htmlDecode = (content) => {
  let e = document.createElement("div");
  e.innerHTML = content;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
};

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
          return `${Math.floor(time / (60 * 60 * 24 * 30.437))} mon ago`;
        }
        return `${Math.floor(time / (60 * 60 * 24))} days ago`;
      }
      return `${Math.floor(time / (60 * 60))} hr ago`;
    }
    return `${Math.floor(time / 60)} min ago`;
  }
  return `${time} sec ago`;
};

const Comments = () => {
  const params = useParams();

  const [refresh, setRefresh] = useState(false);
  useEffect(() => window.scrollTo(0, 0), [refresh]);

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(
      params.commentId
        ? `https://www.reddit.com/r/${params.sub}/comments/${params.id}/${params.rest}/${params.commentId}.json?raw_json=1&context=20`
        : `https://www.reddit.com/r/${params.sub}/comments/${params.id}/${params.rest}.json?raw_json=1`
    )
      .then((res) => res.json())
      .then((json) => {
        setData(json[1].data.children);
      });

    return () => setData([]);
  }, [refresh]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    document.body.onkeydown = (key) => {
      if (key.shiftKey || key.ctrlKey || key.altKey) return;
      if (key.key === "f") {
        key.preventDefault();
        const items = document.querySelectorAll(".comment-body");
        if (items.length === 0) return;
        let itemTopOffsets = [];
        items.forEach((item) =>
          itemTopOffsets.push({
            item: item,
            top: item.getBoundingClientRect().top,
          })
        );
        const filteredItemsObj = itemTopOffsets.filter((obj) => obj.top > 10);
        if (!filteredItemsObj[0]) return;
        if (!filteredItemsObj[0].item) return;
        filteredItemsObj[0].item.scrollIntoView();
      }
      if (key.key === "r") {
        key.preventDefault();
        const items = document.querySelectorAll(".comment-body");
        if (items.length === 0) return;
        let itemTopOffsets = [];
        items.forEach((item) =>
          itemTopOffsets.push({
            item: item,
            top: item.getBoundingClientRect().top,
          })
        );
        const filteredItemsObj = itemTopOffsets.filter((obj) => obj.top < -10);
        if (!filteredItemsObj[filteredItemsObj.length - 1]) return;
        if (!filteredItemsObj[filteredItemsObj.length - 1].item) return;
        filteredItemsObj[filteredItemsObj.length - 1].item.scrollIntoView();
      }
    };
  }, []);

  const Comment = ({ commentData }) => {
    // if (commentData.data.replies) {
    //   console.log(commentData.data.replies.data.children);
    // }

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

    const handelClick = (e) => {
      if (!e.ctrlKey) return;
      window.open(
        `https://www.troddit.com${commentData.data.permalink}`,
        "_blank"
      );
    };

    const [iconImgUrl, setIconImgUrl] = useState("");
    useEffect(() => {
      fetch(`https://www.reddit.com/user/${commentData.data.author}/about.json`)
        .then((e) => e.json())
        .then((e) => setIconImgUrl(htmlDecode(e.data.subreddit.icon_img)));
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

    return (
      <div className="comment">
        <div className="comment-body" onClick={handelClick}>
          <div className="comment-header">
            <div className="user">
              <div className="user-img">
                <img src={iconImgUrl} alt={iconImgUrl} />
              </div>
              <div className="user-name">{commentData.data.author}</div>
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

            {commentData.data.depth ? (
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

            <a
              className="created"
              href={`${commentData.data.id}`}
              target="_blank"
            >
              {getRelativeFormattedTime(commentData.data.created)}
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
                return (
                  <a
                    className="more-replies-button"
                    href={`${commentData.data.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {e.data.children.length} more{" "}
                    {e.data.children.length === 1 ? "reply" : "replies"}
                  </a>
                );
              }
              return <Comment key={i} commentData={e} />;
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <div className="comments-page">
      {data.length === 0 ? (
        ""
      ) : (
        <div className="comments">
          {data.map((e, i) => {
            return <Comment key={i} commentData={e} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Comments;
