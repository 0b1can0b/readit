import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BsCaretDownFill } from "react-icons/bs";

import SubPost from "./SubPost.jsx";

console.clear();

const sortList = [
  "Hot",
  "New",
  "Rising",
  "Top: Now",
  "Top: Today",
  "Top: Week",
  "Top: Month",
  "Top: Year",
  "Top: All Time",
];

const Subreddit = () => {
  const params = useParams();

  const [url, setUrl] = useState(
    `https://www.reddit.com/r/${params.sub}/.json?raw_json=1`
  );

  const [openSort, setOpenSort] = useState(false);
  const handelSortLabelClick = () => setOpenSort((e) => !e);
  let isHoveringOnSort = false;
  const handelSortMouseEnter = () => (isHoveringOnSort = true);
  const handelSortMouseLeave = () => {
    isHoveringOnSort = false;
    setTimeout(() => {
      if (!isHoveringOnSort) setOpenSort(false);
    }, 500);
  };

  const [sort, setSort] = useState("");
  const handelSortClick = (e) => {
    setOpenSort(false);
    setSort(e);
  };
  useEffect(() => {
    if (!sort || sort === "Hot") {
      setUrl(`https://www.reddit.com/r/${params.sub}/.json?raw_json=1`);
    } else if (sort === "New") {
      setUrl(`https://www.reddit.com/r/${params.sub}/new/.json?raw_json=1`);
    } else if (sort === "Rising") {
      setUrl(`https://www.reddit.com/r/${params.sub}/rising/.json?raw_json=1`);
    } else if (sort === "Top: Now") {
      setUrl(
        `https://www.reddit.com/r/${params.sub}/top/.json?t=hour&raw_json=1`
      );
    } else if (sort === "Top: Today") {
      setUrl(
        `https://www.reddit.com/r/${params.sub}/top/.json?t=day&raw_json=1`
      );
    } else if (sort === "Top: Week") {
      setUrl(
        `https://www.reddit.com/r/${params.sub}/top/.json?t=week&raw_json=1`
      );
    } else if (sort === "Top: Month") {
      setUrl(
        `https://www.reddit.com/r/${params.sub}/top/.json?t=month&raw_json=1`
      );
    } else if (sort === "Top: Year") {
      setUrl(
        `https://www.reddit.com/r/${params.sub}/top/.json?t=year&raw_json=1`
      );
    } else if (sort === "Top: All Time") {
      setUrl(
        `https://www.reddit.com/r/${params.sub}/top/.json?t=all&raw_json=1`
      );
    }
  }, [sort]);

  const [data, setData] = useState([]);
  const [after, setAfter] = useState(null);
  useEffect(() => {
    const fetchFunction = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json.data.children);
        setAfter(json.data.after);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFunction();
    return () => setData([]);
  }, [url]);

  const [IsLoadingMoreItems, setIsLoadingMoreItems] = useState(false);
  const fetchMoreItems = () => {
    fetch(`${url}&after=${after}`)
      .then((e) => e.json())
      .then((e) => {
        setAfter(e.data.after);
        e.data.children.forEach((newFetchedPost) => {
          setData((prev) => [...prev, newFetchedPost]);
        });
        setIsLoadingMoreItems(false);
      });
  };
  useEffect(() => {
    window.onscroll = () => {
      if (
        window.scrollY > 1000 &&
        window.innerHeight +
          window.scrollY -
          document.body.scrollHeight +
          1000 >=
          0 &&
        !IsLoadingMoreItems
      ) {
        setIsLoadingMoreItems(true);
      }
    };
  }, []);
  useEffect(() => {
    if (IsLoadingMoreItems) {
      fetchMoreItems();
    }
  }, [IsLoadingMoreItems]);

  useEffect(() => {
    document.body.onkeydown = (key) => {
      if (key.shiftKey || key.ctrlKey || key.altKey) return;
      if (key.key === "f") {
        key.preventDefault();
        const items = document.querySelectorAll(".post");
        if (items.length === 0) return;
        let itemTopOffsets = [];
        items.forEach((item) =>
          itemTopOffsets.push({
            item: item,
            top: item.getBoundingClientRect().top,
          })
        );
        const filteredItemsObj = itemTopOffsets.filter((obj) => obj.top > 20);
        if (!filteredItemsObj[0]) return;
        if (!filteredItemsObj[0].item) return;
        filteredItemsObj[0].item.scrollIntoView();
      }
      if (key.key === "r") {
        key.preventDefault();
        const items = document.querySelectorAll(".post");
        if (items.length === 0) return;
        let itemTopOffsets = [];
        items.forEach((item) =>
          itemTopOffsets.push({
            item: item,
            top: item.getBoundingClientRect().top,
          })
        );
        const filteredItemsObj = itemTopOffsets.filter((obj) => obj.top < -20);
        if (!filteredItemsObj[filteredItemsObj.length - 1]) return;
        if (!filteredItemsObj[filteredItemsObj.length - 1].item) return;
        filteredItemsObj[filteredItemsObj.length - 1].item.scrollIntoView();
      }
    };
  }, []);

  return (
    <div className="subreddit">
      <div className="header">
        <div className="sub-name">r/{params.sub}</div>
        <div
          className={openSort ? "sort open" : "sort"}
          onMouseEnter={handelSortMouseEnter}
          onMouseLeave={handelSortMouseLeave}
        >
          <div className="sort-label" onClick={handelSortLabelClick}>
            Sort <BsCaretDownFill />
          </div>
          <div className="sort-select">
            {sortList.map((e, i) => {
              return (
                <div
                  key={i}
                  className="sort-item"
                  onClick={() => handelSortClick(e)}
                >
                  {e}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {data.length > 0 ? (
        <div className="posts">
          {data.map((e, i) => {
            return <SubPost key={i} postData={e.data} />;
          })}
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default Subreddit;
