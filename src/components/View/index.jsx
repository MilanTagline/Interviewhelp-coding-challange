import axios from "axios";
import React, { useEffect, useState } from "react";
import CardUi from "./Card";
import CircularProgress from "@mui/material/CircularProgress";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    loader: {
      position: "fixed",
      right: 0,
      top: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

const View = () => {
  const [loading, isLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const classes = useStyles();

  const getUsers = async () => {
    try {
      isLoading(true);
      const res = await axios.get(
        "https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?maxRecords=300&view=Grid%20view",
        {
          headers: { Authorization: "Bearer key4v56MUqVr9sNJv" },
        }
      );
      if (res) {
        isLoading(false);
        setUserData(res?.data);
      }
    } catch (error) {
      isLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <>
      {loading ? (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <CardUi data={userData?.records} />
        </div>
      )}
    </>
  );
};

export default View;
