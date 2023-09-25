import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, IconButton, ThemeProvider, createTheme, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import '../styles/battle.css';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary-color");
  const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color");
  const sidebarBackgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-background-color");
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent-color");
  const errorColor = getComputedStyle(document.documentElement).getPropertyValue("--error-color");

function PaperComponent(props: PaperProps) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

export interface LoseProgressDialogProps {
  open: boolean;
  handleClose: () => void;
  setLoseProgressOpen: (value: boolean) => void;
}

function LoseProgressDialog(props: LoseProgressDialogProps) {
  const { open, handleClose, setLoseProgressOpen } = props;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const themeMui = useTheme();
  const fullScreen = useMediaQuery(themeMui.breakpoints.down('md'));

  const sidebarBackgroundColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--sidebar-background-color");

  const theme = createTheme({
    typography: {
      fontFamily: ["Bebas Neue", "Roboto", "Helvetica", "Arial"].join(","),
      fontSize: 16,
      fontWeightLight: 300,
    },
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: sidebarBackgroundColor,
            overflow: "unset",
            borderRadius:"20px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: sidebarBackgroundColor,
            paddingLeft: "0px !important",
            paddingRight: "0px !important",
            // overflowX: "hidden",
            // overflowY: "hidden",
            // "&:hover": {
            //   overflowY: "auto",
            // },
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        },
      },
    },
  });


    function continueSimulation(): void {
        setLoseProgressOpen(false);
    }

  return (
    <Box sx={{ borderRadius: "20px" }}>
      <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullScreen={fullScreen}
        PaperComponent={PaperComponent}
        aria-describedby="alert-dialog-slide-description"
        sx={{ borderRadius: "20px" }}
      >
        <DialogTitle sx={{
            backgroundColor: "transparent", 
            color: "white", 
            margin: "0px",
            borderRadius:"20px",
            position: "relative",
            borderTopColor: accentColor,
            borderTopWidth: "3.5px",
            borderTopStyle: "solid",
            minWidth: "400px",
            maxWidth: "810px"
          }}>
            <Box sx={{backgroundColor: accentColor, borderRadius: "40px", height: "60px", width: "60px", marginTop: "-40px", display: "flex", marginLeft: "auto", marginRight: "auto", justifyContent: "center"}}>
              {/* <CircularProgress color="inherit" sx={{ margin: "auto", justifyContent: "center", alignItems: "center"}} /> */}
              <PriorityHighOutlinedIcon fontSize='large' color='inherit' sx={{ margin: "auto", justifyContent: "center", alignItems: "center"}}/>
            </Box>
            <Box sx={{position: "absolute", right: "10px", top: "10px" }}>
              <HighlightOffOutlinedIcon fontSize='medium' color='action' onClick={() => setLoseProgressOpen(false)}  sx={{ ":hover": { cursor: "pointer", width: "25px", height: "25px" }}}/>
            </Box>
          
          </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", marginTop: "10px", paddingTop: "10px", paddingBottom: "10px", fontSize: "24px", fontFamily: 'Press Start 2P, cursive', wordBreak: "break-word", whiteSpace: "pre-wrap", display: "flex", justifyContent: "center", alignItems: "center"}} 
            id="alert-dialog-slide-description">
            By ending the simulation, you will forfeit your stamina & level progress and be re-directed back to the campaings screen. 
            You will not be charged with a loss. Do you wish to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          

          <button
            className={"green-button-secondary"}
            onClick={() => handleClose()}
          >
            Back to Campaigns
          </button>

          <button
            className="green-button"
            onClick={() => continueSimulation()}
          >
            Continue Simulation
          </button>
        </DialogActions>
      </Dialog>
      </ThemeProvider>
    </Box>
  );
}

export default LoseProgressDialog;