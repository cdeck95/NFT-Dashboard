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

export interface DialogProps {
  open: boolean;
  handleClose: () => void;
}

function MaticDialog(props: DialogProps) {
  const { open, handleClose } = props;
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

  
    function openCoinbase(): void {
        window.open("https://www.coinbase.com/price/polygon");
    }

    function bridgeETH(): void {
        window.open("https://wallet.polygon.technology/polygon/bridge/deposit");
    }

    function openDiscord(): void {
        window.open("https://discord.gg/fotf")
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
              <HighlightOffOutlinedIcon fontSize='medium' color='action' onClick={handleClose}  sx={{ ":hover": { cursor: "pointer", width: "25px", height: "25px" }}}/>
            </Box>
          
          </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", marginTop: "10px", paddingTop: "10px", paddingBottom: "10px", fontSize: "24px", fontFamily: "Helvetica Neue", wordBreak: "break-word", whiteSpace: "pre-wrap", display: "flex", justifyContent: "center", alignItems: "center"}} 
            id="alert-dialog-slide-description">
            It looks like you are low on MATIC. We suggest having at least $5
            of MATIC to be safe. Getting MATIC is relatively easy and you can
            bridge your current ETH up using the Polygon Wallet for the best
            pricing. Click "Bridge ETH &rarr; Matic" below to start.
            <br />
            <br />
            Adversely though, it does have gas fees associated with it. Our
            primary recommendation is to use a FIAT onramp. We recommend
            Coinbase & you can buy MATIC there on the Polygon Network and send
            it to your Polygon Wallet all for less $ than you'd pay in gas on
            the main bridge. Click "Buy on Coinbase" to get started.
            <br />
            <br />
            For anyone that is struggling, or needs some help, we're happy to
            handle the bridging for you. Simply open a ticket in the FOTF
            Discord and we'll walk you through the steps of sending us the ETH
            and we'll send you back some MATIC.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              fontFamily: "Bebas Neue",
              fontSize: "24px",
              marginBottom: "5px",
              backgroundColor: "purple",
              color: "white",
              border: "2px transparent",
              borderColor: "transparent",
              "&:hover": {
                backgroundColor: "white",
                color: "purple",
                borderColor: "purple",
                border: "2px solid",
              },
            }}
            onClick={() => bridgeETH()}
          >
            Bridge ETH &rarr; Matic
          </Button>

          <Button
            variant="contained"
            color="primary"
            sx={{
              fontFamily: "Bebas Neue",
              fontSize: "24px",
              marginBottom: "5px",
              backgroundColor: "Blue",
              color: "white",
              border: "2px transparent",
              borderColor: "transparent",
              "&:hover": {
                backgroundColor: "white",
                color: "Blue",
                borderColor: "Blue",
                border: "2px solid",
              },
            }}
            onClick={() => openCoinbase()}
          >
            Buy on Coinbase
          </Button>

          <Button
            variant="contained"
            color="primary"
            sx={{
              fontFamily: "Bebas Neue",
              fontSize: "24px",
              marginBottom: "5px",
            }}
            onClick={() => openDiscord()}
          >
            Go to FOTF Discord
          </Button>
        </DialogActions>
      </Dialog>
      </ThemeProvider>
    </Box>
  );
}

export default MaticDialog;