import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { logs } from "../../_mocks_/index";
import { Line } from "react-chartjs-2";

const useStyles = makeStyles(() =>
  createStyles({
    cardBox: {
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      padding: 20,
      borderRadius: 10,
      "& .MuiCardHeader-root": {
        padding: 0,
        "& .MuiAvatar-root": {
          fontSize: 28,
        },
        "& .MuiCardHeader-content": {
          "& .MuiCardHeader-title": {
            color: "#2c3e50",
            fontSize: 18,
            fontWeight: "bold",
          },
          "& .MuiCardHeader-subheader": {
            color: "#95a5a6",
          },
        },
      },
    },
    chart: {
      "& p": {
        textAlign: "center",
        fontSize: 12,
      },
    },
    impression: {
      color: "#e67e22",
      textAlign: "right",
      fontWeight: "bold",
      "& span": {
        color: "#bdc3c7",
        fontSize: 12,
        display: "block",
        textTransform: "capitalize",
        fontWeight: "normal",
      },
    },
    conversion: {
      color: "#2980b9",
      textAlign: "right",
      fontWeight: "bold",
      "& span": {
        color: "#bdc3c7",
        fontSize: 12,
        display: "block",
        textTransform: "capitalize",
        fontWeight: "normal",
      },
    },
    revenue: {
      textAlign: "right",
      color: "#42b874",
      fontWeight: "bold",
    },
  })
);

const CardUi = ({ data }) => {
  const [revenue, setRevenue] = useState();
  const [logsData, setLogsdata] = useState();
  const classes = useStyles();

  useEffect(() => {
    const assetsData = logs?.reduce(function (r, a) {
      r[a.user_id] = r[a.user_id] || [];
      r[a.user_id].push(a);
      return r;
    }, {});
    let revenueData = {};
    Object.values(assetsData)?.map((data) => {
      return data.forEach(function (d) {
        if (revenueData[d.user_id]?.revenue) {
          revenueData[d.user_id].revenue += d.revenue;
        } else {
          revenueData[d.user_id] = {
            ...revenueData[d.user_id],
            revenue: d.revenue,
          };
        }
        if (d.type === "impression") {
          if (revenueData[d.user_id]?.impression) {
            revenueData[d.user_id].impression += 1;
          } else {
            revenueData[d.user_id].impression = 1;
          }
        } else {
          if (revenueData[d.user_id]?.conversion) {
            let temp1 = [...revenueData[d.user_id]?.conversion, d];
            let temp = temp1?.sort((a, b) => {
              return new Date(a?.time).getTime() - new Date(b?.time).getTime();
            });

            revenueData[d.user_id].conversion = temp;
          } else {
            revenueData[d.user_id].conversion = [d];
          }
        }
      });
    });
    var obj2 = [];

    for (var prop in revenueData) {
      obj2.push({ id: prop, subData: revenueData[prop] });
    }
    setRevenue(obj2);
  }, []);

  useEffect(() => {
    const composed = data?.map((d) => {
      return {
        ...d,
        subData: revenue?.filter(({ id }) => d.fields?.Id === Number(id)),
      };
    });
    setLogsdata(composed);
  }, [revenue]);

  return (
    <Box py={5}>
      <Container>
        <Grid container spacing={4}>
          {logsData?.map((logsData) => {
            const labels =
              logsData?.subData?.length &&
              logsData?.subData[0]?.subData?.conversion?.map((data) => {
                return data?.time;
              });
            const date =
              logsData?.subData?.length &&
              new Date(logsData?.subData[0]?.subData?.conversion[0]?.time);
            const lastDate =
              logsData?.subData?.length &&
              new Date(
                logsData?.subData[0]?.subData?.conversion[
                  logsData?.subData[0]?.subData?.conversion?.length - 1
                ]?.time
              );
            return (
              <>
                <Grid item md={4}>
                  <Card className={classes.cardBox}>
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{ width: 70, height: 70 }}
                          alt={logsData?.fields?.Name}
                          src={
                            logsData?.fields?.avatar
                              ? logsData?.fields?.avatar
                              : logsData?.fields?.Name
                          }
                        />
                      }
                      title={logsData?.fields?.Name}
                      subheader={logsData?.fields?.occupation}
                    />
                    <Grid container spacing={4}>
                      <Grid item md={8}>
                        <div className={classes.chart}>
                          <Line
                            data={{
                              labels,
                              datasets: [
                                {
                                  label: "",
                                  data:
                                    logsData?.subData?.length &&
                                    logsData?.subData[0]?.subData?.conversion?.map(
                                      (data) => {
                                        return data?.revenue;
                                      }
                                    ),
                                  borderColor: "#000",
                                },
                              ],
                            }}
                            options={{
                              legend: false,
                              scales: {
                                xAxes: [
                                  {
                                    display: false,
                                  },
                                ],
                                yAxes: [
                                  {
                                    display: false,
                                  },
                                ],
                              },
                            }}
                            key="chart-1"
                          />
                          <Typography>
                            conversions {date?.getDate()}/{date?.getMonth() + 1}{" "}
                            - {lastDate?.getDate()}/{lastDate?.getMonth() + 1}{" "}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item md={4}>
                        <Typography className={classes.impression}>
                          {logsData?.subData?.length &&
                            logsData?.subData[0]?.subData?.impression}{" "}
                          <span>impression</span>
                        </Typography>
                        <Typography className={classes.conversion}>
                          {logsData?.subData?.length &&
                            logsData?.subData[0]?.subData?.conversion
                              ?.length}{" "}
                          <span>conversion</span>
                        </Typography>
                        <Typography className={classes.revenue}>
                          $
                          {logsData?.subData?.length &&
                            new Intl.NumberFormat().format(
                              logsData?.subData[0]?.subData?.revenue.toFixed(2)
                            )}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default CardUi;
