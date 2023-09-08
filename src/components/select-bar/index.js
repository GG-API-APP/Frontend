/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  SelectBarWrapper,
  ConversationCardWrapper,
  PaginationWrapper,
} from "./styles";
import axios from "axios";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Pagination, Tooltip } from "antd";
import fireIcon1 from "../../assets/icons/fire1.png";
import fireIcon2 from "../../assets/icons/fire2.png";
import fireIcon3 from "../../assets/icons/fire3.png";

export const SelectBar = ({
  selectedId,
  setSelectedId,
  selectedConversation,
  setSelectedConversation,
  sortingState,
  fetchApiToggler,
  loadingSelectState,
  setLoadingSelectState,
  loadingShowingState,
  setLoadingShowingState,
  setActiveScreen,
  darkModeSwitch,
}) => {
  const [conversationsList, setConversationsList] = useState([]);
  const [numberOfDbResults, setNumberOfDbResults] = useState(0);
  const [actualPage, setActualPage] = useState(0);

  const protocol = process.env.REACT_APP_PROTOCOL;
  const hostingUrl = process.env.REACT_APP_HOSTING_URL;

  const fetchApi = async (page, limit, sort_by, increasing) => {
    // setLoadingState(true);
    try {
      const fetchedData = await axios.get(
        `${protocol}://${hostingUrl}/conversations?page=${page}&limit=${limit}&sort_by=${sort_by}&increasing=${increasing}`
      );
      setNumberOfDbResults(fetchedData.data.count);
      if (sortingState === "date") {
        setConversationsList(
          fetchedData.data.conversations.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
          })
        );
      }
      if (sortingState === "number") {
        console.log(sortingState);
        setConversationsList(
          fetchedData.data.conversations.sort((a, b) => b.__v - a.__v)
        );
      }

      setLoadingSelectState(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApi(actualPage, 10, "date", false);
  }, [sortingState, fetchApiToggler]);

  return (
    <div>
      <SelectBarWrapper dark={darkModeSwitch}>
        {loadingSelectState ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Loader
              type="Oval"
              color="#00BFFF"
              height={100}
              width={100}
              timeout={10000} //3 secs
            />
          </div>
        ) : (
          <>
            {conversationsList.map((item) => (
              <ConversationCardWrapper
                key={item._id}
                onClick={() => {
                  setLoadingShowingState(true);
                  setActiveScreen("RIGHT");
                  setSelectedId({
                    id: item._id,
                    personOne: item.personOne,
                    personTwo: item.personTwo,
                    personOneDetails: item.personOneDetails,
                    personTwoDetails: item.personTwoDetails,
                  });
                }}
                cardColor={
                  darkModeSwitch
                    ? item._id === selectedId.id
                      ? "#3e84ff"
                      : "#001769"
                    : item._id === selectedId.id
                    ? "#1360e8"
                    : "#ecb800"
                }
                borderColor={
                  darkModeSwitch
                    ? item._id === selectedId.id
                      ? "yellow"
                      : "#001769"
                    : item._id === selectedId.id
                    ? "red"
                    : "#ecb800"
                }
              >
                <div className="tooltip">
                  <span
                    className="tooltiptext"
                    style={{
                      left: "-350px",
                      top: "70px",
                      height: "350px",
                      width: "350px",
                    }}
                  >
                    <img
                      src={`https://avatars.gg.pl/user,${item.personTwo}/s,500x500`}
                      alt={`${item.personTwo}'s avatar`}
                    />
                  </span>
                  <img
                    src={`http://avatars.gadu-gadu.pl/${item.personTwo}?default=http://avatars.gg.pl/default,100`}
                    alt="User avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://www.pathwaysvermont.org/wp-content/uploads/2017/03/avatar-placeholder-e1490629554738.png";
                    }}
                  />
                  {/* <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    {item.personTwoDetails[0] !== undefined &&
                    item.personTwoDetails[0].substring(5) !== "niepodano"
                      ? `${item.personTwoDetails[0].substring(5)}`
                      : ""}
                    {item.personTwoDetails[3] !== undefined &&
                    item.personTwoDetails[3].substring(5) !== "niepodano"
                      ? `${
                          item.personTwoDetails[3].substring(5) === "kobieta"
                            ? " K"
                            : " M"
                        }`
                      : ""}{" "}
                    {item.personTwoDetails[2] !== undefined &&
                    item.personTwoDetails[2].substring(13) !== "niepodano"
                      ? `${
                          " " +
                          2021 -
                          Number(item.personTwoDetails[2].substring(13))
                        }`
                      : ""}
                  </div>
                </div> */}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>{`Rozmowa ${
                    item.personOneDetails[0] &&
                    item.personOneDetails[0] !== "nick:niepodano"
                      ? `${item.personOneDetails[0].substring(5)} (${
                          item.personOne
                        })`
                      : item.personOne
                  } z ${
                    item.personTwoDetails[0] &&
                    item.personTwoDetails[0] !== "nick:niepodano"
                      ? `${item.personTwoDetails[0].substring(5)} (${
                          item.personTwo
                        })`
                      : item.personTwo
                  }`}</div>
                  <div
                    style={{ display: "flex", flexDirection: "row-reverse" }}
                  >
                    <div>{`Wymienili ${item.__v} wiadomości`}</div>
                    {item.hotPoints >= 10 ? (
                      <Tooltip title={`${item.hotPoints} hot points!`}>
                        <img
                          src={
                            item.hotPoints >= 10 && item.hotPoints < 50
                              ? fireIcon1
                              : item.hotPoints >= 50 && item.hotPoints < 100
                              ? fireIcon2
                              : item.hotPoints >= 100
                              ? fireIcon3
                              : undefined
                          }
                          alt="fire icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            marginLeft: "8px",
                          }}
                        />
                      </Tooltip>
                    ) : undefined}
                  </div>
                </div>

                <div className="tooltip">
                  <span
                    className="tooltiptext"
                    style={{
                      left: "70px",
                      top: "70px",
                      height: "350px",
                      width: "350px",
                    }}
                  >
                    <img
                      src={`https://avatars.gg.pl/user,${item.personOne}/s,500x500`}
                      alt={`${item.personOne}'s avatar`}
                    />
                  </span>
                  <img
                    src={`https://avatars.gg.pl/user,${item.personOne}/s,100x100`}
                    alt="User avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://www.pathwaysvermont.org/wp-content/uploads/2017/03/avatar-placeholder-e1490629554738.png";
                    }}
                  />
                </div>
              </ConversationCardWrapper>
            ))}
          </>
        )}
      </SelectBarWrapper>
      <PaginationWrapper>
        <Pagination
          defaultCurrent={1}
          total={numberOfDbResults}
          onChange={(e) => {
            setLoadingSelectState(true);
            setActualPage(e - 1);
            fetchApi(e - 1, 10, "date", false);
          }}
          showSizeChanger={false}
        />
      </PaginationWrapper>
    </div>
  );
};
