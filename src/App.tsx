import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";
import EditablePage from "components/editable-page";

const useStyles = makeStyles((theme: Theme) => ({
  app: {
    height: "100%",
    width: "100%",
    maxWidth: "1080px",
    margin: "0 auto",
    padding: "20px 0",
  },
}));

const App: React.FC<any> = () => {
  const classes = useStyles();
  return (
    <Box className={classes.app}>
      <EditablePage blocks={[]} />
    </Box>
  );
};

export default App;
