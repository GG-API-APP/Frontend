/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Switch } from "antd";

import { SelectBar } from "../../components/select-bar";
import { ShowingBar } from "../../components/showing-bar";
import { MainPageWrapper, HeaderWrapper } from "./styles";
import socketIOClient from "socket.io-client";
import { useSwipeable } from "react-swipeable";
import { useMediaQuery } from "react-responsive";

export const MainPage = () => {
  const [selectedConversation, setSelectedConversation] = useState([]);
  const [selectedId, setSelectedId] = useState({
    id: "",
    personOne: 0,
    personTwo: 0,
    personOneDetails: [],
    personTwoDetails: [],
  });
  const [sortingState] = useState("date");
  const [fetchApiToggler, setFetchApiToggler] = useState(false);
  const [loadingSelectState, setLoadingSelectState] = useState(true);
  const [loadingShowingState, setLoadingShowingState] = useState(false);
  const [validationSwitch, setValidationSwitch] = useState(true);
  const [activeScreen, setActiveScreen] = useState("LEFT");

  const protocol = process.env.REACT_APP_PROTOCOL;
  const hostingUrl = process.env.REACT_APP_HOSTING_URL;

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => isTabletOrMobile && setActiveScreen("RIGHT"),
    onSwipedRight: (eventData) => isTabletOrMobile && setActiveScreen("LEFT"),
  });

  useEffect(() => {
    const socket = socketIOClient(`${protocol}://${hostingUrl}`);
    socket.on("FromAPI", (data) => {
      setFetchApiToggler((prev) => !prev);
    });
    return () => socket.disconnect();
  }, [protocol, hostingUrl]);

  return (
    <>
      <MainPageWrapper {...handlers}>
        <HeaderWrapper>
          <div
            style={{
              display: "flex",
            }}
          >
            <div style={{ paddingRight: "10px" }}>Alternatywne wiadomości</div>
            <Switch
              checked={validationSwitch}
              onChange={() => setValidationSwitch((prev) => !prev)}
            />
          </div>
          <>
            {/* <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginRight: "5px",
              }}
            >
              Sortuj po
            </div>
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginLeft: "5px",
              }}
            >
              <Select
                defaultValue="date"
                style={{ width: 220 }}
                onChange={handleChange}
              >
                <Option value="date">dacie ostatniej wiadomości</Option>
                <Option value="number">liczbie wiadomości</Option>
              </Select>
            </div> */}
          </>
        </HeaderWrapper>
        <div style={{ display: "flex" }}>
          {(!isTabletOrMobile ||
            (isTabletOrMobile && activeScreen === "LEFT")) && (
            <SelectBar
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              sortingState={sortingState}
              fetchApiToggler={fetchApiToggler}
              loadingSelectState={loadingSelectState}
              setLoadingSelectState={setLoadingSelectState}
              loadingShowingState={loadingShowingState}
              setLoadingShowingState={setLoadingShowingState}
              setActiveScreen={setActiveScreen}
            />
          )}
          {(!isTabletOrMobile ||
            (isTabletOrMobile && activeScreen === "RIGHT")) && (
            <ShowingBar
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              fetchApiToggler={fetchApiToggler}
              loadingSelectState={loadingSelectState}
              setLoadingSelectState={setLoadingSelectState}
              loadingShowingState={loadingShowingState}
              setLoadingShowingState={setLoadingShowingState}
              validationSwitch={validationSwitch}
            />
          )}
        </div>
      </MainPageWrapper>
    </>
  );
};
